import type { Accessor } from "solid-js"

export type UpdaterState =
  | { status: "disabled" }
  | { status: "idle" }
  | { status: "checking" }
  | { status: "downloading"; version: string; percent?: number }
  | { status: "ready"; version: string }
  | { status: "up-to-date" }
  | { status: "installing"; version: string }
  | { status: "error"; message: string }

export type UpdaterPlatform = {
  state: Accessor<UpdaterState>
  check(): Promise<UpdaterState>
  install(): Promise<void>
  migration?: MigrationPlatform
}

export type MigrationOffer = {
  version: string
  minimumVersion: string
  target: string
  releaseUrl: string
}

export type MigrationState =
  | { status: "disabled" | "unavailable" | "checking" }
  | {
      status: "offered" | "reviewing" | "preparing" | "prepared" | "installing"
      offer: MigrationOffer
      announce: boolean
      canPrepare: boolean
    }
  | { status: "error"; code: "verification" | "maintenance" | "changed" | "preflight" | "download" | "install" }

export type MigrationPlatform = {
  state: Accessor<MigrationState>
  check(): Promise<MigrationState>
  review(version: string): Promise<MigrationState>
  prepare(version: string): Promise<MigrationState>
  install(version: string): Promise<void>
  dismiss(choice: "later" | "stay"): Promise<MigrationState>
}
