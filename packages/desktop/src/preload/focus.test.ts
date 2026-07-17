import { describe, expect, test } from "bun:test"
import { createFocusSetter } from "./focus"

async function tick() {
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
}

describe("focus preload coalescer", () => {
  test("shares one invocation and applies only the latest pending state", async () => {
    const calls: boolean[] = []
    const pending: Array<PromiseWithResolvers<void>> = []
    const setFocus = createFocusSetter((enabled) => {
      calls.push(enabled)
      const next = Promise.withResolvers<void>()
      pending.push(next)
      return next.promise
    })

    const first = setFocus(true)
    expect(setFocus(true)).toBe(first)
    await tick()
    expect(calls).toEqual([true])
    expect(setFocus(false)).toBe(first)

    pending[0]?.resolve()
    await tick()
    expect(calls).toEqual([true, false])
    pending[1]?.resolve()
    await first
  })

  test("drops transient requests when the final target matches the in-flight call", async () => {
    const calls: boolean[] = []
    const pending = Promise.withResolvers<void>()
    const setFocus = createFocusSetter((enabled) => {
      calls.push(enabled)
      return pending.promise
    })

    const task = setFocus(true)
    await tick()
    expect(setFocus(false)).toBe(task)
    expect(setFocus(true)).toBe(task)
    pending.resolve()
    await task

    expect(calls).toEqual([true])
  })

  test("continues to a superseding target after an obsolete failure", async () => {
    const calls: boolean[] = []
    const first = Promise.withResolvers<void>()
    const setFocus = createFocusSetter((enabled) => {
      calls.push(enabled)
      return calls.length === 1 ? first.promise : Promise.resolve()
    })

    const task = setFocus(true)
    await tick()
    expect(setFocus(false)).toBe(task)
    first.reject(new Error("enable failed"))
    await task

    expect(calls).toEqual([true, false])
  })

  test("clears a current failure so a later call can retry", async () => {
    let calls = 0
    const setFocus = createFocusSetter(() => {
      calls++
      return calls === 1 ? Promise.reject(new Error("failed")) : Promise.resolve()
    })

    let failure: unknown
    try {
      await setFocus(true)
    } catch (error) {
      failure = error
    }
    expect(failure).toEqual(new Error("failed"))
    await setFocus(true)
    expect(calls).toBe(2)
  })

  test("does not lose a request made while the prior invocation settles", async () => {
    const calls: boolean[] = []
    const first = Promise.withResolvers<void>()
    const setFocus = createFocusSetter((enabled) => {
      calls.push(enabled)
      return calls.length === 1 ? first.promise : Promise.resolve()
    })

    const task = setFocus(true)
    await tick()
    const queued = first.promise.then(() => setFocus(false))
    first.resolve()
    await Promise.all([task, queued])
    await tick()

    expect(calls).toEqual([true, false])
  })
})
