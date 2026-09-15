import { randomUUID } from "node:crypto"
import { existsSync, lstatSync, mkdirSync, readdirSync, realpathSync, renameSync, rmSync, rmdirSync } from "node:fs"
import { join } from "node:path"
import { parseProfileConfig, secureRead, syncDirectory, writePrivate } from "./profile-import-files"
import { ProfileImportFailure } from "./profile-import-paths"

export function beginProfileScratch(userData: string) {
  const registry = join(userData, ".profile-import-scratch.json")
  if (existsSync(registry)) throw new ProfileImportFailure("busy")
  const id = randomUUID()
  const directory = join(userData, `.profile-snapshot-${id}`)
  mkdirSync(directory, { mode: 0o700 })
  writePrivate(join(directory, ".owner"), id)
  syncDirectory(directory)
  const info = lstatSync(directory)
  const temporary = `${registry}.${id}.tmp`
  writePrivate(temporary, JSON.stringify({ id, identity: `${info.dev}:${info.ino}` }))
  renameSync(temporary, registry)
  syncDirectory(userData)
  return directory
}

export function cleanupProfileScratch(userData: string) {
  const registry = join(userData, ".profile-import-scratch.json")
  if (!existsSync(registry)) return
  const value = parseProfileConfig(secureRead(registry))
  if (typeof value.id !== "string" || !/^[a-f0-9-]{36}$/.test(value.id) || typeof value.identity !== "string")
    throw new ProfileImportFailure("invalid")
  const directory = join(userData, `.profile-snapshot-${value.id}`)
  if (existsSync(directory)) {
    const info = lstatSync(directory)
    if (
      !info.isDirectory() ||
      info.isSymbolicLink() ||
      realpathSync(directory) !== directory ||
      `${info.dev}:${info.ino}` !== value.identity
    )
      throw new ProfileImportFailure("invalid")
    const files = readdirSync(directory)
    if (files.length && secureRead(join(directory, ".owner")) !== value.id) throw new ProfileImportFailure("invalid")
    if (
      files.some(
        (name) =>
          ![".owner", "opencode.db", "opencode.db-wal", "opencode.db-shm", "opencode.db-journal"].includes(name) ||
          lstatSync(join(directory, name)).isDirectory(),
      )
    )
      throw new ProfileImportFailure("invalid")
    for (const name of files.filter((name) => name !== ".owner")) rmSync(join(directory, name))
    rmSync(join(directory, ".owner"), { force: true })
    rmdirSync(directory)
  }
  rmSync(registry)
  syncDirectory(userData)
}
