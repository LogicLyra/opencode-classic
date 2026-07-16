import { app } from "electron"
import type { IpcMainInvokeEvent } from "electron"
import type { WslServersController } from "./servers"
import { requireWslIpcString, requireWslIpcStrings } from "./policy"
import type { WslServersState } from "../../preload/types"
import { handleTrusted } from "../trusted-ipc"

export function registerWslIpcHandlers(controller: WslServersController) {
  if (process.platform !== "win32") {
    registerUnavailableWslIpcHandlers()
    return
  }

  const subscriptions = new Map<number, () => void>()
  const unsubscribe = (id: number) => {
    const off = subscriptions.get(id)
    if (!off) return
    off()
    subscriptions.delete(id)
  }

  app.once("will-quit", () => {
    subscriptions.forEach((off) => off())
    subscriptions.clear()
  })

  handleTrusted("wsl-servers-subscribe", (event) => {
    const id = event.sender.id
    if (subscriptions.has(id)) return
    subscriptions.set(
      id,
      controller.subscribe((payload) => {
        if (event.sender.isDestroyed()) {
          unsubscribe(id)
          return
        }
        event.sender.send("wsl-servers-event", payload)
      }),
    )
    event.sender.once("destroyed", () => unsubscribe(id))
  })
  handleTrusted("wsl-servers-unsubscribe", (event) => unsubscribe(event.sender.id))
  handleTrusted("wsl-servers-get-state", () => controller.getState())
  handleTrusted("wsl-servers-probe-runtime", () => controller.probeRuntime())
  handleTrusted("wsl-servers-refresh-distros", () => controller.refreshDistros())
  handleTrusted("wsl-servers-install-wsl", () => controller.installWsl())
  handleTrusted("wsl-servers-install-distro", (_event: IpcMainInvokeEvent, name: string) =>
    controller.installDistro(requireWslIpcString("distro", name)),
  )
  handleTrusted("wsl-servers-probe-addable", (_event: IpcMainInvokeEvent, distros: string[]) =>
    controller.probeAddable(requireWslIpcStrings("distro", distros)),
  )
  handleTrusted("wsl-servers-install-opencode", (_event: IpcMainInvokeEvent, name: string) =>
    controller.installOpencode(requireWslIpcString("distro", name)),
  )
  handleTrusted("wsl-servers-open-terminal", (_event: IpcMainInvokeEvent, name: string) =>
    controller.openTerminal(requireWslIpcString("distro", name)),
  )
  handleTrusted("wsl-servers-add", (_event: IpcMainInvokeEvent, distro: string) =>
    controller.addServer(requireWslIpcString("distro", distro)),
  )
  handleTrusted("wsl-servers-remove", (_event: IpcMainInvokeEvent, id: string) =>
    controller.removeServer(requireWslIpcString("server id", id)),
  )
  handleTrusted("wsl-servers-start", (_event: IpcMainInvokeEvent, id: string) =>
    controller.startServer(requireWslIpcString("server id", id)),
  )
}

function registerUnavailableWslIpcHandlers() {
  const unavailable = () => {
    throw new Error("WSL is only available on Windows")
  }
  const state = (): WslServersState => ({
    runtime: {
      available: false,
      version: null,
      error: "WSL is only available on Windows",
    },
    installed: [],
    online: [],
    distroProbes: {},
    opencodeChecks: {},
    pendingRestart: false,
    servers: [],
    job: null,
  })

  handleTrusted("wsl-servers-subscribe", (event) => {
    event.sender.send("wsl-servers-event", { type: "state", state: state() })
  })
  handleTrusted("wsl-servers-unsubscribe", () => undefined)
  handleTrusted("wsl-servers-get-state", () => state())
  handleTrusted("wsl-servers-probe-runtime", unavailable)
  handleTrusted("wsl-servers-refresh-distros", unavailable)
  handleTrusted("wsl-servers-install-wsl", unavailable)
  handleTrusted("wsl-servers-install-distro", unavailable)
  handleTrusted("wsl-servers-probe-addable", unavailable)
  handleTrusted("wsl-servers-install-opencode", unavailable)
  handleTrusted("wsl-servers-open-terminal", unavailable)
  handleTrusted("wsl-servers-add", unavailable)
  handleTrusted("wsl-servers-remove", unavailable)
  handleTrusted("wsl-servers-start", unavailable)
}
