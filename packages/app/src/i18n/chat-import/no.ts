export const dict = {
  "profileImport.mode": "Importmodus",
  "profileImport.chats": "Kun chatter",
  "profileImport.everything": "Alt (fullt oppsett)",
  "profileImport.description":
    "Kopierer ditt kompatible OpenCode-oppsett til en tom Classic-skrivebordsprofil: chatter, påloggingsopplysninger fra leverandører, skykontoer, tillatelser, global konfigurasjon, agenter, skills, plugins, planer, snapshots og arbeidsområdefiler. Kilden endres ikke. Forhåndsvisningen kjører ikke importerte kommandoer og kontakter ingen leverandører.",
  "profileImport.boundaries":
    "Lukk først OpenCode og slutt å redigere filene dens. Prosjektmapper utenfor OpenCode-lagringen blir værende på de opprinnelige stiene. Miljøvariabler, systeminstallerte verktøy og oppstrøms vindusinnstillinger for skrivebordet kopieres ikke. Logger, cacher og prosesslåser genereres på nytt. OAuth-leverandører kan kreve ny innlogging. Egne mapper velges i denne rekkefølgen: data, konfigurasjon og deretter tilstand.",
  "profileImport.detect": "Forhåndsvis standardoppsettet",
  "profileImport.browse": "Velg oppsettmapper",
  "profileImport.busy":
    "Det fullstendige oppsettet valideres eller klargjøres. Hold Classic åpen til det er ferdig.",
  "profileImport.cancelled":
    "Ingen kompatibel kilde ble funnet, eller mappevalget ble avbrutt.",
  "profileImport.staged":
    "Oppsettet er klargjort og verifisert. Start Classic på nytt for å aktivere det før serveren dens starter. Ikke legg til data i Classic før omstart; aktiveringen kontrollerer på nytt at målet er tomt.",
  "profileImport.activated":
    "Det fullstendige oppsettet ble aktivert. Prosjektmappene dine forblir tilgjengelige på de opprinnelige stiene; importerte interne arbeidsområder har uavhengige kopier.",
  "profileImport.data": "Kildedatamappe",
  "profileImport.config": "Kildekonfigurasjonsmappe",
  "profileImport.state": "Kildetilstandsmappe",
  "profileImport.providers": "Lagrede påloggingsopplysninger fra leverandører",
  "profileImport.accounts": "Skykontoer",
  "profileImport.workspaces": "Arbeidsområder",
  "profileImport.files": "Filer og lenker",
  "profileImport.bytes": "Kopistørrelse (bytes)",
  "profileImport.plugins": "Konfigurerte plugins",
  "profileImport.mcp": "MCP-oppføringer",
  "profileImport.commands": "Prosjektkommandoer",
  "profileImport.permissions": "Tillatelsesoppføringer",
  "profileImport.pending": "Ventende prompts",
  "profileImport.git": "Git-checkouts",
  "profileImport.consent":
    "Jeg har lukket OpenCode og stoler på dette fullstendige oppsettet, inkludert påloggingsopplysninger, kontooppdatering, avhengigheter, plugins, MCP-servere, prosjektkommandoer, Git-hooks og eksisterende tillatelser. Disse kan kjøre under normal bruk etter aktivering. Ventende prompts blir værende i kø til de gjenopptas.",
  "profileImport.confirm": "Klargjør fullstendig oppsett",
  "profileImport.restart": "Start på nytt og aktiver oppsettet",
  "profileImport.error.unavailable":
    "Fullstendig import krever den innebygde Linux-skrivebordsserveren og filbasert konfigurasjon. Miljølevert konfigurasjon eller autentiseringsoverstyringer må fjernes før du importerer.",
  "profileImport.error.nonempty":
    "Classic inneholder allerede oppsettsdata. Fullstendig import overskriver den ikke. Bruk Kun chatter til å flette kompatible samtaler, eller start med en tom Classic-profil.",
  "profileImport.error.incompatible":
    "Skjemaet til kildedatabasen samsvarer ikke med denne Classic-versjonen. Fullstendig import krever et kompatibelt SQLite-oppsett; ingen migrering av kilden ble forsøkt.",
  "profileImport.error.invalid":
    "Oppsettet kunne ikke valideres. Sjekk filrettigheter, databaseintegritet og konfigurasjonssyntaks. Den kjørende Classic-profilen er ikke blitt erstattet.",
  "profileImport.error.changed":
    "Kilden endret seg, eller denne forhåndsvisningen er utløpt. Lukk OpenCode og andre skrivende prosesser, og kjør forhåndsvisningen på nytt.",
  "profileImport.error.busy":
    "En annen import, en aktiv fillås eller en ventende aktivering hindrer denne operasjonen. Lukk OpenCode og start Classic på nytt før du prøver igjen.",
  "profileImport.liveWarning":
    "OpenCode ser ut til å kjøre akkurat nå. Databasen dens endres kontinuerlig, så klargjøring kan mislykkes. Lukk OpenCode (alle vinduer) og stopp serverne dens før du bekrefter, for en pålitelig import.",
  "profileImport.detail.count": "Berørte elementer: {{count}}",
  "profileImport.materialized": "Eksterne lenker kopiert inn",
  "profileImport.skipped": "Runtime-filer som er hoppet over",
  "profileImport.error.source-busy":
    "Det skrives kontinuerlig til kilden (en OpenCode-instans kjører sannsynligvis). Lukk OpenCode og serverne dens, og kjør deretter forhåndsvisning og bekreftelse på nytt.",
  "profileImport.error.links":
    "Oppsettet inneholder en lenke som ikke kan kopieres: en symlink-syklus, eller en lenke i Git-metadata der kopier må forbli eksakte.",
  "profileImport.error.git-objects":
    "Git-metadataene i oppsettet bruker et ustøttet oppsett (alternates-oppføringer, worktree-pekere eller objektlagre som ikke kan privatiseres trygt).",
  "profileImport.error.special-files":
    "Oppsettet inneholder enhetsnoder eller andre spesielle filer som ikke kan kopieres trygt.",
  "profileImport.error.limit":
    "Oppsettet overskrider importgrensen (50 GiB eller 500 000 elementer). Fjern store sikkerhetskopifiler eller begrens mappene, og kjør forhåndsvisningen på nytt.",
  "profileImport.error.oversized-file":
    "En konfigurasjons- eller metadatafil overskrider lesegrensen sin (64 MB for konfigurasjoner, 16 MB for Git-metadata). Del den opp eller gjør den mindre, og kjør forhåndsvisningen på nytt.",
  "profileImport.error.unsupported":
    "Dette oppsettet inneholder ustøttede lenker, sykliske Git-objektalternates, spesielle filer eller overskrider importgrensen (50 GiB / 500 000 elementer). Eksterne symlinker må materialiseres før import; kildefilene ble ikke endret.",
  "profileImport.error.space":
    "Det er ikke nok ledig diskplass til å klargjøre dette oppsettet. Frigjør plass og kjør forhåndsvisningen på nytt.",
  "chatImport.tab": "Chatimport",
  "chatImport.title": "Importer chatter fra OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop har en egen chattedatabase. Forhåndsvis og kopier kompatible lokale chatter fra OpenCode uten å endre kilden eller erstatte eksisterende Classic-chatter. Du kan komme tilbake hit fra innstillingene når som helst.",
  "chatImport.scope":
    "Lukk OpenCode før du importerer. Dette kopierer fullførte lokale chatter og historikken deres. Chatter i kø, pågående chatter og arbeidsområde-økter er utelatt. Påloggingsopplysninger, tillatelser, prosjektkommandoer, eksterne filer og angre-snapshots importeres ikke. Logg inn separat og behold prosjektmappene dine på de opprinnelige stiene.",
  "chatImport.localOnly":
    "Velg den innebygde lokale skrivebordsserveren for å importere chatter. Fjern- og bakgrunnsserverforbindelser støttes ikke av denne importøren.",
  "chatImport.detect": "Sjekk standard OpenCode-database",
  "chatImport.browse": "Velg databasefil",
  "chatImport.confirm": "Importer berettigede chatter",
  "chatImport.busy":
    "Sjekker eller importerer chatter. Vent før du lukker appen.",
  "chatImport.noSource":
    "Ingen database ble funnet eller valgt. Velg OpenCode-.db-filen din for å fortsette.",
  "chatImport.complete":
    "Import fullført. Åpne den opprinnelige prosjektmappen for å finne chattene dens. En gjentatt import hopper over chat-id-er som allerede finnes i Classic.",
  "chatImport.source": "Kildedatabase",
  "chatImport.destination": "Classic-database",
  "chatImport.total": "Chatter i kilden",
  "chatImport.eligible": "Klar til import",
  "chatImport.existing": "Finnes allerede",
  "chatImport.excluded": "Utelatt (i kø, pågående eller arbeidsområde)",
  "chatImport.imported": "Importert",
  "chatImport.error.unavailable":
    "Import er bare tilgjengelig for den innebygde Linux-skrivebordsserveren etter at den er ferdig med å starte.",
  "chatImport.error.incompatible":
    "Databasene har forskjellige eller ustøttede skjemaer. Bruk kompatible, oppdaterte OpenCode- og Classic-versjoner, og kjør forhåndsvisningen på nytt. Eldre JSON-lagring støttes ikke; kilden er ikke blitt migrert.",
  "chatImport.error.invalid":
    "Databasen kunne ikke leses eller valideres. Sjekk den valgte filen, rettighetene og tilgjengelig diskplass. En ikke-committet import rulles tilbake; kjør forhåndsvisningen på nytt før du prøver igjen.",
  "chatImport.error.sameFile":
    "Kilde og mål er den samme databasen. Ingen kopi er nødvendig.",
  "chatImport.error.conflict":
    "Motstridende prosjekt- eller meldings-id-er forhindret denne importen. Ingen delvis import ble committet. Eksisterende Classic-chatter ble bevart.",
  "chatImport.error.busy":
    "Databasen er opptatt, eller operasjonen tok for lang tid. Lukk OpenCode, vent til andre importer er ferdige, og kjør forhåndsvisningen på nytt. Et nytt forsøk hopper over chatter som allerede er committet.",
  "chatImport.error.expired":
    "Denne forhåndsvisningen er utløpt, eller kilden dens er endret. Kjør forhåndsvisningen av databasen på nytt før du importerer.",
}
