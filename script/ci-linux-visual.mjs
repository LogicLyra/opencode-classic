import assert from "node:assert/strict"
import { writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { join } from "node:path"

const require = createRequire(new URL("../packages/app/package.json", import.meta.url))
const { chromium, expect } = require("@playwright/test")
const version = require("../desktop/package.json").version

const endpoint = process.env.CI_CDP_ENDPOINT
const runtime = process.env.CI_RUNTIME_DIR
assert(endpoint)
assert(runtime)

const report = {
  started: new Date().toISOString(),
  console: [],
  pageErrors: [],
}

const browser = await chromium.connectOverCDP(endpoint, { noDefaults: true })
try {
  assert.equal(browser.contexts().length, 1)
  const context = browser.contexts()[0]
  const pages = context.pages()
  const page =
    pages.find((candidate) => candidate.url().startsWith("oc://renderer")) ??
    pages[0] ??
    (await context.waitForEvent("page", { timeout: 30_000 }))

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      report.console.push({ type: message.type(), text: message.text() })
    }
  })
  page.on("pageerror", (error) => report.pageErrors.push(String(error)))

  await page.waitForLoadState("domcontentloaded")
  const onboarding = page.getByRole("dialog", { name: "Import chats from OpenCode", exact: true })
  await expect(onboarding).toBeVisible({ timeout: 30_000 })
  await onboarding.getByRole("button", { name: "Close", exact: true }).click()
  await expect(onboarding).toBeHidden()
  await expect(page.locator('[data-component="prompt-input"][role="textbox"]')).toBeEditable()
  await expect(page.getByRole("main")).toContainText(join(runtime, "project"), { timeout: 30_000 })

  const title = await page.title()
  const server = await page.evaluate(async () => {
    const initialized = await window.api.awaitInitialization()
    return {
      url: initialized.url,
      authenticated: typeof initialized.password === "string" && initialized.password.length > 0,
    }
  })

  assert.equal(title, "OpenCode Classic")
  assert(page.url().startsWith("oc://renderer/"))
  assert(server.url.startsWith("http://127.0.0.1:"))
  assert(server.authenticated)

  await page.getByRole("button", { name: "Settings", exact: true }).click()
  const settings = page.getByRole("dialog")
  await expect(settings.getByRole("tab", { name: "General", exact: true })).toBeVisible()
  await expect(settings.getByText("OpenCode Classic", { exact: true })).toBeVisible()
  await expect(settings.getByText(`v${version}`, { exact: true })).toBeVisible()
  const upgrade = settings.getByRole("region", { name: "OpenCode Classic 2", exact: true })
  await expect(upgrade).toBeVisible()
  await upgrade.scrollIntoViewIfNeeded()

  await page.screenshot({ path: join(runtime, "visual.png"), fullPage: true })
  Object.assign(report, {
    finished: new Date().toISOString(),
    url: page.url(),
    title,
    serverURL: server.url,
    settingsClassicIdentity: true,
    settingsVersion: version,
    firstLaunchOnboarding: true,
    composerEditable: true,
    deepLinkProject: join(runtime, "project"),
    migrationCardVisible: true,
  })
  assert.equal(report.pageErrors.length, 0)
  assert.deepEqual(report.console, [])
  await writeFile(join(runtime, "visual-report.json"), `${JSON.stringify(report, null, 2)}\n`)
} finally {
  await browser.close()
}
