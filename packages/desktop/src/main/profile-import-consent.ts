import type { ProfileImportSummary } from "@opencode-ai/app/profile-import"

// Security confirmation copy is owned by the main process. It is never sourced
// from renderer-provided translations or any mutable runtime dictionary.
const copy = {
  title: "Import full OpenCode setup",
  message: "Copy this setup and its existing trust permissions?",
  detail:
    "Saved provider credentials: {{providers}}. Cloud accounts: {{accounts}}. Configured plugins: {{plugins}}. MCP entries: {{mcp}}. Project commands: {{commands}}. Permission records: {{permissions}}. Pending prompts: {{pending}}. Git checkouts: {{git}}.\n\nImport itself does not run these integrations. After activation, account refresh, dependency installation, plugins, MCP connections and project startup commands can run normally. Pending prompts remain queued until resumed. Copied Git hooks, filters and helpers retain their behavior when you use Git. Close OpenCode and trust the entire source setup before continuing. External project folders stay shared at their original paths.",
  cancel: "Cancel",
  confirm: "Copy trusted setup",
} as const

function format(text: string, params: Record<string, string | number>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(params[name] ?? ""))
}

export function profileImportConsentText(summary: ProfileImportSummary) {
  const params: Record<string, string | number> = {
    providers: summary.providers,
    accounts: summary.accounts,
    plugins: summary.plugins,
    mcp: summary.mcp,
    commands: summary.commands,
    permissions: summary.permissions,
    pending: summary.pending,
    git: summary.git,
  }
  return {
    title: copy.title,
    message: copy.message,
    detail: format(copy.detail, params),
    cancel: copy.cancel,
    confirm: copy.confirm,
  }
}
