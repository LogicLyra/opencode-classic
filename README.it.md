<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logo OpenCode">
    </picture>
  </a>
</p>
<p align="center">L’agente di coding AI open source.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic è un fork non ufficiale focalizzato su Linux che segue l'upstream, usa il layout classico del desktop per impostazione predefinita e mantiene il layout ridisegnato disponibile nelle impostazioni. Le sue release e l'updater sono mantenuti indipendentemente su [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). I contenuti più approfonditi sono ereditati dall'upstream e possono essere in ritardo.


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

### Porta la tua configurazione da OpenCode

OpenCode Classic Desktop usa un profilo separato per il suo server integrato.
**Impostazioni > Importazione chat** e la finestra del primo avvio offrono **Solo
chat** e **Tutto (configurazione completa)**. Per **Solo chat** si applica il
seguente comportamento di unione:
Al primo avvio, o in **Impostazioni > Importazione chat**, scegli **Controlla il
database OpenCode predefinito** oppure seleziona un file `.db`. Chiudi prima
OpenCode, controlla origine, destinazione e conteggi, quindi scegli **Importa le
chat idonee**.

- L'origine predefinita è `$XDG_DATA_HOME/opencode/opencode.db`, normalmente
  `~/.local/share/opencode/opencode.db`. Scegli un file per percorsi
  personalizzati o database del canale di sviluppo. La destinazione è il database
  del server desktop integrato attivo, nella directory `sidecar` del profilo
  desktop di Classic. Questo importatore non supporta connessioni remote né
  server sperimentali in background.
- L'importatore supporta schemi SQLite e cronologie di migrazione corrispondenti.
  Non migra i file di origine e non importa lo storage JSON legacy. Se i
  controlli di compatibilità falliscono, usa versioni OpenCode e Classic
  compatibili e ripeti l'anteprima.
- Le chat locali completate conservano ID, titoli, marca temporali, messaggi,
  parti, cronologia v2, attività e percorsi di progetto originali. Gli ID di
  chat già presenti vengono saltati per intero; reimportare non aggiorna una
  chat già importata. L'origine è in sola lettura, inclusa la sua cronologia
  WAL, e ogni importazione viene confermata in modo atomico.
- Le chat con prompt in coda, lavoro incompleto o collocazione esplicita in un
  spazio di lavoro sono escluse e conteggiate. L'importazione non avvia mai un
  prompt né esegue un comando. Credenziali, stato degli account, permessi,
  comandi di progetto, proprietà delle condivisioni, allegati esterni, snapshot
  Git e bozze del desktop non vengono copiati. Accedi separatamente e lascia le
  cartelle dei tuoi progetti nei percorsi originali. Gli snapshot storici di
  annullamento non sono disponibili; i dati degli allegati incorporati restano
  nella trascrizione, mentre i file esterni devono continuare a esistere.
- Apri la cartella del progetto originale in Classic per vedere le sue chat
  importate. Si tratta di una copia una tantum, non di una sincronizzazione
  continua tra applicazioni.

#### Tutto (configurazione completa)

Chiudi prima OpenCode e ferma gli altri processi che scrivono. Scegli
**Anteprima della configurazione predefinita**, oppure **Scegli le cartelle della
configurazione** e seleziona le cartelle OpenCode **dati**, **configurazione** e
**stato**. Si trovano normalmente in `~/.local/share/opencode`,
`~/.config/opencode` e `~/.local/state/opencode`; le sovrascritture XDG vengono
rispettate. Controlla i conteggi, conferma che ti fidi della configurazione,
conferma nella finestra nativa, quindi riavvia Classic per attivare il profilo
preparato.

- Richiede un profilo Linux integrato di Classic vuoto. Chat, provider,
  impostazioni personalizzate, account e progetti registrati esistenti non
  vengono mai sovrascritti. I file predefiniti di configurazione/plugin generati
  vengono riconosciuti come stato di bootstrap.
- Copia tutte le 19 tabelle del database dell'applicazione, l'`auth.json` dei
  provider, gli account cloud, le credenziali delle integrazioni, i permessi, i
  metadati delle condivisioni, i file di configurazione (incluso JSONC), gli
  agent, le skills, i plugin, lo stato, i piani, l'output degli strumenti, i
  file degli spazi di lavoro e gli snapshot. I prompt in attesa restano in
  coda; l'importazione non li esegue.
- I percorsi dei progetti esterni restano invariati sulla stessa macchina. I
  percorsi interni, i pattern di permesso e le chiavi degli snapshot vengono
  rimappati. I worktree collegati ricevono metadati Git privati e gli alternates
  degli oggetti snapshot vengono materializzati, così le copie non dipendono
  dagli archivi di oggetti originali.
- SQLite legge una copia privata del DB/WAL di origine. DB di origine, WAL e
  file di memoria condivisa restano invariati. La preparazione usa permessi
  privati e un registro durevole di proprietà. L'attivazione avviene prima
  dell'avvio del server integrato e recupera rinomine di directory interrotte.
  Il profilo originale vuoto/di bootstrap viene conservato sotto
  `.profile-import-retained-<operation-id>` nel profilo desktop di Classic per
  ispezione; non viene eliminato automaticamente.
