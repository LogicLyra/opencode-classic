<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">Der Open-Source KI-Coding-Agent.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic ist ein inoffizieller, auf Linux fokussierter Fork, der dem Upstream folgt, standardmäßig das klassische Desktop-Layout verwendet und das neu gestaltete Layout in den Einstellungen verfügbar hält. Releases und Updater werden unabhängig unter [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic) gepflegt. Die fork-spezifischen Abschnitte und Installationslinks jedes übersetzten READMEs werden mit dem Englischen synchron gehalten; tieferer Inhalt wird vom Upstream geerbt und kann nachhängen.


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

### Dein Setup aus OpenCode mitbringen

OpenCode Classic Desktop verwendet ein separates Profil für den eingebauten Server.
**Einstellungen > Chat-Import** und der Dialog beim ersten Start bieten **Nur Chats**
und **Alles (vollständiges Setup)** an. Für **Nur Chats** gilt folgendes
Merge-Verhalten:
Wähle beim ersten Start oder unter **Einstellungen > Chat-Import** die Option
**Standard-OpenCode-Datenbank prüfen** oder wähle eine `.db`-Datei. Schließe zuerst
OpenCode, prüfe Quelle, Ziel und Zahlen und wähle dann **Geeignete Chats importieren**.

- Die Standardquelle ist `$XDG_DATA_HOME/opencode/opencode.db`, normalerweise
  `~/.local/share/opencode/opencode.db`. Wähle eine Datei für eigene Pfade oder
  Datenbanken des Entwicklungskanals. Das Ziel ist die Datenbank des aktiven
  eingebauten Desktop-Servers im `sidecar`-Verzeichnis des Classic-Desktop-Profils.
  Remote- und experimentelle Hintergrundserver-Verbindungen werden von diesem
  Importeur nicht unterstützt.
- Der Importeur unterstützt übereinstimmende SQLite-Schemata und Migrationsverläufe.
  Er migriert keine Quelldateien und importiert keinen Legacy-JSON-Speicher. Wenn die
  Kompatibilitätsprüfungen fehlschlagen, verwende kompatible OpenCode- und
  Classic-Versionen und führe die Vorschau erneut aus.
- Abgeschlossene lokale Chats behalten ihre IDs, Titel, Zeitstempel, Nachrichten,
  Teile, die v2-Historie, Todos und die ursprünglichen Projektpfade. Bereits
  vorhandene Chat-IDs werden als Ganzes übersprungen; ein erneuter Import
  aktualisiert einen bereits importierten Chat nicht. Die Quelle ist schreibgeschützt,
  einschließlich ihrer WAL-Historie, und jeder Import wird atomar committet.
- Chats mit wartenden Prompts, unfertigen Arbeiten oder expliziter
  Arbeitsbereich-Zuordnung werden ausgeschlossen und gezählt. Der Import startet
  nie einen Prompt und führt nie einen Befehl aus. Zugangsdaten, Kontostatus,
  Berechtigungen, Projektbefehle, Share-Eigentümerschaft, externe Anhänge,
  Git-Snapshots und Desktop-Entwürfe werden nicht kopiert. Melde dich separat an
  und lass deine Projektordner an ihren ursprünglichen Pfaden. Historische
  Undo-Snapshots sind nicht verfügbar; eingebettete Anhangsdaten bleiben im
  Verlauf, externe Dateien müssen weiterhin existieren.
- Öffne den ursprünglichen Projektordner in Classic, um dessen importierte Chats
  zu sehen. Dies ist eine einmalige Kopie, keine laufende Synchronisierung
  zwischen den Anwendungen.

#### Alles (vollständiges Setup)

Schließe zuerst OpenCode und stoppe andere Schreibzugriffe. Wähle **Standard-Setup
in der Vorschau prüfen** oder **Setup-Ordner auswählen** und wähle die OpenCode-Ordner
**Daten**, **Konfiguration** und **Status**. Diese liegen normalerweise unter
`~/.local/share/opencode`, `~/.config/opencode` und `~/.local/state/opencode`;
XDG-Overrides werden berücksichtigt. Prüfe die Zahlen, bestätige, dass du dem
Setup vertraust, bestätige im nativen Dialog und starte Classic neu, um das
vorbereitete Profil zu aktivieren.

