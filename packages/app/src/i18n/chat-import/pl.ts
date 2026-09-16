export const dict = {
  "profileImport.mode": "Tryb importowania",
  "profileImport.chats": "Tylko czaty",
  "profileImport.everything": "Wszystko (pełna konfiguracja)",
  "profileImport.description":
    "Kopiuje kompatybilną konfigurację OpenCode do pustego profilu Classic na pulpicie: czaty, dane logowania dostawców, konta w chmurze, uprawnienia, konfigurację globalną, agentów, umiejętności, wtyczki, plany, migawki i pliki przestrzeni roboczych. Źródło pozostaje niezmienione. Podgląd nie uruchamia importowanych poleceń i nie kontaktuje się z dostawcami.",
  "profileImport.boundaries":
    "Najpierw zamknij OpenCode i przestań edytować jego pliki. Foldery projektów poza magazynem OpenCode pozostają pod pierwotnymi ścieżkami. Zmienne środowiskowe, narzędzia zainstalowane w systemie i preferencje okien pulpca nadrzędnego upstream nie są kopiowane. Logi, pamięć podręczna i blokady procesów są generowane ponownie. Dostawcy OAuth mogą wymagać ponownego zalogowania. Własne foldery są wybierane w tej kolejności: dane, konfiguracja, potem stan.",
  "profileImport.detect": "Podejrzyj domyślną konfigurację",
  "profileImport.browse": "Wybierz foldery konfiguracji",
  "profileImport.busy":
    "Pełna konfiguracja jest weryfikowana lub przygotowywana. Nie zamykaj Classic, aż to się zakończy.",
  "profileImport.cancelled":
    "Nie znaleziono kompatybilnego źródła lub anulowano wybór folderów.",
  "profileImport.staged":
    "Konfiguracja jest przygotowana i zweryfikowana. Uruchom ponownie Classic, aby ją aktywować przed uruchomieniem jego serwera. Nie dodawaj danych do Classic przed ponownym uruchomieniem; aktywacja ponownie sprawdza, czy miejsce docelowe jest puste.",
  "profileImport.activated":
    "Pełna konfiguracja została pomyślnie aktywowana. Twoje foldery projektów pozostają dostępne pod pierwotnymi ścieżkami; zaimportowane wewnętrzne przestrzenie robocze mają niezależne kopie.",
  "profileImport.data": "Folder danych źródła",
  "profileImport.config": "Folder konfiguracji źródła",
  "profileImport.state": "Folder stanu źródła",
  "profileImport.providers": "Zapisane dane logowania dostawców",
  "profileImport.accounts": "Konta w chmurze",
  "profileImport.workspaces": "Przestrzenie robocze",
  "profileImport.files": "Pliki i dowiązania",
  "profileImport.bytes": "Rozmiar kopii (bajty)",
  "profileImport.plugins": "Skonfigurowane wtyczki",
  "profileImport.mcp": "Wpisy MCP",
  "profileImport.commands": "Polecenia projektu",
  "profileImport.permissions": "Wpisy uprawnień",
  "profileImport.pending": "Oczekujące prompty",
  "profileImport.git": "Checkouty Gita",
  "profileImport.consent":
    "Zamknąłem OpenCode i ufam tej pełnej konfiguracji, łącznie z danymi logowania, odświeżaniem kont, zależnościami, wtyczkami, serwerami MCP, poleceniami projektu, hakami Gita i istniejącymi uprawnieniami. Mogą one działać podczas normalnego użytkowania po aktywacji. Oczekujące prompty pozostają w kolejce do wznowienia.",
  "profileImport.confirm": "Przygotuj pełną konfigurację",
  "profileImport.restart": "Uruchom ponownie i aktywuj konfigurację",
  "profileImport.error.unavailable":
    "Pełny import wymaga wbudowanego serwera pulpitu Linux i konfiguracji opartej na plikach. Konfigurację lub zastąpienia uwierzytelniania dostarczane przez środowisko należy usunąć przed importem.",
  "profileImport.error.nonempty":
    "Classic zawiera już dane konfiguracji. Pełny import ich nie nadpisuje. Użyj Tylko czaty, aby scalić kompatybilne rozmowy, lub zacznij od pustego profilu Classic.",
  "profileImport.error.incompatible":
    "Schemat bazy danych źródła nie odpowiada tej wersji Classic. Pełny import wymaga kompatybilnej konfiguracji SQLite; nie podjęto próby migracji źródła.",
  "profileImport.error.invalid":
    "Nie udało się zweryfikować konfiguracji. Sprawdź uprawnienia plików, integralność bazy danych i składnię konfiguracji. Działający profil Classic nie został zastąpiony.",
  "profileImport.error.changed":
    "Źródło się zmieniło lub ten podgląd wygasł. Zamknij OpenCode i inne procesy zapisujące, a następnie wykonaj podgląd ponownie.",
  "profileImport.error.busy":
    "Inny import, aktywna blokada pliku lub oczekująca aktywacja uniemożliwia tę operację. Zamknij OpenCode i uruchom ponownie Classic przed ponowną próbą.",
  "profileImport.liveWarning":
    "OpenCode wygląda na uruchomiony właśnie teraz. Jego baza danych ciągle się zmienia, dlatego przygotowanie może się nie powieść. Zamknij OpenCode (wszystkie okna) i zatrzymaj jego serwery przed potwierdzeniem, aby import był niezawodny.",
  "profileImport.detail.count": "Dotyczy elementów: {{count}}",
  "profileImport.materialized": "Skopiowane dowiązania zewnętrzne",
  "profileImport.skipped": "Pominięte pliki uruchomieniowe",
  "profileImport.error.source-busy":
    "Do źródła jest stale zapisywane (prawdopodobnie działa instancja OpenCode). Zamknij OpenCode i jego serwery, a następnie ponownie wykonaj podgląd i potwierdzenie.",
  "profileImport.error.links":
    "Konfiguracja zawiera dowiązanie, którego nie można skopiować: cykl dowiązań symbolicznych lub dowiązanie w metadanych Gita, gdzie kopie muszą pozostać dokładne.",
  "profileImport.error.git-objects":
    "Metadane Gita w konfiguracji używają nieobsługiwanego układu (wpisy alternates, wskaźniki worktree lub magazyny obiektów, których nie można bezpiecznie sprywatyzować).",
  "profileImport.error.special-files":
    "Konfiguracja zawiera węzły urządzeń lub inne pliki specjalne, których nie można bezpiecznie skopiować.",
  "profileImport.error.limit":
    "Konfiguracja przekracza limit importu (50 GiB lub 500 000 elementów). Usuń duże pliki kopii zapasowych lub zawęź foldery, a następnie wykonaj podgląd ponownie.",
  "profileImport.error.oversized-file":
    "Plik konfiguracji lub metadanych przekracza swój limit odczytu (64 MB dla konfiguracji, 16 MB dla metadanych Gita). Podziel go lub zmniejsz, a następnie wykonaj podgląd ponownie.",
  "profileImport.error.unsupported":
    "Ta konfiguracja zawiera nieobsługiwane dowiązania, cykliczne alternates obiektów Gita, pliki specjalne lub przekracza limit importu (50 GiB / 500 000 elementów). Zewnętrzne dowiązania symboliczne muszą zostać zmaterializowane przed importem; pliki źródłowe nie zostały zmienione.",
  "profileImport.error.space":
    "Nie ma wystarczającej wolnej przestrzeni dyskowej, aby przygotować tę konfigurację. Zwolnij miejsce i wykonaj podgląd ponownie.",
  "chatImport.tab": "Import czatów",
  "chatImport.title": "Importuj czaty z OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop przechowuje oddzielną bazę danych czatów. Wykonaj podgląd i skopiuj kompatybilne lokalne czaty z OpenCode bez zmiany źródła i bez zastępowania istniejących czatów Classic. Możesz wrócić tutaj z ustawień w dowolnym momencie.",
  "chatImport.scope":
    "Zamknij OpenCode przed importem. Spowoduje to skopiowanie ukończonych lokalnych czatów i ich historii. Czaty w kolejce, w toku i przestrzeni roboczych są wykluczone. Dane logowania, uprawnienia, polecenia projektu, pliki zewnętrzne i migawki cofania nie są importowane. Zaloguj się oddzielnie i zachowaj foldery projektów pod pierwotnymi ścieżkami.",
  "chatImport.localOnly":
    "Aby importować czaty, wybierz wbudowany lokalny serwer pulpitu. Ten importer nie obsługuje połączeń zdalnych i serwerów w tle.",
  "chatImport.detect": "Sprawdź domyślną bazę danych OpenCode",
  "chatImport.browse": "Wybierz plik bazy danych",
  "chatImport.confirm": "Importuj kwalifikujące się czaty",
  "chatImport.busy":
    "Sprawdzanie lub importowanie czatów. Poczekaj przed zamknięciem aplikacji.",
  "chatImport.noSource":
    "Nie znaleziono ani nie wybrano bazy danych. Wybierz swój plik .db OpenCode, aby kontynuować.",
  "chatImport.complete":
    "Import zakończony. Otwórz pierwotny folder projektu, aby znaleźć jego czaty. Powtórzony import pomija identyfikatory czatów już obecne w Classic.",
  "chatImport.source": "Baza danych źródła",
  "chatImport.destination": "Baza danych Classic",
  "chatImport.total": "Czaty w źródle",
  "chatImport.eligible": "Gotowe do importu",
  "chatImport.existing": "Już obecne",
  "chatImport.excluded": "Wykluczone (w kolejce, w toku lub przestrzeń robocza)",
  "chatImport.imported": "Zaimportowane",
  "chatImport.error.unavailable":
    "Import jest dostępny tylko dla wbudowanego serwera pulpitu Linux po zakończeniu jego uruchamiania.",
  "chatImport.error.incompatible":
    "Bazy danych mają różne lub nieobsługiwane schematy. Użyj kompatybilnych, aktualnych wersji OpenCode i Classic, a następnie wykonaj podgląd ponownie. Starszy magazyn JSON nie jest obsługiwany; źródło nie zostało zmigrowane.",
  "chatImport.error.invalid":
    "Nie udało się odczytać lub zweryfikować bazy danych. Sprawdź wybrany plik, uprawnienia i dostępną przestrzeń dyskową. Niezatwierdzony import jest wycofywany; przed ponowną próbą wykonaj podgląd ponownie.",
  "chatImport.error.sameFile":
    "Źródło i cel to ta sama baza danych. Kopiowanie nie jest potrzebne.",
  "chatImport.error.conflict":
    "Konfliktowe identyfikatory projektów lub wiadomości uniemożliwiły ten import. Żaden częściowy import nie został zatwierdzony. Istniejące czaty Classic zostały zachowane.",
  "chatImport.error.busy":
    "Baza danych jest zajęta lub operacja trwała zbyt długo. Zamknij OpenCode, poczekaj na zakończenie innych importów, a następnie wykonaj podgląd ponownie. Ponowna próba pomija czaty już zatwierdzone.",
  "chatImport.error.expired":
    "Ten podgląd wygasł lub jego źródło się zmieniło. Wykonaj podgląd bazy danych ponownie przed importem.",
}
