<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">Den open source AI-kodeagent.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic er en uofficiel Linux-fokuseret fork, der følger upstream; den bruger det klassiske skrivebordslayout som standard, og det redesignede layout forbliver tilgængeligt i indstillingerne. Dens udgivelser og opdateringsprogram vedligeholdes uafhængigt i [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Dybere indhold arves fra upstream og kan halte bagefter.


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

### Bring din opsætning fra OpenCode

OpenCode Classic Desktop bruger en separat profil til sin indbyggede
server. **Indstillinger > Chat-import** og dialogboksen ved første opstart
tilbyder **Kun chats** og **Alting (fuld opsætning)**. Følgende
fletadfærd gælder for **Kun chats**:
Ved første opstart, eller under **Indstillinger > Chat-import**, vælges
**Kontrollér standard-OpenCode-databasen** eller en `.db`-fil. Luk
OpenCode først, gennemse kilde, destination og antal, og vælg derefter
**Importér kvalificerede chats**.

- Standardkilden er `$XDG_DATA_HOME/opencode/opencode.db`, normalt
  `~/.local/share/opencode/opencode.db`. Vælg en fil til brugerdefinerede
  stier eller udviklingskanal-databaser. Destinationen er den aktive
  indbyggede skrivebordsservers database under Classic-skrivebordsprofilens
  `sidecar`-mappe. Importværktøjet understøtter ikke fjernforbindelser
  eller eksperimentelle baggrundsserverforbindelser.
- Det indledende importværktøj understøtter matchende SQLite-skemaer og
  migrationshistorikker. Det migrerer ikke kildefiler og importerer ikke
  ældre JSON-lager. Hvis kompatibilitetstjekket fejler, skal du bruge
  kompatible OpenCode- og Classic-versioner og forhåndsvise igen.
- Fuldførte lokale chats bevarer deres id'er, titler, tidsstempler,
  beskeder, dele, v2-historik, gøremål og oprindelige projektstier.
  Eksisterende chat-id'er springes over som helhed; genimport opdaterer
  ikke en allerede importeret chat. Kilden er skrivebeskyttet, herunder
  dens WAL-historik, og hver import commit'eres atomært.
- Chats med prompter i kø, uafsluttet arbejde eller eksplicit
  arbejdsområdeplacering udelades og tælles. Import starter aldrig en
  prompt og kører aldrig en kommando. Legitimationsoplysninger,
  kontotilstand, tildelte rettigheder, projektkommandoer,
  deleejerskab, eksterne vedhæftninger, Git-snapshots og
  skrivebordskladder kopieres ikke. Log ind separat og behold dine
  projektmapper på deres oprindelige stier. Historiske fortryd-
  snapshots er utilgængelige; indlejrede vedhæftningsdata forbliver i
  transskriptionen, mens eksterne filer stadig skal eksistere.
- Åbn den oprindelige projektmappe i Classic for at se dens importerede
  chats. Dette er en engangskopi, ikke løbende synkronisering mellem
  applikationer.

#### Alting (fuld opsætning)

Luk OpenCode og stop andre skrivende processer først. Vælg **Forhåndsvis
standardopsætning**, eller **Vælg opsætningsmapper**, og markér OpenCodes
**data**-, **konfigurations**- og **tilstandsmappe**. De ligger normalt i
`~/.local/share/opencode`, `~/.config/opencode` og
`~/.local/state/opencode`; XDG-tilsidesættelser respekteres. Gennemgå
antallene, erkend at du stoler på opsætningen, bekræft i den native
dialogboks og genstart Classic for at aktivere den klargjorte profil.

- Kræver en tom indbygget Linux-profil i Classic. Eksisterende chats,
  udbydere, brugerdefinerede indstillinger, konti og registrerede
  projekter overskrives aldrig. Genererede standardkonfigurations-/
  plugin-filer genkendes som bootstrap-tilstand.
- Kopierer alle 19 applikationsdatabasetabeller, udbydernes `auth.json`,
  skykonti, integrationslegitimationsoplysninger, rettigheder,
  delemetadata, konfigurationsfiler (herunder JSONC), agenter,
  kompetencer, plugins, tilstand, planer, tool-output,
  arbejdsområdefiler og snapshots. Ventende prompter forbliver i kø;
  import udfører dem ikke.
- Eksterne projektstier forbliver uændrede på samme maskine. Interne
  stier, rettighedsmønstre og snapshot-nøgler remappes. Koblede
  worktrees modtager privat Git-metadata, og snapshot-objekt-
  alternates materialiseres, så kopierne ikke afhænger af de oprindelige
  objektlagre.
- SQLite læser en privat kopi af kilde-DN/WAL. Kilde-DN, WAL og
  shared-memory-filer efterlades uændrede. Klargøring bruger private
  rettigheder og en holdbar ejerskabsjournal. Aktivering sker, før den
  indbyggede server starter, og gendanner afbrudte mappenavneændringer.
  Den oprindelige tomme/bootstrap-profil bevares under
  `.profile-import-retained-<operation-id>` i Classics
  skrivebordsprofil til inspektion; den slettes ikke automatisk.
