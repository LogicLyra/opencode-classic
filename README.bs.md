<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">OpenCode je open source AI agent za programiranje.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic je neslužbeni fork orijentisan na Linux koji prati upstream; prema zadanim postavkama koristi klasični raspored radne površine, a preuređeni raspored ostaje dostupan u postavkama. Njegova izdanja i alat za ažuriranje održavaju se nezavisno u [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Odjeljci specifični za fork i veze za instalaciju u svakom prevedenom README-u održavaju se sinhronizovanim s engleskim; dublji sadržaj se nasljeđuje od upstreama i može kasniti.


<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### Prebacite svoju postavku iz OpenCodea

OpenCode Classic Desktop koristi zaseban profil za svoj ugrađeni server.
**Postavke > Uvoz chatova** i dijalog pri prvom pokretanju nude **Samo
chatove** i **Sve (potpuna postavka)**. Sljedeće ponašanje spajanja važi za
**Samo chatove**:
Pri prvom pokretanju, ili pod **Postavke > Uvoz chatova**, odaberite
**Provjeri zadatu OpenCode bazu podataka** ili izaberite `.db` datoteku.
Prvo zatvorite OpenCode, pregledajte izvor, odredište i brojeve, a zatim
odaberite **Uvezi podobne chatove**.

- Zadati izvor je `$XDG_DATA_HOME/opencode/opencode.db`, obično
  `~/.local/share/opencode/opencode.db`. Odaberite datoteku za prilagođene
  putanje ili baze podataka razvojnog kanala. Odredište je baza podataka
  aktivnog ugrađenog servera radne površine, u direktoriju `sidecar`
  profila radne površine za Classic. Ovaj uvoznik ne podržava udaljena ni
  eksperimentalne pozadinske serverske veze.
- Početni uvoznik podržava odgovarajuće SQLite šeme i historije migracija.
  Ne izvršava migracije izvornih datoteka i ne uvozi naslijeđeno JSON
  spremište. Ako provjere kompatibilnosti ne uspiju, koristite
  kompatibilne verzije OpenCodea i Classica i ponovo pokrenite pregled.
- Završeni lokalni chatovi zadržavaju svoje ID-ove, naslove, vremenske
  oznake, poruke, dijelove, v2 historiju, obaveze i izvorne putanje
  projekata. Postojeći ID-ovi chatova se preskaču u cijelosti; ponovni
  uvoz ne ažurira već uvezeni chat. Izvor je samo za čitanje, uključujući
  njegovu WAL historiju, a svaki uvoz se potvrđuje atomarno.
- Chatovi s promptima u redu čekanja, nezavršenim radom ili izričitim
  smještajem u radni prostor se isključuju i broje se. Uvoz nikada ne
  pokreće prompt niti izvršava naredbu. Prijavni podaci, stanje računa,
  date dozvole, naredbe projekata, vlasništvo dijeljenja, vanjski
  prilozi, Git snimke i nacrti radne površine se ne kopiraju. Prijavite
  se zasebno i držite mape projekata na njihovim izvornim putanjama.
  Historijske snimke opoziva nisu dostupne; ugrađeni podaci priloga
  ostaju u transkriptu, dok vanjske datoteke i dalje moraju postojati.
- Otvorite izvornu mapu projekta u Classicu da vidite njene uvezene
  chatove. Ovo je jednokratna kopija, a ne stalna sinhronizacija između
  aplikacija.

#### Sve (potpuna postavka)

Prvo zatvorite OpenCode i zaustavite druge procese koji pišu. Odaberite
**Pregledaj zadanu postavku**, ili **Odaberite mape postavke** i izaberite
OpenCodeove mape **podataka**, **konfiguracije** i **stanja**. One se
obično nalaze u `~/.local/share/opencode`, `~/.config/opencode` i
`~/.local/state/opencode`; XDG nadjačavanja se poštuju. Pregledajte
brojeve, potvrdite da vjerujete postavci, potvrdite u sistemskom
dijalogu, a zatim ponovo pokrenite Classic da aktivirate pripremljeni
profil.

