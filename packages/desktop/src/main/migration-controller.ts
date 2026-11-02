import type { MigrationState } from "@opencode-ai/app/updater"
import type { MigrationDiscovery, MigrationOffer } from "@opencode-classic/releases"
import type { UpdaterBackend, UpdaterController } from "./updater-controller"

export type MigrationPreference = { stay: boolean; snoozeUntil: number }

export function createMigrationController(input: {
  enabled: boolean
  maintenance: UpdaterController
  revalidate(version: string): Promise<MigrationOffer | undefined>
  backend: UpdaterBackend & { checkTarget(version: string): ReturnType<UpdaterBackend["checkForUpdates"]> }
  persistence: {
    get(): MigrationPreference | undefined | Promise<MigrationPreference | undefined>
    set(preference: MigrationPreference): void | Promise<void>
    prepared(version: string | undefined): void | Promise<void>
  }
  // The profile owner supplies this only when prepare AND final quiesced capture are implemented.
  preflight?: (offer: MigrationOffer, phase: "prepare" | "install") => Promise<boolean>
  stop(): Promise<void>
}) {
  let state: MigrationState = { status: input.enabled ? "unavailable" : "disabled" }
  let offer: MigrationOffer | undefined
  let preference: MigrationPreference = { stay: false, snoozeUntil: 0 }
  let pending: Promise<MigrationState> | undefined
  let release: (() => void) | undefined
  let revision = 0
  const listeners = new Set<(state: MigrationState) => void>()

  const transition = (next: MigrationState) => {
    revision++
    state = next
    listeners.forEach((listener) => listener(state))
    return state
  }
  const available = (status: "offered" | "reviewing" | "preparing" | "prepared" | "installing"): MigrationState => ({
    status,
    offer: offer!,
    announce: !preference.stay && preference.snoozeUntil <= Date.now(),
    canPrepare: !!input.preflight,
  })
  const fail = async (code: Extract<MigrationState, { status: "error" }>["code"]) => {
    release?.()
    release = undefined
    const failed = transition({ status: "error", code })
    await Promise.resolve()
      .then(() => input.persistence.prepared(undefined))
      .catch(() => undefined)
    return failed
  }
  const requireTarget = (version: unknown) => {
    if (typeof version !== "string" || !offer || version !== offer.version) throw new Error("INVALID_MIGRATION_TARGET")
    return offer
  }

  return {
    getState: () => state,
    subscribe(listener: (state: MigrationState) => void) {
      listeners.add(listener)
      listener(state)
      return () => listeners.delete(listener)
    },
    async refresh(discovery: MigrationDiscovery) {
      if (!input.enabled || pending || state.status === "prepared" || state.status === "installing") return state
      const observed = ++revision
      try {
        const stored = (await input.persistence.get()) ?? { stay: false, snoozeUntil: 0 }
        if (observed !== revision) return state
        preference = stored
      } catch {
        return transition({ status: "error", code: "verification" })
      }
      if (discovery.status === "error") return transition({ status: "error", code: "verification" })
      if (discovery.status === "unavailable") {
        offer = undefined
        return transition({ status: "unavailable" })
      }
      const reviewing = state.status === "reviewing" && offer?.version === discovery.offer.version
      offer = discovery.offer
      return transition(available(reviewing ? "reviewing" : "offered"))
    },
    async review(version: unknown) {
      requireTarget(version)
      if (pending || state.status === "prepared" || state.status === "installing") return state
      return transition(available("reviewing"))
    },
    prepare(version: unknown) {
      const selected = requireTarget(version)
      if (pending) return pending
      if (state.status !== "reviewing") return Promise.reject(new Error("MIGRATION_REVIEW_REQUIRED"))
      if (!input.preflight) return fail("preflight")
      release = input.maintenance.reserveMigration()
      if (!release) return Promise.resolve(transition({ status: "error", code: "maintenance" }))
      transition(available("preparing"))
      pending = (async () => {
        const fresh = await input.revalidate(selected.version)
        if (!fresh || fresh.target !== selected.target || fresh.minimumVersion !== selected.minimumVersion)
          return fail("changed")
        if (!(await input.preflight!(selected, "prepare"))) return fail("preflight")
        const result = await input.backend.checkTarget(selected.version)
        if (!result?.isUpdateAvailable || result.updateInfo?.version !== selected.version) return fail("changed")
        await input.backend.downloadUpdate()
        await input.persistence.prepared(selected.version)
        return transition(available("prepared"))
      })()
        .catch(() => fail("download"))
        .finally(() => {
          pending = undefined
        })
      return pending
    },
    async install(version: unknown) {
      const selected = requireTarget(version)
      if (state.status !== "prepared" || !release || !input.preflight) throw new Error("MIGRATION_NOT_PREPARED")
      // Lock before the first await so two windows cannot install the same prepared target twice.
      transition(available("installing"))
      try {
        const fresh = await input.revalidate(selected.version)
        if (!fresh || fresh.target !== selected.target || fresh.minimumVersion !== selected.minimumVersion) {
          await fail("changed")
          return
        }
        await input.stop()
        if (!(await input.preflight(selected, "install"))) {
          await fail("preflight")
          return
        }
        input.backend.quitAndInstall()
        transition(available("prepared"))
      } catch {
        await fail("install")
      }
    },
    async dismiss(choice: unknown) {
      if (choice !== "later" && choice !== "stay") throw new Error("INVALID_MIGRATION_PREFERENCE")
      if (pending || state.status === "installing") throw new Error("MIGRATION_IN_PROGRESS")
      revision++
      preference =
        choice === "stay"
          ? { stay: true, snoozeUntil: 0 }
        : { stay: false, snoozeUntil: Date.now() + 7 * 24 * 60 * 60 * 1000 }
      await input.persistence.set(preference)
      release?.()
      release = undefined
      await input.persistence.prepared(undefined)
      return transition(offer ? available("offered") : { status: input.enabled ? "unavailable" : "disabled" })
    },
  }
}

export type MigrationController = ReturnType<typeof createMigrationController>
