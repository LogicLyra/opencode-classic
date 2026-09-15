import { DatabaseSync, type SQLInputValue } from "node:sqlite"
import { realpathSync, statSync } from "node:fs"
import { isAbsolute } from "node:path"
import { Schema } from "effect"
import { SessionV1 } from "@opencode-ai/schema/session-v1"
import { SessionMessage } from "@opencode-ai/schema/session-message"
import type { ChatImportError, ChatImportSummary } from "@opencode-ai/app/chat-import"

type Row = Record<string, SQLInputValue>

const tables = [
  "project",
  "project_directory",
  "session",
  "message",
  "part",
  "session_message",
  "session_input",
  "todo",
  "event_sequence",
  "event",
] as const
type Table = (typeof tables)[number]
const decodeMessage = Schema.decodeUnknownSync(SessionV1.Info)
const decodePart = Schema.decodeUnknownSync(SessionV1.Part)
const decodeProjection = Schema.decodeUnknownSync(SessionMessage.Message)
const decodeObject = Schema.decodeUnknownSync(Schema.Record(Schema.String, Schema.Unknown).pipe(Schema.fromJsonString))

export class ChatImportFailure extends Error {
  constructor(readonly code: ChatImportError) {
    super(code)
  }
}

// This module runs in a dedicated worker. It never opens the source read-write,
// migrates it, attaches it to the destination, or copies executable SQL from it.
export function importChatDatabase(input: { source: string; destination: string; commit: boolean }): ChatImportSummary {
  const sourcePath = realpathSync(input.source)
  const destinationPath = realpathSync(input.destination)
  const sourceFile = statSync(sourcePath)
  const destinationFile = statSync(destinationPath)
  if (!sourceFile.isFile() || !destinationFile.isFile()) throw new ChatImportFailure("invalid")
  if (sourceFile.dev === destinationFile.dev && sourceFile.ino === destinationFile.ino) {
    throw new ChatImportFailure("sameFile")
  }

  const source = new DatabaseSync(sourcePath, { readOnly: true, allowExtension: false })
  let reading = false
  try {
    const destination = new DatabaseSync(destinationPath, { readOnly: !input.commit, allowExtension: false })
    try {
      source.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF; PRAGMA busy_timeout = 3000; BEGIN")
      reading = true
      destination.exec("PRAGMA trusted_schema = OFF; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000")
      destination.exec(input.commit ? "BEGIN IMMEDIATE" : "BEGIN")
      let committed = false
      try {
        const columns = validateChatDatabases(source, destination)
        const sessions = source.prepare("SELECT * FROM session ORDER BY id").all() as Row[]
        const existing = new Set((destination.prepare("SELECT id FROM session").all() as Row[]).map((row) => row.id))
        const eligible = sessions.filter((row) => !existing.has(row.id) && completed(source, row))
        for (const session of eligible) validateHistory(source, session)
        const ids = new Set([...existing, ...eligible.map((row) => row.id)])
        const duplicates = sessions.filter((row) => existing.has(row.id)).length
        const summary: ChatImportSummary = {
          source: sourcePath,
          destination: destinationPath,
          total: sessions.length,
          eligible: eligible.length,
          existing: duplicates,
          excluded: sessions.length - duplicates - eligible.length,
          imported: 0,
        }
        if (!input.commit) return summary

        const insert = (table: Table, row: Row) => {
          const names = columns[table]
          destination
            .prepare(
              `INSERT INTO ${quote(table)} (${names.map(quote).join(",")}) VALUES (${names.map(() => "?").join(",")})`,
            )
            .run(...names.map((name) => row[name]))
        }
        const copy = (table: Table, key: string, value: SQLInputValue) => {
          for (const row of source.prepare(`SELECT * FROM ${quote(table)} WHERE ${quote(key)} = ?`).iterate(value)) {
            insert(table, row)
          }
        }

        for (const session of eligible) {
          if (typeof session.directory !== "string" || !isAbsolute(session.directory))
            throw new ChatImportFailure("invalid")
          const project = source.prepare("SELECT * FROM project WHERE id = ?").get(session.project_id) as
            | Row
            | undefined
          if (!project || typeof project.worktree !== "string" || !isAbsolute(project.worktree))
            throw new ChatImportFailure("invalid")
          const current = destination.prepare("SELECT worktree FROM project WHERE id = ?").get(session.project_id)
          if (current && current.worktree !== project.worktree) throw new ChatImportFailure("conflict")
          if (!current) insert("project", { ...project, commands: null, sandboxes: "[]" })
          for (const row of source
            .prepare("SELECT * FROM project_directory WHERE project_id = ?")
            .iterate(session.project_id)) {
            if (typeof row.directory !== "string" || !isAbsolute(row.directory)) throw new ChatImportFailure("invalid")
            if (
              destination
                .prepare("SELECT 1 FROM project_directory WHERE project_id = ? AND directory = ?")
                .get(row.project_id, row.directory)
            )
              continue
            insert("project_directory", { ...row, type: null, strategy: null })
          }

          insert("session", {
            ...session,
            parent_id: ids.has(session.parent_id) ? session.parent_id : null,
            share_url: null,
            permission: null,
            revert: null,
            time_compacting: null,
          })
          copy("message", "session_id", session.id)
          copy("part", "session_id", session.id)
          copy("session_message", "session_id", session.id)
          copy("session_input", "session_id", session.id)
          copy("todo", "session_id", session.id)
          const sequence = source.prepare("SELECT * FROM event_sequence WHERE aggregate_id = ?").get(session.id) as
            | Row
            | undefined
          if (sequence) insert("event_sequence", { ...sequence, owner_id: null })
          copy("event", "aggregate_id", session.id)
          summary.imported++
        }

        if (destination.prepare("PRAGMA foreign_key_check").get()) throw new ChatImportFailure("invalid")
        destination.exec("COMMIT")
        committed = true
        return summary
      } finally {
        // Closing an uncommitted SQLite transaction rolls it back, including on
        // collisions, malformed rows, a busy destination or worker termination.
        if (!committed) destination.exec("ROLLBACK")
        destination.close()
      }
    } catch (error) {
      if (destination.isOpen) destination.close()
      throw error
    }
  } finally {
    if (reading) source.exec("ROLLBACK")
    source.close()
  }
}

