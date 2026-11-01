import { NodeServices } from "@effect/platform-node"
import { EffectFlock } from "@opencode/util/effect-flock"
import { LayerNode } from "@opencode/util/effect/layer-node"
import { Global } from "@opencode/util/global"
import { AppProcess } from "@opencode/util/process"
import { expect, spyOn, test } from "bun:test"
import { Effect, FileSystem, Layer, PlatformError, Stream } from "effect"
import { ChildProcessSpawner } from "effect/process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import { Updater } from "../src/services/updater"
import { testEffect } from "../../core/test/lib/effect"

const it = testEffect(NodeServices.layer)

declare const OPENCODE_CLI_NAME: string | undefined

function fixture(
  respond: (command: {
    readonly command: string
    readonly args: ReadonlyArray<string>
  }) => Partial<AppProcess.RunResult> & {
    error?: AppProcess.AppProcessError
  } = () => ({}),
  name = "@opencode/cli",
  failCleanup = false,
  releasePackage = name,
  formula?: string,
  executableOverride?: (
    root: string,
    home: string,
  ) => Effect.Effect<string, PlatformError.PlatformError, FileSystem.FileSystem>,
) {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
    const root = yield* fs.makeTempDirectoryScoped({ prefix: "opencode-updater-" })
    const execPath = process.execPath
    const modules = path.join(root, "node_modules")
    const executable = executableOverride
      ? yield* executableOverride(root, path.join(root, "home"))
      : formula
        ? path.join(root, "Cellar", formula, "2.0.20", "bin", "opencode")
        : path.join(modules, "@opencode", "cli", "bin", "opencode")
    yield* fs.makeDirectory(path.dirname(executable), { recursive: true })
    yield* fs.writeFileString(executable, "binary")
    if (!formula && !executableOverride)
      yield* fs.writeFileString(
        path.join(modules, "@opencode", "cli", "package.json"),
        JSON.stringify({ name, bin: { opencode: "bin/opencode" } }),
      )
    const requests: string[] = []
    // The updater uses global fetch; scope this replacement to each install test.
    yield* Effect.acquireRelease(
      Effect.sync(() =>
        spyOn(globalThis, "fetch").mockImplementation(
          Object.assign(
            async (input: string | URL | Request) => {
              const url = input instanceof Request ? input.url : input.toString()
              requests.push(url)
              if (url.includes("/releases?"))
                return Response.json([{ tag_name: "v2.3.4", draft: false, prerelease: false }])
              if (url.endsWith("/SHA256SUMS"))
                return new Response(
                  `${releasePackage === "corrupt" ? "0".repeat(64) : createHash("sha256").update("echo classic").digest("hex")}  install\n`,
                )
              if (releasePackage === "missing") return new Response("", { status: 404 })
              return new Response("echo classic")
            },
            { preconnect: fetch.preconnect },
          ),
        ),
      ),
      (request) => Effect.sync(() => request.mockRestore()),
    )
    const global = Global.make({
      home: path.join(root, "home"),
      data: path.join(root, "data"),
      cache: path.join(root, "cache"),
      config: path.join(root, "config"),
      state: path.join(root, "state"),
      tmp: path.join(root, "tmp"),
      bin: path.join(root, "bin"),
      log: path.join(root, "log"),
      repos: path.join(root, "repos"),
    })
    // Windows locates the installer's Git Bash through `git --exec-path`; answer it with a fixture install.
    const git = path.join(root, "Git")
    const bash = process.platform === "win32" ? path.join(git, "bin", "bash.exe") : "bash"
    if (process.platform === "win32") {
      yield* fs.makeDirectory(path.dirname(bash), { recursive: true })
      yield* fs.writeFileString(bash, "bash")
    }
    const commands: string[][] = []
    const updater = yield* Updater.Service.pipe(
      Effect.provide(Updater.layer),
      Effect.provide(
        LayerNode.compile(EffectFlock.node, {
          replacements: [Global.node.replace(Layer.succeed(Global.Service, global))],
        }),
      ),
      Effect.provideService(Global.Service, global),
      Effect.provideService(FileSystem.FileSystem, {
        ...fs,
        remove: (target, options) =>
          failCleanup && target.startsWith(global.cache)
            ? Effect.fail(
                PlatformError.systemError({
                  _tag: "PermissionDenied",
                  module: "FileSystem",
                  method: "remove",
                  pathOrDescriptor: target,
                }),
              )
            : fs.remove(target, options),
        realPath: (input) => (input === execPath ? fs.realPath(executable) : fs.realPath(input)),
      }),
      Effect.provideService(
        AppProcess.Service,
        AppProcess.Service.of({
          ...spawner,
          run: (command) =>
            Effect.suspend(() => {
              if (command._tag !== "StandardCommand") return Effect.die("Unexpected piped install command")
              const args = command.args.map(String)
              const lookup = command.command === "git" && args[0] === "--exec-path"
              if (!lookup) commands.push([command.command, ...args])
              const result = lookup
                ? { stdout: Buffer.from(`${path.join(git, "mingw64", "libexec", "git-core")}\n`) }
                : respond({ command: command.command, args })
              if (result.error) return Effect.fail(result.error)
              return Effect.succeed({
                command: command.command,
                exitCode: 0,
                stdout: Buffer.alloc(0),
                stderr: Buffer.alloc(0),
                stdoutTruncated: false,
                stderrTruncated: false,
                ...result,
              })
            }),
          runStream: () => Stream.die("Unexpected streaming install command"),
        }),
      ),
    )
    return { updater, commands, requests, global, fs, executable, bash }
  })
}

