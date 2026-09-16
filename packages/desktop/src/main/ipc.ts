import { execFile } from "node:child_process"
import { stat, readFile } from "node:fs/promises"
import { basename, join } from "node:path"
import { app, BrowserWindow, clipboard, dialog, shell } from "electron"
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron"
import type { DesktopMenuAction } from "@opencode-ai/app/desktop-menu"
import { parseDesktopNativeBundle, type DesktopNativeBundle } from "@opencode-ai/app/i18n/desktop-native"

import type { FatalRendererError, ServerReadyData, TitlebarTheme } from "../preload/types"
import { runDesktopMenuAction } from "./desktop-menu-actions"
import { setForceFocus } from "./debug"
import { assertAttachmentBudget, createPickedFileAuthorizations } from "./attachment-picker"
import { getStore, removeStoreFileIfEmpty } from "./store"
import {
  getPinchZoomEnabled,
  getWindowID,
  openExternalURL,
  openLocalFileURL,
  setPinchZoomEnabled,
  setTitlebar,
  updateTitlebar,
} from "./windows"
import type { UpdaterController } from "./updater-controller"
import { createUpdaterSubscriptions } from "./updater-subscriptions"
import { createDesktopDraftStore } from "./draft-store"
import { nativeT } from "./native-translations"
import { handleTrusted, onTrusted } from "./trusted-ipc"
import { createDesktopChatImport } from "./chat-import"
import { createDesktopProfileImport } from "./profile-import"

const pickerFilters = (ext?: string[]) => {
  if (!ext || ext.length === 0) return undefined
  return [{ name: nativeT("desktop.dialog.files"), extensions: ext }]
}

const pickedFiles = createPickedFileAuthorizations()

type Deps = {
  killSidecar: () => Promise<void> | void
  relaunch: () => void
  awaitInitialization: () => Promise<ServerReadyData>
  consumeInitialDeepLinks: () => Promise<string[]> | string[]
  getDefaultServerUrl: () => Promise<string | null> | string | null
  setDefaultServerUrl: (url: string | null) => Promise<void> | void
  isFirstLaunchOnboardingPending: () => Promise<boolean> | boolean
  finishFirstLaunchOnboarding: (createDefaultProject: boolean) => Promise<string | null> | string | null
  isOldLayoutEligible: () => Promise<boolean> | boolean
  getDisplayBackend: () => Promise<string | null>
  setDisplayBackend: (backend: string | null) => Promise<void> | void
  checkAppExists: (appName: string) => Promise<boolean> | boolean
  resolveAppPath: (appName: string) => Promise<string | null>
  updater: UpdaterController
  showUpdater: () => Promise<void> | void
  setBackgroundColor: (color: string) => void
  exportDebugLogs: () => Promise<string>
  recordFatalRendererError: (error: FatalRendererError) => Promise<void> | void
  setNativeTranslations: (bundle: DesktopNativeBundle) => void
}

