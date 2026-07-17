import { afterEach, describe, expect, test } from "bun:test"
import { createSignal } from "solid-js"
import type { PromptInputV2PersistedState } from "@opencode-ai/session-ui/v2/prompt-input"
import {
  parsePromptInputV2Editor,
  promptInputV2EditorCursor,
  renderPromptInputV2Editor,
  setPromptInputV2EditorCursor,
  visiblePromptInputV2Control,
} from "@opencode-ai/session-ui/v2/prompt-input"

afterEach(() => {
  document.body.replaceChildren()
})

describe("prompt input v2 editor", () => {
  test("preserves resource and selection metadata after editing", () => {
    const editor = document.createElement("div")
    const resource: PromptInputV2PersistedState["prompt"][number] = {
      type: "file",
      path: "resource://docs",
      content: "@docs",
      start: 0,
      end: 5,
      url: "resource://docs",
      selection: { startLine: 2, startChar: 1, endLine: 3, endChar: 4 },
      source: {
        type: "resource",
        clientName: "docs",
        uri: "resource://docs",
        text: { value: "@docs", start: 0, end: 5 },
      },
    }

    renderPromptInputV2Editor(editor, [resource])
    editor.append(document.createTextNode(" after"))

    expect(parsePromptInputV2Editor(editor)).toEqual([resource, { type: "text", content: " after", start: 5, end: 11 }])
  })

  test("restores a programmatic cursor after a mention", () => {
    const editor = document.createElement("div")
    editor.contentEditable = "true"
    document.body.append(editor)
    editor.focus()
    const prompt: PromptInputV2PersistedState["prompt"] = [
      { type: "text", content: "a ", start: 0, end: 2 },
      { type: "file", path: "x", content: "@x", start: 2, end: 4 },
      { type: "text", content: " z", start: 4, end: 6 },
    ]

    renderPromptInputV2Editor(editor, prompt, 4)

    expect(promptInputV2EditorCursor(editor)).toBe(4)
  })

  test("reacts to agent control visibility", () => {
    const [visible, setVisible] = createSignal(false)
    const control = {
      visible,
      options: () => [{ id: "build", label: "build" }],
      current: () => "build",
      onSelect: () => {},
    }

    expect(visiblePromptInputV2Control(control)).toBeUndefined()
    setVisible(true)
    expect(visiblePromptInputV2Control(control)).toBe(control)
    setVisible(false)
    expect(visiblePromptInputV2Control(control)).toBeUndefined()
  })

  test("counts a br as a single logical newline for both getter and setter", () => {
    const editor = document.createElement("div")
    editor.contentEditable = "true"
    document.body.append(editor)
    editor.append(document.createTextNode("foo"), document.createElement("br"), document.createTextNode("bar"))

    setPromptInputV2EditorCursor(editor, 4)
    expect(promptInputV2EditorCursor(editor)).toBe(4)
    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\nbar", start: 0, end: 7 }])

    setPromptInputV2EditorCursor(editor, 0)
    expect(promptInputV2EditorCursor(editor)).toBe(0)

    setPromptInputV2EditorCursor(editor, 7)
    expect(promptInputV2EditorCursor(editor)).toBe(7)
    editor.remove()
  })

  test("counts synthetic newlines between adjacent block boundaries", () => {
    const editor = document.createElement("div")
    editor.contentEditable = "true"
    document.body.append(editor)
    const first = document.createElement("div")
    first.append(document.createTextNode("foo"))
    const second = document.createElement("div")
    second.append(document.createTextNode("bar"))
    editor.append(first, second)

    // Cursor at the start of the second block lands after the synthetic boundary.
    setPromptInputV2EditorCursor(editor, 4)
    expect(promptInputV2EditorCursor(editor)).toBe(4)
    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\nbar", start: 0, end: 7 }])
    editor.remove()
  })

  test("counts a boundary before a top-level block", () => {
    const editor = document.createElement("div")
    const block = document.createElement("div")
    block.textContent = "bar"
    editor.append(document.createTextNode("foo"), block)
    document.body.append(editor)

    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\nbar", start: 0, end: 7 }])
    setPromptInputV2EditorCursor(editor, 4)
    expect(promptInputV2EditorCursor(editor)).toBe(4)
  })

  test("ignores Chromium terminal break sentinels", () => {
    const editor = document.createElement("div")
    editor.append(document.createTextNode("foo"), document.createElement("br"), document.createElement("br"))
    document.body.append(editor)
    const range = document.createRange()
    range.setStart(editor, 2)
    range.collapse(true)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\n", start: 0, end: 4 }])
    expect(promptInputV2EditorCursor(editor)).toBe(4)
    setPromptInputV2EditorCursor(editor, 4)
    expect(promptInputV2EditorCursor(editor)).toBe(4)
  })

  test("ignores Chromium terminal text sentinels", () => {
    const editor = document.createElement("div")
    const content = document.createTextNode("foo")
    const newline = document.createTextNode("\n")
    const sentinel = document.createTextNode("\n")
    editor.append(content, newline, sentinel, document.createTextNode(""))
    document.body.append(editor)
    const range = document.createRange()
    range.setStart(sentinel, 0)
    range.collapse(true)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\n", start: 0, end: 4 }])
    expect(promptInputV2EditorCursor(editor)).toBe(4)

    range.setStart(content, 1)
    range.collapse(true)
    selection?.removeAllRanges()
    selection?.addRange(range)
    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\n", start: 0, end: 4 }])
    expect(promptInputV2EditorCursor(editor)).toBe(1)

    setPromptInputV2EditorCursor(editor, 4)
    expect(promptInputV2EditorCursor(editor)).toBe(4)
  })

  test("preserves valid adjacent trailing newline text parts", () => {
    const editor = document.createElement("div")
    document.body.append(editor)
    renderPromptInputV2Editor(editor, [
      { type: "text", content: "foo", start: 0, end: 3 },
      { type: "text", content: "\n", start: 3, end: 4 },
      { type: "text", content: "\n", start: 4, end: 5 },
    ])

    expect(editor.childNodes).toHaveLength(1)
    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "foo\n\n", start: 0, end: 5 }])
    setPromptInputV2EditorCursor(editor, 5)
    expect(promptInputV2EditorCursor(editor)).toBe(5)
  })

  test("places an empty editor caret before br sentinels", () => {
    for (const nested of [false, true]) {
      const editor = document.createElement("div")
      const parent = nested ? document.createElement("div") : editor
      parent.append(document.createElement("br"))
      if (nested) editor.append(parent)
      document.body.append(editor)

      setPromptInputV2EditorCursor(editor, 0)

      const selection = window.getSelection()
      expect(selection?.anchorNode).toBe(parent)
      expect(selection?.anchorOffset).toBe(0)
      editor.remove()
    }
  })

  test("reads a native caret anchored in a block after a br", () => {
    const editor = document.createElement("div")
    editor.contentEditable = "true"
    document.body.append(editor)
    const block = document.createElement("div")
    block.append(document.createTextNode("before"), document.createElement("br"), document.createTextNode("after"))
    editor.append(block)
    const range = document.createRange()
    range.setStart(block, 2)
    range.collapse(true)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)

    expect(promptInputV2EditorCursor(editor)).toBe(7)
    expect(parsePromptInputV2Editor(editor)).toEqual([{ type: "text", content: "before\nafter", start: 0, end: 12 }])
    editor.remove()
  })
})
