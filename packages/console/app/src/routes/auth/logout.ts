import { redirect } from "@solidjs/router"
import type { APIEvent } from "@solidjs/start/server"
import { setContext } from "@solidjs/start/http"
import { useAuthSession } from "~/context/auth"

export async function GET(_event: APIEvent) {
  const auth = await useAuthSession()
  const current = auth.data.current
  if (current)
    await auth.update((val) => {
      delete val.account?.[current]
      const first = Object.keys(val.account ?? {})[0]
      val.current = first
      setContext("actor", undefined)
      return val
    })
  return redirect("/zen")
}
