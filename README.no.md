<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">AI-kodeagent med åpen kildekode.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic er en uoffisiell Linux-fokusert fork som følger upstream; den bruker det klassiske skrivebordsoppsettet som standard, og det redesignede oppsettet forblir tilgjengelig i innstillingene. Utgivelser og oppdateringsprogrammet vedlikeholdes uavhengig i [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Forkens egne seksjoner og installasjonslenker i hver oversatt README holdes synkronisert med engelsk; dypere innhold arves fra upstream og kan henge etter.


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

### Ta med oppsettet ditt fra OpenCode

OpenCode Classic Desktop bruker en separat profil for den innebygde
serveren. **Innstillinger > Chat-import** og dialogen ved første oppstart
tilbyr **Kun chatter** og **Alt (fullt oppsett)**. Følgende
fletteatferd gjelder for **Kun chatter**:
Ved første oppstart, eller under **Innstillinger > Chat-import**, velg
**Kontroller standard-OpenCode-databasen**, eller velg en `.db`-fil. Lukk
OpenCode først, se gjennom kilde, mål og antall, og velg deretter
**Importer kvalifiserte chatter**.

- Standardkilden er `$XDG_DATA_HOME/opencode/opencode.db`, normalt
  `~/.local/share/opencode/opencode.db`. Velg en fil for egendefinerte
  stier eller utviklingskanaldatabaser. Målet er den aktive innebygde
  skrivebordsserverens database under Classic-skrivebordsprofilens
  `sidecar`-mappe. Importverktøyet støtter ikke fjerneforbindelser
  eller eksperimentelle bakgrunnsserverforbindelser.
- Det innledende importverktøyet støtter samsvarende SQLite-skjemaer og
  migreringshistorikker. Det migrerer ikke kildefiler og importerer ikke
  eldre JSON-lagring. Hvis kompatibilitetskontrollene feiler, bruk
  kompatible OpenCode- og Classic-versjoner og forhåndsvis igjen.
- Fullførte lokale chatter beholder ID-ene, titlene, tidsstemplene,
  meldingene, delene, v2-historikken, gjøremålene og de opprinnelige
  prosjektstiene. Eksisterende chatter-ID-er hoppes over som en helhet;
  reimport oppdaterer ikke en allerede importert chatter. Kilden er
  skrivebeskyttet, inkludert WAL-historikken, og hver import commit'eres
  atomært.
- Chatter med prompter i kø, uferdig arbeid eller eksplisitt
  arbeidsområdeplassering utelates og telles. Import starter aldri en
  prompt og kjører aldri en kommando. Pådloggingsopplysninger,
  kontotilstand, tildelte tillatelser, prosjektkommandoer,
  delingseierskap, eksterne vedlegg, Git-øyeblikksbilder og
  skrivebordskladder kopieres ikke. Logg inn separat og behold
  prosjektmappene dine på de opprinnelige stiene. Historiske
  angre-øyeblikksbilder er utilgjengelige; innebygde vedleggsdata blir
  værende i transkripsjonen, mens eksterne filer fortsatt må eksistere.
- Åpne den opprinnelige prosjektmappen i Classic for å se de
  importerte chatterne. Dette er en engangskopi, ikke løpende
  synkronisering mellom applikasjoner.

#### Alt (fullt oppsett)

Lukk OpenCode og stopp andre skrivende prosesser først. Velg
**Forhåndsvis standardoppsettet**, eller **Velg oppsettmapper**, og merk
OpenCodes **data**-, **konfigurasjons**- og **tilstandsmapper**. De ligger
normalt i `~/.local/share/opencode`, `~/.config/opencode` og
`~/.local/state/opencode`; XDG-overstyringer respekteres. Se gjennom
antallene, bekreft at du stoler på oppsettet, bekreft i den native
dialogen, og start Classic på nytt for å aktivere den klargjorte
profilen.

- Krever en tom innebygget Linux-profil i Classic. Eksisterende chatter,
  tilbydere, egendefinerte innstillinger, kontoer og registrerte
  prosjekter overskrives aldri. Genererte standardkonfigurasjons-/
  pluginfiler gjenkjennes som bootstrap-tilstand.
- Kopierer alle 19 applikasjonsdatabasetabellene, tilbydernes
  `auth.json`, skykontoer, integrasjonspåloggingsopplysninger,
  tillatelser, delingsmetadata, konfigurasjonsfiler (inkludert JSONC),
  agenter, ferdigheter, plugins, tilstand, planer, verktøyutdata,
  arbeidsområdefiler og øyeblikksbilder. Ventende prompter blir værende
  i kø; importen utfører dem ikke.
- Eksterne prosjektstier forblir uendret på samme maskin. Interne stier,
  tillatelsesmønstre og øyeblikksbildenøkler remappes. Koblede
  arbeidstrær mottar privat Git-metadata, og alternates for
  øyeblikksbildeobjekter materialiseres, så kopiene ikke avhenger av de
  opprinnelige objektlagrene.
- SQLite leser en privat kopi av kilde-DN/WAL. Kilde-DN, WAL og
  shared-memory-filer etterlates uendret. Klargjøring bruker private
  tillatelser og en holdbar eierskapsjournal. Aktivering skjer før den
  innebygde serveren starter, og gjenoppretter avbrutte
  mappenavnendringer. Den opprinnelige tomme/bootstrap-profilen beholdes
  under `.profile-import-retained-<operation-id>` i Classics
  skrivebordsprofil for inspeksjon; den slettes ikke automatisk.
