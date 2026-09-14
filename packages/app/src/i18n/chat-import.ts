// Fork-only English fallback. Kept separate from upstream's fully translated
// dictionaries until these new phrases receive a localization review.
export const chatImportEnglish = {
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
