import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { existsSync, lstatSync, mkdirSync, readdirSync, readlinkSync, realpathSync, renameSync, rmSync, writeFileSync, openSync, fsyncSync, closeSync, constants } from "node:fs"
import { basename, dirname, join, relative } from "node:path"
import type { ProfileImportSummary } from "@opencode-ai/app/profile-import"
import { copyProfileFiles, databaseFingerprint, digestProfileFile, inventoryProfile, parseProfileConfig, remapConfig, secureRead, syncDirectory, writePrivate } from "./profile-import-files"
import { assertProfileDestination, inside, ProfileImportFailure, profilePaths, profileRoots, remapProfilePath, type ProfileRoots } from "./profile-import-paths"
import { assertFreshProfile, closeProfileDatabase, copyProfileDatabase, inspectProfileDatabase, openProfileDatabase } from "./profile-import-database"
import { ChatImportFailure } from "./chat-import-database"

export type ProfileImportInput = { source: ProfileRoots; userData: string; destination: string; fingerprint?: string }

export function runProfileImport(input: ProfileImportInput): { summary: ProfileImportSummary; fingerprint: string } {
  assertProfileDestination(input.destination, input.userData)
  const paths = profilePaths(input.userData)
  if (existsSync(paths.journal) || existsSync(paths.stage) || existsSync(paths.backup)) throw new ProfileImportFailure("busy")
  if (realpathSync(paths.live) !== paths.live || realpathSync(input.destination) !== input.destination) throw new ProfileImportFailure("unsupported")
  for (const root of Object.values(input.source)) {
    if (inside(root, input.userData) || inside(input.userData, root)) throw new ProfileImportFailure("unsupported")
    if (existsSync(root) && realpathSync(root) !== root) throw new ProfileImportFailure("changed")
  }
  const roots = Object.values(input.source)
  if (roots.some((root, i) => roots.some((other, j) => i !== j && inside(root, other)))) throw new ProfileImportFailure("unsupported")
  assertFreshProfile(paths.live, input.destination)
  const database = join(input.source.data, "opencode.db")
  if (realpathSync(database) !== database) throw new ProfileImportFailure("unsupported")
  const inventory = inventoryProfile(input.source)
  const before = databaseFingerprint(database)
  const fingerprint = createHash("sha256").update(inventory.fingerprint + before + JSON.stringify(input.source)).digest("hex")
  if (input.fingerprint && input.fingerprint !== fingerprint) throw new ProfileImportFailure("changed")
  for (const name of ["config.json", "opencode.json", "opencode.jsonc"]) {
    const path = join(input.source.config, name)
    if (existsSync(path)) parseProfileConfig(secureRead(path))
  }
  const authFile = join(input.source.data, "auth.json")
  const auth: Record<string, unknown> = existsSync(authFile) ? JSON.parse(secureRead(authFile)) : {}
  if (!auth || typeof auth !== "object" || Array.isArray(auth)) throw new ProfileImportFailure("invalid")
  for (const value of Object.values(auth)) {
    if (!value || typeof value !== "object" || !("type" in value)) throw new ProfileImportFailure("invalid")
    const required = value.type === "oauth" ? ["access", "refresh"] : value.type === "api" ? ["key"] : value.type === "wellknown" ? ["key", "token"] : undefined
    if (!required || required.some((key) => !(key in value) || typeof (value as Record<string, unknown>)[key] !== "string")) throw new ProfileImportFailure("invalid")
  }
  const source = openProfileDatabase(database)
  const destination = openProfileDatabase(input.destination)
  try {
    inspectProfileDatabase(source, destination)
    const count = (table: string) => Number(source.prepare(`SELECT count(*) AS n FROM ${table}`).get()?.n)
    const summary: ProfileImportSummary = { ...input.source, sessions: count("session"), providers: Object.keys(auth).length, accounts: count("account") + count("control_account"), workspaces: count("workspace"), files: inventory.entries.filter((entry) => entry.kind !== "directory").length, bytes: inventory.bytes + lstatSync(database).size }
    if (!input.fingerprint) return { summary, fingerprint }
    mkdirSync(paths.stage, { mode: 0o700 })
    try {
      const staged = profileRoots(paths.stage)
      const target = profileRoots(paths.live)
      for (const dir of Object.values(staged)) mkdirSync(dir, { recursive: true, mode: 0o700 })
      copyProfileFiles(inventory, input.source, target, paths.stage)
      for (const name of ["config.json", "opencode.json", "opencode.jsonc"]) {
        const path = join(staged.config, name)
        if (existsSync(path)) writeFileSync(path, remapConfig(secureRead(path), input.source, target))
      }
      // The checkout, index and object store are all copied before converting its
      // linked-worktree metadata. Git config edits only these staged files.
      for (const entry of inventory.entries.filter((item) => basename(item.source) === ".git" && item.kind === "file")) {
        const gitdir = join(paths.stage, `${entry.path}.private`)
        for (const name of readdirSync(gitdir).filter((name) => name.endsWith(".worktree") && name !== "config.worktree")) renameSync(join(gitdir, name), join(gitdir, name.slice(0, -9)))
        const config = join(gitdir, "config")
        const git = (args: string[]) => execFileSync("git", ["config", "--no-includes", "--file", config, ...args], { env: { PATH: process.env.PATH, HOME: paths.stage, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" }, stdio: "pipe", timeout: 10_000 })
        git(["core.bare", "false"])
        git(["core.worktree", join(paths.live, dirname(entry.path))])
        git(["extensions.worktreeConfig", "false"])
        rmSync(join(paths.stage, entry.path))
        renameSync(gitdir, join(paths.stage, entry.path))
      }
      // Snapshot stores key their directory by SHA-1 of the checkout path.
      for (const row of source.prepare("SELECT project_id, directory FROM session UNION SELECT project_id, directory FROM workspace").iterate()) {
        if (typeof row.directory !== "string" || typeof row.project_id !== "string") continue
        const mapped = remapProfilePath(row.directory, input.source, target)
        if (mapped === row.directory || !/^[\w-]+$/.test(row.project_id)) continue
        const hash = (path: string) => createHash("sha1").update(path).digest("hex")
        const old = join(staged.data, "snapshot", row.project_id, hash(row.directory))
        const next = join(staged.data, "snapshot", row.project_id, hash(mapped))
        if (existsSync(old) && !existsSync(next)) renameSync(old, next)
      }
      copyProfileDatabase(source, destination, join(staged.data, basename(input.destination)), input.source, target)
      if (before !== databaseFingerprint(database) || inventoryProfile(input.source).fingerprint !== inventory.fingerprint) throw new ProfileImportFailure("changed")
      assertFreshProfile(paths.live, input.destination)
      syncProfileTree(paths.stage)
      writePrivate(`${paths.journal}.tmp`, JSON.stringify({ version: 1, database: basename(input.destination), digest: profileTreeDigest(paths.stage) }))
      renameSync(`${paths.journal}.tmp`, paths.journal)
      syncDirectory(input.userData)
      return { summary, fingerprint }
    } catch (error) {
      // Only an unactivated staging tree is removed. The running profile is
      // untouched; crash recovery owns a stage once the journal is durable.
      if (!existsSync(paths.journal)) rmSync(paths.stage, { recursive: true, force: true })
      throw error
    }
  } catch (error) {
    if (error instanceof ChatImportFailure) throw new ProfileImportFailure(error.code === "incompatible" ? "incompatible" : "invalid")
    throw error
  } finally { closeProfileDatabase(source); closeProfileDatabase(destination) }
}

export function profileTreeDigest(root: string) {
  const hash = createHash("sha256")
  const walk = (path: string) => {
    const info = lstatSync(path)
    hash.update(JSON.stringify([relative(root, path), info.mode & 0o777, info.isSymbolicLink() ? readlinkSync(path) : info.isFile() ? digestProfileFile(path) : "directory"]))
    if (info.isDirectory()) for (const name of readdirSync(path).sort()) walk(join(path, name))
  }
  walk(root)
  return hash.digest("hex")
}

function syncProfileTree(root: string) {
  for (const name of readdirSync(root)) {
    const path = join(root, name)
    const info = lstatSync(path)
    if (info.isDirectory()) syncProfileTree(path)
    if (info.isFile()) {
      const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW)
      try { fsyncSync(fd) } finally { closeSync(fd) }
    }
  }
  syncDirectory(root)
}

// Called with Electron's single-instance lock held, BEFORE spawning a sidecar.
// Two directory renames are recoverable, not falsely claimed to be one atomic
// filesystem/SQLite transaction. Fixed paths keep recovery independent of IPC.
export function activateProfileImport(userData: string) {
  const paths = profilePaths(userData)
  if (!existsSync(paths.journal)) {
    // A killed worker cannot authorize activation: only a durable journal can.
    // These are reserved importer scratch paths, never a live profile.
    rmSync(paths.stage, { recursive: true, force: true })
    rmSync(`${paths.journal}.tmp`, { force: true })
    if (existsSync(paths.live)) rmSync(paths.backup, { recursive: true, force: true })
    return
  }
  const journal = parseProfileConfig(secureRead(paths.journal))
  if (journal.version !== 1 || typeof journal.database !== "string" || !/^opencode(?:-[\w-]+)?\.db$/.test(journal.database) || typeof journal.digest !== "string") throw new ProfileImportFailure("invalid")
  for (const path of [paths.live, paths.stage, paths.backup]) {
    if (existsSync(path) && (lstatSync(path).isSymbolicLink() || !lstatSync(path).isDirectory())) throw new ProfileImportFailure("invalid")
  }
  if (existsSync(paths.stage)) {
    if (profileTreeDigest(paths.stage) !== journal.digest) throw new ProfileImportFailure("changed")
    if (existsSync(paths.live)) {
      if (existsSync(paths.backup)) throw new ProfileImportFailure("invalid")
      assertFreshProfile(paths.live, join(profileRoots(paths.live).data, journal.database))
      renameSync(paths.live, paths.backup)
      syncDirectory(userData)
    }
    if (!existsSync(paths.backup)) throw new ProfileImportFailure("invalid")
    renameSync(paths.stage, paths.live)
    syncDirectory(userData)
  }
  if (!existsSync(paths.live) || profileTreeDigest(paths.live) !== journal.digest) throw new ProfileImportFailure("changed")
  // Retain the untouched bootstrap profile until activation is durably recorded.
  rmSync(paths.journal)
  syncDirectory(userData)
  rmSync(paths.backup, { recursive: true, force: true })
  syncDirectory(userData)
}

export function recoverProfileImport(userData: string) {
  const paths = profilePaths(userData)
  const pending = existsSync(paths.journal)
  try {
    activateProfileImport(userData)
    if (pending) recordProfileImport(userData, { status: "activated" })
  } catch (error) {
    // If activation has not replaced the live directory, cancellation is safe.
    // A corrupt post-rename state stays fail-closed for explicit recovery.
    if (existsSync(paths.backup)) {
      if (existsSync(paths.live)) throw error
      renameSync(paths.backup, paths.live)
      syncDirectory(userData)
    }
    if (!existsSync(paths.live)) throw error
    rmSync(paths.journal, { force: true })
    rmSync(paths.stage, { recursive: true, force: true })
    syncDirectory(userData)
    recordProfileImport(userData, { status: "error", code: error instanceof ProfileImportFailure ? error.code : "invalid" })
  }
}

function recordProfileImport(userData: string, result: { status: string; code?: string }) {
  const file = join(userData, ".profile-import-result.json")
  rmSync(`${file}.tmp`, { force: true })
  writePrivate(`${file}.tmp`, JSON.stringify(result))
  renameSync(`${file}.tmp`, file)
  syncDirectory(userData)
}
