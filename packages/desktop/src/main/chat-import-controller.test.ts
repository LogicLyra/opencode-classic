import { expect, test } from "bun:test"
import { mkdtemp, rm, rename, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { createChatImportController } from "./chat-import-controller"
import type { ChatImportResult } from "@opencode-ai/app/chat-import"

test("preview authorization is window-scoped, single-use, and pins the destination", async () => {
  const root = await mkdtemp(join(tmpdir(), "import-controller-"))
  const source = join(root, "source")
  await writeFile(source, "fixture")
  let destination = join(root, "destination")
  const commits: string[] = []
  const controller = createChatImportController({
    source: async () => source,
    destination: () => destination,
    run: async (input): Promise<ChatImportResult> => {
      if (input.commit) commits.push(input.source)
      return {
        status: "complete",
        summary: {
          source,
          destination,
          total: 1,
          eligible: 1,
          existing: 0,
          excluded: 0,
          imported: input.commit ? 1 : 0,
        },
      }
    },
  })
  try {
    expect(await controller.confirm(1, "not-a-token")).toEqual({ status: "error", code: "expired" })
    const preview = await controller.preview(1, false)
    expect(preview.status).toBe("ready")
    if (preview.status !== "ready") throw new Error("preview failed")
    expect(commits).toEqual([])
    expect(await controller.confirm(2, preview.token)).toEqual({ status: "error", code: "expired" })
    expect((await controller.confirm(1, preview.token)).status).toBe("complete")
    expect(commits).toEqual([source])
    expect(await controller.confirm(1, preview.token)).toEqual({ status: "error", code: "expired" })
    const next = await controller.preview(1, false)
    if (next.status !== "ready") throw new Error("preview failed")
    destination = join(root, "different-server")
    expect(await controller.confirm(1, next.token)).toEqual({ status: "error", code: "expired" })
    expect(commits).toEqual([source])
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("source replacement and window disposal invalidate authorization", async () => {
  const root = await mkdtemp(join(tmpdir(), "import-controller-"))
  const source = join(root, "source")
  await writeFile(source, "fixture")
  let commits = 0
  const controller = createChatImportController({
    source: async () => source,
    destination: () => join(root, "target"),
    run: async (input): Promise<ChatImportResult> => {
      if (input.commit) commits++
      return {
        status: "complete",
        summary: {
          source,
          destination: input.destination,
          total: 0,
          eligible: 0,
          existing: 0,
          excluded: 0,
          imported: 0,
        },
      }
    },
  })
  try {
    const first = await controller.preview(1, false)
    if (first.status !== "ready") throw new Error("preview failed")
    await rename(source, `${source}.old`)
    await writeFile(source, "different database")
    expect(await controller.confirm(1, first.token)).toEqual({ status: "error", code: "expired" })
    const second = await controller.preview(1, false)
    if (second.status !== "ready") throw new Error("preview failed")
    controller.clear(1)
    expect(await controller.confirm(1, second.token)).toEqual({ status: "error", code: "expired" })
    expect(commits).toBe(0)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("unavailable destinations and arbitrary renderer inputs cannot start file access", async () => {
  let reads = 0
  const controller = createChatImportController({
    destination: () => undefined,
    source: async () => {
      reads++
      return "/unexpected"
    },
    run: async () => {
      throw new Error("must not run")
    },
  })
  expect(await controller.preview(1, true)).toEqual({ status: "error", code: "unavailable" })
  expect(await controller.preview(1, "/arbitrary/path")).toEqual({ status: "error", code: "unavailable" })
  expect(reads).toBe(0)
})
