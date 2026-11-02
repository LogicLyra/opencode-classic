import { describe, expect, test } from "bun:test"
import { createHash } from "node:crypto"
import {
  checksumMatches,
  createReleaseClient,
  downloadBase,
  migrationAsset,
  targetAsset,
  validateProductionRelease,
  type Request,
} from "."

const release = (version: string, extra = {}) => ({
  tag_name: `v${version}`,
  draft: false,
  prerelease: false,
  assets: [
    "install",
    "SHA256SUMS",
    migrationAsset,
    "latest-linux.yml",
    targetAsset("desktop-linux-x64-deb"),
    targetAsset("cli-linux-x64-baseline"),
  ].map((name) => ({ name })),
  ...extra,
})
const manifest = (extra = {}) =>
  JSON.stringify({
    schemaVersion: 1,
    version: "2.2.5",
    migrationReady: true,
    sourceMajor: 1,
    minimumVersion: "1.20.0",
    supportedUpgradeTargets: ["desktop-linux-x64-deb", "cli-linux-x64-baseline"],
    freshInstallReady: true,
    supportedFreshInstallTargets: ["desktop-linux-x64-deb", "cli-linux-x64-baseline"],
    ...extra,
  })
const sum = (body: string, name = migrationAsset) => `${createHash("sha256").update(body).digest("hex")}  ${name}\n`

function fixture(input: { releases?: unknown[]; marker?: string; sums?: string; status?: number }) {
  const calls: string[] = []
  const get: Request = async (url) => {
    calls.push(url)
    if (url.includes("/releases?"))
      return {
        status: input.status ?? 200,
        body: JSON.stringify(input.releases ?? [release("2.2.5"), release("1.19.5")]),
      }
    if (url.endsWith(`/${migrationAsset}`))
      return { status: input.marker === undefined ? 404 : 200, body: input.marker ?? "" }
    if (url.endsWith("/SHA256SUMS")) return { status: 200, body: input.sums ?? sum(input.marker!) }
    throw new Error(`Unexpected request: ${url}`)
  }
  return { client: createReleaseClient(get), calls }
}

