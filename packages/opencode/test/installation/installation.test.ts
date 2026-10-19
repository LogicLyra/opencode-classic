import { describe, expect, test } from "bun:test"
import { makeGlobalNode } from "@opencode-ai/core/effect/app-node"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { httpClient } from "@opencode-ai/core/effect/app-node-platform"
import { Effect, Exit, Fiber, Layer, Stream } from "effect"
import * as TestClock from "effect/testing/TestClock"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process"
import { Installation } from "../../src/installation"
import { InstallationVersion } from "@opencode-ai/core/installation/version"
import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
import { testEffect } from "../lib/effect"
import { createHash } from "node:crypto"

const encoder = new TextEncoder()

// A handler that returns undefined never responds.
function mockHttpClient(handler: (request: HttpClientRequest.HttpClientRequest) => Response | undefined) {
  const client = HttpClient.make((request) => {
    const response = handler(request)
    return response ? Effect.succeed(HttpClientResponse.fromWeb(request, response)) : Effect.never
  })
  return Layer.succeed(HttpClient.HttpClient, client)
}

function mockSpawner(
  handler: (cmd: string, args: readonly string[]) => string | { code: number; stdout?: string; stderr?: string } = () =>
    "",
) {
  const spawner = ChildProcessSpawner.make((command) => {
    const std = ChildProcess.isStandardCommand(command) ? command : undefined
    const result = handler(std?.command ?? "", std?.args ?? [])
    const output = typeof result === "string" ? { code: 0, stdout: result, stderr: "" } : result
    return Effect.succeed(
      ChildProcessSpawner.makeHandle({
        pid: ChildProcessSpawner.ProcessId(0),
        exitCode: Effect.succeed(ChildProcessSpawner.ExitCode(output.code)),
        isRunning: Effect.succeed(false),
        kill: () => Effect.void,
        stdin: { [Symbol.for("effect/Sink/TypeId")]: Symbol.for("effect/Sink/TypeId") } as any,
        stdout: output.stdout ? Stream.make(encoder.encode(output.stdout)) : Stream.empty,
        stderr: output.stderr ? Stream.make(encoder.encode(output.stderr)) : Stream.empty,
        all: Stream.empty,
        getInputFd: () => ({ [Symbol.for("effect/Sink/TypeId")]: Symbol.for("effect/Sink/TypeId") }) as any,
        getOutputFd: () => Stream.empty,
        unref: Effect.succeed(Effect.void),
      }),
    )
  })
  return Layer.succeed(ChildProcessSpawner.ChildProcessSpawner, spawner)
}

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

function releaseResponse(request: HttpClientRequest.HttpClientRequest, body = "install script") {
  if (request.url.endsWith("/SHA256SUMS")) {
    return new Response(`${createHash("sha256").update(body).digest("hex")}  install\n`, { status: 200 })
  }
  return new Response(body, { status: 200 })
}

function testLayer(
  httpHandler: (request: HttpClientRequest.HttpClientRequest) => Response | undefined,
  spawnHandler?: (cmd: string, args: readonly string[]) => string | { code: number; stdout?: string; stderr?: string },
) {
  const spawnerNode = makeGlobalNode({
    service: ChildProcessSpawner.ChildProcessSpawner,
    layer: mockSpawner(spawnHandler),
    deps: [],
  })
  return LayerNode.compile(Installation.node, [
    [httpClient, mockHttpClient(httpHandler)],
    [CrossSpawnSpawner.node, spawnerNode],
  ])
}

