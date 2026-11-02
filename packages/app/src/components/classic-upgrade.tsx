import { Show, createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import { Button } from "@opencode-ai/ui/button"
import { Dialog } from "@opencode-ai/ui/dialog"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { usePlatform } from "@/context/platform"
import { useLanguage } from "@/context/language"
import { dismissToast, showToast } from "@/utils/toast"
import { ExternalLink } from "./external-link"

export function ClassicUpgradeCard() {
  const platform = usePlatform()
  const language = useLanguage()
  const dialog = useDialog()
  const state = () => platform.updater?.migration?.state()
  const offer = () => {
    const current = state()
    return current && "offer" in current ? current.offer : undefined
  }
  const [store, setStore] = createStore({ busy: false })
  let trigger: HTMLButtonElement | undefined
  const review = async () => {
    const selected = offer()
    if (!selected) return
    await platform.updater?.migration?.review(selected.version)
    dialog.push(() => <DialogClassicUpgrade restoreFocus={() => trigger?.focus()} />)
  }
  const run = async () => {
    if (store.busy) return
    setStore("busy", true)
    try {
      if (offer()) await review()
      else await platform.updater?.migration?.check()
    } catch {
      showToast({ title: language.t("common.requestFailed") })
    } finally {
      setStore("busy", false)
    }
  }
  return (
    <Show when={platform.platform === "desktop" && platform.updater?.migration && state()?.status !== "disabled"}>
      <section
        class="flex flex-col gap-3 rounded-lg border border-border-weak-base p-4"
        aria-label={language.t("classicUpgrade.title")}
      >
        <h4 class="text-14-medium text-text-strong">{language.t("classicUpgrade.title")}</h4>
        <p class="text-12-regular text-text-weak">
          {offer()
            ? language.t("classicUpgrade.available", { version: offer()!.version })
            : language.t("classicUpgrade.development")}
        </p>
        <MigrationError />
        <div class="flex flex-wrap gap-2">
          <Button ref={(element) => { trigger = element }} size="small" variant="secondary" aria-busy={store.busy} aria-disabled={store.busy} onClick={run}>
            {language.t(offer() ? "classicUpgrade.review" : "classicUpgrade.check")}
          </Button>
        </div>
      </section>
    </Show>
  )
}

function MigrationError() {
  const platform = usePlatform()
  const language = useLanguage()
  const error = () => {
    const state = platform.updater?.migration?.state()
    return state?.status === "error" ? state : undefined
  }
  return (
    <Show when={error()}>
      {(state) => (
        <p role="status" class="text-12-regular text-text-weak">
          {language.t(`classicUpgrade.error.${state().code}`)}
        </p>
      )}
    </Show>
  )
}

export function DialogClassicUpgrade(props: { restoreFocus?: () => void } = {}) {
  const platform = usePlatform()
  const language = useLanguage()
  const dialog = useDialog()
  const migration = platform.updater?.migration
  const state = () => migration?.state()
  const offer = () => {
    const current = state()
    return current && "offer" in current ? current.offer : undefined
  }
  const [store, setStore] = createStore({ busy: false })
  const busy = () => store.busy || state()?.status === "preparing" || state()?.status === "installing"
  const canPrepare = () => {
    const current = state()
    return current && "canPrepare" in current && current.canPrepare
  }
  const run = async (action: () => Promise<unknown>) => {
    setStore("busy", true)
    try {
      await action()
    } catch {
      showToast({ title: language.t("common.requestFailed") })
    } finally {
      setStore("busy", false)
    }
  }
  const dismiss = (choice: "later" | "stay") =>
    run(async () => {
      await migration?.dismiss(choice)
      dialog.close()
    })
  return (
    <Dialog title={language.t("classicUpgrade.title")} fit onCloseAutoFocus={(event) => {
      if (!props.restoreFocus) return
      event.preventDefault()
      props.restoreFocus()
    }}>
      <div class="flex flex-col gap-4 px-6 pb-6 max-h-[70vh] overflow-y-auto" data-scrollable>
        <p class="text-14-regular">{language.t("classicUpgrade.source", { version: platform.version ?? "" })}</p>
        <Show when={offer()}>
          {(selected) => (
            <>
              <p class="text-14-medium">{language.t("classicUpgrade.target", { version: selected().version })}</p>
              <p class="text-12-regular text-text-weak">
                {language.t("classicUpgrade.package", { target: selected().target })}
              </p>
              <ExternalLink href={selected().releaseUrl}>{language.t("classicUpgrade.notes")}</ExternalLink>
            </>
          )}
        </Show>
        <p class="text-14-regular">{language.t("classicUpgrade.recovery")}</p>
        <p class="text-14-regular">{language.t("classicUpgrade.rollback")}</p>
        <p class="text-12-regular text-text-weak">{language.t("classicUpgrade.capture")}</p>
        <Show when={offer() && !canPrepare()}>
          <p role="status" class="text-14-regular">
            {language.t("classicUpgrade.preflightUnavailable")}
          </p>
        </Show>
        <Show when={state()?.status === "prepared"}>
          <p role="status" class="text-14-regular">
            {language.t("classicUpgrade.prepared")}
          </p>
        </Show>
        <MigrationError />
        <div class="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" disabled={busy()} onClick={() => dismiss("stay")}>
            {language.t("classicUpgrade.stay")}
          </Button>
          <Button variant="ghost" disabled={busy()} onClick={() => dismiss("later")}>
            {language.t("classicUpgrade.later")}
          </Button>
          <Button
            variant="primary"
            disabled={busy() || !offer() || !canPrepare()}
            onClick={() =>
              run(async () => {
                const selected = offer()
                if (!selected) return
                if (state()?.status === "prepared") return migration?.install(selected.version)
                return migration?.prepare(selected.version)
              })
            }
          >
            {language.t(
              state()?.status === "prepared"
                ? "classicUpgrade.restart"
                : state()?.status === "preparing"
                  ? "classicUpgrade.preparing"
                  : state()?.status === "installing"
                    ? "classicUpgrade.installing"
                    : "classicUpgrade.prepare",
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export function ClassicUpgradeAnnouncement() {
  const platform = usePlatform()
  const language = useLanguage()
  const dialog = useDialog()
  const shown = new Set<string>()
  createEffect(() => {
    const migration = platform.updater?.migration
    const state = migration?.state()
    if (state?.status !== "offered" || !state.announce || !state.canPrepare || shown.has(state.offer.version)) return
    shown.add(state.offer.version)
    const id = showToast({
      title: language.t("classicUpgrade.title"),
      description: language.t("classicUpgrade.available", { version: state.offer.version }),
      actions: [
        {
          label: language.t("classicUpgrade.review"),
          onClick: () => {
            dismissToast(id)
            void migration
              ?.review(state.offer.version)
              .then(() => dialog.show(() => <DialogClassicUpgrade />))
              .catch(() => showToast({ title: language.t("common.requestFailed") }))
          },
        },
        {
          label: language.t("classicUpgrade.later"),
          onClick: () => {
            dismissToast(id)
            void migration?.dismiss("later").catch(() => showToast({ title: language.t("common.requestFailed") }))
          },
        },
      ],
    })
    onCleanup(() => dismissToast(id))
  })
  return null
}
