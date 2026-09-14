export * as DatabaseMigration from "./migration"

import { sql } from "drizzle-orm"
import { Effect, Semaphore } from "effect"
import type { EffectDrizzleSqlite } from "@opencode-ai/effect-drizzle-sqlite"
import { migrations } from "./migration.gen"
import schema from "./schema.gen"

type Database = EffectDrizzleSqlite.EffectSQLiteDatabase
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0]
const lock = Semaphore.makeUnsafe(1)

export type Migration = {
  id: string
  up: (tx: Transaction) => Effect.Effect<void, unknown>
}

// fork: a newer (or divergent) OpenCode must not silently upgrade a database
// past this binary's knowledge. Read the journal before any migration writes.
export function assertCompatible(db: Database) {
  return Effect.gen(function* () {
    const known = new Set([...migrations.map((migration) => migration.id), "20260530232709_lovely_romulus"])
    const tables = yield* db.all<{ name: string }>(sql`SELECT name FROM sqlite_master WHERE type = 'table'`)
    const completed = tables.some((table) => table.name === "migration")
      ? yield* db.all<{ id: string }>(sql`SELECT id FROM migration`)
      : []
    const reject = () =>
      Effect.die(
        new Error(
          "OpenCode Classic cannot open this database: its migration history includes an unknown migration. " +
            "Update OpenCode Classic to a compatible version. Do not delete or edit the migration journal.",
        ),
      )
    if (completed.length > 0) {
      if (completed.some((row) => !known.has(row.id))) return yield* reject()
      return
    }
    if (!tables.some((table) => table.name === "__drizzle_migrations")) return
    const columns = yield* db.all<{ name: string }>(sql`SELECT name FROM pragma_table_info('__drizzle_migrations')`)
    if (columns.some((column) => column.name === "name")) {
      const entries = yield* db.all<{ name: string }>(sql`SELECT name FROM __drizzle_migrations`)
      if (entries.some((row) => !known.has(row.name))) return yield* reject()
      return
    }
    const entries = yield* db.all<{ prefix: string | null }>(sql`
      SELECT strftime('%Y%m%d%H%M%S', created_at / 1000, 'unixepoch') AS prefix FROM __drizzle_migrations
    `)
    if (entries.some((row) => !migrations.some((migration) => migration.id.startsWith(`${row.prefix}_`)))) {
      return yield* reject()
    }
  })
}

export function apply(db: Database) {
  return lock.withPermit(
    Effect.gen(function* () {
      yield* assertCompatible(db)
      const tables = yield* db.all<{ name: string }>(
        sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`,
      )
      if (tables.some((table) => table.name === "session")) return yield* applyOnly(db, migrations)
      if (tables.length > 0) return yield* Effect.die("Database is not empty and has no session table")
      yield* db.transaction((tx) =>
        Effect.gen(function* () {
          yield* schema.up(tx)
          yield* tx.run(
            sql`CREATE TABLE ${sql.identifier("migration")} (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)`,
          )
          yield* Effect.forEach(migrations, (migration) =>
            tx.run(
              sql`INSERT INTO ${sql.identifier("migration")} (id, time_completed) VALUES (${migration.id}, ${Date.now()})`,
            ),
          )
        }),
      )
    }),
  )
}

export function applyOnly(db: Database, input: Migration[]) {
  return Effect.gen(function* () {
    yield* db.run(
      sql`CREATE TABLE IF NOT EXISTS ${sql.identifier("migration")} (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)`,
    )
    let completed = new Set(
      (yield* db.all<{ id: string }>(sql`SELECT id FROM ${sql.identifier("migration")}`)).map((row) => row.id),
    )
    if (completed.size === 0) {
      // Existing installs used Drizzle's migration journal. Seed the new
      // journal once so TypeScript migrations don't replay old SQL.
      if (
        yield* db.get(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${"__drizzle_migrations"}`)
      ) {
        const named = (yield* db.all<{ name: string }>(
          sql`SELECT name FROM pragma_table_info('__drizzle_migrations')`,
        )).some((column) => column.name === "name")

        if (named) {
          yield* db.run(sql`
            INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
            SELECT name, ${Date.now()}
            FROM ${sql.identifier("__drizzle_migrations")}
            WHERE name IS NOT NULL
          `)
        }

        if (!named) {
          const entries = yield* db.all<{ created_at: number; prefix: string | null }>(sql`
            SELECT created_at, strftime('%Y%m%d%H%M%S', created_at / 1000, 'unixepoch') AS prefix
            FROM ${sql.identifier("__drizzle_migrations")}
            WHERE created_at IS NOT NULL
          `)

          for (const entry of entries) {
            const migration = input.find((item) => item.id.startsWith(`${entry.prefix}_`))
            if (!migration) {
              return yield* Effect.die(
                new Error(`Legacy migration timestamp ${entry.created_at} does not match any known migration`),
              )
            }
            yield* db.run(sql`
              INSERT OR IGNORE INTO ${sql.identifier("migration")} (id, time_completed)
              VALUES (${migration.id}, ${Date.now()})
            `)
          }
        }
        completed = new Set(
          (yield* db.all<{ id: string }>(sql`SELECT id FROM ${sql.identifier("migration")}`)).map((row) => row.id),
        )
      }
    }

    for (const migration of input) {
      if (completed.has(migration.id)) continue
      yield* db.transaction((tx) =>
        Effect.gen(function* () {
          yield* migration.up(tx)
          yield* tx.run(
            sql`INSERT INTO ${sql.identifier("migration")} (id, time_completed) VALUES (${migration.id}, ${Date.now()})`,
          )
        }),
      )
    }
  })
}
