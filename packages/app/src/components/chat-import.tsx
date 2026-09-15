import { Show, createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { useQueryClient } from "@tanstack/solid-query"
import { Button } from "@opencode-ai/ui/button"
import { Dialog } from "@opencode-ai/ui/dialog"
import { usePlatform } from "@/context/platform"
import { useLanguage } from "@/context/language"
import { ServerConnection, useServer } from "@/context/server"
import { useServerSDK } from "@/context/server-sdk"
import { useServerSync } from "@/context/server-sync"
import type { ChatImportResult } from "../chat-import"
import { ProfileImportPanel } from "./profile-import"

export function ChatImportPanel() {
  const platform = usePlatform()
  const language = useLanguage()
  const server = useServer()
  const sdk = useServerSDK()
  const sync = useServerSync()
  const queries = useQueryClient()
  const [state, setState] = createStore<{ busy: boolean; fullBusy: boolean; full: boolean; result?: ChatImportResult }>(
    { busy: false, fullBusy: false, full: false },
  )
  const local = () => !!platform.chatImport && !!server.current && ServerConnection.builtin(server.current)
  const ready = () => (state.result?.status === "ready" ? state.result : undefined)
  const summary = () => {
    const result = state.result
    return result?.status === "ready" || result?.status === "complete" ? result.summary : undefined
  }
  createEffect(() => {
    server.key
    setState("result", undefined)
  })

  async function run(confirm: boolean, chooseFile = false) {
    if (state.busy || !local() || !platform.chatImport) return
    const token = ready()?.token
    if (confirm && !token) return
    const key = server.key
    const current = sync()
    const scope = sdk().scope
    setState("busy", true)
    try {
      const result =
        confirm && token ? await platform.chatImport.confirm(token) : await platform.chatImport.preview(chooseFile)
      if (server.key === key) setState("result", result)
      if (result.status === "complete" && result.summary.imported > 0) {
        current.homeSessions.refresh("session.created")
        void queries.invalidateQueries({ predicate: (query) => query.queryKey[0] === scope })
      }
    } catch {
      if (server.key === key) setState("result", { status: "error", code: "invalid" })
    } finally {
      setState("busy", false)
    }
  }

  return (
    <section class="flex flex-col gap-4 p-6 text-14-regular text-text-base" aria-busy={state.busy}>
      <h2 class="text-16-medium text-text-strong">{language.t("chatImport.title")}</h2>
      <Show when={platform.profileImport}>
        <fieldset class="flex flex-wrap gap-4" disabled={state.busy || state.fullBusy}>
          <legend class="mb-2">{language.t("profileImport.mode")}</legend>
          <label class="flex gap-2 items-center">
            <input type="radio" name="import-mode" checked={!state.full} onChange={() => setState("full", false)} />
            {language.t("profileImport.chats")}
          </label>
          <label class="flex gap-2 items-center">
            <input type="radio" name="import-mode" checked={state.full} onChange={() => setState("full", true)} />
            {language.t("profileImport.everything")}
          </label>
        </fieldset>
      </Show>
      <Show when={!state.full} fallback={<ProfileImportPanel onBusy={(busy) => setState("fullBusy", busy)} />}>
        <p>{language.t("chatImport.description")}</p>
        <p class="text-text-weak">{language.t("chatImport.scope")}</p>
        <Show when={local()} fallback={<p role="status">{language.t("chatImport.localOnly")}</p>}>
          <div class="flex flex-wrap gap-2">
            <Button disabled={state.busy} onClick={() => void run(false)}>
              {language.t("chatImport.detect")}
            </Button>
            <Button disabled={state.busy} onClick={() => void run(false, true)}>
              {language.t("chatImport.browse")}
            </Button>
          </div>
          <div role="status" aria-live="polite">
            <Show when={state.busy}>{language.t("chatImport.busy")}</Show>
            <Show when={state.result?.status === "cancelled"}>{language.t("chatImport.noSource")}</Show>
            <Show when={state.result?.status === "complete"}>{language.t("chatImport.complete")}</Show>
          </div>
          <Show when={state.result?.status === "error" && state.result}>
            {(result) => <p role="alert">{language.t(`chatImport.error.${result().code}`)}</p>}
          </Show>
          <Show when={summary()}>
            {(value) => (
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 min-w-0">
                <dt>{language.t("chatImport.source")}</dt>
                <dd class="break-all">{value().source}</dd>
                <dt>{language.t("chatImport.destination")}</dt>
                <dd class="break-all">{value().destination}</dd>
                <dt>{language.t("chatImport.total")}</dt>
                <dd>{value().total}</dd>
                <dt>{language.t("chatImport.eligible")}</dt>
                <dd>{value().eligible}</dd>
                <dt>{language.t("chatImport.existing")}</dt>
                <dd>{value().existing}</dd>
                <dt>{language.t("chatImport.excluded")}</dt>
                <dd>{value().excluded}</dd>
                <dt>{language.t("chatImport.imported")}</dt>
                <dd>{value().imported}</dd>
              </dl>
            )}
          </Show>
          <Show when={ready()}>
            <Button
              variant="primary"
              disabled={state.busy || ready()?.summary.eligible === 0}
              onClick={() => void run(true)}
            >
              {language.t("chatImport.confirm")}
            </Button>
          </Show>
        </Show>
      </Show>
    </section>
  )
}

export function DialogChatImport() {
  const language = useLanguage()
  return (
    <Dialog title={language.t("chatImport.title")} size="large">
      <ChatImportPanel />
    </Dialog>
  )
}
