export const dict = {
  "profileImport.mode": "Importmodus",
  "profileImport.chats": "Nur Chats",
  "profileImport.everything": "Alles (vollständiges Setup)",
  "profileImport.description":
    "Kopiert Ihr kompatibles OpenCode-Setup in ein leeres Classic-Desktop-Profil: Chats, Anbieter-Zugangsdaten, Cloud-Konten, Berechtigungen, globale Konfiguration, Agents, Skills, Plugins, Pläne, Snapshots und Arbeitsbereich-Dateien. Die Quelle bleibt unverändert. Die Vorschau führt keine importierten Befehle aus und kontaktiert keine Anbieter.",
  "profileImport.boundaries":
    "Schließen Sie zuerst OpenCode und bearbeiten Sie dessen Dateien nicht weiter. Projektordner außerhalb des OpenCode-Speichers bleiben an ihren ursprünglichen Pfaden. Umgebungsvariablen, systemweit installierte Tools und Upstream-Einstellungen des Desktop-Fensters werden nicht kopiert. Protokolle, Caches und Prozess-Sperren werden neu erstellt. OAuth-Anbieter können eine erneute Anmeldung erfordern. Eigene Ordner werden in dieser Reihenfolge ausgewählt: Daten, Konfiguration, dann Status.",
  "profileImport.detect": "Standard-Setup in der Vorschau prüfen",
  "profileImport.browse": "Setup-Ordner auswählen",
  "profileImport.busy":
    "Das vollständige Setup wird validiert oder bereitgestellt. Lassen Sie Classic geöffnet, bis der Vorgang abgeschlossen ist.",
  "profileImport.cancelled":
    "Es wurde keine kompatible Quelle gefunden, oder die Ordnerauswahl wurde abgebrochen.",
  "profileImport.staged":
    "Das Setup ist bereitgestellt und geprüft. Starten Sie Classic neu, um es zu aktivieren, bevor dessen Server startet. Fügen Sie Classic vor dem Neustart keine Daten hinzu; die Aktivierung prüft erneut, dass das Ziel leer ist.",
  "profileImport.activated":
    "Das vollständige Setup wurde erfolgreich aktiviert. Ihre Projektordner bleiben an ihren ursprünglichen Pfaden verfügbar; importierte interne Arbeitsbereiche haben unabhängige Kopien.",
  "profileImport.data": "Quell-Datenordner",
  "profileImport.config": "Quell-Konfigurationsordner",
  "profileImport.state": "Quell-Statusordner",
  "profileImport.providers": "Gespeicherte Anbieter-Zugangsdaten",
  "profileImport.accounts": "Cloud-Konten",
  "profileImport.workspaces": "Arbeitsbereiche",
  "profileImport.files": "Dateien und Links",
  "profileImport.bytes": "Kopiogröße (Bytes)",
  "profileImport.plugins": "Konfigurierte Plugins",
  "profileImport.mcp": "MCP-Einträge",
  "profileImport.commands": "Projektbefehle",
  "profileImport.permissions": "Berechtigungs-Einträge",
  "profileImport.pending": "Ausstehende Eingaben",
  "profileImport.git": "Git-Checkouts",
  "profileImport.consent":
    "Ich habe OpenCode geschlossen und vertraue diesem vollständigen Setup, einschließlich Zugangsdaten, Konto-Aktualisierung, Abhängigkeiten, Plugins, MCP-Servern, Projektbefehlen, Git-Hooks und bestehenden Berechtigungen. Diese können nach der Aktivierung im normalen Betrieb ausgeführt werden. Ausstehende Eingaben bleiben bis zur Wiederaufnahme in der Warteschlange.",
  "profileImport.confirm": "Vollständiges Setup bereitstellen",
  "profileImport.restart": "Neu starten und Setup aktivieren",
  "profileImport.error.unavailable":
    "Der vollständige Import erfordert den integrierten Linux-Desktop-Server und eine dateibasierte Konfiguration. Über Umgebungsvariablen bereitgestellte Konfigurationen oder Authentifizierungs-Overrides müssen vor dem Import entfernt werden.",
  "profileImport.error.nonempty":
    "Classic enthält bereits Setup-Daten. Der vollständige Import überschreibt diese nicht. Verwenden Sie „Nur Chats“, um kompatible Konversationen zusammenzuführen, oder beginnen Sie mit einem leeren Classic-Profil.",
  "profileImport.error.incompatible":
    "Das Datenbankschema der Quelle entspricht nicht dieser Classic-Version. Der vollständige Import erfordert ein kompatibles SQLite-Setup; eine Migration der Quelle wurde nicht versucht.",
  "profileImport.error.invalid":
    "Das Setup konnte nicht validiert werden. Prüfen Sie Dateiberechtigungen, Datenbankintegrität und Konfigurationssyntax. Das laufende Classic-Profil wurde nicht ersetzt.",
  "profileImport.error.changed":
    "Die Quelle hat sich geändert oder diese Vorschau ist abgelaufen. Schließen Sie OpenCode und andere schreibende Prozesse und führen Sie die Vorschau erneut aus.",
  "profileImport.error.busy":
    "Ein anderer Import, eine aktive Dateisperre oder eine ausstehende Aktivierung verhindert diesen Vorgang. Schließen Sie OpenCode und starten Sie Classic neu, bevor Sie es erneut versuchen.",
  "profileImport.liveWarning":
    "OpenCode scheint gerade aktiv zu sein. Seine Datenbank ändert sich fortlaufend, wodurch die Bereitstellung fehlschlagen kann. Schließen Sie OpenCode (alle Fenster) und beenden Sie dessen Server, bevor Sie bestätigen, um einen zuverlässigen Import zu erhalten.",
  "profileImport.detail.count": "Betroffene Einträge: {{count}}",
  "profileImport.materialized": "Externe Links kopiert",
  "profileImport.skipped": "Übersprungene Laufzeitdateien",
  "profileImport.error.source-busy":
    "Die Quelle wird fortlaufend beschrieben (wahrscheinlich läuft eine OpenCode-Instanz). Schließen Sie OpenCode und dessen Server und führen Sie dann Vorschau und Bestätigung erneut aus.",
  "profileImport.error.links":
    "Das Setup enthält einen Link, der nicht kopiert werden kann: einen Symlink-Zyklus oder einen Link innerhalb von Git-Metadaten, wo Kopien exakt bleiben müssen.",
  "profileImport.error.git-objects":
    "Die Git-Metadaten des Setups verwenden ein nicht unterstütztes Layout (Alternates-Einträge, Worktree-Verweise oder Objektspeicher, die nicht sicher privatisiert werden können).",
  "profileImport.error.special-files":
    "Das Setup enthält Geräteknoten oder andere spezielle Dateien, die nicht sicher kopiert werden können.",
  "profileImport.error.limit":
    "Das Setup überschreitet die Importgrenze (50 GiB oder 500.000 Einträge). Entfernen Sie große Sicherungsdateien oder grenzen Sie die Ordner ein und führen Sie die Vorschau erneut aus.",
  "profileImport.error.oversized-file":
    "Eine Konfigurations- oder Metadatendatei überschreitet ihre Lesegrenze (64 MB für Konfigurationen, 16 MB für Git-Metadaten). Teilen oder verkleinern Sie sie und führen Sie die Vorschau erneut aus.",
  "profileImport.error.unsupported":
    "Dieses Setup enthält nicht unterstützte Links, zyklische Git-Objekt-Alternates, spezielle Dateien oder überschreitet die Importgrenze (50 GiB / 500.000 Einträge). Externe Symlinks müssen vor dem Import materialisiert werden; Quelldateien wurden nicht geändert.",
  "profileImport.error.space":
    "Es ist nicht genügend freier Speicherplatz vorhanden, um dieses Setup bereitzustellen. Geben Sie Speicherplatz frei und führen Sie die Vorschau erneut aus.",
  "chatImport.tab": "Chat-Import",
  "chatImport.title": "Chats aus OpenCode importieren",
  "chatImport.description":
    "OpenCode Classic Desktop führt eine eigene Chat-Datenbank. Prüfen und kopieren Sie kompatible lokale Chats aus OpenCode, ohne die Quelle zu ändern oder bestehende Classic-Chats zu ersetzen. Sie können jederzeit über die Einstellungen hierher zurückkehren.",
  "chatImport.scope":
    "Schließen Sie OpenCode vor dem Import. Dies kopiert abgeschlossene lokale Chats und deren Verlauf. Eingereihte, laufende und Arbeitsbereich-Sitzungen sind ausgeschlossen. Zugangsdaten, Berechtigungen, Projektbefehle, externe Dateien und Undo-Snapshots werden nicht importiert. Melden Sie sich separat an und behalten Sie Ihre Projektordner an ihren ursprünglichen Pfaden.",
  "chatImport.localOnly":
    "Wählen Sie den integrierten lokalen Desktop-Server aus, um Chats zu importieren. Verbindungen zu Remote- und Hintergrundservern werden von diesem Importer nicht unterstützt.",
  "chatImport.detect": "Standard-OpenCode-Datenbank prüfen",
  "chatImport.browse": "Datenbankdatei auswählen",
  "chatImport.confirm": "Geeignete Chats importieren",
  "chatImport.busy":
    "Chats werden geprüft oder importiert. Bitte warten Sie, bevor Sie die App schließen.",
  "chatImport.noSource":
    "Es wurde keine Datenbank gefunden oder ausgewählt. Wählen Sie die OpenCode-.db-Datei aus, um fortzufahren.",
  "chatImport.complete":
    "Import abgeschlossen. Öffnen Sie den ursprünglichen Projektordner, um dessen Chats zu finden. Ein wiederholter Import überspringt Chat-IDs, die bereits in Classic vorhanden sind.",
  "chatImport.source": "Quell-Datenbank",
  "chatImport.destination": "Classic-Datenbank",
  "chatImport.total": "Chats in der Quelle",
  "chatImport.eligible": "Bereit zum Import",
  "chatImport.existing": "Bereits vorhanden",
  "chatImport.excluded": "Ausgeschlossen (eingereiht, laufend oder Arbeitsbereich)",
  "chatImport.imported": "Importiert",
  "chatImport.error.unavailable":
    "Der Import ist nur für den integrierten Linux-Desktop-Server verfügbar, nachdem dieser vollständig gestartet ist.",
  "chatImport.error.incompatible":
    "Die Datenbanken haben unterschiedliche oder nicht unterstützte Schemata. Verwenden Sie kompatible, aktuelle OpenCode- und Classic-Versionen und führen Sie die Vorschau erneut aus. Legacy-JSON-Speicher werden nicht unterstützt; die Quelle wurde nicht migriert.",
  "chatImport.error.invalid":
    "Die Datenbank konnte nicht gelesen oder validiert werden. Prüfen Sie die ausgewählte Datei, die Berechtigungen und den verfügbaren Speicherplatz. Ein nicht committeter Import wird zurückgerollt; führen Sie vor einem erneuten Versuch die Vorschau erneut aus.",
  "chatImport.error.sameFile":
    "Quelle und Ziel sind dieselbe Datenbank. Es ist keine Kopie nötig.",
  "chatImport.error.conflict":
    "Kollidierende Projekt- oder Nachrichten-IDs haben diesen Import verhindert. Es wurde kein teilweiser Import committet. Bestehende Classic-Chats wurden bewahrt.",
  "chatImport.error.busy":
    "Die Datenbank ist belegt oder der Vorgang hat zu lange gedauert. Schließen Sie OpenCode, warten Sie, bis andere Importe abgeschlossen sind, und führen Sie dann die Vorschau erneut aus. Ein erneuter Versuch überspringt bereits committete Chats.",
  "chatImport.error.expired":
    "Diese Vorschau ist abgelaufen oder ihre Quelle hat sich geändert. Führen Sie die Vorschau der Datenbank erneut aus, bevor Sie importieren.",
}
