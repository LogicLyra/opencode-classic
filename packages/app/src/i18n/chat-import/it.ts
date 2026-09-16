export const dict = {
  "profileImport.mode": "Modalità di importazione",
  "profileImport.chats": "Solo chat",
  "profileImport.everything": "Tutto (configurazione completa)",
  "profileImport.description":
    "Copia la tua configurazione OpenCode compatibile in un profilo desktop Classic vuoto: chat, credenziali dei provider, account cloud, autorizzazioni, configurazione globale, agent, skills, plugin, piani, snapshot e file delle aree di lavoro. L'origine resta invariata. L'anteprima non esegue comandi importati e non contatta i provider.",
  "profileImport.boundaries":
    "Chiudi prima OpenCode e smetti di modificarne i file. Le cartelle dei progetti esterne all'archiviazione di OpenCode restano nei percorsi originali. Le variabili d'ambiente, gli strumenti installati a livello di sistema e le preferenze delle finestre del desktop upstream non vengono copiati. Log, cache e blocchi dei processi vengono rigenerati. I provider OAuth potrebbero richiedere un nuovo accesso. Le cartelle personalizzate vengono selezionate in quest'ordine: dati, configurazione e poi stato.",
  "profileImport.detect": "Anteprima della configurazione predefinita",
  "profileImport.browse": "Scegli le cartelle della configurazione",
  "profileImport.busy":
    "Validazione o preparazione della configurazione completa in corso. Mantieni Classic aperto fino al termine.",
  "profileImport.cancelled":
    "Non è stata trovata alcuna origine compatibile oppure la selezione delle cartelle è stata annullata.",
  "profileImport.staged":
    "La configurazione è preparata e verificata. Riavvia Classic per attivarla prima che il suo server si avvii. Non aggiungere dati a Classic prima del riavvio; l'attivazione verifica di nuovo che la destinazione sia vuota.",
  "profileImport.activated":
    "La configurazione completa è stata attivata correttamente. Le cartelle dei tuoi progetti restano disponibili nei percorsi originali; le aree di lavoro interne importate hanno copie indipendenti.",
  "profileImport.data": "Cartella dati di origine",
  "profileImport.config": "Cartella di configurazione di origine",
  "profileImport.state": "Cartella di stato di origine",
  "profileImport.providers": "Credenziali dei provider salvate",
  "profileImport.accounts": "Account cloud",
  "profileImport.workspaces": "Aree di lavoro",
  "profileImport.files": "File e link",
  "profileImport.bytes": "Dimensione della copia (byte)",
  "profileImport.plugins": "Plugin configurati",
  "profileImport.mcp": "Voci MCP",
  "profileImport.commands": "Comandi di progetto",
  "profileImport.permissions": "Record di autorizzazioni",
  "profileImport.pending": "Prompt in attesa",
  "profileImport.git": "Checkout Git",
  "profileImport.consent":
    "Ho chiuso OpenCode e mi fido di questa configurazione completa, incluse le credenziali, l'aggiornamento degli account, le dipendenze, i plugin, i server MCP, i comandi di progetto, gli hook Git e le autorizzazioni esistenti. Questi possono essere eseguiti durante il normale utilizzo dopo l'attivazione. I prompt in attesa restano in coda finché non vengono ripresi.",
  "profileImport.confirm": "Prepara la configurazione completa",
  "profileImport.restart": "Riavvia e attiva la configurazione",
  "profileImport.error.unavailable":
    "L'importazione completa richiede il server desktop Linux integrato e una configurazione basata su file. Le configurazioni o le override di autenticazione fornite dall'ambiente devono essere rimosse prima dell'importazione.",
  "profileImport.error.nonempty":
    "Classic contiene già dati di configurazione. L'importazione completa non li sovrascrive. Usa Solo chat per unire conversazioni compatibili oppure inizia con un profilo Classic vuoto.",
  "profileImport.error.incompatible":
    "Lo schema del database di origine non corrisponde a questa versione di Classic. L'importazione completa richiede una configurazione SQLite compatibile; non è stata tentata alcuna migrazione dell'origine.",
  "profileImport.error.invalid":
    "Impossibile validare la configurazione. Controlla i permessi dei file, l'integrità del database e la sintassi della configurazione. Il profilo Classic in esecuzione non è stato sostituito.",
  "profileImport.error.changed":
    "L'origine è cambiata oppure questa anteprima è scaduta. Chiudi OpenCode e gli altri processi che scrivono, quindi esegui di nuovo l'anteprima.",
  "profileImport.error.busy":
    "Un'altra importazione, un blocco file attivo o un'attivazione in sospeso impedisce questa operazione. Chiudi OpenCode e riavvia Classic prima di riprovare.",
  "profileImport.liveWarning":
    "OpenCode sembra essere in esecuzione in questo momento. Il suo database cambia continuamente, quindi la preparazione potrebbe non riuscire. Chiudi OpenCode (tutte le finestre) e arresta i suoi server prima di confermare, per un'importazione affidabile.",
  "profileImport.detail.count": "Elementi interessati: {{count}}",
  "profileImport.materialized": "Link esterni copiati",
  "profileImport.skipped": "File runtime ignorati",
  "profileImport.error.source-busy":
    "Sull'origine si scrive in modo continuo (probabilmente è in esecuzione un'istanza di OpenCode). Chiudi OpenCode e i suoi server, quindi esegui di nuovo anteprima e conferma.",
  "profileImport.error.links":
    "La configurazione contiene un link che non può essere copiato: un ciclo di symlink oppure un link all'interno di metadati Git dove le copie devono restare esatte.",
  "profileImport.error.git-objects":
    "I metadati Git della configurazione usano un layout non supportato (voci alternates, puntatori a worktree o archivi di oggetti che non possono essere privatizzati in sicurezza).",
  "profileImport.error.special-files":
    "La configurazione contiene nodi dispositivo o altri file speciali che non possono essere copiati in sicurezza.",
  "profileImport.error.limit":
    "La configurazione supera il limite di importazione (50 GiB o 500.000 elementi). Rimuovi i file di backup di grandi dimensioni o restringi le cartelle, quindi esegui di nuovo l'anteprima.",
  "profileImport.error.oversized-file":
    "Un file di configurazione o di metadati supera il suo limite di lettura (64 MB per le configurazioni, 16 MB per i metadati Git). Dividilo o ridimensionalo, quindi esegui di nuovo l'anteprima.",
  "profileImport.error.unsupported":
    "Questa configurazione contiene link non supportati, alternates di oggetti Git ciclici, file speciali o supera il limite di importazione (50 GiB / 500.000 elementi). I symlink esterni devono essere materializzati prima dell'importazione; i file di origine non sono stati modificati.",
  "profileImport.error.space":
    "Non c'è spazio su disco sufficiente per preparare questa configurazione. Libera spazio ed esegui di nuovo l'anteprima.",
  "chatImport.tab": "Importazione chat",
  "chatImport.title": "Importa chat da OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop mantiene un database chat separato. Visualizza in anteprima e copia le chat locali compatibili da OpenCode senza modificare l'origine né sostituire le chat Classic esistenti. Puoi tornare qui dalle impostazioni in qualsiasi momento.",
  "chatImport.scope":
    "Chiudi OpenCode prima di importare. Vengono copiate le chat locali completate e la loro cronologia. Le chat in coda, in corso e quelle delle aree di lavoro sono escluse. Credenziali, autorizzazioni, comandi di progetto, file esterni e snapshot di annullamento non vengono importati. Accedi separatamente e mantieni le cartelle dei tuoi progetti nei percorsi originali.",
  "chatImport.localOnly":
    "Seleziona il server desktop locale integrato per importare le chat. Questo importatore non supporta connessioni a server remoti o in background.",
  "chatImport.detect": "Controlla il database OpenCode predefinito",
  "chatImport.browse": "Scegli file di database",
  "chatImport.confirm": "Importa le chat idonee",
  "chatImport.busy":
    "Controllo o importazione delle chat in corso. Attendi prima di chiudere l'app.",
  "chatImport.noSource":
    "Nessun database trovato o selezionato. Scegli il tuo file .db di OpenCode per continuare.",
  "chatImport.complete":
    "Importazione completata. Apri la cartella del progetto originale per trovare le sue chat. Una nuova importazione salta gli ID chat già presenti in Classic.",
  "chatImport.source": "Database di origine",
  "chatImport.destination": "Database Classic",
  "chatImport.total": "Chat nell'origine",
  "chatImport.eligible": "Pronte da importare",
  "chatImport.existing": "Già presenti",
  "chatImport.excluded": "Escluse (in coda, in corso o area di lavoro)",
  "chatImport.imported": "Importate",
  "chatImport.error.unavailable":
    "L'importazione è disponibile solo per il server desktop Linux integrato dopo che ha terminato l'avvio.",
  "chatImport.error.incompatible":
    "I database hanno schemi diversi o non supportati. Usa versioni di OpenCode e Classic compatibili e aggiornate, quindi esegui di nuovo l'anteprima. L'archiviazione JSON legacy non è supportata; l'origine non è stata migrata.",
  "chatImport.error.invalid":
    "Impossibile leggere o validare il database. Controlla il file selezionato, i permessi e lo spazio su disco disponibile. Un'importazione non confermata viene annullata; esegui di nuovo l'anteprima prima di riprovare.",
  "chatImport.error.sameFile":
    "Origine e destinazione sono lo stesso database. Non è necessaria alcuna copia.",
  "chatImport.error.conflict":
    "ID di progetto o di messaggio in conflitto hanno impedito questa importazione. Nessuna importazione parziale è stata confermata. Le chat Classic esistenti sono state preservate.",
  "chatImport.error.busy":
    "Il database è occupato oppure l'operazione ha richiesto troppo tempo. Chiudi OpenCode, attendi che finiscano le altre importazioni, quindi esegui di nuovo l'anteprima. Un nuovo tentativo salta le chat già confermate.",
  "chatImport.error.expired":
    "Questa anteprima è scaduta o la sua origine è cambiata. Esegui di nuovo l'anteprima del database prima di importare.",
}
