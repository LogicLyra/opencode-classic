import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import type { Configuration } from "electron-builder"
import { DESKTOP_IDENTITIES, DESKTOP_PACKAGE_NAME, DESKTOP_PROTOCOL, DESKTOP_RELEASE_REPOSITORY } from "./src/identity"

const execFileAsync = promisify(execFile)
const packageDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(packageDir, "../..")
const signScript = path.join(rootDir, "script", "sign-windows.ps1")

async function signWindows(configuration: { path: string }) {
  if (process.platform !== "win32") return
  if (process.env.GITHUB_ACTIONS !== "true") return

  await execFileAsync(
    "pwsh",
    ["-NoLogo", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", signScript, configuration.path],
    { cwd: rootDir },
  )
}

const channel = (() => {
  const raw = process.env.OPENCODE_CHANNEL
  if (raw === "dev" || raw === "beta" || raw === "prod") return raw
  return "dev"
})()

const getBase = (identity: (typeof DESKTOP_IDENTITIES)[keyof typeof DESKTOP_IDENTITIES]): Configuration => ({
  artifactName: "opencode-classic-desktop-${os}-${arch}.${ext}",
  directories: {
    output: "dist",
    buildResources: "resources",
  },
  // Linux launchers are .desktop files, so this is the desktop file name,
  // not just the app id.
  // https://developer.gnome.org/documentation/guidelines/maintainer/integrating.html
  // https://www.electron.build/docs/linux/
  extraMetadata: {
    name: DESKTOP_PACKAGE_NAME,
    desktopName: `${identity.appId}.desktop`,
  },
  files: ["out/**/*", "resources/**/*"],
  extraResources: [
    {
      from: "native/",
      to: "native/",
      filter: ["index.js", "index.d.ts", "build/Release/mac_window.node", "swift-build/**"],
    },
    {
      from: "resources/icons/",
      to: "icons/",
      filter: ["**/*"],
    },
  ],
  mac: {
    category: "public.app-category.developer-tools",
    icon: `resources/icons/icon.icns`,
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "resources/entitlements.plist",
    entitlementsInherit: "resources/entitlements.plist",
    notarize: true,
    target: ["dmg", "zip"],
  },
  dmg: {
    sign: true,
  },
  protocols: {
    name: identity.productName,
    schemes: [DESKTOP_PROTOCOL],
  },
  win: {
    icon: `resources/icons/icon.ico`,
    signtoolOptions: {
      sign: signWindows,
    },
    target: ["nsis"],
    verifyUpdateCodeSignature: false,
  },
  nsis: {
    oneClick: true,
    perMachine: false,
    installerIcon: `resources/icons/icon.ico`,
    installerHeaderIcon: `resources/icons/icon.ico`,
  },
  linux: {
    icon: `resources/icons`,
    category: "Development",
    executableName: identity.appId,
    desktop: {
      entry: {
        // Match the installed .desktop file and hicolor icon basename so
        // Linux shells can associate the running Electron window with its launcher.
        StartupWMClass: identity.appId,
      },
    },
    target: ["deb", "rpm"],
  },
})

function getConfig() {
  const identity = DESKTOP_IDENTITIES[channel]
  const base = getBase(identity)

  switch (channel) {
    case "dev": {
      return {
        ...base,
        appId: identity.appId,
        productName: identity.productName,
        deb: { packageName: identity.packageName },
        rpm: { packageName: identity.packageName },
      }
    }
    case "beta": {
      return {
        ...base,
        appId: identity.appId,
        productName: identity.productName,
        deb: { packageName: identity.packageName },
        rpm: { packageName: identity.packageName },
      }
    }
    case "prod": {
      return {
        ...base,
        appId: identity.appId,
        productName: identity.productName,
        publish: { provider: "github", ...DESKTOP_RELEASE_REPOSITORY, channel: "latest" },
        deb: { packageName: identity.packageName },
        rpm: { packageName: identity.packageName },
      }
    }
  }
  throw new Error("Unsupported desktop channel")
}

export default getConfig()
