import { app, dialog } from "electron"
import { existsSync, realpathSync } from "node:fs"
import { isAbsolute, join } from "node:path"
import { Worker } from "node:worker_threads"
import { createProfileImportController, type ProfileWorkerResult } from "./profile-import-controller"
import { getLocalDatabasePath, getSourceProfileEnv } from "./server"
import { nativeT } from "./native-translations"
import type { ProfileRoots } from "./profile-import-paths"

export function createDesktopProfileImport() {
  return createProfileImportController({
    approve: async (summary) => {
      const result = await dialog.showMessageBox({
        type: "warning", title: nativeT("desktop.profileImport.title"), message: nativeT("desktop.profileImport.message"),
        detail: nativeT("desktop.profileImport.detail", { ...summary }),
        buttons: [nativeT("desktop.profileImport.cancel"), nativeT("desktop.profileImport.confirm")], defaultId: 0, cancelId: 0, noLink: true,
      })
      return result.response === 1
    },
    destination: () => {
      const database = getLocalDatabasePath()
      const env = getSourceProfileEnv()
      if (process.platform !== "linux" || !database || env.OPENCODE_DB || env.OPENCODE_CONFIG || env.OPENCODE_CONFIG_CONTENT || env.OPENCODE_AUTH_CONTENT) return
      return { database, userData: app.getPath("userData") }
    },
    select: async (browse) => {
      const env = getSourceProfileEnv()
      const home = app.getPath("home")
      const root = (value: string | undefined, fallback: string) => value && isAbsolute(value) ? value : join(home, fallback)
      const source: ProfileRoots = {
        config: env.OPENCODE_CONFIG_DIR && isAbsolute(env.OPENCODE_CONFIG_DIR) ? env.OPENCODE_CONFIG_DIR : join(root(env.XDG_CONFIG_HOME, ".config"), "opencode"),
        data: join(root(env.XDG_DATA_HOME, ".local/share"), "opencode"),
        state: join(root(env.XDG_STATE_HOME, ".local/state"), "opencode"),
      }
      source.aliases = { config: source.config, data: source.data, state: source.state }
      for (const key of ["data", "config", "state"] as const) {
        if (browse) {
          const result = await dialog.showOpenDialog({ title: nativeT("desktop.dialog.chooseFolder"), defaultPath: source[key], properties: ["openDirectory"] })
          if (result.canceled || !result.filePaths[0]) return null
          source[key] = result.filePaths[0]
          source.aliases[key] = source[key]
        }
        if (existsSync(source[key])) source[key] = realpathSync(source[key])
      }
      return existsSync(join(source.data, "opencode.db")) ? source : null
    },
    run: (input) => new Promise<ProfileWorkerResult>((resolve) => {
      const worker = new Worker(new URL("./profile-import-worker.js", import.meta.url), { workerData: input })
      let finished = false
      const finish = (result: ProfileWorkerResult) => {
        if (finished) return
        finished = true
        clearTimeout(timer)
        resolve(result)
      }
      const timer = setTimeout(() => { void worker.terminate().finally(() => finish({ status: "error", code: "busy" })) }, 600_000)
      worker.once("message", finish)
      worker.once("error", () => finish({ status: "error", code: "invalid" }))
      worker.once("exit", () => finish({ status: "error", code: "invalid" }))
    }),
  })
}
