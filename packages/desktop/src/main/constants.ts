import { app } from "electron"
import { DESKTOP_IDENTITIES } from "../identity"

type Channel = "local" | "dev" | "beta" | "prod"

const raw = import.meta.env.OPENCODE_CHANNEL

export const CHANNEL: Channel = raw === "local" || raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const VERSION = app.isPackaged ? app.getVersion() : (process.env.OPENCODE_VERSION ?? app.getVersion())

// Local renderer/server mode keeps the dev application identity.
const identity = DESKTOP_IDENTITIES[app.isPackaged && CHANNEL !== "local" ? CHANNEL : "dev"]
export const APP_NAME = identity.productName
export const APP_ID = identity.appId
