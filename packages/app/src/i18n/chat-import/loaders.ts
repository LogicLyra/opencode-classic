import type { DesktopNativeLocale } from "../desktop-native"

export type ChatImportSource = { dict: Record<string, string> }

// Per-locale overrides for the fork-owned chat-import copy. A locale is
// listed here only once its file exists; the enforcement test in
// chat-import-parity.test.ts fails closed until every locale is covered.
export const chatImportLoaders: Partial<
  Record<Exclude<DesktopNativeLocale, "en">, () => Promise<ChatImportSource>>
> = {
  de: () => import("./de"),
  nl: () => import("./nl"),
  fr: () => import("./fr"),
  es: () => import("./es"),
  it: () => import("./it"),
  br: () => import("./br"),
  ca: () => import("./ca"),
  ro: () => import("./ro"),
  da: () => import("./da"),
  no: () => import("./no"),
  sv: () => import("./sv"),
  is: () => import("./is"),
  fo: () => import("./fo"),
  fi: () => import("./fi"),
  et: () => import("./et"),
  lv: () => import("./lv"),
  lt: () => import("./lt"),
  hu: () => import("./hu"),
}
