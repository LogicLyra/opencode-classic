<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">オープンソースのAIコーディングエージェント。</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic はアップストリームを追従する非公式の Linux 向けフォークです。既定でクラシックなデスクトップレイアウトを使用し、再設計されたレイアウトは設定から利用できます。リリースとアップデータは [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic) で独立して管理されています。より深い内容はアップストリームから継承され、遅れる場合があります。


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

### OpenCode からセットアップを持ち込む

OpenCode Classic Desktop は、内蔵サーバーに独立したプロファイルを使用します。
**設定 > チャットのインポート**と初回起動のダイアログで**チャットのみ**と
**すべて（完全なセットアップ）**を選べます。**チャットのみ**では次の
マージ動作になります：
初回起動時、または**設定 > チャットのインポート**で、**デフォルトの
OpenCode データベースを確認**を選ぶか、`.db` ファイルを選択します。まず
OpenCode を終了し、ソース・宛先・件数を確認してから**対象のチャットを
インポート**を選んでください。

- デフォルトのソースは `$XDG_DATA_HOME/opencode/opencode.db`、通常は
  `~/.local/share/opencode/opencode.db` です。カスタムパスや開発チャネルの
  データベースにはファイルを指定します。宛先は、現在の内蔵デスクトップ
  サーバーのデータベースで、Classic デスクトッププロファイルの `sidecar`
  ディレクトリ内にあります。このインポーターはリモート接続や実験的な
  バックグラウンドサーバー接続には対応していません。
- インポーターは一致する SQLite スキーマと移行履歴に対応しています。
  ソースファイルの移行は行わず、旧式の JSON ストレージもインポートし
  ません。互換性チェックに失敗した場合は、互換性のある OpenCode と
  Classic のバージョンを使い、再度プレビューしてください。
- 完了したローカルチャットは ID、タイトル、タイムスタンプ、メッセージ、
  パート、v2 履歴、Todo、元のプロジェクトパスを保持します。既存の
  チャット ID は全体としてスキップされ、再インポートしてもインポート済み
  のチャットは更新されません。ソースは WAL 履歴も含めて読み取り専用で、
  各インポートはアトミックにコミットされます。
- キュー内のプロンプト、未完了の作業、明示的なワークスペース配置が
  あるチャットは除外されてカウントされます。インポートはプロンプトを
  開始せず、コマンドも実行しません。ログイン情報、アカウント状態、権限、
  プロジェクトコマンド、共有所有権、外部添付、Git スナップショット、
  デスクトップの下書きはコピーされません。別途ログインし、プロジェクト
  フォルダーは元のパスに置いてください。過去の元に戻すスナップショットは
  利用できません。埋め込まれた添付データはトランスクリプトに残りますが、
  外部ファイルは引き続き存在している必要があります。
- Classic で元のプロジェクトフォルダーを開くと、インポートされた
  チャットが表示されます。これは一度きりのコピーであり、アプリ間の
  継続的な同期ではありません。

#### すべて（完全なセットアップ）

まず OpenCode を終了し、他の書き込みを止めてください。**デフォルトの
セットアップをプレビュー**を選ぶか、**セットアップフォルダーを選択**して
OpenCode の**データ**、**設定**、**状態**フォルダーを選びます。通常は
`~/.local/share/opencode`、`~/.config/opencode`、`~/.local/state/opencode`
にあります。XDG の上書きは尊重されます。件数を確認し、このセットアップを
信頼することを確認し、ネイティブダイアログで承認してから、Classic を
再起動してステージ済みプロファイルを有効化してください。

- 空の Classic 内蔵 Linux プロファイルが必要です。既存のチャット、
  プロバイダー、カスタム設定、アカウント、登録済みプロジェクトは決して
  上書きされません。生成されたデフォルトの設定/プラグインファイルは
  ブートストラップ状態として認識されます。
- アプリケーションの 19 個すべてのデータベーステーブル、プロバイダーの
  `auth.json`、クラウドアカウント、統合のログイン情報、権限、共有
  メタデータ、設定ファイル（JSONC を含む）、エージェント、skills、
  プラグイン、状態、プラン、ツール出力、ワークスペースファイル、
  スナップショットをコピーします。保留中のプロンプトはキューに残り、
  インポートはそれらを実行しません。
- 外部のプロジェクトパスは同じマシン上で変更されません。内部パス、
  権限パターン、スナップショットキーは再マッピングされます。リンク
  されたワークツリーはプライベートな Git メタデータを受け取り、
  スナップショットオブジェクトの alternates は実体化されるため、コピーは
  元のオブジェクトストアに依存しません。
- SQLite はソース DB/WAL のプライベートコピーを読み取ります。ソース
  DB、WAL、共有メモリファイルは変更されません。ステージングはプライ
  ベートな権限と永続的な所有権ジャーナルを使用します。有効化は内蔵
  サーバーの起動前に行われ、中断されたディレクトリ名の変更を復旧します。
  元の空/ブートストラッププロファイルは、検査のため Classic のデスク
  トッププロファイル内の `.profile-import-retained-<operation-id>` の下に
  保持され、自動的に削除されません。
