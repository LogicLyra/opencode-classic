import { expect, test } from "bun:test"
import { DESKTOP_IDENTITIES, DESKTOP_PACKAGE_NAME, DESKTOP_PROTOCOL, normalizeDesktopDeepLink } from "./identity"

test("keeps every desktop channel separate from upstream OpenCode", () => {
  expect(DESKTOP_IDENTITIES.prod).toEqual({
    appId: "io.github.logiclyra.opencodeclassic",
    productName: "OpenCode Classic",
    packageName: "opencode-classic",
  })
  expect(new Set(Object.values(DESKTOP_IDENTITIES).map((identity) => identity.appId)).size).toBe(3)
  expect(DESKTOP_PACKAGE_NAME).toBe("opencode-classic-desktop")
  expect(DESKTOP_PROTOCOL).toBe("opencode-classic")
})

test("normalizes fork deep links for the shared renderer parser", () => {
  expect(normalizeDesktopDeepLink("opencode-classic://open-project?directory=/tmp/demo")).toBe(
    "opencode://open-project?directory=/tmp/demo",
  )
  expect(normalizeDesktopDeepLink("opencode://open-project?directory=/tmp/demo")).toBeUndefined()
  expect(normalizeDesktopDeepLink("https://example.com")).toBeUndefined()
})
