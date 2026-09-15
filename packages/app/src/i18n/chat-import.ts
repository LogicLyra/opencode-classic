// Fork-only English fallback. Kept separate from upstream's fully translated
// dictionaries until these new phrases receive a localization review.
export const profileImportNativeEnglish = {
  "desktop.profileImport.title": "Import full OpenCode setup",
  "desktop.profileImport.message": "Copy this setup and its existing trust permissions?",
  "desktop.profileImport.detail":
    "Saved provider credentials: {{providers}}. Cloud accounts: {{accounts}}. Configured plugins: {{plugins}}. MCP entries: {{mcp}}. Project commands: {{commands}}. Permission records: {{permissions}}. Pending prompts: {{pending}}. Git checkouts: {{git}}.\n\nImport itself does not run these integrations. After activation, account refresh, dependency installation, plugins, MCP connections and project startup commands can run normally. Pending prompts remain queued until resumed. Copied Git hooks, filters and helpers retain their behavior when you use Git. Close OpenCode and trust the entire source setup before continuing. External project folders stay shared at their original paths.",
  "desktop.profileImport.cancel": "Cancel",
  "desktop.profileImport.confirm": "Copy trusted setup",
}
export const chatImportEnglish = {
  ...profileImportNativeEnglish,
  "profileImport.mode": "Import mode",
  "profileImport.chats": "Chats only",
  "profileImport.everything": "Everything (full setup)",
  "profileImport.description":
    "Copy your compatible OpenCode setup into an empty Classic desktop profile: chats, provider credentials, cloud accounts, permissions, global configuration, agents, skills, plugins, plans, snapshots and workspace files. The source stays unchanged. Preview does not execute imported commands or contact providers.",
  "profileImport.boundaries":
    "Close OpenCode and stop editing its files first. Project folders outside OpenCode storage stay at their original paths. Environment variables, system-installed tools and upstream desktop window preferences are not copied. Logs, caches and process locks are regenerated. OAuth providers may require sign-in again. Custom folders are selected in order: data, config, then state.",
  "profileImport.detect": "Preview default setup",
  "profileImport.browse": "Choose setup folders",
  "profileImport.busy": "Validating or staging the complete setup. Keep Classic open until this finishes.",
  "profileImport.cancelled": "No compatible source was found, or folder selection was cancelled.",
  "profileImport.staged":
    "The setup is staged and verified. Restart Classic to activate it before its server starts. Do not add data to Classic before restarting; activation checks again that the destination is empty.",
  "profileImport.activated":
    "The full setup was activated successfully. Your project folders remain available at their original paths; imported internal workspaces have independent copies.",
  "profileImport.data": "Source data folder",
  "profileImport.config": "Source config folder",
  "profileImport.state": "Source state folder",
  "profileImport.providers": "Saved provider credentials",
  "profileImport.accounts": "Cloud accounts",
  "profileImport.workspaces": "Workspaces",
  "profileImport.files": "Files and links",
  "profileImport.bytes": "Copy size (bytes)",
  "profileImport.plugins": "Configured plugins",
  "profileImport.mcp": "MCP entries",
  "profileImport.commands": "Project commands",
  "profileImport.permissions": "Permission records",
  "profileImport.pending": "Pending prompts",
  "profileImport.git": "Git checkouts",
  "profileImport.consent":
    "I have closed OpenCode and trust this complete setup, including credentials, account refresh, dependencies, plugins, MCP servers, project commands, Git hooks and existing permissions. These can run during normal use after activation. Pending prompts remain queued until resumed.",
  "profileImport.confirm": "Stage full setup",
  "profileImport.restart": "Restart and activate setup",
  "profileImport.error.unavailable":
    "Full import requires the built-in Linux desktop server and file-based configuration. Environment-provided config or auth overrides must be removed before importing.",
  "profileImport.error.nonempty":
    "Classic already contains setup data. Full import will not overwrite it. Use Chats only to merge compatible conversations, or start with an empty Classic profile.",
  "profileImport.error.incompatible":
    "The source database schema does not match this Classic version. Full import requires a compatible SQLite setup; no source migration was attempted.",
  "profileImport.error.invalid":
    "The setup could not be validated. Check file permissions, database integrity and config syntax. The running Classic profile has not been replaced.",
  "profileImport.error.changed":
    "The source changed or this preview expired. Close OpenCode and other writers, then preview again.",
  "profileImport.error.busy":
    "Another import, an active file lock or a pending activation prevents this operation. Close OpenCode and restart Classic before retrying.",
  "profileImport.error.unsupported":
    "This setup contains unsupported links, cyclic Git object alternates, special files or exceeds the import limit (50 GiB / 500,000 entries). External symlinks must be materialized before import; source files were not changed.",
  "profileImport.error.space": "There is not enough free disk space to stage this setup. Free space and preview again.",
  "chatImport.tab": "Chat import",
  "chatImport.title": "Import chats from OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop keeps its chat database separate. Preview and copy compatible local chats from OpenCode without changing the source or replacing existing Classic chats. You can return here from Settings at any time.",
  "chatImport.scope":
    "Close OpenCode before importing. This copies completed local chats and their history. Queued, in-progress and workspace sessions are excluded. Credentials, permissions, project commands, external files and undo snapshots are not imported. Sign in separately and keep your project folders available at their original paths.",
  "chatImport.localOnly":
    "Select the built-in local desktop server to import chats. Remote and background-server connections are not supported by this importer.",
  "chatImport.detect": "Check default OpenCode database",
  "chatImport.browse": "Choose database file",
  "chatImport.confirm": "Import eligible chats",
  "chatImport.busy": "Checking or importing chats. Please wait before closing the app.",
  "chatImport.noSource": "No database was found or selected. Choose your OpenCode .db file to continue.",
  "chatImport.complete":
    "Import completed. Open the original project folder to find its chats. Repeating an import skips chat IDs already present in Classic.",
  "chatImport.source": "Source database",
  "chatImport.destination": "Classic database",
  "chatImport.total": "Chats in source",
  "chatImport.eligible": "Ready to import",
  "chatImport.existing": "Already present",
  "chatImport.excluded": "Excluded (queued, in-progress or workspace)",
  "chatImport.imported": "Imported",
  "chatImport.error.unavailable":
    "Import is available only for the built-in Linux desktop server after it finishes starting.",
  "chatImport.error.incompatible":
    "The databases have different or unsupported schemas. Use compatible, up-to-date OpenCode and Classic versions, then preview again. Legacy JSON storage is not supported; the source has not been migrated.",
  "chatImport.error.invalid":
    "The database could not be read or validated. Check the selected file, permissions and available disk space. An uncommitted import is rolled back; preview again before retrying.",
  "chatImport.error.sameFile": "Source and destination are the same database. No copy is needed.",
  "chatImport.error.conflict":
    "Conflicting project or message IDs prevented this import. No partial import was committed. Existing Classic chats were preserved.",
  "chatImport.error.busy":
    "The database is busy or the operation took too long. Close OpenCode and wait for other imports to finish, then preview again. A retry skips any chats already committed.",
  "chatImport.error.expired":
    "This preview has expired or its source changed. Preview the database again before importing.",
}
