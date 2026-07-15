import { resolveChannel } from "./utils"
import { DESKTOP_IDENTITIES, DESKTOP_RELEASE_REPOSITORY } from "../src/identity"

const arg = process.argv[2]
const channel = arg === "dev" || arg === "beta" || arg === "prod" ? arg : resolveChannel()

const identity = DESKTOP_IDENTITIES[channel]
const summary = `Open source AI coding agent${channel !== "prod" ? ` (${channel})` : ""}`
const repository = `https://github.com/${DESKTOP_RELEASE_REPOSITORY.owner}/${DESKTOP_RELEASE_REPOSITORY.repo}`

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <id>${identity.appId}</id>

  <metadata_license>CC0-1.0</metadata_license>
  <project_license>MIT</project_license>

  <name>${identity.productName}</name>
  <summary>${summary}</summary>

  <developer id="io.github.logiclyra">
    <name>LogicLyra</name>
  </developer>

  <description>
    <p>
      OpenCode is an open source agent that helps you write and run code with any AI model.
    </p>
  </description>

  <launchable type="desktop-id">${identity.appId}.desktop</launchable>

  <content_rating type="oars-1.1" />

  <url type="bugtracker">${repository}/issues</url>
  <url type="homepage">${repository}</url>
  <url type="vcs-browser">${repository}</url>

  <screenshots>
    <screenshot type="default">
      <image>https://raw.githubusercontent.com/LogicLyra/opencode-classic/dev/packages/web/src/assets/lander/screenshot.png</image>
    </screenshot>
  </screenshots>
</component>
`

await Bun.write(`resources/${identity.appId}.metainfo.xml`, xml)
console.log(`Generated metainfo for ${channel} at resources/${identity.appId}.metainfo.xml`)
