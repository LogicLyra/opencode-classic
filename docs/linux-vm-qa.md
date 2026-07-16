# Linux VM Release QA

This runbook describes the disposable Linux VM used to validate OpenCode Classic before merging or publishing a release. It covers source checks, tests, production builds, deb/RPM packaging, installed-deb runtime checks, visual inspection, evidence retention, and cleanup.

The commands intentionally avoid repository-specific hostnames, private IP addresses, SSH keys, and credentials. Supply those values through your local environment.

## Scope and invariants

- Linux desktop artifacts are deb and RPM packages only.
- AppImage is intentionally unsupported. Do not use `--no-sandbox` to make an unpacked Electron application run on Ubuntu.
- The authoritative runtime smoke test uses the installed deb on Ubuntu 24.04 so its post-install AppArmor and Chromium sandbox integration are active.
- Run release QA in a disposable VM, not on a maintainer workstation.
- Do not expose the CDP endpoint or sidecar listener outside loopback.
- Do not place tokens in command lines, evidence files, screenshots, or the VM image.
- Keep evidence immutable after a successful run.
- A successful QA run does not publish, tag, sign, or upload anything.

## Recommended VM

Use an x86-64 Ubuntu 24.04 VM with:

| Resource  | Recommended minimum                           |
| --------- | --------------------------------------------- |
| vCPU      | 8                                             |
| RAM       | 16 GiB                                        |
| Swap      | 4 GiB                                         |
| Free disk | 40 GiB                                        |
| Network   | HTTPS access to GitHub and package registries |

The type-aware root lint is the largest memory consumer. A smaller VM may terminate `oxlint` even when package-level checks succeed. The validated configuration had 15 GiB usable RAM and 4 GiB swap.

The VM clock must be synchronized because evidence directories and release metadata use UTC timestamps.

## System packages

Install the build, package-inspection, and headless-desktop tools:

```bash
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  build-essential \
  ca-certificates \
  curl \
  dbus-x11 \
  desktop-file-utils \
  git \
  iproute2 \
  openbox \
  procps \
  rpm \
  rsync \
  shellcheck \
  wmctrl \
  x11-utils \
  xvfb
```

The installed desktop package requires the following runtime libraries. Installing the generated deb with APT resolves them automatically:

```text
libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils
libatspi2.0-0 libuuid1 libsecret-1-0
```

`libappindicator3-1` is recommended but not required.

Install `actionlint` from its official release and verify its checksum before placing it in `~/.local/bin`. The validated toolchain used:

```text
Bun 1.3.14
Node.js 24
actionlint 1.7.12
ShellCheck 0.11
```

The repository pins Bun through `packageManager`. Keep the VM Bun version aligned with that value.

```bash
export PATH="$HOME/.local/bin:$PATH"
bun --version
node --version
actionlint --version
shellcheck --version
```

## Directory layout

Keep source, temporary state, and retained evidence separate:

```text
~/qa/worktrees/<branch>-<short-sha>/    dedicated Git worktree
~/qa/runs/linux-ci-<run-id>/            retained gate evidence
~/qa/runs/linux-runtime-<run-id>/       retained runtime evidence
/var/tmp/opencode-classic-ci-<run-id>/  disposable test/build state
/var/tmp/opencode-classic-runtime-*/    disposable Electron state
```

Do not put `TMPDIR` beneath the checkout or `$HOME`. Some npm configuration tests discover a parent `.npmrc`; a test root nested beneath the home directory can therefore change behavior. `/var/tmp` also avoids small `/tmp` tmpfs and inode limits.

Create a dedicated worktree from the exact candidate commit:

```bash
git fetch --all --tags --prune
git worktree add "$HOME/qa/worktrees/release-candidate" <candidate-sha>
```

Prefer testing committed candidate state. If uncommitted files must be synchronized, copy only the intended paths and compare local and VM status before running the gate:

```bash
git status --porcelain=v1 | sha256sum
```

The local and VM hashes must match. Never synchronize `.git`, `node_modules`, `dist`, or prior evidence into the VM worktree.

## Gate entry point

Run all commands from the repository root on the VM:

```bash
export PATH="$HOME/.local/bin:$PATH"
./script/ci-linux.sh <mode>
```

Available modes:

