import { afterEach, expect, setSystemTime, test } from "bun:test"
import { createHash } from "node:crypto"
import { createReleaseClient, migrationAsset, targetAsset } from "@opencode-classic/releases"
import { checkClassicTarget, checkClassicUpdate } from "./classic-update"
import { createUpdaterController } from "./updater-controller"
import { createMigrationController, type MigrationPreference } from "./migration-controller"

afterEach(() => setSystemTime())

async function fixture(
  input: {
    maintenance?: boolean
    preflight?: false
    wait?: Promise<void>
    readPreference?: () => Promise<MigrationPreference | undefined>
  } = {},
) {
  const calls: string[] = []
  const stored = { preference: undefined as MigrationPreference | undefined, prepared: undefined as string | undefined }
  let published = true
  let selected = ""
  const marker = JSON.stringify({
    schemaVersion: 1,
    version: "2.2.5",
    sourceMajor: 1,
    minimumVersion: "1.20.0",
    migrationReady: true,
    supportedUpgradeTargets: ["desktop-linux-x64-deb"],
  })
  const releases = createReleaseClient(async (url) => ({
    status: 200,
    body: url.includes("/releases?")
      ? JSON.stringify(
          [...(published ? ["2.2.5"] : []), input.maintenance ? "1.20.1" : "1.20.0"].map((version) => ({
            tag_name: `v${version}`,
            draft: false,
            prerelease: false,
            assets: [
              "install",
              "SHA256SUMS",
              migrationAsset,
              "latest-linux.yml",
              targetAsset("desktop-linux-x64-deb"),
            ].map((name) => ({ name })),
          })),
        )
      : url.endsWith("SHA256SUMS")
        ? `${createHash("sha256").update(marker).digest("hex")}  ${migrationAsset}\n`
        : marker,
  }))
  const transport = {
    setFeedURL(value: { url: string }) {
      selected = value.url.split("/v").at(-1)!.replace(/\/$/, "")
      calls.push(`feed:${selected}`)
    },
    async checkForUpdates() {
      calls.push(`check:${selected}`)
      return { isUpdateAvailable: true, updateInfo: { version: selected } }
    },
  }
  const backend = {
    checkForUpdates: () => checkClassicUpdate(transport, "1.20.0", releases),
    checkTarget: (version: string) => checkClassicTarget(transport, "1.20.0", version),
    async downloadUpdate() {
      calls.push(`download:${selected}`)
      await input.wait
    },
    quitAndInstall() {
      calls.push("install")
    },
  }
  const maintenance = createUpdaterController({
    enabled: true,
    currentVersion: "1.20.0",
    backend,
    persistence: { get: () => undefined, set() {}, clear() {} },
    stop: async () => {
      calls.push("stop")
    },
  })
  const create = () =>
    createMigrationController({
      enabled: true,
      maintenance,
      backend,
      revalidate: (version) => {
        calls.push(`revalidate:${version}`)
        return releases.migrationOffer("1.20.0", "desktop-linux-x64-deb", version)
      },
      persistence: {
        get: () => (input.readPreference ? input.readPreference() : stored.preference),
        set: (value) => {
          stored.preference = value
        },
        prepared: (value) => {
          stored.prepared = value
        },
      },
      ...(input.preflight === false
        ? {}
        : {
            preflight: async (_offer: unknown, phase: "prepare" | "install") => {
              calls.push(`preflight:${phase}`)
              return true
            },
          }),
      stop: async () => {
        calls.push("stop")
      },
    })
  const controller = create()
  const discovery = (await releases.discover("1.20.0", "desktop-linux-x64-deb")).migration
  await controller.refresh(discovery)
  return {
    calls,
    stored,
    controller,
    maintenance,
    create,
    discovery,
    withdraw() {
      published = false
    },
  }
}

test.each(["resolve", "reject"])(
  "an obsolete preference read cannot overwrite prepared consent: %s",
  async (outcome) => {
    const gate = Promise.withResolvers<MigrationPreference | undefined>()
    let reads = 0
    const app = await fixture({ readPreference: () => (++reads === 1 ? Promise.resolve(undefined) : gate.promise) })
    await app.controller.review("2.2.5")
    const checking = app.controller.refresh(app.discovery)
    await app.controller.prepare("2.2.5")
    if (outcome === "reject") gate.reject(new Error("preference read failed"))
    else gate.resolve({ stay: true, snoozeUntil: 0 })
    await checking
    expect(app.controller.getState().status).toBe("prepared")
    expect(app.stored.prepared).toBe("2.2.5")
    expect(app.maintenance.reserveMigration()).toBeUndefined()
  },
)

