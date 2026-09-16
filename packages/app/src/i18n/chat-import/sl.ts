export const dict = {
  "profileImport.mode": "Način uvažanja",
  "profileImport.chats": "Samo klepeti",
  "profileImport.everything": "Vse (popolna namestitev)",
  "profileImport.description":
    "Kopira vašo združljivo namestitev OpenCode v prazen namizni profil Classic: klepete, prijavne podatke ponudnikov, oblačne račune, dovoljenja, splošno nastavitveno datoteko, agenti, skills, vtičnike, načrte, posnetke in datoteke delovnih prostorov. Vir ostane nespremenjen. Predogled ne izvede uvoženih ukazov in ne stopi v stik s ponudniki.",
  "profileImport.boundaries":
    "Najprej zaprite OpenCode in nehajte urejati njegove datoteke. Projektne mape izven hrambe OpenCode ostanejo na svojih izvornih poteh. Spremenljivke okolja, v sistem nameščena orodja in navidezne nastavitve oknov namizja upstream se ne kopirajo. Dnevniki, predpomnilniki in zaklepi procesov se ustvarijo znova. Ponudniki OAuth lahko zahtevajo novo prijavo. Lastne mape se izberejo v tem vrstnem redu: podatki, nastavitvena datoteka in nato stanje.",
  "profileImport.detect": "Predogled privzete namestitve",
  "profileImport.browse": "Izberi mape namestitve",
  "profileImport.busy":
    "Popolna namestitev se preverja ali pripravlja. Classic držite odprte, dokler se to ne zaključi.",
  "profileImport.cancelled":
    "Združljiv vir ni bil najden ali je bila izbira map preklicana.",
  "profileImport.staged":
    "Namestitev je pripravljena in preverjena. Znova zaženite Classic, da jo aktivirate, preden se zažene njegov strežnik. Pred ponovnim zagonom ne dodajajte podatkov v Classic; aktivacija znova preveri, da je cilj prazen.",
  "profileImport.activated":
    "Popolna namestitev je bila uspešno aktivirana. Vaše projektne mape ostanejo dosegljive na svojih izvornih poteh; uvoženi notranji delovni prostori imajo neodvisne kopije.",
  "profileImport.data": "Mapa podatkov vira",
  "profileImport.config": "Mapa nastavitvene datoteke vira",
  "profileImport.state": "Mapa stanja vira",
  "profileImport.providers": "Shranjeni prijavni podatki ponudnikov",
  "profileImport.accounts": "Oblačni računi",
  "profileImport.workspaces": "Delovni prostori",
  "profileImport.files": "Datoteke in povezave",
  "profileImport.bytes": "Velikost kopiranja (bajti)",
  "profileImport.plugins": "Nastavljeni vtičniki",
  "profileImport.mcp": "Vnosi MCP",
  "profileImport.commands": "Ukazi projekta",
  "profileImport.permissions": "Vnosi dovoljenj",
  "profileImport.pending": "Čakajoči pozivi",
  "profileImport.git": "Prevzemi Git",
  "profileImport.consent":
    "Zaprl sem OpenCode in zaupam tej popolni namestitvi, vključno s prijavnimi podatki, osveževanjem računov, odvisnostmi, vtičniki, strežniki MCP, ukazi projekta, haciki Git in obstoječimi dovoljenji. Ti se lahko izvajajo med navadno uporabo po aktivaciji. Čakajoči pozivi ostanejo v vrsti, dokler se nadaljujejo.",
  "profileImport.confirm": "Pripravi popolno namestitev",
  "profileImport.restart": "Znova zaženi in aktiviraj namestitev",
  "profileImport.error.unavailable":
    "Popoln uvoz zahteva vgrajen namizni strežnik Linux in nastavitve, temelječe na datotekah. Iz okolja podane nastavitve ali prevzeme overjanja je pred uvozom treba odstraniti.",
  "profileImport.error.nonempty":
    "Classic že vsebuje podatke namestitve. Popoln uvoz jih ne prepiše. Uporabite Samo klepeti za spajanje združljivih pogovorov ali začnite s praznim profilom Classic.",
  "profileImport.error.incompatible":
    "Shema zbirke podatkov vira ne ustreza tej različici Classica. Popoln uvoz zahteva združljivo namestitev SQLite; preseljevanje vira ni bilo poskušeno.",
  "profileImport.error.invalid":
    "Namestitve ni bilo mogoče preveriti. Preverite dovoljenja datotek, celovitost zbirke podatkov in skladnjo nastavitve. Trenutni profil Classic ni bil zamenjan.",
  "profileImport.error.changed":
    "Vir se je spremenil ali je ta predogled potekel. Zaprite OpenCode in druge pisalne procese ter znova izvedite predogled.",
  "profileImport.error.busy":
    "Drug uvoz, aktiven zaklep datoteke ali čakajoča aktivacija preprečujeta to dejanje. Zaprite OpenCode in znova zaženite Classic, preden poskusite znova.",
  "profileImport.liveWarning":
    "Zdi se, da OpenCode zdaj teče. Njegova zbirka podatkov se neprestano spreminja, zato priprava lahko spodleti. Zaprite OpenCode (vsa okna) in ustavite njegove strežnike, preden potrdite, za zanesljiv uvoz.",
  "profileImport.detail.count": "Prizadeti elementi: {{count}}",
  "profileImport.materialized": "Skopirane zunanje povezave",
  "profileImport.skipped": "Preskočene izvedbene datoteke",
  "profileImport.error.source-busy":
    "V vir se neprestano piše (verjetno teče primerek OpenCode). Zaprite OpenCode in njegove strežnike ter nato znova izvedite predogled in potrditev.",
  "profileImport.error.links":
    "Namestitev vsebuje povezavo, ki je ni mogoče kopirati: cikel simbolnih povezav ali povezava znotraj metapodatkov Git, kjer morajo kopije ostati točne.",
  "profileImport.error.git-objects":
    "Metapodatki Git v namestitvi uporabljajo nepodprto postavitev (vnosi alternates, kazalci worktree ali shrambe predmetov, ki jih ni mogoče varno privatizirati).",
  "profileImport.error.special-files":
    "Namestitev vsebuje vozlišča naprav ali druge posebne datoteke, ki jih ni mogoče varno kopirati.",
  "profileImport.error.limit":
    "Namestitev presega mejo uvoza (50 GiB ali 500 000 elementov). Odstranite velike datoteke varnostnih kopij ali zožite mape in znova izvedite predogled.",
  "profileImport.error.oversized-file":
    "Nastavitvena ali metapodatkovna datoteka presega svojo mejo branja (64 MB za nastavitve, 16 MB za metapodatke Git). Razdelite jo ali pomanjšajte in znova izvedite predogled.",
  "profileImport.error.unsupported":
    "Ta namestitev vsebuje nepodprte povezave, ciklične alternates predmetov Git, posebne datoteke ali presega mejo uvoza (50 GiB / 500 000 elementov). Zunanje simbolne povezave je treba pred uvozom materializirati; izvorne datoteke niso bile spremenjene.",
  "profileImport.error.space":
    "Za pripravo te namestitve ni dovolj prostora na disku. Sprostite prostor in znova izvedite predogled.",
  "chatImport.tab": "Uvoz klepetov",
  "chatImport.title": "Uvozi klepete iz OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop ima svojo ločeno zbirko podatkov klepetov. Predoglednite in kopirajte združljive krajevne klepete iz OpenCode, ne da bi spremenili vir ali zamenjali obstoječe klepete Classica. Sem se lahko kadarkoli vrnete iz nastavitev.",
  "chatImport.scope":
    "Pred uvozom zaprite OpenCode. To kopira dokončane krajevne klepete in njihovo zgodovino. Klepeti v vrsti, v teku in klepeti delovnih prostorov so izključeni. Prijavni podatki, dovoljenja, ukazi projekta, zunanje datoteke in posnetki razveljavitve se ne uvozijo. Prijavite se ločeno in ohranite projektne mape na njihovih izvornih poteh.",
  "chatImport.localOnly":
    "Za uvoz klepetov izberite vgrajeni krajevni namizni strežnik. Ta uvoznik ne podpira oddaljenih povezav in povezav do strežnikov v ozadju.",
  "chatImport.detect": "Preveri privzeto zbirko podatkov OpenCode",
  "chatImport.browse": "Izberi datoteko zbirke podatkov",
  "chatImport.confirm": "Uvozi primerne klepete",
  "chatImport.busy":
    "Preverjanje ali uvažanje klepetov. Počakajte, preden zaprete aplikacijo.",
  "chatImport.noSource":
    "Zbirka podatkov ni bila najdena ali izbrana. Za nadaljevanje izberite svojo datoteko OpenCode .db.",
  "chatImport.complete":
    "Uvoz je zaključen. Odprite izvorno projektno mapo, da najdete njene klepete. Ponovljeni uvoz preskoči ID-je klepetov, ki so že v Classicu.",
  "chatImport.source": "Izvorna zbirka podatkov",
  "chatImport.destination": "Zbirka podatkov Classic",
  "chatImport.total": "Klepeta v viru",
  "chatImport.eligible": "Pripravljeni za uvoz",
  "chatImport.existing": "Že obstoječi",
  "chatImport.excluded": "Izključeni (v vrsti, v teku ali delovni prostor)",
  "chatImport.imported": "Uvoženi",
  "chatImport.error.unavailable":
    "Uvoz je na voljo samo za vgrajeni namizni strežnik Linux, ko zaključi zagon.",
  "chatImport.error.incompatible":
    "Zbirki podatkov imata različni ali nepodprti shemi. Uporabite združljive in posodobljene različici OpenCode in Classica ter znova izvedite predogled. Opuščena shramba JSON ni podprta; vir ni bil preseljen.",
  "chatImport.error.invalid":
    "Zbirke podatkov ni bilo mogoče prebrati ali preveriti. Preverite izbrano datoteko, dovoljenja in razpoložljiv prostor na disku. Nepotrjen uvoz se povrne; pred ponovnim poskusom znova izvedite predogled.",
  "chatImport.error.sameFile":
    "Vir in cilj sta ista zbirka podatkov. Kopiranje ni potrebno.",
  "chatImport.error.conflict":
    "Nasprotujoči ID-ji projektov ali sporočil so preprečili ta uvoz. Noben delni uvoz ni bil potrjen. Obstoječi klepeti Classica so bili ohranjeni.",
  "chatImport.error.busy":
    "Zbirka podatkov je zasedena ali je operacija trajala predolgo. Zaprite OpenCode, počakajte, da se drugi uvozi zaključijo, in znova izvedite predogled. Nov poskus preskoči že potrjene klepete.",
  "chatImport.error.expired":
    "Ta predogled je potekel ali se je njegov vir spremenil. Pred uvozom znova izvedite predogled zbirke podatkov.",
}
