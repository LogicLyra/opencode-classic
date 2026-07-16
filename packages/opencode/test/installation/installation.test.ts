import { describe, expect, test } from "bun:test"
import { makeGlobalNode } from "@opencode-ai/core/effect/app-node"
import { LayerNode } from "@opencode-ai/core/effect/layer-node"
import { httpClient } from "@opencode-ai/core/effect/app-node-platform"
import { Effect, Layer, Stream } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process"
import { Installation } from "../../src/installation"
import { CrossSpawnSpawner } from "@opencode-ai/core/cross-spawn-spawner"
import { testEffect } from "../lib/effect"
import { createHash } from "node:crypto"

const encoder = new TextEncoder()

function mockHttpClient(handler: (request: HttpClientRequest.HttpClientRequest) => Response) {
  const client = HttpClient.make((request) => Effect.succeed(HttpClientResponse.fromWeb(request, handler(request))))
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
  httpHandler: (request: HttpClientRequest.HttpClientRequest) => Response,
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
  describe("isUpdateAvailable", () => {
    test("accepts only valid newer versions", () => {
      expect(Installation.isUpdateAvailable("1.2.3", "1.2.4")).toBe(true)
      expect(Installation.isUpdateAvailable("1.2.3", "1.3.0")).toBe(true)
      expect(Installation.isUpdateAvailable("1.2.3", "2.0.0")).toBe(true)
      expect(Installation.isUpdateAvailable("1.2.3", "1.2.3")).toBe(false)
      expect(Installation.isUpdateAvailable("1.2.3", "1.2.2")).toBe(false)
      expect(Installation.isUpdateAvailable("local", "1.2.4")).toBe(false)
    })
  })

  describe("latest", () => {
    const calls: string[] = []
    testEffect(
      testLayer((request) => {
        calls.push(request.url)
        return jsonResponse({ tag_name: "v1.2.3" })
      }),
    ).effect("reads the latest release from the OpenCode Classic repository", () =>
      Effect.gen(function* () {
        const result = yield* Installation.use.latest()
        expect(result).toBe("1.2.3")
        expect(calls).toEqual(["https://api.github.com/repos/LogicLyra/opencode-classic/releases/latest"])
      }),
    )

    testEffect(testLayer(() => jsonResponse({ tag_name: "v4.0.0-beta.1" }))).effect(
      "strips v prefix from GitHub release tag",
      () =>
        Effect.gen(function* () {
          const result = yield* Installation.use.latest()
          expect(result).toBe("4.0.0-beta.1")
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
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "9.9.9"))
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
        const error = yield* Effect.flip(Installation.use.upgrade("curl", "9.9.9"))
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
        yield* Installation.use.upgrade("curl", "9.9.9")
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
  })
})
