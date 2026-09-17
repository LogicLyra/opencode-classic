<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logo OpenCode">
    </picture>
  </a>
</p>
<p align="center">L'agent de codage IA open source.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic est un fork non officiel centré sur Linux qui suit l'amont, utilise la disposition classique du bureau par défaut et garde la disposition repensée disponible dans les paramètres. Ses publications et son moteur de mise à jour sont maintenus indépendamment sur [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic). Le contenu plus profond est hérité de l'amont et peut être en retard.


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

### Ramener votre installation depuis OpenCode

OpenCode Classic Desktop utilise un profil distinct pour son serveur intégré.
**Paramètres > Import de conversations** et la boîte de dialogue du premier
lancement proposent **Conversations uniquement** et **Tout (installation
complète)**. Pour **Conversations uniquement**, le comportement de fusion suivant
s'applique :
Au premier lancement, ou sous **Paramètres > Import de conversations**, choisissez
**Vérifier la base de données OpenCode par défaut** ou sélectionnez un fichier
`.db`. Fermez d'abord OpenCode, vérifiez la source, la destination et les nombres,
puis choisissez **Importer les conversations éligibles**.

- La source par défaut est `$XDG_DATA_HOME/opencode/opencode.db`, normalement
  `~/.local/share/opencode/opencode.db`. Choisissez un fichier pour des chemins
  personnalisés ou des bases du canal de développement. La destination est la base
  de données du serveur de bureau intégré actif, dans le répertoire `sidecar` du
  profil de bureau de Classic. Ce logiciel d'importation ne prend pas en charge les
  connexions distantes ni les serveurs d'arrière-plan expérimentaux.
- Le logiciel d'importation prend en charge les schémas SQLite et les historiques
  de migration correspondants. Il ne migre pas les fichiers sources et
  n'importe pas le stockage JSON hérité. Si les contrôles de compatibilité
  échouent, utilisez des versions OpenCode et Classic compatibles et relancez
  l'aperçu.
- Les conversations locales terminées conservent leurs identifiants, titres,
  horodatages, messages, parties, historique v2, tâches et chemins de projet
  d'origine. Les identifiants de conversation déjà présents sont ignorés dans
  leur intégralité ; réimporter ne met pas à jour une conversation déjà
  importée. La source est en lecture seule, y compris son historique WAL, et
  chaque importation est validée atomiquement.
- Les conversations avec des messages en attente, un travail inachevé ou un
  placement explicite dans un espace de travail sont exclues et comptées.
  L'importation ne démarre jamais une requête ni n'exécute une commande. Les
  identifiants, l'état des comptes, les autorisations, les commandes de projet,
  la propriété des partages, les pièces jointes externes, les instantanés Git et
  les brouillons du bureau ne sont pas copiés. Connectez-vous séparément et
  laissez vos dossiers de projets à leurs emplacements d'origine. Les
  instantanés d'annulation historiques sont indisponibles ; les données de pièces
  jointes intégrées restent dans la transcription, tandis que les fichiers
  externes doivent toujours exister.
- Ouvrez le dossier du projet d'origine dans Classic pour voir ses conversations
  importées. Il s'agit d'une copie unique, pas d'une synchronisation continue
  entre applications.

#### Tout (installation complète)

Fermez d'abord OpenCode et arrêtez les autres processus écrivains. Choisissez
**Aperçu de l'installation par défaut**, ou **Choisir les dossiers de
l'installation** et sélectionnez les dossiers OpenCode **données**,
**configuration** puis **état**. Ils se trouvent normalement dans
`~/.local/share/opencode`, `~/.config/opencode` et `~/.local/state/opencode` ;
les substitutions XDG sont respectées. Vérifiez les nombres, reconnaissez que
vous faites confiance à l'installation, confirmez dans la boîte de dialogue
native, puis redémarrez Classic pour activer le profil préparé.

- Nécessite un profil Linux intégré Classic vide. Les conversations, fournisseurs,
  réglages personnalisés, comptes et projets enregistrés existants ne sont jamais
  écrasés. Les fichiers de configuration/plugin par défaut générés sont reconnus
  comme état d'amorçage.
- Copie les 19 tables de la base de données de l'application, le `auth.json` des
  fournisseurs, les comptes cloud, les identifiants d'intégration, les
  autorisations, les métadonnées de partage, les fichiers de configuration (y
  compris JSONC), les agents, les skills, les plugins, l'état, les plans, la
  sortie des outils, les fichiers d'espaces de travail et les instantanés. Les
  requêtes en attente restent en file ; l'importation ne les exécute pas.
- Les chemins de projets externes restent inchangés sur la même machine. Les
  chemins internes, les motifs d'autorisation et les clés d'instantanés sont
  réaffectés. Les worktrees liés reçoivent des métadonnées Git privées, et les
  alternates d'objets d'instantanés sont matérialisés pour que les copies ne
  dépendent pas des magasins d'objets d'origine.
- SQLite lit une copie privée de la base/WAL source. La base source, le WAL et
  les fichiers de mémoire partagée restent inchangés. La préparation utilise des
  autorisations privées et un journal durable de propriété. L'activation a lieu
  avant le démarrage du serveur intégré et récupère les renommages de répertoires
  interrompus. Le profil vide/d'amorçage d'origine est conservé sous
  `.profile-import-retained-<operation-id>` dans le profil de bureau de Classic
  pour inspection ; il n'est pas supprimé automatiquement.