export function registerIpcHandlers(deps: Deps) {
  const chatImport = createDesktopChatImport()
  const profileImport = createDesktopProfileImport()
  const profileImportWindows = new Set<number>()
  const chatImportWindows = new Set<number>()
  handleTrusted("chat-import-preview", (event, chooseFile: unknown) => {
    const id = event.sender.id
    if (!chatImportWindows.has(id)) {
      chatImportWindows.add(id)
      event.sender.once("destroyed", () => {
        chatImport.clear(id)
        chatImportWindows.delete(id)
      })
    }
    return chatImport.preview(id, chooseFile).then((result) => {
      if (event.sender.isDestroyed()) chatImport.clear(id)
      return result
    })
  })
  handleTrusted("chat-import-confirm", (event, token: unknown) => chatImport.confirm(event.sender.id, token))
  handleTrusted("profile-import-preview", (event, browse: unknown) => {
    const id = event.sender.id
    if (!profileImportWindows.has(id)) {
      profileImportWindows.add(id)
      event.sender.once("destroyed", () => {
        profileImport.clear(id)
        profileImportWindows.delete(id)
      })
    }
    return profileImport.preview(id, browse).then((result) => {
      if (event.sender.isDestroyed()) profileImport.clear(id)
      return result
    })
  })
  handleTrusted("profile-import-confirm", (event, token: unknown) => profileImport.confirm(event.sender.id, token))
  handleTrusted("profile-import-status", async () => {
    const pending = await readFile(join(app.getPath("userData"), ".profile-import.json"), "utf8").catch(() => undefined)
    if (pending) {
      const value: unknown = JSON.parse(pending)
      if (value && typeof value === "object" && "phase" in value && value.phase === "ready") return { status: "staged" }
    }
    const text = await readFile(join(app.getPath("userData"), ".profile-import-result.json"), "utf8").catch(
      () => undefined,
    )
    if (!text) return
    const value: unknown = JSON.parse(text)
    if (value && typeof value === "object" && "status" in value && value.status === "activated")
      return { status: "activated" }
    if (
      value &&
      typeof value === "object" &&
      "code" in value &&
      typeof value.code === "string" &&
      [
        "unavailable",
        "incompatible",
        "invalid",
        "nonempty",
        "changed",
        "busy",
        "unsupported",
        "space",
        "source-busy",
        "links",
        "git-objects",
        "special-files",
        "limit",
        "oversized-file",
      ].includes(value.code)
    )
      return { status: "error", code: value.code }
    // Persisted results never expose paths, source text or exception details.
    return { status: "error", code: "invalid" }
  })
  const drafts = createDesktopDraftStore(join(app.getPath("userData"), "drafts.sqlite"))
  const updaterSubscriptions = createUpdaterSubscriptions()
  app.once("will-quit", updaterSubscriptions.clear)
  app.on("before-quit", () => drafts.flush())
  app.once("will-quit", () => drafts.close())
  app.on("browser-window-created", (_event, win) => win.on("session-end", () => drafts.flush()))

  handleTrusted("kill-sidecar", () => deps.killSidecar())
  handleTrusted("await-initialization", () => deps.awaitInitialization())
  handleTrusted("consume-initial-deep-links", () => deps.consumeInitialDeepLinks())
  handleTrusted("get-default-server-url", () => deps.getDefaultServerUrl())
  handleTrusted("set-default-server-url", (_event: IpcMainInvokeEvent, url: string | null) =>
    deps.setDefaultServerUrl(url),
  )
  handleTrusted("is-first-launch-onboarding-pending", () => deps.isFirstLaunchOnboardingPending())
  handleTrusted("finish-first-launch-onboarding", (_event: IpcMainInvokeEvent, createDefaultProject: boolean) =>
    deps.finishFirstLaunchOnboarding(createDefaultProject),
  )
  handleTrusted("is-old-layout-eligible", () => deps.isOldLayoutEligible())
  handleTrusted("get-display-backend", () => deps.getDisplayBackend())
  handleTrusted("set-display-backend", (_event: IpcMainInvokeEvent, backend: string | null) =>
    deps.setDisplayBackend(backend),
  )
  handleTrusted("check-app-exists", (_event: IpcMainInvokeEvent, appName: string) => deps.checkAppExists(appName))
  handleTrusted("resolve-app-path", (_event: IpcMainInvokeEvent, appName: string) => deps.resolveAppPath(appName))
  handleTrusted("updater-subscribe", (event) => {
    const id = event.sender.id
    updaterSubscriptions.set(
      id,
      deps.updater.subscribe((state) => {
        if (event.sender.isDestroyed()) return updaterSubscriptions.delete(id)
        event.sender.send("updater-state", state)
      }),
    )
    event.sender.once("destroyed", () => updaterSubscriptions.delete(id))
  })
  handleTrusted("updater-unsubscribe", (event) => updaterSubscriptions.delete(event.sender.id))
  handleTrusted("updater-check", () => deps.updater.check())
  handleTrusted("updater-install", () => deps.updater.install())
  handleTrusted("set-background-color", (_event: IpcMainInvokeEvent, color: string) => deps.setBackgroundColor(color))
  handleTrusted("export-debug-logs", () => deps.exportDebugLogs())
  handleTrusted("set-force-focus", (event: IpcMainInvokeEvent, enabled: boolean) =>
    setForceFocus(event.sender, enabled),
  )
  handleTrusted("record-fatal-renderer-error", (_event: IpcMainInvokeEvent, error: FatalRendererError) =>
    deps.recordFatalRendererError(error),
  )
  handleTrusted("set-native-translations", (event: IpcMainInvokeEvent, value: unknown) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win || win.isDestroyed() || win.webContents !== event.sender || event.senderFrame !== event.sender.mainFrame) {
      throw new Error("Invalid native translation sender")
    }
    const bundle = parseDesktopNativeBundle(value)
    if (!bundle) throw new Error("Invalid native translation bundle")
    deps.setNativeTranslations(bundle)
  })
  handleTrusted("store-get", (_event: IpcMainInvokeEvent, name: string, key: string) => {
    try {
      const store = getStore(name)
      const value = store.get(key)
      if (value === undefined || value === null) return null
      return typeof value === "string" ? value : JSON.stringify(value)
    } catch {
      return null
    }
  })
  handleTrusted("store-set", (_event: IpcMainInvokeEvent, name: string, key: string, value: string) => {
    getStore(name).set(key, value)
  })
  handleTrusted("store-delete", (_event: IpcMainInvokeEvent, name: string, key: string) => {
    getStore(name).delete(key)
    void removeStoreFileIfEmpty(name)
  })
  handleTrusted("store-clear", (_event: IpcMainInvokeEvent, name: string) => {
    getStore(name).clear()
    void removeStoreFileIfEmpty(name)
  })
  handleTrusted("store-keys", (_event: IpcMainInvokeEvent, name: string) => {
    const store = getStore(name)
    return Object.keys(store.store)
  })
  handleTrusted("store-length", (_event: IpcMainInvokeEvent, name: string) => {
    const store = getStore(name)
    return Object.keys(store.store).length
  })
  handleTrusted("draft-get", (_event, key: string) => drafts.get(key))
  handleTrusted("draft-set", (_event, key: string, value: string) => drafts.set(key, value))
  handleTrusted("draft-delete", (_event, key: string) => drafts.set(key, null))
  handleTrusted("draft-blob-put", (_event, data: ArrayBuffer) => drafts.putBlob(new Uint8Array(data)))
  handleTrusted("draft-blob-get", (_event, id: string) => {
    const data = drafts.getBlob(id)
    return data ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : null
  })

  handleTrusted(
    "open-directory-picker",
    async (_event: IpcMainInvokeEvent, opts?: { multiple?: boolean; title?: string; defaultPath?: string }) => {
      const result = await dialog.showOpenDialog({
        properties: ["openDirectory", ...(opts?.multiple ? ["multiSelections" as const] : []), "createDirectory"],
        title: opts?.title ?? nativeT("desktop.dialog.chooseFolder"),
        defaultPath: opts?.defaultPath,
      })
      if (result.canceled) return null
      return opts?.multiple ? result.filePaths : result.filePaths[0]
    },
  )

  handleTrusted(
    "open-file-picker",
    async (
      event: IpcMainInvokeEvent,
      opts?: { multiple?: boolean; title?: string; defaultPath?: string; extensions?: string[] },
    ) => {
      const result = await dialog.showOpenDialog({
        properties: ["openFile", ...(opts?.multiple ? ["multiSelections" as const] : [])],
        title: opts?.title ?? nativeT("desktop.dialog.chooseFile"),
        defaultPath: opts?.defaultPath,
        filters: pickerFilters(opts?.extensions),
      })
      if (result.canceled) return null
      const files = await Promise.all(
        result.filePaths.map(async (filePath) => ({
          path: filePath,
          name: basename(filePath),
          size: (await stat(filePath)).size,
        })),
      )
      assertAttachmentBudget(files)
      const token = pickedFiles.add(event.sender.id, result.filePaths)
      return { token, files }
    },
  )

  handleTrusted("read-picked-file", async (event: IpcMainInvokeEvent, token: string, filePath: string) => {
    return pickedFiles.read(event.sender.id, token, filePath)
  })

  handleTrusted("release-picked-files", (event: IpcMainInvokeEvent, token: string) => {
    pickedFiles.release(event.sender.id, token)
  })

  handleTrusted(
    "save-file-picker",
    async (_event: IpcMainInvokeEvent, opts?: { title?: string; defaultPath?: string }) => {
      const result = await dialog.showSaveDialog({
        title: opts?.title ?? nativeT("desktop.dialog.saveFile"),
        defaultPath: opts?.defaultPath,
      })
      if (result.canceled) return null
      return result.filePath ?? null
    },
  )

  onTrusted("open-external", (_event: IpcMainEvent, url: string) => {
    openExternalURL(url)
  })

  onTrusted("open-local-file", (_event: IpcMainEvent, url: string) => {
    openLocalFileURL(url)
  })

  handleTrusted("open-path", async (_event: IpcMainInvokeEvent, path: string, app?: string) => {
    if (!app) return shell.openPath(path)
    await new Promise<void>((resolve, reject) => {
      const [cmd, args] =
        process.platform === "darwin" ? (["open", ["-a", app, path]] as const) : ([app, [path]] as const)
      execFile(cmd, args, (err) => (err ? reject(err) : resolve()))
    })
  })

  handleTrusted("reveal-path", async (_event: IpcMainInvokeEvent, path: string) => {
    const exists = await stat(path).then(
      () => true,
      () => false,
    )
    if (!exists) return false
    shell.showItemInFolder(path)
    return true
  })

  handleTrusted("read-clipboard-image", () => {
    const image = clipboard.readImage()
    if (image.isEmpty()) return null
    const buffer = image.toPNG().buffer
    const size = image.getSize()
    return { buffer, width: size.width, height: size.height }
  })

  handleTrusted("get-window-id", (event: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) throw new Error("Window not found")
    const id = getWindowID(win)
    if (!id) throw new Error("Window ID not found")
    return id
  })

  handleTrusted("get-window-focused", (event: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return win?.isFocused() ?? false
  })

  handleTrusted("get-window-fullscreen", (event: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    return win?.isFullScreen() ?? false
  })

  handleTrusted("set-window-focus", (event: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.focus()
  })

  handleTrusted("show-window", (event: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.show()
  })

  onTrusted("relaunch", () => {
    deps.relaunch()
  })

  handleTrusted("get-zoom-factor", (event: IpcMainInvokeEvent) => event.sender.getZoomFactor())
  handleTrusted("set-zoom-factor", (event: IpcMainInvokeEvent, factor: number) => {
    event.sender.setZoomFactor(factor)
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return
    updateTitlebar(win)
  })
  handleTrusted("get-pinch-zoom-enabled", () => getPinchZoomEnabled())
  handleTrusted("set-pinch-zoom-enabled", (_event: IpcMainInvokeEvent, enabled: boolean) => {
    setPinchZoomEnabled(enabled)
  })
  handleTrusted("set-titlebar", (event: IpcMainInvokeEvent, theme: TitlebarTheme) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return
    setTitlebar(win, theme)
  })
  handleTrusted("run-desktop-menu-action", (event: IpcMainInvokeEvent, action: DesktopMenuAction) => {
    runDesktopMenuAction(BrowserWindow.fromWebContents(event.sender), action, {
      checkForUpdates: () => void deps.showUpdater(),
      relaunch: deps.relaunch,
    })
  })
}

export function sendMenuCommand(win: BrowserWindow, id: string) {
  win.webContents.send("menu-command", id)
}

export function sendDeepLinks(win: BrowserWindow, urls: string[]) {
  win.webContents.send("deep-link", urls)
}
