import { describe, expect, test } from "bun:test"
import { SqliteClient } from "@effect/sql-sqlite-bun"
import { EffectDrizzleSqlite } from "@opencode-ai/effect-drizzle-sqlite"
import { Effect } from "effect"
import { sql } from "drizzle-orm"
import { DatabaseMigration } from "../src/database/migration"
import { migrations } from "../src/database/migration.gen"

const makeDb = EffectDrizzleSqlite.makeWithDefaults()

describe("fork database compatibility", () => {
  for (const journal of ["modern", "named", "timestamp"] as const) {
    test(`rejects unknown ${journal} history without changing the database`, async () => {
      await Effect.runPromise(
        Effect.gen(function* () {
          const db = yield* makeDb
          yield* db.run("CREATE TABLE session (id TEXT PRIMARY KEY, title TEXT)")
          yield* db.run("INSERT INTO session VALUES ('ses_keep', 'untouched')")
          if (journal === "modern") {
            yield* db.run("CREATE TABLE migration (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)")
            // An unknown ID below the current head must be rejected too.
            yield* db.run("INSERT INTO migration VALUES ('20260101000000_unknown', 1)")
          }
          if (journal === "named") {
            yield* db.run("CREATE TABLE __drizzle_migrations (name TEXT)")
            yield* db.run("INSERT INTO __drizzle_migrations VALUES ('20990101000000_future')")
          }
          if (journal === "timestamp") {
            yield* db.run("CREATE TABLE __drizzle_migrations (created_at INTEGER)")
            yield* db.run(sql`INSERT INTO __drizzle_migrations VALUES (${Date.UTC(2099, 0, 1)})`)
          }
          const before = yield* db.all("SELECT * FROM sqlite_master ORDER BY name")
          const exit = yield* Effect.exit(DatabaseMigration.apply(db))
          expect(exit._tag).toBe("Failure")
          expect(yield* db.all("SELECT * FROM sqlite_master ORDER BY name")).toEqual(before)
          expect(yield* db.all("SELECT * FROM session")).toEqual([{ id: "ses_keep", title: "untouched" }])
        }).pipe(Effect.provide(SqliteClient.layer({ filename: ":memory:", disableWAL: true })), Effect.scoped),
      )
    })
  }

  test("accepts known history including the documented replacement migration", async () => {
    await Effect.runPromise(
      Effect.gen(function* () {
        const db = yield* makeDb
        yield* DatabaseMigration.apply(db)
        yield* db.run("INSERT INTO migration VALUES ('20260530232709_lovely_romulus', 1)")
        yield* DatabaseMigration.apply(db)
        expect(yield* db.get("SELECT count(*) AS count FROM migration")).toEqual({ count: migrations.length + 1 })
      }).pipe(Effect.provide(SqliteClient.layer({ filename: ":memory:", disableWAL: true })), Effect.scoped),
    )
  })
})
