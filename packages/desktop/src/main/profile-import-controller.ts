import { randomUUID } from "node:crypto"
import type { ProfileImportError, ProfileImportResult, ProfileImportSummary } from "@opencode-ai/app/profile-import"
import type { ProfileRoots } from "./profile-import-paths"
import type { ProfileImportInput } from "./profile-import-stage"

export type ProfileWorkerResult =
  | { status: "complete"; summary: ProfileImportSummary; fingerprint: string }
  | { status: "error"; code: ProfileImportError }

export function createProfileImportController(input: {
  destination: () => { database: string; userData: string } | undefined
  select: (browse: boolean) => Promise<ProfileRoots | null>
  run: (input: ProfileImportInput) => Promise<ProfileWorkerResult>
  approve: (sender: number, summary: ProfileImportSummary) => Promise<boolean>
}) {
  const tokens = new Map<
    number,
    { token: string; expires: number; input: ProfileImportInput; summary: ProfileImportSummary }
  >()
  let busy = false
  const operation = async (run: () => Promise<ProfileImportResult>): Promise<ProfileImportResult> => {
    if (busy) return { status: "error", code: "busy" }
    busy = true
    try {
      return await run()
    } catch {
      return { status: "error", code: "invalid" }
    } finally {
      busy = false
    }
  }
  return {
    clear(sender: number) {
      tokens.delete(sender)
    },
    preview(sender: number, browse: unknown) {
      return operation(async () => {
        tokens.delete(sender)
        const dest = input.destination()
        if (!dest || (browse !== undefined && typeof browse !== "boolean"))
          return { status: "error", code: "unavailable" }
        const source = await input.select(browse === true)
        if (!source) return { status: "cancelled" }
        const request = { source, userData: dest.userData, destination: dest.database }
        const result = await input.run(request)
        if (result.status === "error") return result
        const token = randomUUID()
        tokens.set(sender, {
          token,
          expires: Date.now() + 600_000,
          input: { ...request, fingerprint: result.fingerprint },
          summary: result.summary,
        })
        return { status: "ready", token, summary: result.summary }
      })
    },
    confirm(sender: number, token: unknown) {
      return operation(async () => {
        const entry = tokens.get(sender)
        tokens.delete(sender)
        const dest = input.destination()
        if (
          !entry ||
          typeof token !== "string" ||
          entry.token !== token ||
          entry.expires < Date.now() ||
          dest?.database !== entry.input.destination ||
          dest.userData !== entry.input.userData
        )
          return { status: "error", code: "changed" }
        if (!(await input.approve(sender, entry.summary))) return { status: "cancelled" }
        const result = await input.run(entry.input)
        return result.status === "error" ? result : { status: "staged" }
      })
    },
  }
}
