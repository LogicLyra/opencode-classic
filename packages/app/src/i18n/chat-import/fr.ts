export const dict = {
  "profileImport.mode": "Mode d'importation",
  "profileImport.chats": "Conversations uniquement",
  "profileImport.everything": "Tout (installation complète)",
  "profileImport.description":
    "Copie votre installation OpenCode compatible dans un profil Classic de bureau vide : conversations, identifiants de fournisseurs, comptes cloud, permissions, configuration globale, agents, skills, plugins, plans, instantanés et fichiers d'espaces de travail. La source reste inchangée. L'aperçu n'exécute aucune commande importée et ne contacte aucun fournisseur.",
  "profileImport.boundaries":
    "Fermez d'abord OpenCode et cessez de modifier ses fichiers. Les dossiers de projets situés en dehors du stockage OpenCode restent à leurs emplacements d'origine. Les variables d'environnement, les outils installés au niveau du système et les préférences de fenêtre du bureau amont ne sont pas copiés. Les journaux, caches et verrous de processus sont régénérés. Les fournisseurs OAuth peuvent nécessiter une nouvelle connexion. Les dossiers personnalisés sont sélectionnés dans cet ordre : données, configuration, puis état.",
  "profileImport.detect": "Aperçu de l'installation par défaut",
  "profileImport.browse": "Choisir les dossiers de l'installation",
  "profileImport.busy":
    "Validation ou préparation de l'installation complète. Gardez Classic ouvert jusqu'à la fin de l'opération.",
  "profileImport.cancelled":
    "Aucune source compatible n'a été trouvée, ou la sélection de dossiers a été annulée.",
  "profileImport.staged":
    "L'installation est préparée et vérifiée. Redémarrez Classic pour l'activer avant le démarrage de son serveur. N'ajoutez pas de données à Classic avant le redémarrage ; l'activation revérifie que la destination est vide.",
  "profileImport.activated":
    "L'installation complète a été activée avec succès. Vos dossiers de projets restent disponibles à leurs emplacements d'origine ; les espaces de travail internes importés disposent de copies indépendantes.",
  "profileImport.data": "Dossier de données source",
  "profileImport.config": "Dossier de configuration source",
  "profileImport.state": "Dossier d'état source",
  "profileImport.providers": "Identifiants de fournisseurs enregistrés",
  "profileImport.accounts": "Comptes cloud",
  "profileImport.workspaces": "Espaces de travail",
  "profileImport.files": "Fichiers et liens",
  "profileImport.bytes": "Taille de la copie (octets)",
  "profileImport.plugins": "Plugins configurés",
  "profileImport.mcp": "Entrées MCP",
  "profileImport.commands": "Commandes de projet",
  "profileImport.permissions": "Enregistrements de permissions",
  "profileImport.pending": "Invites en attente",
  "profileImport.git": "Checkouts Git",
  "profileImport.consent":
    "J'ai fermé OpenCode et je fais confiance à cette installation complète, y compris aux identifiants, au rafraîchissement des comptes, aux dépendances, aux plugins, aux serveurs MCP, aux commandes de projet, aux hooks Git et aux permissions existantes. Ceux-ci peuvent s'exécuter lors d'une utilisation normale après l'activation. Les invites en attente restent en file d'attente jusqu'à leur reprise.",
  "profileImport.confirm": "Préparer l'installation complète",
  "profileImport.restart": "Redémarrer et activer l'installation",
  "profileImport.error.unavailable":
    "L'importation complète nécessite le serveur Linux de bureau intégré et une configuration par fichiers. Les configurations ou redéfinitions d'authentification fournies par l'environnement doivent être supprimées avant l'importation.",
  "profileImport.error.nonempty":
    "Classic contient déjà des données d'installation. L'importation complète ne les écrase pas. Utilisez Conversations uniquement pour fusionner des conversations compatibles, ou commencez avec un profil Classic vide.",
  "profileImport.error.incompatible":
    "Le schéma de la base de données source ne correspond pas à cette version de Classic. L'importation complète nécessite une installation SQLite compatible ; aucune migration de la source n'a été tentée.",
  "profileImport.error.invalid":
    "L'installation n'a pas pu être validée. Vérifiez les permissions des fichiers, l'intégrité de la base de données et la syntaxe de configuration. Le profil Classic en cours n'a pas été remplacé.",
  "profileImport.error.changed":
    "La source a changé ou cet aperçu a expiré. Fermez OpenCode et les autres processus écrivains, puis relancez l'aperçu.",
  "profileImport.error.busy":
    "Une autre importation, un verrou de fichier actif ou une activation en attente empêche cette opération. Fermez OpenCode et redémarrez Classic avant de réessayer.",
  "profileImport.liveWarning":
    "OpenCode semble être en cours d'exécution. Sa base de données change continuellement, ce qui peut faire échouer la préparation. Fermez OpenCode (toutes les fenêtres) et arrêtez ses serveurs avant de confirmer, pour une importation fiable.",
  "profileImport.detail.count": "Éléments concernés : {{count}}",
  "profileImport.materialized": "Liens externes copiés",
  "profileImport.skipped": "Fichiers d'exécution ignorés",
  "profileImport.error.source-busy":
    "La source est écrite en continu (une instance d'OpenCode est probablement en cours d'exécution). Fermez OpenCode et ses serveurs, puis relancez l'aperçu et la confirmation.",
  "profileImport.error.links":
    "L'installation contient un lien impossible à copier : un cycle de liens symboliques, ou un lien dans des métadonnées Git où les copies doivent rester exactes.",
  "profileImport.error.git-objects":
    "Les métadonnées Git de l'installation utilisent une disposition non prise en charge (entrées alternates, pointeurs de worktree ou magasins d'objets impossibles à privatiser sans risque).",
  "profileImport.error.special-files":
    "L'installation contient des nœuds de périphérique ou d'autres fichiers spéciaux impossibles à copier sans risque.",
  "profileImport.error.limit":
    "L'installation dépasse la limite d'importation (50 Gio ou 500 000 éléments). Supprimez les gros fichiers de sauvegarde ou réduisez les dossiers, puis relancez l'aperçu.",
  "profileImport.error.oversized-file":
    "Un fichier de configuration ou de métadonnées dépasse sa limite de lecture (64 Mo pour les configurations, 16 Mo pour les métadonnées Git). Fractionnez-le ou réduisez-le, puis relancez l'aperçu.",
  "profileImport.error.unsupported":
    "Cette installation contient des liens non pris en charge, des alternates d'objets Git cycliques, des fichiers spéciaux ou dépasse la limite d'importation (50 Gio / 500 000 éléments). Les liens symboliques externes doivent être matérialisés avant l'importation ; les fichiers sources n'ont pas été modifiés.",
  "profileImport.error.space":
    "L'espace disque libre est insuffisant pour préparer cette installation. Libérez de l'espace et relancez l'aperçu.",
  "chatImport.tab": "Import de conversations",
  "chatImport.title": "Importer des conversations depuis OpenCode",
  "chatImport.description":
    "OpenCode Classic Desktop conserve une base de données de conversations distincte. Prévisualisez et copiez des conversations locales compatibles depuis OpenCode sans modifier la source ni remplacer les conversations Classic existantes. Vous pouvez revenir ici à tout moment depuis les paramètres.",
  "chatImport.scope":
    "Fermez OpenCode avant d'importer. Cela copie les conversations locales terminées et leur historique. Les conversations en file d'attente, en cours et celles d'espaces de travail sont exclues. Les identifiants, permissions, commandes de projet, fichiers externes et instantanés d'annulation ne sont pas importés. Connectez-vous séparément et gardez vos dossiers de projets à leurs emplacements d'origine.",
  "chatImport.localOnly":
    "Sélectionnez le serveur de bureau local intégré pour importer des conversations. Les connexions aux serveurs distants et aux serveurs d'arrière-plan ne sont pas prises en charge par cet importateur.",
  "chatImport.detect": "Vérifier la base de données OpenCode par défaut",
  "chatImport.browse": "Choisir un fichier de base de données",
  "chatImport.confirm": "Importer les conversations éligibles",
  "chatImport.busy":
    "Vérification ou importation des conversations en cours. Veuillez patienter avant de fermer l'application.",
  "chatImport.noSource":
    "Aucune base de données n'a été trouvée ou sélectionnée. Choisissez votre fichier .db OpenCode pour continuer.",
  "chatImport.complete":
    "Importation terminée. Ouvrez le dossier de projet d'origine pour y retrouver ses conversations. Une importation répétée ignore les identifiants de conversation déjà présents dans Classic.",
  "chatImport.source": "Base de données source",
  "chatImport.destination": "Base de données Classic",
  "chatImport.total": "Conversations dans la source",
  "chatImport.eligible": "Prêtes à importer",
  "chatImport.existing": "Déjà présentes",
  "chatImport.excluded": "Exclues (en file d'attente, en cours ou espace de travail)",
  "chatImport.imported": "Importées",
  "chatImport.error.unavailable":
    "L'importation n'est disponible que pour le serveur de bureau Linux intégré, une fois son démarrage terminé.",
  "chatImport.error.incompatible":
    "Les bases de données ont des schémas différents ou non pris en charge. Utilisez des versions OpenCode et Classic compatibles et à jour, puis relancez l'aperçu. Le stockage JSON hérité n'est pas pris en charge ; la source n'a pas été migrée.",
  "chatImport.error.invalid":
    "La base de données n'a pas pu être lue ou validée. Vérifiez le fichier sélectionné, les permissions et l'espace disque disponible. Une importation non validée est annulée ; relancez l'aperçu avant de réessayer.",
  "chatImport.error.sameFile":
    "La source et la destination sont la même base de données. Aucune copie n'est nécessaire.",
  "chatImport.error.conflict":
    "Des identifiants de projet ou de message en conflit ont empêché cette importation. Aucune importation partielle n'a été validée. Les conversations Classic existantes ont été préservées.",
  "chatImport.error.busy":
    "La base de données est occupée ou l'opération a pris trop de temps. Fermez OpenCode, attendez la fin des autres importations, puis relancez l'aperçu. Une nouvelle tentative ignore les conversations déjà validées.",
  "chatImport.error.expired":
    "Cet aperçu a expiré ou sa source a changé. Relancez l'aperçu de la base de données avant d'importer.",
}
