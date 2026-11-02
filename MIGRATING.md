# Updating OpenCode Classic

## Current release: v1 bridge

OpenCode Classic v1 remains the stable release while the classic interface is
ported to the v2 service. **1.19.5** is the published delivery foundation.
A newer consent-capable v1 bridge must ship before v2 migration becomes
available. Its actual version will be announced with that reviewed release.

- **Desktop (Linux x64 deb/rpm):** use **Check for Updates**, then restart
  when the update is ready. Your existing client can install the v1 bridge.
- **CLI:** run `opencode upgrade`. Classic curl installations update from
  `LogicLyra/opencode-classic` GitHub Releases with checksum verification.
- Keep normal backups of your setup. V1 plugins and integrations using the
  old server API will need compatibility work before moving to v2.

## Moving to v2

A migration-ready Classic v2 release is **not available yet**. The v2 track
is under development; it will retain the classic layout. Upstream OpenCode
v2 is a different client and is not the Classic migration target.

Once a compatible Classic v2 release is ready:

- Ordinary desktop checks stay on the installed major. The new bridge adds a
  separate **Review upgrade → Prepare upgrade → Restart and upgrade** flow,
  plus **Remind me later** and **Stay on Classic 1** choices. Discovery and
  review do not download v2.
- CLI users will explicitly opt in with `opencode upgrade --major`.
- Both paths will use the exact Classic release and its checksums. Until
  readiness is enabled, `--major` leaves your installation unchanged. Existing
  profiles require protected transfer; a direct/pinned installer is not a
  clean-install bypass. Preparation remains disabled in builds that do not
  yet implement profile preflight and the final quiesced snapshot.

Published 1.19.5 can download an eligible v2 during an ordinary desktop check.
Every future public migration-ready manifest must therefore require the newer
consent-capable bridge, strictly **above 1.19.5**. No ready release may retain
the old 1.19.5 floor. Keeping schema 1 lets deployed readers reject that new
minimum cleanly without breaking their v1 maintenance checks.

During coexistence, GitHub **Latest** remains the v1 bridge so older clients
can reach it first. V2 releases are discovered by bridge/v2 clients through
the release list and are published without changing Latest. Old versioned
releases remain available; normal updates do not downgrade your client.

## Release compatibility contract

Cross-major discovery requires a `classic-migration.json` asset covered by
the target release's `SHA256SUMS`, for example:

```json
{
  "schemaVersion": 1,
  "version": "2.2.5",
  "migrationReady": false,
  "sourceMajor": 1,
  "minimumVersion": "1.19.5",
  "supportedUpgradeTargets": [],
  "freshInstallReady": false,
  "supportedFreshInstallTargets": []
}
```

The example is deliberately disabled; its old minimum cannot be used for an
enabled public release. A release may set `migrationReady`
to `true` only after classic-layout, profile/config/chat preservation,
installed-client upgrade, interruption/retry, and rollback acceptance tests
pass. The version must match the release tag, and the installed bridge must
meet the actual published new bridge minimum and match an accepted surface/
OS/architecture/package target. Missing, invalid or corrupt v2 metadata cannot
hide a valid same-major maintenance update. The publisher checks the uploaded
manifest against the approved source, accepted targets and actual assets.

V1's installer continues to accept only v1 versions. A ready v2 release
ships its own checksum-verified installer. No Classic upgrade path installs
upstream npm, Homebrew, WinGet, or upstream installer releases.

## New installations and rollback

Choose the application major before installation using [INSTALLING.md](INSTALLING.md).
A genuinely clean accepted v2 installation will not require installing v1
first. Fresh-install readiness is separate from migration readiness; both
remain disabled for the staged v2 line until production acceptance.

Removing an executable leaves profiles behind. V2 first-use guards require a
known, compatible v2-owned profile or a genuinely fresh namespace. Retained v1,
unknown, newer or partially staged profiles are refused before normal service
startup. These guards preserve data while the copied-profile migrator is
completed; they do not automatically convert existing data.

Rollback restores the v1 executable/package and its preserved v1 profile,
after stopping the Classic v2-owned service. It does not downgrade a v2
database or copy new v2 sessions back into v1. Retain both generations' data.
For an old pinned CLI rollback, verify and use the current bridge installer
with the desired exact v1 version: older installers predate the corrected
VERSION/checksum URL contract. The chooser refuses older/cross-major
replacements that require this explicit recovery procedure.
