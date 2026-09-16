<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">Otwartoźródłowy agent kodujący AI.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic to nieoficjalny, zorientowany na Linuksa fork śledzący upstream; domyślnie używa klasycznego układu pulpitu, a przeprojektowany układ pozostaje dostępny w ustawieniach. Jego wydania i aktualizator są utrzymywane niezależnie w [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Sekcje specyficzne dla forka i linki instalacyjne w każdym przetłumaczonym README są synchronizowane z angielskim; głębsza treść jest dziedziczona z upstreamu i może się wahać wstecz.


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

### Przenieś swoją konfigurację z OpenCode

OpenCode Classic Desktop używa osobnego profilu dla wbudowanego serwera.
**Ustawienia > Import czatów** i okno dialogowe pierwszego uruchomienia
oferują **Tylko czaty** i **Wszystko (pełna konfiguracja)**. Dla opcji
**Tylko czaty** obowiązuje następujące zachowanie scalania:
Przy pierwszym uruchomieniu albo w **Ustawienia > Import czatów** wybierz
**Sprawdź domyślną bazę danych OpenCode** albo wskaż plik `.db`. Najpierw
zamknij OpenCode, przejrzyj źródło, cel i liczby, a następnie wybierz
**Zaimportuj kwalifikujące się czaty**.

- Domyślnym źródłem jest `$XDG_DATA_HOME/opencode/opencode.db`, zwykle
  `~/.local/share/opencode/opencode.db`. Dla niestandardowych ścieżek lub
  baz danych kanału deweloperskiego wskaż plik. Celem jest baza danych
  aktywnego wbudowanego serwera pulpitu w katalogu `sidecar` profilu
  pulpitu Classic. Ten importer nie obsługuje połączeń zdalnych ani
  eksperymentalnych serwerów działających w tle.
- Początkowy importer obsługuje zgodne schematy SQLite i historie migracji.
  Nie migruje plików źródłowych ani nie importuje starszego magazynu JSON.
  Jeśli kontrole zgodności się nie powiodą, użyj zgodnych wersji OpenCode
  i Classic i ponownie wykonaj podgląd.
- Ukończone czaty lokalne zachowują swoje identyfikatory, tytuły, znaczniki
  czasu, wiadomości, części, historię v2, zadania i oryginalne ścieżki
  projektów. Istniejące identyfikatory czatów są pomijane w całości;
  ponowny import nie aktualizuje już zaimportowanego czatu. Źródło jest
  tylko do odczytu, łącznie z historią WAL, a każdy import jest zatwierdzany
  atomowo.
- Czaty z kolejkowanymi promptami, niedokończoną pracą lub jawnym
  umiejscowieniem w przestrzeni roboczej są wykluczane i liczone. Import
  nigdy nie uruchamia promptu ani nie wykonuje polecenia. Dane
  uwierzytelniające, stan konta, przyznane uprawnienia, polecenia
  projektu, własność udostępnień, zewnętrzne załączniki, migawki Git
  i wersje robocze pulpitu nie są kopiowane. Zaloguj się osobno i trzymaj
  foldery projektów w oryginalnych ścieżkach. Historyczne migawki cofania
  są niedostępne; osadzone dane załączników pozostają w transkrypcji,
  a pliki zewnętrzne muszą nadal istnieć.
- Otwórz oryginalny folder projektu w Classic, aby zobaczyć jego
  zaimportowane czaty. To jednorazowa kopia, a nie ciągła synchronizacja
  między aplikacjami.

#### Wszystko (pełna konfiguracja)

Najpierw zamknij OpenCode i zatrzymaj inne procesy zapisujące. Wybierz
**Podejrzyj domyślną konfigurację** albo **Wybierz foldery konfiguracji**
i wskaż foldery OpenCode: **dane**, **konfiguracja**, a następnie **stan**.
Zwykle mieszczą się w `~/.local/share/opencode`, `~/.config/opencode`
i `~/.local/state/opencode`; nadpisania XDG są respektowane. Przejrzyj
liczby, potwierdź, że ufasz tej konfiguracji, zatwierdź w natywnym oknie
dialogowym, a następnie uruchom Classic ponownie, aby aktywować przygotowany
profil.

