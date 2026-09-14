import { describe, expect, test } from "bun:test"
import { DatabaseSync } from "node:sqlite"
import { mkdtemp, rm, link, readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Effect } from "effect"
import schema from "../../../core/src/database/schema.gen"
import { migrations } from "../../../core/src/database/migration.gen"
import { importChatDatabase } from "./chat-import-database"

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "classic-import-"))
  const source = join(root, "source.db")
  const destination = join(root, "destination.db")
  for (const filename of [source, destination]) {
    const db = new DatabaseSync(filename)
    // Execute the actual generated schema with a synchronous SQLite adapter.
    await Effect.runPromise(schema.up({ run: (query: string) => Effect.sync(() => db.exec(query)) } as never))
    db.exec("CREATE TABLE migration (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)")
    for (const migration of migrations) db.prepare("INSERT INTO migration VALUES (?, 1)").run(migration.id)
    db.exec(
      "INSERT INTO project (id, worktree, time_created, time_updated, sandboxes, commands) VALUES ('p', '/repo', 1, 1, '[]', '{\"start\":\"do-not-run\"}')",
    )
    db.close()
  }
  const input = { source, destination, commit: true }
  return {
    ...input,
    root,
    input,
    async [Symbol.asyncDispose]() {
      await rm(root, { recursive: true, force: true })
    },
  }
}

function chat(db: DatabaseSync, id: string, messageID = `msg_${id}`) {
  db.prepare(
    "INSERT INTO session (id, project_id, slug, directory, title, version, time_created, time_updated, permission, share_url, revert) VALUES (?, 'p', ?, '/repo', 'Keep this title', '1.18.30', 1, 2, '[]', 'https://example.invalid/share', '{}')",
  ).run(id, id)
  db.prepare("INSERT INTO message (id, session_id, time_created, time_updated, data) VALUES (?, ?, 1, 2, ?)").run(
    messageID,
    id,
    JSON.stringify({
      role: "user",
      time: { created: 1 },
      agent: "build",
      model: { providerID: "test", modelID: "test" },
    }),
  )
  db.prepare(
    "INSERT INTO part (id, message_id, session_id, time_created, time_updated, data) VALUES (?, ?, ?, 1, 2, ?)",
  ).run(`prt_${messageID}`, messageID, id, JSON.stringify({ type: "text", text: "Actual transcript" }))
}

