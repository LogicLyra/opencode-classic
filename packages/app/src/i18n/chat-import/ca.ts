export const dict = {
  "profileImport.mode": "Mode d'importació",
  "profileImport.chats": "Només converses",
  "profileImport.everything": "Tot (configuració completa)",
  "profileImport.description":
    "Copia la vostra configuració compatible d'OpenCode en un perfil d'escriptori Classic buit: converses, credencials de proveïdors, comptes al núvol, permisos, configuració global, agents, skills, connectors, plans, instantànies i fitxers d'espais de treball. L'origen no es modifica. La previsualització no executa ordres importades ni contacta amb proveïdors.",
  "profileImport.boundaries":
    "Tanqueu primer l'OpenCode i deixeu d'editar-ne els fitxers. Les carpetes de projectes fora de l'emmagatzematge de l'OpenCode romanen en els seus camins originals. Les variables d'entorn, les eines instal·lades al sistema i les preferències de finestra de l'escriptori upstream no es copien. Els registres, les memòries cau i els bloquejos de procés es regeneren. Els proveïdors OAuth poden requerir iniciar sessió de nou. Les carpetes personalitzades se seleccionen en aquest ordre: dades, configuració i després estat.",
  "profileImport.detect": "Previsualitza la configuració per defecte",
  "profileImport.browse": "Tria les carpetes de la configuració",
  "profileImport.busy":
    "S'està validant o preparant la configuració completa. Manteniu el Classic obert fins que acabi.",
  "profileImport.cancelled":
    "No s'ha trobat cap origen compatible, o s'ha cancel·lat la selecció de carpetes.",
  "profileImport.staged":
    "La configuració està preparada i verificada. Reinicieu el Classic per activar-la abans que el seu servidor s'iniciï. No afegiu dades al Classic abans de reiniciar; l'activació torna a comprovar que la destinació sigui buida.",
  "profileImport.activated":
    "La configuració completa s'ha activat correctament. Les carpetes dels vostres projectes continuen disponibles en els seus camins originals; els espais de treball interns importats tenen còpies independents.",
  "profileImport.data": "Carpeta de dades d'origen",
  "profileImport.config": "Carpeta de configuració d'origen",
  "profileImport.state": "Carpeta d'estat d'origen",
  "profileImport.providers": "Credencials de proveïdors desades",
  "profileImport.accounts": "Comptes al núvol",
  "profileImport.workspaces": "Espais de treball",
  "profileImport.files": "Fitxers i enllaços",
  "profileImport.bytes": "Mida de la còpia (bytes)",
  "profileImport.plugins": "Connectors configurats",
  "profileImport.mcp": "Entrades MCP",
  "profileImport.commands": "Ordres de projecte",
  "profileImport.permissions": "Registres de permisos",
  "profileImport.pending": "Preguntes pendents",
  "profileImport.git": "Checkouts del Git",
  "profileImport.consent":
    "He tancat l'OpenCode i confio en aquesta configuració completa, incloent-hi credencials, actualització de comptes, dependències, connectors, servidors MCP, ordres de projecte, hooks del Git i permisos existents. Aquests es poden executar durant l'ús normal després de l'activació. Les preguntes pendents romanen a la cua fins que es reprenen.",
  "profileImport.confirm": "Prepara la configuració completa",
  "profileImport.restart": "Reinicia i activa la configuració",
  "profileImport.error.unavailable":
    "La importació completa requereix el servidor Linux d'escriptori integrat i una configuració basada en fitxers. Les configuracions o les substitucions d'autenticació proporcionades per l'entorn s'han d'eliminar abans d'importar.",
  "profileImport.error.nonempty":
    "El Classic ja conté dades de configuració. La importació completa no les sobreescriu. Utilitzeu Només converses per fusionar converses compatibles, o comenceu amb un perfil del Classic buit.",
  "profileImport.error.incompatible":
    "L'esquema de la base de dades d'origen no coincideix amb aquesta versió del Classic. La importació completa requereix una configuració SQLite compatible; no s'ha intentat cap migració de l'origen.",
  "profileImport.error.invalid":
    "No s'ha pogut validar la configuració. Comproveu els permisos dels fitxers, la integritat de la base de dades i la sintaxi de la configuració. El perfil del Classic en execució no s'ha substituït.",
  "profileImport.error.changed":
    "L'origen ha canviat o aquesta previsualització ha caducat. Tanqueu l'OpenCode i altres processos que escriguin, i torneu a fer la previsualització.",
  "profileImport.error.busy":
    "Una altra importació, un bloqueig de fitxer actiu o una activació pendent impedeix aquesta operació. Tanqueu l'OpenCode i reinicieu el Classic abans de tornar-ho a provar.",
  "profileImport.liveWarning":
    "Sembla que l'OpenCode s'està executant ara mateix. La seva base de dades canvia contínuament, de manera que la preparació pot fallar. Tanqueu l'OpenCode (totes les finestres) i atureu els seus servidors abans de confirmar, per a una importació fiable.",
  "profileImport.detail.count": "Elements afectats: {{count}}",
  "profileImport.materialized": "Enllaços externs copiats",
  "profileImport.skipped": "Fitxers d'execució omesos",
  "profileImport.error.source-busy":
    "S'està escrivint a l'origen de manera contínua (probablement hi ha una instància de l'OpenCode en execució). Tanqueu l'OpenCode i els seus servidors, i torneu a fer la previsualització i la confirmació.",
  "profileImport.error.links":
    "La configuració conté un enllaç que no es pot copiar: un cicle d'enllaços simbòlics, o un enllaç dins de metadades del Git on les còpies han de romandre exactes.",
  "profileImport.error.git-objects":
    "Les metadades del Git de la configuració utilitzen una disposició no admesa (entrades alternates, punters de worktree o magatzems d'objectes que no es poden privatitzar de manera segura).",
  "profileImport.error.special-files":
    "La configuració conté nodes de dispositiu o altres fitxers especials que no es poden copiar de manera segura.",
  "profileImport.error.limit":
    "La configuració supera el límit d'importació (50 GiB o 500.000 elements). Elimineu fitxers de còpia de seguretat grans o reduïu les carpetes, i torneu a fer la previsualització.",
  "profileImport.error.oversized-file":
    "Un fitxer de configuració o de metadades supera el seu límit de lectura (64 MB per a configuracions, 16 MB per a metadades del Git). Dividiu-lo o reduïu-lo, i torneu a fer la previsualització.",
  "profileImport.error.unsupported":
    "Aquesta configuració conté enllaços no admesos, alternates d'objectes del Git cíclics, fitxers especials o supera el límit d'importació (50 GiB / 500.000 elements). Els enllaços simbòlics externs s'han de materialitzar abans de la importació; els fitxers d'origen no s'han modificat.",
  "profileImport.error.space":
    "No hi ha espai lliure al disc suficient per preparar aquesta configuració. Allibereu espai i torneu a fer la previsualització.",
  "chatImport.tab": "Importació de converses",
  "chatImport.title": "Importa converses de l'OpenCode",
  "chatImport.description":
    "L'OpenCode Classic Desktop manté una base de dades de converses separada. Previsualitzeu i copieu converses locals compatibles de l'OpenCode sense modificar l'origen ni substituir les converses existents del Classic. Podeu tornar aquí des de la configuració en qualsevol moment.",
  "chatImport.scope":
    "Tanqueu l'OpenCode abans d'importar. Això copia les converses locals completades i el seu historial. Les converses en cua, en curs i les d'espais de treball queden excloses. Les credencials, els permisos, les ordres de projecte, els fitxers externs i les instantànies de desfer no s'importen. Inicieu sessió per separat i manteniu les carpetes dels vostres projectes en els seus camins originals.",
  "chatImport.localOnly":
    "Seleccioneu el servidor d'escriptori local integrat per importar converses. Aquest importador no admet connexions a servidors remots ni en segon pla.",
  "chatImport.detect": "Comprova la base de dades de l'OpenCode per defecte",
  "chatImport.browse": "Tria un fitxer de base de dades",
  "chatImport.confirm": "Importa les converses elegibles",
  "chatImport.busy":
    "S'estan comprovant o important converses. Espereu abans de tancar l'aplicació.",
  "chatImport.noSource":
    "No s'ha trobat ni seleccionat cap base de dades. Trieu el vostre fitxer .db de l'OpenCode per continuar.",
  "chatImport.complete":
    "Importació completada. Obriu la carpeta del projecte original per trobar-ne les converses. Repetir una importació omet els IDs de conversa ja presents al Classic.",
  "chatImport.source": "Base de dades d'origen",
  "chatImport.destination": "Base de dades del Classic",
  "chatImport.total": "Converses a l'origen",
  "chatImport.eligible": "Llestes per importar",
  "chatImport.existing": "Ja presents",
  "chatImport.excluded": "Excloses (en cua, en curs o espai de treball)",
  "chatImport.imported": "Importades",
  "chatImport.error.unavailable":
    "La importació només està disponible per al servidor Linux d'escriptori integrat quan ha acabat d'iniciar-se.",
  "chatImport.error.incompatible":
    "Les bases de dades tenen esquemes diferents o no admesos. Utilitzeu versions compatibles i actualitzades de l'OpenCode i del Classic, i torneu a fer la previsualització. L'emmagatzematge JSON antic no és admès; l'origen no s'ha migrat.",
  "chatImport.error.invalid":
    "No s'ha pogut llegir o validar la base de dades. Comproveu el fitxer seleccionat, els permisos i l'espai de disc disponible. Una importació no confirmada es reverteix; torneu a fer la previsualització abans de reintentar-ho.",
  "chatImport.error.sameFile":
    "L'origen i la destinació són la mateixa base de dades. No cal cap còpia.",
  "chatImport.error.conflict":
    "IDs de projecte o de missatge en conflicte han impedit aquesta importació. No s'ha confirmat cap importació parcial. Les converses existents del Classic s'han conservat.",
  "chatImport.error.busy":
    "La base de dades està ocupada o l'operació ha trigat massa. Tanqueu l'OpenCode, espereu que acabin les altres importacions i torneu a fer la previsualització. Un nou intent omet les converses ja confirmades.",
  "chatImport.error.expired":
    "Aquesta previsualització ha caducat o el seu origen ha canviat. Torneu a fer la previsualització de la base de dades abans d'importar.",
}