- Erfordert ein leeres eingebautes Classic-Linux-Profil. Bestehende Chats, Anbieter,
  eigene Einstellungen, Konten und registrierte Projekte werden nie überschrieben.
  Erzeugte Standard-Konfigurations-/Plugin-Dateien werden als Bootstrap-Zustand
  erkannt.
- Kopiert alle 19 Datenbanktabellen der Anwendung, Anbieter-`auth.json`,
  Cloud-Konten, Integrations-Zugangsdaten, Berechtigungen, Share-Metadaten,
  Konfigurationsdateien (einschließlich JSONC), Agents, Skills, Plugins, State,
  Pläne, Tool-Ausgaben, Arbeitsbereich-Dateien und Snapshots. Wartende Prompts
  bleiben in der Warteschlange; der Import führt sie nicht aus.
- Externe Projektpfade bleiben auf demselben Rechner unverändert. Interne Pfade,
  Berechtigungsmuster und Snapshot-Schlüssel werden neu zugeordnet. Verlinkte
  Worktrees erhalten private Git-Metadaten, und Snapshot-Objekt-Alternates werden
  materialisiert, damit die Kopien nicht von den ursprünglichen Objektspeichern
  abhängen.
- SQLite liest eine private Kopie der Quell-DB/des WAL. Quell-DB, WAL und
  Shared-Memory-Dateien bleiben unverändert. Die Bereitstellung nutzt private
  Berechtigungen und ein dauerhaftes Eigentümerschafts-Journal. Die Aktivierung
  erfolgt vor dem Start des eingebauten Servers und stellt unterbrochene
  Verzeichnis-Umbenennungen wieder her. Das ursprüngliche leere/Bootstrap-Profil
  wird unter `.profile-import-retained-<operation-id>` im Desktop-Profil von
  Classic zur Inspektion aufbewahrt; es wird nicht automatisch gelöscht.
- Zugangsdaten bleiben geschützte lokale Dateien. Das vollständige Setup erhält
  auch ausführbares Verhalten: Konto-Aktualisierung, Abhängigkeitsinstallation,
  Plugins, MCP-Verbindungen, Projektbefehle sowie Git-Hooks/Helfer und
  Berechtigungszusagen können nach der Aktivierung im normalen Betrieb wirksam
  werden. Importiere nur ein Setup, dem du vertraust. OAuth-Token-Rotation kann
  eine erneute Anmeldung erfordern, wenn beide Anwendungen genutzt werden.
- Logs, Caches und Prozess-Sperren werden neu generiert. Systemprogramme,
  Shell-Umgebungsvariablen, Upstream-Fenstereinstellungen des Desktops und
  Desktop-Entwürfe werden nicht kopiert. Externe Projektdateien sind bereits an
  ihren ursprünglichen Pfaden geteilt. Öffne den ursprünglichen Projektordner,
  um auf dessen Chats zuzugreifen.
- Erfordert einen übereinstimmenden SQLite-Migrationsverlauf und ein
  übereinstimmendes Schema. Das vollständige Setup liest derzeit `opencode.db`;
  über die Umgebung bereitgestellte Datenbank-/Konfigurations-/Auth-Overrides
  müssen vorher entfernt werden. Reine Legacy-JSON-Speicher, zyklische oder nicht
  unterstützte Git-Objektverweise, Geräteknoten sowie Profile über 50 GiB oder
  500.000 Inventareinträge werden mit konkreter Begründung abgelehnt. Externe
  Symlinks werden durchkopiert (materialisiert); defekte Links, Sockets und Fifos
  werden übersprungen und in der Zusammenfassung gezählt. Konfigurationsdateien
  bis 64 MB werden unterstützt. Für die Bereitstellung ist zusätzlicher
  Speicherplatz erforderlich.
- Schließe OpenCode vor dem Import. Die Vorschau warnt, wenn eine laufende Instanz
  erkannt wird, Snapshot-Kopien wiederholen sich automatisch, und eine dauerhaft
  geschriebene Quelle meldet einen dedizierten Busy-Fehler mit der Aufforderung,
  sie zu schließen.