- Legitimationsoplysninger forbliver beskyttede lokale filer. Fuld
  opsætning bevarer også eksekverbart adfærd: kontoopdatering,
  afhængighedsinstallation, plugins, MCP-forbindelser,
  projektkommandoer, Git-hooks/hjælpere og tildelte rettigheder kan
  træde i kraft under normal brug efter aktivering. Importér kun en
  opsætning, du stoler på. Rotation af OAuth-tokens kan kræve ny
  login, når begge applikationer bruges.
- Logge, cacher og proceslåse gendannes. Systemprogrammer,
  shell-miljøvariabler, upstream-skrivebordsvindues-/sidebjælke-
  præferencer og skrivebordskladder kopieres ikke. Eksterne
  projektfiler deles allerede på deres oprindelige stier. Åbn den
  oprindelige projektmappe for at tilgå dens chats.
- Kræver matchende SQLite-migrationshistorik og -skema. Fuld opsætning
  læser i øjeblikket `opencode.db`; miljøleverede database-/
  konfigurations-/autentificeringstilsidesættelser skal fjernes før
  brug. Ældre rene JSON-lagre, cykliske eller ikke-understøttede
  Git-objektreferencer, enhedsknuder samt profiler over 50 GiB eller
  500.000 lagropføringer afvises med en bestemt begrundelse. Eksterne
  symbolske links kopieres hele vejen (materialiseres); hængende
  links, sockets og fifos springes over og tælles i opsummeringen.
  Konfigurationsfiler op til 64 MB understøttes. Klargøring kræver
  yderligere diskplads.
- Luk OpenCode før import. Forhåndsvisningen advarer, når en kørende
  instans opdages, snapshot-kopier prøves automatisk igen, og en kilde
  der skrives til løbende, rapporterer en dedikeret optaget-fejl, der
  beder dig lukke den.

Den selvstændige Classic-CLI bruger stadig OpenCodes standard-XDG-roots,
medmindre du tilsidesætter dem. Dens `uninstall`-kommando bevarer data,
legitimationsoplysninger, konfiguration, cache og tilstand som standard,
også med `--force`. Sletning af disse delte roots kræver
`--remove-shared-data`; `--keep-data` og `--keep-config` tilsidesætter
denne anmodning for deres respektive roots. Brug `uninstall --dry-run`
til at gennemse stier. Upstreams egen afinstallation kan stadig slette
delte CLI-data. Foken nægter at åbne databaser med ukendte migrationer;
opdatér Classic frem for at redigere eller slette en migrationsjournal.

### Installation

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> npm-pakken `opencode-ai` og de eksisterende Homebrew-, Scoop-, Chocolatey-, AUR- og Nix-pakker distribuerer upstream-OpenCode, ikke OpenCode Classic.

### Skrivebordsapp (BETA)

OpenCode Classic-skrivebordsbuilds understøtter kun Linux og findes på [forkens udgivelsesside](https://github.com/LogicLyra/opencode-classic/releases).

| Platform  | Download                                              |
| --------- | ----------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*` (`.deb` eller `.rpm`) |

AppImage distribueres bevidst ikke. Ubuntu 24.04 og nyere kan tvinge Electron-AppImages til at deaktivere Chromium-sandboxing under standard-AppArmor-politikken; de installerede deb- og RPM-formater bevarer den sandbox-integration, distributionen forventer.

Vedligeholderne kan reproducere den komplette build-, pakke-, installeret-deb- og visuelle udgivelsesgate med [Linux VM-udgivelses-QA-runbooken](docs/linux-vm-qa.md).

#### Installationsmappe

Installationsscriptet respekterer følgende prioritetsrækkefølge for installationsstien:

1. `$OPENCODE_INSTALL_DIR` - Brugerdefineret installationsmappe
2. `$XDG_BIN_DIR` - Sti i overensstemmelse med XDG Base Directory Specification
3. `$HOME/bin` - Standardmappe til brugerbinærfiler (hvis den findes eller kan oprettes)
4. `$HOME/.opencode/bin` - Standard-fallback

```bash
# Eksempler
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode har to indbyggede agents, som du kan skifte mellem med `Tab`-tasten.

- **build** - Standard, agent med fuld adgang til udviklingsarbejde
- **plan** - Skrivebeskyttet agent til analyse og kodeudforskning
  - Afviser filredigering som standard
  - Spørger om tilladelse før bash-kommandoer
  - Ideel til at udforske ukendte kodebaser eller planlægge ændringer

Derudover findes der en **general**-subagent til komplekse søgninger og flertrinsopgaver.
Den bruges internt og kan kaldes via `@general` i beskeder.

Læs mere om [agents](https://opencode.ai/docs/agents).

### Dokumentation

For mere info om konfiguration af OpenCode, [**se vores docs**](https://opencode.ai/docs).

### Bidrag

Hvis du vil bidrage til OpenCode, så læs vores [contributing docs](./CONTRIBUTING.md) før du sender en pull request.

### Bygget på OpenCode

Hvis du arbejder på et projekt der er relateret til OpenCode og bruger "opencode" som en del af navnet; f.eks. "opencode-dashboard" eller "opencode-mobile", så tilføj en note i din README, der tydeliggør at projektet ikke er bygget af OpenCode-teamet og ikke er tilknyttet os på nogen måde.

---

**Bliv en del af vores community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
