export const dict = {
  "profileImport.mode": "导入模式",
  "profileImport.chats": "仅聊天",
  "profileImport.everything": "全部（完整设置）",
  "profileImport.description":
    "将兼容的 OpenCode 设置复制到空的 Classic 桌面配置文件中：聊天、提供商凭据、云端账户、权限、全局配置、智能体、技能、插件、计划、快照和工作区文件。源保持不变。预览不会执行导入的命令，也不会联系提供商。",
  "profileImport.boundaries":
    "请先关闭 OpenCode 并停止编辑其文件。OpenCode 存储之外的项目文件夹保留在原始路径。环境变量、系统安装的工具以及上游桌面窗口偏好设置不会被复制。日志、缓存和进程锁会重新生成。OAuth 提供商可能需要重新登录。自定义文件夹按以下顺序选择：数据、配置，然后是状态。",
  "profileImport.detect": "预览默认设置",
  "profileImport.browse": "选择设置文件夹",
  "profileImport.busy":
    "正在验证或暂存完整设置。在此完成之前请保持 Classic 开启。",
  "profileImport.cancelled":
    "未找到兼容的源，或者文件夹选择已取消。",
  "profileImport.staged":
    "设置已暂存并通过验证。请重启 Classic 以在其服务器启动前激活它。重启前请勿向 Classic 添加数据；激活时会再次检查目标是否为空。",
  "profileImport.activated":
    "完整设置已成功激活。您的项目文件夹仍保留在原始路径；导入的内部工作区拥有独立副本。",
  "profileImport.data": "源数据文件夹",
  "profileImport.config": "源配置文件夹",
  "profileImport.state": "源状态文件夹",
  "profileImport.providers": "已保存的提供商凭据",
  "profileImport.accounts": "云端账户",
  "profileImport.workspaces": "工作区",
  "profileImport.files": "文件和链接",
  "profileImport.bytes": "复制大小（字节）",
  "profileImport.plugins": "已配置的插件",
  "profileImport.mcp": "MCP 条目",
  "profileImport.commands": "项目命令",
  "profileImport.permissions": "权限记录",
  "profileImport.pending": "待处理的提示",
  "profileImport.git": "Git 检出",
  "profileImport.consent":
    "我已关闭 OpenCode，并信任此完整设置，包括凭据、账户刷新、依赖项、插件、MCP 服务器、项目命令、Git 钩子和现有权限。这些可以在激活后的正常使用中运行。待处理的提示将保留在队列中，直到恢复。",
  "profileImport.confirm": "暂存完整设置",
  "profileImport.restart": "重启并激活设置",
  "profileImport.error.unavailable":
    "完整导入需要内置的 Linux 桌面服务器和基于文件的配置。导入前必须移除环境提供的配置或身份验证覆盖。",
  "profileImport.error.nonempty":
    "Classic 已包含设置数据。完整导入不会覆盖它。请使用“仅聊天”合并兼容的对话，或者从空的 Classic 配置文件开始。",
  "profileImport.error.incompatible":
    "源数据库架构与此 Classic 版本不匹配。完整导入需要兼容的 SQLite 设置；未尝试迁移源。",
  "profileImport.error.invalid":
    "无法验证设置。请检查文件权限、数据库完整性和配置语法。正在运行的 Classic 配置文件未被替换。",
  "profileImport.error.changed":
    "源已更改，或此预览已过期。请关闭 OpenCode 和其他写入方，然后重新预览。",
  "profileImport.error.busy":
    "另一个导入、活动的文件锁或待处理的激活阻止了此操作。请关闭 OpenCode 并重启 Classic 后重试。",
  "profileImport.liveWarning":
    "OpenCode 似乎正在运行。其数据库持续变化，暂存可能失败。请关闭 OpenCode（所有窗口）并停止其服务器后再确认，以确保导入可靠。",
  "profileImport.detail.count": "受影响的项目：{{count}}",
  "profileImport.materialized": "已复制的外部链接",
  "profileImport.skipped": "已跳过的运行时文件",
  "profileImport.error.source-busy":
    "源正被持续写入（可能有一个 OpenCode 实例正在运行）。请关闭 OpenCode 及其服务器，然后重新预览并确认。",
  "profileImport.error.links":
    "设置包含无法复制的链接：符号链接循环，或 Git 元数据内的链接（副本必须保持完全一致）。",
  "profileImport.error.git-objects":
    "设置的 Git 元数据使用了不受支持的布局（备用对象条目、工作树指针或无法安全私有化的对象存储）。",
  "profileImport.error.special-files":
    "设置包含设备节点或其他无法安全复制的特殊文件。",
  "profileImport.error.limit":
    "设置超出导入限制（50 GiB 或 500,000 个项目）。请移除大型备份文件或缩小文件夹范围，然后重新预览。",
  "profileImport.error.oversized-file":
    "配置或元数据文件超出其读取限制（配置为 64 MB，Git 元数据为 16 MB）。请拆分或缩小它，然后重新预览。",
  "profileImport.error.unsupported":
    "此设置包含不受支持的链接、循环的 Git 对象备用、特殊文件，或超出导入限制（50 GiB / 500,000 个项目）。外部符号链接必须在导入前实体化；源文件未被更改。",
  "profileImport.error.space":
    "没有足够的可用磁盘空间来暂存此设置。请释放空间后重新预览。",
  "chatImport.tab": "聊天导入",
  "chatImport.title": "从 OpenCode 导入聊天",
  "chatImport.description":
    "OpenCode Classic Desktop 维护独立的聊天数据库。预览并从 OpenCode 复制兼容的本地聊天，而不更改源或替换现有的 Classic 聊天。您可以随时从设置返回此处。",
  "chatImport.scope":
    "导入前请关闭 OpenCode。这会复制已完成的本地聊天及其历史记录。排队中、进行中和工作区会话将被排除。凭据、权限、项目命令、外部文件和撤销快照不会被导入。请单独登录，并让您的项目文件夹保留在原始路径。",
  "chatImport.localOnly":
    "请选择内置的本地桌面服务器以导入聊天。此导入器不支持远程和后台服务器连接。",
  "chatImport.detect": "检查默认 OpenCode 数据库",
  "chatImport.browse": "选择数据库文件",
  "chatImport.confirm": "导入符合条件的聊天",
  "chatImport.busy":
    "正在检查或导入聊天。关闭应用前请稍候。",
  "chatImport.noSource":
    "未找到或未选择数据库。请选择您的 OpenCode .db 文件以继续。",
  "chatImport.complete":
    "导入完成。打开原始项目文件夹即可找到其聊天。重复导入会跳过 Classic 中已存在的聊天 ID。",
  "chatImport.source": "源数据库",
  "chatImport.destination": "Classic 数据库",
  "chatImport.total": "源中的聊天数",
  "chatImport.eligible": "可以导入",
  "chatImport.existing": "已存在",
  "chatImport.excluded": "已排除（排队中、进行中或工作区）",
  "chatImport.imported": "已导入",
  "chatImport.error.unavailable":
    "只有在内置 Linux 桌面服务器完成启动后，导入才可用。",
  "chatImport.error.incompatible":
    "数据库架构不同或不受支持。请使用兼容且最新的 OpenCode 和 Classic 版本，然后重新预览。不支持旧版 JSON 存储；源未被迁移。",
  "chatImport.error.invalid":
    "无法读取或验证数据库。请检查所选文件、权限和可用磁盘空间。未提交的导入会回滚；重试前请重新预览。",
  "chatImport.error.sameFile":
    "源和目标是同一个数据库。无需复制。",
  "chatImport.error.conflict":
    "冲突的项目或消息 ID 阻止了此导入。未提交任何部分导入。现有的 Classic 聊天已保留。",
  "chatImport.error.busy":
    "数据库繁忙，或操作耗时过长。请关闭 OpenCode，等待其他导入完成，然后重新预览。重试会跳过已提交的聊天。",
  "chatImport.error.expired":
    "此预览已过期或其源已更改。导入前请重新预览数据库。",
}