- Påloggingsopplysningene forblir beskyttede lokale filer. Fullt oppsett
  bevarer også kjørbar atferd: kontooppdatering, avhengighetsinstallasjon,
  plugins, MCP-tilkoblinger, prosjektkommandoer, Git-hooks/hjelpere og
  tildelte tillatelser kan tre i kraft under normal bruk etter
  aktivering. Importer bare et oppsett du stoler på. Rotasjon av
  OAuth-tokens kan kreve ny pålogging når begge applikasjonene brukes.
- Logger, cacher og prosesslåser genereres på nytt. Systemprogrammer,
  shell-miljøvariabler, upstreams
  skrivebordsvindu-/sidefeltpreferanser og skrivebordskladder kopieres
  ikke. Eksterne prosjektfiler deles allerede på de opprinnelige stiene.
  Åpne den opprinnelige prosjektmappen for å få tilgang til chatterne.
- Krever samsvarende SQLite-migreringshistorikk og -skjema. Fullt
  oppsett leser for tiden `opencode.db`; miljøleverte database-/
  konfigurasjons-/autentiseringsoverstyringer må fjernes før bruk.
  Eldre rene JSON-lagre, sykliske eller ikke-støttede
  Git-objektreferanser, enhetsnoder og profiler over 50 GiB eller
  500 000 lagerføringer avvises med en bestemt begrunnelse. Eksterne
  symbolske lenker kopieres hele veien (materialiseres); hengende
  lenker, sockets og fifos hoppes over og telles i sammendraget.
  Konfigurasjonsfiler opp til 64 MB støttes. Klargjøring krever
  ytterligere diskplass.
- Lukk OpenCode før import. Forhåndsvisningen advarer når en kjørende
  instans oppdages, øyeblikksbildkopier prøves automatisk på nytt, og en
  kilde som skrives kontinuerlig, rapporterer en dedikert opptatt-feil
  som ber deg lukke den.

Den frittstående Classic-CLI-en bruker fortsatt OpenCodes
standard-XDG-roter med mindre du overstyrer dem. `uninstall`-kommandoen
bevarer data, påloggingsopplysninger, konfigurasjon, cache og tilstand
som standard, også med `--force`. Sletting av disse delte rote krever
`--remove-shared-data`; `--keep-data` og `--keep-config` overstyrer det
forespørslene for sine respektive roter. Bruk `uninstall --dry-run` for
å se gjennom stier. Upstreams egen avinstallering kan fortsatt slette
delte CLI-data. Forken nekter å åpne databaser som inneholder ukjente
migreringer; oppdater Classic i stedet for å redigere eller slette en
migreringsjournal.

### Installasjon

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> npm-pakken `opencode-ai` og de eksisterende Homebrew-, Scoop-, Chocolatey-, AUR- og Nix-pakkene distribuerer upstream-OpenCode, ikke OpenCode Classic.

### Skrivebordsapp (BETA)

OpenCode Classic-skrivebordsbygg støtter kun Linux og er tilgjengelige fra [forkens utgivelsesside](https://github.com/LogicLyra/opencode-classic/releases).

| Plattform  | Nedlasting                                            |
| ---------- | ----------------------------------------------------- |
| Linux x64  | `opencode-classic-desktop-linux-*` (`.deb` eller `.rpm`) |

AppImage distribueres bevisst ikke. Ubuntu 24.04 og nyere kan tvinge Electron-AppImages til å deaktivere Chromium-sandboxing under standard AppArmor-policyen; de installerte deb- og RPM-formatene beholder sandbox-integrasjonen distribusjonen forventer.

Vedlikeholderne kan reprodusere den komplette bygge-, pakke-, installert-deb- og visuelle utgivelsesporten med [Linux VM-utgivelses-QA-runbooken](docs/linux-vm-qa.md).

#### Installasjonsmappe

Installasjonsskriptet respekterer følgende prioritetsrekkefølge for installasjonsstien:

1. `$OPENCODE_INSTALL_DIR` - Egendefinert installasjonsmappe
2. `$XDG_BIN_DIR` - Sti i samsvar med XDG Base Directory Specification
3. `$HOME/bin` - Standard mappe for brukerbinærfiler (hvis den finnes eller kan opprettes)
4. `$HOME/.opencode/bin` - Standard fallback

```bash
# Eksempler
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode har to innebygde agents du kan bytte mellom med `Tab`-tasten.

- **build** - Standard, agent med full tilgang for utviklingsarbeid
- **plan** - Skrivebeskyttet agent for analyse og kodeutforsking
  - Nekter filendringer som standard
  - Spør om tillatelse før bash-kommandoer
  - Ideell for å utforske ukjente kodebaser eller planlegge endringer

Det finnes også en **general**-subagent for komplekse søk og flertrinnsoppgaver.
Den brukes internt og kan kalles via `@general` i meldinger.

Les mer om [agents](https://opencode.ai/docs/agents).

### Dokumentasjon

For mer info om hvordan du konfigurerer OpenCode, [**se dokumentasjonen**](https://opencode.ai/docs).

### Bidra

Hvis du vil bidra til OpenCode, les [contributing docs](./CONTRIBUTING.md) før du sender en pull request.

### Bygge på OpenCode

Hvis du jobber med et prosjekt som er relatert til OpenCode og bruker "opencode" som en del av navnet; for eksempel "opencode-dashboard" eller "opencode-mobile", legg inn en merknad i README som presiserer at det ikke er bygget av OpenCode-teamet og ikke er tilknyttet oss på noen måte.

---

**Bli med i fellesskapet** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
