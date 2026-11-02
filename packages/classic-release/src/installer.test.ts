import { expect, test } from "bun:test"
import { mkdtemp, mkdir, chmod, rm, readFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { createHash } from "node:crypto"

const version: string = (await Bun.file(path.resolve(import.meta.dir, "../package.json")).json()).version
const script = path.resolve(import.meta.dir, "../../..", "install")
// This transport fixture supplies Linux tarballs; other native installer targets need their own fixtures.
const linux = test.skipIf(process.platform !== "linux")

async function fixture(
  input: {
    prefix?: string
    shadow?: boolean
    corrupt?: boolean
    duplicate?: boolean
    wrongVersion?: boolean
    legacy?: boolean
  } = {},
) {
  const root = await mkdtemp(path.join(tmpdir(), "classic-installer-"))
  const bin = path.join(root, "bin")
  const payload = path.join(root, "payload")
  const home = path.join(root, "home with spaces")
  await Promise.all([bin, payload, home].map((dir) => mkdir(dir)))
  await Bun.write(
    path.join(payload, "opencode"),
    `#!/bin/sh\nprintf '%s\\n' '${input.prefix ?? ""}${input.wrongVersion ? "9.0.0" : version}'\n`,
  )
  await chmod(path.join(payload, "opencode"), 0o755)
  if (input.shadow) {
    await Bun.write(path.join(bin, "opencode"), `#!/bin/sh\nprintf '${version}\\n'\n`)
    await chmod(path.join(bin, "opencode"), 0o755)
  }
  if (input.legacy) await Bun.write(path.join(home, ".local/share/opencode/source-sentinel"), "preserve")
  const tar = Bun.spawn(["tar", "-czf", path.join(root, "payload.tar.gz"), "-C", payload, "opencode"])
  expect(await tar.exited).toBe(0)
  const hash = input.corrupt
    ? "0".repeat(64)
    : createHash("sha256")
        .update(await Bun.file(path.join(root, "payload.tar.gz")).bytes())
        .digest("hex")
  await Bun.write(
    path.join(root, "SHA256SUMS"),
    ["opencode-linux-x64.tar.gz", "opencode-linux-x64-baseline.tar.gz"]
      .map((name) => `${hash}  ${name}\n`.repeat(input.duplicate ? 2 : 1))
      .join(""),
  )
  await Bun.write(
    path.join(bin, "curl"),
    `#!/bin/bash
set -eu
url= output= status=false
while (( $# )); do
  case "$1" in
    -o|--output) output="$2"; shift 2 ;;
    -w) status=true; shift 2 ;;
    https://*) url="$1"; shift ;;
    *) shift ;;
  esac
done
printf '%s %s\\n' "$status" "$url" >> "$FIXTURE/requests"
if [[ "$status" == true ]]; then printf 200; exit 0; fi
case "$url" in
  https://api.github.com/repos/LogicLyra/opencode-classic/releases/latest) printf '{"tag_name":"v${version}"}'; exit 0 ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v${version}/opencode-linux-x64*.tar.gz) source="$FIXTURE/payload.tar.gz" ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v${version}/SHA256SUMS) source="$FIXTURE/SHA256SUMS" ;;
  *) printf 'Unexpected URL: %s\\n' "$url" >&2; exit 22 ;;
esac
cp "$source" "$output"
`,
  )
  await chmod(path.join(bin, "curl"), 0o755)
  const run = async (explicit = true, env: Record<string, string> = {}) => {
    const child = Bun.spawn(["bash", script, "--no-modify-path"], {
      env: {
        HOME: home,
        PATH: `${bin}:/usr/bin:/bin`,
        FIXTURE: root,
        SHELL: "/bin/bash",
        ...(explicit ? { VERSION: version } : {}),
        ...env,
      },
      stdout: "pipe",
      stderr: "pipe",
    })
    const [stdout, stderr, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ])
    return { code, stdout, stderr }
  }
  return {
    root,
    home,
    run,
    binary: path.join(home, ".opencode/bin/opencode"),
    receipt: path.join(home, ".opencode/bin/.opencode-classic-install.json"),
    requests: () => readFile(path.join(root, "requests"), "utf8").catch(() => ""),
    async [Symbol.asyncDispose]() {
      await rm(root, { recursive: true, force: true })
    },
  }
}

linux.each([
  { explicit: true },
  { explicit: true, prefix: "opencode v" },
  { explicit: true, shadow: true },
  ...(version.startsWith("1.") ? [{ explicit: false }] : []),
])("real installer pins and records the destination, independent of PATH: %j", async (input) => {
  await using app = await fixture(input)
  expect(await app.run(input.explicit)).toMatchObject({ code: 0, stderr: "" })
  const receipt = await Bun.file(app.receipt).json()
  expect(receipt).toMatchObject({ schemaVersion: 1, surface: "cli", origin: "release", version })
  expect(receipt.binarySha256).toBe(
    createHash("sha256")
      .update(await Bun.file(app.binary).bytes())
      .digest("hex"),
  )
  expect(await app.requests()).toContain(`/releases/download/v${version}/SHA256SUMS`)
  const before = await app.requests()
  expect(await app.run()).toMatchObject({ code: 0, stderr: "" })
  expect((await app.requests()).slice(before.length)).not.toContain(
    `false https://github.com/LogicLyra/opencode-classic/releases/download/v${version}/opencode-`,
  )
  expect(await Bun.file(path.join(app.home, ".bashrc")).exists()).toBe(false)
})

linux.each(["corrupt", "duplicate", "wrongVersion"] as const)(
  "a %s payload cannot create a destination binary or ownership receipt",
  async (failure) => {
    await using app = await fixture({ [failure]: true })
    expect((await app.run()).code).not.toBe(0)
    expect(await Bun.file(app.binary).exists()).toBe(false)
    expect(await Bun.file(app.receipt).exists()).toBe(false)
  },
)

linux("an incompatible forced archive is refused before replacement", async () => {
  await using app = await fixture()
  expect((await app.run(true, { CLASSIC_INSTALL_TARGET: "darwin-arm64" })).code).not.toBe(0)
  expect(await Bun.file(app.binary).exists()).toBe(false)
})

linux("duplicate installers cannot reuse another operation's lock", async () => {
  await using app = await fixture()
  const lock = path.join(app.home, ".opencode/bin/.opencode-install.lock")
  await mkdir(lock, { recursive: true })
  expect((await app.run()).code).not.toBe(0)
  expect(await Bun.file(app.binary).exists()).toBe(false)
  expect(await Bun.file(lock).stat()).toBeDefined()
})

if (version.startsWith("2."))
  linux("a retained v1/shared profile cannot become a direct fresh v2 install", async () => {
    await using app = await fixture({ legacy: true })
    expect((await app.run()).code).not.toBe(0)
    expect(await Bun.file(path.join(app.home, ".local/share/opencode/source-sentinel")).text()).toBe("preserve")
    expect(await Bun.file(app.binary).exists()).toBe(false)
  })