| Mode      | Checks                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `quick`   | Environment capture, static checks, frozen install, audit, and focused hardening tests                       |
| `full`    | `quick` plus workspace typecheck, canonical lint, broad tests, generated-client check, and production builds |
| `package` | `full` plus the production desktop build and deb/RPM packaging                                               |
| `all`     | `package` plus unpacked-app runtime and visual checks when the host permits Chromium user namespaces         |

The default evidence directory is `~/qa/runs/linux-ci-<run-id>`. Override locations only when needed:

```bash
CI_RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)-manual" \
CI_ARTIFACT_DIR="$HOME/qa/runs/linux-ci-manual" \
CI_TMPDIR="/var/tmp/opencode-classic-ci-manual" \
./script/ci-linux.sh full
```

The script records the Git status before and after execution and fails if the gate mutates the candidate tree.

## What the full gate exercises

The full gate runs:

- `git diff --check`.
- Actionlint and error-level ShellCheck for the release and publication workflows.
- Bash syntax and error-level ShellCheck for the installer and Linux QA scripts.
- `bun install --frozen-lockfile`.
- `bun audit --audit-level=high`.
- Focused desktop identity, renderer security, sidecar isolation, store-name, HTML, and installer tests.
- Serial workspace typechecking.
- The canonical repository lint command.
- Test scripts for app, client, codemode, core, Effect SQLite, HTTP tooling, LLM, CLI, SDKs, session UI, TUI, and UI packages.
- The complete desktop Bun test suite.
- HttpApi coverage, authentication, and all Effect-backed scenarios with missing and skipped routes treated as failures.
- Generated client verification.
- Production builds for the app, CLI, console, stats, web documentation, and Storybook.

The HttpApi Effect exerciser has a 30-minute outer watchdog. Individual scenarios have shorter timeouts. Worktree scenarios wait for the published `worktree.ready` event before teardown; do not replace that synchronization with fixed sleeps.

## Package gate

Run the package gate for the final candidate:

```bash
./script/ci-linux.sh package
```

Expected artifacts are:

```text
packages/desktop/dist/opencode-classic-desktop-linux-amd64.deb
packages/desktop/dist/opencode-classic-desktop-linux-x86_64.rpm
packages/desktop/dist/latest-linux.yml
packages/desktop/dist/linux-unpacked/
```

The package stage rejects AppImage output, verifies updater metadata and provider identity, inspects deb and RPM metadata, and writes `linux-packages.sha256`.

Verify the retained hashes before installation:

```bash
sha256sum -c "$HOME/qa/runs/<package-run>/linux-packages.sha256"
```

## Installed-deb runtime gate

Ubuntu 24.04 can restrict unprivileged user namespaces through AppArmor. An unpacked Electron tree has a non-setuid `chrome-sandbox` and may correctly refuse to start. Do not disable the sandbox.

Install the exact deb produced by the successful package gate:

```bash
sudo apt-get install -y \
  ./packages/desktop/dist/opencode-classic-desktop-linux-amd64.deb
```

Confirm the installed launcher and desktop registration:

```bash
readlink -f /usr/bin/io.github.logiclyra.opencodeclassic
desktop-file-validate \
  /usr/share/applications/io.github.logiclyra.opencodeclassic.desktop
xdg-mime query default x-scheme-handler/opencode-classic
dpkg -V opencode-classic
```

Run the isolated runtime and visual harness:

```bash
run_id=$(date -u +%Y%m%dT%H%M%SZ)
evidence="$HOME/qa/runs/linux-runtime-installed-$run_id"
runtime="/var/tmp/opencode-classic-runtime-$run_id"
install -d -m 0700 "$evidence"

CI_ARTIFACT_DIR="$evidence" \
CI_RUNTIME_DIR="$runtime" \
CI_RUNTIME_EXECUTABLE=/usr/bin/io.github.logiclyra.opencodeclassic \
./script/ci-linux-runtime.sh
```

The runtime harness uses a private D-Bus session, Xvfb, Openbox, and loopback-only CDP. It verifies:

- The packaged application starts without `--no-sandbox`.
- The renderer uses the trusted `oc://renderer` origin.
- The window title is exactly `OpenCode Classic`.
- The sidecar initializes on loopback and supplies authentication credentials.
- A second launch forwards an `opencode-classic://` deep link to the existing instance.
- Settings open through the normal keyboard command.
- The Settings footer contains the exact production identity `OpenCode Classic`, not Dev or Beta.
- No renderer page errors occur.
- A screenshot and JSON report are produced.
- Sidecar config, data, cache, state, and temp roots exist beneath the Classic desktop user-data directory.
- Legacy global `opencode` XDG directories are not created.
- The sidecar exits cleanly with the application.
- No application process or CDP listener remains after shutdown.