const windows = process.platform === "win32" ? it.live : it.live.skip
const unix = process.platform === "win32" ? it.live.skip : it.live

const installs = ["npm", "pnpm", "yarn", "vp", "bun", "brew", "winget"] as const

installs.forEach((method) => {
  it.live(`${method} cannot replace Classic with an upstream package`, () =>
    Effect.gen(function* () {
      const test = yield* fixture()
      const error = yield* test.updater.upgrade(method, "v2.3.4").pipe(Effect.flip)
      expect(error.message).toContain("Unsupported Classic update method")
      expect(test.commands).toEqual([])
      expect(test.requests).toEqual([])
    }),
  )
})

it.live("a renamed upstream package cannot bypass the Classic update route", () =>
  Effect.gen(function* () {
    const test = yield* fixture(() => ({}), "@opencode/cli", false, "@opencode/cli-node")
    const error = yield* test.updater.upgrade("vp", "v2.3.4").pipe(Effect.flip)
    expect(error.message).toContain("Unsupported Classic update method")
    expect(test.commands).toEqual([])
  }),
)

it.live("vp removes the package from its managed global store", () =>
  Effect.gen(function* () {
    const test = yield* fixture()
    const removal = test.updater.removal("vp")
    if (!removal) return yield* Effect.die("Expected vp removal command")
    expect(removal.command).toEqual(["vp", "uninstall", "-g", "@opencode/cli"])
    yield* removal.run
    expect(test.commands).toEqual([["vp", "uninstall", "-g", "@opencode/cli"]])
  }),
)
it.live("Classic ignores install cache cleanup failures after a successful verified install", () =>
  Effect.gen(function* () {
    const test = yield* fixture(() => ({}), "@opencode/cli", true)
    yield* test.updater.upgrade("curl", "v2.3.4")
    expect(test.commands).toHaveLength(1)
  }),
)
;["success", "install"].forEach((failure) => {
  it.live(`curl uses a verified Classic installer and cleans its directory: ${failure}`, () =>
    Effect.gen(function* () {
      const test = yield* fixture((command) => {
        const installer = command.args[0]
        expect(existsSync(path.dirname(installer))).toBe(true)
        expect(readFileSync(installer, "utf8")).toBe("echo classic")
        return {
          exitCode: path.basename(command.command, ".exe") === (failure === "install" ? "bash" : "") ? 1 : 0,
          stderr: Buffer.from(`${failure} failed`),
        }
      })
      const result = yield* test.updater.upgrade("curl", "v2.3.4").pipe(Effect.flip, Effect.option)
      const installer = test.commands[0]?.[1]
      expect(installer).toStartWith(path.join(test.global.cache, "classic-update-"))
      expect(test.commands).toEqual([[test.bash, installer, "--version", "2.3.4", "--no-modify-path"]])
      expect(test.requests).toEqual([
        "https://github.com/LogicLyra/opencode-classic/releases/download/v2.3.4/install",
        "https://github.com/LogicLyra/opencode-classic/releases/download/v2.3.4/SHA256SUMS",
      ])
      expect(yield* test.fs.readDirectory(test.global.cache)).toEqual([])
      expect(result._tag).toBe(failure === "success" ? "None" : "Some")
      if (result._tag === "Some") expect(result.value.message).toBe("Classic installer failed (exit code 1).")
    }),
  )
})