describe("Classic release coexistence", () => {
  test.each([
    { marker: {}, accepted: true },
    { marker: { minimumVersion: "1.19.5" }, accepted: false },
    { marker: { minimumVersion: "1.20.1" }, accepted: false },
    { marker: { migrationReady: false }, accepted: false },
    { marker: { freshInstallReady: false }, accepted: false },
    { marker: { supportedUpgradeTargets: [] }, accepted: false },
    { marker: { supportedFreshInstallTargets: [] }, accepted: false },
    { marker: { supportedFreshInstallTargets: ["desktop-linux-x64-deb"] }, accepted: false },
  ])("publisher verifies real bridge/readiness/target contracts: %j", (input) => {
    const body = manifest(input.marker)
    const validate = () =>
      validateProductionRelease({
        version: "2.2.5",
        sourceManifest: body,
        uploadedManifest: body,
        publishedVersions: ["1.19.5", "1.20.0"],
        assets: release("2.2.5").assets.map((asset) => asset.name),
      })
    if (input.accepted) expect(validate().minimumVersion).toBe("1.20.0")
    else expect(validate).toThrow()
  })

  test("publisher rejects altered uploaded metadata and unsupported advertised payloads", () => {
    const input = {
      version: "2.2.5",
      sourceManifest: manifest(),
      uploadedManifest: manifest(),
      publishedVersions: ["1.20.0"],
      assets: release("2.2.5").assets.map((asset) => asset.name),
    }
    expect(() => validateProductionRelease({ ...input, uploadedManifest: `${input.uploadedManifest}\n` })).toThrow(
      "approved source",
    )
    expect(() =>
      validateProductionRelease({ ...input, assets: input.assets.filter((name) => !name.endsWith(".deb")) }),
    ).toThrow("missing assets")
  })
  test.each([
    { current: "1.19.3", marker: undefined, expected: "1.19.5" },
    { current: "1.19.5", marker: manifest(), expected: "1.19.5" },
    { current: "1.20.0", marker: manifest(), expected: "1.20.0" },
    { current: "1.19.3", marker: "invalid json", expected: "1.19.5" },
    { current: "2.2.6", marker: manifest(), expected: "2.2.6" },
    { current: "local", marker: manifest(), expected: "local" },
  ])("ordinary update $current -> $expected", async (input) => {
    const app = fixture(input)
    expect(await app.client.update(input.current)).toBe(input.expected)
    expect(app.calls.every((url) => url.includes("/releases?"))).toBe(true)
    expect(
      app.calls.every(
        (url) =>
          url.startsWith("https://api.github.com/repos/LogicLyra/opencode-classic/") ||
          url.startsWith(downloadBase("2.2.5")),
      ),
    ).toBe(true)
  })

  test("ignores drafts, prereleases, future-major jumps and release-list ordering", async () => {
    const app = fixture({
      releases: [
        release("1.19.4"),
        release("3.0.0"),
        release("2.2.5", { draft: true }),
        release("1.19.99", { prerelease: true }),
        release("1.19.5"),
      ],
    })
    expect(await app.client.update("1.19.3")).toBe("1.19.5")
  })

  test("continues through pagination rather than losing old v1 releases", async () => {
    const calls: string[] = []
    const client = createReleaseClient(async (url) => {
      calls.push(url)
      return {
        status: 200,
        body: JSON.stringify(
          url.endsWith("page=1") ? Array.from({ length: 100 }, () => release("2.2.5")) : [release("1.19.5")],
        ),
      }
    })
    expect(await client.update("1.19.3")).toBe("1.19.5")
    expect(calls).toHaveLength(2)
  })

  test.each(["{}", "not json", manifest({ version: "2.2.4" }), manifest({ schemaVersion: 2 })])(
    "rejects malformed or mismatched manifests: %s",
    async (marker) => {
      await expect(fixture({ marker }).client.migrationOffer("1.20.0", "desktop-linux-x64-deb")).rejects.toThrow()
    },
  )

  test("a corrupt migration marker never enables a major update", async () => {
    const app = fixture({ marker: manifest(), sums: `${"0".repeat(64)}  ${migrationAsset}\n` })
    await expect(app.client.migrationOffer("1.20.0", "desktop-linux-x64-deb")).rejects.toThrow(
      "checksum verification failed",
    )
  })

  test("network failures are not reported as up to date", async () => {
    await expect(fixture({ status: 403 }).client.update("1.19.5")).rejects.toThrow("HTTP 403")
  })

  test("installer and checksum are fetched from the same immutable target", async () => {
    const calls: string[] = []
    const client = createReleaseClient(async (url) => {
      calls.push(url)
      return { status: 200, body: url.endsWith("/install") ? "installer" : sum("installer", "install") }
    })
    expect(await client.verifiedAsset("2.2.5", "install")).toBe("installer")
    expect(calls).toEqual([`${downloadBase("2.2.5")}install`, `${downloadBase("2.2.5")}SHA256SUMS`])
  })

  test("checksum matching rejects missing, ambiguous and modified assets", () => {
    expect(checksumMatches(sum("body", "install"), "install", "body")).toBe(true)
    expect(checksumMatches(sum("body", "install"), "install", "changed")).toBe(false)
    expect(checksumMatches(sum("body"), "install", "body")).toBe(false)
    expect(checksumMatches(sum("body", "install").repeat(2), "install", "body")).toBe(false)
  })

  test.each([
    { current: "1.20.0", marker: manifest(), offered: true },
    { current: "1.19.5", marker: manifest(), offered: false },
    { current: "1.20.0", marker: undefined, offered: false },
    { current: "1.20.0", marker: manifest({ migrationReady: false }), offered: false },
    { current: "1.20.0", marker: manifest({ minimumVersion: "1.19.5" }), offered: false },
    { current: "1.20.0", marker: manifest({ sourceMajor: 2 }), offered: false },
    { current: "1.20.0", marker: manifest({ minimumVersion: "2.0.0" }), offered: false },
    { current: "1.20.0", marker: manifest({ supportedUpgradeTargets: undefined }), offered: false },
    { current: "1.20.0", marker: manifest({ supportedUpgradeTargets: ["desktop-linux-x64-rpm"] }), offered: false },
    { current: "local", marker: manifest(), offered: false },
  ])("explicit offer: $current, eligible=$offered", async (input) => {
    const result = await fixture(input).client.migrationOffer(input.current, "desktop-linux-x64-deb")
    expect(result?.version).toBe(input.offered ? "2.2.5" : undefined)
  })

  test.each(["valid", "malformed", "missing", "corrupt"])(
    "maintenance and migration are independent: %s",
    async (mode) => {
      const app = fixture({
        releases: [release("2.2.5"), release("1.20.1")],
        marker: mode === "missing" ? undefined : mode === "malformed" ? "{}" : manifest(),
        ...(mode === "corrupt" ? { sums: sum("wrong body") } : {}),
      })
      const result = await app.client.discover("1.20.0", "desktop-linux-x64-deb")
      expect(result.maintenance).toBe("1.20.1")
      expect(result.migration.status).toBe(mode === "valid" ? "offered" : mode === "missing" ? "unavailable" : "error")
      expect(app.calls.filter((url) => url.includes("/releases?"))).toHaveLength(1)
      expect(app.calls.some((url) => url.endsWith("/install"))).toBe(false)
    },
  )

  test("supported targets still require their actual release assets", async () => {
    const app = fixture({ marker: manifest(), releases: [release("2.2.5", { assets: [] })] })
    expect(await app.client.migrationOffer("1.20.0", "desktop-linux-x64-deb")).toBeUndefined()
    expect(await app.client.freshInstall(2, "desktop-linux-x64-deb")).toBeUndefined()
  })

  test("revalidating an exact offer never substitutes another release", async () => {
    const app = fixture({ marker: manifest() })
    expect(await app.client.migrationOffer("1.20.0", "desktop-linux-x64-deb", "2.2.4")).toBeUndefined()
    expect(app.calls.some((url) => url.includes("/download/"))).toBe(false)
  })

  test.each([
    { major: 1 as const, marker: undefined, expected: "1.19.5" },
    { major: 2 as const, marker: manifest(), expected: "2.2.5" },
    { major: 2 as const, marker: manifest({ freshInstallReady: false }), expected: undefined },
    { major: 2 as const, marker: manifest({ freshInstallReady: undefined }), expected: undefined },
    { major: 2 as const, marker: manifest({ supportedFreshInstallTargets: undefined }), expected: undefined },
    {
      major: 2 as const,
      marker: manifest({ supportedFreshInstallTargets: ["desktop-linux-x64-rpm"] }),
      expected: undefined,
    },
  ])("fresh install major $major -> $expected", async (input) => {
    expect(await fixture(input).client.freshInstall(input.major, "desktop-linux-x64-deb")).toBe(input.expected)
  })

  test("fresh v2 selection needs no installed bridge but pins an explicitly requested version", async () => {
    const client = fixture({ marker: manifest() }).client
    expect(await client.freshInstall(2, "cli-linux-x64-baseline", "2.2.5")).toBe("2.2.5")
    expect(await client.freshInstall(2, "cli-linux-x64-baseline", "2.2.4")).toBeUndefined()
    await expect(client.freshInstall(2, "cli-linux-x64-baseline", "1.19.5")).rejects.toThrow("selected major")
  })

  test.each([
    { supportedUpgradeTargets: ["unrecognized"] },
    { supportedUpgradeTargets: "desktop-linux-x64-deb" },
    { supportedFreshInstallTargets: ["desktop-linux-x64-deb", "desktop-linux-x64-deb"] },
    { freshInstallReady: "true" },
  ])("invalid capability metadata fails closed: %j", async (extra) => {
    await expect(
      fixture({ marker: manifest(extra) }).client.migrationOffer("1.20.0", "desktop-linux-x64-deb"),
    ).rejects.toThrow()
  })
})