describe("installation", () => {
  describe("isUpdate", () => {
    test("only counts newer releases in the installed major version", () => {
      expect(Installation.isUpdate("1.19.0", "1.19.1")).toBe(true)
      expect(Installation.isUpdate("1.19.0", "1.20.0")).toBe(true)
      expect(Installation.isUpdate("1.19.0", "1.19.0")).toBe(false)
      expect(Installation.isUpdate("1.19.0", "1.18.35")).toBe(false)
      expect(Installation.isUpdate("1.19.0", "2.0.0")).toBe(false)
      expect(Installation.isUpdate("1.9.0", "1.10.0")).toBe(true)
    })

    test("compares preview builds within their channel", () => {
      expect(Installation.isUpdate("0.0.0-dev-202610110139", "0.0.0-dev-202610120000")).toBe(true)
      expect(Installation.isUpdate("0.0.0-dev-202610120000", "0.0.0-dev-202610110139")).toBe(false)
    })

    test("source builds only accept OpenCode 1 releases", () => {
      expect(Installation.isUpdate("local", "1.19.0")).toBe(true)
      expect(Installation.isUpdate("local", "2.0.0")).toBe(false)
      expect(Installation.isUpdate("1.19.0", "not-a-version")).toBe(false)
    })
  })

  describe("latest", () => {
    const calls: string[] = []
    testEffect(
      testLayer((request) => {
        calls.push(request.url)
        return jsonResponse({ tag_name: "v1.99.99" })
      }),
    ).effect("reads the latest release from the OpenCode Classic repository", () =>
      Effect.gen(function* () {
        const result = yield* Installation.use.latest()
        expect(result).toBe("1.99.99")
        expect(calls).toEqual(["https://api.github.com/repos/LogicLyra/opencode-classic/releases/latest"])
      }),
    )

    testEffect(testLayer(() => jsonResponse({ tag_name: "v1.99.98-beta.1" }))).effect(
      "strips v prefix from GitHub release tag",
      () =>
        Effect.gen(function* () {
          const result = yield* Installation.use.latest()
          expect(result).toBe("1.99.98-beta.1")
        }),
    )

    testEffect(testLayer(() => jsonResponse({ tag_name: "v2.5.0" }))).effect(
      "reports the installed version when the latest release is a different major",
      () =>
        Effect.gen(function* () {
          const result = yield* Installation.use.latest()
          expect(result).toBe(InstallationVersion)
        }),
    )
  })

  describe("upgrade", () => {
    testEffect(
      testLayer(
        (request) => releaseResponse(request),
        (cmd, args) =>
          cmd === "bash" && args[0] === "--version" ? "GNU bash" : { code: 1, stderr: "token=secret command output" },
      ),
    ).effect("returns sanitized typed errors for failed fork installer execution", () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "1.99.9"))
        expect(error).toBeInstanceOf(Installation.UpgradeFailedError)
        expect(error.stderr).toBe("Upgrade failed for curl (exit code 1).")
        expect(error.message).toBe(error.stderr)
        expect(error.stderr).not.toContain("secret")
        expect(error.stderr).not.toContain("command output")
      }),
    )

    const installerCalls: string[] = []
    testEffect(
      testLayer(
        (request) => {
          installerCalls.push(request.url)
          return releaseResponse(request)
        },
        (cmd, args) => {
          if (cmd === "bash" && args[0] === "--version") return "GNU bash"
          return "ok"
        },
      ),
    ).effect("downloads the exact installer from the OpenCode Classic release", () =>
      Effect.gen(function* () {
        yield* Installation.use.upgrade("curl", "v1.2.3")
        expect(installerCalls).toEqual([
          "https://github.com/LogicLyra/opencode-classic/releases/download/v1.2.3/install",
          "https://github.com/LogicLyra/opencode-classic/releases/download/v1.2.3/SHA256SUMS",
        ])
      }),
    )

    const unsupportedCommands: string[] = []
    testEffect(
      testLayer(
        () => jsonResponse({}),
        (cmd) => {
          unsupportedCommands.push(cmd)
          return ""
        },
      ),
    ).effect("rejects package-manager upgrades without executing commands", () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(Installation.use.upgrade("npm", "1.2.3"))
        expect(error.stderr).toContain("unsupported installation method: npm")
        expect(unsupportedCommands).toEqual([])
      }),
    )

    testEffect(testLayer(() => jsonResponse({}))).effect("rejects invalid release versions before downloading", () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "not-a-version"))
        expect(error.stderr).toBe("Invalid version: not-a-version")
      }),
    )

    testEffect(
      testLayer(
        (request) => releaseResponse(request, "install script with token=secret"),
        (cmd, args) => {
          if (cmd === "bash" && args[0] === "--version") return "GNU bash"
          if (cmd === "bash" || cmd === "sh") return { code: 1, stderr: "script output with token=secret" }
          return ""
        },
      ),
    ).effect("returns sanitized typed errors when the curl install script fails", () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "1.99.9"))
        expect(error).toBeInstanceOf(Installation.UpgradeFailedError)
        expect(error.stderr).toBe("Upgrade failed for curl (exit code 1).")
        expect(error.message).toBe(error.stderr)
        expect(error.stderr).not.toContain("secret")
        expect(error.stderr).not.toContain("script output")
      }),
    )

    testEffect(
      testLayer(
        (request) => releaseResponse(request),
        (cmd, args) => {
          if (cmd === "bash" && args[0] === "--version") return { code: 1, stderr: "missing" }
          if (cmd === "bash") return { code: 1, stderr: "should not execute installer with bash" }
          if (cmd === "sh") return "ok"
          return ""
        },
      ),
    ).effect("falls back to sh when bash is unavailable during curl upgrade", () =>
      Effect.gen(function* () {
        yield* Installation.use.upgrade("curl", "1.99.9")
      }),
    )

    const checksumCommands: string[] = []
    testEffect(
      testLayer(
        (request) =>
          request.url.endsWith("/SHA256SUMS")
            ? new Response(`${"0".repeat(64)}  install\n`, { status: 200 })
            : new Response("install script", { status: 200 }),
        (cmd) => {
          checksumCommands.push(cmd)
          return ""
        },
      ),
    ).effect("rejects a fork installer whose checksum does not match", () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "1.2.3"))
        expect(error.stderr).toBe("Upgrade failed: installer checksum verification failed.")
        expect(checksumCommands).toEqual([])
      }),
    )

    const majorCalls: string[] = []
    testEffect(
      testLayer(
        () => jsonResponse({}),
        (cmd) => {
          majorCalls.push(cmd)
          return ""
        },
      ),
    ).effect("refuses OpenCode 2 targets and points to upgrade --major", () =>
      Effect.gen(function* () {
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "2.0.30"))
        expect(error.stderr).toContain("upgrade --major")
        expect(majorCalls).toEqual([])
      }),
    )
  })

  describe("upgradeMajor", () => {
    const curlCalls: string[] = []
    const curlUrls: string[] = []
    testEffect(
      testLayer(
        (request) => {
          curlUrls.push(request.url)
          return new Response("echo v2", { status: 200 })
        },
        (cmd, args) => {
          curlCalls.push(cmd)
          if (cmd === "bash" && args[0] === "--version") return "GNU bash"
          return ""
        },
      ),
    ).effect("runs the OpenCode 2 install script for curl installs", () =>
      Effect.gen(function* () {
        curlUrls.length = 0
        yield* Installation.use.upgradeMajor("curl")
        expect(curlUrls).toEqual(["https://opencode.ai/v2/install"])
        expect(curlCalls).toContain("bash")
      }),
    )

    const chocoCalls: string[] = []
    testEffect(
      testLayer(
        () => jsonResponse({}),
        (cmd) => {
          chocoCalls.push(cmd)
          return ""
        },
      ),
    ).effect("leaves package managers without OpenCode 2 untouched", () =>
      Effect.gen(function* () {
        chocoCalls.length = 0
        const error = yield* Effect.flip(Installation.use.upgradeMajor("choco"))
        expect(error.stderr).toContain(Installation.MAJOR_INSTRUCTIONS)
        expect(chocoCalls).toEqual([])
      }),
    )
  })
})
