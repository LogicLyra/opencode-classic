import type { Argv } from "yargs"
import { UI } from "../ui"
import * as prompts from "@clack/prompts"
import { Installation } from "../../installation"
import { InstallationVersion } from "@opencode-ai/core/installation/version"

export const UpgradeCommand = {
  command: "upgrade [target]",
  describe: "upgrade opencode to the latest or a specific version",
  builder: (yargs: Argv) => {
    return yargs
      .positional("target", {
        describe: "version to upgrade to, for ex '0.1.48' or 'v0.1.48'",
        type: "string",
      })
      .option("method", {
        alias: "m",
        describe: "installation method to use (OpenCode Classic releases use curl)",
        type: "string",
        choices: ["curl"],
      })
  },
  handler: async (args: { target?: string; method?: string }) => {
    UI.empty()
    UI.println(UI.logo("  "))
    UI.empty()
    prompts.intro("Upgrade")
    const detectedMethod = await Installation.method()
    const method = args.method === "curl" ? args.method : detectedMethod
    if (method !== "curl") {
      prompts.log.error(
        `OpenCode Classic updates use GitHub Releases; ${method === "unknown" ? process.execPath : method} is not managed by the fork updater`,
      )
      prompts.log.info("Re-run with --method curl to install the fork release into ~/.opencode/bin")
      prompts.outro("Done")
      return
    }
    prompts.log.info("Using method: " + method)
    const target = args.target ? args.target.replace(/^v/, "") : await Installation.latest()

    if (
      InstallationVersion === target ||
      (!args.target && !Installation.isUpdateAvailable(InstallationVersion, target))
    ) {
      const reason = InstallationVersion === target ? "is already installed" : "is not newer than the installed version"
      prompts.log.warn(`opencode upgrade skipped: ${target} ${reason}`)
      prompts.outro("Done")
      return
    }

    prompts.log.info(`From ${InstallationVersion} → ${target}`)
    const spinner = prompts.spinner()
    spinner.start("Upgrading...")
    const err = await Installation.upgrade(method, target).catch((err) => err)
    if (err) {
      spinner.stop("Upgrade failed", 1)
      if (err instanceof Installation.UpgradeFailedError) {
        prompts.log.error(err.stderr)
      } else if (err instanceof Error) prompts.log.error(err.message)
      prompts.outro("Done")
      return
    }
    spinner.stop("Upgrade complete")
    prompts.outro("Done")
  },
}
