export type AuthMethodLike = {
  type?: string
  label?: string
}

export type Translator = (key: string, vars?: Record<string, string | number | boolean>) => string

const HINT_SUFFIX = /\s+\((browser|headless)\)$/i

/**
 * Localized display label for a provider auth method.
 * API methods always render the localized "API key" label regardless of the raw label.
 */
export function methodLabel(value: AuthMethodLike | undefined, t: Translator): string {
  if (!value) return ""
  if (value.type === "api") return t("provider.connect.method.apiKey")
  return value.label ?? ""
}

/**
 * Splits a provider auth method into a localized display label and an optional
 * `(browser)` / `(headless)` hint. The hint suffix is stripped from the label
 * and replaced with a localized string. Methods without a suffix never receive
 * a fabricated hint; an API-key method without a suffix is not "Browser".
 */
export function methodDetails(
  value: AuthMethodLike | undefined,
  t: Translator,
): { label: string; hint: string | undefined } {
  if (!value) return { label: "", hint: undefined }
  const base = methodLabel(value, t)
  const suffix = value.label?.match(HINT_SUFFIX)
  const kind = suffix?.[1]?.toLowerCase()
  const label = value.type === "api" ? base : suffix ? base.slice(0, -suffix[0].length) : base
  const hint =
    kind === "browser"
      ? t("provider.connect.method.hint.browser")
      : kind === "headless"
        ? t("provider.connect.method.hint.headless")
        : undefined
  return { label, hint }
}

/**
 * Computes the next highlighted row index for arrow-key navigation.
 * Wraps around both boundaries. Returns -1 when there is nothing to navigate.
 */
export function nextActiveIndex(current: number, direction: number, total: number): number {
  if (total <= 0) return -1
  if (current < 0) return direction > 0 ? 0 : total - 1
  return (current + direction + total) % total
}

/**
 * True when a keyboard event targets a provider picker row button. Enter on
 * such a button activates it natively (click), so the parent keydown handler
 * must defer and avoid connecting a stale `active` row.
 */
export function isProviderButton(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.dataset.providerId !== undefined
}
