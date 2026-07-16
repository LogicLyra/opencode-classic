import { describe, expect, test } from "bun:test"
import { join } from "node:path"
import { createIsolatedSidecarEnv } from "./sidecar-env"

describe("sidecar environment isolation", () => {
  test("places every persistent XDG root under Classic user data", () => {
    const root = "/tmp/io.github.logiclyra.opencodeclassic"
    const source = {
      HOME: "/home/test",
      XDG_CONFIG_HOME: "/home/test/.config",
      XDG_DATA_HOME: "/home/test/.local/share",
      XDG_CACHE_HOME: "/home/test/.cache",
      XDG_STATE_HOME: "/home/test/.local/state",
      OPENCODE_CONFIG_DIR: "/home/test/.config/opencode",
      OPENCODE_DB: "/home/test/.local/share/opencode/opencode.db",
      OPENCODE_TEST_HOME: "/tmp/test-home",
    }
    const env = createIsolatedSidecarEnv(root, source)

    expect(env.XDG_CONFIG_HOME).toBe(join(root, "sidecar/config"))
    expect(env.XDG_DATA_HOME).toBe(join(root, "sidecar/data"))
    expect(env.XDG_CACHE_HOME).toBe(join(root, "sidecar/cache"))
    expect(env.XDG_STATE_HOME).toBe(join(root, "sidecar/state"))
    expect(env.TMPDIR).toBe(join(root, "sidecar/tmp"))
    expect(env.HOME).toBe(source.HOME)
    expect(env.OPENCODE_CONFIG_DIR).toBeUndefined()
    expect(env.OPENCODE_DB).toBeUndefined()
    expect(env.OPENCODE_TEST_HOME).toBeUndefined()
    expect(source.XDG_CONFIG_HOME).toBe("/home/test/.config")
  })
})
