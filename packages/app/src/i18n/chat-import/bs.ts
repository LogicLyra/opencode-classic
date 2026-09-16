export const dict = {
  "profileImport.mode": "Režim uvoza",
  "profileImport.chats": "Samo razgovori",
  "profileImport.everything": "Sve (potpuno podešavanje)",
  "profileImport.description":
    "Kopira vaše kompatibilno OpenCode podešavanje u prazan profil Classic radne površine: razgovore, podatke za prijavu provajdera, račune u oblaku, dozvole, globalnu konfiguraciju, agente, skills, dodatke, planove, snapshotove i datoteke radnih prostora. Izvor ostaje nepromijenjen. Pregled ne izvršava uvezene naredbe i ne kontaktira provajdere.",
  "profileImport.boundaries":
    "Prvo zatvorite OpenCode i prestanite uređivati njegove datoteke. Mape projekata van OpenCode pohrane ostaju na svojim originalnim putanjama. Varijable okoline, alati instalirani na sistemu i upstream postavke prozora radne površine se ne kopiraju. Zapisnici, keš memorije i brave procesa se ponovo generišu. OAuth provajderi mogu zahtijevati ponovnu prijavu. Prilagođene mape se biraju ovim redoslijedom: podaci, konfiguracija, zatim stanje.",
  "profileImport.detect": "Pregled zadanog podešavanja",
  "profileImport.browse": "Odaberi mape podešavanja",
  "profileImport.busy":
    "Potpuno podešavanje se provjerava ili priprema. Držite Classic otvorenim dok se to ne završi.",
  "profileImport.cancelled":
    "Nije pronađen kompatibilan izvor ili je odabir mapa otkazan.",
  "profileImport.staged":
    "Podešavanje je pripremljeno i provjereno. Ponovo pokrenite Classic da biste ga aktivirali prije nego što se njegov server pokrene. Ne dodajte podatke u Classic prije ponovnog pokretanja; aktivacija ponovo provjerava da je odredište prazno.",
  "profileImport.activated":
    "Potpuno podešavanje je uspješno aktivirano. Mape vaših projekata ostaju dostupne na svojim originalnim putanjama; uvezeni unutrašnji radni prostori imaju nezavisne kopije.",
  "profileImport.data": "Mapa podataka izvora",
  "profileImport.config": "Mapa konfiguracije izvora",
  "profileImport.state": "Mapa stanja izvora",
  "profileImport.providers": "Sačuvani podaci za prijavu provajdera",
  "profileImport.accounts": "Računi u oblaku",
  "profileImport.workspaces": "Radni prostori",
  "profileImport.files": "Datoteke i linkovi",
  "profileImport.bytes": "Veličina kopiranja (bajtovi)",
  "profileImport.plugins": "Konfigurisani dodaci",
  "profileImport.mcp": "MCP unosi",
  "profileImport.commands": "Naredbe projekta",
  "profileImport.permissions": "Zapisi dozvola",
  "profileImport.pending": "Odgođeni upiti",
  "profileImport.git": "Git checkouti",
  "profileImport.consent":
    "Zatvorio sam OpenCode i vjerujem ovom potpunom podešavanju, uključujući podatke za prijavu, osvježavanje računa, zavisnosti, dodatke, MCP servere, naredbe projekta, Git udice i postojeće dozvole. Ti se mogu izvršavati tokom normalne upotrebe nakon aktivacije. Odgođeni upiti ostaju u redu čekanja dok se ne nastave.",
  "profileImport.confirm": "Pripremi potpuno podešavanje",
  "profileImport.restart": "Ponovo pokreni i aktiviraj podešavanje",
  "profileImport.error.unavailable":
    "Potpuni uvoz zahtijeva ugrađeni Linux server radne površine i konfiguraciju zasnovanu na datotekama. Konfiguraciju ili zaobilaženja autentifikacije iz okoline potrebno je ukloniti prije uvoza.",
  "profileImport.error.nonempty":
    "Classic već sadrži podatke podešavanja. Potpuni uvoz ih ne prepisuje. Koristite Samo razgovori za spajanje kompatibilnih razgovora ili počnite s praznim Classic profilom.",
  "profileImport.error.incompatible":
    "Šema baze podataka izvora ne odgovara ovoj verziji Classica. Potpuni uvoz zahtijeva kompatibilno SQLite podešavanje; migracija izvora nije pokušana.",
  "profileImport.error.invalid":
    "Podešavanje nije bilo moguće provjeriti. Provjerite dozvole datoteka, integritet baze podataka i sintaksu konfiguracije. Pokrenuti Classic profil nije zamijenjen.",
  "profileImport.error.changed":
    "Izvor se promijenio ili je ovaj pregled istekao. Zatvorite OpenCode i druge procese koji pišu, zatim ponovo pokrenite pregled.",
  "profileImport.error.busy":
    "Drugi uvoz, aktivna brava datoteke ili odgođena aktivacija sprječavaju ovu operaciju. Zatvorite OpenCode i ponovo pokrenite Classic prije ponovnog pokušaja.",
  "profileImport.liveWarning":
    "Čini se da je OpenCode trenutno pokrenut. Njegova baza podataka se neprestano mijenja, pa priprema može neuspjeti. Zatvorite OpenCode (sve prozore) i zaustavite njegove servere prije potvrđivanja radi pouzdanog uvoza.",
  "profileImport.detail.count": "Obuhvaćene stavke: {{count}}",
  "profileImport.materialized": "Kopirani vanjski linkovi",
  "profileImport.skipped": "Preskočene izvršne datoteke",
  "profileImport.error.source-busy":
    "U izvor se neprestano piše (vjerovatno radi instanca OpenCodea). Zatvorite OpenCode i njegove servere, zatim ponovo izvršite pregled i potvrdu.",
  "profileImport.error.links":
    "Podešavanje sadrži link koji nije moguće kopirati: ciklus simboličkih linkova ili link unutar Git metapodataka gdje kopije moraju ostati tačne.",
  "profileImport.error.git-objects":
    "Git metapodaci podešavanja koriste nepodržani raspored (alternates unosi, worktree pokazivači ili spremišta objekata koja nije moguće sigurno privatizovati).",
  "profileImport.error.special-files":
    "Podešavanje sadrži čvorove uređaja ili druge posebne datoteke koje nije moguće sigurno kopirati.",
  "profileImport.error.limit":
    "Podešavanje premašuje ograničenje uvoza (50 GiB ili 500 000 stavki). Uklonite velike sigurnosne kopije ili suzite mape, zatim ponovo pokrenite pregled.",
  "profileImport.error.oversized-file":
    "Konfiguracijska ili metapodatkovna datoteka premašuje svoje ograničenje čitanja (64 MB za konfiguracije, 16 MB za Git metapodatke). Podijelite je ili smanjite, zatim ponovo pokrenite pregled.",
  "profileImport.error.unsupported":
    "Ovo podešavanje sadrži nepodržane linkove, ciklične Git alternates objekte, posebne datoteke ili premašuje ograničenje uvoza (50 GiB / 500 000 stavki). Vanjske simboličke linkove potrebno je materializovati prije uvoza; izvorne datoteke nisu promijenjene.",
  "profileImport.error.space":
    "Nema dovoljno slobodnog prostora na disku za pripremu ovog podešavanja. Oslobodite prostor i ponovo pokrenite pregled.",
  "chatImport.tab": "Uvoz razgovora",
  "chatImport.title": "Uvezi razgovore iz OpenCodea",
  "chatImport.description":
    "OpenCode Classic Desktop drži zasebnu bazu podataka razgovora. Pregledajte i kopirajte kompatibilne lokalne razgovore iz OpenCodea bez mijenjanja izvora i bez zamjene postojećih razgovora Classica. Ovamo se možete vratiti iz postavki u bilo kojem trenutku.",
  "chatImport.scope":
    "Zatvorite OpenCode prije uvoza. Time se kopiraju dovršeni lokalni razgovori i njihova historija. Razgovori u redu čekanja, u toku i razgovori radnih prostora su isključeni. Podaci za prijavu, dozvole, naredbe projekta, vanjske datoteke i snapshoti vraćanja se ne uvoze. Prijavite se zasebno i zadržite mape projekata na njihovim originalnim putanjama.",
  "chatImport.localOnly":
    "Za uvoz razgovora odaberite ugrađeni lokalni server radne površine. Ovaj uvoznik ne podržava udaljene veze i servere u pozadini.",
  "chatImport.detect": "Provjeri zadanu OpenCode bazu podataka",
  "chatImport.browse": "Odaberi datoteku baze podataka",
  "chatImport.confirm": "Uvezi podobne razgovore",
  "chatImport.busy":
    "Provjera ili uvoz razgovora u toku. Pričekajte prije zatvaranja aplikacije.",
  "chatImport.noSource":
    "Baza podataka nije pronađena ili odabrana. Odaberite svoju OpenCode .db datoteku za nastavak.",
  "chatImport.complete":
    "Uvoz završen. Otvorite originalnu mapu projekta da biste pronašli njegove razgovore. Ponovljeni uvoz preskače ID-jeve razgovora koji već postoje u Classicu.",
  "chatImport.source": "Izvorna baza podataka",
  "chatImport.destination": "Classic baza podataka",
  "chatImport.total": "Razgovori u izvoru",
  "chatImport.eligible": "Spremno za uvoz",
  "chatImport.existing": "Već postoji",
  "chatImport.excluded": "Isključeno (u redu čekanja, u toku ili radni prostor)",
  "chatImport.imported": "Uvezeno",
  "chatImport.error.unavailable":
    "Uvoz je dostupan samo za ugrađeni Linux server radne površine nakon što završi pokretanje.",
  "chatImport.error.incompatible":
    "Baze podataka imaju različite ili nepodržane šeme. Koristite kompatibilne i ažurirane verzije OpenCodea i Classica, zatim ponovo pokrenite pregled. Zastarjelo JSON pohranjivanje nije podržano; izvor nije migriran.",
  "chatImport.error.invalid":
    "Bazu podataka nije bilo moguće pročitati ili provjeriti. Provjerite odabranu datoteku, dozvole i dostupni prostor na disku. Nepotvrđeni uvoz se poništava; prije ponovnog pokušaja ponovo pokrenite pregled.",
  "chatImport.error.sameFile":
    "Izvor i odredište su ista baza podataka. Kopiranje nije potrebno.",
  "chatImport.error.conflict":
    "ID-jevi projekata ili poruka u sukobu spriječili su ovaj uvoz. Nijedan djelimični uvoz nije potvrđen. Postojeći razgovori Classica su sačuvani.",
  "chatImport.error.busy":
    "Baza podataka je zauzeta ili je operacija trajala predugo. Zatvorite OpenCode, pričekajte da se drugi uvozi završe, zatim ponovo pokrenite pregled. Ponovni pokušaj preskače već potvrđene razgovore.",
  "chatImport.error.expired":
    "Ovaj pregled je istekao ili mu se izvor promijenio. Prije uvoza ponovo pokrenite pregled baze podataka.",
}
