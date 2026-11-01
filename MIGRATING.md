# Updating OpenCode Classic

## Current release: v1 bridge

OpenCode Classic v1 remains the stable release while the classic interface is
ported to the v2 service. Updating to **1.19.5 or newer** prepares your client
for that transition and keeps your classic layout and existing profile.

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

- Bridge desktops will discover it through the same in-client update flow.
  Installation still requires the existing restart action.
- CLI users will explicitly opt in with `opencode upgrade --major`.
- Both paths will use the exact Classic release and its checksums. Until
  readiness is enabled, `--major` leaves your installation unchanged.

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
  "minimumVersion": "1.19.5"
}
```

The example is deliberately disabled. A release may set `migrationReady`
to `true` only after classic-layout, profile/config/chat preservation,
installed-client upgrade, interruption/retry, and rollback acceptance tests
pass. The version must match the release tag, and the installed bridge must
meet the minimum version. Missing markers keep users on v1; invalid or
checksum-mismatched markers fail the update check rather than installing.

V1's installer continues to accept only v1 versions. A ready v2 release
ships its own checksum-verified installer. No Classic upgrade path installs
upstream npm, Homebrew, WinGet, or upstream installer releases.
