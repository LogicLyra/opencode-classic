import { createHash } from "node:crypto"
import {
  closeSync,
  constants,
  existsSync,
  fstatSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  readSync,
  realpathSync,
  statfsSync,
  symlinkSync,
  writeFileSync,
  writeSync,
  type Stats,
} from "node:fs"
import { basename, dirname, join, relative, resolve } from "node:path"
import { applyEdits, parse, parseTree, type Edit, type Node, type ParseError } from "jsonc-parser"
import {
  inside,
  ProfileImportFailure,
  remapProfilePath,
  type ProfileImportDetail,
  type ProfileRoots,
} from "./profile-import-paths"

type Entry = {
  source: string
  path: string
  kind: "file" | "directory" | "link" | "materialized" | "skipped"
  mode: number
  size: number
  identity: string
  hash: string
  link?: string
  replacement?: string
  reason?: "dangling" | "socket" | "fifo"
}
export type ProfileInventory = {
  entries: Entry[]
  fingerprint: string
  bytes: number
  materialized: number
  skipped: number
}

export const PROFILE_METADATA_READ_LIMIT = 16 * 1024 * 1024
export const PROFILE_CONFIG_READ_LIMIT = 64 * 1024 * 1024

export function secureRead(file: string, limit = PROFILE_METADATA_READ_LIMIT) {
  const fd = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const info = fstatSync(fd)
    if (!info.isFile() || info.size > limit)
      throw new ProfileImportFailure("oversized-file", { category: "metadata-read", paths: [file] })
    return readFileSync(fd, "utf8")
  } finally {
    closeSync(fd)
  }
}

export function parseProfileConfig(text: string): Record<string, unknown> {
  const errors: ParseError[] = []
  const value: unknown = parse(text, errors, { allowTrailingComma: true })
  if (errors.length || !value || typeof value !== "object" || Array.isArray(value))
    throw new ProfileImportFailure("invalid")
  return value as Record<string, unknown>
}

export function digestProfileFile(file: string) {
  const fd = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const before = fstatSync(fd)
    if (!before.isFile()) throw new ProfileImportFailure("special-files", { category: "not-a-file", paths: [file] })
    const hash = createHash("sha256")
    const buffer = Buffer.alloc(1024 * 1024)
    for (let n = readSync(fd, buffer); n; n = readSync(fd, buffer)) hash.update(buffer.subarray(0, n))
    if (identity(before) !== identity(fstatSync(fd))) throw new ProfileImportFailure("changed")
    return hash.digest("hex")
  } finally {
    closeSync(fd)
  }
}

function identity(info: Stats) {
  return `${info.dev}:${info.ino}:${info.size}:${info.mtimeMs}:${info.ctimeMs}`
}

