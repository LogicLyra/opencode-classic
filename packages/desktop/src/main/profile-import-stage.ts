import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
  openSync,
  fsyncSync,
  closeSync,
  constants,
  statfsSync,
} from "node:fs"
import { basename, dirname, join } from "node:path"
import type { ProfileImportSummary } from "@opencode-ai/app/profile-import"
import {
  copyDatabaseSnapshot,
  copyProfileFiles,
  databaseFingerprint,
  inventoryProfile,
  parseProfileConfig,
  profileTreeDigest,
  remapConfig,
  secureRead,
  syncDirectory,
} from "./profile-import-files"
import {
  assertProfileDestination,
  inside,
  ProfileImportFailure,
  profilePaths,
  profileRoots,
  remapProfilePath,
  type ProfileRoots,
} from "./profile-import-paths"
import {
  assertFreshProfile,
  closeProfileDatabase,
  copyProfileDatabase,
  inspectProfileDatabase,
  openProfileDatabase,
} from "./profile-import-database"
import { ChatImportFailure } from "./chat-import-database"
import { beginProfileStage, cancelProfileStage, writeProfileJournal } from "./profile-import-journal"
import { beginProfileScratch, cleanupProfileScratch } from "./profile-import-scratch"
export { activateProfileImport, recoverProfileImport } from "./profile-import-journal"

export type ProfileImportInput = {
  source: ProfileRoots
  userData: string
  destination: string
  fingerprint?: string
  scratch?: string
}

