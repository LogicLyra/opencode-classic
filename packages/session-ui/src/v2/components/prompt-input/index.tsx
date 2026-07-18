import { createEffect, createMemo, For, Show, untrack, type JSX } from "solid-js"
import { FileIcon } from "@opencode-ai/ui/file-icon"
import { Icon } from "@opencode-ai/ui/icon"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { ProviderIcon } from "@opencode-ai/ui/provider-icon"
import { ButtonV2 } from "@opencode-ai/ui/v2/button-v2"
import { Icon as IconV2 } from "@opencode-ai/ui/v2/icon"
import { IconButtonV2 } from "@opencode-ai/ui/v2/icon-button-v2"
import { KeybindV2 } from "@opencode-ai/ui/v2/keybind-v2"
import { MenuV2 } from "@opencode-ai/ui/v2/menu-v2"
import { TooltipV2 } from "@opencode-ai/ui/v2/tooltip-v2"
import { AttachmentCardV2 } from "../attachment-card-v2"
import { CommentCardV2 } from "../comment-card-v2"
import { typeLabel } from "../../../components/message-file"
import type {
  PromptInputV2Attachment,
  PromptInputV2Comment,
  PromptInputV2Option,
  PromptInputV2PersistedState,
  PromptInputV2Prompt,
  PromptInputV2Suggestion,
} from "./types"
import type { PromptInputV2Interaction, PromptInputV2SelectControl } from "./interaction"
import { promptInputV2EditorCursor, promptInputV2EditorSegments, setPromptInputV2EditorCursor } from "./cursor"

export { promptInputV2EditorCursor, setPromptInputV2EditorCursor } from "./cursor"

export type {
  PromptInputV2Attachment,
  PromptInputV2Comment,
  PromptInputV2Option,
  PromptInputV2PersistedState,
  PromptInputV2Suggestion,
} from "./types"

export type PromptInputV2Mode = "normal" | "shell"

export type PromptInputV2Labels = {
  emptyResults: string
  commands: string
  dropFiles: string
  prompt: string
  removeAttachment: string
  placeholderNormal: string
  placeholderShell: string
  addFiles: string
  imagesAndFiles: string
  context: string
  shellCommand: string
  chooseAgent: string
  chooseModel: string
  chooseVariant: string
  send: string
  stop: string
}

const defaultLabels: PromptInputV2Labels = {
  emptyResults: "No matching items",
  commands: "Commands",
  dropFiles: "Drop files to attach",
  prompt: "Prompt",
  removeAttachment: "Remove attachment",
  placeholderNormal: "Ask anything, / for commands, @ for context...",
  placeholderShell: "Enter shell command...",
  addFiles: "Add images and files",
  imagesAndFiles: "Images and files",
  context: "Context",
  shellCommand: "Shell command",
  chooseAgent: "Choose agent",
  chooseModel: "Choose model",
  chooseVariant: "Choose model variant",
  send: "Send",
  stop: "Stop",
}

export type PromptInputV2Props = {
  controller: PromptInputV2Interaction
  disabled?: boolean
  readOnly?: boolean
  class?: string
  modelControl?: JSX.Element
  labels?: Partial<PromptInputV2Labels>
}

