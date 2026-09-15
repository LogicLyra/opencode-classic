import { Show, createEffect, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import { Button } from "@opencode-ai/ui/button"
import { useLanguage } from "@/context/language"
import { usePlatform } from "@/context/platform"
import { ServerConnection, useServer } from "@/context/server"
import type { ProfileImportResult } from "../profile-import"

export function ProfileImportPanel(props: { onBusy?: (busy: boolean) => void } = {}) {
  const language = useLanguage()
  const platform = usePlatform()
  const server = useServer()
  const [state, setState] = createStore<{ busy: boolean; consent: boolean; result?: ProfileImportResult }>({ busy: false, consent: false })
  const ready = () => state.result?.status === "ready" ? state.result : undefined
  const local = () => !!platform.profileImport && !!server.current && ServerConnection.builtin(server.current)
  createEffect(() => { server.key; setState({ consent: false, result: undefined }) })
  onMount(() => { void platform.profileImport?.status().then((result) => { if (!state.result && !state.busy) setState("result", result) }).catch(() => undefined) })
  async function run(confirm: boolean, browse = false) {
    if (!platform.profileImport || !local() || state.busy || (confirm && !state.consent)) return
    const token = ready()?.token
    if (confirm && !token) return
    const key = server.key
    setState("busy", true)
    props.onBusy?.(true)
    try {
      const result = confirm && token ? await platform.profileImport.confirm(token) : await platform.profileImport.preview(browse)
      if (server.key === key) setState({ result, consent: false })
    } catch { setState("result", { status: "error", code: "invalid" }) }
    finally { setState("busy", false); props.onBusy?.(false) }
  }
  return <section class="flex flex-col gap-4 min-w-0" aria-busy={state.busy}>
    <p>{language.t("profileImport.description")}</p>
    <p class="text-text-weak">{language.t("profileImport.boundaries")}</p>
    <Show when={local()} fallback={<p role="status">{language.t("chatImport.localOnly")}</p>}>
      <Show when={state.result?.status !== "staged"}>
        <div class="flex flex-wrap gap-2">
          <Button disabled={state.busy} onClick={() => void run(false)}>{language.t("profileImport.detect")}</Button>
          <Button disabled={state.busy} onClick={() => void run(false, true)}>{language.t("profileImport.browse")}</Button>
        </div>
      </Show>
      <div role="status" aria-live="polite">
        <Show when={state.busy}>{language.t("profileImport.busy")}</Show>
        <Show when={state.result?.status === "cancelled"}>{language.t("profileImport.cancelled")}</Show>
        <Show when={state.result?.status === "staged"}>{language.t("profileImport.staged")}</Show>
        <Show when={state.result?.status === "activated"}>{language.t("profileImport.activated")}</Show>
      </div>
      <Show when={state.result?.status === "error" && state.result}>
        {(error) => <p role="alert">{language.t(`profileImport.error.${error().code}`)}</p>}
      </Show>
      <Show when={ready()}>{(result) => <>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 min-w-0">
          <dt>{language.t("profileImport.data")}</dt><dd class="break-all">{result().summary.data}</dd>
          <dt>{language.t("profileImport.config")}</dt><dd class="break-all">{result().summary.config}</dd>
          <dt>{language.t("profileImport.state")}</dt><dd class="break-all">{result().summary.state}</dd>
          <dt>{language.t("chatImport.total")}</dt><dd>{result().summary.sessions}</dd>
          <dt>{language.t("profileImport.providers")}</dt><dd>{result().summary.providers}</dd>
          <dt>{language.t("profileImport.accounts")}</dt><dd>{result().summary.accounts}</dd>
          <dt>{language.t("profileImport.workspaces")}</dt><dd>{result().summary.workspaces}</dd>
          <dt>{language.t("profileImport.files")}</dt><dd>{result().summary.files}</dd>
          <dt>{language.t("profileImport.bytes")}</dt><dd>{result().summary.bytes}</dd>
          <dt>{language.t("profileImport.plugins")}</dt><dd>{result().summary.plugins}</dd>
          <dt>{language.t("profileImport.mcp")}</dt><dd>{result().summary.mcp}</dd>
          <dt>{language.t("profileImport.commands")}</dt><dd>{result().summary.commands}</dd>
          <dt>{language.t("profileImport.permissions")}</dt><dd>{result().summary.permissions}</dd>
          <dt>{language.t("profileImport.pending")}</dt><dd>{result().summary.pending}</dd>
          <dt>{language.t("profileImport.git")}</dt><dd>{result().summary.git}</dd>
        </dl>
        <label class="flex items-start gap-2">
          <input type="checkbox" checked={state.consent} disabled={state.busy} onChange={(event) => setState("consent", event.currentTarget.checked)} />
          <span>{language.t("profileImport.consent")}</span>
        </label>
        <Button variant="primary" disabled={state.busy || !state.consent} onClick={() => void run(true)}>{language.t("profileImport.confirm")}</Button>
      </>}</Show>
      <Show when={state.result?.status === "staged"}>
        <Button variant="primary" onClick={() => void platform.restart()}>{language.t("profileImport.restart")}</Button>
      </Show>
    </Show>
  </section>
}
