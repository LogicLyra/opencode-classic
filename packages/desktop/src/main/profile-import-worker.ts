import { parentPort, workerData } from "node:worker_threads"
import { ProfileImportFailure } from "./profile-import-paths"
import { runProfileImport } from "./profile-import-stage"

try {
  parentPort?.postMessage({ status: "complete", ...runProfileImport(workerData) })
} catch (error) {
  parentPort?.postMessage({
    status: "error",
    code: error instanceof ProfileImportFailure ? error.code : "invalid",
    detail: error instanceof ProfileImportFailure ? error.detail : undefined,
  })
}
