import { ipcMain } from "electron"
import type { IpcMainEvent, IpcMainInvokeEvent } from "electron"
import { requireTrustedRendererUrl } from "./renderer-security"

function requireTrustedSender(event: IpcMainEvent | IpcMainInvokeEvent) {
  if (!event.senderFrame || event.senderFrame !== event.sender.mainFrame) {
    throw new Error("Rejected IPC from a non-main renderer frame")
  }
  requireTrustedRendererUrl(event.senderFrame.url)
}

export function handleTrusted<Args extends unknown[], Result>(
  channel: string,
  listener: (event: IpcMainInvokeEvent, ...args: Args) => Result,
) {
  ipcMain.handle(channel, (event, ...args) => {
    requireTrustedSender(event)
    return listener(event, ...(args as Args))
  })
}

export function onTrusted<Args extends unknown[]>(
  channel: string,
  listener: (event: IpcMainEvent, ...args: Args) => void,
) {
  ipcMain.on(channel, (event, ...args) => {
    requireTrustedSender(event)
    listener(event, ...(args as Args))
  })
}
