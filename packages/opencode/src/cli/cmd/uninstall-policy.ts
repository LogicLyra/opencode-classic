// fork: the standalone CLI can share all four XDG roots with upstream.
export const uninstallOptions = {
  "keep-config": { alias: "c", type: "boolean", describe: "keep shared configuration files" },
  "keep-data": { alias: "d", type: "boolean", describe: "keep shared sessions, credentials and snapshots" },
  "remove-shared-data": {
    type: "boolean",
    default: false,
    describe: "delete shared OpenCode storage (also affects upstream OpenCode)",
  },
  "dry-run": { type: "boolean", default: false, describe: "show what would be removed without removing" },
  force: { alias: "f", type: "boolean", default: false, describe: "skip confirmation prompts" },
} as const

export function retainedStorage(args: { removeSharedData?: boolean; keepData?: boolean; keepConfig?: boolean }) {
  return {
    data: !args.removeSharedData || args.keepData === true,
    config: !args.removeSharedData || args.keepConfig === true,
    cache: !args.removeSharedData,
    state: !args.removeSharedData,
  }
}
