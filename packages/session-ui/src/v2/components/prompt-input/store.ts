import { batch, type Accessor } from "solid-js"
import type { SetStoreFunction, Store } from "solid-js/store"
import type {
  PromptInputV2AgentPart,
  PromptInputV2Attachment,
  PromptInputV2Comment,
  PromptInputV2FilePart,
  PromptInputV2Model,
  PromptInputV2PersistedState,
  PromptInputV2Prompt,
} from "./types"

export type PromptInputV2StoreTuple = [
  Store<PromptInputV2PersistedState> | Accessor<Store<PromptInputV2PersistedState>>,
  SetStoreFunction<PromptInputV2PersistedState>,
]

export type PromptInputV2StoreInput = PromptInputV2StoreTuple | Accessor<PromptInputV2StoreTuple>

export function createPromptInputV2Store(input: PromptInputV2StoreInput) {
  const tuple = () => (typeof input === "function" ? input() : input)
  const store = () => {
    const value = tuple()[0]
    return typeof value === "function" ? value() : value
  }
  const setStore = () => tuple()[1]

  return {
    get state() {
      return store()
    },
    setPrompt(prompt: PromptInputV2Prompt, cursor?: number) {
      batch(() => {
        setStore()("prompt", prompt)
        if (cursor !== undefined) setStore()("cursor", cursor)
      })
    },
    setCursor(cursor: number) {
      setStore()("cursor", cursor)
    },
    setText(content: string) {
      batch(() => {
        setStore()("prompt", (prompt) => [
          { type: "text", content, start: 0, end: content.length },
          ...prompt.filter((part) => part.type !== "text"),
        ])
        setStore()("cursor", content.length)
      })
    },
    insertText(content: string) {
      if (!content) return
      const prompt = store().prompt
      const length = prompt.reduce((total, part) => total + ("content" in part ? part.content.length : 0), 0)
      const cursor = Math.max(0, Math.min(store().cursor ?? length, length))
      batch(() => {
        setStore()("prompt", insertPromptText(prompt, cursor, content))
        setStore()("cursor", cursor + content.length)
      })
    },
    prependText(content: string) {
      if (!content) return
      const prompt = insertPromptText(store().prompt, 0, content)
      batch(() => {
        setStore()("prompt", prompt)
        setStore()("cursor", promptLength(prompt))
      })
    },
    clearText() {
      batch(() => {
        setStore()("prompt", (prompt) => [
          { type: "text", content: "", start: 0, end: 0 },
          ...prompt.filter((part): part is PromptInputV2Attachment => part.type === "image"),
        ])
        setStore()("cursor", 0)
      })
    },
    reset() {
      batch(() => {
        setStore()("prompt", [{ type: "text", content: "", start: 0, end: 0 }])
        setStore()("cursor", 0)
      })
    },
    setModel(model: PromptInputV2Model | undefined) {
      setStore()("model", model)
    },
    setVariant(variant: string | null) {
      if (store().model) setStore()("model", "variant", variant)
    },
    addContext(item: PromptInputV2Comment) {
      if (store().context.items.some((entry) => entry.key === item.key)) return
      setStore()("context", "items", (items) => [...items, item])
    },
    removeContext(key: string) {
      setStore()("context", "items", (items) => items.filter((item) => item.key !== key))
    },
    addMention(mention: PromptInputV2FilePart | PromptInputV2AgentPart) {
      const prompt = store().prompt
      const length = promptLength(prompt)
      const cursor = Math.max(0, Math.min(store().cursor ?? length, length))
      const trigger = findMentionTrigger(prompt, cursor)
      const result = insertMention(prompt, trigger?.start ?? cursor, trigger?.end ?? cursor, mention)
      batch(() => {
        setStore()("prompt", result.prompt)
        setStore()("cursor", result.cursor)
      })
    },
    addAttachment(attachment: PromptInputV2Attachment) {
      setStore()("prompt", (prompt) => [...prompt, attachment])
    },
    removeAttachment(id: string) {
      setStore()("prompt", (parts) => parts.filter((part) => part.type !== "image" || part.id !== id))
    },
  }
}