it.live("invalid version targets never execute a command or create a cache", () =>
  Effect.gen(function* () {
    const test = yield* fixture()
    yield* Effect.forEach(Updater.methods, (method) =>
      Effect.forEach(
        [
          "",
          "latest",
          "2.3",
          "01.2.3",
          "vv2.3.4",
          "2.3.4; echo unsafe",
          "--global",
          "v2.3.4\n--force",
          "3.0.0",
          "1.19.5",
          "2.3.4-beta.1",
        ],
        (version) =>
          Effect.gen(function* () {
            const error = yield* test.updater.upgrade(method, version).pipe(Effect.flip)
            expect(error.message).toBe(`Invalid version: ${version}`)
          }),
      ),
    )
    expect(test.commands).toEqual([])
    expect(yield* test.fs.exists(test.global.cache)).toBe(false)
  }),
)
;["corrupt", "missing"].forEach((failure) => {
  it.live(`a ${failure} Classic installer cannot execute a shell`, () =>
    Effect.gen(function* () {
      const test = yield* fixture(() => ({}), "@opencode/cli", false, failure)
      const error = yield* test.updater.upgrade("curl", "2.3.4").pipe(Effect.flip)
      expect(error.message).toContain("checksum verification failed or the release could not be downloaded")
      expect(test.commands).toEqual([])
    }),
  )
})

it.live("install failures are sanitized and process errors do not report success", () =>
  Effect.gen(function* () {
    const failed = yield* fixture(() => ({ exitCode: 1, stderr: Buffer.from("  registry denied access\n") }))
    const error = yield* failed.updater.upgrade("curl", "2.3.4").pipe(Effect.flip)
    expect(error.message).toBe("Classic installer failed (exit code 1).")
    const missing = yield* fixture(() => ({ error: new AppProcess.AppProcessError({ command: "npm" }) }))
    const unavailable = yield* missing.updater.upgrade("curl", "2.3.4").pipe(Effect.flip)
    expect(unavailable.message).toBe("Could not install the Classic release.")
    expect(failed.commands).toHaveLength(1)
    expect(missing.commands).toHaveLength(1)
  }),
)
;(["npm", "pnpm", "bun", "yarn", "vp", undefined] as const).forEach((method) => {
  it.live(`method detection identifies ${method ?? "an unknown installation"} using the V2 package`, () =>
    Effect.gen(function* () {
      const test = yield* fixture((command) => ({
        stdout: Buffer.from(
          command.command === method
            ? method === "vp"
              ? JSON.stringify([{ name: "@opencode/cli", version: "2.3.4" }])
              : "@opencode/cli@2.3.4"
            : command.command === "vp"
              ? "[]"
              : "opencode-ai@1.0.0",
        ),
      }))
      expect(yield* test.updater.method()).toBe(method)
      expect(test.commands).toEqual([
        ["npm", "list", "-g", "--depth=0", "@opencode/cli"],
        ["pnpm", "list", "-g", "--depth=0", "@opencode/cli"],
        ["bun", "pm", "ls", "-g"],
        ["yarn", "global", "list"],
        ["vp", "list", "-g", "--json", "@opencode/cli"],
      ])
    }),
  )
})

