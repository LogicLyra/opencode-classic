import { describe, expect, test } from "bun:test"
import { requireStoreName } from "./store-name"

describe("desktop store names", () => {
  test("accepts scoped store files", () => {
    expect(requireStoreName("opencode.global.dat")).toBe("opencode.global.dat")
    expect(requireStoreName("window-state-123.json")).toBe("window-state-123.json")
  })

  test("rejects path traversal and separators", () => {
    for (const value of ["", ".", "..", "../state", "nested/state", "nested\\state"]) {
      expect(() => requireStoreName(value)).toThrow("Invalid desktop store name")
    }
  })
})
