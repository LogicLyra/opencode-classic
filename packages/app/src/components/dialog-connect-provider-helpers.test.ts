import { describe, expect, test } from "bun:test"
import { isProviderButton, methodDetails, methodLabel, nextActiveIndex } from "./dialog-connect-provider-helpers"

const t = (key: string) => key

describe("methodLabel", () => {
  test("returns empty string for undefined input", () => {
    expect(methodLabel(undefined, t)).toBe("")
  })

  test("localizes API methods regardless of raw label", () => {
    expect(methodLabel({ type: "api", label: "API key" }, t)).toBe("provider.connect.method.apiKey")
    expect(methodLabel({ type: "api", label: "anything else" }, t)).toBe("provider.connect.method.apiKey")
  })

  test("uses raw label for non-API methods", () => {
    expect(methodLabel({ type: "oauth", label: "ChatGPT Pro/Plus" }, t)).toBe("ChatGPT Pro/Plus")
    expect(methodLabel({ type: "oauth" }, t)).toBe("")
  })
})

describe("methodDetails", () => {
  test("returns empty label and no hint for undefined input", () => {
    expect(methodDetails(undefined, t)).toEqual({ label: "", hint: undefined })
  })

  test("extracts (browser) suffix and localizes hint", () => {
    expect(methodDetails({ type: "oauth", label: "ChatGPT Pro/Plus (browser)" }, t)).toEqual({
      label: "ChatGPT Pro/Plus",
      hint: "provider.connect.method.hint.browser",
    })
  })

  test("extracts (headless) suffix and localizes hint", () => {
    expect(methodDetails({ type: "oauth", label: "ChatGPT Pro/Plus (headless)" }, t)).toEqual({
      label: "ChatGPT Pro/Plus",
      hint: "provider.connect.method.hint.headless",
    })
  })

  test("matches suffix case-insensitively", () => {
    expect(methodDetails({ type: "oauth", label: "ChatGPT Pro/Plus (Browser)" }, t).hint).toBe(
      "provider.connect.method.hint.browser",
    )
  })

  test("does not fabricate a Browser hint for unsuffixed API-key methods", () => {
    // The previous behavior mislabeled any API-key method as "Browser"; that was a bug.
    expect(methodDetails({ type: "api", label: "API key" }, t)).toEqual({
      label: "provider.connect.method.apiKey",
      hint: undefined,
    })
  })

  test("returns no hint for unsuffixed oauth methods", () => {
    expect(methodDetails({ type: "oauth", label: "GitHub" }, t)).toEqual({ label: "GitHub", hint: undefined })
  })

  test("respects an explicit suffix even on API methods", () => {
    expect(methodDetails({ type: "api", label: "API key (headless)" }, t)).toEqual({
      label: "provider.connect.method.apiKey",
      hint: "provider.connect.method.hint.headless",
    })
  })
})

describe("nextActiveIndex", () => {
  test("returns -1 when there is nothing to navigate", () => {
    expect(nextActiveIndex(-1, 1, 0)).toBe(-1)
    expect(nextActiveIndex(0, 1, 0)).toBe(-1)
  })

  test("starts at first row when navigating down with no current selection", () => {
    expect(nextActiveIndex(-1, 1, 5)).toBe(0)
  })

  test("starts at last row when navigating up with no current selection", () => {
    expect(nextActiveIndex(-1, -1, 5)).toBe(4)
  })

  test("moves forward and backward in the middle of the list", () => {
    expect(nextActiveIndex(1, 1, 5)).toBe(2)
    expect(nextActiveIndex(2, -1, 5)).toBe(1)
  })

  test("wraps forward past the end to the first row", () => {
    expect(nextActiveIndex(4, 1, 5)).toBe(0)
  })

  test("wraps backward past the start to the last row", () => {
    expect(nextActiveIndex(0, -1, 5)).toBe(4)
  })
})

describe("isProviderButton", () => {
  test("recognizes a button with data-provider-id", () => {
    const button = document.createElement("button")
    button.dataset.providerId = "openai"
    expect(isProviderButton(button)).toBe(true)
  })

  test("rejects inputs and elements without the data attribute", () => {
    const input = document.createElement("input")
    expect(isProviderButton(input)).toBe(false)
    const button = document.createElement("button")
    expect(isProviderButton(button)).toBe(false)
  })

  test("rejects null and non-element targets", () => {
    expect(isProviderButton(null)).toBe(false)
    expect(isProviderButton(new EventTarget())).toBe(false)
  })
})
