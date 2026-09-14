import { parentPort, workerData } from "node:worker_threads"
import { chatImportError, importChatDatabase } from "./chat-import-database"

try {
  parentPort?.postMessage({ status: "complete", summary: importChatDatabase(workerData) })
} catch (error) {
  parentPort?.postMessage({ status: "error", code: chatImportError(error) })
}
