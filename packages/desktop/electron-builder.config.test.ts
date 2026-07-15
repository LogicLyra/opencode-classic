import { expect, test } from "bun:test"
import type { Configuration } from "electron-builder"
import { DESKTOP_IDENTITIES, DESKTOP_PACKAGE_NAME, DESKTOP_PROTOCOL, DESKTOP_RELEASE_REPOSITORY } from "./src/identity"

const channels = ["dev", "beta", "prod"] as const

for (const channel of channels) {
  test(`uses the OpenCode Classic identity for ${channel}`, async () => {
    const previous = process.env.OPENCODE_CHANNEL
    process.env.OPENCODE_CHANNEL = channel

    const module = await import(`./electron-builder.config.ts?channel=${channel}`)
    const config = module.default as Configuration

    if (previous === undefined) delete process.env.OPENCODE_CHANNEL
    else process.env.OPENCODE_CHANNEL = previous

    const identity = DESKTOP_IDENTITIES[channel]
    expect(config.appId).toBe(identity.appId)
    expect(config.productName).toBe(identity.productName)
    expect(config.extraMetadata?.name).toBe(DESKTOP_PACKAGE_NAME)
    expect(config.extraMetadata?.desktopName).toBe(`${identity.appId}.desktop`)
    expect(config.linux?.executableName).toBe(identity.appId)
    expect(config.linux?.desktop?.entry?.StartupWMClass).toBe(identity.appId)
    expect(config.protocols).toEqual({ name: identity.productName, schemes: [DESKTOP_PROTOCOL] })
    expect(config.deb?.packageName).toBe(identity.packageName)
    expect(config.rpm?.packageName).toBe(identity.packageName)

    if (channel === "prod") {
      expect(config.publish).toEqual({ provider: "github", ...DESKTOP_RELEASE_REPOSITORY, channel: "latest" })
    }
    if (channel !== "prod") expect(config.publish).toBeUndefined()
  })
}