The harness executes Electron state in `/var/tmp` and copies the completed runtime directory into retained evidence. This avoids path-sensitive AppArmor and shell-launch behavior while keeping evidence under `~/qa/runs`.

Verify the visual evidence:

```bash
cd "$evidence/runtime"
sha256sum -c visual.sha256
```

Review all of the following before approval:

```text
visual.png
visual-report.json
app.stdout.log
app.stderr.log
deep-link.log
residual-processes.txt
```

Before the first published release, the updater may log `No published versions on GitHub`. That is expected only when no stable release exists. It must not hide renderer errors or prevent startup.

## RPM validation

The Ubuntu gate validates the RPM archive and metadata with an isolated RPM database. It does not prove installation behavior on an RPM-family distribution.

Before publishing RPM as supported, repeat the installed-package runtime gate on a current Fedora-family VM. Use the package manager to install the generated RPM and point `CI_RUNTIME_EXECUTABLE` at the installed launcher.

## Evidence review

Every successful CI evidence directory should contain:

```text
summary.txt
environment.log
static.log
dependencies.log
focused.log
typecheck.log
lint.log
broad-tests.log
builds.log
git-status-before.txt
git-status-after.txt
evidence.sha256
```

Package runs also include desktop build logs, package logs, package hashes, deb fields, and RPM information. A successful `summary.txt` ends with `result=PASS` and has no later failure record.

Record the following in the merge or release handoff:

- Candidate commit SHA.
- Gate mode and evidence path.
- Bun and Node versions.
- Lockfile SHA-256.
- Deb, RPM, and updater metadata SHA-256 values.
- Runtime evidence path and screenshot SHA-256.
- Any expected warnings.
- Explicitly untested platforms or package managers.

## Troubleshooting

### Root lint is killed

Confirm at least 16 GiB RAM plus swap. Do not substitute package-level lint for the canonical root lint.

### Tests behave differently under the gate

Confirm `TMPDIR` is under `/var/tmp`, not beneath `$HOME` or the checkout. Inspect disk and inode usage:

```bash
df -h /var/tmp
df -i /var/tmp
```

### Electron reports an invalid SUID sandbox

You are probably running `dist/linux-unpacked` on an Ubuntu host that restricts unprivileged user namespaces. Install the deb and run with `CI_RUNTIME_EXECUTABLE`. Never add `--no-sandbox` to the release gate.

### Xvfb or CDP cannot start

Check for stale display sockets, application processes, and listeners:

```bash
test ! -e /tmp/.X11-unix/X93
pgrep -af io.github.logiclyra.opencodeclassic || true
ss -lntp | grep -E '127\.0\.0\.1:9333' || true
```

Do not delete another active run. Choose a different `CI_DISPLAY` if the display is intentionally occupied.

### A worktree scenario stalls during teardown

Confirm the route exerciser still waits for `worktree.ready` before removal and that no stale Git worktree metadata remains:

```bash
git worktree list --porcelain
git worktree prune --dry-run
```

### Astro reports Node compatibility warnings

Warnings about Node imports in the Cloudflare SSR build are currently non-fatal if the production build completes. Review them after dependency upgrades; do not silently convert build errors into warnings.

## Cleanup

Preserve successful evidence, then remove only state created by the QA run:

```bash
sudo apt-get purge -y opencode-classic
rm -rf -- "/var/tmp/opencode-classic-ci-<run-id>"
rm -rf -- "/var/tmp/opencode-classic-runtime-<run-id>"
git worktree prune
```

Verify cleanup:

```bash
pgrep -af io.github.logiclyra.opencodeclassic || true
ss -lntp | grep -E '127\.0\.0\.1:9333' || true
git status --short
```

Do not use broad cleanup globs on a shared host. Never remove a worktree or evidence directory that belongs to another run.

## Release controls outside the VM

VM QA is necessary but not sufficient for publication. Before release:

- Protect the `release-draft` and `classic-release` GitHub environments with required reviewers.
- Provision and document the external signing identity and key-handling policy.
- Run the hosted draft workflow against the approved immutable commit SHA.
- Review checksums and GitHub build attestations before approving publication.
- Publish only through the protected publication workflow.
- Verify the first published updater check against the real release feed.

Do not publish from the VM or from an unreviewed local worktree.
