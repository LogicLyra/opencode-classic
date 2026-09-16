export const dict = {
  "profileImport.mode": "Režim importu",
  "profileImport.chats": "Iba chaty",
  "profileImport.everything": "Všetko (kompletná konfigurácia)",
  "profileImport.description":
    "Skopíruje vašu kompatibilnú konfiguráciu OpenCode do prázdneho profilu Classic na pracovnej ploche: chaty, prihlasovacie údaje poskytovateľov, cloudové účty, oprávnenia, globálnu konfiguráciu, agentov, skills, zásuvné moduly, plány, snapshoty a súbory pracovných priestorov. Zdroj zostáva nezmenený. Náhľad nespúšťa importované príkazy a nekontaktuje žiadnych poskytovateľov.",
  "profileImport.boundaries":
    "Najprv zatvorte OpenCode a prestaňte upravovať jeho súbory. Priečinky projektov mimo úložiska OpenCode zostávajú na pôvodných cestách. Premenné prostredia, systémovo nainštalované nástroje a predvoľby okien upstream pracovnej plochy sa nekopírujú. Protokoly, vyrovnávacie pamäte a zámky procesov sa vygenerujú znova. Poskytovatelia OAuth môžu vyžadovať nové prihlásenie. Vlastné priečinky sa vyberajú v tomto poradí: údaje, konfigurácia a potom stav.",
  "profileImport.detect": "Náhľad predvolenej konfigurácie",
  "profileImport.browse": "Vybrať priečinky konfigurácie",
  "profileImport.busy":
    "Kompletná konfigurácia sa overuje alebo pripravuje. Nechajte Classic otvorený, kým to skončí.",
  "profileImport.cancelled":
    "Nenašiel sa žiadny kompatibilný zdroj, alebo bol výber priečinkov zrušený.",
  "profileImport.staged":
    "Konfigurácia je pripravená a overená. Reštartujte Classic, aby sa aktivovala pred štartom jeho servera. Nepridávajte do Classic údaje pred reštartom; aktivácia znova overí, že cieľ je prázdny.",
  "profileImport.activated":
    "Kompletná konfigurácia bola úspešne aktivovaná. Priečinky vašich projektov zostávajú dostupné na pôvodných cestách; importované interné pracovné priestory majú nezávislé kópie.",
  "profileImport.data": "Priečinok údajov zdroja",
  "profileImport.config": "Priečinok konfigurácie zdroja",
  "profileImport.state": "Priečinok stavu zdroja",
  "profileImport.providers": "Uložené prihlasovacie údaje poskytovateľov",
  "profileImport.accounts": "Cloudové účty",
  "profileImport.workspaces": "Pracovné priestory",
  "profileImport.files": "Súbory a odkazy",
  "profileImport.bytes": "Veľkosť kópie (bajty)",
  "profileImport.plugins": "Nakonfigurované zásuvné moduly",
  "profileImport.mcp": "Položky MCP",
  "profileImport.commands": "Príkazy projektu",
  "profileImport.permissions": "Záznamy oprávnení",
  "profileImport.pending": "Čakajúce prompty",
  "profileImport.git": "Checkouty Gitu",
  "profileImport.consent":
    "Zatvoril som OpenCode a dôverujem tejto kompletnej konfigurácii, vrátane prihlasovacích údajov, obnovy účtov, závislostí, zásuvných modulov, serverov MCP, príkazov projektu, háčikov Gitu a existujúcich oprávnení. Tieto sa môžu po aktivácii za normálneho používania spúšťať. Čakajúce prompty zostávajú vo fronte, kým sa nepokračuje.",
  "profileImport.confirm": "Pripraviť kompletnú konfiguráciu",
  "profileImport.restart": "Reštartovať a aktivovať konfiguráciu",
  "profileImport.error.unavailable":
    "Kompletný import vyžaduje vstavaný linuxový server pracovnej plochy a konfiguráciu založenú na súboroch. Konfiguráciu alebo prepísanie autentifikácie poskytované prostredím treba pred importom odstrániť.",
  "profileImport.error.nonempty":
    "Classic už obsahuje údaje konfigurácie. Kompletný import ich neprepíše. Použite Iba chaty na zlúčenie kompatibilných konverzácií, alebo začnite s prázdnym profilom Classic.",
  "profileImport.error.incompatible":
    "Schéma zdrojovej databázy nezodpovedá tejto verzii Classic. Kompletný import vyžaduje kompatibilnú konfiguráciu SQLite; migrácia zdroja sa neskúšala.",
  "profileImport.error.invalid":
    "Konfiguráciu nebolo možné overiť. Skontrolujte oprávnenia súborov, integritu databázy a syntax konfigurácie. Bežiaci profil Classic nebol nahradený.",
  "profileImport.error.changed":
    "Zdroj sa zmenil, alebo tento náhľad vypršal. Zatvorte OpenCode a ďalšie zapisujúce procesy a náhľad vykonajte znova.",
  "profileImport.error.busy":
    "Iný import, aktívny zámok súboru alebo čakajúca aktivácia bránia tejto operácii. Zatvorte OpenCode a reštartujte Classic, skôr než to skúsite znova.",
  "profileImport.liveWarning":
    "OpenCode sa zdá byť práve spustený. Jeho databáza sa neustále mení, takže príprava môže zlyhať. Zatvorte OpenCode (všetky okná) a zastavte jeho servery pred potvrdením, aby bol import spoľahlivý.",
  "profileImport.detail.count": "Postihnuté položky: {{count}}",
  "profileImport.materialized": "Skopírované externé odkazy",
  "profileImport.skipped": "Preskočené behové súbory",
  "profileImport.error.source-busy":
    "Do zdroja sa neustále zapisuje (pravdepodobne beží inštancia OpenCode). Zatvorte OpenCode a jeho servery a potom vykonajte náhľad a potvrdenie znova.",
  "profileImport.error.links":
    "Konfigurácia obsahuje odkaz, ktorý nemožno skopírovať: cyklus symbolických odkazov, alebo odkaz vo vnútri metadát Gitu, kde kópie musia zostať presné.",
  "profileImport.error.git-objects":
    "Metadáta Gitu v konfigurácii používajú nepodporované rozloženie (položky alternates, ukazovatele worktree alebo úložiská objektov, ktoré nemožno bezpečne privatizovať).",
  "profileImport.error.special-files":
    "Konfigurácia obsahuje uzly zariadení alebo iné špeciálne súbory, ktoré nemožno bezpečne skopírovať.",
  "profileImport.error.limit":
    "Konfigurácia prekračuje limit importu (50 GiB alebo 500 000 položiek). Odstráňte veľké záložné súbory alebo zúžte priečinky a náhľad vykonajte znova.",
  "profileImport.error.oversized-file":
    "Konfiguračný alebo metadátový súbor prekračuje svoj limit čítania (64 MB pre konfigurácie, 16 MB pre metadáta Gitu). Rozdeľte ho alebo zmenšite a náhľad vykonajte znova.",
  "profileImport.error.unsupported":
    "Táto konfigurácia obsahuje nepodporované odkazy, cyklické alternates objektov Gitu, špeciálne súbory alebo prekračuje limit importu (50 GiB / 500 000 položiek). Externé symbolické odkazy treba pred importom materializovať; zdrojové súbory neboli zmenené.",
  "profileImport.error.space":
    "Na pripravenie tejto konfigurácie nie je dosť voľného miesta na disku. Uvoľnite miesto a náhľad vykonajte znova.",
  "chatImport.tab": "Import chatov",
  "chatImport.title": "Importovať chaty z OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop udržiava vlastnú databázu chatov. Zobrazte náhľad a skopírujte kompatibilné miestne chaty z OpenCode bez zmeny zdroja a bez nahradenia existujúcich chatov Classic. Sem sa môžete kedykoľvek vrátiť z nastavení.",
  "chatImport.scope":
    "Pred importom zatvorte OpenCode. Týmto sa skopírujú dokončené miestne chaty a ich história. Chaty vo fronte, prebiehajúce a chaty pracovných priestorov sú vylúčené. Prihlasovacie údaje, oprávnenia, príkazy projektu, externé súbory a snapshoty vrátenia sa neimportujú. Prihláste sa samostatne a ponechajte priečinky projektov na pôvodných cestách.",
  "chatImport.localOnly":
    "Na import chatov vyberte vstavaný miestny server pracovnej plochy. Tento importér nepodporuje vzdialené pripojenia a pripojenia k serverom na pozadí.",
  "chatImport.detect": "Skontrolovať predvolenú databázu OpenCode",
  "chatImport.browse": "Vybrať súbor databázy",
  "chatImport.confirm": "Importovať spôsobilé chaty",
  "chatImport.busy":
    "Kontrolujú sa alebo importujú chaty. Pred zatvorením aplikácie počkajte.",
  "chatImport.noSource":
    "Nenašla sa ani nevybrala žiadna databáza. Ak chcete pokračovať, vyberte svoj súbor OpenCode .db.",
  "chatImport.complete":
    "Import dokončený. Otvorte pôvodný priečinok projektu a nájdete jeho chaty. Opakovaný import preskočí ID chatov, ktoré už v Classic sú.",
  "chatImport.source": "Zdrojová databáza",
  "chatImport.destination": "Databáza Classic",
  "chatImport.total": "Chaty vo zdroji",
  "chatImport.eligible": "Pripravené na import",
  "chatImport.existing": "Už existuje",
  "chatImport.excluded": "Vylúčené (vo fronte, prebieha alebo pracovný priestor)",
  "chatImport.imported": "Importované",
  "chatImport.error.unavailable":
    "Import je dostupný len pre vstavaný linuxový server pracovnej plochy po dokončení jeho štartu.",
  "chatImport.error.incompatible":
    "Databázy majú odlišné alebo nepodporované schémy. Použite kompatibilné a aktuálne verzie OpenCode a Classic a náhľad vykonajte znova. Staršie úložisko JSON nie je podporované; zdroj nebol zmigrovaný.",
  "chatImport.error.invalid":
    "Databázu nebolo možné prečítať ani overiť. Skontrolujte vybraný súbor, oprávnenia a dostupné miesto na disku. Nepotvrdený import sa vracia späť; pred novým pokusom vykonajte náhľad znova.",
  "chatImport.error.sameFile":
    "Zdroj a cieľ sú rovnaká databáza. Kopírovanie nie je potrebné.",
  "chatImport.error.conflict":
    "Konfliktné ID projektov alebo správ zabránili tomuto importu. Žiadny čiastočný import nebol potvrdený. Existujúce chaty Classic boli zachované.",
  "chatImport.error.busy":
    "Databáza je zaneprázdnená alebo operácia trvala príliš dlho. Zatvorte OpenCode, počkajte na dokončenie ostatných importov a náhľad vykonajte znova. Nový pokus preskočí už potvrdené chaty.",
  "chatImport.error.expired":
    "Tento náhľad vypršal alebo sa jeho zdroj zmenil. Pred importom vykonajte náhľad databázy znova.",
}
