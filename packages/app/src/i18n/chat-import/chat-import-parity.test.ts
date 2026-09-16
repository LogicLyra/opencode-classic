import { describe, expect, test } from "bun:test"
import { chatImportEnglish } from "../chat-import"
import { chatImportLoaders } from "./loaders"

const englishKeys = Object.keys(chatImportEnglish)

describe("chat import localization", () => {
  test("every wired locale fully covers the English fork copy", async () => {
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const missing = englishKeys.filter((key) => !Object.hasOwn(dict, key))
      const extra = Object.keys(dict)
        .filter((key) => !Object.hasOwn(chatImportEnglish, key))
        .sort()
      expect({ locale, missing, extra }).toEqual({ locale, missing: [], extra: [] })
    }
  })

  test("every wired locale preserves English placeholders", async () => {
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const mismatched = englishKeys.filter(
        (key) => Object.hasOwn(dict, key) && placeholders(dict[key]).join() !== placeholders(chatImportEnglish[key]).join(),
      )
      expect({ locale, mismatched }).toEqual({ locale, mismatched: [] })
    }
  })

  test("every wired locale translates every phrase or lists it as a documented borrowing", async () => {
    const borrowings: Record<string, string[]> = {}
    for (const [locale, load] of Object.entries(chatImportLoaders)) {
      const { dict } = await load()
      const untranslated = englishKeys.filter(
        (key) => dict[key] === chatImportEnglish[key] && !(borrowings[locale] ?? []).includes(key),
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