export function PromptInputV2(props: PromptInputV2Props) {
  const state = props.controller.state
  const view = props.controller.view
  const label = <K extends keyof PromptInputV2Labels>(key: K) => props.labels?.[key] ?? defaultLabels[key]
  const agent = () =>
    view.agent && (view.agent.visible?.() ?? true) ? view.agent : undefined
  let editor: HTMLDivElement | undefined
  let localInput = false
  const updateCursor = () => {
    if (!editor || !window.getSelection()?.isCollapsed) return
    props.controller.onCursor(promptInputV2EditorCursor(editor))
  }
  const mode = createMemo(() => state.mode)
  const buttons = createMemo(() => ({
    opacity: mode() === "normal" ? 1 : 0,
    "pointer-events": mode() === "normal" ? ("auto" as const) : ("none" as const),
    transition: "opacity 200ms ease",
  }))

  createEffect(() => {
    const parts = props.controller.parts()
    if (!editor) return
    if (localInput) {
      localInput = false
      return
    }
    renderPromptInputV2Editor(
      editor,
      parts,
      untrack(() => props.controller.cursor()),
    )
  })

  return (
    <div class={`relative size-full flex flex-col gap-0 ${props.class ?? ""}`}>
      <input
        ref={props.controller.setFileInput}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/gif,image/webp,application/pdf,text/*,application/json,application/ld+json,application/toml,application/x-toml,application/x-yaml,application/xml,application/yaml,.c,.cc,.cjs,.conf,.cpp,.css,.csv,.cts,.env,.go,.gql,.graphql,.h,.hh,.hpp,.htm,.html,.ini,.java,.js,.json,.jsx,.log,.md,.mdx,.mjs,.mts,.py,.rb,.rs,.sass,.scss,.sh,.sql,.toml,.ts,.tsx,.txt,.xml,.yaml,.yml,.zsh"
        class="hidden"
        onChange={(event) => {
          const list = event.currentTarget.files
          if (list) props.controller.addAttachments(Array.from(list))
          event.currentTarget.value = ""
        }}
      />
      <Show when={state.popover.type !== "closed"}>
        <PromptInputV2Popover
          emptyLabel={label("emptyResults")}
          items={props.controller.suggestions()}
          activeID={state.popover.type === "closed" ? undefined : state.popover.activeID}
          search={
            state.popover.type === "command-menu"
              ? {
                  value: state.popover.query,
                  label: label("commands"),
                  placeholder: "/",
                  onValueChange: props.controller.setQuery,
                  onKeyDown: props.controller.onKeyDown,
                }
              : undefined
          }
          onActiveChange={(item) => props.controller.dispatch({ type: "popover.active", id: item.id })}
          onSelect={(item) => props.controller.dispatch({ type: "popover.select", item })}
        />
      </Show>
      <form
        data-component="prompt-input-v2"
        class="group/prompt-input relative min-h-[96px] w-full rounded-xl bg-v2-background-bg-base shadow-[var(--v2-elevation-raised)]"
        classList={{ "border border-v2-icon-icon-info border-dashed": state.drag === "active" }}
        onSubmit={(event) => {
          event.preventDefault()
          if (!props.disabled) props.controller.submit()
        }}
        onDragEnter={props.controller.onDragEnter}
        onDragOver={props.controller.onDragOver}
        onDragLeave={props.controller.onDragLeave}
        onDrop={props.controller.onDrop}
      >
        <Show when={state.drag === "active"}>
          <div class="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-xl bg-v2-background-bg-base/90 text-v2-text-text-base">
            {label("dropFiles")}
          </div>
        </Show>

        <Show when={state.mode === "normal"}>
          <PromptInputV2Attachments
            attachments={props.controller.attachments()}
            comments={props.controller.comments()}
            activeCommentID={state.activeContextID}
            removeLabel={label("removeAttachment")}
            onAttachmentClick={props.controller.openAttachment}
            onAttachmentRemove={(attachment) => props.controller.removeAttachment(attachment.id)}
            onCommentClick={(comment) => props.controller.toggleContext(comment.key)}
            onCommentRemove={(comment) => props.controller.removeContext(comment.key)}
          />
        </Show>

        <div class="relative min-h-[60px]">
          <div
            ref={(element) => {
              editor = element
              props.controller.setEditor(element)
              renderPromptInputV2Editor(element, props.controller.parts(), props.controller.cursor())
            }}
            data-component="prompt-input"
            role="textbox"
            aria-multiline="true"
            aria-label={label("prompt")}
            contenteditable={!props.disabled && !props.readOnly}
            autocapitalize={state.mode === "normal" ? "sentences" : "off"}
            autocorrect={state.mode === "normal" ? "on" : "off"}
            spellcheck={state.mode === "normal"}
            // @ts-expect-error
            autocomplete="off"
            class={
              "relative z-10 block min-h-[60px] max-h-[180px] w-full overflow-y-auto whitespace-pre-wrap bg-transparent px-4 pt-4 pb-2 text-[13px] font-[440] leading-5 text-v2-text-text-base focus:outline-none empty:before:content-['\\200B'] [&_[data-mention=file]]:text-syntax-property [&_[data-mention=agent]]:text-syntax-type [&_[data-mention=reference]]:text-syntax-keyword"
            }
            classList={{ "font-mono!": state.mode === "shell", "opacity-50": props.disabled }}
            onInput={(event) => {
              const cursor = promptInputV2EditorCursor(event.currentTarget)
              const prompt = parsePromptInputV2Editor(event.currentTarget)
              const images = props.controller.parts().filter((part) => part.type === "image")
              localInput = true
              props.controller.onInput(prompt.map((part) => part.content).join(""), [...prompt, ...images], cursor)
            }}
            onKeyDown={(event) => {
              if (props.controller.onKeyDown(event)) return
              if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
                event.preventDefault()
                if (event.repeat) return
                props.controller.submit()
              }
            }}
            onKeyUp={updateCursor}
            onPointerUp={updateCursor}
            onPaste={props.controller.onPaste}
            onFocus={() => props.controller.dispatch({ type: "focus.editor" })}
          />
          <Show when={!props.controller.value()}>
            <div
              class="pointer-events-none absolute inset-x-0 top-0 px-4 pt-4 text-[13px] font-[440] leading-5 text-v2-text-text-faint"
              classList={{ "font-mono!": state.mode === "shell" }}
            >
              {view.placeholder?.() ??
                (state.mode === "shell" ? label("placeholderShell") : label("placeholderNormal"))}
            </div>
          </Show>
        </div>

        <div class="flex h-11 items-center px-2">
          <div
            class="flex min-w-0 flex-1 items-center gap-1"
            aria-hidden={state.mode === "shell"}
            inert={state.mode === "shell" ? true : undefined}
            style={buttons()}
          >
            <PromptInputV2AddMenu
              disabled={state.mode === "shell"}
              title={label("addFiles")}
              keybind={["Mod", "U"]}
              attachLabel={label("imagesAndFiles")}
              attachShortcut="Mod+U"
              commandsLabel={label("commands")}
              contextLabel={label("context")}
              shellLabel={label("shellCommand")}
              onAttach={props.controller.attach}
              onCommands={props.controller.openCommands}
              onContext={props.controller.openContext}
              onShell={props.controller.openShell}
            />
            <Show when={agent()}>
              {(control) => (
                <PromptInputV2ConfiguredSelect
                  title={label("chooseAgent")}
                  keybind={["Mod", "."]}
                  control={control()}
                />
              )}
            </Show>
            <Show
              when={props.modelControl}
              fallback={
                <Show when={view.model}>
                  {(control) => (
                    <PromptInputV2ConfiguredSelect
                      title={label("chooseModel")}
                      keybind={["Mod", "M"]}
                      control={control()}
                      model
                    />
                  )}
                </Show>
              }
            >
              {props.modelControl}
            </Show>
            <Show when={view.variant}>
              {(control) => (
                <Show when={control().options().length > 1}>
                  <PromptInputV2ConfiguredSelect title={label("chooseVariant")} control={control()} />
                </Show>
              )}
            </Show>
          </div>
          <PromptInputV2SubmitButton
            mode={state.mode}
            stopping={view.submit.stopping()}
            disabled={!props.controller.canSubmit()}
            sendLabel={label("send")}
            stopLabel={label("stop")}
            onSubmit={props.controller.submit}
            onStop={props.controller.stop}
          />
        </div>
      </form>
    </div>
  )
}

type PromptInputV2Mention = Extract<PromptInputV2Prompt[number], { type: "file" | "agent" }>
const promptInputV2Mentions = new WeakMap<HTMLElement, PromptInputV2Mention>()

function renderPromptInputV2Editor(editor: HTMLDivElement, prompt: PromptInputV2Prompt, cursor?: number) {
  const active = document.activeElement === editor
  const nodes: Node[] = []
  for (const part of prompt) {
    if (part.type === "image") continue
    if (part.type === "text") {
      const previous = nodes.at(-1)
      if (previous instanceof Text) previous.data += part.content
      else nodes.push(document.createTextNode(part.content))
      continue
    }
    const mention = document.createElement("span")
    mention.textContent = part.content
    mention.contentEditable = "false"
    mention.dataset.mention =
      part.type === "file" && part.mime === "application/x-directory" ? "reference" : part.type
    if (part.type === "agent") mention.dataset.name = part.name
    if (part.type === "file") {
      mention.dataset.path = part.path
      if (part.mime) mention.dataset.mime = part.mime
      if (part.filename) mention.dataset.filename = part.filename
    }
    promptInputV2Mentions.set(mention, part)
    nodes.push(mention)
  }
  editor.replaceChildren(...nodes)
  if (!active) return
  setPromptInputV2EditorCursor(editor, cursor)
}

function parsePromptInputV2Editor(editor: HTMLDivElement) {
  const parts: Exclude<PromptInputV2Prompt[number], PromptInputV2Attachment>[] = []
  let buffer = ""
  let position = 0

  const flush = () => {
    if (!buffer) return
    parts.push({ type: "text", content: buffer, start: position, end: position + buffer.length })
    position += buffer.length
    buffer = ""
  }
  const mention = (element: HTMLElement) => {
    flush()
    const content = element.textContent ?? ""
    const original = promptInputV2Mentions.get(element)
    const start = position
    const end = start + content.length
    if (element.dataset.mention === "agent") {
      const agent = original?.type === "agent" ? original : undefined
      parts.push({
        ...agent,
        type: "agent",
        name: agent?.name ?? element.dataset.name ?? content.slice(1),
        content,
        start,
        end,
      })
      position = end
      return
    }
    const file = original?.type === "file" ? original : undefined
    const source = file?.source
      ? { ...file.source, text: { ...file.source.text, value: content, start, end } }
      : undefined
    parts.push({
      ...file,
      type: "file",
      path: file?.path ?? element.dataset.path ?? content.slice(1),
      content,
      start,
      end,
      ...(element.dataset.mime ? { mime: element.dataset.mime } : {}),
      ...(element.dataset.filename ? { filename: element.dataset.filename } : {}),
      ...(source ? { source } : {}),
    })
    position = end
  }

  for (const segment of promptInputV2EditorSegments(editor)) {
    if (segment.kind === "text") {
      buffer += segment.node.textContent ?? ""
      continue
    }
    if (segment.kind === "break" || segment.kind === "block-boundary") {
      buffer += "\n"
      continue
    }
    mention(segment.element)
  }
  flush()
  if (
    parts.every((part) => part.type === "text") &&
    parts.every((part) => part.content.replace(/[\n\u200B]/g, "") === "")
  ) {
    return [{ type: "text" as const, content: "", start: 0, end: 0 }]
  }
  if (parts.length > 0) return parts
  return [{ type: "text" as const, content: "", start: 0, end: 0 }]
}

export function PromptInputV2Attachments(props: {
  attachments: PromptInputV2Attachment[]
  comments?: PromptInputV2Comment[]
  activeCommentID?: string
  removeLabel: string
  onAttachmentClick?: (attachment: PromptInputV2Attachment) => void
  onAttachmentRemove: (attachment: PromptInputV2Attachment) => void
  onCommentClick?: (comment: PromptInputV2Comment) => void
  onCommentRemove?: (comment: PromptInputV2Comment) => void
}) {
  return (
    <Show when={props.attachments.length > 0 || (props.comments?.length ?? 0) > 0}>
      <div data-slot="prompt-attachments" class="relative">
        <div
          data-slot="prompt-attachments-scroll"
          class="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar px-2 pt-2 pb-1"
        >
          <For each={props.comments ?? []}>
            {(comment) => (
              <div class="relative group shrink-0">
                <TooltipV2
                  value={comment.comment}
                  placement="top"
                  openDelay={800}
                  contentClass="max-w-[300px] break-words"
                >
                  <CommentCardV2
                    comment={comment.comment ?? ""}
                    path={comment.path}
                    selection={comment.selection}
                    active={comment.key === props.activeCommentID}
                    onClick={() => props.onCommentClick?.(comment)}
                  />
                </TooltipV2>
                <button
                  type="button"
                  onClick={() => props.onCommentRemove?.(comment)}
                  class="absolute -top-1 -right-1 size-4 rounded-full bg-v2-icon-icon-muted outline-solid outline-1 outline-v2-icon-icon-contrast flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={props.removeLabel}
                >
                  <IconV2 name="outline-xmark" class="text-v2-icon-icon-contrast" />
                </button>
              </div>
            )}
          </For>
          <For each={props.attachments}>
            {(attachment) => (
              <div class="relative group shrink-0">
                <TooltipV2 value={attachment.filename} placement="top" contentClass="break-all">
                  <Show
                    when={attachment.mime.startsWith("image/")}
                    fallback={
                      <AttachmentCardV2 title={attachment.filename}>
                        {typeLabel(attachment.filename, attachment.mime)}
                      </AttachmentCardV2>
                    }
                  >
                    <img
                      src={attachment.dataUrl}
                      alt={attachment.filename}
                      class="w-[58px] h-[46px] rounded-[6px] object-cover"
                      onClick={() => props.onAttachmentClick?.(attachment)}
                    />
                    <div class="absolute inset-0 rounded-[6px] shadow-[inset_0_0_0_0.5px_var(--v2-border-border-base)] pointer-events-none" />
                  </Show>
                </TooltipV2>
                <button
                  type="button"
                  onClick={() => props.onAttachmentRemove(attachment)}
                  class="absolute -top-1 -right-1 size-4 rounded-full bg-v2-icon-icon-muted outline-solid outline-1 outline-v2-icon-icon-contrast flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={props.removeLabel}
                >
                  <IconV2 name="outline-xmark" class="text-v2-icon-icon-contrast" />
                </button>
              </div>
            )}
          </For>
        </div>
        <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-[linear-gradient(to_right,var(--v2-background-bg-base),transparent)]" />
        <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-[linear-gradient(to_left,var(--v2-background-bg-base),transparent)]" />
      </div>
    </Show>
  )
}

export function PromptInputV2AddMenu(props: {
  disabled?: boolean
  title: string
  keybind?: string[]
  attachLabel: string
  attachShortcut?: string
  commandsLabel: string
  contextLabel: string
  shellLabel: string
  onAttach: () => void
  onCommands: () => void
  onContext: () => void
  onShell: () => void
}) {
  return (
    <TooltipV2
      placement="top"
      value={
        <>
          {props.title}
          <KeybindV2 keys={props.keybind ?? []} variant="neutral" />
        </>
      }
    >
      <MenuV2 gutter={6} modal={false} placement="top-start">
        <MenuV2.Trigger
          as={IconButtonV2}
          data-action="prompt-attach"
          type="button"
          icon={<IconV2 name="plus" />}
          variant="ghost-muted"
          size="large"
          disabled={props.disabled}
          aria-label={props.title}
        />
        <MenuV2.Portal>
          <MenuV2.Content style={{ "min-width": "180px" }}>
            <MenuV2.Item onSelect={props.onAttach} shortcut={props.attachShortcut}>
              {props.attachLabel}
            </MenuV2.Item>
            <MenuV2.Separator />
            <MenuV2.Item onSelect={props.onCommands} shortcut="/">
              {props.commandsLabel}
            </MenuV2.Item>
            <MenuV2.Item onSelect={props.onContext} shortcut="@">
              {props.contextLabel}
            </MenuV2.Item>
            <MenuV2.Item onSelect={props.onShell} shortcut="!">
              {props.shellLabel}
            </MenuV2.Item>
          </MenuV2.Content>
        </MenuV2.Portal>
      </MenuV2>
    </TooltipV2>
  )
}

function PromptInputV2ConfiguredSelect(props: {
  title: string
  keybind?: string[]
  control: PromptInputV2SelectControl
  model?: boolean
}) {
  const current = () => props.control.current()
  const providerID = () => props.control.options().find((option) => option.id === current())?.providerID
  return (
    <PromptInputV2Select
      title={props.title}
      keybind={props.keybind}
      options={props.control.options()}
      current={current()}
      currentIcon={
        <Show when={props.model && providerID()}>
          <ProviderIcon id={providerID()!} class="size-4 shrink-0 opacity-60" />
        </Show>
      }
      onSelect={props.control.onSelect}
    />
  )
}

export function PromptInputV2Select(props: {
  title: string
  keybind?: string[]
  options: PromptInputV2Option[]
  current: string
  currentIcon?: JSX.Element
  class?: string
  onOpenChange?: (open: boolean) => void
  onSelect: (id: string) => void
}) {
  return (
    <MenuV2 gutter={6} modal={false} placement="top-start" onOpenChange={props.onOpenChange}>
      <MenuV2.Trigger
        as={ButtonV2}
        variant="ghost-muted"
        size="normal"
        class={`max-w-[220px] justify-start ![font-weight:440] ${props.class ?? ""}`}
        title={keybindTitle(props.title, props.keybind)}
      >
        {props.currentIcon}
        <span class="truncate capitalize leading-5">
          {props.options.find((option) => option.id === props.current)?.label ?? props.current}
        </span>
        <span class="-ml-0.5 -mr-1 flex shrink-0">
          <IconV2 name="chevron-down" />
        </span>
      </MenuV2.Trigger>
      <MenuV2.Portal>
        <MenuV2.Content>
          <MenuV2.RadioGroup value={props.current} onChange={props.onSelect}>
            <For each={props.options}>
              {(option) => (
                <MenuV2.RadioItem value={option.id} class="capitalize" closeOnSelect>
                  {option.label}
                </MenuV2.RadioItem>
              )}
            </For>
          </MenuV2.RadioGroup>
        </MenuV2.Content>
      </MenuV2.Portal>
    </MenuV2>
  )
}

export function PromptInputV2Popover(props: {
  emptyLabel: string
  items: PromptInputV2Suggestion[]
  activeID?: string
  search?: {
    value: string
    label: string
    placeholder: string
    onValueChange: (value: string) => void
    onKeyDown: (event: KeyboardEvent) => void
  }
  onActiveChange: (item: PromptInputV2Suggestion) => void
  onSelect: (item: PromptInputV2Suggestion) => void
}) {
  return (
    <div
      class="absolute inset-x-0 -top-2 z-40 flex max-h-80 -translate-y-full flex-col overflow-auto rounded-xl bg-v2-background-bg-base p-2 shadow-[var(--v2-elevation-raised)] no-scrollbar"
      onMouseDown={(event) => event.preventDefault()}
    >
      <Show when={props.search}>
        {(search) => (
          <div class="px-2 py-1">
            <input
              ref={(element) => requestAnimationFrame(() => element.focus())}
              value={search().value}
              aria-label={search().label}
              placeholder={search().placeholder}
              class="w-full bg-transparent text-[13px] leading-5 text-v2-text-text-base outline-none placeholder:text-v2-text-text-faint"
              onInput={(event) => search().onValueChange(event.currentTarget.value)}
              onKeyDown={(event) => search().onKeyDown(event)}
              onMouseDown={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </Show>
      <Show
        when={props.items.length > 0}
        fallback={<div class="px-2 py-1 text-v2-text-text-muted">{props.emptyLabel}</div>}
      >
        <For each={props.items}>
          {(item) => (
            <button
              type="button"
              data-suggestion-id={item.id}
              class="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-v2-overlay-simple-overlay-hover"
              classList={{ "bg-v2-overlay-simple-overlay-hover": props.activeID === item.id }}
              onPointerMove={() => props.onActiveChange(item)}
              onClick={() => props.onSelect(item)}
            >
              <div class="flex min-w-0 flex-1 items-center gap-2">
                <PromptInputV2SuggestionIcon item={item} />
                <span class="shrink-0 text-v2-text-text-base">{item.label}</span>
                <Show when={item.description}>
                  <span class="min-w-0 truncate text-v2-text-text-muted">{item.description}</span>
                </Show>
              </div>
              <Show when={item.keybind?.length}>
                <span class="shrink-0 text-v2-text-text-muted">{item.keybind?.join("+")}</span>
              </Show>
            </button>
          )}
        </For>
      </Show>
    </div>
  )
}

export function PromptInputV2SubmitButton(props: {
  mode: PromptInputV2Mode
  stopping: boolean
  disabled: boolean
  sendLabel: string
  stopLabel: string
  onSubmit: () => void
  onStop: () => void
}) {
  return (
    <TooltipV2
      placement="top"
      inactive={!props.stopping && props.disabled}
      value={props.stopping ? props.stopLabel : props.sendLabel}
    >
      <IconButton
        data-action="prompt-submit"
        type="button"
        disabled={!props.stopping && props.disabled}
        tabIndex={props.mode === "normal" ? undefined : -1}
        icon={props.stopping ? "stop" : props.mode === "shell" ? "arrow-undo-down" : "arrow-up"}
        variant="primary"
        class="size-7 rounded-md p-[6px] text-v2-icon-icon-muted shadow-[var(--v2-elevation-button-contrast)] disabled:opacity-50"
        style={{
          "background-image":
            "linear-gradient(180deg,var(--v2-alpha-light-20) 0%,var(--v2-alpha-light-0) 100%),linear-gradient(90deg,var(--v2-background-bg-contrast) 0%,var(--v2-background-bg-contrast) 100%)",
        }}
        aria-label={props.stopping ? props.stopLabel : props.sendLabel}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (props.stopping) {
            props.onStop()
            return
          }
          props.onSubmit()
        }}
      />
    </TooltipV2>
  )
}

function PromptInputV2SuggestionIcon(props: { item: PromptInputV2Suggestion }) {
  if (props.item.kind === "agent") return <Icon name="brain" size="small" class="shrink-0 text-icon-info-active" />
  if (props.item.kind === "command") return null
  return (
    <FileIcon
      node={{ path: props.item.path ?? props.item.label, type: props.item.kind === "reference" ? "directory" : "file" }}
      class="size-4 shrink-0"
    />
  )
}

function keybindTitle(label: string, keybind?: string[]) {
  if (!keybind?.length) return label
  return `${label} (${keybind.join("+")})`
}
