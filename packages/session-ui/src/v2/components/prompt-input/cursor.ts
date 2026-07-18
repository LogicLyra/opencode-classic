const BLOCK_TAGS = new Set(["DIV", "P"])
const sentinelTextNodes = new WeakSet<Text>()

export type PromptInputV2EditorSegment =
  | { kind: "text"; node: Text; length: number }
  | { kind: "mention"; element: HTMLElement; length: number }
  | { kind: "break"; element: HTMLElement }
  | { kind: "block-boundary"; previous: Node; next: Node }

function isBlock(node: Node): node is HTMLElement {
  return node instanceof HTMLElement && BLOCK_TAGS.has(node.tagName)
}

function hasBlockBoundary(previous: Node, next: Node) {
  return isBlock(previous) || isBlock(next)
}

function isSentinelBreak(element: HTMLElement, editor: HTMLElement) {
  const parent = element.parentNode
  if (!parent) return false
  if (parent.childNodes.length === 1 && (parent === editor || (isBlock(parent) && parent.parentNode === editor))) {
    return true
  }
  const previous = element.previousSibling
  return element === parent.lastChild && previous instanceof HTMLElement && previous.tagName === "BR"
}

function isSentinelText(node: Text, editor: HTMLElement) {
  if (node.parentNode !== editor || node.data !== "\n") return false
  const previous = node.previousSibling
  if (!(previous instanceof Text) || previous.data !== "\n") return false
  for (let next = node.nextSibling; next; next = next.nextSibling) {
    if (!(next instanceof Text) || next.data !== "") return false
  }
  if (sentinelTextNodes.has(node)) return true
  const selection = window.getSelection()
  if (selection?.isCollapsed !== true || selection.anchorNode !== node || selection.anchorOffset !== 0) return false
  sentinelTextNodes.add(node)
  return true
}

function sentinelCaretAnchor(editor: HTMLElement): { node: Node; offset: number } | undefined {
  for (const node of editor.childNodes) {
    if (node instanceof Text && isSentinelText(node, editor)) return { node, offset: 0 }
  }
  const element = Array.from(editor.querySelectorAll<HTMLElement>("br")).find((item) => isSentinelBreak(item, editor))
  if (!element) return undefined
  const parent = element.parentNode
  if (!parent) return undefined
  return { node: parent, offset: Array.from(parent.childNodes).indexOf(element) }
}

export function promptInputV2EditorSegments(editor: HTMLElement): PromptInputV2EditorSegment[] {
  const segments: PromptInputV2EditorSegment[] = []
  const visit = (node: Node) => {
    if (node instanceof Text) {
      if (isSentinelText(node, editor)) return
      segments.push({ kind: "text", node, length: node.data.length })
      return
    }
    if (!(node instanceof HTMLElement)) return
    if (node.dataset.mention) {
      segments.push({ kind: "mention", element: node, length: node.textContent?.length ?? 0 })
      return
    }
    if (node.tagName === "BR") {
      if (isSentinelBreak(node, editor)) return
      segments.push({ kind: "break", element: node })
      return
    }
    Array.from(node.childNodes).forEach(visit)
  }

  const children = Array.from(editor.childNodes)
  children.forEach((node, index) => {
    visit(node)
    const next = children[index + 1]
    if (next && hasBlockBoundary(node, next)) {
      segments.push({ kind: "block-boundary", previous: node, next })
    }
  })
  return segments
}

function nodeLength(node: Node, editor: HTMLElement): number {
  if (node instanceof Text) return isSentinelText(node, editor) ? 0 : node.data.length
  if (!(node instanceof HTMLElement)) return 0
  if (node.dataset.mention) return node.textContent?.length ?? 0
  if (node.tagName === "BR") return isSentinelBreak(node, editor) ? 0 : 1
  return Array.from(node.childNodes).reduce((total, child) => total + nodeLength(child, editor), 0)
}

function editorLength(editor: HTMLElement) {
  return promptInputV2EditorSegments(editor).reduce(
    (total, segment) => total + (segment.kind === "text" || segment.kind === "mention" ? segment.length : 1),
    0,
  )
}