test("offers and review are metadata-only; exact explicit prepare and restart own the transfer", async () => {
  const app = await fixture()
  expect(app.controller.getState().status).toBe("offered")
  await app.controller.review("2.2.5")
  expect(app.calls).toEqual([])
  await app.controller.prepare("2.2.5")
  expect(app.controller.getState().status).toBe("prepared")
  expect(app.stored.prepared).toBe("2.2.5")
  expect(app.calls).toEqual(["revalidate:2.2.5", "preflight:prepare", "feed:2.2.5", "check:2.2.5", "download:2.2.5"])
  await app.maintenance.check()
  expect(app.calls).toHaveLength(5)
  await app.controller.install("2.2.5")
  expect(app.calls.slice(5)).toEqual(["revalidate:2.2.5", "stop", "preflight:install", "install"])
})

test.each(["downloading", "ready"])(
  "a %s maintenance update blocks preparation without changing the feed",
  async (phase) => {
    const gate = Promise.withResolvers<void>()
    const app = await fixture({ maintenance: true, ...(phase === "downloading" ? { wait: gate.promise } : {}) })
    const downloading = Promise.withResolvers<void>()
    app.maintenance.subscribe((state) => {
      if (state.status === "downloading") downloading.resolve()
    })
    const check = app.maintenance.check()
    await downloading.promise
    if (phase === "ready") await check
    await app.controller.review("2.2.5")
    expect(await app.controller.prepare("2.2.5")).toEqual({ status: "error", code: "maintenance" })
    expect(app.calls).toEqual(["feed:1.20.1", "check:1.20.1", "download:1.20.1"])
    gate.resolve()
    await check
  },
)

test("concurrent prepares share one transfer and concurrent installs cannot restart twice", async () => {
  const app = await fixture()
  await app.controller.review("2.2.5")
  await Promise.all([app.controller.prepare("2.2.5"), app.controller.prepare("2.2.5")])
  expect(app.calls.filter((call) => call === "download:2.2.5")).toHaveLength(1)
  const result = await Promise.allSettled([app.controller.install("2.2.5"), app.controller.install("2.2.5")])
  expect(result.map((item) => item.status)).toEqual(["fulfilled", "rejected"])
  expect(app.calls.filter((call) => call === "install")).toHaveLength(1)
})

test.each(["prepare", "install"])(
  "withdrawal before %s requires review again without substituting a target",
  async (phase) => {
    const app = await fixture()
    await app.controller.review("2.2.5")
    if (phase === "install") await app.controller.prepare("2.2.5")
    app.withdraw()
    await app.controller[phase]("2.2.5")
    expect(app.controller.getState()).toEqual({ status: "error", code: "changed" })
    expect(app.calls).not.toContain("stop")
    expect(app.calls).not.toContain("install")
    if (phase === "prepare") expect(app.calls.some((call) => call.startsWith("feed:"))).toBe(false)
    expect(app.stored.prepared).toBeUndefined()
    expect(app.maintenance.reserveMigration()).toBeFunction()
    await expect(app.controller.review("2.2.5")).rejects.toThrow("INVALID_MIGRATION_TARGET")
  },
)

test("an unwired profile owner cannot prepare or download even with a ready remote manifest", async () => {
  const app = await fixture({ preflight: false })
  expect(app.controller.getState()).toMatchObject({ status: "offered", canPrepare: false })
  await app.controller.review("2.2.5")
  expect(await app.controller.prepare("2.2.5")).toEqual({ status: "error", code: "preflight" })
  expect(app.calls).toEqual([])
})

test.each(["later", "stay"] as const)(
  "%s survives restart and preserves manual review and maintenance",
  async (choice) => {
    setSystemTime(new Date("2026-11-02T00:00:00Z"))
    const app = await fixture({ maintenance: true })
    await app.controller.dismiss(choice)
    const next = app.create()
    await next.refresh(app.discovery)
    expect(next.getState()).toMatchObject({ status: "offered", announce: false })
    setSystemTime(new Date("2026-11-10T00:00:00Z"))
    await next.refresh(app.discovery)
    expect(next.getState()).toMatchObject({ announce: choice === "later" })
    await next.review("2.2.5")
    expect(next.getState().status).toBe("reviewing")
    await app.maintenance.check()
    expect(app.maintenance.getState()).toEqual({ status: "ready", version: "1.20.1" })
    if (choice === "stay") {
      await next.dismiss("later")
      setSystemTime(new Date("2026-11-18T00:00:00Z"))
      await next.refresh(app.discovery)
      expect(next.getState()).toMatchObject({ status: "offered", announce: true })
    }
  },
)

test("discarding a prepared target releases maintenance ownership and clears its consent", async () => {
  const app = await fixture({ maintenance: true })
  await app.controller.review("2.2.5")
  await app.controller.prepare("2.2.5")
  await app.controller.dismiss("later")
  expect(app.stored.prepared).toBeUndefined()
  await app.maintenance.check()
  expect(app.calls.at(-1)).toBe("download:1.20.1")
})

test.each([undefined, "2.2.4", { version: "2.2.5", url: "https://example.invalid/install" }])(
  "untrusted target %j cannot authorize preparation",
  async (version) => {
    const app = await fixture()
    expect(() => app.controller.prepare(version)).toThrow("INVALID_MIGRATION_TARGET")
    expect(app.calls).toEqual([])
  },
)
