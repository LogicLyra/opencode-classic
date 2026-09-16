import { describe, expect, test } from "bun:test"
import { chatImportEnglish } from "../chat-import"
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
})

function placeholders(value: string) {
  return Array.from(value.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g), (match) => match[1]).sort()
}
