import { $ } from "bun"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../packages/cli/dist")
const version = process.env.OPENCODE_VERSION
if (!version || !/^2\.\d+\.\d+$/.test(version)) throw new Error("OPENCODE_VERSION must name a stable Classic v2 build")

for await (const manifest of new Bun.Glob("cli-*/package.json").scan({ cwd: root })) {
  const directory = path.dirname(manifest)
  const target = directory.slice("cli-".length)
  if (!/^(linux|darwin|windows)-(x64|arm64)(-baseline)?(-musl)?$/.test(target))
    throw new Error(`Unsupported Classic CLI target: ${target}`)
  if ((await Bun.file(path.join(root, manifest)).json()).version !== version)
    throw new Error(`CLI package version mismatch: ${manifest}`)
  const binary = target.startsWith("windows-") ? "opencode.exe" : "opencode"
  const bin = path.join(root, directory, "bin")
  if (!(await Bun.file(path.join(bin, binary)).exists())) throw new Error(`Missing ${target} binary`)
  // The installer extracts the executable at the archive root; npm-shaped parent directories are incompatible.
  if (target.startsWith("linux-")) await $`tar -czf ${path.join(root, `opencode-${target}.tar.gz`)} -C ${bin} ${binary}`
  else await $`zip -X -q ${path.join(root, `opencode-${target}.zip`)} ${binary}`.cwd(bin)
}
