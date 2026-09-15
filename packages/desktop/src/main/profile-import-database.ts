import { DatabaseSync, type SQLInputValue } from "node:sqlite"
import { chmodSync, existsSync, lstatSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { quote, validateChatDatabases, validateHistory } from "./chat-import-database"
import { parseProfileConfig, secureRead } from "./profile-import-files"
import { ProfileImportFailure, profileRoots, remapProfileObject, remapProfilePath, type ProfileRoots } from "./profile-import-paths"

export const profileTables = ["project", "project_directory", "workspace", "account", "account_state", "control_account", "credential", "permission", "session", "message", "part", "session_message", "session_input", "session_context_epoch", "todo", "event_sequence", "event", "session_share", "data_migration"] as const

export function openProfileDatabase(path: string) {
  const db = new DatabaseSync(path, { readOnly: true, allowExtension: false })
  db.exec("PRAGMA query_only=ON; PRAGMA trusted_schema=OFF; PRAGMA busy_timeout=3000; BEGIN")
  return db
}

export function closeProfileDatabase(db: DatabaseSync) {
  try { db.exec("ROLLBACK") } finally { db.close() }
}

export function assertFreshDatabase(db: DatabaseSync) {
  for (const table of profileTables) {
    if (table === "data_migration") continue
    const allowed = table === "account_state" ? " WHERE active_account_id IS NOT NULL OR active_org_id IS NOT NULL" :
      table === "project" ? " WHERE NOT (id = 'global' AND worktree = '/' AND sandboxes = '[]' AND commands IS NULL AND name IS NULL AND icon_url IS NULL AND icon_url_override IS NULL)" : ""
    if (db.prepare(`SELECT 1 FROM ${quote(table)}${allowed} LIMIT 1`).get()) throw new ProfileImportFailure("nonempty")
  }
}

export function assertFreshProfile(root: string, database: string) {
  const roots = profileRoots(root)
  const db = openProfileDatabase(database)
  try { assertFreshDatabase(db) } finally { closeProfileDatabase(db) }
  for (const key of ["config", "data", "state"] as const) {
    const dir = roots[key]
    if (!existsSync(dir)) continue
    const walk = (path: string) => {
      const info = lstatSync(path)
      const part = relative(dir, path)
      if (info.isSymbolicLink()) throw new ProfileImportFailure("nonempty")
      if (key === "data" && (part === "log" || path === database || ["-wal", "-shm"].some((suffix) => path === database + suffix))) return
      if (key === "state" && part === "locks") return
      if (info.isDirectory()) { for (const name of readdirSync(path)) walk(join(path, name)); return }
      if (!info.isFile()) throw new ProfileImportFailure("nonempty")
      if (key === "config" && ["config.json", "opencode.json", "opencode.jsonc"].includes(part)) {
        const value = parseProfileConfig(secureRead(path))
        if (Object.keys(value).every((name) => name === "$schema")) return
      }
      if (key === "config" && part === ".gitignore" && secureRead(path) === "node_modules\npackage.json\npackage-lock.json\nbun.lock\n.gitignore") return
      if (key === "data" && part === "auth.json" && Object.keys(parseProfileConfig(secureRead(path))).length === 0) return
      throw new ProfileImportFailure("nonempty")
    }
    for (const name of readdirSync(dir)) walk(join(dir, name))
  }
}

export function inspectProfileDatabase(source: DatabaseSync, destination: DatabaseSync) {
  const names = (db: DatabaseSync) => db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map((row) => row.name)
  const expected = [...profileTables, "migration"].sort()
  if (JSON.stringify(names(source)) !== JSON.stringify(expected) || JSON.stringify(names(destination)) !== JSON.stringify(expected)) throw new ProfileImportFailure("incompatible")
  validateChatDatabases(source, destination, profileTables)
  assertFreshDatabase(destination)
  for (const row of source.prepare("SELECT * FROM session").iterate()) validateHistory(source, row)
  if (source.prepare("SELECT 1 FROM session WHERE workspace_id IS NOT NULL AND workspace_id NOT IN (SELECT id FROM workspace) LIMIT 1").get()) throw new ProfileImportFailure("invalid")
}

export function copyProfileDatabase(source: DatabaseSync, template: DatabaseSync, file: string, roots: ProfileRoots, target: ProfileRoots) {
  const db = new DatabaseSync(file, { allowExtension: false })
  chmodSync(file, 0o600)
  try {
    db.exec("PRAGMA trusted_schema=OFF; PRAGMA foreign_keys=ON; BEGIN IMMEDIATE; PRAGMA defer_foreign_keys=ON")
    // Only the already-running Classic database supplies DDL. No SQL, triggers,
    // views, virtual tables or migration scripts from the source are executed.
    for (const row of template.prepare("SELECT sql FROM sqlite_master WHERE type IN ('table','index') AND sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type DESC").iterate()) {
      if (typeof row.sql !== "string") throw new ProfileImportFailure("invalid")
      db.exec(row.sql)
    }
    for (const table of [...profileTables, "migration"]) {
      const from = table === "migration" ? template : source
      const columns = db.prepare(`PRAGMA table_info(${quote(table)})`).all().map((row) => String(row.name))
      const insert = db.prepare(`INSERT INTO ${quote(table)} (${columns.map(quote).join(",")}) VALUES (${columns.map(() => "?").join(",")})`)
      for (const row of from.prepare(`SELECT * FROM ${quote(table)}`).iterate()) {
        const values = columns.map((name): SQLInputValue => {
          const value = row[name]
          if (table === "event_sequence" && name === "owner_id") return null
          if (typeof value !== "string" || ["credential", "account", "control_account", "session_share"].includes(table)) return value
          if (["directory", "worktree", "path", "resource"].includes(name)) return remapProfilePath(value, roots, target)
          if (["data", "prompt", "baseline", "snapshot", "sandboxes", "revert", "permission", "summary_diffs", "metadata", "extra"].includes(name)) {
            const parsed: unknown = JSON.parse(value)
            const mapped = remapProfileObject(parsed, roots, target, name)
            return JSON.stringify(mapped) === JSON.stringify(parsed) ? value : JSON.stringify(mapped)
          }
          return value
        })
        insert.run(...values)
      }
    }
    if (db.prepare("PRAGMA foreign_key_check").get() || db.prepare("PRAGMA quick_check").get()?.quick_check !== "ok") throw new ProfileImportFailure("invalid")
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  } finally { db.close() }
}