export function inventoryProfile(roots: ProfileRoots): ProfileInventory {
  const entries: Entry[] = []
  let materialized = 0
  let skipped = 0
  const bytesOf = () => entries.reduce((sum, entry) => sum + entry.size, 0)
  const capCheck = () => {
    if (entries.length >= 500_000)
      throw new ProfileImportFailure("limit", { category: "entries", count: entries.length })
    if (bytesOf() > 50 * 1024 ** 3) throw new ProfileImportFailure("limit", { category: "bytes", count: bytesOf() })
  }
  // Materializing an external directory duplicates its content into the staged
  // profile; a visited set stops symlink cycles from diverging forever.
  const materialize = (target: string, path: string, visited: Set<string>) => {
    capCheck()
    const real = realpathSync(target)
    if (visited.has(real)) throw new ProfileImportFailure("links", { category: "symlink-cycle", paths: [target] })
    visited.add(real)
    const info = lstatSync(real)
    const base = { source: real, path, mode: info.mode & 0o700, size: info.size, identity: identity(info) }
    if (info.isDirectory()) {
      entries.push({ ...base, size: 0, kind: "materialized", hash: "" })
      for (const name of readdirSync(real).sort()) materialize(join(real, name), join(path, name), visited)
      return
    }
    if (!info.isFile()) {
      skipped++
      entries.push({ ...base, kind: "skipped", hash: "", reason: info.isSymbolicLink() ? "dangling" : "socket" })
      return
    }
    materialized++
    entries.push({ ...base, kind: "materialized", hash: digestProfileFile(real) })
  }
  const walk = (source: string, path: string, git = false, alternates: readonly string[] = []) => {
    capCheck()
    const info = lstatSync(source)
    const base = { source, path, mode: info.mode & 0o700, size: info.size, identity: identity(info) }
    if (info.isSymbolicLink()) {
      if (git || /(?:^|\/)objects(?:\/|$)/.test(path) || /(?:^|\/)snapshot(?:\/|$)/.test(path))
        throw new ProfileImportFailure("git-objects", {
          category: "symlink-in-git-metadata",
          paths: [relative(roots.data, source) || source],
        })
      const target = realpathSync(source)
      if (!existsSync(target) || !existsSync(realpathSync(target))) {
        skipped++
        entries.push({ ...base, kind: "skipped", hash: "", reason: "dangling" })
        return
      }
      if ([roots.config, roots.data, roots.state].some((root) => inside(root, target))) {
        entries.push({ ...base, kind: "link", hash: readlinkSync(source), link: target })
        return
      }
      // External links are materialized (copied through) so the imported
      // profile is self-contained; dotfiles-managed setups import unchanged.
      const targetInfo = lstatSync(target)
      if (targetInfo.isFile() || targetInfo.isDirectory()) {
        materialize(target, path, new Set())
        return
      }
      if (targetInfo.isSocket() || targetInfo.isFIFO()) {
        skipped++
        entries.push({ ...base, kind: "skipped", hash: "", reason: targetInfo.isSocket() ? "socket" : "fifo" })
        return
      }
      throw new ProfileImportFailure("special-files", {
        category: "symlink-target",
        paths: [relative(roots.data, source) || source],
      })
    }
    if (info.isDirectory()) {
      entries.push({ ...base, size: 0, kind: "directory", hash: "" })
      for (const name of readdirSync(source).sort()) {
        if (git && ["worktrees", "commondir", "gitdir"].includes(name)) continue
        if (git && name.endsWith(".lock"))
          throw new ProfileImportFailure("busy", {
            category: "git-lock",
            paths: [join(relative(roots.data, source) || source, name)],
          })
        walk(join(source, name), join(path, name), git || name === ".git", alternates)
      }
      return
    }
    if (info.isSocket() || info.isFIFO()) {
      // Runtime artifacts of a running tool, never user content.
      skipped++
      entries.push({ ...base, kind: "skipped", hash: "", reason: info.isSocket() ? "socket" : "fifo" })
      return
    }
    if (!info.isFile())
      throw new ProfileImportFailure("special-files", {
        category: "special-file",
        paths: [relative(roots.data, source) || source],
      })
    if (
      basename(source) === "alternates" &&
      basename(dirname(source)) === "info" &&
      basename(dirname(dirname(source))) === "objects"
    ) {
      const objects = dirname(dirname(source))
      const targets = secureRead(source)
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          if (line.startsWith('"') || alternates.length >= 8)
            throw new ProfileImportFailure("git-objects", {
              category: "alternates-entry",
              paths: [relative(roots.data, source) || source],
            })
          const root = realpathSync(resolve(objects, line))
          if (
            basename(root) !== "objects" ||
            alternates.includes(root) ||
            root === objects ||
            !lstatSync(root).isDirectory()
          )
            throw new ProfileImportFailure("git-objects", { category: "alternates-target", paths: [line] })
          const id = createHash("sha256").update(root).digest("hex").slice(0, 24)
          walk(root, join(dirname(dirname(path)), ".profile-alternates", id), true, [...alternates, objects])
          return `.profile-alternates/${id}`
        })
      entries.push({ ...base, kind: "file", hash: digestProfileFile(source), replacement: targets.join("\n") + "\n" })
      return
    }
    if (basename(source) === ".git") {
      // A linked checkout must receive private Git objects/index/HEAD. Copying
      // its .git pointer would let Classic modify the original worktree index.
      const pointer = secureRead(source)
        .trim()
        .match(/^gitdir: (.+)$/)
      if (!pointer)
        throw new ProfileImportFailure("git-objects", {
          category: "git-pointer",
          paths: [relative(roots.data, source) || source],
        })
      if (![join(roots.data, "worktree"), join(roots.data, "repos")].some((root) => inside(root, dirname(source))))
        throw new ProfileImportFailure("git-objects", {
          category: "git-file-location",
          paths: [relative(roots.data, source) || source],
        })
      const admin = realpathSync(resolve(dirname(source), pointer[1]))
      if (readdirSync(admin).some((name) => name.endsWith(".lock")))
        throw new ProfileImportFailure("busy", {
          category: "worktree-lock",
          paths: [relative(roots.data, source) || source],
        })
      if (realpathSync(secureRead(join(admin, "gitdir")).trim()) !== source)
        throw new ProfileImportFailure("git-objects", {
          category: "worktree-gitdir",
          paths: [relative(roots.data, source) || source],
        })
      const common = realpathSync(resolve(admin, secureRead(join(admin, "commondir")).trim()))
      if (dirname(admin) !== join(common, "worktrees") || !existsSync(join(common, "objects")))
        throw new ProfileImportFailure("git-objects", {
          category: "worktree-layout",
          paths: [relative(roots.data, source) || source],
        })
      entries.push({ ...base, kind: "file", hash: digestProfileFile(source) })
      walk(common, `${path}.private`, true)
      for (const name of [
        "HEAD",
        "index",
        "config.worktree",
        "ORIG_HEAD",
        "MERGE_HEAD",
        "MERGE_MSG",
        "COMMIT_EDITMSG",
      ]) {
        if (existsSync(join(admin, name))) walk(join(admin, name), `${path}.private/${name}.worktree`, true)
      }
      return
    }
    entries.push({ ...base, kind: "file", hash: digestProfileFile(source) })
  }
  for (const key of ["config", "data", "state"] as const) {
    if (!existsSync(roots[key])) continue
    for (const name of readdirSync(roots[key]).sort()) {
      if (key === "data" && (name === "log" || /^opencode(?:-[\w-]+)?\.db(?:-wal|-shm|-journal)?$/.test(name))) continue
      if (key === "state" && ["locks", "server", "server.json", "password"].includes(name)) continue
      walk(join(roots[key], name), join(key, "opencode", name))
    }
  }
  const bytes = bytesOf()
  if (bytes > 50 * 1024 ** 3) throw new ProfileImportFailure("limit", { category: "bytes", count: bytes })
  return {
    entries,
    bytes,
    materialized,
    skipped,
    fingerprint: createHash("sha256").update(JSON.stringify(entries)).digest("hex"),
  }
}

