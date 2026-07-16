import { Show, type JSX } from "solid-js"
import { WordmarkV2 } from "@opencode-ai/ui/v2/wordmark-v2"
import { NEW_SESSION_CONTENT_WIDTH } from "@/pages/session/new-session-layout"
import { usePlatform } from "@/context/platform"

export function NewSessionDesignView(props: { children: JSX.Element }) {
  const platform = usePlatform()
  return (
    <div data-component="session-new-design" class="relative size-full overflow-hidden bg-v2-background-bg-deep ">
      <div class="absolute inset-x-0 top-[25.375%] flex justify-center px-6">
        <div class={NEW_SESSION_CONTENT_WIDTH}>
          <WordmarkV2 class="h-auto w-full text-v2-background-bg-inverse" />
          <Show when={platform.productName}>
            <div class="mt-2 text-center text-12-medium tracking-wide text-v2-text-text-muted">
              {platform.productName}
            </div>
          </Show>
          <div class="mt-8">{props.children}</div>
        </div>
      </div>
    </div>
  )
}
