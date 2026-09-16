export const dict = {
  "profileImport.mode": "Importálási mód",
  "profileImport.chats": "Csak csevegések",
  "profileImport.everything": "Minden (teljes beállítás)",
  "profileImport.description":
    "A kompatibilis OpenCode-beállítást egy üres Classic asztali profilba másolja: csevegések, szolgáltatók bejelentkezési adatai, felhőfiókok, engedélyek, globális konfiguráció, ügynökök, skills, bővítmények, tervek, pillanatképek és munkaterület-fájlok. A forrás változatlan marad. Az előnézet nem futtat importált parancsokat, és nem lép kapcsolatba szolgáltatókkal.",
  "profileImport.boundaries":
    "Először zárja be az OpenCode-ot, és hagyja abba a fájljainak szerkesztését. Az OpenCode-tárolón kívüli projektmappák az eredeti útvonalaikon maradnak. Környezeti változók, rendszerre telepített eszközök és az upstream asztali ablakbeállítások nem másolódnak. Naplók, gyorsítótárak és folyamatzárok újra generálódnak. Az OAuth-szolgáltatók újbóli bejelentkezést igényelhetnek. Egyéni mappák ebben a sorrendben választhatók ki: adatok, konfiguráció, majd állapot.",
  "profileImport.detect": "Alapértelmezett beállítás előnézete",
  "profileImport.browse": "Beállítási mappák kiválasztása",
  "profileImport.busy":
    "A teljes beállítás ellenőrzése vagy előkészítése folyik. Tartsa nyitva a Classicot, amíg ez be nem fejeződik.",
  "profileImport.cancelled":
    "Nem található kompatibilis forrás, vagy a mappakiválasztás megszakadt.",
  "profileImport.staged":
    "A beállítás előkészítve és ellenőrizve. Indítsa újra a Classicot az aktiválásához, mielőtt annak kiszolgálója elindul. Ne adjon adatokat a Classichoz újraindítás előtt; az aktiválás újra ellenőrzi, hogy a cél üres.",
  "profileImport.activated":
    "A teljes beállítás sikeresen aktiválva. A projektmappái eredeti útvonalaikon érhetők el; az importált belső munkaterületek független másolatokat kapnak.",
  "profileImport.data": "Forrás adatmappája",
  "profileImport.config": "Forrás konfigurációs mappája",
  "profileImport.state": "Forrás állapotmappája",
  "profileImport.providers": "Tárolt szolgáltatói bejelentkezési adatok",
  "profileImport.accounts": "Felhőfiókok",
  "profileImport.workspaces": "Munkaterületek",
  "profileImport.files": "Fájlok és linkek",
  "profileImport.bytes": "Másolás mérete (bájt)",
  "profileImport.plugins": "Beállított bővítmények",
  "profileImport.mcp": "MCP-bejegyzések",
  "profileImport.commands": "Projektparancsok",
  "profileImport.permissions": "Engedélybejegyzések",
  "profileImport.pending": "Függő promptok",
  "profileImport.git": "Git-checkoutok",
  "profileImport.consent":
    "Bezártam az OpenCode-ot, és megbízom ebben a teljes beállításban, beleértve a bejelentkezési adatokat, a fiókok frissítését, a függőségeket, a bővítményeket, az MCP-kiszolgálókat, a projektparancsokat, a Git-horgonyokat és a meglévő engedélyeket. Ezek az aktiválás után normál használat közben futhatnak. A függő promptok várólistán maradnak, amíg vissza nem folytatódnak.",
  "profileImport.confirm": "Teljes beállítás előkészítése",
  "profileImport.restart": "Újraindítás és a beállítás aktiválása",
  "profileImport.error.unavailable":
    "A teljes importálás a beépített Linux asztali kiszolgálót és fájlalapú konfigurációt igényel. A környezetből származó konfigurációt vagy hitelesítési felülbírálásokat importálás előtt el kell távolítani.",
  "profileImport.error.nonempty":
    "A Classic már tartalmaz beállítási adatokat. A teljes importálás nem írja felül őket. Használja a Csak csevegések lehetőséget kompatibilis társalgások egyesítéséhez, vagy kezdjen üres Classic profillal.",
  "profileImport.error.incompatible":
    "A forrásadatbázis sémája nem egyezik ezzel a Classic-verzióval. A teljes importálás kompatibilis SQLite-beállítást igényel; a forrás migrálása nem történt meg.",
  "profileImport.error.invalid":
    "A beállítást nem sikerült ellenőrizni. Ellenőrizze a fájlengedélyeket, az adatbázis épségét és a konfiguráció szintaxisát. A futó Classic profil nem lett lecserélve.",
  "profileImport.error.changed":
    "A forrás megváltozott, vagy ez az előnézet lejárt. Zárja be az OpenCode-ot és az egyéb író folyamatokat, majd nézze újra az előnézetet.",
  "profileImport.error.busy":
    "Egy másik importálás, aktív fájlzár vagy függőben lévő aktiválás akadályozza ezt a műveletet. Zárja be az OpenCode-ot, és indítsa újra a Classicot, mielőtt újra próbálkozik.",
  "profileImport.liveWarning":
    "Úgy tűnik, az OpenCode most fut. Az adatbázisa folyamatosan változik, ezért az előkészítés meghiúsulhat. Zárja be az OpenCode-ot (minden ablakot), és állítsa le a kiszolgálóit, mielőtt megerősíti, a megbízható importálás érdekében.",
  "profileImport.detail.count": "Érintett elemek: {{count}}",
  "profileImport.materialized": "Átmásolt külső linkek",
  "profileImport.skipped": "Kihagyott futásidejű fájlok",
  "profileImport.error.source-busy":
    "A forrásba folyamatosan írnak (valószínűleg fut egy OpenCode-példány). Zárja be az OpenCode-ot és a kiszolgálóit, majd végezze újra az előnézetet és a megerősítést.",
  "profileImport.error.links":
    "A beállítás egy olyan linket tartalmaz, amely nem másolható: szimbolikus link ciklusa, vagy Git-metaadatokon belüli link, ahol a másolatoknak pontosnak kell maradniuk.",
  "profileImport.error.git-objects":
    "A beállítás Git-metaadatai nem támogatott elrendezést használnak (alternates-bejegyzések, worktree-mutatók vagy objektumtárak, amelyek nem biztonságosan privatizálhatók).",
  "profileImport.error.special-files":
    "A beállítás eszközcsomópontokat vagy más, nem biztonságosan másolható különleges fájlokat tartalmaz.",
  "profileImport.error.limit":
    "A beállítás meghaladja az importálási korlátot (50 GiB vagy 500 000 elem). Távolítson el nagy biztonsági mentési fájlokat vagy szűkítse a mappákat, majd nézze újra az előnézetet.",
  "profileImport.error.oversized-file":
    "Egy konfigurációs vagy metaadat-fájl meghaladja az olvasási korlátját (64 MB konfigurációkhoz, 16 MB Git-metaadatokhoz). Ossza fel vagy csökkentse, majd nézze újra az előnézetet.",
  "profileImport.error.unsupported":
    "Ez a beállítás nem támogatott linkeket, ciklikus Git-objektum-alternates-okat, különleges fájlokat tartalmaz, vagy meghaladja az importálási korlátot (50 GiB / 500 000 elem). A külső szimbolikus linkeket importálás előtt materializálni kell; a forrásfájlok nem változtak meg.",
  "profileImport.error.space":
    "Nincs elég szabad lemezterület ennek a beállításnak az előkészítéséhez. Szabadítson fel helyet, és nézze újra az előnézetet.",
  "chatImport.tab": "Csevegésimportálás",
  "chatImport.title": "Csevegések importálása az OpenCode-ból",
  "chatImport.description":
    "Az OpenCode Classic Desktop külön csevegésadatbázist tart. Előnézze és másolja át a kompatibilis helyi csevegések az OpenCode-ból a forrás módosítása vagy a meglévő Classic-csevegések cseréje nélkül. Bármikor visszatérhet ide a beállításokból.",
  "chatImport.scope":
    "Zárja be az OpenCode-ot importálás előtt. Ez a befejezett helyi csevegéseket és az előzményeiket másolja. A várólistán lévő, folyamatban lévő és munkaterületi munkamenetek kizárva. Bejelentkezési adatok, engedélyek, projektparancsok, külső fájlok és visszavonási pillanatképek nem importálódnak. Jelentkezzen be külön, és tartsa projektmappáit az eredeti útvonalaikon.",
  "chatImport.localOnly":
    "Csevegések importálásához válassza a beépített helyi asztali kiszolgálót. A távoli és háttérkiszolgálói kapcsolatokat ez az importáló nem támogatja.",
  "chatImport.detect": "Az alapértelmezett OpenCode-adatbázis ellenőrzése",
  "chatImport.browse": "Adatbázisfájl kiválasztása",
  "chatImport.confirm": "Alkalmas csevegések importálása",
  "chatImport.busy":
    "Csevegések ellenőrzése vagy importálása folyik. Várjon, mielőtt bezárja az alkalmazást.",
  "chatImport.noSource":
    "Nem található vagy nincs kiválasztva adatbázis. A folytatáshoz válassza ki az OpenCode .db fájlját.",
  "chatImport.complete":
    "Az importálás befejeződött. Nyissa meg az eredeti projektmappát a csevegések megtalálásához. Az ismételt importálás kihagyja azokat a csevegés-azonosítókat, amelyek már szerepelnek a Classicban.",
  "chatImport.source": "Forrásadatbázis",
  "chatImport.destination": "Classic-adatbázis",
  "chatImport.total": "Csevegések a forrásban",
  "chatImport.eligible": "Importálásra készek",
  "chatImport.existing": "Már jelen vannak",
  "chatImport.excluded": "Kizártak (várólistán, folyamatban vagy munkaterület)",
  "chatImport.imported": "Importálva",
  "chatImport.error.unavailable":
    "Az importálás csak a beépített Linux asztali kiszolgálóhoz érhető el, annak teljes indulása után.",
  "chatImport.error.incompatible":
    "Az adatbázisok sémái eltérőek vagy nem támogatottak. Használjon kompatibilis, naprakész OpenCode- és Classic-verziókat, majd nézze újra az előnézetet. Az örökölt JSON-tárolás nem támogatott; a forrás nem lett migrálva.",
  "chatImport.error.invalid":
    "Az adatbázist nem sikerült elolvasni vagy ellenőrizni. Ellenőrizze a kiválasztott fájlt, az engedélyeket és a rendelkezésre álló lemezterületet. A nem jóváhagyott importálás visszavonásra kerül; újrapróbálás előtt nézze újra az előnézetet.",
  "chatImport.error.sameFile":
    "A forrás és a cél ugyanaz az adatbázis. Nincs szükség másolásra.",
  "chatImport.error.conflict":
    "Ütköző projekt- vagy üzenetazonosítók akadályozták ezt az importálást. Részleges importálás nem lett jóváhagyva. A meglévő Classic-csevegések megőrizve.",
  "chatImport.error.busy":
    "Az adatbázis foglalt, vagy a művelet túl sokáig tartott. Zárja be az OpenCode-ot, várja meg, amíg más importálások befejeződnek, majd nézze újra az előnézetet. Az újrapróbálás kihagyja a már jóváhagyott csevegések.",
  "chatImport.error.expired":
    "Ez az előnézet lejárt, vagy a forrása megváltozott. Importálás előtt nézze újra az adatbázis előnézetét.",
}
