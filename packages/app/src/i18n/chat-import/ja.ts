export const dict = {
  "profileImport.mode": "インポートモード",
  "profileImport.chats": "チャットのみ",
  "profileImport.everything": "すべて（完全なセットアップ）",
  "profileImport.description":
    "互換性のある OpenCode セットアップを、空の Classic デスクトッププロファイルにコピーします：チャット、プロバイダーのログイン情報、クラウドアカウント、権限、グローバル設定、エージェント、skills、プラグイン、プラン、スナップショット、ワークスペースファイル。ソースは変更されません。プレビューはインポートしたコマンドを実行せず、プロバイダーにも接続しません。",
  "profileImport.boundaries":
    "まず OpenCode を終了し、そのファイルの編集をやめてください。OpenCode ストレージの外にあるプロジェクトフォルダーは元のパスに残ります。環境変数、システムにインストールされたツール、アップストリームのデスクトップウィンドウ設定はコピーされません。ログ、キャッシュ、プロセスロックは再生成されます。OAuth プロバイダーでは再ログインが必要になる場合があります。カスタムフォルダーはこの順序で選択されます：データ、設定、次に状態。",
  "profileImport.detect": "デフォルトのセットアップをプレビュー",
  "profileImport.browse": "セットアップフォルダーを選択",
  "profileImport.busy":
    "完全なセットアップを検証またはステージングしています。完了するまで Classic を開いたままにしてください。",
  "profileImport.cancelled":
    "互換性のあるソースが見つからないか、フォルダー選択がキャンセルされました。",
  "profileImport.staged":
    "セットアップはステージングされ、検証済みです。サーバーが起動する前にアクティブ化するため、Classic を再起動してください。再起動前に Classic へデータを追加しないでください。アクティブ化時に宛先が空であることが再確認されます。",
  "profileImport.activated":
    "完全なセットアップが正常にアクティブ化されました。プロジェクトフォルダーは元のパスで引き続き利用できます。インポートされた内部ワークスペースは独立したコピーを持ちます。",
  "profileImport.data": "ソースのデータフォルダー",
  "profileImport.config": "ソースの設定フォルダー",
  "profileImport.state": "ソースの状態フォルダー",
  "profileImport.providers": "保存されたプロバイダーのログイン情報",
  "profileImport.accounts": "クラウドアカウント",
  "profileImport.workspaces": "ワークスペース",
  "profileImport.files": "ファイルとリンク",
  "profileImport.bytes": "コピー容量（バイト）",
  "profileImport.plugins": "設定済みのプラグイン",
  "profileImport.mcp": "MCP エントリ",
  "profileImport.commands": "プロジェクトコマンド",
  "profileImport.permissions": "権限レコード",
  "profileImport.pending": "保留中のプロンプト",
  "profileImport.git": "Git チェックアウト",
  "profileImport.consent":
    "私は OpenCode を終了済みで、ログイン情報、アカウントの更新、依存関係、プラグイン、MCP サーバー、プロジェクトコマンド、Git フック、既存の権限を含むこの完全なセットアップを信頼します。これらはアクティブ化後の通常の使用中に実行されることがあります。保留中のプロンプトは再開されるまでキューに残ります。",
  "profileImport.confirm": "完全なセットアップをステージング",
  "profileImport.restart": "再起動してセットアップをアクティブ化",
  "profileImport.error.unavailable":
    "完全インポートには内蔵 Linux デスクトップサーバーとファイルベースの設定が必要です。環境から提供される設定や認証の上書きは、インポート前に削除する必要があります。",
  "profileImport.error.nonempty":
    "Classic にはすでにセットアップデータが含まれています。完全インポートは上書きしません。互換性のある会話をマージするには「チャットのみ」を使用するか、空の Classic プロファイルから始めてください。",
  "profileImport.error.incompatible":
    "ソースデータベースのスキーマがこの Classic のバージョンと一致しません。完全インポートには互換性のある SQLite セットアップが必要です。ソースの移行は試みられませんでした。",
  "profileImport.error.invalid":
    "セットアップを検証できませんでした。ファイル権限、データベースの整合性、設定の構文を確認してください。実行中の Classic プロファイルは置き換えられていません。",
  "profileImport.error.changed":
    "ソースが変更されたか、このプレビューの有効期限が切れました。OpenCode と他の書き込みプロセスを終了し、再度プレビューしてください。",
  "profileImport.error.busy":
    "別のインポート、アクティブなファイルロック、保留中のアクティブ化がこの操作を妨げています。再試行する前に OpenCode を終了し、Classic を再起動してください。",
  "profileImport.liveWarning":
    "OpenCode が現在実行中のようです。データベースは継続的に変化するため、ステージングが失敗する可能性があります。確実なインポートのために、確認前に OpenCode（すべてのウィンドウ）を終了し、そのサーバーを停止してください。",
  "profileImport.detail.count": "影響を受ける項目：{{count}}",
  "profileImport.materialized": "コピーされた外部リンク",
  "profileImport.skipped": "スキップされたランタイムファイル",
  "profileImport.error.source-busy":
    "ソースへの書き込みが継続的に行われています（OpenCode のインスタンスが実行中と思われます）。OpenCode とそのサーバーを終了し、再度プレビューと確認を行ってください。",
  "profileImport.error.links":
    "セットアップにコピーできないリンクが含まれています：シンボリックリンクの循環、またはコピーが正確でなければならない Git メタデータ内のリンク。",
  "profileImport.error.git-objects":
    "セットアップの Git メタデータが未対応のレイアウトを使用しています（alternates エントリ、worktree ポインタ、安全に私有化できないオブジェクトストア）。",
  "profileImport.error.special-files":
    "セットアップにデバイスノードや、安全にコピーできないその他の特殊ファイルが含まれています。",
  "profileImport.error.limit":
    "セットアップがインポート上限（50 GiB または 500,000 項目）を超えています。大きなバックアップファイルを削除するかフォルダーを絞り込んで、再度プレビューしてください。",
  "profileImport.error.oversized-file":
    "設定ファイルまたはメタデータファイルが読み取り上限（設定は 64 MB、Git メタデータは 16 MB）を超えています。分割または縮小して、再度プレビューしてください。",
  "profileImport.error.unsupported":
    "このセットアップには未対応のリンク、循環する Git オブジェクト alternates、特殊ファイルが含まれているか、インポート上限（50 GiB / 500,000 項目）を超えています。外部のシンボリックリンクはインポート前に実体化する必要があります。ソースファイルは変更されていません。",
  "profileImport.error.space":
    "このセットアップをステージングするための空きディスク容量が足りません。容量を解放して再度プレビューしてください。",
  "chatImport.tab": "チャットのインポート",
  "chatImport.title": "OpenCode からチャットをインポート",
  "chatImport.description":
    "OpenCode Classic Desktop は独自のチャットデータベースを保持しています。ソースを変更したり、既存の Classic チャットを置き換えたりせずに、OpenCode から互換性のあるローカルチャットをプレビューしてコピーできます。設定からいつでもここに戻れます。",
  "chatImport.scope":
    "インポート前に OpenCode を終了してください。完了したローカルチャットとその履歴がコピーされます。キュー内、進行中、ワークスペースのセッションは除外されます。ログイン情報、権限、プロジェクトコマンド、外部ファイル、元に戻すスナップショットはインポートされません。別々にログインし、プロジェクトフォルダーは元のパスに残してください。",
  "chatImport.localOnly":
    "チャットをインポートするには、内蔵ローカルデスクトップサーバーを選択してください。このインポーターはリモートおよびバックグラウンドサーバー接続に対応していません。",
  "chatImport.detect": "デフォルトの OpenCode データベースを確認",
  "chatImport.browse": "データベースファイルを選択",
  "chatImport.confirm": "対象のチャットをインポート",
  "chatImport.busy":
    "チャットを確認またはインポートしています。アプリを閉じる前にお待ちください。",
  "chatImport.noSource":
    "データベースが見つからないか選択されていません。続行するには OpenCode の .db ファイルを選択してください。",
  "chatImport.complete":
    "インポートが完了しました。元のプロジェクトフォルダーを開くとそのチャットが見つかります。インポートを繰り返すと、Classic に既に存在するチャット ID はスキップされます。",
  "chatImport.source": "ソースのデータベース",
  "chatImport.destination": "Classic のデータベース",
  "chatImport.total": "ソース内のチャット",
  "chatImport.eligible": "インポート可能",
  "chatImport.existing": "既に存在",
  "chatImport.excluded": "除外（キュー内、進行中、ワークスペース）",
  "chatImport.imported": "インポート済み",
  "chatImport.error.unavailable":
    "インポートは、内蔵 Linux デスクトップサーバーの起動完了後にのみ利用できます。",
  "chatImport.error.incompatible":
    "データベースのスキーマが異なるか未対応です。互換性のある最新の OpenCode と Classic を使用し、再度プレビューしてください。旧式の JSON ストレージには対応していません。ソースは移行されていません。",
  "chatImport.error.invalid":
    "データベースを読み取りまたは検証できませんでした。選択したファイル、権限、空きディスク容量を確認してください。未確定のインポートはロールバックされます。再試行前に再度プレビューしてください。",
  "chatImport.error.sameFile":
    "ソースと宛先は同じデータベースです。コピーは不要です。",
  "chatImport.error.conflict":
    "プロジェクト ID またはメッセージ ID の競合により、このインポートは実行されませんでした。部分インポートは確定されていません。既存の Classic チャットは保持されました。",
  "chatImport.error.busy":
    "データベースがビジー状態か、操作に時間がかかりすぎました。OpenCode を終了し、他のインポートの完了を待ってから再度プレビューしてください。再試行すると、確定済みのチャットはスキップされます。",
  "chatImport.error.expired":
    "このプレビューは有効期限が切れたか、ソースが変更されました。インポート前にデータベースを再度プレビューしてください。",
}
