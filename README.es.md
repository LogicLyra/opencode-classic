<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">El agente de programación con IA de código abierto.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic es un fork no oficial centrado en Linux que sigue al upstream, usa el diseño clásico de escritorio por defecto y mantiene el diseño rediseñado disponible en Ajustes. Sus publicaciones y su actualizador se mantienen de forma independiente en [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). El contenido más profundo se hereda del upstream y puede quedar desfasado.


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

### Trae tu configuración desde OpenCode

OpenCode Classic Desktop usa un perfil separado para su servidor integrado.
**Ajustes > Importación de conversaciones** y el diálogo del primer inicio ofrecen
**Solo conversaciones** y **Todo (configuración completa)**. Para **Solo
conversaciones** se aplica el siguiente comportamiento de fusión:
En el primer inicio, o en **Ajustes > Importación de conversaciones**, elige
**Comprobar la base de datos predeterminada de OpenCode** o selecciona un archivo
`.db`. Cierra OpenCode primero, revisa el origen, el destino y los conteos, y elige
**Importar conversaciones elegibles**.

- El origen predeterminado es `$XDG_DATA_HOME/opencode/opencode.db`, normalmente
  `~/.local/share/opencode/opencode.db`. Elige un archivo para rutas personalizadas o
  bases de datos del canal de desarrollo. El destino es la base de datos del servidor
  de escritorio integrado activo, en el directorio `sidecar` del perfil de escritorio
  de Classic. Este importador no admite conexiones remotas ni servidores
  experimentales en segundo plano.
- El importador admite esquemas SQLite e historiales de migración coincidentes.
  No migra archivos de origen ni importa almacenamiento JSON heredado. Si las
  comprobaciones de compatibilidad fallan, usa versiones compatibles de OpenCode y
  Classic y vuelve a mostrar la vista previa.
- Las conversaciones locales completadas conservan sus ID, títulos, marcas de
  tiempo, mensajes, partes, historial v2, tareas y rutas de proyecto originales.
  Los ID de conversación existentes se omiten como unidad; reimportar no actualiza
  una conversación ya importada. El origen es de solo lectura, incluida su
  historia WAL, y cada importación se confirma de forma atómica.
- Las conversaciones con prompts en cola, trabajo sin terminar o ubicación
  explícita en espacio de trabajo se excluyen y se cuentan. Importar nunca inicia
  un prompt ni ejecuta un comando. Las credenciales, el estado de cuentas, los
  permisos, los comandos de proyecto, la propiedad de compartidos, los adjuntos
  externos, las instantáneas de Git y los borradores de escritorio no se copian.
  Inicia sesión por separado y mantén las carpetas de tus proyectos en sus rutas
  originales. Las instantáneas históricas de deshacer no están disponibles; los
  datos de adjuntos incrustados permanecen en la transcripción, mientras que los
  archivos externos deben seguir existiendo.
- Abre la carpeta del proyecto original en Classic para ver sus conversaciones
  importadas. Es una copia única, no una sincronización continua entre
  aplicaciones.

#### Todo (configuración completa)

Cierra primero OpenCode y detén a otros escritores. Elige **Vista previa de la
configuración predeterminada**, o **Elegir carpetas de la configuración** y
selecciona las carpetas de OpenCode de **datos**, **configuración** y **estado**.
Normalmente residen en `~/.local/share/opencode`, `~/.config/opencode` y
`~/.local/state/opencode`; se respetan las anulaciones XDG. Revisa los conteos,
reconoce que confías en la configuración, confirma en el diálogo nativo y reinicia
Classic para activar el perfil preparado.

- Requiere un perfil Linux integrado de Classic vacío. Las conversaciones,
  proveedores, ajustes personalizados, cuentas y proyectos registrados existentes
  nunca se sobrescriben. Los archivos predeterminados de configuración/plugin
  generados se reconocen como estado de arranque.
- Copia las 19 tablas de la base de datos de la aplicación, el `auth.json` de
  proveedores, las cuentas en la nube, las credenciales de integraciones, los
  permisos, los metadatos de compartidos, los archivos de configuración (incluido
  JSONC), los agentes, las skills, los plugins, el estado, los planes, la salida de
  herramientas, los archivos de espacios de trabajo y las instantáneas. Los prompts
  pendientes permanecen en cola; la importación no los ejecuta.
- Las rutas de proyectos externas permanecen sin cambios en la misma máquina. Las
  rutas internas, los patrones de permisos y las claves de instantáneas se
  reasignan. Los worktrees enlazados reciben metadatos Git privados y los
  alternates de objetos de instantáneas se materializan para que las copias no
  dependan de los almacenes de objetos originales.
- SQLite lee una copia privada de la DB/WAL de origen. La DB de origen, el WAL y
  los archivos de memoria compartida quedan sin cambios. La preparación usa
  permisos privados y un registro duradero de propiedad. La activación ocurre
  antes de que arranque el servidor integrado y recupera renombrados de
  directorios interrumpidos. El perfil original vacío/de arranque se conserva bajo
  `.profile-import-retained-<operation-id>` en el perfil de escritorio de Classic
  para inspección; no se elimina automáticamente.