Die eigenständige Classic-CLI verwendet weiterhin OpenCodes Standard-XDG-Roots,
sofern du sie nicht überschreibst. Ihr `uninstall`-Befehl bewahrt Daten,
Zugangsdaten, Konfiguration, Cache und State standardmäßig, auch mit `--force`.
Das Löschen dieser gemeinsamen Roots erfordert `--remove-shared-data`;
`--keep-data` und `--keep-config` überschreiben diese Anfrage für ihre
jeweiligen Roots. Prüfe Pfade mit `uninstall --dry-run`. Upstreams eigenes
Deinstallationsprogramm kann weiterhin gemeinsame CLI-Daten löschen. Der Fork
verweigert das Öffnen von Datenbanken mit unbekannten Migrationen; aktualisiere
Classic, statt ein Migrations-Journal zu bearbeiten oder zu löschen.

### Installation

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> Das npm-Paket `opencode-ai` und die bestehenden Homebrew-, Scoop-, Chocolatey-, AUR- und Nix-Pakete verteilen das Upstream-OpenCode, nicht OpenCode Classic.

### Desktop-App (BETA)

Die Desktop-Builds von OpenCode Classic unterstützen ausschließlich Linux und sind auf der [Releases-Seite des Forks](https://github.com/LogicLyra/opencode-classic/releases) verfügbar.

| Plattform | Download                                              |
| --------- | ----------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*` (`.deb` oder `.rpm`) |

AppImage wird bewusst nicht verteilt. Ubuntu 24.04 und neuer kann Electron-AppImages unter der Standard-AppArmor-Richtlinie zwingen, das Chromium-Sandboxing zu deaktivieren; die installierten deb- und RPM-Formate bewahren die von der Distribution erwartete Sandbox-Integration.

Maintainer können die vollständige Build-, Paket-, Installations- und visuelle Release-Prüfung mit dem [Linux-VM-Release-QA-Runbook](docs/linux-vm-qa.md) reproduzieren.

#### Installationsverzeichnis

Das Installationsskript beachtet die folgende Prioritätsreihenfolge für den Installationspfad:

1. `$OPENCODE_INSTALL_DIR` - Benutzerdefiniertes Installationsverzeichnis
2. `$XDG_BIN_DIR` - XDG Base Directory Specification-konformer Pfad
3. `$HOME/bin` - Standard-Binärverzeichnis des Nutzers (falls vorhanden oder erstellbar)
4. `$HOME/.opencode/bin` - Standard-Fallback

```bash
# Beispiele
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode enthält zwei eingebaute Agents, zwischen denen du mit der `Tab`-Taste wechseln kannst.

- **build** - Standard-Agent mit vollem Zugriff für Entwicklungsarbeit
- **plan** - Nur-Lese-Agent für Analyse und Code-Exploration
  - Verweigert Datei-Edits standardmäßig
  - Fragt vor dem Ausführen von bash-Befehlen nach
  - Ideal zum Erkunden unbekannter Codebases oder zum Planen von Änderungen

Außerdem ist ein **general**-Subagent für komplexe Suchen und mehrstufige Aufgaben enthalten.
Dieser wird intern genutzt und kann in Nachrichten mit `@general` aufgerufen werden.

Mehr dazu unter [Agents](https://opencode.ai/docs/agents).

### Dokumentation

Mehr Infos zur Konfiguration von OpenCode findest du in unseren [**Docs**](https://opencode.ai/docs).

### Beitragen

Wenn du zu OpenCode beitragen möchtest, lies bitte unsere [Contributing Docs](./CONTRIBUTING.md), bevor du einen Pull Request einreichst.

### Auf OpenCode aufbauen

Wenn du an einem Projekt arbeitest, das mit OpenCode zusammenhängt und "opencode" als Teil seines Namens verwendet (z.B. "opencode-dashboard" oder "opencode-mobile"), füge bitte einen Hinweis in deine README ein, dass es nicht vom OpenCode-Team gebaut wird und nicht in irgendeiner Weise mit uns verbunden ist.

---

**Tritt unserer Community bei** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