export type PromptInputV2Store = ReturnType<typeof createPromptInputV2Store>

function insertMention(
  prompt: PromptInputV2Prompt,
  start: number,
  end: number,
  mention: PromptInputV2FilePart | PromptInputV2AgentPart,
): { prompt: PromptInputV2Prompt; cursor: number } {
  let position = 0
  let inserted = false
  let insertion = start
  const parts: PromptInputV2Prompt = []
  for (const part of prompt) {
    if (part.type === "image") {
      if (!inserted && start === end && start <= position) {
        insertion = position
        parts.push(mention, { type: "text", content: " ", start: 0, end: 0 })
        inserted = true
      }
      parts.push(part)
      continue
    }
    const partStart = position
    position += part.content.length
    if (inserted) {
      parts.push(part)
      continue
    }
    if (part.type === "text" && start >= partStart && end <= position) {
      const before = part.content.slice(0, start - partStart)
      const after = part.content.slice(end - partStart)
      if (before) parts.push({ type: "text", content: before, start: 0, end: 0 })
      parts.push(mention, { type: "text", content: /^\s/.test(after) ? after : ` ${after}`, start: 0, end: 0 })
      inserted = true
      continue
    }
    if (start === end && start === partStart) {
      insertion = partStart
      parts.push(mention, { type: "text", content: " ", start: 0, end: 0 }, part)
      inserted = true
      continue
    }
    if (start === end && start <= position) {
      insertion = position
      parts.push(part, mention, { type: "text", content: " ", start: 0, end: 0 })
      inserted = true
      continue
    }
    parts.push(part)
  }
  if (!inserted) {
    insertion = position
    parts.push(mention, { type: "text", content: " ", start: 0, end: 0 })
  }
  return { prompt: withOffsets(parts), cursor: insertion + mention.content.length + 1 }
}

function findMentionTrigger(prompt: PromptInputV2Prompt, cursor: number): { start: number; end: number } | undefined {
  let position = 0
  for (const part of prompt) {
    if (part.type === "image") continue
    const partStart = position
    const partEnd = partStart + part.content.length
    position = partEnd
    if (part.type !== "text" || cursor < partStart || cursor > partEnd) continue
    const before = part.content.slice(0, cursor - partStart)
    const match = before.match(/(?:^|\s)@([^\s@]*)$/)
    if (!match) return undefined
    const atIndex = before.lastIndexOf("@")
    return { start: partStart + atIndex, end: cursor }
  }
  return undefined
}

function insertPromptText(prompt: PromptInputV2Prompt, cursor: number, content: string): PromptInputV2Prompt {
  let position = 0
  let inserted = false
  const text = { type: "text" as const, content, start: 0, end: 0 }
  const parts = prompt.flatMap<PromptInputV2Prompt[number]>((part) => {
    if (inserted) return [part]
    if (part.type === "image") {
      if (cursor > position) return [part]
      inserted = true
      return [text, part]
    }

    const start = position
    position += part.content.length
    if (part.type === "text" && cursor >= start && cursor <= position) {
      inserted = true
      const before = part.content.slice(0, cursor - start)
      const after = part.content.slice(cursor - start)
      return [{ ...part, content: before + content + after }]
    }
    if (cursor > start) return [part]
    inserted = true
    return [text, part]
  })
  if (!inserted) parts.push(text)
  return withOffsets(parts)
}

function withOffsets(prompt: PromptInputV2Prompt): PromptInputV2Prompt {
  let offset = 0
  return prompt.map((part) => {
    if (part.type === "image") return part
    const next = { ...part, start: offset, end: offset + part.content.length }
    offset = next.end
    if (next.type === "file" && next.source) {
      next.source = {
        ...next.source,
        text: { ...next.source.text, value: next.content, start: next.start, end: next.end },
      }
    }
    return next
  })
}

function promptLength(prompt: PromptInputV2Prompt) {
  return prompt.reduce((length, part) => length + ("content" in part ? part.content.length : 0), 0)
}
