<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">开源的 AI Coding Agent。</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic 是一个以 Linux 为重点的非官方分支，跟踪上游，默认使用经典桌面布局，并可在设置中启用重新设计的布局。其发布和更新程序在 [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic) 独立维护。每个翻译版 README 中特定于分支的章节和安装链接与英文版保持同步；更深层次的内容继承自上游，可能滞后。


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

### 从 OpenCode 迁移你的设置

OpenCode Classic Desktop 为其内置服务器使用独立的配置文件。
**设置 > 聊天导入**和首次启动对话框提供**仅聊天**和**全部（完整设置）**
两种模式。**仅聊天**适用以下合并行为：
在首次启动时，或在**设置 > 聊天导入**下，选择**检查默认 OpenCode 数据库**
或选择一个 `.db` 文件。请先关闭 OpenCode，查看来源、目标和数量，然后选择
**导入符合条件的聊天**。

- 默认来源是 `$XDG_DATA_HOME/opencode/opencode.db`，通常是
  `~/.local/share/opencode/opencode.db`。可为自定义路径或开发通道数据库
  选择文件。目标是当前内置桌面服务器的数据库，位于 Classic 桌面配置文件
  的 `sidecar` 目录中。此导入器不支持远程和实验性后台服务器连接。
- 导入器支持匹配的 SQLite 架构和迁移历史。它不迁移源文件，也不导入旧版
  JSON 存储。如果兼容性检查失败，请使用兼容的 OpenCode 和 Classic 版本，
  然后重新预览。
- 已完成的本地聊天保留其 ID、标题、时间戳、消息、分段、v2 历史记录、
  待办事项和原始项目路径。已存在的聊天 ID 将被整体跳过；重新导入不会
  更新已导入的聊天。源为只读（包括其 WAL 历史），每次导入都是原子提交。
- 带有排队提示、未完成工作或显式工作区归属的聊天会被排除并计数。导入
  绝不会启动提示或运行命令。凭据、账户状态、权限、项目命令、共享所有权、
  外部附件、Git 快照和桌面草稿不会被复制。请单独登录，并让项目文件夹
  保留在原始路径。历史撤销快照不可用；嵌入的附件数据保留在对话记录中，
  而外部文件必须继续存在。
- 在 Classic 中打开原始项目文件夹即可看到导入的聊天。这是一次性复制，
  不是应用之间的持续同步。

#### 全部（完整设置）

请先关闭 OpenCode 并停止其他写入者。选择**预览默认设置**，或**选择设置
文件夹**并选择 OpenCode 的**数据**、**配置**和**状态**文件夹。它们通常
位于 `~/.local/share/opencode`、`~/.config/opencode` 和
`~/.local/state/opencode`；支持 XDG 覆盖。查看数量，确认你信任此设置，
在原生对话框中确认，然后重启 Classic 以激活已暂存的配置文件。

- 需要空的 Classic 内置 Linux 配置文件。现有的聊天、提供商、自定义设置、
  账户和已注册的项目永远不会被覆盖。生成的默认配置/插件文件会被识别为
  引导状态。
- 复制全部 19 个应用数据库表、提供商 `auth.json`、云端账户、集成凭据、
  权限、共享元数据、配置文件（包括 JSONC）、智能体、技能、插件、状态、
  计划、工具输出、工作区文件和快照。待处理的提示保持排队；导入不会执行
  它们。
- 外部项目路径在同一台机器上保持不变。内部路径、权限模式和快照键会重新
  映射。链接的工作树获得私有 Git 元数据，快照对象备用库会被实体化，使
  副本不依赖原始对象存储。
- SQLite 读取源数据库/WAL 的私有副本。源数据库、WAL 和共享内存文件保持
  不变。暂存使用私有权限和持久所有权日志。激活在内置服务器启动之前进行，
  并会恢复中断的目录重命名。原始空/引导配置文件保留在 Classic 桌面配置
  文件的 `.profile-import-retained-<operation-id>` 下以供检查；它不会被
  自动删除。
- 凭据仍是受保护的本地文件。完整设置还保留可执行行为：账户刷新、依赖
  安装、插件、MCP 连接、项目命令以及 Git 钩子/辅助程序和权限授予在激活
  后的正常使用中可能生效。只导入你信任的设置。同时使用两个应用时，
  OAuth 令牌轮换可能需要重新登录。
