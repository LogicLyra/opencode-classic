import { app, dialog } from "electron"
import pkg from "electron-updater"
import { UPDATER_ENABLED } from "./constants"
import { createUpdaterController, type UpdaterReadyRecord } from "./updater-controller"
import { getLogger } from "./logging"
import { getStore } from "./store"
import { setAppQuitting } from "./windows"
import { nativeT } from "./native-translations"
import { checkClassicTarget } from "./classic-update"
import { createReleaseClient, type ReleaseTarget } from "@opencode-classic/releases"
import { createMigrationController } from "./migration-controller"
import type { UpdaterState } from "@opencode-ai/app/updater"

const { autoUpdater } = pkg
const key = "ready"

export function setupAutoUpdater(stop: () => Promise<void>) {
  const logger = getLogger()
  autoUpdater.logger = logger
  autoUpdater.channel = "latest"
  autoUpdater.allowPrerelease = false
  autoUpdater.allowDowngrade = false
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false
  logger.log("auto updater configured", {
    channel: autoUpdater.channel,
    allowPrerelease: autoUpdater.allowPrerelease,
    allowDowngrade: autoUpdater.allowDowngrade,
    currentVersion: app.getVersion(),
  })

  const store = getStore("opencode.updater")
  const current = app.getVersion()
  const releases = createReleaseClient()
  const target: ReleaseTarget | undefined = process.platform !== "linux" || process.arch !== "x64" ? undefined
    : autoUpdater instanceof pkg.DebUpdater ? "desktop-linux-x64-deb"
    : autoUpdater instanceof pkg.RpmUpdater ? "desktop-linux-x64-rpm" : undefined
  let snapshot: ReturnType<typeof releases.discover> | undefined
  const backend = {
    checkForUpdates: async () => {
      const result = await (snapshot ?? releases.discover(current, target))
      return checkClassicTarget(autoUpdater, current, result.maintenance)
    },
    checkTarget: (version: string) => checkClassicTarget(autoUpdater, current, version),
    downloadUpdate: () => autoUpdater.downloadUpdate(),
    quitAndInstall: () => {
      setAppQuitting()
      try {
        autoUpdater.quitAndInstall()
      } catch (error) {
        setAppQuitting(false)
        throw error
      }
    },
  }
  const controller = createUpdaterController({
    enabled: UPDATER_ENABLED,
    currentVersion: app.getVersion(),
    backend,
    persistence: {
      get() {
        const value = store.get(key)
        if (!value || typeof value !== "object" || !("version" in value) || typeof value.version !== "string") return
        return { version: value.version } satisfies UpdaterReadyRecord
      },
      set: (value) => store.set(key, value),
      clear: () => store.delete(key),
    },
    stop,
    log: (message, data) => logger.log(message, data),
  })
  const migration = createMigrationController({
    enabled: UPDATER_ENABLED && !!target,
    maintenance: controller,
    revalidate: (version) => target ? releases.migrationOffer(current, target, version) : Promise.resolve(undefined),
    backend,
    persistence: {
      get() {
        const value = store.get("migration-major-2")
        if (!value || typeof value !== "object" || !("stay" in value) || typeof value.stay !== "boolean" ||
            !("snoozeUntil" in value) || typeof value.snoozeUntil !== "number" || !Number.isFinite(value.snoozeUntil)) return
        return { stay: value.stay, snoozeUntil: value.snoozeUntil }
      },
      set: (value) => store.set("migration-major-2", value),
      prepared: (version) => version ? store.set("migration-consent", { version, target }) : store.delete("migration-consent"),
    },
    // Preparation stays disabled until the staged-profile owner implements both phases.
    stop,
  })
  let checking: Promise<UpdaterState> | undefined
  const check = (start = false) => {
    if (!UPDATER_ENABLED) return Promise.resolve(controller.getState())
    if (checking) return checking
    snapshot = releases.discover(current, target)
    checking = Promise.all([
      start ? controller.start() : controller.check(),
      snapshot.then((result) => migration.refresh(result.migration), () => migration.refresh({ status: "error", code: "verification" })),
    ]).then(([state]) => state).finally(() => { snapshot = undefined; checking = undefined })
    return checking
  }
  return {
    ...controller,
    start: () => check(true),
    check: () => check(),
    migration: {
      ...migration,
      async check() {
        if (!UPDATER_ENABLED || !target) return migration.getState()
        if (checking) { await checking; return migration.getState() }
        return releases.discover(current, target).then(
          (result) => migration.refresh(result.migration),
          () => migration.refresh({ status: "error", code: "verification" }),
        )
      },
    },
  }
}

export async function showUpdaterDialog(controller: ReturnType<typeof setupAutoUpdater>, alertOnFail: boolean) {
  const state = await controller.check()
  if (state.status === "error") {
    if (!alertOnFail) return
    await dialog.showMessageBox({
      type: "error",
      message: nativeT("desktop.updater.dialog.checkFailed.message"),
      title: nativeT("desktop.updater.dialog.checkFailed.title"),
    })
    return
  }
  if (state.status === "up-to-date") {
    if (!alertOnFail) return
    await dialog.showMessageBox({
      type: "info",
      message: nativeT("desktop.updater.dialog.upToDate.message"),
      title: nativeT("desktop.updater.dialog.upToDate.title"),
    })
    return
  }
  if (state.status !== "ready") return

  const response = await dialog.showMessageBox({
    type: "info",
    message: nativeT("desktop.updater.dialog.ready.message", { version: state.version }),
    title: nativeT("desktop.updater.dialog.ready.title"),
    buttons: [nativeT("desktop.updater.dialog.restart"), nativeT("desktop.updater.dialog.later")],
    defaultId: 0,
    cancelId: 1,
  })
  if (response.response === 0) await controller.install()
}
