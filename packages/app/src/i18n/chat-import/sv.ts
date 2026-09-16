export const dict = {
  "profileImport.mode": "Importläge",
  "profileImport.chats": "Endast chattar",
  "profileImport.everything": "Allt (fullständig konfiguration)",
  "profileImport.description":
    "Kopierar din kompatibla OpenCode-konfiguration till en tom Classic-skrivbordsprofil: chattar, leverantörers inloggningsuppgifter, molnkonton, behörigheter, global konfiguration, agenter, skills, plugins, planer, snapshots och arbetsytefiler. Källan ändras inte. Förhandsgranskningen kör inga importerade kommandon och kontaktar inga leverantörer.",
  "profileImport.boundaries":
    "Stäng först OpenCode och sluta redigera dess filer. projektmappar utanför OpenCode-lagringen finns kvar på sina ursprungliga sökvägar. Miljövariabler, systeminstallerade verktyg och uppströms fönsterinställningar för skrivbordet kopieras inte. Loggar, cachar och processlås genereras om. OAuth-leverantörer kan kräva ny inloggning. Egna mappar väljs i denna ordning: data, konfiguration och sedan tillstånd.",
  "profileImport.detect": "Förhandsgranska standardkonfigurationen",
  "profileImport.browse": "Välj konfigurationsmappar",
  "profileImport.busy":
    "Den fullständiga konfigurationen valideras eller förbereds. Håll Classic öppet tills det är klart.",
  "profileImport.cancelled":
    "Ingen kompatibel källa hittades, eller så avbröts mappvalet.",
  "profileImport.staged":
    "Konfigurationen är förberedd och verifierad. Starta om Classic för att aktivera den innan dess server startar. Lägg inte till data i Classic före omstarten; aktiveringen kontrollerar igen att destinationen är tom.",
  "profileImport.activated":
    "Den fullständiga konfigurationen aktiverades. Dina projektmappar finns kvar tillgängliga på sina ursprungliga sökvägar; importerade interna arbetsytor har oberoende kopior.",
  "profileImport.data": "Källdatamapp",
  "profileImport.config": "Källkonfigurationsmapp",
  "profileImport.state": "Källtillståndsmapp",
  "profileImport.providers": "Sparade inloggningsuppgifter från leverantörer",
  "profileImport.accounts": "Molnkonton",
  "profileImport.workspaces": "Arbetsytor",
  "profileImport.files": "Filer och länkar",
  "profileImport.bytes": "Kopieringsstorlek (bytes)",
  "profileImport.plugins": "Konfigurerade plugins",
  "profileImport.mcp": "MCP-poster",
  "profileImport.commands": "Projektkommandon",
  "profileImport.permissions": "Behörighetsposter",
  "profileImport.pending": "Väntande prompts",
  "profileImport.git": "Git-checkouts",
  "profileImport.consent":
    "Jag har stängt OpenCode och litar på denna fullständiga konfiguration, inklusive inloggningsuppgifter, kontouppdatering, beroenden, plugins, MCP-servrar, projektkommandon, Git-hooks och befintliga behörigheter. Dessa kan köras under normal användning efter aktiveringen. Väntande prompts förblir i kö tills de återupptas.",
  "profileImport.confirm": "Förbered fullständig konfiguration",
  "profileImport.restart": "Starta om och aktivera konfigurationen",
  "profileImport.error.unavailable":
    "Fullständig import kräver den inbyggda Linux-skrivbordsservern och filbaserad konfiguration. Miljölevererad konfiguration eller autentiseringsåsidosättningar måste tas bort före importen.",
  "profileImport.error.nonempty":
    "Classic innehåller redan konfigurationsdata. Fullständig import skriver inte över den. Använd Endast chattar för att slå samman kompatibla konversationer, eller börja med en tom Classic-profil.",
  "profileImport.error.incompatible":
    "Källdatabasens schema matchar inte denna Classic-version. Fullständig import kräver en kompatibel SQLite-konfiguration; ingen migrering av källen försöktes.",
  "profileImport.error.invalid":
    "Konfigurationen kunde inte valideras. Kontrollera filbehörigheter, databasintegritet och konfigurationssyntax. Den körande Classic-profilen har inte ersatts.",
  "profileImport.error.changed":
    "Källan ändrades eller denna förhandsgranskning har upphört att gälla. Stäng OpenCode och andra skrivande processer och kör förhandsgranskningen igen.",
  "profileImport.error.busy":
    "En annan import, ett aktivt fillås eller en väntande aktivering hindrar denna åtgärd. Stäng OpenCode och starta om Classic innan du försöker igen.",
  "profileImport.liveWarning":
    "OpenCode verkar köras just nu. Dess databas ändras kontinuerligt, så förberedelsen kan misslyckas. Stäng OpenCode (alla fönster) och stoppa dess servrar innan du bekräftar, för en tillförlitlig import.",
  "profileImport.detail.count": "Berörda objekt: {{count}}",
  "profileImport.materialized": "Externa länkar inkopierade",
  "profileImport.skipped": "Overhoppade runtime-filer",
  "profileImport.error.source-busy":
    "Källan skrivs till kontinuerligt (en OpenCode-instans körs troligen). Stäng OpenCode och dess servrar och kör sedan förhandsgranskningen och bekräftelsen igen.",
  "profileImport.error.links":
    "Konfigurationen innehåller en länk som inte kan kopieras: en symlink-cykel, eller en länk i Git-metadata där kopior måste förbli exakta.",
  "profileImport.error.git-objects":
    "Git-metadatan i konfigurationen använder en ostödd layout (alternates-poster, worktree-pekare eller objektlager som inte kan privatiseras säkert).",
  "profileImport.error.special-files":
    "Konfigurationen innehåller enhetsnoder eller andra specialfiler som inte kan kopieras säkert.",
  "profileImport.error.limit":
    "Konfigurationen överskrider importgränsen (50 GiB eller 500 000 objekt). Ta bort stora säkerhetskopior eller begränsa mapparna och kör förhandsgranskningen igen.",
  "profileImport.error.oversized-file":
    "En konfigurations- eller metadatafil överskrider sin läsgräns (64 MB för konfigurationer, 16 MB för Git-metadata). Dela upp eller minska den och kör förhandsgranskningen igen.",
  "profileImport.error.unsupported":
    "Denna konfiguration innehåller ostödda länkar, cykliska Git-objektalternates, specialfiler eller överskrider importgränsen (50 GiB / 500 000 objekt). Externa symlänkar måste materialiseras före importen; källfilerna ändrades inte.",
  "profileImport.error.space":
    "Det finns inte tillräckligt med ledigt diskutrymme för att förbereda denna konfiguration. Frigör utrymme och kör förhandsgranskningen igen.",
  "chatImport.tab": "Chattimport",
  "chatImport.title": "Importera chattar från OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop har en egen chatt-databas. Förhandsgranska och kopiera kompatibla lokala chattar från OpenCode utan att ändra källan eller ersätta befintliga Classic-chattar. Du kan komma tillbaka hit från inställningarna när som helst.",
  "chatImport.scope":
    "Stäng OpenCode före importen. Detta kopierar avslutade lokala chattar och deras historik. Chattar i kö, pågående chattar och arbetsytesessioner undantas. Inloggningsuppgifter, behörigheter, projektkommandon, externa filer och ångra-snapshots importeras inte. Logga in separat och behåll dina projektmappar på sina ursprungliga sökvägar.",
  "chatImport.localOnly":
    "Välj den inbyggda lokala skrivbordsservern för att importera chattar. Fjärr- och bakgrundsserveranslutningar stöds inte av denna importör.",
  "chatImport.detect": "Kontrollera standarddatabasen för OpenCode",
  "chatImport.browse": "Välj databasfil",
  "chatImport.confirm": "Importera berättigade chattar",
  "chatImport.busy":
    "Kontrollerar eller importerar chattar. Vänta innan du stänger appen.",
  "chatImport.noSource":
    "Ingen databas hittades eller valdes. Välj din OpenCode-.db-fil för att fortsätta.",
  "chatImport.complete":
    "Importen klar. Öppna den ursprungliga projektmappen för att hitta dess chattar. En upprepad import hoppar över chatt-id:n som redan finns i Classic.",
  "chatImport.source": "Källdatabas",
  "chatImport.destination": "Classic-databas",
  "chatImport.total": "Chattar i källan",
  "chatImport.eligible": "Klara att importera",
  "chatImport.existing": "Finns redan",
  "chatImport.excluded": "Undantagna (i kö, pågående eller arbetsyta)",
  "chatImport.imported": "Importerade",
  "chatImport.error.unavailable":
    "Import är endast tillgänglig för den inbyggda Linux-skrivbordsservern efter att den har startat klart.",
  "chatImport.error.incompatible":
    "Databaserna har olika eller ostödda scheman. Använd kompatibla, uppdaterade OpenCode- och Classic-versioner och kör förhandsgranskningen igen. Äldre JSON-lagring stöds inte; källan har inte migrerats.",
  "chatImport.error.invalid":
    "Databasen kunde inte läsas eller valideras. Kontrollera den valda filen, behörigheterna och tillgängligt diskutrymme. En icke-committad import rullas tillbaka; kör förhandsgranskningen igen innan du försöker igen.",
  "chatImport.error.sameFile":
    "Källa och destination är samma databas. Ingen kopia behövs.",
  "chatImport.error.conflict":
    "Motstridiga projekt- eller meddelande-id:n hindrade denna import. Ingen delvis import committades. Befintliga Classic-chattar bevarades.",
  "chatImport.error.busy":
    "Databasen är upptagen eller åtgärden tog för lång tid. Stäng OpenCode, vänta tills andra importer är klara och kör förhandsgranskningen igen. Ett nytt försök hoppar över chattar som redan committats.",
  "chatImport.error.expired":
    "Denna förhandsgranskning har upphört att gälla eller dess källa har ändrats. Kör förhandsgranskningen av databasen igen innan du importerar.",
}