- Zahtijeva prazan ugrađeni Linux profil za Classic. Postojeći chatovi,
  pružaoci usluga, prilagođene postavke, računi i registrovani projekti
  se nikada ne prepisuju. Generisane zadate konfiguracijske/pluginske
  datoteke prepoznaju se kao stanje početnog pokretanja.
- Kopira svih 19 tabela baze podataka aplikacije, `auth.json` pružalaca
  usluga, cloud račune, prijavne podatke integracija, dozvole,
  metapodatke dijeljenja, konfiguracijske datoteke (uključujući JSONC),
  agente, vještine, pluginse, stanje, planove, izlaz alata, datoteke
  radnih prostora i snimke. Neriješeni prompti ostaju u redu čekanja;
  uvoz ih ne izvršava.
- Vanjske putanje projekata ostaju nepromijenjene na istom računaru.
  Unutrašnje putanje, obrasci dozvola i ključevi snimki se remapiraju.
  Povezana radna stabla dobijaju privatne Git metapodatke, a alternati
  objekata snimki se materijalizuju, tako da kopije ne zavise od
  izvornih spremišta objekata.
- SQLite čita privatnu kopiju izvorne baze/WAL-a. Izvorna baza, WAL i
  datoteke dijeljene memorije se ostavljaju nepromijenjenima.
  Priprema koristi privatne dozvole i trajni dnevnik vlasništva.
  Aktivacija se dešava prije pokretanja ugrađenog servera i vraća
  prekinuta preimenovanja direktorija. Izvorni prazni/početni profil se
  zadržava pod `.profile-import-retained-<operation-id>` u profilu
  radne površine za Classic na uvid; ne briže se automatski.
- Prijavni podaci ostaju zaštićene lokalne datoteke. Potpuna postavka
  također čuva izvršivo ponašanje: osvježavanje računa, instalacija
  zavisnosti, plugini, MCP veze, naredbe projekata, Git hookovi/pomoćni
  programi i date dozvole mogu stupiti na snagu tokom normalne upotrebe
  nakon aktivacije. Uvozite samo postavku kojoj vjerujete. Rotacija
  OAuth tokena može zahtijevati ponovnu prijavu kada se koriste obje
  aplikacije.
- Zapisnici, keševi i zaključavanja procesa se regenerišu. Sistemski
  programi, varijable okruženja ljuske, uzvodne postavke prozora/bočne
  trake radne površine i nacrti radne površine se ne kopiraju. Vanjske
  datoteke projekata su već dijeljene na svojim izvornim putanjama.
  Otvorite izvornu mapu projekta da pristupite njenim chatovima.
- Zahtijeva odgovarajuću historiju migracija i šemu SQLitea. Potpuna
  postavka trenutno čita `opencode.db`; nadjačavanja baze/
  konfiguracije/prijave iz okruženja moraju se ukloniti prije upotrebe.
  Naslijeđena isključivo JSON spremišta, cikličke ili nepodržane
  reference Git objekata, čvorovi uređaja i profili preko 50 GiB ili
  500.000 stavki zaliha odbijaju se uz konkretan razlog. Vanjske
  simboličke veze se kopiraju u cijelosti (materijalizuju se); prekinute
  veze, utičnice i fifoi se preskaču i broje u sažetku. Podržavaju se
  konfiguracijske datoteke do 64 MB. Za pripremu je potreban dodatni
  prostor na disku.
- Zatvorite OpenCode prije uvoza. Pregled upozorava kada se otkrije
  pokrenuta instanca, kopije snimki se automatski ponavljaju, a izvor
  koji se kontinuirano piše prijavljuje namjensku grešku zauzetosti koja
  traži da ga zatvorite.

