export const dict = {
  "profileImport.mode": "Modo de importación",
  "profileImport.chats": "Solo conversaciones",
  "profileImport.everything": "Todo (configuración completa)",
  "profileImport.description":
    "Copia tu configuración compatible de OpenCode en un perfil de escritorio Classic vacío: conversaciones, credenciales de proveedores, cuentas en la nube, permisos, configuración global, agentes, skills, complementos, planes, instantáneas y archivos de espacios de trabajo. El origen no se modifica. La vista previa no ejecuta comandos importados ni contacta con proveedores.",
  "profileImport.boundaries":
    "Cierra primero OpenCode y deja de editar sus archivos. Las carpetas de proyectos fuera del almacenamiento de OpenCode permanecen en sus rutas originales. Las variables de entorno, las herramientas instaladas en el sistema y las preferencias de ventana del escritorio ascendente no se copian. Los registros, las cachés y los bloqueos de procesos se regeneran. Es posible que los proveedores OAuth requieran iniciar sesión de nuevo. Las carpetas personalizadas se seleccionan en este orden: datos, configuración y luego estado.",
  "profileImport.detect": "Vista previa de la configuración predeterminada",
  "profileImport.browse": "Elegir carpetas de la configuración",
  "profileImport.busy":
    "Validando o preparando la configuración completa. Mantén Classic abierto hasta que termine.",
  "profileImport.cancelled":
    "No se encontró ningún origen compatible, o se canceló la selección de carpetas.",
  "profileImport.staged":
    "La configuración está preparada y verificada. Reinicia Classic para activarla antes de que se inicie su servidor. No añadas datos a Classic antes de reiniciar; la activación comprueba de nuevo que el destino esté vacío.",
  "profileImport.activated":
    "La configuración completa se activó correctamente. Tus carpetas de proyectos siguen disponibles en sus rutas originales; los espacios de trabajo internos importados tienen copias independientes.",
  "profileImport.data": "Carpeta de datos de origen",
  "profileImport.config": "Carpeta de configuración de origen",
  "profileImport.state": "Carpeta de estado de origen",
  "profileImport.providers": "Credenciales de proveedores guardadas",
  "profileImport.accounts": "Cuentas en la nube",
  "profileImport.workspaces": "Espacios de trabajo",
  "profileImport.files": "Archivos y enlaces",
  "profileImport.bytes": "Tamaño de la copia (bytes)",
  "profileImport.plugins": "Complementos configurados",
  "profileImport.mcp": "Entradas MCP",
  "profileImport.commands": "Comandos de proyecto",
  "profileImport.permissions": "Registros de permisos",
  "profileImport.pending": "Prompts pendientes",
  "profileImport.git": "Checkouts de Git",
  "profileImport.consent":
    "He cerrado OpenCode y confío en esta configuración completa, incluidas las credenciales, la actualización de cuentas, las dependencias, los complementos, los servidores MCP, los comandos de proyecto, los hooks de Git y los permisos existentes. Estos pueden ejecutarse durante el uso normal después de la activación. Los prompts pendientes permanecen en cola hasta que se reanuden.",
  "profileImport.confirm": "Preparar la configuración completa",
  "profileImport.restart": "Reiniciar y activar la configuración",
  "profileImport.error.unavailable":
    "La importación completa requiere el servidor de escritorio Linux integrado y una configuración basada en archivos. Las configuraciones o las invalidaciones de autenticación proporcionadas por el entorno deben eliminarse antes de importar.",
  "profileImport.error.nonempty":
    "Classic ya contiene datos de configuración. La importación completa no los sobrescribe. Usa Solo conversaciones para fusionar conversaciones compatibles, o empieza con un perfil Classic vacío.",
  "profileImport.error.incompatible":
    "El esquema de la base de datos de origen no coincide con esta versión de Classic. La importación completa requiere una configuración SQLite compatible; no se intentó ninguna migración del origen.",
  "profileImport.error.invalid":
    "No se pudo validar la configuración. Comprueba los permisos de los archivos, la integridad de la base de datos y la sintaxis de la configuración. El perfil Classic en ejecución no se ha reemplazado.",
  "profileImport.error.changed":
    "El origen cambió o esta vista previa caducó. Cierra OpenCode y otros procesos que escriban, y vuelve a mostrar la vista previa.",
  "profileImport.error.busy":
    "Otra importación, un bloqueo de archivo activo o una activación pendiente impide esta operación. Cierra OpenCode y reinicia Classic antes de reintentarlo.",
  "profileImport.liveWarning":
    "Parece que OpenCode se está ejecutando ahora mismo. Su base de datos cambia continuamente, por lo que la preparación puede fallar. Cierra OpenCode (todas las ventanas) y detén sus servidores antes de confirmar para lograr una importación fiable.",
  "profileImport.detail.count": "Elementos afectados: {{count}}",
  "profileImport.materialized": "Enlaces externos copiados",
  "profileImport.skipped": "Archivos en tiempo de ejecución omitidos",
  "profileImport.error.source-busy":
    "Se está escribiendo en el origen de forma continua (probablemente haya una instancia de OpenCode en ejecución). Cierra OpenCode y sus servidores, y vuelve a mostrar la vista previa y a confirmar.",
  "profileImport.error.links":
    "La configuración contiene un enlace que no se puede copiar: un ciclo de enlaces simbólicos, o un enlace dentro de metadatos de Git donde las copias deben permanecer exactas.",
  "profileImport.error.git-objects":
    "Los metadatos de Git de la configuración usan una disposición no compatible (entradas alternates, punteros de worktree o almacenes de objetos que no se pueden privatizar de forma segura).",
  "profileImport.error.special-files":
    "La configuración contiene nodos de dispositivo u otros archivos especiales que no se pueden copiar de forma segura.",
  "profileImport.error.limit":
    "La configuración supera el límite de importación (50 GiB o 500 000 elementos). Elimina los archivos de copia de seguridad grandes o reduce las carpetas, y vuelve a mostrar la vista previa.",
  "profileImport.error.oversized-file":
    "Un archivo de configuración o de metadatos supera su límite de lectura (64 MB para configuraciones, 16 MB para metadatos de Git). Divídelo o redúcelo, y vuelve a mostrar la vista previa.",
  "profileImport.error.unsupported":
    "Esta configuración contiene enlaces no compatibles, alternates de objetos de Git cíclicos, archivos especiales o supera el límite de importación (50 GiB / 500 000 elementos). Los enlaces simbólicos externos deben materializarse antes de la importación; los archivos de origen no se modificaron.",
  "profileImport.error.space":
    "No hay suficiente espacio libre en el disco para preparar esta configuración. Libera espacio y vuelve a mostrar la vista previa.",
  "chatImport.tab": "Importación de conversaciones",
  "chatImport.title": "Importar conversaciones de OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop mantiene una base de datos de conversaciones separada. Previsualiza y copia conversaciones locales compatibles de OpenCode sin cambiar el origen ni reemplazar las conversaciones existentes de Classic. Puedes volver aquí desde los ajustes en cualquier momento.",
  "chatImport.scope":
    "Cierra OpenCode antes de importar. Esto copia las conversaciones locales completadas y su historial. Las conversaciones en cola, en curso y de espacios de trabajo quedan excluidas. Las credenciales, los permisos, los comandos de proyecto, los archivos externos y las instantáneas de deshacer no se importan. Inicia sesión por separado y mantén las carpetas de tus proyectos en sus rutas originales.",
  "chatImport.localOnly":
    "Selecciona el servidor de escritorio local integrado para importar conversaciones. Este importador no admite conexiones a servidores remotos ni de segundo plano.",
  "chatImport.detect": "Comprobar la base de datos predeterminada de OpenCode",
  "chatImport.browse": "Elegir archivo de base de datos",
  "chatImport.confirm": "Importar conversaciones elegibles",
  "chatImport.busy":
    "Comprobando o importando conversaciones. Espera antes de cerrar la aplicación.",
  "chatImport.noSource":
    "No se encontró ni seleccionó ninguna base de datos. Elige tu archivo .db de OpenCode para continuar.",
  "chatImport.complete":
    "Importación completada. Abre la carpeta del proyecto original para encontrar sus conversaciones. Repetir una importación omite los ID de conversación ya presentes en Classic.",
  "chatImport.source": "Base de datos de origen",
  "chatImport.destination": "Base de datos de Classic",
  "chatImport.total": "Conversaciones en el origen",
  "chatImport.eligible": "Listas para importar",
  "chatImport.existing": "Ya presentes",
  "chatImport.excluded": "Excluidas (en cola, en curso o de espacio de trabajo)",
  "chatImport.imported": "Importadas",
  "chatImport.error.unavailable":
    "La importación solo está disponible para el servidor de escritorio Linux integrado cuando termina de iniciarse.",
  "chatImport.error.incompatible":
    "Las bases de datos tienen esquemas diferentes o no compatibles. Usa versiones de OpenCode y Classic compatibles y actualizadas, y vuelve a mostrar la vista previa. El almacenamiento JSON heredado no es compatible; el origen no se migró.",
  "chatImport.error.invalid":
    "No se pudo leer o validar la base de datos. Comprueba el archivo seleccionado, los permisos y el espacio disponible en el disco. Una importación no confirmada se revierte; vuelve a mostrar la vista previa antes de reintentarlo.",
  "chatImport.error.sameFile":
    "El origen y el destino son la misma base de datos. No es necesario copiar.",
  "chatImport.error.conflict":
    "Identificadores de proyecto o de mensaje en conflicto impidieron esta importación. No se confirmó ninguna importación parcial. Las conversaciones existentes de Classic se conservaron.",
  "chatImport.error.busy":
    "La base de datos está ocupada o la operación tardó demasiado. Cierra OpenCode, espera a que terminen otras importaciones y vuelve a mostrar la vista previa. Un nuevo intento omite las conversaciones ya confirmadas.",
  "chatImport.error.expired":
    "Esta vista previa caducó o su origen cambió. Vuelve a mostrar la vista previa de la base de datos antes de importar.",
}