export function databaseFingerprint(file: string) {
  for (const path of [file, `${file}-wal`, `${file}-shm`, `${file}-journal`]) {
    const info = lstatSync(path, { throwIfNoEntry: false })
    if (info && (!info.isFile() || info.isSymbolicLink()))
      throw new ProfileImportFailure("special-files", { category: "database-auxiliary", paths: [path] })
    if (path.endsWith("-journal") && info && info.size > 0)
      throw new ProfileImportFailure("busy", { category: "hot-rollback-journal", paths: [path] })
  }
  // The shared-memory index changes whenever any process merely reads the
  // database, so it is type-validated above but excluded from stability
  // comparison; only the database and its write-ahead log define content.
  return [file, `${file}-wal`]
    .map((path) => (existsSync(path) ? `${identity(lstatSync(path))}:${digestProfileFile(path)}` : "missing"))
    .join("|")
}

export function copyDatabaseSnapshot(source: string, target: string) {
  for (const suffix of ["", "-wal"]) {
    const path = source + suffix
    if (!existsSync(path)) continue
    const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW)
    const out = openSync(
      target + suffix,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    )
    try {
      const before = fstatSync(fd)
      if (!before.isFile())
        throw new ProfileImportFailure("special-files", { category: "database-auxiliary", paths: [path] })
      const buffer = Buffer.alloc(1024 * 1024)
      for (let n = readSync(fd, buffer); n; n = readSync(fd, buffer)) {
        for (let offset = 0; offset < n; ) offset += writeSync(out, buffer, offset, n - offset)
      }
      if (identity(before) !== identity(fstatSync(fd))) throw new ProfileImportFailure("changed")
    } finally {
      closeSync(fd)
      closeSync(out)
    }
  }
}

