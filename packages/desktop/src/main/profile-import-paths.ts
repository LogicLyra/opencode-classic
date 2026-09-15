import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import type { ProfileImportError } from "@opencode-ai/app/profile-import"

export type ProfileRoots = { config: string; data: string; state: string }

export class ProfileImportFailure extends Error {
  constructor(readonly code: ProfileImportError) {
    super(code)
  }
}

export function inside(root: string, file: string) {
  const part = relative(root, file)
  return part === "" || (part !== ".." && !part.startsWith(`..${sep}`) && !isAbsolute(part))
}

export function profilePaths(userData: string) {
  return {
    live: join(userData, "sidecar"),
    stage: join(userData, ".profile-import-stage"),
    backup: join(userData, ".profile-import-backup"),
    journal: join(userData, ".profile-import.json"),
  }
}

export function profileRoots(root: string): ProfileRoots {
  return { config: join(root, "config", "opencode"), data: join(root, "data", "opencode"), state: join(root, "state", "opencode") }
}

export function remapProfilePath(value: string, source: ProfileRoots, target: ProfileRoots): string {
  if (value.startsWith("file://")) {
    const url = new URL(value)
    const path = fileURLToPath(url)
    const mapped = remapProfilePath(path, source, target)
    return mapped === path ? value : pathToFileURL(mapped).href
  }
  if (value.startsWith("{file:") && value.endsWith("}")) {
    return `{file:${remapProfilePath(value.slice(6, -1), source, target)}}`
  }
  if (!isAbsolute(value)) return value
  for (const key of ["config", "data", "state"] as const) {
    if (inside(source[key], value)) return join(target[key], relative(source[key], value))
  }
  return value
}

// Only structured path fields are rewritten; prose, prompts, tokens, IDs and
// historical tool output remain byte-for-byte data, even when they mention paths.
export function remapProfileObject(value: unknown, source: ProfileRoots, target: ProfileRoots, key = ""): unknown {
  if (typeof value === "string") {
    return /^(directory|worktree|cwd|path|filepath|filePath|filename|root|url|sandboxes|resource)$/.test(key)
      ? remapProfilePath(value, source, target)
      : value
  }
  if (Array.isArray(value)) return value.map((item) => remapProfileObject(item, source, target, key))
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, remapProfileObject(item, source, target, name)]))
  }
  return value
}

export function assertProfileDestination(database: string, userData: string) {
  const data = profileRoots(profilePaths(userData).live).data
  if (!isAbsolute(database) || dirname(resolve(database)) !== data || !/^opencode(?:-[\w-]+)?\.db$/.test(relative(data, database))) {
    throw new ProfileImportFailure("unavailable")
  }
}