- ログイン情報は保護されたローカルファイルのままです。完全なセットアップ
  は実行可能な動作も保持します。アカウントの更新、依存関係のインストール、
  プラグイン、MCP 接続、プロジェクトコマンド、Git フック/ヘルパー、権限
  付与は、有効化後の通常使用中に作用する可能性があります。信頼できる
  セットアップのみをインポートしてください。両方のアプリを使用する場合、
  OAuth トークンのローテーションで再ログインが必要になることがあります。
- ログ、キャッシュ、プロセスロックは再生成されます。システムプログラム、
  シェル環境変数、アップストリームのデスクトップウィンドウ/サイドバー
  設定、デスクトップの下書きはコピーされません。外部プロジェクト
  ファイルはすでに元のパスで共有されています。元のプロジェクト
  フォルダーを開いてチャットにアクセスしてください。
- 一致する SQLite 移行履歴とスキーマが必要です。完全なセットアップは
  現在 `opencode.db` を読み取ります。環境から提供されるデータベース/
  設定/認証の上書きは、使用前に削除する必要があります。レガシー JSON
  のみのストレージ、循環または未対応の Git オブジェクト参照、
  デバイスノード、50 GiB または 500,000 項目を超えるプロファイルは、
  具体的な理由とともに拒否されます。外部のシンボリックリンクは
  そのままコピー（実体化）され、壊れたリンク、ソケット、FIFO は
  スキップされてサマリーでカウントされます。64 MB までの設定ファイル
  に対応します。ステージングには追加のディスク容量が必要です。
- インポート前に OpenCode を終了してください。実行中のインスタンスを
  検出するとプレビューが警告し、スナップショットのコピーは自動的に
  再試行され、継続的に書き込まれているソースは、閉じるよう求める専用の
  ビジーエラーを報告します。

スタンドアロンの Classic CLI は、上書きしない限り OpenCode のデフォルト
XDG ルートを引き続き使用します。その `uninstall` コマンドは、`--force`
を指定した場合も含め、デフォルトでデータ、ログイン情報、設定、キャッシュ、
状態を保持します。これらの共有ルートを削除するには
`--remove-shared-data` が必要です。`--keep-data` と `--keep-config` は
それぞれのルートについてその要求を上書きします。
`uninstall --dry-run` でパスを確認してください。アップストリーム自身の
アンインストーラーは共有 CLI データを削除する可能性が残ります。この
フォークは未知の移行を含むデータベースのオープンを拒否します。移行
ジャーナルを編集・削除するのではなく、Classic を更新してください。

### インストール

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> `opencode-ai` npm パッケージおよび既存の Homebrew、Scoop、Chocolatey、AUR、Nix のパッケージが配布するのはアップストリームの OpenCode であり、OpenCode Classic ではありません。

### デスクトップアプリ (BETA)

OpenCode Classic のデスクトップビルドは Linux のみをサポートし、[フォークのリリースページ](https://github.com/LogicLyra/opencode-classic/releases)から入手できます。

| プラットフォーム | ダウンロード                                           |
| ---------------- | ------------------------------------------------------ |
| Linux x64        | `opencode-classic-desktop-linux-*`（`.deb` または `.rpm`） |

AppImage は意図的に配布していません。Ubuntu 24.04 以降では、デフォルトの AppArmor ポリシーの下で Electron の AppImage が Chromium サンドボックスを無効化するよう強制される可能性があります。インストールされた deb と RPM の形式は、ディストリビューションが期待するサンドボックス統合を保持します。

メンテナーは [Linux VM リリース QA ランブック](docs/linux-vm-qa.md)で、ビルド、パッケージ化、インストール済み deb、ビジュアルリリースチェックを完全に再現できます。

#### インストールディレクトリ

インストールスクリプトは、インストールパスについて次の優先順序を尊重します：

1. `$OPENCODE_INSTALL_DIR` - カスタムインストールディレクトリ
2. `$XDG_BIN_DIR` - XDG Base Directory Specification 準拠のパス
3. `$HOME/bin` - 標準のユーザーバイナリディレクトリ（存在するか作成可能な場合）
4. `$HOME/.opencode/bin` - デフォルトのフォールバック

```bash
# 例
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode には組み込みの Agent が2つあり、`Tab` キーで切り替えられます。

- **build** - デフォルト。開発向けのフルアクセス Agent
- **plan** - 分析とコード探索向けの読み取り専用 Agent
  - デフォルトでファイル編集を拒否
  - bash コマンド実行前に確認
  - 未知のコードベース探索や変更計画に最適

また、複雑な検索やマルチステップのタスク向けに **general** サブ Agent も含まれています。
内部的に使用されており、メッセージで `@general` と入力して呼び出せます。

[agents](https://opencode.ai/docs/agents) の詳細はこちら。

### ドキュメント

OpenCode の設定については [**ドキュメント**](https://opencode.ai/docs) を参照してください。

### コントリビュート

OpenCode に貢献したい場合は、Pull Request を送る前に [contributing docs](./CONTRIBUTING.md) を読んでください。

### OpenCode の上に構築する

OpenCode に関連するプロジェクトで、名前に "opencode"（例: "opencode-dashboard" や "opencode-mobile"）を含める場合は、そのプロジェクトが OpenCode チームによって作られたものではなく、いかなる形でも関係がないことを README に明記してください。

---

**コミュニティに参加** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
