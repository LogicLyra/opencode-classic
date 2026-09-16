export const dict = {
  "profileImport.mode": "Mod de import",
  "profileImport.chats": "Doar conversații",
  "profileImport.everything": "Tot (configurație completă)",
  "profileImport.description":
    "Copiază configurația OpenCode compatibilă într-un profil Classic desktop gol: conversații, date de autentificare ale furnizorilor, conturi cloud, permisiuni, configurație globală, agenți, skills, pluginuri, planuri, instantanee și fișiere ale spațiilor de lucru. Sursa rămâne neschimbată. Previzualizarea nu execută comenzi importate și nu contactează furnizorii.",
  "profileImport.boundaries":
    "Închideți mai întâi OpenCode și opriți editarea fișierelor sale. Dosarele proiectelor din afara stocării OpenCode rămân la căile originale. Variabilele de mediu, uneltele instalate la nivel de sistem și preferințele ferestrelor desktop din upstream nu se copiază. Jurnalele, cache-urile și blocajele de proces se regenerează. Furnizorii OAuth pot necesita autentificarea din nou. Dosarele personalizate se selectează în această ordine: date, configurație, apoi stare.",
  "profileImport.detect": "Previzualizează configurația implicită",
  "profileImport.browse": "Alege dosarele configurației",
  "profileImport.busy":
    "Se validează sau se pregătește configurația completă. Păstrați Classic deschis până se termină.",
  "profileImport.cancelled":
    "Nu a fost găsită nicio sursă compatibilă sau selecția dosarelor a fost anulată.",
  "profileImport.staged":
    "Configurația este pregătită și verificată. Reporniți Classic pentru a o activa înainte ca serverul său să pornească. Nu adăugați date în Classic înainte de repornire; activarea verifică din nou că destinația este goală.",
  "profileImport.activated":
    "Configurația completă a fost activată cu succes. Dosarele proiectelor dvs. rămân disponibile la căile originale; spațiile de lucru interne importate au copii independente.",
  "profileImport.data": "Dosar de date sursă",
  "profileImport.config": "Dosar de configurație sursă",
  "profileImport.state": "Dosar de stare sursă",
  "profileImport.providers": "Date de autentificare salvate ale furnizorilor",
  "profileImport.accounts": "Conturi cloud",
  "profileImport.workspaces": "Spații de lucru",
  "profileImport.files": "Fișiere și legături",
  "profileImport.bytes": "Dimensiunea copiei (octeți)",
  "profileImport.plugins": "Pluginuri configurate",
  "profileImport.mcp": "Intrări MCP",
  "profileImport.commands": "Comenzi de proiect",
  "profileImport.permissions": "Înregistrări de permisiuni",
  "profileImport.pending": "Solicitări în așteptare",
  "profileImport.git": "Checkout-uri Git",
  "profileImport.consent":
    "Am închis OpenCode și am încredere în această configurație completă, inclusiv în datele de autentificare, reîmprospătarea conturilor, dependențe, pluginuri, servere MCP, comenzi de proiect, hook-uri Git și permisiunile existente. Acestea pot rula în timpul utilizării normale după activare. Solicitările în așteptare rămân în coadă până sunt reluate.",
  "profileImport.confirm": "Pregătește configurația completă",
  "profileImport.restart": "Repornește și activează configurația",
  "profileImport.error.unavailable":
    "Importul complet necesită serverul Linux desktop integrat și o configurație bazată pe fișiere. Configurațiile sau suprascrierile de autentificare furnizate de mediu trebuie eliminate înainte de import.",
  "profileImport.error.nonempty":
    "Classic conține deja date de configurație. Importul complet nu le suprascrie. Folosiți Doar conversații pentru a fuziona conversații compatibile sau începeți cu un profil Classic gol.",
  "profileImport.error.incompatible":
    "Schema bazei de date sursă nu corespunde acestei versiuni Classic. Importul complet necesită o configurație SQLite compatibilă; nu s-a încercat nicio migrare a sursei.",
  "profileImport.error.invalid":
    "Configurația nu a putut fi validată. Verificați permisiunile fișierelor, integritatea bazei de date și sintaxa configurației. Profilul Classic în execuție nu a fost înlocuit.",
  "profileImport.error.changed":
    "Sursa s-a schimbat sau această previzualizare a expirat. Închideți OpenCode și alte procese care scriu, apoi reluați previzualizarea.",
  "profileImport.error.busy":
    "Un alt import, un blocaj de fișier activ sau o activare în așteptare împiedică această operațiune. Închideți OpenCode și reporniți Classic înainte de a reîncerca.",
  "profileImport.liveWarning":
    "OpenCode pare să ruleze chiar acum. Baza sa de date se schimbă continuu, deci pregătirea poate eșua. Închideți OpenCode (toate ferestrele) și opriți serverele sale înainte de a confirma, pentru un import fiabil.",
  "profileImport.detail.count": "Elemente afectate: {{count}}",
  "profileImport.materialized": "Legături externe copiate",
  "profileImport.skipped": "Fișiere de execuție omise",
  "profileImport.error.source-busy":
    "Sursa este scrisă continuu (probabil rulează o instanță OpenCode). Închideți OpenCode și serverele sale, apoi reluați previzualizarea și confirmarea.",
  "profileImport.error.links":
    "Configurația conține o legătură care nu poate fi copiată: un ciclu de legături simbolice sau o legătură în interiorul metadatelor Git, unde copiile trebuie să rămână exacte.",
  "profileImport.error.git-objects":
    "Metadatele Git ale configurației folosesc un aranjament nesuportat (intrări alternates, pointeri de worktree sau depozite de obiecte care nu pot fi privatizate în siguranță).",
  "profileImport.error.special-files":
    "Configurația conține noduri de dispozitiv sau alte fișiere speciale care nu pot fi copiate în siguranță.",
  "profileImport.error.limit":
    "Configurația depășește limita de import (50 GiB sau 500.000 de elemente). Eliminați fișierele mari de copie de rezervă sau restrângeți dosarele, apoi reluați previzualizarea.",
  "profileImport.error.oversized-file":
    "Un fișier de configurație sau de metadate depășește limita sa de citire (64 MB pentru configurații, 16 MB pentru metadate Git). Împărțiți-l sau micșorați-l, apoi reluați previzualizarea.",
  "profileImport.error.unsupported":
    "Această configurație conține legături nesuportate, alternates de obiecte Git ciclice, fișiere speciale sau depășește limita de import (50 GiB / 500.000 de elemente). Legăturile simbolice externe trebuie materializate înainte de import; fișierele sursă nu au fost modificate.",
  "profileImport.error.space":
    "Nu există suficient spațiu liber pe disc pentru a pregăti această configurație. Eliberați spațiu și reluați previzualizarea.",
  "chatImport.tab": "Import de conversații",
  "chatImport.title": "Importă conversații din OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop păstrează o bază de date de conversații separată. Previzualizați și copiați conversații locale compatibile din OpenCode fără a schimba sursa sau a înlocui conversațiile Classic existente. Puteți reveni aici din Setări în orice moment.",
  "chatImport.scope":
    "Închideți OpenCode înainte de import. Aceasta copiază conversațiile locale finalizate și istoricul lor. Conversațiile din coadă, în desfășurare și cele ale spațiilor de lucru sunt excluse. Datele de autentificare, permisiunile, comenzile de proiect, fișierele externe și instantaneele de anulare nu se importă. Autentificați-vă separat și păstrați dosarele proiectelor la căile originale.",
  "chatImport.localOnly":
    "Selectați serverul desktop local integrat pentru a importa conversații. Acest importator nu suportă conexiuni la servere remote sau de fundal.",
  "chatImport.detect": "Verifică baza de date OpenCode implicită",
  "chatImport.browse": "Alege fișierul bazei de date",
  "chatImport.confirm": "Importă conversațiile eligibile",
  "chatImport.busy":
    "Se verifică sau se importă conversații. Așteptați înainte de a închide aplicația.",
  "chatImport.noSource":
    "Nu a fost găsită sau selectată nicio bază de date. Alegeți fișierul .db OpenCode pentru a continua.",
  "chatImport.complete":
    "Import finalizat. Deschideți dosarul proiectului original pentru a-i găsi conversațiile. Un import repetat omite ID-urile de conversație deja prezente în Classic.",
  "chatImport.source": "Baza de date sursă",
  "chatImport.destination": "Baza de date Classic",
  "chatImport.total": "Conversații în sursă",
  "chatImport.eligible": "Pregătite de import",
  "chatImport.existing": "Deja prezente",
  "chatImport.excluded": "Excluse (în coadă, în desfășurare sau spațiu de lucru)",
  "chatImport.imported": "Importate",
  "chatImport.error.unavailable":
    "Importul este disponibil doar pentru serverul desktop Linux integrat după ce își termină pornirea.",
  "chatImport.error.incompatible":
    "Bazele de date au scheme diferite sau nesuportate. Folosiți versiuni OpenCode și Classic compatibile și actualizate, apoi reluați previzualizarea. Stocarea JSON veche nu este suportată; sursa nu a fost migrată.",
  "chatImport.error.invalid":
    "Baza de date nu a putut fi citită sau validată. Verificați fișierul selectat, permisiunile și spațiul disponibil pe disc. Un import neconfirmat este anulat; reluați previzualizarea înainte de a reîncerca.",
  "chatImport.error.sameFile":
    "Sursa și destinația sunt aceeași bază de date. Nu este necesară nicio copiere.",
  "chatImport.error.conflict":
    "ID-uri de proiect sau de mesaj aflate în conflict au împiedicat acest import. Nu a fost confirmat niciun import parțial. Conversațiile Classic existente au fost păstrate.",
  "chatImport.error.busy":
    "Baza de date este ocupată sau operațiunea a durat prea mult. Închideți OpenCode, așteptați să se termine celelalte importuri, apoi reluați previzualizarea. O nouă încercare omite conversațiile deja confirmate.",
  "chatImport.error.expired":
    "Această previzualizare a expirat sau sursa ei s-a schimbat. Reluați previzualizarea bazei de date înainte de import.",
}
