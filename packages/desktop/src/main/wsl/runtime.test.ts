import { expect, test } from "bun:test"
import { wslInstallCommand } from "./runtime"

test("installs the requested OpenCode Classic release inside WSL", () => {
  expect(wslInstallCommand("v1.2.3")).toBe(
    "curl -fsSL 'https://github.com/LogicLyra/opencode-classic/releases/download/v1.2.3/install' | bash -s -- --version '1.2.3'",
  )
})
