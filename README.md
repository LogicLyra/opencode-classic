<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic is an unofficial Linux-focused fork that tracks upstream, defaults to the classic desktop layout, and keeps the redesigned layout available in Settings. Its releases and updater are maintained independently at [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Translated READMEs are inherited from upstream and may contain upstream installation links.

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Bringing chats from OpenCode

OpenCode Classic Desktop uses a separate database for its built-in server.
On first launch, or under **Settings > Chat import**, choose **Check default
OpenCode database** or select a `.db` file. Close OpenCode first, review the
source, destination and counts, then choose **Import eligible chats**.

- The default source is `$XDG_DATA_HOME/opencode/opencode.db`, normally
  `~/.local/share/opencode/opencode.db`. Choose a file for custom paths or
  development-channel databases. The destination is the active built-in
  desktop server's database under the Classic desktop profile's `sidecar`
  directory. Remote and experimental background-server connections are not
  supported by this importer.
- The initial importer supports matching SQLite schemas and migration histories.
  It does not migrate source files or import legacy JSON storage. If compatibility
  checks fail, use compatible OpenCode and Classic versions and preview again.
- Completed local chats retain their IDs, titles, timestamps, messages, parts,
  v2 history, todos and original project paths. Existing chat IDs are skipped
  as a whole; re-importing does not update an already imported chat. The source
  is read-only, including its WAL history, and each import commits atomically.
- Chats with queued prompts, unfinished work or explicit workspace placement
  are excluded and counted. Importing never starts a prompt or runs a command.
  Credentials, account state, permission grants, project commands, share
  ownership, external attachments, Git snapshots and desktop drafts are not
  copied. Sign in separately and keep your project folders at their original
  paths. Historical undo snapshots are unavailable; embedded attachment data
  remains in the transcript, while external files must still exist.
- Open the original project folder in Classic to see its imported chats.
  This is a one-time copy, not ongoing synchronization between applications.

The standalone Classic CLI still uses OpenCode's default XDG roots unless you
override them. Its `uninstall` command preserves data, credentials, configuration,
cache and state by default, including with `--force`. Deleting those shared roots
requires `--remove-shared-data`; `--keep-data` and `--keep-config` override that
request for their respective roots. Use `uninstall --dry-run` to review paths.
Upstream's own uninstall may still delete shared CLI data. The fork refuses to
open databases containing unknown migrations; update Classic rather than editing
or deleting a migration journal.

### Installation

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> The `opencode-ai` npm package and existing Homebrew, Scoop, Chocolatey, AUR, and Nix packages distribute upstream OpenCode, not OpenCode Classic.

### Desktop App (BETA)

OpenCode Classic desktop builds support Linux only and are available from the fork's [releases page](https://github.com/LogicLyra/opencode-classic/releases).

| Platform  | Download                                              |
| --------- | ----------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*` (`.deb` or `.rpm`) |

AppImage is intentionally not distributed. Ubuntu 24.04 and newer can force Electron AppImages to disable Chromium sandboxing under the default AppArmor policy; the installed deb and RPM formats retain the sandbox integration expected by the distribution.

Maintainers can reproduce the complete build, package, installed-deb, and visual release gate with the [Linux VM release QA runbook](docs/linux-vm-qa.md).

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$OPENCODE_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if it exists or can be created)
4. `$HOME/.opencode/bin` - Default fallback

```bash
# Examples
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

### Agents

OpenCode includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full-access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://opencode.ai/docs/agents).

### Documentation

For more info on how to configure OpenCode, [**head over to our docs**](https://opencode.ai/docs).

### Contributing

If you're interested in contributing to OpenCode, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on OpenCode

If you are working on a project that's related to OpenCode and is using "opencode" as part of its name, for example "opencode-dashboard" or "opencode-mobile", please add a note to your README to clarify that it is not built by the OpenCode team and is not affiliated with us in any way.

---

**Join our community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
