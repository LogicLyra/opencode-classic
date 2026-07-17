import { describe, expect, test } from "bun:test"
import { createRoot } from "solid-js"
import { createStore } from "solid-js/store"
import { createPromptInputV2Controller } from "@opencode-ai/session-ui/v2/prompt-input/interaction"
import {
  parsePromptInputV2Editor,
  promptInputV2EditorCursor,
  renderPromptInputV2Editor,
  setPromptInputV2EditorCursor,
  type PromptInputV2PersistedState,
  type PromptInputV2Suggestion,
} from "@opencode-ai/session-ui/v2/prompt-input"

const command: PromptInputV2Suggestion = {
  id: "model",
  kind: "command",
  commandMode: "execute",
  label: "/model",
}

function setup(
  prompt: PromptInputV2PersistedState["prompt"],
  cursor: number,
  onSelect?: () => void,
  withAction = true,
) {
  const [persisted, setPersisted] = createStore<PromptInputV2PersistedState>({
    prompt,
    cursor,
    context: { items: [] },
  })
  let observed: PromptInputV2PersistedState["prompt"] | undefined
  let dispose = () => {}
  const controller = createRoot((cleanup) => {
    dispose = cleanup
    return createPromptInputV2Controller({
      store: [persisted, setPersisted],
      commands: () => [],
      context: () => [],
      searchContextFiles: () => [],
      onSuggestionSelect: withAction
        ? () => () => {
            observed = persisted.prompt.map((part) => ({ ...part }))
            onSelect?.()
          }
        : undefined,
      view: {
        submit: {
          stopping: () => false,
          onSubmit: () => {},
          onStop: () => {},
        },
      },
    })
  })
  return { controller, persisted, dispose, observed: () => observed }
}

describe("prompt input v2 command actions", () => {
  test("menu actions observe a populated structured draft unchanged", () => {
    const prompt: PromptInputV2PersistedState["prompt"] = [
      { type: "text", content: "review ", start: 0, end: 7 },
      { type: "file", path: "src/app.ts", content: "@src/app.ts", start: 7, end: 18 },
    ]
    const input = setup(prompt, 18)

    input.controller.openCommands()
    input.controller.dispatch({ type: "popover.select", item: command })

    expect(input.observed()).toEqual(prompt)
    expect(input.persisted.prompt).toEqual(prompt)
    input.dispose()
  })

  test("inline actions observe their trigger cleared while preserving attachments", () => {
    const attachment = {
      type: "image" as const,
      id: "attachment-1",
      filename: "image.png",
      mime: "image/png",
      dataUrl: "data:image/png;base64,",
    }
    const input = setup([{ type: "text", content: "/model", start: 0, end: 6 }, attachment], 6)
    input.controller.onInput("/model", input.persisted.prompt, 6)

    input.controller.dispatch({ type: "popover.select", item: command })

    expect(input.observed()).toEqual([{ type: "text", content: "", start: 0, end: 0 }, attachment])
    input.dispose()
  })

  test("context insertion restores the persisted cursor after the editor rerenders", async () => {
    const input = setup([{ type: "text", content: "", start: 0, end: 0 }], 0)
    const editor = document.createElement("div")
    const button = document.createElement("button")
    editor.contentEditable = "true"
    document.body.append(editor, button)
    input.controller.setEditor(editor)
    editor.append(document.createTextNode("before"), document.createElement("br"), document.createTextNode("after"))
    setPromptInputV2EditorCursor(editor, 7)
    const prompt = parsePromptInputV2Editor(editor)
    input.controller.onInput(prompt.map((part) => part.content).join(""), prompt, promptInputV2EditorCursor(editor))
    button.focus()

    input.controller.openContext()
    renderPromptInputV2Editor(editor, input.persisted.prompt, input.persisted.cursor)
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "before\n@after", start: 0, end: 13 }])
    expect(document.activeElement).toBe(editor)
    expect(promptInputV2EditorCursor(editor)).toBe(8)
    editor.remove()
    button.remove()
    input.dispose()
  })

  test("opening the command menu focuses the registered command-search input", async () => {
    const input = setup([{ type: "text", content: "existing text", start: 0, end: 13 }], 13)
    const search = document.createElement("input")
    document.body.append(search)
    input.controller.setCommandSearch(search)
    expect(document.activeElement).not.toBe(search)

    input.controller.openCommands()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    expect(input.controller.state.popover).toEqual({ type: "command-menu", query: "" })
    expect(document.activeElement).toBe(search)
    search.remove()
    input.dispose()
  })

  test("restores the editor when an executed menu action leaves focus in the closing search", async () => {
    const input = setup([{ type: "text", content: "existing text", start: 0, end: 13 }], 13)
    const editor = document.createElement("div")
    const search = document.createElement("input")
    editor.contentEditable = "true"
    document.body.append(editor, search)
    input.controller.setEditor(editor)
    input.controller.setCommandSearch(search)

    input.controller.openCommands()
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    expect(document.activeElement).toBe(search)
    input.controller.dispatch({ type: "popover.select", item: command })
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    expect(document.activeElement).toBe(editor)
    editor.remove()
    search.remove()
    input.dispose()
  })

  test("preserves focus moved by an executed menu action", async () => {
    const target = document.createElement("button")
    document.body.append(target)
    const input = setup([{ type: "text", content: "existing text", start: 0, end: 13 }], 13, () => target.focus())
    const editor = document.createElement("div")
    const search = document.createElement("input")
    document.body.append(editor, search)
    input.controller.setEditor(editor)
    input.controller.setCommandSearch(search)
    search.focus()

    input.controller.dispatch({ type: "popover.select", item: command })
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    expect(document.activeElement).toBe(target)
    target.remove()
    editor.remove()
    search.remove()
    input.dispose()
  })

  test("restores the editor when an executed command has no action", async () => {
    const input = setup([{ type: "text", content: "existing text", start: 0, end: 13 }], 13, undefined, false)
    const editor = document.createElement("div")
    const search = document.createElement("input")
    editor.contentEditable = "true"
    document.body.append(editor, search)
    input.controller.setEditor(editor)
    input.controller.setCommandSearch(search)
    search.focus()

    input.controller.dispatch({ type: "popover.select", item: command })
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

    expect(document.activeElement).toBe(editor)
    editor.remove()
    search.remove()
    input.dispose()
  })
})