- Las credenciales siguen siendo archivos locales protegidos. La configuración
  completa también conserva el comportamiento ejecutable: la actualización de
  cuentas, la instalación de dependencias, los plugins, las conexiones MCP, los
  comandos de proyecto, y los hooks/ayudantes de Git y las concesiones de permisos
  pueden surtir efecto durante el uso normal tras la activación. Importa solo una
  configuración en la que confíes. La rotación de tokens OAuth puede requerir
  iniciar sesión de nuevo si usas ambas aplicaciones.
- Los registros, cachés y bloqueos de procesos se regeneran. Los programas del
  sistema, las variables de entorno del shell, las preferencias de
  ventana/barra lateral de escritorio del upstream y los borradores de escritorio
  no se copian. Los archivos de proyectos externos ya están compartidos en sus
  rutas originales. Abre la carpeta del proyecto original para acceder a sus
  conversaciones.
- Requiere un historial de migración y un esquema SQLite coincidentes. La
  configuración completa actualmente lee `opencode.db`; las anulaciones de
  base de datos/configuración/autenticación proporcionadas por el entorno deben
  eliminarse antes de usarla. Los almacenamientos solo JSON heredados, las
  referencias cíclicas o no admitidas de objetos Git, los nodos de dispositivo y
  los perfiles por encima de 50 GiB o 500.000 entradas de inventario se rechazan
  con un motivo específico. Los symlinks externos se copian a través
  (materializados); los enlaces rotos, sockets y fifos se omiten y se cuentan en
  el resumen. Se admiten archivos de configuración de hasta 64 MB. Se requiere
  espacio adicional en disco para la preparación.
- Cierra OpenCode antes de importar. La vista previa avisa cuando detecta una
  instancia en ejecución, las copias de instantáneas se reintentan
  automáticamente, y un origen escrito continuamente informa un error dedicado de
  ocupado pidiéndote que lo cierres.

La CLI independiente de Classic sigue usando las raíces XDG predeterminadas de
OpenCode salvo que las anules. Su comando `uninstall` preserva datos,
credenciales, configuración, caché y estado por defecto, también con `--force`.
Eliminar esas raíces compartidas requiere `--remove-shared-data`; `--keep-data` y
`--keep-config` anulan esa solicitud para sus raíces respectivas. Revisa las
rutas con `uninstall --dry-run`. El propio desinstalador del upstream aún puede
borrar datos compartidos de la CLI. El fork se niega a abrir bases de datos con
migraciones desconocidas; actualiza Classic en lugar de editar o borrar un
registro de migraciones.

### Instalación

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> El paquete npm `opencode-ai` y los paquetes existentes de Homebrew, Scoop, Chocolatey, AUR y Nix distribuyen el OpenCode upstream, no OpenCode Classic.

### App de escritorio (BETA)

Las compilaciones de escritorio de OpenCode Classic solo admiten Linux y están disponibles en la [página de releases del fork](https://github.com/LogicLyra/opencode-classic/releases).

| Plataforma | Descarga                                             |
| ---------- | ---------------------------------------------------- |
| Linux x64  | `opencode-classic-desktop-linux-*` (`.deb` o `.rpm`) |

AppImage no se distribuye intencionadamente. Ubuntu 24.04 y posteriores pueden forzar que las AppImages de Electron desactiven el sandboxing de Chromium bajo la política AppArmor predeterminada; los formatos deb y RPM instalados conservan la integración de sandbox que espera la distribución.

Los mantenedores pueden reproducir la comprobación completa de compilación, empaquetado, deb instalado y release visual con el [runbook de QA de releases en VM Linux](docs/linux-vm-qa.md).

#### Directorio de instalación

El script de instalación respeta el siguiente orden de prioridad para la ruta de instalación:

1. `$OPENCODE_INSTALL_DIR` - Directorio de instalación personalizado
2. `$XDG_BIN_DIR` - Ruta conforme a la XDG Base Directory Specification
3. `$HOME/bin` - Directorio binario estándar del usuario (si existe o puede crearse)
4. `$HOME/.opencode/bin` - Alternativa predeterminada

```bash
# Ejemplos
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agentes

OpenCode incluye dos agentes integrados que puedes alternar con la tecla `Tab`.

- **build** - Por defecto, agente con acceso completo para tareas de desarrollo
- **plan** - Agente de solo lectura para análisis y exploración de código
  - Deniega ediciones de archivos por defecto
  - Pide permiso antes de ejecutar comandos bash
  - Ideal para explorar codebases desconocidas o planificar cambios

Además, incluye un subagente **general** para búsquedas complejas y tareas de varios pasos.
Se usa internamente y se puede invocar con `@general` en los mensajes.

Más información sobre [agentes](https://opencode.ai/docs/agents).

### Documentación

Para más información sobre cómo configurar OpenCode, [**ve a nuestra documentación**](https://opencode.ai/docs).

### Contribuir

Si te interesa contribuir a OpenCode, lee nuestras [docs de contribución](./CONTRIBUTING.md) antes de enviar un pull request.

### Proyectos basados en OpenCode

Si estás trabajando en un proyecto basado en OpenCode y usas "opencode" como parte del nombre, por ejemplo, "opencode-dashboard" u "opencode-mobile", agrega una nota en tu README para aclarar que no está hecho por el equipo de OpenCode y que no está afiliado con nosotros de ninguna manera.

---

**Únete a nuestra comunidad** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
