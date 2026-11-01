import { createHash } from "node:crypto"
import semver from "semver"

export const repository = "LogicLyra/opencode-classic"
export const instructions = `https://github.com/${repository}/blob/main/MIGRATING.md`
export const migrationAsset = "classic-migration.json"

export type Request = (url: string) => Promise<{ status: number; body: string }>

async function request(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: { Accept: "application/vnd.github+json", "User-Agent": "opencode-classic" },
  })
  return { status: response.status, body: await response.text() }
}

export function downloadBase(version: string) {
  if (!stable(version)) throw new Error(`Invalid Classic release version: ${version}`)
  return `https://github.com/${repository}/releases/download/v${version}/`
}

export function checksumMatches(checksums: string, name: string, body: string) {
  const entries = checksums
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/, 2))
    .filter((entry) => entry[1]?.replace(/^\*/, "") === name)
  if (entries.length !== 1 || !/^[a-f0-9]{64}$/i.test(entries[0][0])) return false
  return createHash("sha256").update(body).digest("hex") === entries[0][0].toLowerCase()
}

// Both Electron and Effect callers supply their own HTTP transport; release policy stays shared.
export function createReleaseClient(get: Request = request) {
  async function text(url: string, optional = false) {
    const response = await get(url)
    if (optional && response.status === 404) return undefined
    if (response.status !== 200) throw new Error(`Classic update request failed (HTTP ${response.status}).`)
    return response.body
  }

  async function versions() {
    const result: string[] = []
    for (let page = 1; ; page++) {
      const body = await text(`https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`)
      const data: unknown = JSON.parse(body!)
      if (!Array.isArray(data)) throw new Error("Invalid Classic release list.")
      result.push(
        ...data.flatMap((item) => {
          if (!record(item) || item.draft !== false || item.prerelease !== false) return []
          if (typeof item.tag_name !== "string" || !/^v\d+\.\d+\.\d+$/.test(item.tag_name)) return []
          const version = item.tag_name.slice(1)
          return stable(version) ? [version] : []
        }),
      )
      if (data.length < 100) return [...new Set(result)].sort(semver.rcompare)
    }
  }

  async function verifiedAsset(version: string, name: "install" | typeof migrationAsset, optional = false) {
    const base = downloadBase(version)
    const body = await text(`${base}${name}`, optional)
    if (body === undefined) return undefined
    const sums = await text(`${base}SHA256SUMS`)
    if (!checksumMatches(sums!, name, body)) throw new Error(`Classic ${name} checksum verification failed.`)
    return body
  }

  async function migrationReady(current: string, target: string) {
    const body = await verifiedAsset(target, migrationAsset, true)
    if (body === undefined) return false
    const data: unknown = JSON.parse(body)
    if (
      !record(data) ||
      data.schemaVersion !== 1 ||
      data.version !== target ||
      typeof data.migrationReady !== "boolean" ||
      !Number.isInteger(data.sourceMajor) ||
      typeof data.minimumVersion !== "string" ||
      !stable(data.minimumVersion)
    )
      throw new Error("Invalid Classic migration manifest.")
    return (
      data.migrationReady &&
      data.sourceMajor === semver.major(current) &&
      semver.major(data.minimumVersion) === data.sourceMajor &&
      semver.gte(current, data.minimumVersion)
    )
  }

  async function update(current: string, allowMajor = false) {
    if (!stable(current)) return current
    const releases = await versions()
    const major = semver.major(current)
    for (const version of releases) {
      if (!semver.gt(version, current)) continue
      if (semver.major(version) === major) return version
      if (allowMajor && semver.major(version) === major + 1 && (await migrationReady(current, version))) return version
    }
    return current
  }

  return { update, versions, verifiedAsset }
}

function stable(version: string) {
  return /^\d+\.\d+\.\d+$/.test(version) && semver.valid(version) !== null
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
