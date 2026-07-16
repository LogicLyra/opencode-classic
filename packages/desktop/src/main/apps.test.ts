import { describe, expect, test } from "bun:test"
import { isAllowedLinuxAppName } from "./apps"

describe("Linux application allowlist", () => {
  test("allows supported editor commands", () => {
    for (const name of ["code", "cursor", "zed", "subl"]) expect(isAllowedLinuxAppName(name)).toBe(true)
  })

  test("rejects paths and arbitrary executables", () => {
    for (const name of ["/bin/sh", "bash", "python", "../code", "Sublime Text"]) {
      expect(isAllowedLinuxAppName(name)).toBe(false)
    }
  })
})
