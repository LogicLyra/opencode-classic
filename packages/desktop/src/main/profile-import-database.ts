import { DatabaseSync, type SQLInputValue } from "node:sqlite"
import { chmodSync, existsSync, lstatSync, readdirSync, realpathSync } from "node:fs"
import { isAbsolute, join, relative } from "node:path"
import { migrations } from "../../../core/src/database/migration.gen"
import { quote, validateHistory } from "./chat-import-database"
import { copyDatabaseSnapshot, parseProfileConfig, secureRead } from "./profile-import-files"
import {
  ProfileImportFailure,
  profileRoots,
  remapProfileObject,
  remapProfilePath,
  type ProfileRoots,
} from "./profile-import-paths"

export const profileTables = [
  "project",
  "project_directory",
  "workspace",
  "account",
  "account_state",
  "control_account",
  "credential",
  "permission",
  "session",
  "message",
  "part",
  "session_message",
  "session_input",
  "session_context_epoch",
  "todo",
  "event_sequence",
  "event",
  "session_share",
  "data_migration",
] as const

export function openProfileDatabase(path: string) {
  const db = new DatabaseSync(path, { readOnly: true, allowExtension: false })
  db.exec("PRAGMA query_only=ON; PRAGMA trusted_schema=OFF; PRAGMA busy_timeout=3000; BEGIN")
  return db
}

export function closeProfileDatabase(db: DatabaseSync) {
  try {
    db.exec("ROLLBACK")
  } finally {
    db.close()
  }
}

export function assertFreshDatabase(db: DatabaseSync) {
  for (const table of profileTables) {
    if (table === "data_migration") continue
    const allowed =
      table === "account_state"
        ? " WHERE active_account_id IS NOT NULL OR active_org_id IS NOT NULL"
        : table === "project"
          ? " WHERE NOT (id = 'global' AND worktree = '/' AND sandboxes = '[]' AND commands IS NULL AND name IS NULL AND icon_url IS NULL AND icon_url_override IS NULL AND icon_color IS NULL AND vcs IS NULL AND time_initialized IS NULL)"
          : ""
    if (db.prepare(`SELECT 1 FROM ${quote(table)}${allowed} LIMIT 1`).get()) throw new ProfileImportFailure("nonempty")
  }
}

export function assertFreshProfile(root: string, database: string) {
  for (const name of readdirSync(root)) {
    const path = join(root, name)
    if (name === ".profile-import-owner") throw new ProfileImportFailure("nonempty")
    if (
      !["config", "data", "state", "cache", "tmp"].includes(name) ||
      !lstatSync(path).isDirectory() ||
      lstatSync(path).isSymbolicLink()
    )
      throw new ProfileImportFailure("nonempty")
    if (["config", "data", "state"].includes(name) && readdirSync(path).some((child) => child !== "opencode"))
      throw new ProfileImportFailure("nonempty")
  }
  const roots = profileRoots(root)
  const db = openProfileDatabase(database)
  try {
    assertFreshDatabase(db)
  } finally {
    closeProfileDatabase(db)
  }
  for (const key of ["config", "data", "state"] as const) {
    const dir = roots[key]
    if (!existsSync(dir)) continue
    if (!lstatSync(dir).isDirectory() || lstatSync(dir).isSymbolicLink() || realpathSync(dir) !== dir)
      throw new ProfileImportFailure("nonempty")
    const manifest = join(dir, "package.json")
    const scaffold = key === "config" && existsSync(manifest) ? parseProfileConfig(secureRead(manifest)) : undefined
    const dependencies = scaffold?.dependencies
    const generated =
      scaffold &&
      Object.keys(scaffold).every((name) => name === "dependencies") &&
      dependencies &&
      typeof dependencies === "object" &&
      !Array.isArray(dependencies) &&
      Object.keys(dependencies).length === 1 &&
      "@opencode-ai/plugin" in dependencies &&
      typeof dependencies["@opencode-ai/plugin"] === "string"
    const walk = (path: string) => {
      const info = lstatSync(path)
      const part = relative(dir, path)
      if (info.isSymbolicLink()) throw new ProfileImportFailure("nonempty")
      if (
        key === "data" &&
        (part === "log" || path === database || ["-wal", "-shm"].some((suffix) => path === database + suffix))
      )
        return
      if (key === "state" && part === "locks") return
      if (generated && ["package.json", "package-lock.json", "bun.lock", "node_modules"].includes(part)) return
      if (info.isDirectory()) {
        for (const name of readdirSync(path)) walk(join(path, name))
        return
      }
      if (!info.isFile()) throw new ProfileImportFailure("nonempty")
      if (key === "config" && ["config.json", "opencode.json", "opencode.jsonc"].includes(part)) {
        const value = parseProfileConfig(secureRead(path))
        if (Object.keys(value).every((name) => name === "$schema")) return
      }
      if (
        key === "config" &&
        part === ".gitignore" &&
        secureRead(path) === "node_modules\npackage.json\npackage-lock.json\nbun.lock\n.gitignore"
      )
        return
      if (key === "data" && part === "auth.json" && Object.keys(parseProfileConfig(secureRead(path))).length === 0)
        return
      throw new ProfileImportFailure("nonempty")
    }
    for (const name of readdirSync(dir)) walk(join(dir, name))
  }
}

