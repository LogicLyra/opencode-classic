export const RENDERER_SCHEME = "oc"
export const RENDERER_HOST = "renderer"

export function isTrustedRendererUrl(value?: string, devUrl = process.env.ELECTRON_RENDERER_URL) {
  if (!value || !URL.canParse(value)) return false
  const url = new URL(value)
  if (url.protocol === `${RENDERER_SCHEME}:` && url.host === RENDERER_HOST) return true
  if (!devUrl || !URL.canParse(devUrl)) return false
  return url.origin === new URL(devUrl).origin
}

export function requireTrustedRendererUrl(value?: string) {
  if (!isTrustedRendererUrl(value)) throw new Error("Rejected IPC from an untrusted renderer")
}

export function requireExternalUrl(value: string) {
  if (!URL.canParse(value)) throw new Error("Invalid external URL")
  const url = new URL(value)
  if (url.protocol !== "https:" && url.protocol !== "http:" && url.protocol !== "mailto:") {
    throw new Error(`Unsupported external URL protocol: ${url.protocol}`)
  }
  return url.toString()
}
