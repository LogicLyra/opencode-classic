<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">開源的 AI Coding Agent。</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic 是一個以 Linux 為重點的非官方分支，追蹤上游，預設使用傳統桌面版面配置，並可在設定中啟用重新設計的版面配置。其發行版與更新程式於 [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic) 獨立維護。更深層的內容繼承自上游，可能會落後。


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

### 從 OpenCode 帶入你的設定

OpenCode Classic Desktop 為其內建伺服器使用獨立的設定檔。
**設定 > 聊天匯入**與首次啟動對話框提供**僅聊天**與**全部（完整設定）**
兩種模式。**僅聊天**適用以下合併行為：
在首次啟動時，或在**設定 > 聊天匯入**下，選擇**檢查預設 OpenCode 資料庫**
或選擇一個 `.db` 檔案。請先關閉 OpenCode，檢視來源、目的地與數量，然後
選擇**匯入符合條件的聊天**。

- 預設來源是 `$XDG_DATA_HOME/opencode/opencode.db`，通常是
  `~/.local/share/opencode/opencode.db`。可為自訂路徑或開發通道資料庫
  選擇檔案。目的地是目前內建桌面伺服器的資料庫，位於 Classic 桌面設定檔
  的 `sidecar` 目錄中。此匯入工具不支援遠端與實驗性背景伺服器連線。
- 匯入工具支援相符的 SQLite 結構描述與移轉歷程。它不會移轉來源檔案，
  也不匯入舊版 JSON 儲存。如果相容性檢查失敗，請使用相容的 OpenCode 與
  Classic 版本，然後重新預覽。
- 已完成的本機聊天會保留其 ID、標題、時間戳記、訊息、片段、v2 歷程、
  待辦事項與原始專案路徑。已存在的聊天 ID 會被整體略過；重新匯入不會
  更新已匯入的聊天。來源為唯讀（包含其 WAL 歷程），每次匯入都是原子
  確認。
- 帶有排隊提示、未完成工作或明確工作區歸屬的聊天會被排除並計數。匯入
  絕不會啟動提示或執行命令。登入資訊、帳戶狀態、權限、專案命令、共享
  所有權、外部附件、Git 快照與桌面草稿不會被複製。請另外登入，並讓專案
  資料夾保留在原始路徑。歷史復原快照無法使用；內嵌的附件資料保留在
  對話記錄中，而外部檔案必須繼續存在。
- 在 Classic 中開啟原始專案資料夾即可看到匯入的聊天。這是一次性複製，
  不是應用程式之間的持續同步。

#### 全部（完整設定）

請先關閉 OpenCode 並停止其他寫入者。選擇**預覽預設設定**，或**選擇設定
資料夾**並選取 OpenCode 的**資料**、**設定**與**狀態**資料夾。它們通常
位於 `~/.local/share/opencode`、`~/.config/opencode` 與
`~/.local/state/opencode`；支援 XDG 覆寫。檢視數量，確認你信任此設定，
在原生對話框中確認，然後重新啟動 Classic 以啟用已暫存的設定檔。

- 需要空的 Classic 內建 Linux 設定檔。既有的聊天、提供者、自訂設定、
  帳戶與已註冊的專案絕不會被覆寫。產生的預設設定/外掛程式檔案會被視為
  啟動狀態。
- 複製全部 19 個應用程式資料庫資料表、提供者 `auth.json`、雲端帳戶、
  整合登入資訊、權限、共享中繼資料、設定檔（包含 JSONC）、代理程式、
  技能、外掛程式、狀態、計畫、工具輸出、工作區檔案與快照。等待中的
  提示保持在佇列中；匯入不會執行它們。
- 外部專案路徑在同一台機器上保持不變。內部路徑、權限模式與快照索引鍵
  會重新對應。連結的工作樹會取得私有的 Git 中繼資料，快照物件備援會被
  實體化，讓複本不依賴原始物件存放區。
- SQLite 會讀取來源資料庫/WAL 的私有複本。來源資料庫、WAL 與共享記憶體
  檔案保持不變。暫存使用私有權限與持久的擁有權日誌。啟用會在內建伺服器
  啟動之前進行，並會復原中斷的目錄重新命名。原始的空/啟動設定檔會保留
  在 Classic 桌面設定檔的 `.profile-import-retained-<operation-id>` 之下
  以供檢查；它不會被自動刪除。
- 登入資訊仍是受保護的本機檔案。完整設定也保留可執行的行為：帳戶重新
  整理、相依性安裝、外掛程式、MCP 連線、專案命令，以及 Git 鉤子/輔助
  程式與權限授與，在啟用後的一般使用期間可能會生效。只匯入你信任的
  設定。同時使用兩個應用程式時，OAuth 權杖輪換可能需要重新登入。