it.live("method detection tolerates unavailable package managers", () =>
  Effect.gen(function* () {
    const test = yield* fixture((command) =>
      command.command === "yarn"
        ? { stdout: Buffer.from("@opencode/cli@2.3.4") }
        : { error: new AppProcess.AppProcessError({ command: command.command }) },
    )
    expect(yield* test.updater.method()).toBe("yarn")
    expect(test.commands).toHaveLength(5)
  }),
)

it.live("vp detection ignores no-match output that repeats the package name", () =>
  Effect.gen(function* () {
    const test = yield* fixture((command) => ({
      stdout: Buffer.from(command.command === "vp" ? "No global packages matching '@opencode/cli'." : ""),
    }))
    expect(yield* test.updater.method()).toBeUndefined()
  }),
)

it.live("Homebrew ownership is detected but cannot route Classic updates to Core", () =>
  Effect.gen(function* () {
    const test = yield* fixture(() => ({}), "@opencode/cli", false, "anomalyco/tap/opencode-v2", "opencode")
    expect(yield* test.updater.method()).toBe("brew")
    expect((yield* test.updater.latest("brew").pipe(Effect.flip)).message).toContain(
      "Unsupported Classic update method",
    )
    expect((yield* test.updater.upgrade("brew", "2.0.21").pipe(Effect.flip)).message).toContain(
      "Unsupported Classic update method",
    )
    expect(test.commands).toEqual([])
    expect(test.requests).toEqual([])
  }),
)
;["opencode-v2", "opencode-beta"].forEach((formula) => {
  it.live(`Homebrew tap installs of ${formula} cannot replace Classic`, () =>
    Effect.gen(function* () {
      const test = yield* fixture(() => ({}), "@opencode/cli", false, `anomalyco/tap/${formula}`, formula)
      expect(yield* test.updater.method()).toBe("brew")
      expect((yield* test.updater.upgrade("brew", "2.3.4").pipe(Effect.flip)).message).toContain(
        "Unsupported Classic update method",
      )
      expect(test.commands).toEqual([])
      expect(test.requests).toEqual([])
    }),
  )
})

const winget = (search: Partial<AppProcess.RunResult>) =>
  fixture(
    (command) => (command.args[0] === "search" ? search : {}),
    "@opencode/cli",
    false,
    "@opencode/cli",
    undefined,
    (root) =>
      Effect.succeed(
        path.join(
          root,
          "AppData",
          "Local",
          "Microsoft",
          "WinGet",
          "Packages",
          "Anomaly.OpenCode_Microsoft.Winget.Source_8wekyb3d8bbwe",
          "opencode.exe",
        ),
      ),
  )
const wingetArgs = [
  "--id",
  "Anomaly.OpenCode",
  "--exact",
  "--source",
  "winget",
  "--accept-source-agreements",
  "--disable-interactivity",
]

it.live("WinGet keeps uninstall ownership but cannot check or install upstream updates", () =>
  Effect.gen(function* () {
    const test = yield* winget({
      stdout: Buffer.from(
        "Name     Id               Version\r\n------------------------------\r\nOpenCode Anomaly.OpenCode 2.0.28\r\n",
      ),
    })
    expect(yield* test.updater.method()).toBe("winget")
    expect((yield* test.updater.latest("winget").pipe(Effect.flip)).message).toContain(
      "Unsupported Classic update method",
    )
    expect((yield* test.updater.upgrade("winget", "v2.0.28").pipe(Effect.flip)).message).toContain(
      "Unsupported Classic update method",
    )
    const removal = test.updater.removal("winget")
    if (!removal) return yield* Effect.die("Expected winget removal command")
    yield* removal.run
    expect(test.commands).toEqual([["winget", "uninstall", ...wingetArgs]])
    // WinGet moderates submissions, so the OpenCode release service may list a version WinGet cannot install yet.
    expect(test.requests).toEqual([])
  }),
)

it.live("WinGet lookup cannot supply a version to the Classic updater", () =>
  Effect.gen(function* () {
    const test = yield* winget({
      exitCode: -1978335212,
      stdout: Buffer.from("No package found matching input criteria.\r\n"),
    })
    const error = yield* test.updater.latest("winget").pipe(Effect.flip)
    expect(error.message).toContain("Unsupported Classic update method")
    expect(test.commands).toEqual([])
  }),
)

