import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { chatImportEnglish } from "../chat-import"
import { DESKTOP_NATIVE_LOCALES } from "../desktop-native"
import { chatImportLoaders } from "./loaders"

const english = chatImportEnglish as Record<string, string>
const englishKeys = Object.keys(english)

describe("chat import localization", () => {
  test("every wired locale fully covers the English fork copy", async () => {
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const missing = englishKeys.filter((key) => !Object.hasOwn(dict, key))
      const extra = Object.keys(dict)
        .filter((key) => !Object.hasOwn(english, key))
        .sort()
      expect({ locale, missing, extra }).toEqual({ locale, missing: [], extra: [] })
    }
  })

  test("every wired locale preserves English placeholders", async () => {
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const mismatched = englishKeys.filter(
        (key) => Object.hasOwn(dict, key) && placeholders(dict[key]).join() !== placeholders(english[key]).join(),
      )
      expect({ locale, mismatched }).toEqual({ locale, mismatched: [] })
    }
  })

  test("every wired locale translates every phrase or lists it as a documented borrowing", async () => {
    // Borrowings follow each locale's own established dictionary conventions.
    // fo: the Faroese app dictionary itself keeps "Workspace" untranslated.
    const borrowings: Record<string, string[]> = {
      fo: ["profileImport.workspaces"],
    }
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const untranslated = englishKeys.filter(
        (key) => dict[key] === english[key] && !(borrowings[locale] ?? []).includes(key),
      )
      expect({ locale, untranslated }).toEqual({ locale, untranslated: [] })
    }
  })

  test("every wired locale provides non-empty values", async () => {
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const empty = englishKeys.filter((key) => typeof dict[key] !== "string" || dict[key].trim() === "")
      expect({ locale, empty }).toEqual({ locale, empty: [] })
    }
  })

  test("the loader map covers every non-English desktop locale", () => {
    const expected = DESKTOP_NATIVE_LOCALES.filter((locale) => locale !== "en")
    const missing = expected.filter((locale) => !Object.hasOwn(chatImportLoaders, locale))
    const extra = Object.keys(chatImportLoaders).filter((locale) => !expected.includes(locale as never))
    expect({ missing, extra }).toEqual({ missing: [], extra: [] })
  })
})

const repoRoot = path.resolve(import.meta.dir, "../../../../../")
const FORK_INSTALL_URL = "https://github.com/LogicLyra/opencode-classic/releases/latest/download/install"
const FORK_BADGE_URL = "https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"

describe("translated README fork-link consistency", () => {
  const readmes = readdirSync(repoRoot)
    .filter((name) => /^README(\.[a-z]+)?\.md$/.test(name))
    .sort()

  test("the full set of English and translated READMEs is present", () => {
    expect(readmes.length).toBe(22)
  })

  for (const name of readmes) {
    test(`${name} carries fork sections and links`, () => {
      const content = readFileSync(path.join(repoRoot, name), "utf8")
      const problems = {
        missingForkInstallUrl: !content.includes(FORK_INSTALL_URL),
        missingForkBadgeUrl: !content.includes(FORK_BADGE_URL),
        upstreamInstallUrl: content.includes("https://opencode.ai/install"),
        upstreamNpmBadge: content.includes("img.shields.io/npm/v/opencode-ai"),
        upstreamBadge: content.includes("anomalyco/opencode/actions/workflows/publish.yml"),
      }
      const failed = Object.entries(problems)
        .filter(([, failed]) => failed)
        .map(([name]) => name)
      expect({ name, problems: failed }).toEqual({ name, problems: [] })
    })
  }
})

function placeholders(value: string) {
  return Array.from(value.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g), (match) => match[1]).sort()
}