describe("desktop chat import (real SQLite)", () => {
  test("accepts equivalent migrated schemas with a different column order", async () => {
    await using tmp = await fixture()
    const db = new DatabaseSync(tmp.source)
    db.exec(
      "DROP TABLE part; CREATE TABLE part (data TEXT NOT NULL, id TEXT PRIMARY KEY, message_id TEXT NOT NULL REFERENCES message(id) ON DELETE CASCADE, session_id TEXT NOT NULL, time_updated INTEGER NOT NULL, time_created INTEGER NOT NULL)",
    )
    chat(db, "ses_reordered")
    db.close()
    expect(importChatDatabase(tmp.input)).toMatchObject({ imported: 1 })
  })

  test("rejects malformed transcript objects and invalid projection sequences before writing", async () => {
    await using tmp = await fixture()
    const db = new DatabaseSync(tmp.source)
    chat(db, "ses_invalid")
    db.exec('UPDATE part SET data = \'{"type":"text","text":42}\'')
    expect(() => importChatDatabase(tmp.input)).toThrow()
    db.exec("DELETE FROM part; DELETE FROM message")
    db.prepare("INSERT INTO session_message VALUES ('msg_invalid', 'ses_invalid', 'user', 9, 1, 1, ?)").run(
      JSON.stringify({ time: { created: 1 }, text: "history", files: [], agents: [] }),
    )
    expect(() => importChatDatabase(tmp.input)).toThrow("invalid")
    db.close()
    const destination = new DatabaseSync(tmp.destination)
    expect(destination.prepare("SELECT count(*) AS n FROM session").get()).toEqual({ n: 0 })
    destination.close()
  })

  test("imports WAL history, preserves destination and source, and skips repeats", async () => {
    await using tmp = await fixture()
    const source = new DatabaseSync(tmp.source)
    source.exec("PRAGMA journal_mode = WAL; PRAGMA wal_autocheckpoint = 0")
    chat(source, "ses_new")
    source.exec(
      "INSERT INTO credential (id, label, value, time_created, time_updated) VALUES ('secret', 'secret', 'not-imported', 1, 1)",
    )
    source.exec(
      "INSERT INTO session_share VALUES ('ses_new', 'share', 'not-imported', 'https://example.invalid', 1, 1)",
    )
    const destination = new DatabaseSync(tmp.destination)
    chat(destination, "ses_existing")
    const before = destination.prepare("SELECT * FROM session WHERE id = 'ses_existing'").get()
    const bytes = await readFile(tmp.source)
    const wal = await readFile(`${tmp.source}-wal`)
    try {
      expect(importChatDatabase({ ...tmp.input, commit: false })).toMatchObject({ eligible: 1, imported: 0 })
      expect(destination.prepare("SELECT count(*) AS n FROM session").get()).toEqual({ n: 1 })
      expect(importChatDatabase(tmp.input)).toMatchObject({ imported: 1, excluded: 0 })
      expect(destination.prepare("SELECT * FROM session WHERE id = 'ses_existing'").get()).toEqual(before)
      expect(
        destination.prepare("SELECT title, permission, share_url, revert FROM session WHERE id = 'ses_new'").get(),
      ).toEqual({ title: "Keep this title", permission: null, share_url: null, revert: null })
      expect(destination.prepare("SELECT data FROM part WHERE session_id = 'ses_new'").get()?.data).toBe(
        JSON.stringify({ type: "text", text: "Actual transcript" }),
      )
      expect(destination.prepare("SELECT count(*) AS n FROM credential").get()).toEqual({ n: 0 })
      expect(destination.prepare("SELECT count(*) AS n FROM session_share").get()).toEqual({ n: 0 })
      expect(importChatDatabase(tmp.input)).toMatchObject({ imported: 0, existing: 1 })
      expect(await readFile(tmp.source)).toEqual(bytes)
      expect(await readFile(`${tmp.source}-wal`)).toEqual(wal)
    } finally {
      source.close()
      destination.close()
    }
  })

  test("excludes queued, running and workspace sessions", async () => {
    await using tmp = await fixture()
    const db = new DatabaseSync(tmp.source)
    for (const id of ["ses_ready", "ses_queued", "ses_running", "ses_remote"]) chat(db, id)
    db.exec("INSERT INTO session_input VALUES ('pending', 'ses_queued', '{}', 'queue', 1, NULL, 1)")
    db.exec("UPDATE session SET workspace_id = 'remote' WHERE id = 'ses_remote'")
    db.prepare("UPDATE message SET data = ? WHERE session_id = 'ses_running'").run(
      JSON.stringify({ role: "assistant", time: { created: 1 } }),
    )
    db.close()
    expect(importChatDatabase(tmp.input)).toMatchObject({ total: 4, excluded: 3, imported: 1 })
  })

  test("rolls back all inserts on a child-ID collision", async () => {
    await using tmp = await fixture()
    const source = new DatabaseSync(tmp.source)
    chat(source, "ses_a-good")
    chat(source, "ses_z-collision", "msg_duplicate")
    source.close()
    const destination = new DatabaseSync(tmp.destination)
    chat(destination, "ses_keep", "msg_duplicate")
    expect(() => importChatDatabase(tmp.input)).toThrow()
    expect(destination.prepare("SELECT id FROM session").all()).toEqual([{ id: "ses_keep" }])
    destination.close()
  })

  test("rejects newer journals, schema mismatches, invalid JSON and same-inode files", async () => {
    await using tmp = await fixture()
    const db = new DatabaseSync(tmp.source)
    chat(db, "ses_s")
    db.exec("INSERT INTO migration VALUES ('20990101000000_future', 1)")
    expect(() => importChatDatabase(tmp.input)).toThrow("incompatible")
    db.exec("DELETE FROM migration WHERE id = '20990101000000_future'")
    db.exec("UPDATE part SET data = 'not json'")
    expect(() => importChatDatabase(tmp.input)).toThrow("invalid")
    db.exec("ALTER TABLE session ADD COLUMN unknown TEXT")
    expect(() => importChatDatabase(tmp.input)).toThrow("incompatible")
    db.close()
    const hardlink = join(tmp.root, "alias.db")
    await link(tmp.source, hardlink)
    expect(() => importChatDatabase({ ...tmp.input, destination: hardlink })).toThrow("sameFile")
  })

  test("preserves v2 projections and history without carrying replay ownership", async () => {
    await using tmp = await fixture()
    const source = new DatabaseSync(tmp.source)
    chat(source, "ses_v2")
    source.exec("INSERT INTO event_sequence VALUES ('ses_v2', 2, 'upstream-owner')")
    source.exec("INSERT INTO event VALUES ('evt_history', 'ses_v2', 2, 'historical', '{}')")
    source
      .prepare("INSERT INTO session_message VALUES ('msg_projection', 'ses_v2', 'user', 2, 1, 1, ?)")
      .run(JSON.stringify({ time: { created: 1 }, text: "V2 history", files: [], agents: [] }))
    source.close()
    expect(importChatDatabase(tmp.input)).toMatchObject({ imported: 1 })
    const destination = new DatabaseSync(tmp.destination)
    expect(destination.prepare("SELECT seq, owner_id FROM event_sequence").get()).toEqual({ seq: 2, owner_id: null })
    expect(destination.prepare("SELECT id FROM session_message").get()).toEqual({ id: "msg_projection" })
    expect(destination.prepare("SELECT id FROM event").get()).toEqual({ id: "evt_history" })
    destination.close()
  })

  test("never executes source triggers and clears imported project commands", async () => {
    await using tmp = await fixture()
    const source = new DatabaseSync(tmp.source)
    chat(source, "ses_s")
    source.exec("CREATE TRIGGER malicious AFTER INSERT ON session BEGIN DELETE FROM part; END")
    source.close()
    const destination = new DatabaseSync(tmp.destination)
    destination.exec("DELETE FROM project")
    expect(importChatDatabase(tmp.input)).toMatchObject({ imported: 1 })
    expect(destination.prepare("SELECT commands FROM project").get()).toEqual({ commands: null })
    expect(destination.prepare("SELECT count(*) AS n FROM part").get()).toEqual({ n: 1 })
    expect(destination.prepare("SELECT name FROM sqlite_master WHERE type = 'trigger'").all()).toEqual([])
    destination.close()
  })
})