- Wymaga pustego wbudowanego profilu Linux dla Classic. Istniejące czaty,
  dostawcy, ustawienia niestandardowe, konta i zarejestrowane projekty
  nigdy nie są nadpisywane. Wygenerowane domyślne pliki
  konfiguracji/wtyczek są rozpoznawane jako stan startowy.
- Kopiuje wszystkich 19 tabel bazy danych aplikacji, `auth.json`
  dostawców, konta chmurowe, dane uwierzytelniające integracji,
  uprawnienia, metadane udostępnień, pliki konfiguracyjne (w tym JSONC),
  agentów, umiejętności, wtyczki, stan, plany, wyniki narzędzi, pliki
  przestrzeni roboczych i migawki. Oczekujące prompty pozostają w kolejce;
  import ich nie wykonuje.
- Zewnętrzne ścieżki projektów pozostają niezmienione na tej samej
  maszynie. Ścieżki wewnętrzne, wzorce uprawnień i klucze migawek są
  mapowane na nowo. Powiązane drzewa robocze otrzymują prywatne
  metadane Git, a alternatywy obiektów migawek są materializowane, więc
  kopie nie zależą od oryginalnych magazynów obiektów.
- SQLite odczytuje prywatną kopię źródłowej bazy/WAL. Źródłowa baza, WAL
  i pliki pamięci współdzielonej pozostają niezmienione. Przygotowanie
  używa prywatnych uprawnień i trwałego dziennika własności. Aktywacja
  następuje przed startem wbudowanego serwera i odtwarza przerwane zmiany
  nazw katalogów. Oryginalny pusty/startowy profil jest zachowywany pod
  `.profile-import-retained-<operation-id>` w profilu pulpitu Classic do
  inspekcji; nie jest usuwany automatycznie.
- Dane uwierzytelniające pozostają chronionymi plikami lokalnymi. Pełna
  konfiguracja zachowuje również zachowanie wykonywalne: odświeżanie
  konta, instalacja zależności, wtyczki, połączenia MCP, polecenia
  projektu, hooki/pomocniki Git i przyznane uprawnienia mogą wchodzić
  w życie podczas normalnego użytkowania po aktywacji. Importuj tylko
  konfigurację, której ufasz. Rotacja tokenów OAuth może wymagać
  ponownego logowania przy korzystaniu z obu aplikacji.
- Dzienniki, pamięci podręczne i blokady procesów są generowane na nowo.
  Programy systemowe, zmienne środowiskowe powłoki, upstreamowe
  preferencje okien/paska bocznego pulpitu i wersje robocze pulpitu nie
  są kopiowane. Zewnętrzne pliki projektów są już współdzielone w
  oryginalnych ścieżkach. Otwórz oryginalny folder projektu, aby uzyskać
  dostęp do jego czatów.
- Wymaga zgodnej historii migracji i schematu SQLite. Pełna konfiguracja
  odczytuje obecnie `opencode.db`; dostarczone przez środowisko nadpisania
  bazy/konfiguracji/uwierzytelnień należy usunąć przed użyciem. Wyłącznie
  starsze magazyny JSON, cykliczne lub niewspierane odwołania do obiektów
  Git, węzły urządzeń oraz profile powyżej 50 GiB lub 500 000 pozycji
  inwentarza są odrzucane z konkretnym powodem. Zewnętrzne dowiązania
  symboliczne są kopiowane w całości (materializowane); zerwane
  dowiązania, gniazda i fifo są pomijane i liczone w podsumowaniu.
  Obsługiwane są pliki konfiguracyjne do 64 MB. Przygotowanie wymaga
  dodatkowego miejsca na dysku.
- Zamknij OpenCode przed importem. Podgląd ostrzega po wykryciu
  działającej instancji, kopie migawek są ponawiane automatycznie,
  a ciągle zapisywane źródło zgłasza dedykowany błąd zajętości z prośbą
  o jego zamknięcie.

