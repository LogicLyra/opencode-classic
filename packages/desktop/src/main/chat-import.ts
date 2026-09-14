import { app, dialog } from "electron"
import { Worker } from "node:worker_threads"
import { isAbsolute, join } from "node:path"
import { access } from "node:fs/promises"
import type { ChatImportResult } from "@opencode-ai/app/chat-import"
import { createChatImportController } from "./chat-import-controller"
import { getLocalDatabasePath } from "./server"
import { nativeT } from "./native-translations"

export function createDesktopChatImport() {
  return createChatImportController({
    destination: () => (process.platform === "linux" ? getLocalDatabasePath() : undefined),
    source: async (chooseFile) => {
      const root = process.env.XDG_DATA_HOME
      const defaultPath = join(
        root && isAbsolute(root) ? root : join(app.getPath("home"), ".local", "share"),
        "opencode",
        "opencode.db",
      )
      if (!chooseFile)
        return await access(defaultPath).then(
          () => defaultPath,
          () => null,
        )
      const result = await dialog.showOpenDialog({
        title: nativeT("desktop.dialog.chooseFile"),
        defaultPath,
        properties: ["openFile"],
        filters: [{ name: nativeT("desktop.dialog.files"), extensions: ["db", "sqlite", "sqlite3"] }],
      })
      return result.canceled ? null : (result.filePaths[0] ?? null)
    },
    run: (input) =>
      new Promise<ChatImportResult>((resolve) => {
        const worker = new Worker(new URL("./chat-import-worker.js", import.meta.url), { workerData: input })
        let finished = false
        const finish = (result: ChatImportResult) => {
          if (finished) return
          finished = true
          clearTimeout(timer)
          resolve(result)
        }
        const timer = setTimeout(() => {
          void worker.terminate().finally(() => finish({ status: "error", code: "busy" }))
        }, 600_000)
        worker.once("message", (result: ChatImportResult) => finish(result))
        worker.once("error", () => finish({ status: "error", code: "invalid" }))
        worker.once("exit", () => finish({ status: "error", code: "invalid" }))
      }),
  })
}
