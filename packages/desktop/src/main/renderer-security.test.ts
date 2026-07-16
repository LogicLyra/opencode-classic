import { describe, expect, test } from "bun:test"
import { isTrustedRendererUrl, requireExternalUrl, requireTrustedRendererUrl } from "./renderer-security"

describe("renderer security", () => {
  test("accepts only the packaged renderer origin", () => {
    expect(isTrustedRendererUrl("oc://renderer/index.html", undefined)).toBe(true)
    expect(isTrustedRendererUrl("oc://renderer/assets/app.js", undefined)).toBe(true)
    expect(isTrustedRendererUrl("oc://other/index.html", undefined)).toBe(false)
    expect(isTrustedRendererUrl("https://example.com", undefined)).toBe(false)
    expect(() => requireTrustedRendererUrl("file:///tmp/index.html")).toThrow("untrusted renderer")
  })

  test("accepts the configured development origin only", () => {
    const dev = "http://127.0.0.1:5173"
    expect(isTrustedRendererUrl("http://127.0.0.1:5173/session", dev)).toBe(true)
    expect(isTrustedRendererUrl("http://127.0.0.1:5174/session", dev)).toBe(false)
  })

  test("allows browser and mail links while rejecting executable schemes", () => {
    expect(requireExternalUrl("https://example.com/docs")).toBe("https://example.com/docs")
    expect(requireExternalUrl("http://127.0.0.1:4096/health")).toBe("http://127.0.0.1:4096/health")
    expect(requireExternalUrl("mailto:test@example.com")).toBe("mailto:test@example.com")
    expect(() => requireExternalUrl("file:///etc/passwd")).toThrow("Unsupported external URL protocol")
    expect(() => requireExternalUrl("javascript:alert(1)")).toThrow("Unsupported external URL protocol")
  })
})
