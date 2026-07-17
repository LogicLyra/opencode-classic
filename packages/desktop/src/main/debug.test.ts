import { describe, expect, test } from "bun:test"
import { requireFocusDebugState } from "./debug"

describe("focus debugger", () => {
  test("rejects non-boolean IPC values", () => {
    expect(() => requireFocusDebugState("true")).toThrow("Focus debug state must be a boolean")
  })
})