- 日志、缓存和进程锁会重新生成。系统程序、shell 环境变量、上游桌面窗口/
  侧边栏首选项和桌面草稿不会被复制。外部项目文件已在其原始路径共享。打开
  原始项目文件夹即可访问其聊天。
- 需要匹配的 SQLite 迁移历史和架构。完整设置目前读取 `opencode.db`；
  环境提供的数据库/配置/身份验证覆盖必须先移除。纯旧版 JSON 存储、循环
  或不受支持的 Git 对象引用、设备节点，以及超过 50 GiB 或 500,000 个
  清单条目的配置文件会被拒绝并给出具体原因。外部符号链接会被完整复制
  （实体化）；悬空链接、套接字和 FIFO 会被跳过并在摘要中计数。支持最大
  64 MB 的配置文件。暂存需要额外的磁盘空间。
- 导入前请关闭 OpenCode。检测到正在运行的实例时预览会发出警告，快照副本
  会自动重试，持续被写入的源会报告专用的繁忙错误并要求你关闭它。

独立的 Classic CLI 仍使用 OpenCode 的默认 XDG 根目录，除非你覆盖它们。
其 `uninstall` 命令默认保留数据、凭据、配置、缓存和状态，包括使用
`--force` 时。删除这些共享根目录需要 `--remove-shared-data`；
`--keep-data` 和 `--keep-config` 会针对各自的根目录覆盖该请求。使用
`uninstall --dry-run` 查看路径。上游自己的卸载程序仍可能删除共享的 CLI
数据。本分支拒绝打开包含未知迁移的数据库；请更新 Classic，而不是编辑或
删除迁移日志。

### 安装

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> `opencode-ai` npm 包以及现有的 Homebrew、Scoop、Chocolatey、AUR 和 Nix 软件包分发的是上游 OpenCode，而不是 OpenCode Classic。

### 桌面应用（BETA）

OpenCode Classic 桌面构建仅支持 Linux，可从[本分支的发布页面](https://github.com/LogicLyra/opencode-classic/releases)获取。

| 平台      | 下载                                                 |
| --------- | ---------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*`（`.deb` 或 `.rpm`） |

有意不分发 AppImage。在默认 AppArmor 策略下，Ubuntu 24.04 及更高版本可能强制 Electron AppImage 禁用 Chromium 沙箱；已安装的 deb 和 RPM 格式保留了发行版所期望的沙箱集成。

维护者可以使用 [Linux VM 发布 QA 运行手册](docs/linux-vm-qa.md)重现完整的构建、打包、已安装 deb 和可视化发布检查。

#### 安装目录

安装脚本按以下优先级顺序确定安装路径：

1. `$OPENCODE_INSTALL_DIR` - 自定义安装目录
2. `$XDG_BIN_DIR` - 符合 XDG 基本目录规范的路径
3. `$HOME/bin` - 标准用户二进制目录（如果存在或可以创建）
4. `$HOME/.opencode/bin` - 默认回退

```bash
# 示例
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode 内置两种 Agent，可用 `Tab` 键快速切换：

- **build** - 默认模式，具备完整权限，适合开发工作
- **plan** - 只读模式，适合代码分析与探索
  - 默认拒绝修改文件
  - 运行 bash 命令前会询问
  - 便于探索未知代码库或规划改动

另外还包含一个 **general** 子 Agent，用于复杂搜索和多步任务，内部使用，也可在消息中输入 `@general` 调用。

了解更多 [Agents](https://opencode.ai/docs/agents) 相关信息。

### 文档

更多配置说明请查看我们的 [**官方文档**](https://opencode.ai/docs)。

### 参与贡献

如有兴趣贡献代码，请在提交 PR 前阅读 [贡献指南 (Contributing Docs)](./CONTRIBUTING.md)。

### 基于 OpenCode 进行开发

如果你在项目名中使用了 “opencode”（如 “opencode-dashboard” 或 “opencode-mobile”），请在 README 里注明该项目不是 OpenCode 团队官方开发，且不存在隶属关系。

---

**加入我们的社区** [飞书](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=52ao9352-5623-4fa0-b7dd-3407c392c1af&qr_code=true) | [X.com](https://x.com/opencode)
