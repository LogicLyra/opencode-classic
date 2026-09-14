import { expect, test } from "bun:test"
import { DatabaseSync } from "node:sqlite"
import { Effect, Layer } from "effect"
import { join } from "node:path"
import { Database } from "@opencode-ai/core/database/database"
import { SessionHistory } from "@opencode-ai/core/session/history"
import { SessionSchema } from "@opencode-ai/core/session/schema"
import { importChatDatabase } from "../../../desktop/src/main/chat-import-database"
import { MessageV2 } from "../../src/session/message-v2"
import { SessionID } from "../../src/session/schema"
import { tmpdir } from "../fixture/fixture"

test("imported legacy and v2 transcripts are readable by the real session-history reader", async () => {
  await using tmp = await tmpdir()
  const source = join(tmp.path, "upstream.db")
  const destination = join(tmp.path, "classic.db")
  for (const file of [source, destination]) {
    await Effect.runPromise(Effect.scoped(Layer.build(Database.layerFromPath(file))))
  }
  const db = new DatabaseSync(source)
  db.exec("INSERT INTO project (id, worktree, time_created, time_updated, sandboxes) VALUES ('p', '/repo', 1, 1, '[]')")
  for (const id of ["ses_legacy", "ses_v2"]) {
    db.prepare(
      "INSERT INTO session (id, project_id, slug, directory, title, version, time_created, time_updated) VALUES (?, 'p', ?, '/repo', ?, '1.18.30', 1, 2)",
    ).run(id, id, id)
  }
  db.prepare("INSERT INTO message VALUES ('msg_legacy', 'ses_legacy', 1, 2, ?)").run(
    JSON.stringify({
      role: "user",
      time: { created: 1 },
      agent: "build",
      model: { providerID: "test", modelID: "test" },
    }),
  )
  db.prepare("INSERT INTO part VALUES ('prt_legacy', 'msg_legacy', 'ses_legacy', 1, 2, ?)").run(
    JSON.stringify({ type: "text", text: "Legacy transcript survives" }),
  )
  db.prepare("INSERT INTO session_message VALUES ('msg_v2', 'ses_v2', 'user', 0, 1, 2, ?)").run(
    JSON.stringify({ time: { created: 1 }, text: "V2 transcript survives", files: [], agents: [] }),
  )
  db.exec("INSERT INTO event_sequence VALUES ('ses_v2', 0, NULL)")
  db.close()
  expect(importChatDatabase({ source, destination, commit: true }).imported).toBe(2)
  await Effect.runPromise(
    Effect.gen(function* () {
      const { db } = yield* Database.Service
      const legacy = yield* MessageV2.page({ sessionID: SessionID.make("ses_legacy"), limit: 20 })
      const v2 = yield* SessionHistory.load(db, SessionSchema.ID.make("ses_v2"))
      expect(JSON.stringify(legacy)).toContain("Legacy transcript survives")
      expect(JSON.stringify(v2)).toContain("V2 transcript survives")
    }).pipe(Effect.provide(Database.layerFromPath(destination)), Effect.scoped),
  )
})
