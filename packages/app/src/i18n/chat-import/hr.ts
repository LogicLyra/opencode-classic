export const dict = {
  "profileImport.mode": "Način uvoza",
  "profileImport.chats": "Samo razgovori",
  "profileImport.everything": "Sve (potpuno postavljanje)",
  "profileImport.description":
    "Kopira vašu kompatibilnu OpenCode postavku u prazan profil Classic radne površine: razgovore, podatke za prijavu pružatelja usluga, račune u oblaku, dozvole, globalnu konfiguraciju, agente, skills, dodatke, planove, snapshotove i datoteke radnih prostora. Izvor ostaje nepromijenjen. Pretpregled ne izvršava uvezene naredbe i ne kontaktira pružatelje usluga.",
  "profileImport.boundaries":
    "Prvo zatvorite OpenCode i prestanite uređivati njegove datoteke. Mape projekata izvan OpenCode pohrane ostaju na svojim izvornim putanjama. Varijable okoline, alati instalirani u sustavu i upstream postavke prozora radne površine se ne kopiraju. Zapisi, predmemorije i brave procesa se ponovno generiraju. OAuth pružatelji usluga mogu zahtijevati ponovnu prijavu. Prilagođene mape odabiru se ovim redoslijedom: podaci, konfiguracija, zatim stanje.",
  "profileImport.detect": "Pretpregled zadane postavke",
  "profileImport.browse": "Odaberi mape postavke",
  "profileImport.busy":
    "Potpuna postavka se provjerava ili priprema. Držite Classic otvorenim dok se to ne završi.",
  "profileImport.cancelled":
    "Nije pronađen kompatibilan izvor ili je odabir mapa otkazan.",
  "profileImport.staged":
    "Postavka je pripremljena i provjerena. Ponovno pokrenite Classic da biste je aktivirali prije nego što se njegov poslužitelj pokrene. Ne dodajte podatke u Classic prije ponovnog pokretanja; aktivacija ponovno provjerava da je odredište prazno.",
  "profileImport.activated":
    "Potpuna postavka uspješno je aktivirana. Mape vaših projekata ostaju dostupne na svojim izvornim putanjama; uvezeni unutarnji radni prostori imaju neovisne kopije.",
  "profileImport.data": "Mapa podataka izvora",
  "profileImport.config": "Mapa konfiguracije izvora",
  "profileImport.state": "Mapa stanja izvora",
  "profileImport.providers": "Spremljeni podaci za prijavu pružatelja usluga",
  "profileImport.accounts": "Računi u oblaku",
  "profileImport.workspaces": "Radni prostori",
  "profileImport.files": "Datoteke i poveznice",
  "profileImport.bytes": "Veličina kopiranja (bajtovi)",
  "profileImport.plugins": "Konfigurirani dodaci",
  "profileImport.mcp": "MCP unosi",
  "profileImport.commands": "Naredbe projekta",
  "profileImport.permissions": "Zapisi dozvola",
  "profileImport.pending": "Odgođeni upiti",
  "profileImport.git": "Git ispravke",
  "profileImport.consent":
    "Zatvorio sam OpenCode i vjerujem ovoj potpunoj postavci, uključujući podatke za prijavu, osvježavanje računa, ovisnosti, dodatke, MCP poslužitelje, naredbe projekta, Git udice i postojeće dozvole. Ti se mogu izvoditi tijekom normalne uporabe nakon aktivacije. Odgođeni upiti ostaju u redu čekanja dok se ne nastave.",
  "profileImport.confirm": "Pripremi potpunu postavku",
  "profileImport.restart": "Ponovno pokreni i aktiviraj postavku",
  "profileImport.error.unavailable":
    "Potpuni uvoz zahtijeva ugrađeni Linux poslužitelj radne površine i konfiguraciju temeljenu na datotekama. Konfiguraciju ili zaobilaženja autentifikacije iz okoline potrebno je ukloniti prije uvoza.",
  "profileImport.error.nonempty":
    "Classic već sadrži podatke postavke. Potpuni uvoz ih ne prepisuje. Koristite Samo razgovori za spajanje kompatibilnih razgovora ili počnite s praznim profilom Classic.",
  "profileImport.error.incompatible":
    "Shema baze podataka izvora ne odgovara ovoj verziji Classica. Potpuni uvoz zahtijeva kompatibilnu SQLite postavku; migracija izvora nije pokušana.",
  "profileImport.error.invalid":
    "Postavku nije bilo moguće provjeriti. Provjerite dozvole datoteka, integritet baze podataka i sintaksu konfiguracije. Pokrenuti profil Classic nije zamijenjen.",
  "profileImport.error.changed":
    "Izvor se promijenio ili je ovaj pretpregled istekao. Zatvorite OpenCode i druge procese koji pišu, a zatim ponovno pokrenite pretpregled.",
  "profileImport.error.busy":
    "Drugi uvoz, aktivna brava datoteke ili odgođena aktivacija sprječavaju ovu radnju. Zatvorite OpenCode i ponovno pokrenite Classic prije ponovnog pokušaja.",
  "profileImport.liveWarning":
    "Čini se da je OpenCode trenutačno pokrenut. Njegova baza podataka neprestano se mijenja, pa priprema može uspjeti ili ne. Zatvorite OpenCode (sve prozore) i zaustavite njegove poslužitelje prije potvrđivanja radi pouzdanog uvoza.",
  "profileImport.detail.count": "Zahvaćene stavke: {{count}}",
  "profileImport.materialized": "Kopirane vanjske poveznice",
  "profileImport.skipped": "Preskočene izvršne datoteke",
  "profileImport.error.source-busy":
    "U izvor se neprestano piše (vjerojatno radi instanca OpenCodea). Zatvorite OpenCode i njegove poslužitelje, a zatim ponovno izvršite pretpregled i potvrdu.",
  "profileImport.error.links":
    "Postavka sadrži poveznicu koju nije moguće kopirati: ciklus simboličkih poveznica ili poveznica unutar Git metapodataka gdje kopije moraju ostati točne.",
  "profileImport.error.git-objects":
    "Git metapodaci postavke koriste nepodržani raspored (alternates unosi, worktree pokazivači ili spremišta objekata koja nije moguće sigurno privatizirati).",
  "profileImport.error.special-files":
    "Postavka sadrži čvorove uređaja ili druge posebne datoteke koje nije moguće sigurno kopirati.",
  "profileImport.error.limit":
    "Postavka premašuje ograničenje uvoza (50 GiB ili 500 000 stavki). Uklonite velike sigurnosne kopije ili suzite mape, a zatim ponovno pokrenite pretpregled.",
  "profileImport.error.oversized-file":
    "Konfiguracijska ili metapodatkovna datoteka premašuje svoje ograničenje čitanja (64 MB za konfiguracije, 16 MB za Git metapodatke). Podijelite je ili smanjite, a zatim ponovno pokrenite pretpregled.",
  "profileImport.error.unsupported":
    "Ova postavka sadrži nepodržane poveznice, cikličke Git alternates objekte, posebne datoteke ili premašuje ograničenje uvoza (50 GiB / 500 000 stavki). Vanjske simboličke poveznice potrebno je materializirati prije uvoza; izvorne datoteke nisu promijenjene.",
  "profileImport.error.space":
    "Nema dovoljno slobodnog prostora na disku za pripremu ove postavke. Oslobodite prostor i ponovno pokrenite pretpregled.",
  "chatImport.tab": "Uvoz razgovora",
  "chatImport.title": "Uvezi razgovore iz OpenCodea",
  "chatImport.description":
    "OpenCode Classic Desktop drži zasebnu bazu podataka razgovora. Pretpregledajte i kopirajte kompatibilne lokalne razgovore iz OpenCodea bez mijenjanja izvora i bez zamjene postojećih razgovora Classica. Ovamo se možete vratiti iz postavki u bilo kojem trenutku.",
  "chatImport.scope":
    "Zatvorite OpenCode prije uvoza. Time se kopiraju dovršeni lokalni razgovori i njihova povijest. Razgovori u redu čekanja, u tijeku i razgovori radnih prostora isključeni su. Podaci za prijavu, dozvole, naredbe projekta, vanjske datoteke i snapshoti vraćanja ne uvoze se. Prijavite se zasebno i zadržite mape projekata na njihovim izvornim putanjama.",
  "chatImport.localOnly":
    "Za uvoz razgovora odaberite ugrađeni lokalni poslužitelj radne površine. Ovaj uvoznik ne podržava udaljena povezivanja i poslužitelje u pozadini.",
  "chatImport.detect": "Provjeri zadanu OpenCode bazu podataka",
  "chatImport.browse": "Odaberi datoteku baze podataka",
  "chatImport.confirm": "Uvezi prikladne razgovore",
  "chatImport.busy":
    "Provjera ili uvoz razgovora. Pričekajte prije zatvaranja aplikacije.",
  "chatImport.noSource":
    "Baza podataka nije pronađena ili odabrana. Odaberite svoju OpenCode .db datoteku za nastavak.",
  "chatImport.complete":
    "Uvoz je dovršen. Otvorite izvornu mapu projekta da biste pronašli njegove razgovore. Ponovljeni uvoz preskače ID-jeve razgovora koji već postoje u Classicu.",
  "chatImport.source": "Izvorna baza podataka",
  "chatImport.destination": "Classic baza podataka",
  "chatImport.total": "Razgovori u izvoru",
  "chatImport.eligible": "Spremno za uvoz",
  "chatImport.existing": "Već postoji",
  "chatImport.excluded": "Isključeno (u redu čekanja, u tijeku ili radni prostor)",
  "chatImport.imported": "Uvezeno",
  "chatImport.error.unavailable":
    "Uvoz je dostupan samo za ugrađeni Linux poslužitelj radne površine nakon što završi pokretanje.",
  "chatImport.error.incompatible":
    "Baze podataka imaju različite ili nepodržane sheme. Koristite kompatibilne i ažurirane verzije OpenCodea i Classica, a zatim ponovno pokrenite pretpregled. Zastarjelo JSON pohranjivanje nije podržano; izvor nije migriran.",
  "chatImport.error.invalid":
    "Bazu podataka nije bilo moguće pročitati ili provjeriti. Provjerite odabranu datoteku, dozvole i dostupni prostor na disku. Nepotvrđeni uvoz se poništava; prije ponovnog pokušaja ponovno pokrenite pretpregled.",
  "chatImport.error.sameFile":
    "Izvor i odredište su ista baza podataka. Kopiranje nije potrebno.",
  "chatImport.error.conflict":
    "ID-jevi projekata ili poruka u sukobu spriječili su ovaj uvoz. Nijedan djelomični uvoz nije potvrđen. Postojeći razgovori Classica sačuvani su.",
  "chatImport.error.busy":
    "Baza podataka je zauzeta ili je operacija trajala predugo. Zatvorite OpenCode, pričekajte da se drugi uvozi završe, a zatim ponovno pokrenite pretpregled. Ponovni pokušaj preskače već potvrđene razgovore.",
  "chatImport.error.expired":
    "Ovaj pretpregled je istekao ili mu se izvor promijenio. Prije uvoza ponovno pokrenite pretpregled baze podataka.",
}
