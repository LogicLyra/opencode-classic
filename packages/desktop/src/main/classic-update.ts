import { createReleaseClient, downloadBase } from "@opencode-classic/releases"

type Backend = {
  setFeedURL(options: { provider: "generic"; url: string; channel: string }): void
  checkForUpdates(): Promise<{ isUpdateAvailable?: boolean; updateInfo?: { version?: string } } | null | undefined>
}

// Pin metadata and payloads to one immutable release rather than GitHub's unscoped Latest feed.
export async function checkClassicUpdate(backend: Backend, current: string, releases = createReleaseClient()) {
  const target = await releases.update(current)
  return checkClassicTarget(backend, current, target)
}

export async function checkClassicTarget(backend: Backend, current: string, target: string) {
  if (target === current) return { isUpdateAvailable: false }
  backend.setFeedURL({ provider: "generic", url: downloadBase(target), channel: "latest" })
  const result = await backend.checkForUpdates()
  if (result?.isUpdateAvailable && result.updateInfo?.version !== target)
    throw new Error("Classic updater metadata does not match the selected release.")
  return result
}