// Links are named opencode-upgrade-<pid>-<random>.exe; read them from inside the installer run.
const links = (directory: string) =>
  existsSync(directory) ? readdirSync(directory).filter((name) => name.startsWith("opencode-")) : []
const upgradeLinks = (directory: string) =>
  links(directory).filter((name) => name.startsWith(`opencode-upgrade-${process.pid}-`))

windows("windows leaves package-managed binaries untouched when Classic refuses their update", () =>
  Effect.gen(function* () {
    const layout = { executable: "", cache: "" }
    const test = yield* fixture(() => {
      expect(readFileSync(layout.executable, "utf8")).toBe("binary")
      const held = upgradeLinks(layout.cache)
      expect(held).toHaveLength(1)
      expect(readFileSync(path.join(layout.cache, held[0]), "utf8")).toBe("binary")
      return {}
    })
    layout.executable = test.executable
    layout.cache = test.global.cache
    yield* test.fs.makeDirectory(test.global.cache, { recursive: true })
    // pid 999999999 does not exist; pid 4 is System, alive but not openable (EPERM).
    yield* test.fs.writeFileString(path.join(test.global.cache, "opencode-upgrade-999999999-dead.exe"), "exited")
    yield* test.fs.writeFileString(path.join(test.global.cache, "opencode-service-4-aa.exe"), "inaccessible")
    yield* test.updater.upgrade("bun", "2.3.4").pipe(Effect.flip)
    expect(test.commands).toHaveLength(0)
    // The installed path never disappears; the extra link is released and only dead ones are swept.
    expect(yield* test.fs.readFileString(test.executable)).toBe("binary")
    expect(links(test.global.cache)).toEqual(["opencode-upgrade-999999999-dead.exe", "opencode-service-4-aa.exe"])
  }),
)

windows("windows does not create a retained link for a refused package-manager update", () =>
  Effect.gen(function* () {
    const layout = { cache: "" }
    const test = yield* fixture(() => {
      expect(upgradeLinks(layout.cache)).toHaveLength(1)
      return { exitCode: 1, stderr: Buffer.from("registry denied access") }
    })
    layout.cache = test.global.cache
    const error = yield* test.updater.upgrade("npm", "2.3.4").pipe(Effect.flip)
    expect(error.message).toContain("Unsupported Classic update method")
    expect(yield* test.fs.readFileString(test.executable)).toBe("binary")
    expect(links(test.global.cache)).toEqual([])
  }),
)

windows("windows keeps the uninstall link in the temporary directory, not the removed cache", () =>
  Effect.gen(function* () {
    const layout = { tmp: "" }
    const test = yield* fixture(() => {
      expect(upgradeLinks(layout.tmp)).toHaveLength(1)
      return {}
    })
    layout.tmp = test.global.tmp
    yield* test.fs.makeDirectory(test.global.cache, { recursive: true })
    const removal = test.updater.removal("bun")
    if (!removal) return yield* Effect.die("Expected bun removal command")
    yield* removal.run
    expect(test.commands).toEqual([["bun", "remove", "--global", "@opencode/cli"]])
    expect(links(test.global.cache)).toEqual([])
    expect(links(test.global.tmp)).toEqual([])
  }),
)

windows("windows links the curl binary before the installer replaces it", () =>
  Effect.gen(function* () {
    const layout = { executable: "", cache: "" }
    const test = yield* fixture(
      (command) => {
        if (path.basename(command.command, ".exe") === "bash") {
          expect(readFileSync(layout.executable, "utf8")).toBe("binary")
          expect(upgradeLinks(layout.cache)).toHaveLength(1)
        }
        return {}
      },
      "@opencode/cli",
      false,
      "@opencode/cli",
      undefined,
      (_root, home) => Effect.succeed(path.join(home, ".opencode", "bin", "opencode.exe")),
    )
    layout.executable = test.executable
    layout.cache = test.global.cache
    const original = process.execPath
    process.execPath = layout.executable
    yield* Effect.addFinalizer(() => Effect.sync(() => (process.execPath = original)))
    expect(yield* test.updater.method()).toBe("curl")
    yield* test.updater.upgrade("curl", "2.3.4")
    expect(test.commands.map((command) => command[0])).toEqual([test.bash])
    expect(yield* test.fs.readFileString(layout.executable)).toBe("binary")
    expect(links(test.global.cache)).toEqual([])
  }),
)