export function inspectProfileDatabase(source: DatabaseSync, destination: DatabaseSync) {
  const names = (db: DatabaseSync) =>
    db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '__drizzle_migrations' ORDER BY name",
      )
      .all()
      .map((row) => row.name)
  const expected = [...profileTables, "migration"].sort()
  // The destination is this build's own database: it must match exactly. The
  // source may be older: tables can be missing (the app's migration runner
  // recreates them on first start), but unknown extra tables are refused.
  if (JSON.stringify(names(destination)) !== JSON.stringify(expected)) throw new ProfileImportFailure("incompatible")
  const sourceNames = names(source)
  if (sourceNames.some((name) => !expected.includes(name))) throw new ProfileImportFailure("incompatible")
  const known = new Set([...migrations.map((migration) => migration.id), "20260530232709_lovely_romulus"])
  for (const id of source
    .prepare("SELECT id FROM migration ORDER BY id")
    .all()
    .map((row) => row.id)) {
    if (!known.has(id)) throw new ProfileImportFailure("incompatible")
  }
  assertFreshDatabase(destination)
  for (const [table, field] of [
    ["project", "worktree"],
    ["project_directory", "directory"],
    ["session", "directory"],
    ["workspace", "directory"],
  ]) {
    if (!sourceNames.includes(table)) continue
    for (const row of source.prepare(`SELECT ${quote(field)} FROM ${quote(table)}`).iterate()) {
      if (table === "workspace" && row[field] === null) continue
      if (typeof row[field] !== "string" || !isAbsolute(row[field] as string) || (row[field] as string).includes("\0"))
        throw new ProfileImportFailure("invalid")
    }
  }
  if (sourceNames.includes("session"))
    for (const row of source.prepare("SELECT * FROM session").iterate()) validateHistory(source, row)
  if (
    sourceNames.includes("session") &&
    sourceNames.includes("workspace") &&
    source
      .prepare(
        "SELECT 1 FROM session WHERE workspace_id IS NOT NULL AND workspace_id NOT IN (SELECT id FROM workspace) LIMIT 1",
      )
      .get()
  )
    throw new ProfileImportFailure("invalid")
}

export function stageProfileDatabase(
  snapshotFile: string,
  stagedFile: string,
  roots: ProfileRoots,
  target: ProfileRoots,
) {
  // The staged database is the verified snapshot itself, carrying the source's
  // own DDL, rows and migration journal. Older journals stay pending so the
  // application's real migration runner upgrades the profile on first start,
  // exactly as it would for any older database it opens.
  copyDatabaseSnapshot(snapshotFile, stagedFile)
  const db = new DatabaseSync(stagedFile, { allowExtension: false })
  chmodSync(stagedFile, 0o600)
  try {
    db.exec("PRAGMA trusted_schema=OFF; BEGIN IMMEDIATE")
    // Imported executable schema objects are stripped; only data and the
    // compiled migration path survive into Classic.
    for (const row of db
      .prepare("SELECT type, name FROM sqlite_master WHERE type IN ('trigger','view') AND name NOT LIKE 'sqlite_%'")
      .all()) {
      db.exec(`DROP ${row.type === "view" ? "VIEW" : "TRIGGER"} ${quote(String(row.name))}`)
    }
    db.exec("UPDATE event_sequence SET owner_id = NULL WHERE owner_id IS NOT NULL")
    for (const table of profileTables) {
      if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?").get(table)) continue
      const info = db.prepare(`PRAGMA table_info(${quote(table)})`).all()
      const columns = info.map((row) => String(row.name))
      const primary = info
        .filter((row) => row.pk)
        .sort((a, b) => a.pk - b.pk)
        .map((row) => String(row.name))
      if (primary.length === 0) continue
      for (const row of db.prepare(`SELECT * FROM ${quote(table)}`).iterate()) {
        const changes: [string, SQLInputValue][] = []
        for (const name of columns) {
          const value = row[name]
          if (
            typeof value !== "string" ||
            ["credential", "account", "control_account", "session_share"].includes(table)
          )
            continue
          if (["directory", "worktree", "path", "resource"].includes(name)) {
            const mapped = remapProfilePath(value, roots, target)
            if (mapped !== value) changes.push([name, mapped])
            continue
          }
          if (
            [
              "data",
              "prompt",
              "baseline",
              "snapshot",
              "sandboxes",
              "revert",
              "permission",
              "summary_diffs",
              "metadata",
              "extra",
            ].includes(name)
          ) {
            try {
              const parsed: unknown = JSON.parse(value)
              const mapped = remapProfileObject(parsed, roots, target, name)
              const text = JSON.stringify(mapped)
              if (text !== JSON.stringify(parsed)) changes.push([name, text])
            } catch {
              throw new ProfileImportFailure("invalid")
            }
          }
        }
        if (changes.length === 0) continue
        const set = changes.map(([name]) => `${quote(name)} = ?`).join(", ")
        const where = primary.map((name) => `${quote(name)} = ?`).join(" AND ")
        db.prepare(`UPDATE ${quote(table)} SET ${set} WHERE ${where}`).run(
          ...changes.map(([, value]) => value),
          ...primary.map((name) => row[name] as SQLInputValue),
        )
      }
    }
    if (db.prepare("PRAGMA quick_check").get()?.quick_check !== "ok") throw new ProfileImportFailure("invalid")
    db.exec("COMMIT")
  } catch (error) {
    db.exec("ROLLBACK")
    throw error
  } finally {
    db.close()
  }
}
