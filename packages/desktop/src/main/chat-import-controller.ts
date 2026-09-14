import { randomUUID } from "node:crypto"
import { realpath, stat } from "node:fs/promises"
import type { ChatImportResult } from "@opencode-ai/app/chat-import"

type Preview = { source: string; destination: string; dev: number; ino: number; expires: number }

export function createChatImportController(input: {
  destination: () => string | undefined
  source: (chooseFile: boolean) => Promise<string | null>
  run: (input: { source: string; destination: string; commit: boolean }) => Promise<ChatImportResult>
}) {
  const tokens = new Map<number, { token: string; preview: Preview }>()
  let busy = false

  const operation = async (run: () => Promise<ChatImportResult>): Promise<ChatImportResult> => {
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
    preview(sender: number, chooseFile: unknown) {
      return operation(async () => {
        tokens.delete(sender)
        const destination = input.destination()
        if (
          !destination ||
          destination === ":memory:" ||
          (chooseFile !== undefined && typeof chooseFile !== "boolean")
        ) {
          return { status: "error", code: "unavailable" }
        }
        const selected = await input.source(chooseFile === true)
        if (!selected) return { status: "cancelled" }
        const source = await realpath(selected)
        const file = await stat(source)
        const result = await input.run({ source, destination, commit: false })
        if (result.status !== "complete") return result
        const token = randomUUID()
        tokens.set(sender, {
          token,
          preview: { source, destination, dev: file.dev, ino: file.ino, expires: Date.now() + 600_000 },
        })
        return { status: "ready", token, summary: result.summary }
      })
    },
    confirm(sender: number, token: unknown) {
      return operation(async () => {
        const entry = tokens.get(sender)
        tokens.delete(sender)
        if (!entry || entry.token !== token || entry.preview.expires < Date.now())
          return { status: "error", code: "expired" }
        const preview = entry.preview
        if (input.destination() !== preview.destination) return { status: "error", code: "expired" }
        const file = await stat(preview.source)
        if (file.dev !== preview.dev || file.ino !== preview.ino) return { status: "error", code: "expired" }
        return input.run({ source: preview.source, destination: preview.destination, commit: true })
      })
    },
  }
}