Samodzielne CLI Classic nadal używa domyślnych katalogów głównych XDG
OpenCode, chyba że je nadpiszesz. Jego polecenie `uninstall` domyślnie
zachowuje dane, dane uwierzytelniające, konfigurację, pamięć podręczną
i stan, również z `--force`. Usunięcie tych współdzielonych katalogów
wymaga `--remove-shared-data`; `--keep-data` i `--keep-config` nadpisują
to żądanie dla odpowiednich katalogów. Użyj `uninstall --dry-run`, aby
przejrzeć ścieżki. Własny deinstalator upstreamu nadal może usuwać
współdzielone dane CLI. Fork odmawia otwierania baz danych z nieznanymi
migracjami; zaktualizuj Classic zamiast edytować lub usuwać dziennik
migracji.

### Instalacja

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> Pakiet npm `opencode-ai` oraz istniejące pakiety Homebrew, Scoop, Chocolatey, AUR i Nix dystrybuują upstreamowy OpenCode, a nie OpenCode Classic.

### Aplikacja desktopowa (BETA)

Wersje desktopowe OpenCode Classic obsługują wyłącznie Linuksa i są dostępne na [stronie wydań forka](https://github.com/LogicLyra/opencode-classic/releases).

| Platforma  | Pobieranie                                            |
| ---------- | ----------------------------------------------------- |
| Linux x64  | `opencode-classic-desktop-linux-*` (`.deb` lub `.rpm`) |

AppImage celowo nie jest dystrybuowany. Ubuntu 24.04 i nowsze mogą wymuszać wyłączenie piaskownicy Chromium przez AppImage'y Electrona przy domyślnej polityce AppArmor; zainstalowane formaty deb i RPM zachowują integrację piaskownicy oczekiwaną przez dystrybucję.

Opiekunowie mogą odtworzyć pełne sprawdzenie wydania — kompilację, pakowanie, test zainstalowanego deba i kontrolę wizualną — dzięki [runbookowi QA wydań na maszynie wirtualnej z Linuksem](docs/linux-vm-qa.md).

#### Katalog instalacji

Skrypt instalacyjny respektuje następującą kolejność priorytetów dla ścieżki instalacji:

1. `$OPENCODE_INSTALL_DIR` - Niestandardowy katalog instalacji
2. `$XDG_BIN_DIR` - Ścieżka zgodna z XDG Base Directory Specification
3. `$HOME/bin` - Standardowy katalog binariów użytkownika (jeśli istnieje lub można go utworzyć)
4. `$HOME/.opencode/bin` - Domyślna rezerwa

```bash
# Przykłady
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode zawiera dwóch wbudowanych agentów, między którymi możesz przełączać się klawiszem `Tab`.

- **build** - Domyślny agent z pełnym dostępem do pracy developerskiej
- **plan** - Agent tylko do odczytu do analizy i eksploracji kodu
  - Domyślnie odmawia edycji plików
  - Pyta o zgodę przed uruchomieniem komend bash
  - Idealny do poznawania nieznanych baz kodu lub planowania zmian

Dodatkowo jest subagent **general** do złożonych wyszukiwań i wieloetapowych zadań.
Jest używany wewnętrznie i można go wywołać w wiadomościach przez `@general`.

Dowiedz się więcej o [agents](https://opencode.ai/docs/agents).

### Dokumentacja

Więcej informacji o konfiguracji OpenCode znajdziesz w [**dokumentacji**](https://opencode.ai/docs).

### Współtworzenie

Jeśli chcesz współtworzyć OpenCode, przeczytaj [contributing docs](./CONTRIBUTING.md) przed wysłaniem pull requesta.

### Budowanie na OpenCode

Jeśli pracujesz nad projektem związanym z OpenCode i używasz "opencode" jako części nazwy (na przykład "opencode-dashboard" lub "opencode-mobile"), dodaj proszę notatkę do swojego README, aby wyjaśnić, że projekt nie jest tworzony przez zespół OpenCode i nie jest z nami w żaden sposób powiązany.

---

**Dołącz do naszej społeczności** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
