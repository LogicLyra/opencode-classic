import { expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { createReleaseClient, downloadBase } from "@opencode-classic/releases"
import { checkClassicUpdate } from "./classic-update"
import { createUpdaterController } from "./updater-controller"

test.each([false, true])("desktop bridge preserves in-client restart flow; migration ready=%s", async (ready) => {
  const body = JSON.stringify({
    schemaVersion: 1,
    version: "2.2.5",
    migrationReady: ready,
    sourceMajor: 1,
    minimumVersion: "1.19.5",
  })
  const releases = createReleaseClient(async (url) => ({
    status: 200,
    body: url.includes("/releases?")
      ? JSON.stringify(
          ["2.2.5", "1.19.5"].map((version) => ({ tag_name: `v${version}`, draft: false, prerelease: false })),
        )
      : url.endsWith("SHA256SUMS")
        ? `${createHash("sha256").update(body).digest("hex")}  classic-migration.json\n`
        : body,
  }))
  const calls: string[] = []
  const backend = {
    setFeedURL(options: { provider: "generic"; url: string; channel: string }) {
      expect(options).toEqual({ provider: "generic", url: downloadBase("2.2.5"), channel: "latest" })
      calls.push("feed")
    },
    async checkForUpdates() {
      calls.push("check")
      return { isUpdateAvailable: true, updateInfo: { version: "2.2.5" } }
    },
  }
  const controller = createUpdaterController({
    enabled: true,
    currentVersion: "1.19.5",
    backend: {
      checkForUpdates: () => checkClassicUpdate(backend, "1.19.5", releases),
      downloadUpdate: async () => {
        calls.push("download")
      },
      quitAndInstall: () => {
        calls.push("install")
      },
    },
    persistence: {
      get: () => undefined,
      set: () => {
        calls.push("persist")
      },
      clear() {},
    },
    stop: async () => {
      calls.push("stop")
    },
  })
  await controller.start()
  if (!ready) {
    expect(controller.getState()).toEqual({ status: "up-to-date" })
    expect(calls).toEqual([])
    return
  }
  expect(controller.getState()).toEqual({ status: "ready", version: "2.2.5" })
  expect(calls).toEqual(["feed", "check", "download", "persist"])
  await controller.install()
  expect(calls).toEqual(["feed", "check", "download", "persist", "stop", "install"])
})

test("desktop refuses metadata from a different tag before downloading", async () => {
  const releases = createReleaseClient(async () => ({
    status: 200,
    body: JSON.stringify([{ tag_name: "v1.19.5", draft: false, prerelease: false }]),
  }))
  await expect(
    checkClassicUpdate(
      {
        setFeedURL() {},
        async checkForUpdates() {
          return { isUpdateAvailable: true, updateInfo: { version: "2.2.5" } }
        },
      },
      "1.19.3",
      releases,
    ),
  ).rejects.toThrow("does not match")
})
