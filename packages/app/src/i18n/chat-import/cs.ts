export const dict = {
  "profileImport.mode": "Režim importu",
  "profileImport.chats": "Jen chaty",
  "profileImport.everything": "Vše (kompletní nastavení)",
  "profileImport.description":
    "Zkopíruje vaše kompatibilní nastavení OpenCode do prázdného profilu Classic na desktopu: chaty, přihlašovací údaje poskytovatelů, cloudové účty, oprávnění, globální konfiguraci, agenty, skills, pluginy, plány, snapshoty a soubory pracovních prostorů. Zdroj zůstává nezměněný. Náhled nespouští importované příkazy a nekontaktuje žádné poskytovatele.",
  "profileImport.boundaries":
    "Nejprve zavřete OpenCode a přestaňte upravovat jeho soubory. Složky projektů mimo úložiště OpenCode zůstávají na původních cestách. Proměnné prostředí, systémově nainstalované nástroje a předvolby oken desktopu upstream se nekopírují. Protokoly, mezipaměti a zámky procesů se vygenerují znovu. Poskytovatelé OAuth mohou vyžadovat nové přihlášení. Vlastní složky se vybírají v tomto pořadí: data, konfigurace a poté stav.",
  "profileImport.detect": "Náhled výchozího nastavení",
  "profileImport.browse": "Vybrat složky nastavení",
  "profileImport.busy":
    "Kompletní nastavení se validuje nebo připravuje. Nechte Classic otevřený, dokud to nedoběhne.",
  "profileImport.cancelled":
    "Nebyl nalezen žádný kompatibilní zdroj, nebo byl výběr složek zrušen.",
  "profileImport.staged":
    "Nastavení je připraveno a ověřeno. Restartujte Classic, aby se aktivovalo před startem jeho serveru. Nepřidávejte do Classic data před restartem; aktivace znovu ověří, že cíl je prázdný.",
  "profileImport.activated":
    "Kompletní nastavení bylo úspěšně aktivováno. Složky vašich projektů zůstávají dostupné na původních cestách; importované interní pracovní prostory mají nezávislé kopie.",
  "profileImport.data": "Složka dat zdroje",
  "profileImport.config": "Složka konfigurace zdroje",
  "profileImport.state": "Složka stavu zdroje",
  "profileImport.providers": "Uložené přihlašovací údaje poskytovatelů",
  "profileImport.accounts": "Cloudové účty",
  "profileImport.workspaces": "Pracovní prostory",
  "profileImport.files": "Soubory a odkazy",
  "profileImport.bytes": "Velikost kopie (bajty)",
  "profileImport.plugins": "Nakonfigurované pluginy",
  "profileImport.mcp": "Položky MCP",
  "profileImport.commands": "Příkazy projektu",
  "profileImport.permissions": "Záznamy oprávnění",
  "profileImport.pending": "Čekající prompty",
  "profileImport.git": "Checkouty Gitu",
  "profileImport.consent":
    "Zavřel jsem OpenCode a důvěřuji tomuto kompletnímu nastavení, včetně přihlašovacích údajů, obnovy účtů, závislostí, pluginů, serverů MCP, příkazů projektu, háčků Gitu a existujících oprávnění. Ty se mohou za normálního používání po aktivaci spouštět. Čekající prompty zůstávají ve frontě, dokud nebudou obnoveny.",
  "profileImport.confirm": "Připravit kompletní nastavení",
  "profileImport.restart": "Restartovat a aktivovat nastavení",
  "profileImport.error.unavailable":
    "Kompletní import vyžaduje vestavěný linuxový desktopový server a konfiguraci založenou na souborech. Konfiguraci nebo přepsání autentizace poskytované prostředím je před importem třeba odebrat.",
  "profileImport.error.nonempty":
    "Classic už obsahuje data nastavení. Kompletní import je nepřepíše. Použijte Jen chaty pro sloučení kompatibilních konverzací, nebo začněte s prázdným profilem Classic.",
  "profileImport.error.incompatible":
    "Schéma zdrojové databáze neodpovídá této verzi Classic. Kompletní import vyžaduje kompatibilní nastavení SQLite; migrace zdroje nebyla zkoušena.",
  "profileImport.error.invalid":
    "Nastavení se nepodařilo validovat. Zkontrolujte oprávnění souborů, integritu databáze a syntaxi konfigurace. Běžící profil Classic nebyl nahrazen.",
  "profileImport.error.changed":
    "Zdroj se změnil, nebo tento náhled vypršel. Zavřete OpenCode a další zapisující procesy a náhled spusťte znovu.",
  "profileImport.error.busy":
    "Jiný import, aktivní zámek souboru nebo čekající aktivace brání této operaci. Zavřete OpenCode a restartujte Classic, než to zkusíte znovu.",
  "profileImport.liveWarning":
    "OpenCode zřejmě právě běží. Jeho databáze se průběžně mění, takže příprava může selhat. Zavřete OpenCode (všechna okna) a zastavte jeho servery před potvrzením, aby import byl spolehlivý.",
  "profileImport.detail.count": "Dotčené položky: {{count}}",
  "profileImport.materialized": "Zkopírované externí odkazy",
  "profileImport.skipped": "Přeskočené běhové soubory",
  "profileImport.error.source-busy":
    "Do zdroje se průběžně zapisuje (pravděpodobně běží instance OpenCode). Zavřete OpenCode a jeho servery a poté proveďte náhled a potvrzení znovu.",
  "profileImport.error.links":
    "Nastavení obsahuje odkaz, který nelze zkopírovat: cyklus symbolických odkazů, nebo odkaz uvnitř metadat Gitu, kde kopie musí zůstat přesné.",
  "profileImport.error.git-objects":
    "Metadata Gitu v nastavení používají nepodporované rozložení (položky alternates, ukazatele worktree nebo úložiště objektů, která nelze bezpečně privatizovat).",
  "profileImport.error.special-files":
    "Nastavení obsahuje uzly zařízení nebo jiné speciální soubory, které nelze bezpečně zkopírovat.",
  "profileImport.error.limit":
    "Nastavení překračuje limit importu (50 GiB nebo 500 000 položek). Odstraňte velké záložní soubory nebo zúžte složky a náhled spusťte znovu.",
  "profileImport.error.oversized-file":
    "Konfigurační nebo metadatový soubor překračuje svůj limit čtení (64 MB pro konfigurace, 16 MB pro metadata Gitu). Rozdělte jej nebo zmenšete a náhled spusťte znovu.",
  "profileImport.error.unsupported":
    "Toto nastavení obsahuje nepodporované odkazy, cyklické alternates objektů Gitu, speciální soubory nebo překračuje limit importu (50 GiB / 500 000 položek). Externí symbolické odkazy je před importem třeba materializovat; zdrojové soubory nebyly změněny.",
  "profileImport.error.space":
    "Pro přípravu tohoto nastavení není dost volného místa na disku. Uvolněte místo a náhled spusťte znovu.",
  "chatImport.tab": "Import chatů",
  "chatImport.title": "Importovat chaty z OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop udržuje vlastní databázi chatů. Zobrazte náhled a zkopírujte kompatibilní místní chaty z OpenCode beze změny zdroje a bez nahrazení stávajících chatů Classic. Sem se můžete kdykoli vrátit z nastavení.",
  "chatImport.scope":
    "Před importem zavřete OpenCode. Tím se zkopírují dokončené místní chaty a jejich historie. Chaty ve frontě, probíhající a chaty pracovních prostorů jsou vyloučeny. Přihlašovací údaje, oprávnění, příkazy projektu, externí soubory a snapshoty zpět nejsou importovány. Přihlaste se zvlášť a ponechte složky projektů na původních cestách.",
  "chatImport.localOnly":
    "Pro import chatů vyberte vestavěný místní desktopový server. Tento importér nepodporuje vzdálená připojení a připojení k serverům na pozadí.",
  "chatImport.detect": "Zkontrolovat výchozí databázi OpenCode",
  "chatImport.browse": "Vybrat soubor databáze",
  "chatImport.confirm": "Importovat způsobilé chaty",
  "chatImport.busy":
    "Kontrolují se nebo importují chaty. Před zavřením aplikace počkejte.",
  "chatImport.noSource":
    "Nebyla nalezena ani vybrána žádná databáze. Pokračujte výběrem svého souboru OpenCode .db.",
  "chatImport.complete":
    "Import dokončen. Otevřete původní složku projektu a najdete její chaty. Opakovaný import přeskočí ID chatů, které už v Classic jsou.",
  "chatImport.source": "Zdrojová databáze",
  "chatImport.destination": "Databáze Classic",
  "chatImport.total": "Chaty ve zdroji",
  "chatImport.eligible": "Připraveno k importu",
  "chatImport.existing": "Již existuje",
  "chatImport.excluded": "Vyloučeno (ve frontě, probíhá nebo pracovní prostor)",
  "chatImport.imported": "Importováno",
  "chatImport.error.unavailable":
    "Import je dostupný jen pro vestavěný linuxový desktopový server po dokončení jeho startu.",
  "chatImport.error.incompatible":
    "Databáze mají odlišná nebo nepodporovaná schémata. Použijte kompatibilní a aktuální verze OpenCode a Classic a náhled spusťte znovu. Starší úložiště JSON není podporováno; zdroj nebyl zmigrován.",
  "chatImport.error.invalid":
    "Databázi nelze přečíst nebo validovat. Zkontrolujte vybraný soubor, oprávnění a dostupné místo na disku. Nepotvrzený import se vrací zpět; před novým pokusem spusťte náhled znovu.",
  "chatImport.error.sameFile":
    "Zdroj a cíl jsou stejná databáze. Kopírování není nutné.",
  "chatImport.error.conflict":
    "Konfliktní ID projektů nebo zpráv tomuto importu zabránila. Žádný částečný import nebyl potvrzen. Stávající chaty Classic byly zachovány.",
  "chatImport.error.busy":
    "Databáze je zaneprázdněná, nebo operace trvala příliš dlouho. Zavřete OpenCode, počkejte na dokončení ostatních importů a náhled spusťte znovu. Nový pokus přeskočí už potvrzené chaty.",
  "chatImport.error.expired":
    "Tento náhled vypršel nebo se jeho zdroj změnil. Před importem spusťte náhled databáze znovu.",
}