unix("curl method detection resolves symlinked home directories", () =>
  Effect.gen(function* () {
    const test = yield* fixture(
      () => ({}),
      "@opencode/cli",
      false,
      "@opencode/cli",
      undefined,
      (root, home) =>
        Effect.gen(function* () {
          const fs = yield* FileSystem.FileSystem
          const realHome = path.join(root, "real-home")
          const bin = path.join(realHome, ".opencode", "bin", "opencode")
          yield* fs.makeDirectory(path.dirname(bin), { recursive: true })
          yield* fs.symlink(realHome, home)
          return bin
        }),
    )
    expect(yield* test.updater.method()).toBe("curl")
    expect(test.commands).toEqual([])
  }),
)

windows("windows leaves a source checkout's runtime alone", () =>
  Effect.gen(function* () {
    const layout = { cache: "" }
    const test = yield* fixture(() => {
      expect(links(layout.cache)).toEqual([])
      return {}
    }, "not-opencode")
    layout.cache = test.global.cache
    yield* test.updater.upgrade("curl", "2.3.4")
    expect(test.commands).toHaveLength(1)
  }),
)

unix("other platforms never link the running binary", () =>
  Effect.gen(function* () {
    const layout = { cache: "" }
    const test = yield* fixture(() => {
      expect(links(layout.cache)).toEqual([])
      return {}
    })
    layout.cache = test.global.cache
    yield* test.updater.upgrade("curl", "2.3.4")
    expect(yield* test.fs.readFileString(test.executable)).toBe("binary")
  }),
)

test("Node distribution honors the compile-time CLI name", async () => {
  const child = Bun.spawn(
    [
      process.execPath,
      "test",
      import.meta.path,
      "--define",
      'OPENCODE_CLI_NAME="opencode2-node"',
      "--test-name-pattern",
      "^Node distribution resolves the published npm package$",
    ],
    {
      cwd: path.join(import.meta.dir, ".."),
      stdout: "ignore",
      stderr: "pipe",
      // Bun 1.4 can reuse cached modules compiled with different --define values.
      env: { ...process.env, BUN_RUNTIME_TRANSPILER_CACHE_PATH: "0" },
    },
  )
  const [code, stderr] = await Promise.all([child.exited, new Response(child.stderr).text()])
  expect(code, stderr).toBe(0)
  expect(stderr).toContain("1 pass")
})

if (typeof OPENCODE_CLI_NAME === "string" && OPENCODE_CLI_NAME === "opencode2-node") {
  it.live("Node distribution resolves the published npm package", () =>
    Effect.gen(function* () {
      const test = yield* fixture(
        (command) => ({
          stdout: Buffer.from(command.command === "npm" ? "@opencode/cli-node@2.3.4" : ""),
        }),
        "@opencode/cli-node",
      )
      expect(yield* test.updater.method()).toBe("npm")
      yield* test.updater.upgrade("npm", "v2.3.4").pipe(Effect.flip)
      yield* test.updater.upgrade("pnpm", "v2.3.4").pipe(Effect.flip)
      yield* test.updater.upgrade("vp", "v2.3.4").pipe(Effect.flip)
      expect(test.commands).toEqual([
        ["npm", "list", "-g", "--depth=0", "@opencode/cli-node"],
        ["pnpm", "list", "-g", "--depth=0", "@opencode/cli-node"],
        ["bun", "pm", "ls", "-g"],
        ["yarn", "global", "list"],
        ["vp", "list", "-g", "--json", "@opencode/cli-node"],
      ])
    }),
  )
}
