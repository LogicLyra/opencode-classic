import { expect, test } from "bun:test"
import { mkdtemp, mkdir, chmod, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { createHash } from "node:crypto"

// Drive the actual installer with a local transport, so archive shape and versioned URLs are exercised.
test.each([false, true])("installer pins payload and checksums; explicit version=%s", async (explicit) => {
  const root = await mkdtemp(path.join(tmpdir(), "classic-installer-"))
  try {
    const bin = path.join(root, "bin")
    const payload = path.join(root, "payload")
    const home = path.join(root, "home")
    await Promise.all([bin, payload, home].map((dir) => mkdir(dir)))
    await Bun.write(path.join(payload, "opencode"), "#!/bin/sh\nprintf '1.19.5\\n'\n")
    await chmod(path.join(payload, "opencode"), 0o755)
    const tar = Bun.spawn(["tar", "-czf", path.join(root, "payload.tar.gz"), "-C", payload, "opencode"])
    expect(await tar.exited).toBe(0)
    const hash = createHash("sha256")
      .update(await Bun.file(path.join(root, "payload.tar.gz")).bytes())
      .digest("hex")
    await Bun.write(
      path.join(root, "SHA256SUMS"),
      `${hash}  opencode-linux-x64.tar.gz\n${hash}  opencode-linux-x64-baseline.tar.gz\n`,
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
printf '%s\\n' "$url" >> "$FIXTURE/requests"
if [[ "$status" == true ]]; then printf 200; exit 0; fi
case "$url" in
  https://api.github.com/repos/LogicLyra/opencode-classic/releases/latest) printf '{"tag_name":"v1.19.5"}'; exit 0 ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v1.19.5/opencode-linux-x64*.tar.gz) source="$FIXTURE/payload.tar.gz" ;;
  https://github.com/LogicLyra/opencode-classic/releases/download/v1.19.5/SHA256SUMS) source="$FIXTURE/SHA256SUMS" ;;
  *) printf 'Unexpected URL: %s\\n' "$url" >&2; exit 22 ;;
esac
cp "$source" "$output"
`,
    )
    await chmod(path.join(bin, "curl"), 0o755)
    const install = Bun.spawn(["bash", path.resolve(import.meta.dir, "../../..", "install"), "--no-modify-path"], {
      env: { HOME: home, PATH: `${bin}:/usr/bin:/bin`, FIXTURE: root, ...(explicit ? { VERSION: "1.19.5" } : {}) },
      stdout: "pipe",
      stderr: "pipe",
    })
    const error = await new Response(install.stderr).text()
    expect({ code: await install.exited, error }).toEqual({ code: 0, error: "" })
    const installed = Bun.spawn([path.join(home, ".opencode/bin/opencode"), "--version"], { stdout: "pipe" })
    expect(await new Response(installed.stdout).text()).toBe("1.19.5\n")
    expect(await installed.exited).toBe(0)
    expect(await Bun.file(path.join(root, "requests")).text()).toContain("releases/download/v1.19.5/SHA256SUMS")
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
