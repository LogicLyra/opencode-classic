import { describe, expect, test } from "bun:test"
import { createStore } from "solid-js/store"
import type { PromptInputV2PersistedState } from "./types"
import { createPromptInputV2Store } from "./store"

function createPromptStore() {
  return createPromptInputV2Store(
    createStore<PromptInputV2PersistedState>({
      prompt: [
        { type: "text", content: "old", start: 0, end: 3 },
        {
          type: "image",
          id: "attachment-1",
          filename: "notes.txt",
          mime: "text/plain",
          dataUrl: "data:text/plain;base64,",
        },
      ],
      cursor: 3,
      model: { providerID: "anthropic", modelID: "claude-sonnet", variant: null },
      context: { items: [] },
    }),
  )
}

describe("prompt input v2 store", () => {
  test("accepts an accessor for the backing store", () => {
    const [state, setState] = createStore<PromptInputV2PersistedState>({
      prompt: [{ type: "text", content: "", start: 0, end: 0 }],
      cursor: 0,
      context: { items: [] },
    })
    const prompt = createPromptInputV2Store([() => state, setState])

    prompt.setText("accessed")

    expect(prompt.state.prompt).toEqual([{ type: "text", content: "accessed", start: 0, end: 8 }])
    expect(prompt.state.cursor).toBe(8)
  })

  test("updates prompt text and cursor together while preserving attachments", () => {
    const prompt = createPromptStore()

    prompt.setText("updated")

    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "updated", start: 0, end: 7 },
      {
        type: "image",
        id: "attachment-1",
        filename: "notes.txt",
        mime: "text/plain",
        dataUrl: "data:text/plain;base64,",
      },
    ])
    expect(prompt.state.cursor).toBe(7)
  })

  test("inserts text at the cursor without flattening mentions", () => {
    const prompt = createPromptInputV2Store(
      createStore<PromptInputV2PersistedState>({
        prompt: [
          { type: "text", content: "before ", start: 0, end: 7 },
          { type: "file", path: "src/app.ts", content: "@src/app.ts", start: 7, end: 18 },
          { type: "text", content: " after", start: 18, end: 24 },
          {
            type: "image",
            id: "attachment-1",
            filename: "notes.txt",
            mime: "text/plain",
            dataUrl: "data:text/plain;base64,",
          },
        ],
        cursor: 7,
        context: { items: [] },
      }),
    )

    prompt.insertText("pasted\n")

    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "before pasted\n", start: 0, end: 14 },
      { type: "file", path: "src/app.ts", content: "@src/app.ts", start: 14, end: 25 },
      { type: "text", content: " after", start: 25, end: 31 },
      {
        type: "image",
        id: "attachment-1",
        filename: "notes.txt",
        mime: "text/plain",
        dataUrl: "data:text/plain;base64,",
      },
    ])
    expect(prompt.state.cursor).toBe(14)
  })

  test("prepends commands and clears text without corrupting structured parts", () => {
    const prompt = createPromptInputV2Store(
      createStore<PromptInputV2PersistedState>({
        prompt: [
          { type: "text", content: " keep ", start: 0, end: 6 },
          {
            type: "file",
            path: "resource://docs",
            content: "@docs",
            start: 6,
            end: 11,
            url: "resource://docs",
            source: {
              type: "resource",
              clientName: "docs",
              uri: "resource://docs",
              text: { value: "@docs", start: 6, end: 11 },
            },
          },
          { type: "text", content: " tail", start: 11, end: 16 },
          {
            type: "image",
            id: "attachment-1",
            filename: "notes.txt",
            mime: "text/plain",
            dataUrl: "data:text/plain;base64,",
          },
        ],
        cursor: 16,
        context: { items: [] },
      }),
    )

    prompt.prependText("/review ")

    expect(prompt.state.prompt[1]).toEqual({
      type: "file",
      path: "resource://docs",
      content: "@docs",
      start: 14,
      end: 19,
      url: "resource://docs",
      source: {
        type: "resource",
        clientName: "docs",
        uri: "resource://docs",
        text: { value: "@docs", start: 14, end: 19 },
      },
    })
    expect(prompt.state.cursor).toBe(24)

    prompt.clearText()

    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "", start: 0, end: 0 },
      {
        type: "image",
        id: "attachment-1",
        filename: "notes.txt",
        mime: "text/plain",
        dataUrl: "data:text/plain;base64,",
      },
    ])
    expect(prompt.state.cursor).toBe(0)
  })

  test("mutates context, attachments, and model through shared actions", () => {
    const prompt = createPromptStore()
    const context = { key: "file:src/index.ts", type: "file" as const, path: "src/index.ts" }

    prompt.addContext(context)
    prompt.addContext(context)
    prompt.addMention({ type: "file", path: "src/app.ts", content: "@src/app.ts", start: 0, end: 0 })
    prompt.removeAttachment("attachment-1")
    prompt.setVariant("thinking")

    expect(prompt.state.context.items).toEqual([context])
    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "old", start: 0, end: 3 },
      { type: "file", path: "src/app.ts", content: "@src/app.ts", start: 3, end: 14 },
      { type: "text", content: " ", start: 14, end: 15 },
    ])
    expect(prompt.state.model?.variant).toBe("thinking")

    prompt.removeContext(context.key)
    prompt.setPrompt([{ type: "text", content: "old", start: 0, end: 3 }], 3)
    prompt.setModel(undefined)

    expect(prompt.state.context.items).toEqual([])
    expect(prompt.state.prompt).toEqual([{ type: "text", content: "old", start: 0, end: 3 }])
    expect(prompt.state.model).toBeUndefined()
  })

  test("resets the prompt and cursor", () => {
    const prompt = createPromptStore()

    prompt.reset()

    expect(prompt.state.prompt).toEqual([{ type: "text", content: "", start: 0, end: 0 }])
    expect(prompt.state.cursor).toBe(0)
  })

  function createMentionStore(prompt: PromptInputV2PersistedState["prompt"], cursor: number) {
    return createPromptInputV2Store(
      createStore<PromptInputV2PersistedState>({ prompt, cursor, context: { items: [] } }),
    )
  }

  test("addMention inserts directly after an existing mention with no active trigger", () => {
    const prompt = createMentionStore([{ type: "file", path: "a", content: "@a", start: 0, end: 2 }], 2)
    const mention = { type: "file" as const, path: "b", content: "@b", start: 0, end: 0 }

    prompt.addMention(mention)

    expect(prompt.state.prompt).toEqual([
      { type: "file", path: "a", content: "@a", start: 0, end: 2 },
      { type: "file", path: "b", content: "@b", start: 2, end: 4 },
      { type: "text", content: " ", start: 4, end: 5 },
    ])
    expect(prompt.state.cursor).toBe(5)
  })

  test("addMention ignores earlier non-trigger @ text such as email addresses", () => {
    const prompt = createMentionStore([{ type: "text", content: "foo@bar.com", start: 0, end: 11 }], 11)
    const mention = { type: "file" as const, path: "b", content: "@b", start: 0, end: 0 }

    prompt.addMention(mention)

    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "foo@bar.com", start: 0, end: 11 },
      { type: "file", path: "b", content: "@b", start: 11, end: 13 },
      { type: "text", content: " ", start: 13, end: 14 },
    ])
    expect(prompt.state.cursor).toBe(14)
  })

  test("addMention appends at a prompt boundary without a trailing text node", () => {
    const prompt = createMentionStore([{ type: "agent", name: "x", content: "@x", start: 0, end: 2 }], 2)
    const mention = { type: "file" as const, path: "b", content: "@b", start: 0, end: 0 }

    prompt.addMention(mention)

    expect(prompt.state.prompt).toEqual([
      { type: "agent", name: "x", content: "@x", start: 0, end: 2 },
      { type: "file", path: "b", content: "@b", start: 2, end: 4 },
      { type: "text", content: " ", start: 4, end: 5 },
    ])
    expect(prompt.state.cursor).toBe(5)
  })

  test("addMention still replaces an active (start-or-whitespace) @ trigger", () => {
    const prompt = createMentionStore([{ type: "text", content: "see @", start: 0, end: 5 }], 5)
    const mention = { type: "file" as const, path: "b", content: "@b", start: 0, end: 0 }

    prompt.addMention(mention)

    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "see ", start: 0, end: 4 },
      { type: "file", path: "b", content: "@b", start: 4, end: 6 },
      { type: "text", content: " ", start: 6, end: 7 },
    ])
    expect(prompt.state.cursor).toBe(7)
  })

  test("addMention reuses existing whitespace after an active trigger", () => {
    const prompt = createMentionStore([{ type: "text", content: "foo @ bar", start: 0, end: 9 }], 5)
    const mention = { type: "file" as const, path: "b", content: "@b", start: 0, end: 0 }

    prompt.addMention(mention)

    expect(prompt.state.prompt).toEqual([
      { type: "text", content: "foo ", start: 0, end: 4 },
      { type: "file", path: "b", content: "@b", start: 4, end: 6 },
      { type: "text", content: " bar", start: 6, end: 10 },
    ])
    expect(prompt.state.cursor).toBe(7)
  })
})
