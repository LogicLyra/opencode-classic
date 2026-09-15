import { app, BrowserWindow, dialog, webContents } from "electron"
import { existsSync, realpathSync } from "node:fs"
import { isAbsolute, join } from "node:path"
import { Worker } from "node:worker_threads"
import { createProfileImportController, type ProfileWorkerResult } from "./profile-import-controller"
import { getLocalDatabasePath, getSourceProfileEnv } from "./server"
import { nativeSecurityT, nativeT } from "./native-translations"
import type { ProfileRoots } from "./profile-import-paths"
import { beginProfileScratch, cleanupProfileScratch } from "./profile-import-scratch"

export function createDesktopProfileImport() {
  return createProfileImportController({
    approve: async (sender, summary) => {
      const contents = webContents.fromId(sender)
      const window = contents && BrowserWindow.fromWebContents(contents)
      if (!contents || contents.isDestroyed() || !window || window.isDestroyed()) return false
      const result = await dialog.showMessageBox(window, {
        type: "warning",
        title: nativeSecurityT("desktop.profileImport.title"),
        message: nativeSecurityT("desktop.profileImport.message"),
        detail: nativeSecurityT("desktop.profileImport.detail", { ...summary }),
        buttons: [nativeSecurityT("desktop.profileImport.cancel"), nativeSecurityT("desktop.profileImport.confirm")],
        defaultId: 0,
        cancelId: 0,
        noLink: true,
      })
      return result.response === 1 && !contents.isDestroyed() && !window.isDestroyed()
    },
    destination: () => {
      const database = getLocalDatabasePath()
      const env = getSourceProfileEnv()
      if (
        process.platform !== "linux" ||
        !database ||
        env.OPENCODE_DB ||
        env.OPENCODE_CONFIG ||
        env.OPENCODE_CONFIG_CONTENT ||
        env.OPENCODE_AUTH_CONTENT
      )
        return
      return { database, userData: app.getPath("userData") }
    },
    select: async (browse) => {
      const env = getSourceProfileEnv()
      const home = app.getPath("home")
      const root = (value: string | undefined, fallback: string) =>
        value && isAbsolute(value) ? value : join(home, fallback)
      const source: ProfileRoots = {
        config:
          env.OPENCODE_CONFIG_DIR && isAbsolute(env.OPENCODE_CONFIG_DIR)
            ? env.OPENCODE_CONFIG_DIR
            : join(root(env.XDG_CONFIG_HOME, ".config"), "opencode"),
        data: join(root(env.XDG_DATA_HOME, ".local/share"), "opencode"),
        state: join(root(env.XDG_STATE_HOME, ".local/state"), "opencode"),
      }
      source.aliases = { config: source.config, data: source.data, state: source.state }
      for (const key of ["data", "config", "state"] as const) {
        if (browse) {
          const result = await dialog.showOpenDialog({
            title: nativeT("desktop.dialog.chooseFolder"),
            defaultPath: source[key],
            properties: ["openDirectory"],
          })
          if (result.canceled || !result.filePaths[0]) return null
          source[key] = result.filePaths[0]
          source.aliases[key] = source[key]
        }
        if (existsSync(source[key])) source[key] = realpathSync(source[key])
      }
      return existsSync(join(source.data, "opencode.db")) ? source : null
    },
    run: (input) =>
      new Promise<ProfileWorkerResult>((resolve) => {
        const scratch = beginProfileScratch(input.userData)
        let worker: Worker
        try {
          worker = new Worker(new URL("./profile-import-worker.js", import.meta.url), {
            workerData: { ...input, scratch },
          })
        } catch {
          cleanupProfileScratch(input.userData)
          resolve({ status: "error", code: "invalid" })
          return
        }
        let finished = false
        let result: ProfileWorkerResult = { status: "error", code: "invalid" }
        const finish = (result: ProfileWorkerResult) => {
          if (finished) return
          finished = true
          clearTimeout(timer)
          try {
            cleanupProfileScratch(input.userData)
            resolve(result)
          } catch {
            resolve({ status: "error", code: "invalid" })
          }
        }
        const timer = setTimeout(() => {
          result = { status: "error", code: "busy" }
          void worker.terminate()
        }, 600_000)
        worker.once("message", (message: ProfileWorkerResult) => {
          result = message
        })
        worker.once("error", () => {
          result = { status: "error", code: "invalid" }
        })
        worker.once("exit", () => finish(result))
      }),
  })
}
