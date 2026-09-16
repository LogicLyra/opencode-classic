export const dict = {
  "profileImport.mode": "Importtilstand",
  "profileImport.chats": "Kun chats",
  "profileImport.everything": "Alt (fuld opsætning)",
  "profileImport.description":
    "Kopierer din kompatible OpenCode-opsætning til en tom Classic-skrivebordsprofil: chats, udbyder-loginoplysninger, cloudkonti, tilladelser, global konfiguration, agenter, skills, plugins, planer, snapshots og arbejdsområdefiler. Kilden ændres ikke. Forhåndsvisningen kører ikke importerede kommandoer og kontakter ingen udbydere.",
  "profileImport.boundaries":
    "Luk først OpenCode og hold op med at redigere dets filer. Projektmapper uden for OpenCode-lageret forbliver på deres oprindelige stier. Miljøvariabler, systeminstallerede værktøjer og upstream-skrivebordsvinduespræferencer kopieres ikke. Logfiler, caches og proceslåse genereres igen. OAuth-udbydere kan kræve ny login. Egne mapper vælges i denne rækkefølge: data, konfiguration og derefter tilstand.",
  "profileImport.detect": "Forhåndsvis standardopsætning",
  "profileImport.browse": "Vælg opsætningsmapper",
  "profileImport.busy":
    "Den fulde opsætning valideres eller klargøres. Hold Classic åben, indtil det er færdigt.",
  "profileImport.cancelled":
    "Der blev ikke fundet nogen kompatibel kilde, eller mappevalget blev annulleret.",
  "profileImport.staged":
    "Opsætningen er klargjort og verificeret. Genstart Classic for at aktivere den, før dens server starter. Tilføj ikke data til Classic før genstart; aktiveringen kontrollerer igen, at destinationen er tom.",
  "profileImport.activated":
    "Den fulde opsætning blev aktiveret. Dine projektmapper forbliver tilgængelige på deres oprindelige stier; importerede interne arbejdsområder har uafhængige kopier.",
  "profileImport.data": "Kildedatamappe",
  "profileImport.config": "Kildekonfigurationsmappe",
  "profileImport.state": "Kildetilstandsmappe",
  "profileImport.providers": "Gemte udbyder-loginoplysninger",
  "profileImport.accounts": "Cloudkonti",
  "profileImport.workspaces": "Arbejdsområder",
  "profileImport.files": "Filer og links",
  "profileImport.bytes": "Kopiæringsstørrelse (bytes)",
  "profileImport.plugins": "Konfigurerede plugins",
  "profileImport.mcp": "MCP-poster",
  "profileImport.commands": "Projektkommandoer",
  "profileImport.permissions": "Tilladelsesposter",
  "profileImport.pending": "Afventende prompts",
  "profileImport.git": "Git-checkouts",
  "profileImport.consent":
    "Jeg har lukket OpenCode og stoler på denne fulde opsætning, herunder loginoplysninger, kontoopdatering, afhængigheder, plugins, MCP-servere, projektkommandoer, Git-hooks og eksisterende tilladelser. Disse kan køre under normal brug efter aktivering. Afventende prompts forbliver i kø, indtil de genoptages.",
  "profileImport.confirm": "Klargør fuld opsætning",
  "profileImport.restart": "Genstart og aktivér opsætning",
  "profileImport.error.unavailable":
    "Fuld import kræver den indbyggede Linux-skrivebordsserver og filbaseret konfiguration. Miljøleveret konfiguration eller godkendelsesoverstyringer skal fjernes, før du importerer.",
  "profileImport.error.nonempty":
    "Classic indeholder allerede opsætningsdata. Fuld import overskriver den ikke. Brug Kun chats til at flette kompatible samtaler, eller start med en tom Classic-profil.",
  "profileImport.error.incompatible":
    "Kildedatabasens skema matcher ikke denne Classic-version. Fuld import kræver en kompatibel SQLite-opsætning; der blev ikke forsøgt nogen migrering af kilden.",
  "profileImport.error.invalid":
    "Opsætningen kunne ikke valideres. Tjek filrettigheder, databaseintegritet og konfigurationssyntaks. Den kørende Classic-profil er ikke blevet erstattet.",
  "profileImport.error.changed":
    "Kilden ændrede sig, eller denne forhåndsvisning er udløbet. Luk OpenCode og andre skrivende processer, og lav forhåndsvisningen igen.",
  "profileImport.error.busy":
    "En anden import, en aktiv fillås eller en afventende aktivering forhindrer denne handling. Luk OpenCode og genstart Classic, før du prøver igen.",
  "profileImport.liveWarning":
    "OpenCode ser ud til at køre lige nu. Dens database ændrer sig løbende, så klargøring kan mislykkes. Luk OpenCode (alle vinduer) og stop dens servere, før du bekræfter, for en pålidelig import.",
  "profileImport.detail.count": "Berørte elementer: {{count}}",
  "profileImport.materialized": "Eksterne links kopieret ind",
  "profileImport.skipped": "Sprungne runtime-filer",
  "profileImport.error.source-busy":
    "Der skrives løbende til kilden (der kører sandsynligvis en OpenCode-instans). Luk OpenCode og dens servere, og lav derefter forhåndsvisning og bekræftelse igen.",
  "profileImport.error.links":
    "Opsætningen indeholder et link, der ikke kan kopieres: en symlink-cyklus eller et link i Git-metadata, hvor kopier skal forblive eksakte.",
  "profileImport.error.git-objects":
    "Opsættens Git-metadata bruger et ikke-understøttet layout (alternates-poster, worktree-pointere eller objektlagre, der ikke kan privatiseres sikkert).",
  "profileImport.error.special-files":
    "Opsætningen indeholder enhedsknuder eller andre specielle filer, der ikke kan kopieres sikkert.",
  "profileImport.error.limit":
    "Opsætningen overskrider importgrænsen (50 GiB eller 500.000 elementer). Fjern store sikkerhedskopifiler eller indsnævr mapperne, og lav forhåndsvisningen igen.",
  "profileImport.error.oversized-file":
    "En konfigurations- eller metadatafil overskrider dens læsegrænse (64 MB for konfigurationer, 16 MB for Git-metadata). Opdel eller formindsk den, og lav forhåndsvisningen igen.",
  "profileImport.error.unsupported":
    "Denne opsætning indeholder ikke-understøttede links, cykliske Git-objektalternates, specielle filer eller overskrider importgrænsen (50 GiB / 500.000 elementer). Eksterne symlinks skal materialiseres før import; kildefiler blev ikke ændret.",
  "profileImport.error.space":
    "Der er ikke nok ledig diskplads til at klargøre denne opsætning. Frigør plads, og lav forhåndsvisningen igen.",
  "chatImport.tab": "Chatimport",
  "chatImport.title": "Importér chats fra OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop holder sin egen chatdatabase. Forhåndsvis og kopiér kompatible lokale chats fra OpenCode uden at ændre kilden eller erstatte eksisterende Classic-chats. Du kan vende tilbage hertil fra indstillingerne når som helst.",
  "chatImport.scope":
    "Luk OpenCode, før du importerer. Dette kopierer afsluttede lokale chats og deres historik. Chats i kø, igangværende chats og arbejdsområde-sessioner er udeladt. Loginoplysninger, tilladelser, projektkommandoer, eksterne filer og fortryd-snapshots importeres ikke. Log ind separat, og behold dine projektmapper på deres oprindelige stier.",
  "chatImport.localOnly":
    "Vælg den indbyggede lokale skrivebordsserver for at importere chats. Fjern- og baggrundsserverforbindelser understøttes ikke af denne importer.",
  "chatImport.detect": "Tjek standard OpenCode-database",
  "chatImport.browse": "Vælg databasefil",
  "chatImport.confirm": "Importér berettigede chats",
  "chatImport.busy":
    "Tjekker eller importerer chats. Vent, før du lukker appen.",
  "chatImport.noSource":
    "Der blev ikke fundet eller valgt nogen database. Vælg din OpenCode-.db-fil for at fortsætte.",
  "chatImport.complete":
    "Import fuldført. Åbn den oprindelige projektmappen for at finde dens chats. En gentaget import springer chat-id'er over, der allerede findes i Classic.",
  "chatImport.source": "Kildedatabase",
  "chatImport.destination": "Classic-database",
  "chatImport.total": "Chats i kilden",
  "chatImport.eligible": "Klar til import",
  "chatImport.existing": "Findes allerede",
  "chatImport.excluded": "Udeladt (i kø, igangværende eller arbejdsområde)",
  "chatImport.imported": "Importeret",
  "chatImport.error.unavailable":
    "Import er kun tilgængelig for den indbyggede Linux-skrivebordsserver, efter den er færdig med at starte.",
  "chatImport.error.incompatible":
    "Databaserne har forskellige eller ikke-understøttede skemaer. Brug kompatible, opdaterede OpenCode- og Classic-versioner, og lav forhåndsvisningen igen. Ældre JSON-lagring understøttes ikke; kilden er ikke blevet migreret.",
  "chatImport.error.invalid":
    "Databasen kunne ikke læses eller valideres. Tjek den valgte fil, rettighederne og den tilgængelige diskplads. En ikke-committet import rulles tilbage; lav forhåndsvisningen igen, før du prøver igen.",
  "chatImport.error.sameFile":
    "Kilde og destination er den samme database. Der skal ikke kopieres noget.",
  "chatImport.error.conflict":
    "Modstridende projekt- eller besked-id'er forhindrede denne import. Der blev ikke committet nogen delvis import. Eksisterende Classic-chats blev bevaret.",
  "chatImport.error.busy":
    "Databasen er optaget, eller handlingen tog for lang tid. Luk OpenCode, vent på at andre importer afsluttes, og lav forhåndsvisningen igen. Et nyt forsøg springer allerede committede chats over.",
  "chatImport.error.expired":
    "Denne forhåndsvisning er udløbet, eller dens kilde er ændret. Lav forhåndsvisningen af databasen igen, før du importerer.",
}
