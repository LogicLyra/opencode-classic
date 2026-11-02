import { expect, test } from "bun:test"
import { chmod, mkdir, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { createHash } from "node:crypto"

const chooser = path.resolve(import.meta.dir, "../../..", "install-classic")
const linux = test.skipIf(process.platform !== "linux")
const hash = (body: string) => createHash("sha256").update(body).digest("hex")

async function fixture(input: { ready?: boolean; corrupt?: "marker" | "install"; legacy?: boolean; retained?: "valid" | "unknown" | "newer"; existing?: "owned1" | "owned2" | "unknown" | "shadow"; paginated?: boolean } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), "classic-chooser-"))
  const home = path.join(root, "home with spaces")
  const bin = path.join(root, "transport")
  await Promise.all([home, bin].map((directory) => mkdir(directory)))
  const installer = '#!/bin/bash\nset -eu\nprintf "%s|%s|%s\\n" "$VERSION" "$CLASSIC_INSTALL_TARGET" "$*" > "$FIXTURE/executed"\n'
  const marker = JSON.stringify({ schemaVersion: 1, version: "2.2.5", sourceMajor: 1, minimumVersion: "1.20.0", migrationReady: true, freshInstallReady: input.ready !== false, supportedFreshInstallTargets: ["cli-linux-x64-baseline"] })
  await Bun.write(path.join(root, "install"), installer)
  await Bun.write(path.join(root, "classic-migration.json"), marker)
  await Bun.write(path.join(root, "SHA256SUMS"), `${input.corrupt === "install" ? "0".repeat(64) : hash(installer)}  install\n${input.corrupt === "marker" ? "0".repeat(64) : hash(marker)}  classic-migration.json\n`)
  const release = (version: string) => ({ tag_name: `v${version}`, draft: false, prerelease: false, assets: ["install", "SHA256SUMS", "classic-migration.json", "opencode-linux-x64-baseline.tar.gz"].map((name) => ({ name })) })
  await Bun.write(path.join(root, "releases.json"), JSON.stringify(input.paginated ? Array.from({ length: 100 }, () => release("2.2.5")) : [release("2.2.5"), release("1.19.5"), release("1.19.3")]))
  await Bun.write(path.join(root, "page2.json"), JSON.stringify([release("1.19.5")]))
  await Bun.write(path.join(bin, "curl"), `#!/bin/bash
set -eu
url= output= status=false
while (( $# )); do
  case "$1" in
    --output|-o) output="$2"; shift 2 ;;
    --write-out|-w) status=true; shift 2 ;;
    https://*) url="$1"; shift ;;
    *) shift ;;
  esac
done
printf '%s\\n' "$url" >> "$FIXTURE/requests"
case "$url" in
  https://api.github.com/repos/LogicLyra/opencode-classic/releases*page=1) source="$FIXTURE/releases.json" ;;
  https://api.github.com/repos/LogicLyra/opencode-classic/releases*page=2) source="$FIXTURE/page2.json" ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v*/install) source="$FIXTURE/install" ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v*/SHA256SUMS) source="$FIXTURE/SHA256SUMS" ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v*/classic-migration.json) source="$FIXTURE/classic-migration.json" ;;
  *) printf 'Unexpected URL: %s\\n' "$url" >&2; exit 22 ;;
esac
cp "$source" "$output"
if [[ "$status" == true ]]; then printf 200; fi
`)
  await chmod(path.join(bin, "curl"), 0o755)
  if (input.legacy) await Bun.write(path.join(home, ".local/share/opencode/source"), "preserve")
  if (input.retained) await Bun.write(path.join(home, ".opencode/classic-v2/classic-profile.json"), JSON.stringify({ owner: "LogicLyra/opencode-classic", schemaVersion: input.retained === "unknown" ? 9 : 1, major: 2, version: input.retained === "newer" ? "2.3.0" : "2.2.5" }))
  if (input.existing) {
    const version = input.existing === "owned2" ? "2.2.5" : "1.19.5"
    const executable = path.join(input.existing === "shadow" ? bin : path.join(home, ".opencode/bin"), "opencode")
    const body = `#!/bin/bash\nprintf '${version}\\n'\n`
    await Bun.write(executable, body)
    await chmod(executable, 0o755)
    if (input.existing.startsWith("owned")) await Bun.write(path.join(home, ".opencode/bin/.opencode-classic-install.json"), JSON.stringify({ schemaVersion: 1, surface: "cli", origin: "release", version, binarySha256: hash(body), target: "cli-linux-x64-baseline" }))
  }
  const run = async (args: string[] = [], env: Record<string, string> = {}, piped = false) => {
    const child = Bun.spawn(piped ? ["bash", "-s", "--", ...args] : ["setsid", "bash", chooser, ...args], {
      env: { HOME: home, PATH: `${bin}:/usr/bin:/bin`, SHELL: "/bin/bash", FIXTURE: root, CI: "true", ...env },
      stdin: piped ? Bun.file(chooser) : "ignore", stdout: "pipe", stderr: "pipe",
    })
    const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited])
    return { code, output: stdout + stderr, executed: await Bun.file(path.join(root, "executed")).text().catch(() => "") }
  }
  return { root, home, run, requests: () => Bun.file(path.join(root, "requests")).text().catch(() => ""), async [Symbol.asyncDispose]() { await rm(root, { recursive: true, force: true }) } }
}

