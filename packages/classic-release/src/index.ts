import { createHash } from "node:crypto"
import semver from "semver"

export const repository = "LogicLyra/opencode-classic"
export const instructions = `https://github.com/${repository}/blob/main/MIGRATING.md`
export const migrationAsset = "classic-migration.json"

export const releaseTargets = [
  "desktop-linux-x64-deb",
  "desktop-linux-x64-rpm",
  "cli-linux-x64",
  "cli-linux-x64-baseline",
  "cli-linux-x64-musl",
  "cli-linux-x64-baseline-musl",
  "cli-linux-arm64",
  "cli-linux-arm64-musl",
  "cli-darwin-x64",
  "cli-darwin-x64-baseline",
  "cli-darwin-arm64",
  "cli-windows-x64",
  "cli-windows-x64-baseline",
] as const

export type ReleaseTarget = (typeof releaseTargets)[number]
export type MigrationOffer = {
  version: string
  minimumVersion: string
  target: ReleaseTarget
  releaseUrl: string
}
export type MigrationDiscovery =
  | { status: "unavailable" }
  | { status: "offered"; offer: MigrationOffer }
  | { status: "error"; code: "verification" }

type Release = { version: string; assets: string[] }

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

  async function snapshot() {
    const result = new Map<string, Release>()
    for (let page = 1; ; page++) {
      const body = await text(`https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`)
      const data: unknown = JSON.parse(body!)
      if (!Array.isArray(data)) throw new Error("Invalid Classic release list.")
      for (const item of data) {
        if (!record(item) || item.draft !== false || item.prerelease !== false) continue
        if (typeof item.tag_name !== "string" || !/^v\d+\.\d+\.\d+$/.test(item.tag_name)) continue
        const version = item.tag_name.slice(1)
        if (!stable(version) || result.has(version)) continue
        result.set(version, {
          version,
          assets: Array.isArray(item.assets)
            ? item.assets.flatMap((asset) => (record(asset) && typeof asset.name === "string" ? [asset.name] : []))
            : [],
        })
      }
      if (data.length < 100) return [...result.values()].sort((a, b) => semver.rcompare(a.version, b.version))
    }
  }

  async function versions() {
    return (await snapshot()).map((release) => release.version)
  }

  async function verifiedAsset(version: string, name: "install" | "install-classic" | typeof migrationAsset, optional = false) {
    const base = downloadBase(version)
    const body = await text(`${base}${name}`, optional)
    if (body === undefined) return undefined
    const sums = await text(`${base}SHA256SUMS`)
    if (!checksumMatches(sums!, name, body)) throw new Error(`Classic ${name} checksum verification failed.`)
    return body
  }

  async function manifest(version: string) {
    const body = await verifiedAsset(version, migrationAsset, true)
    return body === undefined ? undefined : parseMigrationManifest(body, version)
  }

  // Ordinary checks never inspect migration metadata or cross the installed major.
  async function update(current: string) {
    if (!stable(current)) return current
    return maintenance(current, await snapshot())
  }

  async function migration(current: string, target: ReleaseTarget, releases: Release[]) {
    if (!stable(current)) return
    for (const release of releases) {
      if (semver.major(release.version) !== semver.major(current) + 1) continue
      const data = await manifest(release.version)
      if (
        !data?.migrationReady ||
        data.sourceMajor !== semver.major(current) ||
        semver.major(data.minimumVersion) !== data.sourceMajor ||
        (data.sourceMajor === 1 && !semver.gt(data.minimumVersion, "1.19.5")) ||
        !semver.gte(current, data.minimumVersion) ||
        !data.supportedUpgradeTargets?.includes(target) ||
        !hasAssets(release, target, true)
      ) continue
      return {
        version: release.version,
        minimumVersion: data.minimumVersion,
        target,
        releaseUrl: `https://github.com/${repository}/releases/tag/v${release.version}`,
      } satisfies MigrationOffer
    }
  }

  async function discover(current: string, target?: ReleaseTarget) {
    const releases = await snapshot()
    const offer: MigrationDiscovery = !target
      ? { status: "unavailable" }
      : await migration(current, target, releases).then(
          (offer): MigrationDiscovery => offer ? { status: "offered", offer } : { status: "unavailable" },
          (): MigrationDiscovery => ({ status: "error", code: "verification" }),
        )
    return { maintenance: stable(current) ? maintenance(current, releases) : current, migration: offer }
  }

  // Preparation/install must revalidate the exact consented version, never silently replace it.
  async function migrationOffer(current: string, target: ReleaseTarget, version?: string) {
    const releases = await snapshot()
    return migration(current, target, version ? releases.filter((release) => release.version === version) : releases)
  }

  async function freshInstall(major: 1 | 2, target: ReleaseTarget, version?: string) {
    if (version && (!stable(version) || semver.major(version) !== major))
      throw new Error("Classic installation version does not match the selected major.")
    for (const release of await snapshot()) {
      if (semver.major(release.version) !== major || (version && version !== release.version)) continue
      if (!hasAssets(release, target, major === 2)) continue
      if (major === 1) return release.version
      const data = await manifest(release.version)
      if (data?.freshInstallReady && data.supportedFreshInstallTargets?.includes(target)) return release.version
    }
  }

  return { update, discover, migrationOffer, freshInstall, versions, verifiedAsset }
}