function offsetWithin(node: Node, anchor: Node, anchorOffset: number, editor: HTMLElement): number {
  if (node instanceof Text) {
    if (isSentinelText(node, editor)) return 0
    return node === anchor ? Math.max(0, Math.min(anchorOffset, node.data.length)) : node.data.length
  }
  if (!(node instanceof HTMLElement)) return 0
  if (node.dataset.mention) {
    const length = node.textContent?.length ?? 0
    if (node === anchor || node.contains(anchor)) return anchorOffset === 0 ? 0 : length
    return length
  }
  if (node.tagName === "BR") return isSentinelBreak(node, editor) || (node === anchor && anchorOffset === 0) ? 0 : 1

  const children = Array.from(node.childNodes)
  if (node === anchor) {
    return children
      .slice(0, Math.max(0, Math.min(anchorOffset, children.length)))
      .reduce((total, child) => total + nodeLength(child, editor), 0)
  }

  let offset = 0
  for (const child of children) {
    if (child === anchor || child.contains(anchor)) return offset + offsetWithin(child, anchor, anchorOffset, editor)
    offset += nodeLength(child, editor)
  }
  return offset
}

export function promptInputV2EditorCursor(editor: HTMLElement): number {
  const selection = window.getSelection()
  const anchor = selection?.anchorNode
  if (!selection?.rangeCount || !anchor || !editor.contains(anchor)) return editorLength(editor)

  const children = Array.from(editor.childNodes)
  if (anchor === editor) {
    const end = Math.max(0, Math.min(selection.anchorOffset, children.length))
    let offset = 0
    for (let index = 0; index < end; index++) {
      const child = children[index]
      offset += nodeLength(child, editor)
      const next = children[index + 1]
      if (next && hasBlockBoundary(child, next)) offset += 1
    }
    return offset
  }

  let offset = 0
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child === anchor || child.contains(anchor)) {
      return offset + offsetWithin(child, anchor, selection.anchorOffset, editor)
    }
    offset += nodeLength(child, editor)
    const next = children[index + 1]
    if (next && hasBlockBoundary(child, next)) offset += 1
  }
  return offset
}

function placeRange(range: Range, selection: Selection) {
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

export function setPromptInputV2EditorCursor(editor: HTMLElement | undefined, cursor?: number) {
  if (!editor) return
  const selection = window.getSelection()
  if (!selection) return
  const segments = promptInputV2EditorSegments(editor)
  let remaining = Math.max(0, Math.min(cursor ?? editorLength(editor), editorLength(editor)))

  for (const segment of segments) {
    const range = document.createRange()
    if (segment.kind === "text") {
      if (remaining <= segment.length) {
        range.setStart(segment.node, remaining)
        placeRange(range, selection)
        return
      }
      remaining -= segment.length
      continue
    }
    if (segment.kind === "mention") {
      if (remaining === 0) range.setStartBefore(segment.element)
      else if (remaining <= segment.length) range.setStartAfter(segment.element)
      else {
        remaining -= segment.length
        continue
      }
      placeRange(range, selection)
      return
    }
    if (segment.kind === "break") {
      if (remaining === 0) range.setStartBefore(segment.element)
      else if (remaining <= 1) range.setStartAfter(segment.element)
      else {
        remaining -= 1
        continue
      }
      placeRange(range, selection)
      return
    }
    if (remaining === 0) {
      range.selectNodeContents(segment.previous)
      range.collapse(false)
    } else if (remaining <= 1) {
      range.setStartBefore(segment.next)
    } else {
      remaining -= 1
      continue
    }
    placeRange(range, selection)
    return
  }

  const range = document.createRange()
  const sentinel = sentinelCaretAnchor(editor)
  if (sentinel) range.setStart(sentinel.node, sentinel.offset)
  else {
    range.selectNodeContents(editor)
    range.collapse(false)
  }
  placeRange(range, selection)
}