- Les identifiants restent des fichiers locaux protégés. L'installation complète
  préserve aussi le comportement exécutable : l'actualisation des comptes,
  l'installation des dépendances, les plugins, les connexions MCP, les commandes
  de projet, ainsi que les hooks/assistants Git et les autorisations accordées
  peuvent prendre effet pendant l'utilisation normale après l'activation.
  N'importez qu'une installation à laquelle vous faites confiance. La rotation
  des jetons OAuth peut obliger à se reconnecter lorsque les deux applications
  sont utilisées.
- Les journaux, caches et verrous de processus sont régénérés. Les programmes
  système, les variables d'environnement du shell, les préférences de
  fenêtre/barre latérale du bureau amont et les brouillons du bureau ne sont pas
  copiés. Les fichiers de projets externes sont déjà partagés à leurs emplacements
  d'origine. Ouvrez le dossier du projet d'origine pour accéder à ses
  conversations.
- Nécessite un historique de migration et un schéma SQLite correspondants.
  L'installation complète lit actuellement `opencode.db` ; les substitutions de
  base/config/auth fournies par l'environnement doivent être supprimées avant de
  l'utiliser. Les stockages JSON hérités uniquement, les références d'objets Git
  cycliques ou non prises en charge, les nœuds de périphérique et les profils
  dépassant 50 Gio ou 500 000 entrées d'inventaire sont refusés avec un motif
  précis. Les liens symboliques externes sont copiés tels quels (matérialisés) ;
  les liens cassés, sockets et fifos sont ignorés et comptés dans le résumé. Les
  fichiers de configuration jusqu'à 64 Mo sont pris en charge. Un espace disque
  supplémentaire est nécessaire pour la préparation.
- Fermez OpenCode avant d'importer. L'aperçu avertit lorsqu'une instance en cours
  d'exécution est détectée, les copies d'instantanés sont retentées
  automatiquement, et une source écrite en continu signale une erreur
  d'occupation dédiée vous demandant de la fermer.

La CLI autonome de Classic continue d'utiliser les racines XDG par défaut
d'OpenCode sauf si vous les remplacez. Sa commande `uninstall` préserve les
données, identifiants, configuration, cache et état par défaut, y compris avec
`--force`. Supprimer ces racines partagées exige `--remove-shared-data` ;
`--keep-data` et `--keep-config` remplacent cette demande pour leurs racines
respectives. Examinez les chemins avec `uninstall --dry-run`. Le désinstallateur
d'OpenCode amont peut encore supprimer des données CLI partagées. Le fork refuse
d'ouvrir des bases contenant des migrations inconnues ; mettez Classic à jour
plutôt que d'éditer ou de supprimer un journal de migrations.

### Installation

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> Le paquet npm `opencode-ai` et les paquets Homebrew, Scoop, Chocolatey, AUR et Nix existants distribuent l'OpenCode amont, pas OpenCode Classic.

### Application de bureau (BETA)

Les builds de bureau d'OpenCode Classic ne prennent en charge que Linux et sont disponibles sur la [page des releases du fork](https://github.com/LogicLyra/opencode-classic/releases).

| Plateforme | Téléchargement                                        |
| ---------- | ----------------------------------------------------- |
| Linux x64  | `opencode-classic-desktop-linux-*` (`.deb` ou `.rpm`) |

AppImage n'est volontairement pas distribué. Ubuntu 24.04 et ultérieur peuvent forcer les AppImages Electron à désactiver le sandboxing de Chromium sous la politique AppArmor par défaut ; les formats deb et RPM installés conservent l'intégration du sandbox attendue par la distribution.

Les mainteneurs peuvent reproduire la vérification complète de build, d'empaquetage, de deb installé et de release visuelle avec le [runbook d'assurance qualité sur VM Linux](docs/linux-vm-qa.md).

#### Répertoire d'installation

Le script d'installation respecte l'ordre de priorité suivant pour le chemin d'installation :

1. `$OPENCODE_INSTALL_DIR` - Répertoire d'installation personnalisé
2. `$XDG_BIN_DIR` - Chemin conforme à la XDG Base Directory Specification
3. `$HOME/bin` - Répertoire binaire standard de l'utilisateur (s'il existe ou peut être créé)
4. `$HOME/.opencode/bin` - Repli par défaut

```bash
# Exemples
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode inclut deux agents intégrés que vous pouvez basculer avec la touche `Tab`.

- **build** - Par défaut, agent avec accès complet pour le travail de développement
- **plan** - Agent en lecture seule pour l'analyse et l'exploration du code
  - Refuse les modifications de fichiers par défaut
  - Demande l'autorisation avant d'exécuter des commandes bash
  - Idéal pour explorer une base de code inconnue ou planifier des changements

Un sous-agent **general** est aussi inclus pour les recherches complexes et les tâches en plusieurs étapes.
Il est utilisé en interne et peut être invoqué via `@general` dans les messages.

En savoir plus sur les [agents](https://opencode.ai/docs/agents).

### Documentation

Pour plus d'informations sur la configuration d'OpenCode, [**consultez notre documentation**](https://opencode.ai/docs).

### Contribuer

Si vous souhaitez contribuer à OpenCode, lisez nos [docs de contribution](./CONTRIBUTING.md) avant de soumettre une pull request.

### Construire avec OpenCode

Si vous travaillez sur un projet lié à OpenCode et que vous utilisez "opencode" dans le nom du projet (par exemple, "opencode-dashboard" ou "opencode-mobile"), ajoutez une note dans votre README pour préciser qu'il n'est pas construit par l'équipe OpenCode et qu'il n'est pas affilié à nous.

---

**Rejoignez notre communauté** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