linux.each([
  { args: [], expected: "1.19.5" },
  { args: ["--major", "1"], expected: "1.19.5" },
  { args: ["--major", "2"], expected: "2.2.5" },
  { args: ["--version", "2.2.5"], expected: "2.2.5" },
  { args: ["--major", "2", "--choose", "--no-modify-path"], expected: "2.2.5", piped: true },
  { args: [], expected: "1.19.5", piped: true },
])("chooser pins both stages without reading piped script input: %j", async (input) => {
  await using app = await fixture()
  const result = await app.run(input.args, {}, input.piped)
  expect(result).toMatchObject({ code: 0 })
  expect(result.executed).toStartWith(`${input.expected}|linux-x64-baseline|--version ${input.expected}`)
  expect(await app.requests()).toContain(`/releases/download/v${input.expected}/install`)
  expect(await app.requests()).toContain(`/releases/download/v${input.expected}/SHA256SUMS`)
  expect((await app.requests()).includes("anomalyco")).toBe(false)
})

linux.each([
  ["--major"], ["--major", "3"], ["--version"], ["--version", "2.2.5-beta.1"],
  ["--major", "1", "--version", "2.2.5"], ["--major", "1", "--major", "2"], ["--unknown"], ["--choose"],
].map((args) => ({ args })))("invalid or non-TTY explicit arguments fail before network access: %j", async ({ args }) => {
  await using app = await fixture()
  expect((await app.run(args)).code).not.toBe(0)
  expect(await app.requests()).toBe("")
})

linux("VERSION conflicts are rejected instead of installing a different major", async () => {
  await using app = await fixture()
  expect((await app.run(["--version", "2.2.5"], { VERSION: "1.19.5" })).code).not.toBe(0)
  expect(await app.requests()).toBe("")
})

linux.each([{ ready: false }, { corrupt: "marker" as const }, { corrupt: "install" as const }])("unaccepted or unverified v2 never executes an installer: %j", async (input) => {
  await using app = await fixture(input)
  const result = await app.run(["--major", "2"])
  expect(result.code).not.toBe(0)
  expect(result.executed).toBe("")
})

linux.each([{ legacy: true }, { retained: "unknown" as const }, { retained: "newer" as const }, { existing: "owned1" as const }, { existing: "unknown" as const }, { existing: "shadow" as const }])("existing data/ownership cannot masquerade as a clean v2 install: %j", async (input) => {
  await using app = await fixture(input)
  const result = await app.run(["--major", "2"])
  expect(result.code).not.toBe(0)
  expect(result.executed).toBe("")
  if (input.legacy) expect(await Bun.file(path.join(app.home, ".local/share/opencode/source")).text()).toBe("preserve")
})

linux("an owned v2 reinstall retains its major even with v1 as GitHub Latest", async () => {
  await using app = await fixture({ existing: "owned2", retained: "valid" })
  expect((await app.run()).executed).toStartWith("2.2.5|")
  expect((await app.run(["--major", "1"])).code).not.toBe(0)
})

linux("pagination keeps a maintained v1 release discoverable behind v2 releases", async () => {
  await using app = await fixture({ paginated: true })
  expect((await app.run()).executed).toStartWith("1.19.5|")
  expect(await app.requests()).toContain("page=2")
})
