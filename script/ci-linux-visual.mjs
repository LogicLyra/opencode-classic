import assert from "node:assert/strict"
import { writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { join } from "node:path"

const require = createRequire(new URL("../packages/app/package.json", import.meta.url))
const { chromium } = require("@playwright/test")

const endpoint = process.env.CI_CDP_ENDPOINT
const runtime = process.env.CI_RUNTIME_DIR
assert(endpoint)
assert(runtime)

const report = {
  started: new Date().toISOString(),
  console: [],
  pageErrors: [],
}

const browser = await chromium.connectOverCDP(endpoint)
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
  await page.locator('[data-action="prompt-project"]').first().waitFor({ state: "visible", timeout: 30_000 })

  const title = await page.title()
  const server = await page.evaluate(() => window.api.awaitInitialization())

  assert.equal(title, "OpenCode Classic")
  assert(page.url().startsWith("oc://renderer/"))
  assert(server.url.startsWith("http://127.0.0.1:"))
  assert(server.password)

  await page.keyboard.press("Control+Comma")
  const settings = page.locator('[data-component="dialog"], [data-component="dialog-v2"]').last()
  await settings.waitFor({ state: "visible", timeout: 10_000 })
  const settingsText = await settings.innerText()
  assert(settingsText.split("\n").some((line) => line.trim() === "OpenCode Classic"))

  await page.screenshot({ path: join(runtime, "visual.png"), fullPage: true })
  Object.assign(report, {
    finished: new Date().toISOString(),
    url: page.url(),
    title,
    serverURL: server.url,
    settingsClassicIdentity: true,
  })
  assert.equal(report.pageErrors.length, 0)
  await writeFile(join(runtime, "visual-report.json"), `${JSON.stringify(report, null, 2)}\n`)
} finally {
  await browser.close()
}