Samostalni Classic CLI i dalje koristi zadate XDG korijene OpenCodea,
osim ako ih ne nadjačate. Njegova naredba `uninstall` prema zadanim
postavkama čuva podatke, prijavne podatke, konfiguraciju, keš i stanje,
uključujući uz `--force`. Brisanje tih dijeljenih korijena zahtijeva
`--remove-shared-data`; `--keep-data` i `--keep-config` nadjačavaju taj
zahtjev za svoje korijene. Koristite `uninstall --dry-run` za pregled
putanja. Upstreamov vlastiti deinstalator i dalje može izbrisati
dijeljene CLI podatke. Fork odbija otvoriti baze podataka koje sadrže
nepoznate migracije; ažurirajte Classic umjesto uređivanja ili brisanja
dnevnika migracija.

### Instalacija

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> npm paket `opencode-ai` i postojeći paketi Homebrew, Scoop, Chocolatey, AUR i Nix distribuiraju uzvodni OpenCode, a ne OpenCode Classic.

### Aplikacija za radnu površinu (BETA)

Desktop izdanja OpenCode Classica podržavaju samo Linux i dostupna su sa [stranice izdanja forka](https://github.com/LogicLyra/opencode-classic/releases).

| Platforma  | Preuzimanje                                           |
| ---------- | ----------------------------------------------------- |
| Linux x64  | `opencode-classic-desktop-linux-*` (`.deb` ili `.rpm`) |

AppImage se namjerno ne distribuira. Ubuntu 24.04 i noviji mogu prisiliti Electron AppImage-ove da onemoguće Chromium sandboxing pod zadanom AppArmor politikom; instalirani deb i RPM formati zadržavaju integraciju sandboxa koju distribucija očekuje.

Održavaoci mogu reproducirati potpunu provjeru izdanja — izgradnju, pakovanje, test instaliranog deba i vizuelnu provjeru — pomoću [runbooka za QA izdanja na Linux VM-u](docs/linux-vm-qa.md).

#### Direktorij instalacije

Instalacijska skripta poštuje sljedeći redoslijed prioriteta za putanju instalacije:

1. `$OPENCODE_INSTALL_DIR` - Prilagođeni direktorij instalacije
2. `$XDG_BIN_DIR` - Putanja u skladu sa XDG Base Directory Specification
3. `$HOME/bin` - Standardni direktorij korisničkih binarnih datoteka (ako postoji ili se može kreirati)
4. `$HOME/.opencode/bin` - Zadati fallback

```bash
# Primjeri
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agenti

OpenCode uključuje dva ugrađena agenta između kojih možeš prebacivati tasterom `Tab`.

- **build** - Podrazumijevani agent sa punim pristupom za razvoj
- **plan** - Agent samo za čitanje za analizu i istraživanje koda
  - Podrazumijevano zabranjuje izmjene datoteka
  - Traži dozvolu prije pokretanja bash komandi
  - Idealan za istraživanje nepoznatih codebase-ova ili planiranje izmjena

Uključen je i **general** pod-agent za složene pretrage i višekoračne zadatke.
Koristi se interno i može se pozvati pomoću `@general` u porukama.

Saznaj više o [agentima](https://opencode.ai/docs/agents).

### Dokumentacija

Za više informacija o konfiguraciji OpenCode-a, [**pogledaj dokumentaciju**](https://opencode.ai/docs).

### Doprinosi

Ako želiš doprinositi OpenCode-u, pročitaj [upute za doprinošenje](./CONTRIBUTING.md) prije slanja pull requesta.

### Gradnja na OpenCode-u

Ako radiš na projektu koji je povezan s OpenCode-om i koristi "opencode" kao dio naziva, npr. "opencode-dashboard" ili "opencode-mobile", dodaj napomenu u svoj README da projekat nije napravio OpenCode tim i da nije povezan s nama.

---

**Pridruži se našoj zajednici** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