- 日誌、快取與程序鎖定會重新產生。系統程式、shell 環境變數、上游桌面
  視窗/側邊欄偏好設定與桌面草稿不會被複製。外部專案檔案已在其原始路徑
  共享。開啟原始專案資料夾即可存取其聊天。
- 需要相符的 SQLite 移轉歷程與結構描述。完整設定目前讀取 `opencode.db`；
  環境提供的資料庫/設定/驗證覆寫必須先移除。純舊版 JSON 儲存、循環或
  不受支援的 Git 物件參考、裝置節點，以及超過 50 GiB 或 500,000 個清單
  項目的設定檔會被拒絕並給出具體原因。外部符號連結會被完整複製（實體
  化）；懸空連結、socket 與 FIFO 會被略過並在摘要中計數。支援最大
  64 MB 的設定檔。暫存需要額外的磁碟空間。
- 匯入前請關閉 OpenCode。偵測到執行中的執行個體時預覽會提出警告，快照
  複本會自動重試，而持續被寫入的來源會回報專用的忙碌錯誤並要求你關閉
  它。

獨立的 Classic CLI 仍使用 OpenCode 的預設 XDG 根目錄，除非你覆寫它們。
其 `uninstall` 命令預設會保留資料、登入資訊、設定、快取與狀態，包括
使用 `--force` 時。刪除這些共享根目錄需要 `--remove-shared-data`；
`--keep-data` 與 `--keep-config` 會針對各自的根目錄覆寫該請求。使用
`uninstall --dry-run` 檢視路徑。上游自己的解除安裝程式仍可能刪除共享的
CLI 資料。本分支拒絕開啟包含未知移轉的資料庫；請更新 Classic，而不是
編輯或刪除移轉日誌。

### 安裝

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> `opencode-ai` npm 套件與現有的 Homebrew、Scoop、Chocolatey、AUR 與 Nix 套件散布的是上游 OpenCode，而不是 OpenCode Classic。

### 桌面應用程式（BETA）

OpenCode Classic 桌面建置僅支援 Linux，可從[本分支的發行頁面](https://github.com/LogicLyra/opencode-classic/releases)取得。

| 平台      | 下載                                                 |
| --------- | ---------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*`（`.deb` 或 `.rpm`） |

有意不散布 AppImage。在預設 AppArmor 政策下，Ubuntu 24.04 與更新版本可能強制 Electron AppImage 停用 Chromium 沙箱；已安裝的 deb 與 RPM 格式保留了發行版所期望的沙箱整合。

維護者可以使用 [Linux VM 發行 QA 執行手冊](docs/linux-vm-qa.md)重現完整的建置、打包、已安裝 deb 與視覺化發行檢查。

#### 安裝目錄

安裝指令碼依下列優先順序決定安裝路徑：

1. `$OPENCODE_INSTALL_DIR` - 自訂安裝目錄
2. `$XDG_BIN_DIR` - 符合 XDG Base Directory Specification 的路徑
3. `$HOME/bin` - 標準使用者二進位目錄（如果存在或可以建立）
4. `$HOME/.opencode/bin` - 預設後備

```bash
# 範例
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode 內建了兩種 Agent，您可以使用 `Tab` 鍵快速切換。

- **build** - 預設模式，具備完整權限的 Agent，適用於開發工作。
- **plan** - 唯讀模式，適用於程式碼分析與探索。
  - 預設禁止修改檔案。
  - 執行 bash 指令前會詢問權限。
  - 非常適合用來探索陌生的程式碼庫或規劃變更。

此外，OpenCode 還包含一個 **general** 子 Agent，用於處理複雜搜尋與多步驟任務。此 Agent 供系統內部使用，亦可透過在訊息中輸入 `@general` 來呼叫。

了解更多關於 [Agents](https://opencode.ai/docs/agents) 的資訊。

### 線上文件

關於如何設定 OpenCode 的詳細資訊，請參閱我們的 [**官方文件**](https://opencode.ai/docs)。

### 參與貢獻

如果您有興趣參與 OpenCode 的開發，請在提交 Pull Request 前先閱讀我們的 [貢獻指南 (Contributing Docs)](./CONTRIBUTING.md)。

### 基於 OpenCode 進行開發

如果您正在開發與 OpenCode 相關的專案，並在名稱中使用了 "opencode"（例如 "opencode-dashboard" 或 "opencode-mobile"），請在您的 README 中加入聲明，說明該專案並非由 OpenCode 團隊開發，且與我們沒有任何隸屬關係。

---

**加入我們的社群** [飞书](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=52ao9352-5623-4fa0-b7dd-3407c392c1af&qr_code=true) | [X.com](https://x.com/opencode)
