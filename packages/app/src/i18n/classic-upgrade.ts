// New upgrade copy has explicit English fallback until reviewed feature translations land.
// Existing app/native/chat-import catalogs retain their strict locale parity contracts.
export const classicUpgradeEnglish = {
  "classicUpgrade.title": "OpenCode Classic 2",
  "classicUpgrade.development":
    "Coming soon — production acceptance in progress. Classic 1 maintenance updates continue separately.",
  "classicUpgrade.available":
    "Classic {{version}} is available. Keep the classic layout with the new v2 engine, or continue using Classic 1.",
  "classicUpgrade.check": "Check availability",
  "classicUpgrade.review": "Review upgrade",
  "classicUpgrade.prepare": "Prepare upgrade to Classic 2",
  "classicUpgrade.preparing": "Preparing upgrade…",
  "classicUpgrade.restart": "Restart and upgrade",
  "classicUpgrade.installing": "Starting upgrade…",
  "classicUpgrade.later": "Remind me later",
  "classicUpgrade.stay": "Stay on Classic 1",
  "classicUpgrade.source": "Installed application: Classic {{version}}",
  "classicUpgrade.target": "Selected release: Classic {{version}}",
  "classicUpgrade.package": "Installation target: {{target}}",
  "classicUpgrade.notes": "Read release notes",
  "classicUpgrade.recovery":
    "Upgrade migrates a consistent copy into a separate Classic 2 profile. Your Classic 1 profile is retained for recovery.",
  "classicUpgrade.rollback":
    "Rollback returns to your retained Classic 1 profile. New sessions and settings created in Classic 2 are not automatically copied back.",
  "classicUpgrade.capture":
    "The final profile snapshot is captured after Classic 1 writers stop at restart. Preparation alone does not replace your application or activate a profile.",
  "classicUpgrade.preflightUnavailable":
    "Profile migration preparation is not available in this build. You can continue using Classic 1.",
  "classicUpgrade.prepared":
    "The selected release is verified and prepared. Restart only when you are ready to stop active Classic work and complete migration.",
  "classicUpgrade.error.verification":
    "Upgrade availability could not be verified. Classic 1 maintenance checks remain available.",
  "classicUpgrade.error.maintenance": "Finish the downloading or staged Classic 1 update before preparing Classic 2.",
  "classicUpgrade.error.changed":
    "The selected upgrade changed or is no longer available. Check availability and review the release again.",
  "classicUpgrade.error.preflight":
    "Profile migration preflight is unavailable or did not pass. Your upgrade has not been activated.",
  "classicUpgrade.error.download":
    "The selected upgrade could not be verified or downloaded. Check availability before trying again.",
  "classicUpgrade.error.install": "The upgrade could not start. Review recovery instructions before trying again.",
} as const
