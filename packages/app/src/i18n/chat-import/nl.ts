export const dict = {
  "profileImport.mode": "Importmodus",
  "profileImport.chats": "Alleen chats",
  "profileImport.everything": "Alles (volledige setup)",
  "profileImport.description":
    "Kopieert je compatibele OpenCode-setup naar een leeg Classic-desktopprofiel: chats, inloggegevens van aanbieders, cloudaccounts, machtigingen, globale configuratie, agents, skills, plugins, plannen, snapshots en werkruimtebestanden. De bron blijft ongewijzigd. De voorbeeldweergave voert geen geïmporteerde opdrachten uit en neemt geen contact op met aanbieders.",
  "profileImport.boundaries":
    "Sluit eerst OpenCode en stop met het bewerken van de bestanden. Projectmappen buiten de OpenCode-opslag blijven op hun oorspronkelijke paden. Omgevingsvariabelen, systeembreed geïnstalleerde tools en upstream-vensterinstellingen van de desktop worden niet gekopieerd. Logboeken, caches en procesvergrendelingen worden opnieuw aangemaakt. OAuth-aanbieders kunnen opnieuw aanmelden vereisen. Eigen mappen worden in deze volgorde gekozen: gegevens, configuratie, daarna status.",
  "profileImport.detect": "Voorbeeld van de standaardsetup",
  "profileImport.browse": "Setupmappen kiezen",
  "profileImport.busy":
    "De volledige setup wordt gevalideerd of voorbereid. Houd Classic open tot dit is voltooid.",
  "profileImport.cancelled":
    "Er is geen compatibele bron gevonden, of de mapkeuze is geannuleerd.",
  "profileImport.staged":
    "De setup is voorbereid en geverifieerd. Start Classic opnieuw op om deze te activeren voordat de server start. Voeg geen gegevens toe aan Classic vóór het herstarten; de activering controleert opnieuw of de bestemming leeg is.",
  "profileImport.activated":
    "De volledige setup is succesvol geactiveerd. Je projectmappen blijven beschikbaar op hun oorspronkelijke paden; geïmporteerde interne werkruimten hebben onafhankelijke kopieën.",
  "profileImport.data": "Brongegevensmap",
  "profileImport.config": "Bronconfiguratiemap",
  "profileImport.state": "Bronstatusmap",
  "profileImport.providers": "Opgeslagen inloggegevens van aanbieders",
  "profileImport.accounts": "Cloudaccounts",
  "profileImport.workspaces": "Werkruimten",
  "profileImport.files": "Bestanden en links",
  "profileImport.bytes": "Kopieergrootte (bytes)",
  "profileImport.plugins": "Geconfigureerde plugins",
  "profileImport.mcp": "MCP-items",
  "profileImport.commands": "Projectopdrachten",
  "profileImport.permissions": "Machtigingsrecords",
  "profileImport.pending": "Openstaande prompts",
  "profileImport.git": "Git-checkouts",
  "profileImport.consent":
    "Ik heb OpenCode gesloten en vertrouw deze volledige setup, inclusief inloggegevens, accountvernieuwing, afhankelijkheden, plugins, MCP-servers, projectopdrachten, Git-hooks en bestaande machtigingen. Deze kunnen na activering tijdens normaal gebruik worden uitgevoerd. Openstaande prompts blijven in de wachtrij tot ze worden hervat.",
  "profileImport.confirm": "Volledige setup voorbereiden",
  "profileImport.restart": "Opnieuw opstarten en setup activeren",
  "profileImport.error.unavailable":
    "Volledige import vereist de ingebouwde Linux-desktopserver en configuratie via bestanden. Via omgevingsvariabelen aangeboden configuratie of auth-overrides moeten vóór het importeren worden verwijderd.",
  "profileImport.error.nonempty":
    "Classic bevat al setupgegevens. Volledige import overschrijft deze niet. Gebruik Alleen chats om compatibele gesprekken samen te voegen, of begin met een leeg Classic-profiel.",
  "profileImport.error.incompatible":
    "Het databaseschema van de bron komt niet overeen met deze Classic-versie. Volledige import vereist een compatibele SQLite-setup; er is geen migratie van de bron geprobeerd.",
  "profileImport.error.invalid":
    "De setup kon niet worden gevalideerd. Controleer bestandsrechten, database-integriteit en configuratiesyntax. Het actieve Classic-profiel is niet vervangen.",
  "profileImport.error.changed":
    "De bron is gewijzigd of deze voorbeeldweergave is verlopen. Sluit OpenCode en andere schrijvende processen en voer de voorbeeldweergave opnieuw uit.",
  "profileImport.error.busy":
    "Een andere import, een actieve bestandsvergrendeling of een openstaande activering blokkeert deze bewerking. Sluit OpenCode en start Classic opnieuw op voordat je het opnieuw probeert.",
  "profileImport.liveWarning":
    "OpenCode lijkt nu te draaien. De database verandert doorlopend, waardoor de voorbereiding kan mislukken. Sluit OpenCode (alle vensters) en stop de servers voordat je bevestigt, voor een betrouwbare import.",
  "profileImport.detail.count": "Betrokken items: {{count}}",
  "profileImport.materialized": "Externe links gekopieerd",
  "profileImport.skipped": "Overgeslagen runtimebestanden",
  "profileImport.error.source-busy":
    "Naar de bron wordt doorlopend geschreven (waarschijnlijk draait er een OpenCode-instantie). Sluit OpenCode en de bijbehorende servers en voer daarna de voorbeeldweergave en bevestiging opnieuw uit.",
  "profileImport.error.links":
    "De setup bevat een link die niet gekopieerd kan worden: een symlink-cyclus, of een link binnen Git-metadata waar kopieën exact moeten blijven.",
  "profileImport.error.git-objects":
    "De Git-metadata van de setup gebruikt een niet-ondersteunde indeling (alternates-items, worktree-verwijzingen of objectopslagen die niet veilig geprivatiseerd kunnen worden).",
  "profileImport.error.special-files":
    "De setup bevat apparaatknooppunten of andere speciale bestanden die niet veilig gekopieerd kunnen worden.",
  "profileImport.error.limit":
    "De setup overschrijdt de importlimiet (50 GiB of 500.000 items). Verwijder grote back-upbestanden of beperk de mappen en voer de voorbeeldweergave opnieuw uit.",
  "profileImport.error.oversized-file":
    "Een configuratie- of metagegevensbestand overschrijdt de leeslimiet (64 MB voor configuraties, 16 MB voor Git-metadata). Splits of verklein het bestand en voer de voorbeeldweergave opnieuw uit.",
  "profileImport.error.unsupported":
    "Deze setup bevat niet-ondersteunde links, cyclische Git-objectalternates, speciale bestanden of overschrijdt de importlimiet (50 GiB / 500.000 items). Externe symlinks moeten vóór de import worden gematerialiseerd; bronbestanden zijn niet gewijzigd.",
  "profileImport.error.space":
    "Er is niet genoeg vrije schijfruimte om deze setup voor te bereiden. Maak schijfruimte vrij en voer de voorbeeldweergave opnieuw uit.",
  "chatImport.tab": "Chatimport",
  "chatImport.title": "Chats importeren uit OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop houdt een eigen chatdatabase aan. Bekijk en kopieer compatibele lokale chats uit OpenCode zonder de bron te wijzigen of bestaande Classic-chats te vervangen. Je kunt altijd via de instellingen hier terugkeren.",
  "chatImport.scope":
    "Sluit OpenCode vóór het importeren. Dit kopieert voltooide lokale chats en hun geschiedenis. Chats in de wachtrij, actieve chats en werkruimtesessies zijn uitgesloten. Inloggegevens, machtigingen, projectopdrachten, externe bestanden en undo-snapshots worden niet geïmporteerd. Meld je afzonderlijk aan en houd je projectmappen op hun oorspronkelijke paden.",
  "chatImport.localOnly":
    "Kies de ingebouwde lokale desktopserver om chats te importeren. Externe verbindingen en achtergrondserververbindingen worden door deze importeur niet ondersteund.",
  "chatImport.detect": "Standaard OpenCode-database controleren",
  "chatImport.browse": "Databasebestand kiezen",
  "chatImport.confirm": "In aanmerking komende chats importeren",
  "chatImport.busy":
    "Chats worden gecontroleerd of geïmporteerd. Wacht met sluiten van de app.",
  "chatImport.noSource":
    "Er is geen database gevonden of geselecteerd. Kies je OpenCode-.db-bestand om door te gaan.",
  "chatImport.complete":
    "Import voltooid. Open de oorspronkelijke projectmap om de chats te vinden. Een herhaalde import slaat chat-id's over die al in Classic aanwezig zijn.",
  "chatImport.source": "Brondatabase",
  "chatImport.destination": "Classic-database",
  "chatImport.total": "Chats in bron",
  "chatImport.eligible": "Klaar om te importeren",
  "chatImport.existing": "Al aanwezig",
  "chatImport.excluded": "Uitgesloten (in wachtrij, actief of werkruimte)",
  "chatImport.imported": "Geïmporteerd",
  "chatImport.error.unavailable":
    "Importeren is alleen beschikbaar voor de ingebouwde Linux-desktopserver nadat die volledig is opgestart.",
  "chatImport.error.incompatible":
    "De databases hebben verschillende of niet-ondersteunde schema's. Gebruik compatibele, actuele OpenCode- en Classic-versies en voer de voorbeeldweergave opnieuw uit. Verouderde JSON-opslag wordt niet ondersteund; de bron is niet gemigreerd.",
  "chatImport.error.invalid":
    "De database kon niet worden gelezen of gevalideerd. Controleer het geselecteerde bestand, de rechten en de beschikbare schijfruimte. Een niet-vastgelegde import wordt teruggedraaid; voer vóór een nieuwe poging de voorbeeldweergave opnieuw uit.",
  "chatImport.error.sameFile":
    "Bron en bestemming zijn dezelfde database. Er hoeft niet gekopieerd te worden.",
  "chatImport.error.conflict":
    "Conflicterende project- of bericht-id's hebben deze import geblokkeerd. Er is geen gedeeltelijke import vastgelegd. Bestaande Classic-chats zijn behouden.",
  "chatImport.error.busy":
    "De database is bezet of de bewerking duurde te lang. Sluit OpenCode, wacht tot andere importen zijn afgerond en voer daarna de voorbeeldweergave opnieuw uit. Een nieuwe poging slaat al vastgelegde chats over.",
  "chatImport.error.expired":
    "Deze voorbeeldweergave is verlopen of de bron is gewijzigd. Voer de voorbeeldweergave van de database opnieuw uit voordat je importeert.",
}
