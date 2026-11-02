# Choose your OpenCode Classic version

Both supported release lines retain the classic layout. The application version
is independent of a connected server's version or a saved layout preference.

| Choice        | Availability                                        | Desktop downloads                                                                                                                                                                                                                                                      |
| ------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Classic 1** | Supported; current stable release **1.19.5**        | [Linux x64 deb](https://github.com/LogicLyra/opencode-classic/releases/download/v1.19.5/opencode-classic-desktop-linux-amd64.deb) · [Linux x64 rpm](https://github.com/LogicLyra/opencode-classic/releases/download/v1.19.5/opencode-classic-desktop-linux-x86_64.rpm) |
| **Classic 2** | **Coming soon — production acceptance in progress** | Installation and migration become available after classic UI, profile recovery, security and native-package acceptance                                                                                                                                                 |

Only one Classic desktop generation is installed at a time: the two lines share
their package and application identity. A separately installed CLI can use a
different major without changing the desktop's update choice.

## Install Classic 1 CLI

The existing entrypoint continues to install Classic 1 deterministically:

```sh
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

It installs to **`$HOME/.opencode/bin`**. `OPENCODE_INSTALL_DIR`, `XDG_BIN_DIR`
and `$HOME/bin` do not select another destination. Do not use `sudo` to turn a
regular-user installation into a root-owned one. `--no-modify-path` leaves shell
startup files unchanged. Environment variables for a piped installation belong
on the `bash` process, or must be exported before the pipeline.

The installer verifies the downloaded archive against that exact release's
`SHA256SUMS`. The initial script download trusts the selected GitHub HTTPS URL;
users who verify the script separately should download the exact-tag installer
and checksum list, verify the `install` entry, then execute the verified file.
Upstream npm, Bun, Homebrew and other package-manager distributions are not
Classic update sources.

## New installation chooser

The source tree includes a new **`install-classic`** chooser for the next reviewed
release. It is not present in the already-published 1.19.5 assets. Use its released,
checksum-covered asset once available; do not substitute an unreviewed raw-branch
script for the public installer.

The chooser's source interface is:

```sh
bash ./install-classic --choose
bash ./install-classic --major 1 --no-modify-path
bash ./install-classic --major 2 --version 2.2.5 --no-modify-path
```

These examples document the reviewed source interface, not current public v2
availability. V2 is refused until an exact released manifest accepts this host's
fresh-install target. A missing v2 release never selects v1 or upstream instead.

- Fresh unattended use defaults to v1. A verified owned reinstall retains its
  installed major. Explicit major/version arguments take precedence over prompting.
- `--choose` requires a controlling terminal. Prompts use `/dev/tty`, never the
  piped script's stdin. Supply `--major` in CI or other non-interactive use.
- Unknown flags, conflicting versions/majors and invalid stable versions fail.
- The chooser requires Bash, curl, jq and `sha256sum` or `shasum`. The line installer
  additionally needs tar on Linux or unzip on its other supported archive targets.
- Installers write a non-secret ownership receipt beside the actual binary,
  verify its embedded version, and serialize replacements with an install lock.
  A stale lock is retained for inspection after interruption; verify that the
  owning installer has stopped before removing that empty lock directory.

## Existing installations, retained profiles and recovery

Removing an executable does not make retained data a fresh installation. The
chooser checks the destination, ownership receipt, PATH shadowing and retained
profile generations before delegating. Cross-major changes go through the
[migration/rollback guide](MIGRATING.md). Existing binaries with uncertain
ownership are not silently adopted as Classic.

Regular application and CLI checks stay on their installed major. The new v1
bridge adds a separate Classic 2 review/preparation path, including later/stay
choices. Until profile preflight and final quiesced capture are integrated, its
preparation control is disabled even if a remote manifest claims readiness.

Recovery preserves the original v1 profile. Rolling back uses that profile, not
an in-place v2 database downgrade. Work created in v2 is retained separately and
is not automatically copied back. Default uninstall should preserve recovery
data; consult the installed version's `uninstall --help` and dry run before cleanup.

## Supported targets and system requirements

Classic desktop distribution is Linux x64 deb/rpm; AppImage is not distributed.
The Linux package gate runs on Ubuntu 24.04. A passing package or baseline CLI
build does not establish interactive Electron acceptance on every CPU/distribution.
The first v2 release will list its evidence-backed native targets and system
requirements in its release notes. Unaccepted targets remain unavailable.

CLI archives include platform/architecture/libc variants. The chooser selects a
compatible baseline x64 variant and pins that same variant through delegation;
an installer refuses a forced archive incompatible with the actual host. Each
advertised v2 fresh or migration target requires its own accepted manifest entry.
