import { describe, expect, test } from "bun:test"
import { DatabaseSync } from "node:sqlite"
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
  lstatSync,
  renameSync,
  symlinkSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { execFileSync } from "node:child_process"
import { Effect } from "effect"
import schema from "../../../core/src/database/schema.gen"
import { migrations } from "../../../core/src/database/migration.gen"
import { activateProfileImport, recoverProfileImport, runProfileImport } from "./profile-import-stage"
import { profilePaths, profileRoots, remapProfilePath } from "./profile-import-paths"
import { databaseFingerprint, inventoryProfile } from "./profile-import-files"
import { createServer } from "node:net"
import { Worker } from "node:worker_threads"
import { createProfileImportController } from "./profile-import-controller"
import { ProfileImportFailure } from "./profile-import-paths"
import { chatImportEnglish } from "@opencode-ai/app/i18n/chat-import"
import { beginProfileStage } from "./profile-import-journal"
import { beginProfileScratch, cleanupProfileScratch } from "./profile-import-scratch"
import { profileImportConsentText } from "./profile-import-consent"

async function fixture() {
  const root = mkdtempSync(join(tmpdir(), "classic-profile-"))
  const source = profileRoots(join(root, "source"))
  const userData = join(root, "classic")
  const paths = profilePaths(userData)
  const target = profileRoots(paths.live)
  for (const dir of [source.config, source.data, source.state, target.config, target.data, target.state])
    mkdirSync(dir, { recursive: true })
  const destination = join(target.data, "opencode.db")
  for (const file of [join(source.data, "opencode.db"), destination]) {
    const db = new DatabaseSync(file)
    await Effect.runPromise(schema.up({ run: (sql: string) => Effect.sync(() => db.exec(sql)) } as never))
    db.exec("CREATE TABLE migration (id TEXT PRIMARY KEY, time_completed INTEGER NOT NULL)")
    for (const migration of migrations) db.prepare("INSERT INTO migration VALUES (?, 1)").run(migration.id)
    db.close()
  }
  writeFileSync(join(target.config, "opencode.jsonc"), '{"$schema":"https://opencode.ai/config.json"}')
  const db = new DatabaseSync(join(source.data, "opencode.db"))
  db.exec(
    "INSERT INTO project (id,worktree,time_created,time_updated,sandboxes,commands) VALUES ('p','/external/repo',1,1,'[]','{\"start\":\"must-not-run\"}')",
  )
  db.exec(
    "INSERT INTO session (id,project_id,slug,directory,title,version,time_created,time_updated,permission,share_url,revert) VALUES ('ses_copy','p','copy','/external/repo','Keep me','1.18.30',1,2,'[]','https://example.invalid/share','{}')",
  )
  db.exec(
    "INSERT INTO account VALUES ('acc','test@example.invalid','https://example.invalid','ACCESS_SENTINEL','REFRESH_SENTINEL',99,1,1)",
  )
  db.exec("INSERT INTO account_state VALUES (1,'acc','org')")
  db.exec(
    "INSERT INTO control_account VALUES ('test@example.invalid','https://example.invalid','CONTROL_ACCESS','CONTROL_REFRESH',99,1,1,1)",
  )
  db.exec(
    "INSERT INTO credential (id,label,value,time_created,time_updated) VALUES ('cred','local','{\"key\":\"DB_SECRET_SENTINEL\"}',1,1)",
  )
  db.exec("INSERT INTO permission VALUES ('perm','p','read','/external/repo/*',1,1)")
  db.exec("INSERT INTO session_share VALUES ('ses_copy','share','SHARE_SECRET','https://example.invalid/share',1,1)")
  db.exec("INSERT INTO data_migration VALUES ('complete',1)")
  db.exec("INSERT INTO event_sequence VALUES ('ses_copy',1,'old-owner')")
  db.exec("INSERT INTO event VALUES ('evt_copy','ses_copy',1,'historical','{}')")
  db.exec("INSERT INTO session_input VALUES ('pending','ses_copy','{}','queue',1,NULL,1)")
  db.exec("INSERT INTO session_context_epoch VALUES ('ses_copy','{}','{}',1)")
  db.close()
  writeFileSync(join(source.data, "auth.json"), '{"test":{"type":"api","key":"API_SECRET_SENTINEL"}}', { mode: 0o644 })
  writeFileSync(
    join(source.config, "opencode.jsonc"),
    '{\n// retain comments\n"model":"test/model",\n"mcp":{"local":{"type":"local","command":["must-not-run"]}},\n}',
  )
  writeFileSync(join(source.state, "model.json"), '{"recent":["test/model"]}')
  mkdirSync(join(source.config, "agents"))
  writeFileSync(join(source.config, "agents", "custom.md"), "---\ndescription: custom\n---\nKeep agent content")
  return {
    root,
    source,
    target,
    userData,
    paths,
    destination,
    input: { source, destination, userData },
    [Symbol.dispose]() {
      rmSync(root, { recursive: true, force: true })
    },
  }
}