export function profileTreeDigest(root: string) {
  const hash = createHash("sha256")
  const walk = (path: string) => {
    const info = lstatSync(path)
    hash.update(
      JSON.stringify([
        relative(root, path),
        info.mode & 0o777,
        info.isSymbolicLink() ? readlinkSync(path) : info.isFile() ? digestProfileFile(path) : "directory",
      ]),
    )
    if (info.isDirectory()) for (const name of readdirSync(path).sort()) walk(join(path, name))
  }
  walk(root)
  return hash.digest("hex")
}

export function syncDirectory(dir: string) {
  const fd = openSync(dir, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW)
  try {
    fsyncSync(fd)
  } finally {
    closeSync(fd)
  }
}

export function writePrivate(file: string, value: string) {
  const fd = openSync(file, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600)
  try {
    writeFileSync(fd, value)
    fsyncSync(fd)
  } finally {
    closeSync(fd)
  }
}

export function copyProfileFiles(
  inventory: ProfileInventory,
  source: ProfileRoots,
  target: ProfileRoots,
  stage: string,
) {
  const space = statfsSync(dirname(stage))
  if (space.bavail * space.bsize < inventory.bytes * 1.1 + 256 * 1024 * 1024)
    throw new ProfileImportFailure("space", { category: "staging", count: inventory.bytes })
  for (const entry of inventory.entries) {
    if (entry.kind === "skipped") continue
    const path = join(stage, entry.path)
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
    if (entry.kind === "directory") {
      mkdirSync(path, { recursive: true, mode: 0o700 })
      continue
    }
    if (entry.kind === "link" && entry.link) {
      const finalPath = join(dirname(dirname(target.data)), entry.path)
      symlinkSync(relative(dirname(finalPath), remapProfilePath(entry.link, source, target)), path)
      continue
    }
    const fd = openSync(entry.source, constants.O_RDONLY | constants.O_NOFOLLOW)
    const out = openSync(
      path,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      entry.mode | 0o600,
    )
    try {
      if (identity(fstatSync(fd)) !== entry.identity) throw new ProfileImportFailure("changed")
      const hash = createHash("sha256")
      const buffer = Buffer.alloc(1024 * 1024)
      for (let n = readSync(fd, buffer); n; n = readSync(fd, buffer)) {
        hash.update(buffer.subarray(0, n))
        if (entry.replacement === undefined)
          for (let offset = 0; offset < n; ) offset += writeSync(out, buffer, offset, n - offset)
      }
      if (hash.digest("hex") !== entry.hash || identity(fstatSync(fd)) !== entry.identity)
        throw new ProfileImportFailure("changed")
      if (entry.replacement !== undefined) writeFileSync(out, entry.replacement)
      fsyncSync(out)
    } finally {
      closeSync(fd)
      closeSync(out)
    }
  }
  for (const entry of inventory.entries.filter((item) => item.kind === "directory").reverse())
    syncDirectory(join(stage, entry.path))
}

export function remapConfig(text: string, source: ProfileRoots, target: ProfileRoots) {
  parseProfileConfig(text)
  const edits: Edit[] = []
  const walk = (node: Node) => {
    if (node.type === "string" && typeof node.value === "string") {
      const mapped = remapProfilePath(String(node.value), source, target)
      if (mapped !== node.value)
        edits.push({ offset: node.offset, length: node.length, content: JSON.stringify(mapped) })
    }
    node.children?.forEach(walk)
  }
  const tree = parseTree(text)
  if (tree) walk(tree)
  return applyEdits(text, edits)
}
