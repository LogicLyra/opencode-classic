export type DesktopChannel = "dev" | "beta" | "prod"

export const DESKTOP_PROTOCOL = "opencode-classic"
export const DESKTOP_PACKAGE_NAME = "opencode-classic-desktop"
export const DESKTOP_RELEASE_REPOSITORY = {
  owner: "LogicLyra",
  repo: "opencode-classic",
} as const

export const DESKTOP_IDENTITIES = {
  dev: {
    appId: "io.github.logiclyra.opencodeclassic.dev",
    productName: "OpenCode Classic Dev",
    packageName: "opencode-classic-dev",
  },
  beta: {
    appId: "io.github.logiclyra.opencodeclassic.beta",
    productName: "OpenCode Classic Beta",
    packageName: "opencode-classic-beta",
  },
  prod: {
    appId: "io.github.logiclyra.opencodeclassic",
    productName: "OpenCode Classic",
    packageName: "opencode-classic",
  },
} as const satisfies Record<DesktopChannel, { appId: string; productName: string; packageName: string }>

export function normalizeDesktopDeepLink(url: string) {
  const prefix = `${DESKTOP_PROTOCOL}://`
  return url.startsWith(prefix) ? `opencode://${url.slice(prefix.length)}` : undefined
}