export function quote(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

export function validateChatDatabases(source: DatabaseSync, destination: DatabaseSync, names: readonly string[] = tables) {
  const journal = (db: DatabaseSync) => {
    if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'migration'").get()) {
      throw new ChatImportFailure("incompatible")
    }
    return (db.prepare("SELECT id FROM migration ORDER BY id").all() as { id: string }[])
      .map((row) => row.id)
      .filter((id) => id !== "20260530232709_lovely_romulus")
  }
  const expected = journal(destination)
  if (expected.length === 0 || JSON.stringify(journal(source)) !== JSON.stringify(expected)) {
    throw new ChatImportFailure("incompatible")
  }
  const columns = Object.fromEntries(
    names.map((table) => {
      for (const db of [source, destination]) {
        if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(table)) {
          throw new ChatImportFailure("incompatible")
        }
      }
      // Migrated installs and newly created databases can have different column
      // order/default spelling. Every value is inserted explicitly by name.
      const info = (db: DatabaseSync) =>
        db
          .prepare(`PRAGMA table_info(${quote(table)})`)
          .all()
          .map((column) => ({
            name: String(column.name),
            type: String(column.type).toUpperCase(),
            notnull: column.notnull,
            pk: column.pk,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      const target = info(destination)
      if (target.length === 0 || JSON.stringify(info(source)) !== JSON.stringify(target))
        throw new ChatImportFailure("incompatible")
      if (destination.prepare("SELECT 1 FROM sqlite_master WHERE type = 'trigger' AND tbl_name = ?").get(table)) {
        throw new ChatImportFailure("incompatible")
      }
      return [table, target.map((column) => String(column.name))]
    }),
  ) as Record<string, string[]>

  if (source.prepare("PRAGMA quick_check").get()?.quick_check !== "ok") throw new ChatImportFailure("invalid")
  if (source.prepare("PRAGMA foreign_key_check").get()) throw new ChatImportFailure("invalid")
  // part.session_id has no FK: enforce its relationship explicitly.
  if (
    source
      .prepare(
        "SELECT 1 FROM part JOIN message ON part.message_id = message.id WHERE part.session_id != message.session_id LIMIT 1",
      )
      .get()
  ) {
    throw new ChatImportFailure("invalid")
  }
  for (const table of ["message", "part", "session_message", "event"] as const) {
    if (source.prepare(`SELECT 1 FROM ${quote(table)} WHERE NOT json_valid(data) LIMIT 1`).get())
      throw new ChatImportFailure("invalid")
  }
  return columns
}

function completed(db: DatabaseSync, session: Row) {
  if (session.workspace_id !== null || session.time_compacting !== null) return false
  if (db.prepare("SELECT 1 FROM session_input WHERE session_id = ? AND promoted_seq IS NULL LIMIT 1").get(session.id))
    return false
  if (
    db
      .prepare(
        "SELECT 1 FROM message WHERE session_id = ? AND json_extract(data, '$.role') = 'assistant' AND json_extract(data, '$.time.completed') IS NULL LIMIT 1",
      )
      .get(session.id)
  )
    return false
  if (
    db
      .prepare(
        "SELECT 1 FROM part WHERE session_id = ? AND json_extract(data, '$.type') = 'tool' AND json_extract(data, '$.state.status') IN ('pending', 'running') LIMIT 1",
      )
      .get(session.id)
  )
    return false
  if (
    db
      .prepare(
        "SELECT 1 FROM session_message WHERE session_id = ? AND type IN ('assistant', 'shell') AND json_extract(data, '$.time.completed') IS NULL LIMIT 1",
      )
      .get(session.id)
  )
    return false
  if (
    db
      .prepare(
        "SELECT 1 FROM session_message, json_each(session_message.data, '$.content') AS content WHERE session_id = ? AND session_message.type = 'assistant' AND json_extract(content.value, '$.type') = 'tool' AND json_extract(content.value, '$.state.status') IN ('pending', 'running') LIMIT 1",
      )
      .get(session.id)
  )
    return false
  return true
}

export function validateHistory(db: DatabaseSync, session: Row) {
  if (typeof session.id !== "string" || !session.id.startsWith("ses_")) throw new ChatImportFailure("invalid")
  const sequence = db.prepare("SELECT seq FROM event_sequence WHERE aggregate_id = ?").get(session.id)
  const last = db
    .prepare(
      "SELECT max(seq) AS seq FROM (SELECT seq FROM session_message WHERE session_id = ? UNION ALL SELECT seq FROM event WHERE aggregate_id = ? UNION ALL SELECT admitted_seq AS seq FROM session_input WHERE session_id = ? UNION ALL SELECT promoted_seq AS seq FROM session_input WHERE session_id = ?)",
    )
    .get(session.id, session.id, session.id, session.id)
  if (
    last?.seq !== null &&
    last?.seq !== undefined &&
    (typeof sequence?.seq !== "number" || sequence.seq < Number(last.seq))
  ) {
    throw new ChatImportFailure("invalid")
  }
  for (const row of db.prepare("SELECT * FROM message WHERE session_id = ?").iterate(session.id)) {
    decodeMessage({ ...decodeObject(row.data), id: row.id, sessionID: row.session_id })
  }
  for (const row of db.prepare("SELECT * FROM part WHERE session_id = ?").iterate(session.id)) {
    decodePart({ ...decodeObject(row.data), id: row.id, sessionID: row.session_id, messageID: row.message_id })
  }
  for (const row of db.prepare("SELECT * FROM session_message WHERE session_id = ?").iterate(session.id)) {
    decodeProjection({ ...decodeObject(row.data), id: row.id, type: row.type })
  }
}

export function chatImportError(error: unknown): ChatImportError {
  if (error instanceof ChatImportFailure) return error.code
  const message = error instanceof Error ? error.message : ""
  if (/locked|busy/i.test(message)) return "busy"
  if (/constraint|unique/i.test(message)) return "conflict"
  return "invalid"
}