export function runProfileImport(input: ProfileImportInput): { summary: ProfileImportSummary; fingerprint: string } {
  assertProfileDestination(input.destination, input.userData)
  const paths = profilePaths(input.userData)
  if (existsSync(paths.journal) || existsSync(paths.stage) || existsSync(paths.backup))
    throw new ProfileImportFailure("busy")
  if (realpathSync(paths.live) !== paths.live || realpathSync(input.destination) !== input.destination)
    throw new ProfileImportFailure("unsupported")
  for (const root of [input.source.config, input.source.data, input.source.state]) {
    if (inside(root, input.userData) || inside(input.userData, root)) throw new ProfileImportFailure("unsupported")
    if (existsSync(root) && realpathSync(root) !== root) throw new ProfileImportFailure("changed")
  }
  const roots = [input.source.config, input.source.data, input.source.state]
  if (roots.some((root, i) => roots.some((other, j) => i !== j && inside(root, other))))
    throw new ProfileImportFailure("unsupported")
  assertFreshProfile(paths.live, input.destination)
  const database = join(input.source.data, "opencode.db")
  if (realpathSync(database) !== database) throw new ProfileImportFailure("unsupported")
  const inventory = inventoryProfile(input.source)
  const before = databaseFingerprint(database)
  const fingerprint = createHash("sha256")
    .update(inventory.fingerprint + before + JSON.stringify(input.source))
    .digest("hex")
  if (input.fingerprint && input.fingerprint !== fingerprint) throw new ProfileImportFailure("changed")
  const configs = ["config.json", "opencode.json", "opencode.jsonc"].flatMap((name) => {
    const path = join(input.source.config, name)
    return existsSync(path) ? [parseProfileConfig(secureRead(path))] : []
  })
  const authFile = join(input.source.data, "auth.json")
  const auth: Record<string, unknown> = existsSync(authFile) ? JSON.parse(secureRead(authFile)) : {}
  if (!auth || typeof auth !== "object" || Array.isArray(auth)) throw new ProfileImportFailure("invalid")
  const providers = Object.values(auth).filter((value) => {
    if (!value || typeof value !== "object" || !("type" in value)) return false
    const required =
      value.type === "oauth"
        ? ["access", "refresh"]
        : value.type === "api"
          ? ["key"]
          : value.type === "wellknown"
            ? ["key", "token"]
            : undefined
    return (
      !!required && required.every((key) => key in value && typeof (value as Record<string, unknown>)[key] === "string")
    )
  }).length
  const databaseBytes = [database, `${database}-wal`].reduce(
    (sum, path) => sum + (existsSync(path) ? lstatSync(path).size : 0),
    0,
  )
  const space = statfsSync(input.userData)
  if (databaseBytes + inventory.bytes > 50 * 1024 ** 3) throw new ProfileImportFailure("unsupported")
  if (space.bavail * space.bsize < inventory.bytes * 1.1 + databaseBytes * 4 + 256 * 1024 * 1024)
    throw new ProfileImportFailure("space")
  const scratch = input.scratch ?? beginProfileScratch(input.userData)
  try {
    const snapshot = join(scratch, "opencode.db")
    copyDatabaseSnapshot(database, snapshot)
    if (databaseFingerprint(database) !== before) throw new ProfileImportFailure("changed")
    const source = openProfileDatabase(snapshot)
    try {
      const destination = openProfileDatabase(input.destination)
      try {
        inspectProfileDatabase(source, destination)
        const count = (table: string) => Number(source.prepare(`SELECT count(*) AS n FROM ${table}`).get()?.n)
        const summary: ProfileImportSummary = {
          config: input.source.config,
          data: input.source.data,
          state: input.source.state,
          sessions: count("session"),
          providers,
          accounts: count("account") + count("control_account"),
          workspaces: count("workspace"),
          files: inventory.entries.filter((entry) => entry.kind !== "directory").length,
          bytes: inventory.bytes + databaseBytes,
          plugins:
            configs.reduce((n, cfg) => n + (Array.isArray(cfg.plugin) ? cfg.plugin.length : 0), 0) +
            inventory.entries.filter((entry) => /^config\/opencode\/plugins?\/[^/]+\.[cm]?[jt]s$/.test(entry.path))
              .length,
          mcp: configs.reduce(
            (n, cfg) => n + (cfg.mcp && typeof cfg.mcp === "object" ? Object.keys(cfg.mcp).length : 0),
            0,
          ),
          commands: Number(source.prepare("SELECT count(*) AS n FROM project WHERE commands IS NOT NULL").get()?.n),
          permissions:
            count("permission") +
            Number(source.prepare("SELECT count(*) AS n FROM session WHERE permission IS NOT NULL").get()?.n),
          pending: Number(
            source.prepare("SELECT count(*) AS n FROM session_input WHERE promoted_seq IS NULL").get()?.n,
          ),
          git: inventory.entries.filter((entry) => basename(entry.source) === ".git").length,
        }
        if (!input.fingerprint) return { summary, fingerprint }
        const journal = beginProfileStage(input.userData, input.destination)
        try {
          const staged = profileRoots(paths.stage)
          const target = profileRoots(paths.live)
          for (const dir of [staged.config, staged.data, staged.state]) mkdirSync(dir, { recursive: true, mode: 0o700 })
          copyProfileFiles(inventory, input.source, target, paths.stage)
          for (const name of ["config.json", "opencode.json", "opencode.jsonc"]) {
            const path = join(staged.config, name)
            if (existsSync(path)) writeFileSync(path, remapConfig(secureRead(path), input.source, target))
          }
          // The checkout, index and object store are all copied before converting its
          // linked-worktree metadata. Git config edits only these staged files.
          for (const entry of inventory.entries.filter(
            (item) => basename(item.source) === ".git" && item.kind === "file",
          )) {
            const gitdir = join(paths.stage, `${entry.path}.private`)
            for (const name of readdirSync(gitdir).filter(
              (name) => name.endsWith(".worktree") && name !== "config.worktree",
            ))
              renameSync(join(gitdir, name), join(gitdir, name.slice(0, -9)))
            const config = join(gitdir, "config")
            const git = (args: string[]) =>
              execFileSync("git", ["config", "--no-includes", "--file", config, ...args], {
                env: {
                  PATH: process.env.PATH,
                  HOME: paths.stage,
                  GIT_CONFIG_NOSYSTEM: "1",
                  GIT_CONFIG_GLOBAL: "/dev/null",
                },
                stdio: "pipe",
                timeout: 10_000,
              })
            git(["core.bare", "false"])
            git(["core.worktree", join(paths.live, dirname(entry.path))])
            git(["extensions.worktreeConfig", "false"])
            rmSync(join(paths.stage, entry.path))
            renameSync(gitdir, join(paths.stage, entry.path))
          }
          // Snapshot stores key their directory by SHA-1 of the checkout path.
          for (const row of source
            .prepare(
              "SELECT project_id, directory FROM session UNION SELECT project_id, directory FROM workspace UNION SELECT id,worktree FROM project",
            )
            .iterate()) {
            if (typeof row.directory !== "string" || typeof row.project_id !== "string") continue
            const mapped = remapProfilePath(row.directory, input.source, target)
            if (mapped === row.directory || !/^[\w-]+$/.test(row.project_id)) continue
            const hash = (path: string) => createHash("sha1").update(path).digest("hex")
            const old = join(staged.data, "snapshot", row.project_id, hash(row.directory))
            const next = join(staged.data, "snapshot", row.project_id, hash(mapped))
            if (existsSync(old) && !existsSync(next)) renameSync(old, next)
          }
          copyProfileDatabase(source, destination, join(staged.data, basename(input.destination)), input.source, target)
          if (databaseFingerprint(database) !== before)
            throw new ProfileImportFailure("source-busy", { category: "database-final" })
          let stableFiles = false
          for (let attempt = 0; attempt < 3; attempt++) {
            if (inventoryProfile(input.source).fingerprint === inventory.fingerprint) {
              stableFiles = true
              break
            }
          }
          if (!stableFiles) throw new ProfileImportFailure("source-busy", { category: "files-final" })
          assertFreshProfile(paths.live, input.destination)
          syncProfileTree(paths.stage)
          writeProfileJournal(input.userData, { ...journal, phase: "ready", digest: profileTreeDigest(paths.stage) })
          syncDirectory(input.userData)
          return { summary, fingerprint }
        } catch (error) {
          // Only an unactivated staging tree is removed. The running profile is
          // untouched; crash recovery owns a stage once the journal is durable.
          cancelProfileStage(input.userData, journal)
          throw error
        }
      } finally {
        closeProfileDatabase(destination)
      }
    } finally {
      closeProfileDatabase(source)
    }
  } catch (error) {
    if (error instanceof ChatImportFailure)
      throw new ProfileImportFailure(error.code === "incompatible" ? "incompatible" : "invalid")
    throw error
  } finally {
    if (!input.scratch) cleanupProfileScratch(input.userData)
  }
}

function syncProfileTree(root: string) {
  for (const name of readdirSync(root)) {
    const path = join(root, name)
    const info = lstatSync(path)
    if (info.isDirectory()) syncProfileTree(path)
    if (info.isFile()) {
      const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW)
      try {
        fsyncSync(fd)
      } finally {
        closeSync(fd)
      }
    }
  }
  syncDirectory(root)
}
