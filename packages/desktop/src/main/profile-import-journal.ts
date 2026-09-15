import { randomUUID } from "node:crypto"
import { existsSync, lstatSync, mkdirSync, readdirSync, realpathSync, renameSync, rmSync, rmdirSync } from "node:fs"
import { basename, join } from "node:path"
import { parseProfileConfig, profileTreeDigest, secureRead, syncDirectory, writePrivate } from "./profile-import-files"
import { assertFreshProfile } from "./profile-import-database"
import { ProfileImportFailure, profilePaths, profileRoots } from "./profile-import-paths"

type Journal = {
  version: 1
  id: string
  phase: "building" | "ready" | "activated"
  original: string
  database: string
  digest?: string
}
const marker = ".profile-import-owner"

function directoryIdentity(path: string) {
  const info = lstatSync(path)
  if (!info.isDirectory() || info.isSymbolicLink() || realpathSync(path) !== path)
    throw new ProfileImportFailure("invalid")
  return `${info.dev}:${info.ino}`
}

export function writeProfileJournal(userData: string, journal: Journal) {
  const file = profilePaths(userData).journal
  const temporary = `${file}.${randomUUID()}.tmp`
  writePrivate(temporary, JSON.stringify(journal))
  renameSync(temporary, file)
  syncDirectory(userData)
}

export function beginProfileStage(userData: string, database: string): Journal {
  const paths = profilePaths(userData)
  if ([paths.stage, paths.backup, paths.journal].some(existsSync)) throw new ProfileImportFailure("busy")
  const journal: Journal = {
    version: 1,
    id: randomUUID(),
    phase: "building",
    original: directoryIdentity(paths.live),
    database: basename(database),
  }
  // Durable intent predates staging. Unknown remnants are never deleted.
  writeProfileJournal(userData, journal)
  mkdirSync(paths.stage, { mode: 0o700 })
  writePrivate(join(paths.stage, marker), journal.id)
  syncDirectory(paths.stage)
  syncDirectory(userData)
  return journal
}

function readJournal(userData: string): Journal {
  const value = parseProfileConfig(secureRead(profilePaths(userData).journal))
  if (
    value.version !== 1 ||
    typeof value.id !== "string" ||
    !/^[a-f0-9-]{36}$/.test(value.id) ||
    !["building", "ready", "activated"].includes(String(value.phase)) ||
    typeof value.original !== "string" ||
    !/^\d+:\d+$/.test(value.original) ||
    typeof value.database !== "string" ||
    !/^opencode(?:-[\w-]+)?\.db$/.test(value.database) ||
    (value.phase !== "building" && (typeof value.digest !== "string" || !/^[a-f0-9]{64}$/.test(value.digest)))
  )
    throw new ProfileImportFailure("invalid")
  return value as Journal
}

function assertOwnedStage(path: string, journal: Journal) {
  directoryIdentity(path)
  if (secureRead(join(path, marker)) !== journal.id) throw new ProfileImportFailure("invalid")
}

export function cancelProfileStage(userData: string, journal: Journal) {
  const paths = profilePaths(userData)
  if (existsSync(paths.backup) || directoryIdentity(paths.live) !== journal.original)
    throw new ProfileImportFailure("invalid")
  if (existsSync(paths.stage)) {
    directoryIdentity(paths.stage)
    if (readdirSync(paths.stage).length === 0) rmdirSync(paths.stage)
    else {
      assertOwnedStage(paths.stage, journal)
      rmSync(paths.stage, { recursive: true })
    }
  }
  rmSync(paths.journal)
  syncDirectory(userData)
}

export function activateProfileImport(userData: string) {
  const paths = profilePaths(userData)
  if (!existsSync(paths.journal)) return
  const journal = readJournal(userData)
  if (journal.phase === "building") {
    cancelProfileStage(userData, journal)
    return
  }
  if (existsSync(paths.backup) && directoryIdentity(paths.backup) !== journal.original)
    throw new ProfileImportFailure("invalid")
  if (existsSync(paths.stage)) {
    assertOwnedStage(paths.stage, journal)
    if (profileTreeDigest(paths.stage) !== journal.digest) throw new ProfileImportFailure("changed")
    if (existsSync(paths.live)) {
      if (existsSync(paths.backup) || directoryIdentity(paths.live) !== journal.original)
        throw new ProfileImportFailure("invalid")
      assertFreshProfile(paths.live, join(profileRoots(paths.live).data, journal.database))
      renameSync(paths.live, paths.backup)
      syncDirectory(userData)
    }
    if (!existsSync(paths.backup)) throw new ProfileImportFailure("invalid")
    renameSync(paths.stage, paths.live)
    syncDirectory(userData)
  } else if (profileTreeDigest(paths.live) !== journal.digest) throw new ProfileImportFailure("changed")
  assertOwnedStage(paths.live, journal)
  writeProfileJournal(userData, { ...journal, phase: "activated" })
  // Preserve the original bootstrap profile, including regenerable caches. Do
  // not recursively delete descendants that a live process could have created.
  const retained = join(userData, `.profile-import-retained-${journal.id}`)
  if (existsSync(paths.backup)) {
    if (existsSync(retained)) throw new ProfileImportFailure("invalid")
    renameSync(paths.backup, retained)
  }
  syncDirectory(userData)
  recordResult(userData, { status: "activated" })
  rmSync(paths.journal)
  syncDirectory(userData)
}

export function recoverProfileImport(userData: string) {
  const paths = profilePaths(userData)
  if (!existsSync(paths.journal)) return
  const journal = readJournal(userData)
  try {
    activateProfileImport(userData)
  } catch (error) {
    // Never promote a rejected backup. Only the exact original directory may
    // be restored, and a present live directory is never overwritten.
    if (existsSync(paths.backup)) {
      if (existsSync(paths.live) || directoryIdentity(paths.backup) !== journal.original) throw error
      assertFreshProfile(paths.backup, join(profileRoots(paths.backup).data, journal.database))
      renameSync(paths.backup, paths.live)
      syncDirectory(userData)
    }
    cancelProfileStage(userData, journal)
    const failure = error instanceof ProfileImportFailure ? error : undefined
    recordResult(userData, {
      status: "error",
      code: failure?.code ?? "invalid",
      category: failure?.detail?.category,
      count: failure?.detail?.count,
    })
  }
}

function recordResult(userData: string, result: { status: string; code?: string; category?: string; count?: number }) {
  const file = join(userData, ".profile-import-result.json")
  const temporary = `${file}.${randomUUID()}.tmp`
  // Persisted diagnostics stay minimal: category and count only, never paths.
  writePrivate(temporary, JSON.stringify(result))
  renameSync(temporary, file)
  syncDirectory(userData)
}
