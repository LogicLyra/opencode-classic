export const dict = {
  "profileImport.mode": "匯入模式",
  "profileImport.chats": "僅聊天",
  "profileImport.everything": "全部（完整設定）",
  "profileImport.description":
    "將相容的 OpenCode 設定複製到空的 Classic 桌面設定檔中：聊天、提供者登入資訊、雲端帳戶、權限、全域設定、代理程式、技能、外掛程式、計畫、快照和工作區檔案。來源保持不變。預覽不會執行匯入的命令，也不會聯絡提供者。",
  "profileImport.boundaries":
    "請先關閉 OpenCode 並停止編輯其檔案。OpenCode 儲存空間以外的專案資料夾會保留在原始路徑。環境變數、系統安裝的工具以及上游桌面視窗偏好設定不會被複製。日誌、快取和程序鎖定會重新產生。OAuth 提供者可能需要重新登入。自訂資料夾依下列順序選擇：資料、設定，然後是狀態。",
  "profileImport.detect": "預覽預設設定",
  "profileImport.browse": "選擇設定資料夾",
  "profileImport.busy":
    "正在驗證或暫存完整設定。完成之前請保持 Classic 開啟。",
  "profileImport.cancelled":
    "找不到相容的來源，或已取消資料夾選取。",
  "profileImport.staged":
    "設定已暫存並通過驗證。請重新啟動 Classic，在其伺服器啟動前加以啟用。重新啟動前請勿在 Classic 中新增資料；啟用時會再次檢查目的地是否為空。",
  "profileImport.activated":
    "完整設定已成功啟用。您的專案資料夾仍可在原始路徑中使用；匯入的內部工作區擁有獨立副本。",
  "profileImport.data": "來源資料資料夾",
  "profileImport.config": "來源設定資料夾",
  "profileImport.state": "來源狀態資料夾",
  "profileImport.providers": "已儲存的提供者登入資訊",
  "profileImport.accounts": "雲端帳戶",
  "profileImport.workspaces": "工作區",
  "profileImport.files": "檔案和連結",
  "profileImport.bytes": "複製大小（位元組）",
  "profileImport.plugins": "已設定的外掛程式",
  "profileImport.mcp": "MCP 項目",
  "profileImport.commands": "專案命令",
  "profileImport.permissions": "權限記錄",
  "profileImport.pending": "待處理的提示",
  "profileImport.git": "Git 檢出",
  "profileImport.consent":
    "我已關閉 OpenCode，並信任此完整設定，包括登入資訊、帳戶重新整理、相依性、外掛程式、MCP 伺服器、專案命令、Git 掛鉤和現有權限。這些可在啟用後的正常使用中執行。待處理的提示會保留在佇列中，直到恢復為止。",
  "profileImport.confirm": "暫存完整設定",
  "profileImport.restart": "重新啟動並啟用設定",
  "profileImport.error.unavailable":
    "完整匯入需要內建的 Linux 桌面伺服器和以檔案為基礎的設定。匯入前必須移除環境提供的設定或驗證覆寫。",
  "profileImport.error.nonempty":
    "Classic 已包含設定資料。完整匯入不會覆寫它。請使用「僅聊天」合併相容的對話，或從空的 Classic 設定檔開始。",
  "profileImport.error.incompatible":
    "來源資料庫的結構描述與此 Classic 版本不符。完整匯入需要相容的 SQLite 設定；未嘗試移轉來源。",
  "profileImport.error.invalid":
    "無法驗證設定。請檢查檔案權限、資料庫完整性和設定語法。執行中的 Classic 設定檔未被取代。",
  "profileImport.error.changed":
    "來源已變更，或此預覽已過期。請關閉 OpenCode 和其他寫入者，然後重新預覽。",
  "profileImport.error.busy":
    "另一個匯入、使用中的檔案鎖定或待處理的啟用作業阻止了此操作。請關閉 OpenCode 並重新啟動 Classic 後再試一次。",
  "profileImport.liveWarning":
    "OpenCode 似乎正在執行中。其資料庫持續變更，因此暫存可能會失敗。請關閉 OpenCode（所有視窗）並停止其伺服器後再確認，以確保匯入可靠。",
  "profileImport.detail.count": "受影響的項目：{{count}}",
  "profileImport.materialized": "已複製的外部連結",
  "profileImport.skipped": "已略過的執行階段檔案",
  "profileImport.error.source-busy":
    "來源正持續被寫入（可能有一個 OpenCode 執行個體正在執行）。請關閉 OpenCode 及其伺服器，然後重新預覽並確認。",
  "profileImport.error.links":
    "設定包含無法複製的連結：符號連結循環，或 Git 中繼資料內的連結（副本必須保持完全一致）。",
  "profileImport.error.git-objects":
    "設定的 Git 中繼資料使用了不受支援的配置（備用物件項目、工作樹指標，或無法安全私有化的物件存放區）。",
  "profileImport.error.special-files":
    "設定包含裝置節點或其他無法安全複製的特殊檔案。",
  "profileImport.error.limit":
    "設定超過匯入限制（50 GiB 或 500,000 個項目）。請移除大型備份檔案或縮小資料夾範圍，然後重新預覽。",
  "profileImport.error.oversized-file":
    "設定檔或中繼資料檔案超過其讀取限制（設定為 64 MB，Git 中繼資料為 16 MB）。請分割或縮小它，然後重新預覽。",
  "profileImport.error.unsupported":
    "此設定包含不受支援的連結、循環的 Git 物件備用、特殊檔案，或超過匯入限制（50 GiB / 500,000 個項目）。外部符號連結必須在匯入前轉換為實體檔案；來源檔案未被變更。",
  "profileImport.error.space":
    "沒有足夠的可用磁碟空間來暫存此設定。請釋放空間後重新預覽。",
  "chatImport.tab": "聊天匯入",
  "chatImport.title": "從 OpenCode 匯入聊天",
  "chatImport.description":
    "OpenCode Classic Desktop 維護獨立的聊天資料庫。預覽並從 OpenCode 複製相容的本機聊天，而不變更來源或取代現有的 Classic 聊天。您可以隨時從設定返回此處。",
  "chatImport.scope":
    "匯入前請關閉 OpenCode。這會複製已完成的本機聊天及其歷程記錄。排隊中、進行中和工作區工作階段會被排除。登入資訊、權限、專案命令、外部檔案和復原快照不會被匯入。請另行登入，並讓您的專案資料夾保留在原始路徑。",
  "chatImport.localOnly":
    "請選擇內建的本機桌面伺服器以匯入聊天。此匯入工具不支援遠端和背景伺服器連線。",
  "chatImport.detect": "檢查預設 OpenCode 資料庫",
  "chatImport.browse": "選擇資料庫檔案",
  "chatImport.confirm": "匯入符合條件的聊天",
  "chatImport.busy":
    "正在檢查或匯入聊天。關閉應用程式前請稍候。",
  "chatImport.noSource":
    "找不到或未選取資料庫。請選擇您的 OpenCode .db 檔案以繼續。",
  "chatImport.complete":
    "匯入完成。開啟原始專案資料夾即可找到其聊天。重複匯入會略過 Classic 中已存在的聊天 ID。",
  "chatImport.source": "來源資料庫",
  "chatImport.destination": "Classic 資料庫",
  "chatImport.total": "來源中的聊天數",
  "chatImport.eligible": "可以匯入",
  "chatImport.existing": "已存在",
  "chatImport.excluded": "已排除（排隊中、進行中或工作區）",
  "chatImport.imported": "已匯入",
  "chatImport.error.unavailable":
    "只有在內建 Linux 桌面伺服器完成啟動後，才可使用匯入。",
  "chatImport.error.incompatible":
    "資料庫的結構描述不同或不受支援。請使用相容且最新的 OpenCode 和 Classic 版本，然後重新預覽。不支援舊版 JSON 儲存；來源未被移轉。",
  "chatImport.error.invalid":
    "無法讀取或驗證資料庫。請檢查選取的檔案、權限和可用磁碟空間。未確認的匯入會回復；重試前請重新預覽。",
  "chatImport.error.sameFile":
    "來源和目的地是同一個資料庫。無需複製。",
  "chatImport.error.conflict":
    "衝突的專案或訊息 ID 阻止了此匯入。未確認任何部分匯入。現有的 Classic 聊天已保留。",
  "chatImport.error.busy":
    "資料庫忙碌中，或作業耗時過長。請關閉 OpenCode，等待其他匯入完成，然後重新預覽。重試會略過已確認的聊天。",
  "chatImport.error.expired":
    "此預覽已過期或其來源已變更。匯入前請重新預覽資料庫。",
}
