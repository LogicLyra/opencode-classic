import { expect, test } from "bun:test"
import { render } from "solid-js/web"
import { createComponent, createEffect } from "solid-js"
import { LanguageProvider, loadLocaleDict, useLanguage } from "../src/context/language"
import { PlatformProvider, type Platform } from "../src/context/platform"
import { dict } from "../src/i18n/ar"

test("upgrade English fallback interpolates without replacing existing Arabic translations", async () => {
  await loadLocaleDict("ar")
  const memory = new Map<string, string>()
  const storage: Storage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => { memory.set(key, value) },
    removeItem: (key) => { memory.delete(key) },
    clear: () => memory.clear(),
    key: (index) => [...memory.keys()][index] ?? null,
    get length() { return memory.size },
  }
  const platform: Platform = { platform: "web", openExternal() {}, async restart() {}, async notify() {}, storage: () => storage }
  const original = { lang: document.documentElement.lang, dir: document.documentElement.dir, cookie: document.cookie.match(/(?:^|;\s*)oc_locale=([^;]*)/)?.[1] }
  const seen = { review: "", target: "", cancel: "", locale: "" }
  const ready = Promise.withResolvers<void>()
  const Observe = () => {
    const language = useLanguage()
    language.setLocale("ar")
    createEffect(() => {
      Object.assign(seen, {
        review: language.t("classicUpgrade.review"), target: language.t("classicUpgrade.target", { version: "2.2.5" }),
        cancel: language.t("common.cancel"), locale: language.locale(),
      })
      if (seen.locale === "ar" && seen.cancel === dict["common.cancel"]) ready.resolve()
    })
    return null
  }
  const host = document.createElement("div")
  const dispose = render(() => createComponent(PlatformProvider, {
    value: platform,
    get children() {
      return createComponent(LanguageProvider, {
        locale: "ar",
        get children() { return createComponent(Observe, {}) },
      })
    },
  }), host)
  try {
    await ready.promise
    expect(seen.review).toBe("Review upgrade")
    expect(seen.target).toBe("Selected release: Classic 2.2.5")
    expect(seen.cancel).toBe(dict["common.cancel"])
    expect(seen.locale).toBe("ar")
  } finally {
    dispose()
    document.documentElement.lang = original.lang
    document.documentElement.dir = original.dir
    document.cookie = original.cookie === undefined ? "oc_locale=; Path=/; Max-Age=0" : `oc_locale=${original.cookie}; Path=/`
  }
})