function stage(input: Parameters<typeof runProfileImport>[0]) {
  const preview = runProfileImport(input)
  return runProfileImport({ ...input, fingerprint: preview.fingerprint })
}

describe("full profile import", () => {
  test("preview writes nothing and discloses no credentials; staged activation copies all setup state", async () => {
    using tmp = await fixture()
    const before = inventoryProfile(tmp.source).fingerprint
    const database = databaseFingerprint(join(tmp.source.data, "opencode.db"))
    const original = readFileSync(tmp.destination)
    const preview = runProfileImport(tmp.input)
    expect(preview.summary).toMatchObject({ sessions: 1, providers: 1, accounts: 2 })
    expect(JSON.stringify(preview)).not.toContain("SECRET")
    expect(JSON.stringify(preview)).not.toContain("ACCESS_SENTINEL")
    expect(existsSync(tmp.paths.stage)).toBe(false)
    runProfileImport({ ...tmp.input, fingerprint: preview.fingerprint })
    expect(readFileSync(tmp.destination)).toEqual(original)
    expect(inventoryProfile(tmp.source).fingerprint).toBe(before)
    expect(databaseFingerprint(join(tmp.source.data, "opencode.db"))).toBe(database)
    activateProfileImport(tmp.userData)
    const db = new DatabaseSync(tmp.destination)
    expect(db.prepare("SELECT title,share_url FROM session").get()).toEqual({
      title: "Keep me",
      share_url: "https://example.invalid/share",
    })
    expect(db.prepare("SELECT access_token FROM account").get()?.access_token).toBe("ACCESS_SENTINEL")
    expect(db.prepare("SELECT value FROM credential").get()?.value).toContain("DB_SECRET_SENTINEL")
    expect(db.prepare("SELECT commands FROM project").get()?.commands).toContain("must-not-run")
    expect(db.prepare("SELECT owner_id FROM event_sequence").get()?.owner_id).toBeNull()
    expect(db.prepare("SELECT promoted_seq FROM session_input").get()?.promoted_seq).toBeNull()
    expect(db.prepare("SELECT secret FROM session_share").get()?.secret).toBe("SHARE_SECRET")
    expect(db.prepare("SELECT baseline FROM session_context_epoch").get()?.baseline).toBe("{}")
    expect(db.prepare("SELECT name FROM data_migration").get()?.name).toBe("complete")
    db.close()
    expect(readFileSync(join(tmp.target.config, "opencode.jsonc"), "utf8")).toContain("// retain comments")
    expect(readFileSync(join(tmp.target.config, "agents", "custom.md"), "utf8")).toContain("Keep agent content")
    expect(readFileSync(join(tmp.target.data, "auth.json"), "utf8")).toContain("API_SECRET_SENTINEL")
    expect(lstatSync(join(tmp.target.data, "auth.json")).mode & 0o777).toBe(0o600)
    expect(lstatSync(tmp.destination).mode & 0o777).toBe(0o600)
    expect(existsSync(tmp.paths.stage)).toBe(false)
    expect(existsSync(tmp.paths.backup)).toBe(false)
  })

  test("refuses existing config, credentials, project paths or cloud identity even without chats", async () => {
    using tmp = await fixture()
    writeFileSync(join(tmp.target.config, "opencode.jsonc"), '{"model":"keep/model"}')
    expect(() => runProfileImport(tmp.input)).toThrow("nonempty")
    writeFileSync(join(tmp.target.config, "opencode.jsonc"), "{}")
    writeFileSync(join(tmp.target.data, "auth.json"), '{"keep":{"type":"api","key":"keep"}}')
    expect(() => runProfileImport(tmp.input)).toThrow("nonempty")
    rmSync(join(tmp.target.data, "auth.json"))
    const db = new DatabaseSync(tmp.destination)
    db.exec(
      "INSERT INTO project (id,worktree,time_created,time_updated,sandboxes) VALUES ('existing','/keep',1,1,'[]')",
    )
    db.close()
    expect(() => runProfileImport(tmp.input)).toThrow("nonempty")
  })

  test("rejects changed config or WAL content between preview and confirmation", async () => {
    using tmp = await fixture()
    const preview = runProfileImport(tmp.input)
    writeFileSync(join(tmp.source.state, "model.json"), '{"recent":["changed"]}')
    expect(() => runProfileImport({ ...tmp.input, fingerprint: preview.fingerprint })).toThrow("changed")
    const next = runProfileImport(tmp.input)
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.exec("PRAGMA journal_mode=WAL; UPDATE session SET title='changed'")
    expect(() => runProfileImport({ ...tmp.input, fingerprint: next.fingerprint })).toThrow("changed")
    db.close()
    expect(existsSync(tmp.paths.stage)).toBe(false)
  })

  test("retains WAL-only records without altering the source DB or WAL", async () => {
    using tmp = await fixture()
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.exec("PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0; UPDATE session SET title='WAL title'")
    const before = databaseFingerprint(join(tmp.source.data, "opencode.db"))
    stage(tmp.input)
    expect(databaseFingerprint(join(tmp.source.data, "opencode.db"))).toBe(before)
    activateProfileImport(tmp.userData)
    const dest = new DatabaseSync(tmp.destination)
    expect(dest.prepare("SELECT title FROM session").get()?.title).toBe("WAL title")
    dest.close()
    db.close()
  })

  test("rejects future schemas and malformed JSONC without a partial import", async () => {
    using tmp = await fixture()
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.exec("INSERT INTO migration VALUES ('future',1)")
    db.close()
    expect(() => runProfileImport(tmp.input)).toThrow("incompatible")
    writeFileSync(join(tmp.source.config, "opencode.jsonc"), '{"model":')
    expect(() => runProfileImport(tmp.input)).toThrow("invalid")
    expect(existsSync(tmp.paths.stage)).toBe(false)
  })

  test("strips source triggers and views while keeping their tables intact", async () => {
    using tmp = await fixture()
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.exec("CREATE TRIGGER malicious AFTER INSERT ON session BEGIN DELETE FROM credential; END")
    db.exec("CREATE VIEW sneaky AS SELECT access_token FROM account")
    db.close()
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    const dest = new DatabaseSync(tmp.destination)
    expect(dest.prepare("SELECT name FROM sqlite_master WHERE type='trigger'").all()).toEqual([])
    expect(dest.prepare("SELECT name FROM sqlite_master WHERE type='view'").all()).toEqual([])
    expect(dest.prepare("SELECT count(*) AS n FROM credential").get()?.n).toBe(1)
    dest.close()
  })

  test("skips dangling links nested inside materialized directories", async () => {
    using tmp = await fixture()
    const external = join(tmp.root, "dotfiles")
    mkdirSync(join(external, "sub"), { recursive: true })
    writeFileSync(join(external, "sub", "real.txt"), "present")
    symlinkSync(join(tmp.root, "gone"), join(external, "sub", "stale"))
    symlinkSync(external, join(tmp.source.config, "dotfiles"))
    const preview = runProfileImport(tmp.input)
    expect(preview.summary.skipped).toBeGreaterThanOrEqual(1)
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    expect(readFileSync(join(tmp.target.config, "dotfiles", "sub", "real.txt"), "utf8")).toBe("present")
    expect(existsSync(join(tmp.target.config, "dotfiles", "sub", "stale"))).toBe(false)
  })

  test("imports shared directories linked twice without a false cycle", async () => {
    using tmp = await fixture()
    const shared = join(tmp.root, "shared")
    mkdirSync(shared)
    writeFileSync(join(shared, "data.txt"), "shared content")
    symlinkSync(shared, join(tmp.source.config, "first"))
    symlinkSync(shared, join(tmp.source.config, "second"))
    const preview = runProfileImport(tmp.input)
    expect(preview.summary.materialized).toBeGreaterThanOrEqual(2)
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    expect(readFileSync(join(tmp.target.config, "first", "data.txt"), "utf8")).toBe("shared content")
    expect(readFileSync(join(tmp.target.config, "second", "data.txt"), "utf8")).toBe("shared content")
  })

  test("refuses non-consecutive migration journals", async () => {
    using tmp = await fixture()
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    const ids = db
      .prepare("SELECT id FROM migration ORDER BY id")
      .all()
      .map((row) => String(row.id))
    db.prepare("DELETE FROM migration WHERE id = ?").run(ids[Math.floor(ids.length / 2)])
    db.close()
    expect(() => runProfileImport(tmp.input)).toThrow("incompatible")
  })

  test("imports older-journal sources and leaves pending migrations to the app", async () => {
    using tmp = await fixture()
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.exec("DELETE FROM migration WHERE id = (SELECT id FROM migration ORDER BY id DESC LIMIT 1)")
    db.close()
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    const dest = new DatabaseSync(tmp.destination)
    const remaining = dest.prepare("SELECT count(*) AS n FROM migration").get()?.n
    const all = new DatabaseSync(join(tmp.source.data, "opencode.db"), { readOnly: true })
    const original = all.prepare("SELECT count(*) AS n FROM migration").get()?.n
    all.close()
    expect(remaining).toBe(original)
    expect(dest.prepare("SELECT title FROM session").get()?.title).toBe("Keep me")
    expect(dest.prepare("PRAGMA quick_check").get()?.quick_check).toBe("ok")
    dest.close()
  })

  test("materializes external symlinks and still rejects overlapping roots", async () => {
    using tmp = await fixture()
    const external = join(tmp.root, "linked-config")
    mkdirSync(external)
    writeFileSync(join(external, "shared.md"), "external content")
    symlinkSync(join(external, "shared.md"), join(tmp.source.config, "shared.md"))
    symlinkSync(external, join(tmp.source.config, "linked-dir"))
    const preview = runProfileImport(tmp.input)
    expect(preview.summary.materialized).toBe(2)
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    expect(readFileSync(join(tmp.target.config, "shared.md"), "utf8")).toBe("external content")
    expect(readFileSync(join(tmp.target.config, "linked-dir", "shared.md"), "utf8")).toBe("external content")
    expect(lstatSync(join(tmp.target.config, "shared.md")).isSymbolicLink()).toBe(false)
    expect(() => runProfileImport({ ...tmp.input, source: { ...tmp.source, config: tmp.source.data } })).toThrow(
      "unsupported",
    )
  })

  test("skips dangling links and runtime sockets instead of refusing", async () => {
    using tmp = await fixture()
    symlinkSync(join(tmp.root, "missing-target"), join(tmp.source.config, "broken"))
    const socketPath = join(tmp.source.state, "runtime.sock")
    const server = createServer()
    await new Promise<void>((resolve) => server.listen(socketPath, resolve))
    try {
      const preview = runProfileImport(tmp.input)
      expect(preview.summary.skipped).toBeGreaterThanOrEqual(2)
      stage(tmp.input)
      activateProfileImport(tmp.userData)
      expect(existsSync(join(tmp.target.config, "broken"))).toBe(false)
      expect(existsSync(join(tmp.target.state, "runtime.sock"))).toBe(false)
    } finally {
      server.close()
    }
  })

  test("reads configuration files above the metadata limit", async () => {
    using tmp = await fixture()
    const padding = "// " + "x".repeat(1024) + "\n"
    const huge = `{"model":"t/m",\n${padding.repeat(20 * 1024)}}`
    writeFileSync(join(tmp.source.config, "opencode.json"), huge)
    const preview = runProfileImport(tmp.input)
    expect(preview.summary.sessions).toBe(1)
  })

  test("git metadata symlink refusals carry structured detail", async () => {
    using tmp = await fixture()
    const objects = join(tmp.source.data, "snapshot", "p", "one", "objects")
    mkdirSync(objects, { recursive: true })
    const info = join(tmp.source.data, "linked-info")
    mkdirSync(info)
    writeFileSync(join(info, "alternates"), "/external/repo/.git/objects")
    symlinkSync(info, join(objects, "info"))
    try {
      runProfileImport(tmp.input)
      throw new Error("expected git-objects failure")
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileImportFailure)
      const failure = error as ProfileImportFailure
      expect(failure.code).toBe("git-objects")
      expect(failure.detail?.category).toBe("symlink-in-git-metadata")
      expect(failure.detail?.paths?.length).toBeGreaterThan(0)
    }
  })

  test("a continuously written source reports source-busy, and a quiescent retry succeeds", async () => {
    using tmp = await fixture()
    const file = join(tmp.source.data, "opencode.db")
    const db = new DatabaseSync(file)
    db.exec("PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0")
    const writer = new Worker(
      `
      const { DatabaseSync } = require("node:sqlite")
      const db = new DatabaseSync(${JSON.stringify(file)})
      let n = 0
      const timer = setInterval(() => db.exec("UPDATE session SET time_updated = " + (++n)), 3)
      process.on("exit", () => clearInterval(timer))
    `,
      { eval: true },
    )
    let busy = false
    let complete = false
    try {
      try {
        runProfileImport(tmp.input)
        complete = true
      } catch (error) {
        busy = error instanceof ProfileImportFailure && error.code === "source-busy"
      }
      expect(busy || complete).toBe(true)
    } finally {
      await writer.terminate()
    }
    db.exec("PRAGMA wal_checkpoint(TRUNCATE)")
    db.close()
    const preview = runProfileImport(tmp.input)
    expect(preview.summary.sessions).toBe(1)
  })

  test("crash after first directory rename recovers before any server opens the DB", async () => {
    using tmp = await fixture()
    stage(tmp.input)
    renameSync(tmp.paths.live, tmp.paths.backup)
    activateProfileImport(tmp.userData)
    expect(readFileSync(join(tmp.target.data, "auth.json"), "utf8")).toContain("API_SECRET_SENTINEL")
    expect(existsSync(tmp.paths.journal)).toBe(false)
  })

  test("crash after second rename completes recovery idempotently", async () => {
    using tmp = await fixture()
    stage(tmp.input)
    renameSync(tmp.paths.live, tmp.paths.backup)
    renameSync(tmp.paths.stage, tmp.paths.live)
    activateProfileImport(tmp.userData)
    activateProfileImport(tmp.userData)
    expect(existsSync(tmp.paths.backup)).toBe(false)
    expect(existsSync(join(tmp.target.data, "auth.json"))).toBe(true)
  })

  test("activation rechecks an empty destination and preserves new data on refusal", async () => {
    using tmp = await fixture()
    stage(tmp.input)
    writeFileSync(join(tmp.target.config, "opencode.jsonc"), '{"model":"new/keep"}')
    recoverProfileImport(tmp.userData)
    expect(readFileSync(join(tmp.target.config, "opencode.jsonc"), "utf8")).toContain("new/keep")
    expect(existsSync(join(tmp.target.data, "auth.json"))).toBe(false)
    expect(existsSync(tmp.paths.journal)).toBe(false)
  })

  test("a killed worker's unjournaled stage is never activated", async () => {
    using tmp = await fixture()
    mkdirSync(tmp.paths.stage)
    writeFileSync(join(tmp.paths.stage, "partial"), "not ready")
    activateProfileImport(tmp.userData)
    expect(existsSync(tmp.paths.stage)).toBe(true)
    expect(readFileSync(join(tmp.paths.stage, "partial"), "utf8")).toBe("not ready")
    expect(existsSync(tmp.destination)).toBe(true)
  })

  test("a killed worker's proven building stage is safely removed", async () => {
    using tmp = await fixture()
    beginProfileStage(tmp.userData, tmp.destination)
    writeFileSync(join(tmp.paths.stage, "partial"), "not ready")
    activateProfileImport(tmp.userData)
    expect(existsSync(tmp.paths.stage)).toBe(false)
    expect(existsSync(tmp.destination)).toBe(true)
  })

  test("recovery never promotes a substituted backup symlink", async () => {
    using tmp = await fixture()
    stage(tmp.input)
    renameSync(tmp.paths.live, join(tmp.userData, "saved-original"))
    symlinkSync(join(tmp.userData, "saved-original"), tmp.paths.backup)
    expect(() => recoverProfileImport(tmp.userData)).toThrow()
    expect(existsSync(tmp.paths.live)).toBe(false)
    expect(lstatSync(tmp.paths.backup).isSymbolicLink()).toBe(true)
  })

  test("read-only import preserves SHM and refuses auxiliary symlinks", async () => {
    using tmp = await fixture()
    const file = join(tmp.source.data, "opencode.db")
    const db = new DatabaseSync(file)
    db.exec("PRAGMA journal_mode=WAL; UPDATE session SET title='wal'")
    const shm = readFileSync(`${file}-shm`)
    stage(tmp.input)
    expect(readFileSync(`${file}-shm`)).toEqual(shm)
    db.close()
    using second = await fixture()
    symlinkSync(join(second.source.data, "auth.json"), join(second.source.data, "opencode.db-shm"))
    expect(() => runProfileImport(second.input)).toThrow("special-files")
  })

  test("recognizes only the generated plugin scaffold as an empty config", async () => {
    using tmp = await fixture()
    writeFileSync(join(tmp.target.config, "package.json"), '{"dependencies":{"@opencode-ai/plugin":"1.18.30"}}')
    writeFileSync(join(tmp.target.config, "package-lock.json"), "{}")
    mkdirSync(join(tmp.target.config, "node_modules"))
    writeFileSync(join(tmp.target.config, "node_modules", "generated"), "cache")
    expect(runProfileImport(tmp.input).summary.sessions).toBe(1)
    writeFileSync(join(tmp.target.config, "package.json"), '{"dependencies":{"custom-plugin":"1"}}')
    expect(() => runProfileImport(tmp.input)).toThrow("nonempty")
  })

  test("preserves lexical root aliases and remaps permission-map keys and rule patterns", async () => {
    using tmp = await fixture()
    tmp.source.aliases = { config: "/old/config", data: "/old/data", state: "/old/state" }
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.exec(
      `UPDATE session SET permission='[{"permission":"read","pattern":"/old/data/worktree/**","action":"allow"}]'`,
    )
    db.close()
    writeFileSync(
      join(tmp.source.config, "opencode.jsonc"),
      '{"permission":{"read":{"/old/data/worktree/**":"allow"}}}',
    )
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    const dest = new DatabaseSync(tmp.destination)
    expect(dest.prepare("SELECT permission FROM session").get()?.permission).toContain(tmp.target.data)
    dest.close()
    expect(readFileSync(join(tmp.target.config, "opencode.jsonc"), "utf8")).toContain(tmp.target.data)
  })

  test("remaps root-contained paths only and keeps external project paths", async () => {
    using tmp = await fixture()
    expect(remapProfilePath(join(tmp.source.data, "worktree", "one"), tmp.source, tmp.target)).toBe(
      join(tmp.target.data, "worktree", "one"),
    )
    expect(remapProfilePath(`${tmp.source.data}-other/file`, tmp.source, tmp.target)).toBe(
      `${tmp.source.data}-other/file`,
    )
    expect(remapProfilePath("/external/repo", tmp.source, tmp.target)).toBe("/external/repo")
  })

  test("copies a real linked worktree with staged, unstaged and untracked edits into private Git metadata", async () => {
    using tmp = await fixture()
    const repo = join(tmp.root, "repo")
    const worktree = join(tmp.source.data, "worktree", "p", "one")
    mkdirSync(repo)
    const git = (cwd: string, ...args: string[]) =>
      execFileSync("git", ["-c", "core.fsmonitor=false", "-c", "core.hooksPath=/dev/null", "-C", cwd, ...args], {
        env: {
          ...process.env,
          GIT_CONFIG_NOSYSTEM: "1",
          GIT_CONFIG_GLOBAL: "/dev/null",
          GIT_AUTHOR_NAME: "Fixture",
          GIT_AUTHOR_EMAIL: "fixture@example.invalid",
          GIT_COMMITTER_NAME: "Fixture",
          GIT_COMMITTER_EMAIL: "fixture@example.invalid",
        },
        encoding: "utf8",
        stdio: "pipe",
      })
    git(repo, "init")
    writeFileSync(join(repo, "tracked"), "base\n")
    git(repo, "add", "tracked")
    git(repo, "commit", "-m", "fixture")
    git(repo, "worktree", "add", "-b", "workspace", worktree)
    writeFileSync(join(worktree, "tracked"), "staged\n")
    git(worktree, "add", "tracked")
    writeFileSync(join(worktree, "tracked"), "unstaged\n")
    writeFileSync(join(worktree, "untracked"), "keep\n")
    const before = git(worktree, "status", "--porcelain")
    const db = new DatabaseSync(join(tmp.source.data, "opencode.db"))
    db.prepare("INSERT INTO workspace (id,type,directory,project_id,time_used) VALUES ('ws','local',?,'p',1)").run(
      worktree,
    )
    db.prepare("UPDATE session SET directory=?, workspace_id='ws'").run(worktree)
    db.close()
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    const copied = join(tmp.target.data, "worktree", "p", "one")
    expect(lstatSync(join(copied, ".git")).isDirectory()).toBe(true)
    expect(git(copied, "status", "--porcelain")).toBe(before)
    expect(git(copied, "show", ":tracked")).toBe("staged\n")
    expect(readFileSync(join(copied, "tracked"), "utf8")).toBe("unstaged\n")
    git(copied, "add", "tracked")
    expect(git(worktree, "show", ":tracked")).toBe("staged\n")
    expect(git(worktree, "status", "--porcelain")).toBe(before)
    const dest = new DatabaseSync(tmp.destination)
    expect(dest.prepare("SELECT directory FROM workspace").get()?.directory).toBe(copied)
    expect(dest.prepare("SELECT directory FROM session").get()?.directory).toBe(copied)
    dest.close()
  })

  test("controller requires same-window single-use confirmation and pins the destination", async () => {
    using tmp = await fixture()
    const controller = createProfileImportController({
      destination: () => ({ database: tmp.destination, userData: tmp.userData }),
      select: async () => tmp.source,
      approve: async () => true,
      run: async (input) => ({ status: "complete", ...runProfileImport(input) }),
    })
    const preview = await controller.preview(1, false)
    if (preview.status !== "ready") throw new Error("fixture preview failed")
    expect(await controller.confirm(2, preview.token)).toEqual({ status: "error", code: "changed" })
    expect(await controller.confirm(1, preview.token)).toEqual({ status: "staged" })
    expect(await controller.confirm(1, preview.token)).toEqual({ status: "error", code: "changed" })
    expect(await controller.preview(1, "/arbitrary/path")).toEqual({ status: "error", code: "unavailable" })
  })

  test("native confirmation refusal does not stage a setup", async () => {
    using tmp = await fixture()
    const controller = createProfileImportController({
      destination: () => ({ database: tmp.destination, userData: tmp.userData }),
      select: async () => tmp.source,
      approve: async () => false,
      run: async (input) => ({ status: "complete", ...runProfileImport(input) }),
    })
    const preview = await controller.preview(1, false)
    if (preview.status !== "ready") throw new Error("fixture preview failed")
    expect(await controller.confirm(1, preview.token)).toEqual({ status: "cancelled" })
    expect(existsSync(tmp.paths.journal)).toBe(false)
  })

  test("snapshot object alternates are materialized and work after the original repository is moved", async () => {
    using tmp = await fixture()
    const repo = join(tmp.root, "objects-source")
    const snapshot = join(tmp.source.data, "snapshot", "p", "snapshot")
    mkdirSync(repo)
    const git = (args: string[]) =>
      execFileSync("git", ["-c", "core.hooksPath=/dev/null", ...args], {
        env: {
          ...process.env,
          GIT_CONFIG_GLOBAL: "/dev/null",
          GIT_CONFIG_NOSYSTEM: "1",
          GIT_AUTHOR_NAME: "Fixture",
          GIT_AUTHOR_EMAIL: "fixture@example.invalid",
          GIT_COMMITTER_NAME: "Fixture",
          GIT_COMMITTER_EMAIL: "fixture@example.invalid",
        },
        stdio: "pipe",
        encoding: "utf8",
      })
    git(["-C", repo, "init"])
    writeFileSync(join(repo, "file"), "snapshot object\n")
    git(["-C", repo, "add", "file"])
    git(["-C", repo, "commit", "-m", "fixture"])
    const commit = git(["-C", repo, "rev-parse", "HEAD"]).trim()
    git(["init", "--bare", snapshot])
    writeFileSync(join(snapshot, "objects", "info", "alternates"), join(repo, ".git", "objects") + "\n")
    stage(tmp.input)
    activateProfileImport(tmp.userData)
    renameSync(repo, `${repo}-moved`)
    const imported = join(tmp.target.data, "snapshot", "p", "snapshot")
    expect(readFileSync(join(imported, "objects", "info", "alternates"), "utf8")).not.toContain(repo)
    expect(git(["--git-dir", imported, "show", `${commit}:file`])).toBe("snapshot object\n")
  })

  test("unknown top-level sidecar data is not discarded", async () => {
    using tmp = await fixture()
    writeFileSync(join(tmp.paths.live, "keep-me"), "owner data")
    expect(() => runProfileImport(tmp.input)).toThrow("nonempty")
    expect(readFileSync(join(tmp.paths.live, "keep-me"), "utf8")).toBe("owner data")
  })

  test("activated recovery retains the rollback copy if integrity changed", async () => {
    using tmp = await fixture()
    stage(tmp.input)
    const journal = JSON.parse(readFileSync(tmp.paths.journal, "utf8"))
    renameSync(tmp.paths.live, tmp.paths.backup)
    renameSync(tmp.paths.stage, tmp.paths.live)
    writeFileSync(tmp.paths.journal, JSON.stringify({ ...journal, phase: "activated" }))
    writeFileSync(join(tmp.target.data, "auth.json"), "corrupted")
    expect(() => recoverProfileImport(tmp.userData)).toThrow("changed")
    expect(existsSync(tmp.paths.backup)).toBe(true)
    expect(existsSync(tmp.paths.journal)).toBe(true)
  })

  test("main-owned scratch cleanup recovers interrupted copies and leaves unknown directories alone", async () => {
    using tmp = await fixture()
    const scratch = beginProfileScratch(tmp.userData)
    writeFileSync(join(scratch, "opencode.db"), "SECRET_PARTIAL_COPY")
    const unknown = join(tmp.userData, ".profile-snapshot-unrelated")
    mkdirSync(unknown)
    writeFileSync(join(unknown, "keep"), "owner")
    cleanupProfileScratch(tmp.userData)
    expect(existsSync(scratch)).toBe(false)
    expect(existsSync(join(unknown, "keep"))).toBe(true)
  })

  test("every importer error code has user copy", () => {
    const codes = [
      "unavailable",
      "incompatible",
      "invalid",
      "nonempty",
      "changed",
      "busy",
      "unsupported",
      "space",
      "source-busy",
      "links",
      "git-objects",
      "special-files",
      "limit",
      "oversized-file",
    ]
    for (const code of codes)
      expect(typeof (chatImportEnglish as Record<string, string>)[`profileImport.error.${code}`]).toBe("string")
  })

  test("consent copy is main-owned and interpolates the preview counts", () => {
    const text = profileImportConsentText({
      config: "/c",
      data: "/d",
      state: "/s",
      sessions: 1,
      providers: 2,
      accounts: 3,
      workspaces: 0,
      files: 0,
      bytes: 0,
      live: false,
      materialized: 0,
      skipped: 0,
      plugins: 4,
      mcp: 5,
      commands: 6,
      permissions: 7,
      pending: 8,
      git: 9,
    })
    expect(text.title).toBe("Import full OpenCode setup")
    expect(text.cancel).toBe("Cancel")
    expect(text.confirm).toBe("Copy trusted setup")
    expect(text.detail).toContain("Saved provider credentials: 2")
    expect(text.detail).toContain("Git checkouts: 9")
    expect(text.detail).toContain("Pending prompts remain queued until resumed")
    expect(text.detail).not.toContain("{{")
  })
})
