export type ProfileImportError =
  | "unavailable"
  | "incompatible"
  | "invalid"
  | "nonempty"
  | "changed"
  | "busy"
  | "unsupported"
  | "space"

export type ProfileImportSummary = {
  config: string
  data: string
  state: string
  sessions: number
  providers: number
  accounts: number
  workspaces: number
  files: number
  bytes: number
  plugins: number
  mcp: number
  commands: number
  permissions: number
  pending: number
  git: number
}

export type ProfileImportResult =
  | { status: "ready"; token: string; summary: ProfileImportSummary }
  | { status: "staged" }
  | { status: "activated" }
  | { status: "cancelled" }
  | { status: "error"; code: ProfileImportError }

export type ProfileImportPlatform = {
  status: () => Promise<ProfileImportResult | undefined>
  preview: (browse?: boolean) => Promise<ProfileImportResult>
  confirm: (token: string) => Promise<ProfileImportResult>
}