- Le credenziali restano file locali protetti. La configurazione completa
  conserva anche il comportamento eseguibile: l'aggiornamento degli account,
  l'installazione delle dipendenze, i plugin, le connessioni MCP, i comandi di
  progetto, nonché hook/helper Git e le concessioni di permesso possono avere
  effetto durante l'uso normale dopo l'attivazione. Importa solo una
  configurazione di cui ti fidi. La rotazione dei token OAuth può richiedere un
  nuovo accesso quando si usano entrambe le applicazioni.
- Log, cache e blocchi dei processi vengono rigenerati. I programmi di sistema,
  le variabili d'ambiente della shell, le preferenze di
  finestra/barra laterale del desktop upstream e le bozze del desktop non
  vengono copiati. I file di progetti esterni sono già condivisi nei loro
  percorsi originali. Apri la cartella del progetto originale per accedere alle
  sue chat.
- Richiede una cronologia di migrazione e uno schema SQLite corrispondenti. La
  configurazione completa attualmente legge `opencode.db`; le sovrascritture di
  database/configurazione/autenticazione fornite dall'ambiente vanno rimosse
  prima dell'uso. Gli storage solo JSON legacy, i riferimenti ciclici o non
  supportati a oggetti Git, i nodi dispositivo e i profili oltre 50 GiB o
  500.000 voci di inventario vengono rifiutati con un motivo specifico. I
  symlink esterni vengono copiati per intero (materializzati); i collegamenti
  interrotti, i socket e le fifo vengono saltati e conteggiati nel riepilogo.
  Sono supportati file di configurazione fino a 64 MB. Per la preparazione è
  richiesto spazio su disco aggiuntivo.
- Chiudi OpenCode prima di importare. L'anteprima avverte quando rileva
  un'istanza in esecuzione, le copie degli snapshot vengono riprovate
  automaticamente e un'origine scritta di continuo segnala un errore dedicato
  di occupato che chiede di chiuderla.

La CLI autonoma di Classic continua a usare le radici XDG predefinite di OpenCode
a meno che tu non le sovrascriva. Il suo comando `uninstall` preserva dati,
credenziali, configurazione, cache e stato per impostazione predefinita, anche con
`--force`. L'eliminazione di quelle radici condivise richiede
`--remove-shared-data`; `--keep-data` e `--keep-config` annullano quella
richiesta per le rispettive radici. Esamina i percorsi con `uninstall --dry-run`.
Il disinstallatore di OpenCode upstream può ancora eliminare dati CLI condivisi.
Il fork si rifiuta di aprire database con migrazioni sconosciute; aggiorna
Classic invece di modificare o eliminare un registro delle migrazioni.

### Installazione

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> Il pacchetto npm `opencode-ai` e i pacchetti Homebrew, Scoop, Chocolatey, AUR e Nix esistenti distribuiscono OpenCode upstream, non OpenCode Classic.

### App Desktop (BETA)

Le build desktop di OpenCode Classic supportano solo Linux e sono disponibili sulla [pagina delle release del fork](https://github.com/LogicLyra/opencode-classic/releases).

| Piattaforma | Download                                            |
| ----------- | --------------------------------------------------- |
| Linux x64   | `opencode-classic-desktop-linux-*` (`.deb` o `.rpm`) |

AppImage non viene distribuito intenzionalmente. Ubuntu 24.04 e successivi possono forzare le AppImage di Electron a disattivare il sandboxing di Chromium con i criteri AppArmor predefiniti; i formati deb e RPM installati conservano l'integrazione del sandbox attesa dalla distribuzione.

I maintainer possono riprodurre la verifica completa di build, pacchettizzazione, deb installato e release visiva con il [runbook di QA su VM Linux](docs/linux-vm-qa.md).

#### Directory di installazione

Lo script di installazione rispetta il seguente ordine di priorità per il percorso di installazione:

1. `$OPENCODE_INSTALL_DIR` - Directory di installazione personalizzata
2. `$XDG_BIN_DIR` - Percorso conforme alla XDG Base Directory Specification
3. `$HOME/bin` - Directory binaria standard dell'utente (se esiste o può essere creata)
4. `$HOME/.opencode/bin` - Fallback predefinito

```bash
# Esempi
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agenti

OpenCode include due agenti integrati tra cui puoi passare usando il tasto `Tab`.

- **build** – Predefinito, agente con accesso completo per il lavoro di sviluppo
- **plan** – Agente in sola lettura per analisi ed esplorazione del codice
  - Nega le modifiche ai file per impostazione predefinita
  - Chiede il permesso prima di eseguire comandi bash
  - Ideale per esplorare codebase sconosciute o pianificare modifiche

È inoltre incluso un sotto-agente **general** per ricerche complesse e attività multi-step.
Viene utilizzato internamente e può essere invocato usando `@general` nei messaggi.

Scopri di più sugli [agenti](https://opencode.ai/docs/agents).

### Documentazione

Per maggiori informazioni su come configurare OpenCode, [**consulta la nostra documentazione**](https://opencode.ai/docs).

### Contribuire

Se sei interessato a contribuire a OpenCode, leggi la nostra [guida alla contribuzione](./CONTRIBUTING.md) prima di inviare una pull request.

### Costruire su OpenCode

Se stai lavorando a un progetto correlato a OpenCode e che utilizza “opencode” come parte del nome (ad esempio “opencode-dashboard” o “opencode-mobile”), aggiungi una nota nel tuo README per chiarire che non è sviluppato dal team OpenCode e che non è affiliato in alcun modo con noi.

---

**Unisciti alla nostra community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
