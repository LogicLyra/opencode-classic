import { resolveChannel } from "./utils"
import { DESKTOP_IDENTITIES } from "../src/identity"

const arg = process.argv[2]

const channel = arg === "dev" || arg === "beta" || arg === "prod" ? arg : resolveChannel()

const appId = DESKTOP_IDENTITIES[channel].appId

const productName = DESKTOP_IDENTITIES[channel].productName

const summary = `Open source AI coding agent${channel !== "prod" ? ` (${channel})` : ""}`

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <id>${appId}</id>

  <metadata_license>CC0-1.0</metadata_license>
  <project_license>MIT</project_license>

  <name>${productName}</name>
  <summary>${summary}</summary>

  <developer id="io.github.logiclyra">
    <name>LogicLyra</name>
  </developer>

  <description>
    <p>
      OpenCode is an open source agent that helps you write and run code with any AI model.
    </p>
  </description>

  <launchable type="desktop-id">${appId}.desktop</launchable>

  <content_rating type="oars-1.1" />

  <url type="bugtracker">https://github.com/LogicLyra/opencode-classic/issues</url>
  <url type="homepage">https://github.com/LogicLyra/opencode-classic</url>
  <url type="vcs-browser">https://github.com/LogicLyra/opencode-classic</url>

  <screenshots>
    <screenshot type="default">
      <image>https://raw.githubusercontent.com/anomalyco/opencode/b75d4d1c5ec449585d515c756fc81f080a157a9a/packages/web/src/assets/lander/screenshot.png</image>
    </screenshot>
  </screenshots>
</component>
`

await Bun.write(`resources/${appId}.metainfo.xml`, xml)

console.log(`Generated metainfo for ${channel} at resources/${appId}.metainfo.xml`)
