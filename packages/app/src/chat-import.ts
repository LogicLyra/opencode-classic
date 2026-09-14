export type ChatImportError = "unavailable" | "incompatible" | "invalid" | "sameFile" | "conflict" | "busy" | "expired"

export type ChatImportSummary = {
  source: string
  destination: string
  total: number
  eligible: number
  existing: number
  excluded: number
  imported: number
}

export type ChatImportResult =
  | { status: "ready"; token: string; summary: ChatImportSummary }
  | { status: "complete"; summary: ChatImportSummary }
  | { status: "cancelled" }
  | { status: "error"; code: ChatImportError }

export type ChatImportPlatform = {
  preview: (chooseFile?: boolean) => Promise<ChatImportResult>
  confirm: (token: string) => Promise<ChatImportResult>
}
