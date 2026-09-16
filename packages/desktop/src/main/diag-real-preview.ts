import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { DatabaseSync } from "node:sqlite"

const REPO = "/tmp/opencode/opencode-classic-import"
const { Effect } = await import("effect")
const schema = (await import("../../../core/src/database/schema.gen")).default
const { migrations } = await import(join(REPO, "packages/core/src/database/migration.gen.ts"))
const { runProfileImport } = await import(join(REPO, "packages/desktop/src/main/profile-import-stage.ts"))

const home = process.env.HOME!
const source = {
  config: `${home}/.config/opencode`,
  data: `${home}/.local/share/opencode`,
  state: `${home}/.local/state/opencode`,
}
const userData = join(home, "diag-robust-preview")
rmSync(userData, { recursive: true, force: true })
for (const dir of ["config", "data", "state"]) mkdirSync(join(userData, "sidecar", dir, "opencode"), { recursive: true })
const destination = join(userData, "sidecar/data/opencode/opencode.db")
const db = new DatabaseSync(destination)
await Effect.runPromise(schema.up({ run: (sql: string) => Effect.sync(() => db.exec(sql)) } as never))
db.exec("CREATE TABLE migration (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)")
for (const migration of migrations) db.prepare("INSERT INTO migration VALUES (?, 1)").run(migration.id)
db.close()
writeFileSync(join(userData, "sidecar/config/opencode/opencode.jsonc"), '{"$schema":"https://opencode.ai/config.json"}')

try {
  const result = runProfileImport({ source, userData, destination })
  console.log("PREVIEW OK")
  console.log(JSON.stringify(result.summary, null, 1))
} catch (error) {
  console.log("THREW:", (error as Error).constructor.name, (error as Error).message)
  console.log("detail:", JSON.stringify((error as { detail?: unknown }).detail ?? null))
  console.log((error as Error).stack?.split("\n").slice(0, 6).join("\n"))
} finally {
  rmSync(userData, { recursive: true, force: true })
}