export function parseMigrationManifest(body: string, version: string) {
  const data: unknown = JSON.parse(body)
  if (
    !record(data) || data.schemaVersion !== 1 || data.version !== version ||
    typeof data.migrationReady !== "boolean" || !Number.isInteger(data.sourceMajor) ||
    typeof data.minimumVersion !== "string" || !stable(data.minimumVersion) ||
    (data.freshInstallReady !== undefined && typeof data.freshInstallReady !== "boolean")
  ) throw new Error("Invalid Classic migration manifest.")
  return {
    schemaVersion: 1 as const,
    version,
    migrationReady: data.migrationReady,
    sourceMajor: data.sourceMajor as number,
    minimumVersion: data.minimumVersion,
    supportedUpgradeTargets: targets(data.supportedUpgradeTargets),
    freshInstallReady: data.freshInstallReady === true,
    supportedFreshInstallTargets: targets(data.supportedFreshInstallTargets),
  }
}

function targets(value: unknown): ReleaseTarget[] | undefined {
  if (value === undefined) return
  if (!Array.isArray(value) || !value.every((target) => releaseTargets.includes(target)))
    throw new Error("Invalid Classic supported release targets.")
  if (new Set(value).size !== value.length) throw new Error("Duplicate Classic supported release target.")
  return value
}

export function targetAsset(target: ReleaseTarget) {
  if (target === "desktop-linux-x64-deb") return "opencode-classic-desktop-linux-amd64.deb"
  if (target === "desktop-linux-x64-rpm") return "opencode-classic-desktop-linux-x86_64.rpm"
  return `opencode-${target.slice(4)}${target.startsWith("cli-linux-") ? ".tar.gz" : ".zip"}`
}

// Baseline x64 archives also run on newer CPUs. Unknown libc is not assumed to be glibc.
export function cliReleaseTarget(platform: string, arch: string, libc: string): ReleaseTarget | undefined {
  if (platform === "darwin" && arch === "x64") return "cli-darwin-x64-baseline"
  if (platform === "darwin" && arch === "arm64") return "cli-darwin-arm64"
  if (platform === "win32" && arch === "x64") return "cli-windows-x64-baseline"
  if (platform !== "linux" || (arch !== "x64" && arch !== "arm64")) return
  if (/musl/i.test(libc)) return arch === "x64" ? "cli-linux-x64-baseline-musl" : "cli-linux-arm64-musl"
  if (/GNU libc|GLIBC|GNU C Library/i.test(libc)) return arch === "x64" ? "cli-linux-x64-baseline" : "cli-linux-arm64"
}

function hasAssets(release: Release, target: ReleaseTarget, marker: boolean) {
  return ["install", "SHA256SUMS", targetAsset(target), ...(marker ? [migrationAsset] : []),
    ...(target.startsWith("desktop-") ? ["latest-linux.yml"] : [])]
    .every((name) => release.assets.includes(name))
}

function maintenance(current: string, releases: Release[]) {
  return releases.find((release) => isMaintenanceUpdate(current, release.version))?.version ?? current
}

export function isMaintenanceUpdate(current: string, version: string) {
  return stable(current) && stable(version) && semver.major(current) === semver.major(version) && semver.gt(version, current)
}

function stable(version: string) {
  return /^\d+\.\d+\.\d+$/.test(version) && semver.valid(version) !== null
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
