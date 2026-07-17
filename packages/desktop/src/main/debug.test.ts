import { describe, expect, test } from "bun:test"
import { requireFocusDebugState, setForceFocus, type FocusDebugContents } from "./debug"

async function rejection(promise: Promise<unknown>) {
  try {
    await promise
  } catch (error) {
    return error
  }
  throw new Error("Expected promise to reject")
}

async function tick(ms = 0) {
  await new Promise<void>((resolve) => setTimeout(resolve, ms))
}

describe("focus debugger", () => {
  test("rejects non-boolean IPC values", () => {
    expect(() => requireFocusDebugState("true")).toThrow("Focus debug state must be a boolean")
  })

  test("retains debugger ownership when detach fails so cleanup can retry", async () => {
    let attached = false
    let attempts = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [] }
          return {}
        },
        detach: () => {
          attempts++
          if (attempts === 1) throw new Error("detach failed")
          attached = false
          onDetach()
        },
      },
    }

    await setForceFocus(contents, true)
    let failure: unknown
    try {
      await setForceFocus(contents, false)
    } catch (error) {
      failure = error
    }
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("detach failed")

    await setForceFocus(contents, false)
    expect(attempts).toBe(2)
    expect(attached).toBe(false)
  })

  test("retains nodes whose forced pseudo state failed to clear", async () => {
    let attached = false
    let failed = false
    const cleared: number[] = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) return {}
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") throw new Error("missing node id")
            cleared.push(nodeId)
            if (nodeId === 2 && !failed) {
              failed = true
              throw new Error("clear failed")
            }
          }
          return {}
        },
        detach: () => {
          attached = false
        },
      },
    }

    await setForceFocus(contents, true)
    const failure = await rejection(setForceFocus(contents, false))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("clear failed")
    expect(attached).toBe(true)

    await setForceFocus(contents, false)
    expect(cleared).toEqual([2, 3, 2])
    expect(attached).toBe(false)
  })

  test("drops stale nodes and detaches when their pseudo state can no longer be cleared", async () => {
    let attached = false
    let detached = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length === 0) throw new Error("Could not find node with given id")
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    await setForceFocus(contents, true)
    await setForceFocus(contents, false)

    expect(detached).toBe(1)
    expect(attached).toBe(false)
  })

  test("discards local state when a borrowed debugger detaches", async () => {
    let attached = true
    let detached = 0
    let cleared = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2] }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length === 0
          ) {
            cleared++
          }
          return {}
        },
        detach: () => {
          detached++
        },
      },
    }

    await setForceFocus(contents, true)
    attached = false
    onDetach()
    await setForceFocus(contents, false)

    expect(cleared).toBe(0)
    expect(detached).toBe(0)
  })

  test("uses a shallow document query and caps forced nodes with bounded concurrency", async () => {
    let attached = false
    let forced = 0
    let inFlight = 0
    let maxInFlight = 0
    let documentParams: Record<string, unknown> | undefined
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") {
            documentParams = params
            return { root: { nodeId: 1 } }
          }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 700 }, (_, index) => index + 2) }
          }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            inFlight++
            maxInFlight = Math.max(maxInFlight, inFlight)
            await new Promise<void>((resolve) => setTimeout(resolve, 0))
            inFlight--
            forced++
          }
          return {}
        },
        detach: () => {
          attached = false
        },
      },
    }

    await setForceFocus(contents, true)

    expect(documentParams).toEqual({ depth: 0, pierce: true })
    expect(forced).toBe(512)
    expect(maxInFlight).toBe(32)
    await setForceFocus(contents, false)
  })

  test("does not exceed the forced-node cap across repeated enables", async () => {
    let attached = false
    let query = 0
    let forced = 0
    let cleared = 0
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            query++
            return query === 1
              ? { nodeIds: Array.from({ length: 512 }, (_, index) => index + 2) }
              : { nodeIds: [514] }
          }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) forced++
            else cleared++
          }
          return {}
        },
        detach: () => {
          attached = false
        },
      },
    }

    await setForceFocus(contents, true)
    await setForceFocus(contents, true)
    await setForceFocus(contents, false)

    expect(forced).toBe(512)
    expect(cleared).toBe(512)
  })

  test("owned enable timeout attempts detach and invalidates the session", async () => {
    let attached = false
    let detached = 0
    let forced = 0
    let cleared = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 96 }, (_, index) => index + 2) }
          }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length === 0) {
              cleared++
              return {}
            }
            forced++
            return new Promise(() => {})
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true, 5))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("CSS.forcePseudoState timed out after 5ms")
    expect(forced).toBe(32)
    expect(detached).toBe(1)
    expect(attached).toBe(false)

    // Session was invalidated by the timeout-driven detach; subsequent disable is a no-op.
    await setForceFocus(contents, false, 5)
    expect(cleared).toBe(0)
    expect(detached).toBe(1)
  })

  test("owned disable timeout attempts detach and invalidates the session", async () => {
    let attached = false
    let detached = 0
    let timeout = true
    let cleared = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 96 }, (_, index) => index + 2) }
          }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length === 0
          ) {
            cleared++
            if (timeout) return new Promise(() => {})
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    await setForceFocus(contents, true, 5)
    const failure = await rejection(setForceFocus(contents, false, 5))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("CSS.forcePseudoState timed out after 5ms")
    expect(cleared).toBeLessThanOrEqual(32)
    expect(detached).toBe(1)
    expect(attached).toBe(false)
  })

  test("times out stalled debugger commands", async () => {
    let attached = false
    let detached = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: () => new Promise(() => {}),
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true, 5))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("DOM.enable timed out after 5ms")
    expect(detached).toBe(1)
    expect(attached).toBe(false)
    await setForceFocus(contents, false, 5)
    expect(attached).toBe(false)
  })

  test("concurrent enable/enable stays within limits and preserves cleanup IDs", async () => {
    let attached = false
    let forced = 0
    let cleared = 0
    let inFlight = 0
    let maxInFlight = 0
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 100 }, (_, index) => index + 2) }
          }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            inFlight++
            maxInFlight = Math.max(maxInFlight, inFlight)
            await new Promise<void>((resolve) => setTimeout(resolve, 0))
            inFlight--
            if (params.forcedPseudoClasses.length > 0) forced++
            else cleared++
          }
          return {}
        },
        detach: () => {
          attached = false
        },
      },
    }

    await Promise.all([setForceFocus(contents, true), setForceFocus(contents, true)])

    expect(maxInFlight).toBe(32)
    expect(forced).toBe(100)
    expect(attached).toBe(true)

    await setForceFocus(contents, false)
    expect(cleared).toBe(100)
    expect(attached).toBe(false)
  })

  test("enable/disable enqueued concurrently leaves latest false state in place", async () => {
    let attached = false
    let forced = 0
    let cleared = 0
    let detached = 0
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) forced++
            else cleared++
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
        },
      },
    }

    await Promise.all([
      setForceFocus(contents, true).catch(() => undefined),
      setForceFocus(contents, false),
    ])

    expect(forced).toBe(0)
    expect(cleared).toBe(0)
    expect(detached).toBe(0)
    expect(attached).toBe(false)
  })

  test("unresolved raw node commands stay <=32 across timeout and a retry waits for drain", async () => {
    let attached = false
    let detached = 0
    let forced = 0
    let inFlight = 0
    let maxInFlight = 0
    const forceResolvers: Array<() => void> = []
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 100 }, (_, index) => index + 2) }
          }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            forced++
            if (forced <= 32) {
              inFlight++
              maxInFlight = Math.max(maxInFlight, inFlight)
              return new Promise<void>((resolve) => {
                forceResolvers.push(() => {
                  inFlight--
                  resolve()
                })
              })
            }
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    await rejection(setForceFocus(contents, true, 5))
    expect(maxInFlight).toBe(32)
    expect(forced).toBe(32)
    expect(inFlight).toBe(32)
    expect(detached).toBe(1)
    expect(attached).toBe(false)

    // Retry waits for the previous epoch's raw commands to drain before issuing any new CDP work.
    const retry = setForceFocus(contents, true, 100)
    await tick(10)
    expect(forced).toBe(32)
    expect(attached).toBe(false)

    forceResolvers.splice(0).forEach((resolve) => resolve())
    await retry
    expect(forced).toBe(132)
    expect(attached).toBe(true)

    await setForceFocus(contents, false, 100)
    expect(attached).toBe(false)
  })

  test("borrowed timeout sends no clear/new commands until raw force settles", async () => {
    let attached = true
    let detached = 0
    let forced = 0
    let cleared = 0
    let postTimeoutCommands = 0
    let timedOut = false
    const forceResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 64 }, (_, index) => index + 2) }
          }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) {
              forced++
              return new Promise<void>((resolve) => {
                forceResolvers.push(resolve)
              })
            }
            if (timedOut) postTimeoutCommands++
            cleared++
          }
          return {}
        },
        detach: () => {
          detached++
        },
      },
    }

    await rejection(setForceFocus(contents, true, 5))
    expect(forced).toBe(32)
    timedOut = true

    const disable = setForceFocus(contents, false, 100)
    await tick(10)
    expect(postTimeoutCommands).toBe(0)
    expect(cleared).toBe(0)
    expect(detached).toBe(0)

    forceResolvers.splice(0).forEach((resolve) => resolve())
    await disable

    expect(cleared).toBe(32)
    expect(detached).toBe(0)
    expect(attached).toBe(true)
  })

  test("owned timeout detaches and a new epoch waits for old raw work to settle", async () => {
    let attached = false
    let detached = 0
    let attachCount = 0
    let forced = 0
    const forceResolvers: Array<() => void> = []
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attachCount++
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            return { nodeIds: Array.from({ length: 40 }, (_, index) => index + 2) }
          }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            forced++
            if (forced <= 32) {
              return new Promise<void>((resolve) => {
                forceResolvers.push(resolve)
              })
            }
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    await rejection(setForceFocus(contents, true, 5))
    expect(attachCount).toBe(1)
    expect(detached).toBe(1)
    expect(attached).toBe(false)

    const retry = setForceFocus(contents, true, 100)
    await tick(10)
    expect(attachCount).toBe(1)
    expect(attached).toBe(false)

    forceResolvers.splice(0).forEach((resolve) => resolve())
    await retry
    expect(attachCount).toBe(2)
    expect(detached).toBe(1)
    expect(attached).toBe(true)

    await setForceFocus(contents, false, 100)
    expect(attached).toBe(false)
  })

  test("mid-flight detach cannot resurrect old state from late force results", async () => {
    let attached = false
    let cleared = 0
    const forceResolvers: Array<() => void> = []
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [10, 11, 12] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) {
              return new Promise<void>((resolve) => {
                forceResolvers.push(resolve)
              })
            }
            cleared++
          }
          return {}
        },
        detach: () => {
          attached = false
          onDetach()
        },
      },
    }

    const enablePromise = setForceFocus(contents, true, 1000)
    await tick(5)
    expect(forceResolvers.length).toBeGreaterThan(0)

    attached = false
    onDetach()

    forceResolvers.splice(0).forEach((resolve) => resolve())
    await enablePromise

    await setForceFocus(contents, false, 1000)
    expect(cleared).toBe(0)
    expect(attached).toBe(false)
  })

  test("repeated enables never exceed the 512 forced-node cap", async () => {
    let attached = false
    let forced = 0
    let cleared = 0
    let query = 0
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            query++
            return {
              nodeIds: Array.from({ length: 200 }, (_, index) => index + query * 1000),
            }
          }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) forced++
            else cleared++
          }
          return {}
        },
        detach: () => {
          attached = false
        },
      },
    }

    await setForceFocus(contents, true)
    await setForceFocus(contents, true)
    await setForceFocus(contents, true)
    await setForceFocus(contents, false)

    expect(forced).toBeLessThanOrEqual(512)
    expect(forced).toBe(512)
    expect(cleared).toBe(512)
  })

  test("enable in flight is gated when disable is queued mid-operation", async () => {
    let attached = false
    let forced = 0
    let cleared = 0
    let detached = 0
    let domEnableStarted = false
    let resumeDomEnable: () => void = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method) => {
          if (method === "DOM.enable") {
            domEnableStarted = true
            await new Promise<void>((resolve) => {
              resumeDomEnable = resolve
            })
            return {}
          }
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2] }
          return {}
        },
        detach: () => {
          detached++
          attached = false
        },
      },
    }

    const enable = setForceFocus(contents, true)
    await tick(5)
    expect(domEnableStarted).toBe(true)
    expect(attached).toBe(true)

    // Queue disable while enable is in flight; this flips desired to false.
    const disable = setForceFocus(contents, false)

    resumeDomEnable()
    await Promise.all([enable, disable])

    // Enable was gated before issuing any force commands.
    expect(forced).toBe(0)
    expect(cleared).toBe(0)
    // Disable cleaned up the half-built session.
    expect(detached).toBe(1)
    expect(attached).toBe(false)
  })

  test("owned enable with invalid DOM response rolls back via detach", async () => {
    let attached = false
    let detached = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method) => {
          if (method === "DOM.getDocument") return { root: {} }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("Invalid DOM.getDocument response")
    expect(detached).toBe(1)
    expect(attached).toBe(false)

    // Subsequent disable is a no-op (session was invalidated by the rollback detach).
    await setForceFocus(contents, false)
    expect(detached).toBe(1)
  })

  test("owned enable with CDP rejection rolls back via detach and propagates original error", async () => {
    let attached = false
    let detached = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method) => {
          if (method === "CSS.enable") throw new Error("CSS.enable rejected")
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("CSS.enable rejected")
    expect(detached).toBe(1)
    expect(attached).toBe(false)
  })

  test("borrowed enable with partial force failure rolls back via clear without detach", async () => {
    let attached = true
    let detached = 0
    let forced = 0
    let cleared = 0
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3, 4] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) {
              forced++
              if (params.nodeId === 3) throw new Error("force rejected")
              return {}
            }
            cleared++
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("force rejected")
    expect(forced).toBe(3)
    // Force ordinary failure removed node 3 from nodeIds; rollback only clears the still-tracked
    // successfully-forced nodes (2 and 4) without detaching the borrowed debugger.
    expect(cleared).toBe(2)
    expect(detached).toBe(0)
    expect(attached).toBe(true)
  })

  test("borrowed enable rollback retains nodes whose clear fails", async () => {
    let attached = true
    let detached = 0
    let clearFailedForNode2 = false
    let retriedClear2 = 0
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3, 4] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") return {}
            if (params.forcedPseudoClasses.length > 0) {
              // Node 4 force fails (removed by reducer); nodes 2 and 3 are successfully forced.
              if (nodeId === 4) throw new Error("force rejected")
              return {}
            }
            if (nodeId === 2 && !clearFailedForNode2) {
              clearFailedForNode2 = true
              throw new Error("clear rejected")
            }
            if (nodeId === 2) retriedClear2++
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true))
    expect(failure.message).toBe("force rejected")
    expect(detached).toBe(0)
    expect(attached).toBe(true)

    // Node 2's clear failed during rollback and stays tracked; a later disable retries it.
    await setForceFocus(contents, false)
    expect(retriedClear2).toBe(1)
    expect(detached).toBe(0)
    expect(attached).toBe(true)
  })

  test("delayed detach event for old epoch preserves healthy new attached session", async () => {
    let attached = false
    let attachCount = 0
    let detached = 0
    let firstQuery = true
    const detachDeliveries: Array<() => void> = []
    let pendingListener: () => void = () => {}
    const forceResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attachCount++
          attached = true
        },
        once: (_event, listener) => {
          pendingListener = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            if (firstQuery) {
              firstQuery = false
              return { nodeIds: Array.from({ length: 40 }, (_, index) => index + 2) }
            }
            return { nodeIds: [] }
          }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            return new Promise<void>((resolve) => {
              forceResolvers.push(resolve)
            })
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          const listener = pendingListener
          pendingListener = () => {}
          detachDeliveries.push(listener)
        },
      },
    }

    // Enable1: forces stall, owned timeout detaches epoch 1. Event delivery is deferred.
    await rejection(setForceFocus(contents, true, 5))
    expect(detached).toBe(1)
    expect(forceResolvers.length).toBe(32)

    // Drain epoch-1 raw work so a new epoch can begin.
    forceResolvers.splice(0).forEach((resolve) => resolve())

    // Enable2 establishes a new epoch; no new listener is installed yet because epoch-1's
    // listener is still pending delivery.
    const enablePromise = setForceFocus(contents, true, 100)
    await tick(2)
    expect(attachCount).toBe(2)
    expect(attached).toBe(true)

    // Deliver epoch-1's deferred detach event. It must NOT tear down epoch 2.
    detachDeliveries.splice(0).forEach((deliver) => deliver())
    expect(attached).toBe(true)

    await enablePromise
    expect(attachCount).toBe(2)
    expect(attached).toBe(true)

    // Subsequent disable cleanly detaches the still-healthy epoch 2.
    await setForceFocus(contents, false, 100)
    expect(detached).toBe(2)
    expect(attached).toBe(false)
  })

  test("external current detach is observed through a pending older listener", async () => {
    let attached = false
    let attachCount = 0
    let firstQuery = true
    let listener: () => void = () => {}
    const forceResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attachCount++
          attached = true
        },
        once: (_event, l) => {
          listener = l
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") {
            if (firstQuery) {
              firstQuery = false
              return { nodeIds: Array.from({ length: 40 }, (_, index) => index + 2) }
            }
            return { nodeIds: [] }
          }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            return new Promise<void>((resolve) => {
              forceResolvers.push(resolve)
            })
          }
          return {}
        },
        detach: () => {
          // Owned detach during epoch 1's timeout: do NOT deliver the listener event
          // synchronously; the listener captured above remains pending so the test can
          // simulate a later, externally-driven delivery.
          attached = false
        },
      },
    }

    // Enable1: owned timeout detaches epoch 1. listener_A is still pending (not yet delivered).
    await rejection(setForceFocus(contents, true, 5))
    expect(attachCount).toBe(1)

    // Drain epoch-1 raw work.
    forceResolvers.splice(0).forEach((resolve) => resolve())

    // Enable2 establishes epoch 2; observeDetach is a no-op (epoch-1's listener still pending),
    // so listener_A is the only registered listener.
    const enablePromise = setForceFocus(contents, true, 100)
    await tick(2)
    expect(attachCount).toBe(2)
    expect(attached).toBe(true)

    // External detach of the current debugger is delivered through the older pending listener.
    // isAttached() must read false so the current session is invalidated too.
    attached = false
    listener()

    await enablePromise
    expect(attached).toBe(false)

    // A later disable is a no-op (current session was invalidated by the external detach).
    await setForceFocus(contents, false, 100)
    expect(attachCount).toBe(2)
  })

  test("mixed force failure prioritizes timeout quarantine over ordinary failure (borrowed)", async () => {
    let attached = true
    let detached = 0
    let forced = 0
    let postTimeoutCommands = 0
    let timeoutSignaled = false
    const forceResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            if (timeoutSignaled) postTimeoutCommands++
            forced++
            const nodeId = params.nodeId
            // Ordinary failure lands first (lower index) but must not bypass timeout quarantine.
            if (nodeId === 2) throw new Error("force rejected")
            return new Promise<void>((resolve) => {
              forceResolvers.push(resolve)
            })
          }
          return {}
        },
        detach: () => {
          detached++
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true, 5))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    // Timeout is prioritized over the ordinary failure even though it landed at a later index.
    expect(failure.message).toBe("CSS.forcePseudoState timed out after 5ms")
    expect(forced).toBe(2)

    // Borrowed session is quarantined: subsequent operations cannot issue new CDP work until raw settles.
    timeoutSignaled = true
    const disable = setForceFocus(contents, false, 100)
    await tick(10)
    expect(postTimeoutCommands).toBe(0)
    expect(detached).toBe(0)

    forceResolvers.splice(0).forEach((resolve) => resolve())
    await disable
  })

  test("mixed clear failure prioritizes timeout quarantine over ordinary failure (owned disable)", async () => {
    let attached = false
    let detached = 0
    let cleared = 0
    let onDetach = () => {}
    const clearResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) return {}
            cleared++
            const nodeId = params.nodeId
            // Ordinary failure lands first but must not bypass timeout quarantine.
            if (nodeId === 2) throw new Error("clear rejected")
            return new Promise<void>((resolve) => {
              clearResolvers.push(resolve)
            })
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    await setForceFocus(contents, true)

    const failure = await rejection(setForceFocus(contents, false, 5))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("CSS.forcePseudoState timed out after 5ms")
    expect(cleared).toBe(2)
    // Owned timeout detaches, which invalidates the session.
    expect(detached).toBe(1)
    expect(attached).toBe(false)

    // Drain pending raw work so subsequent operations are not blocked.
    clearResolvers.splice(0).forEach((resolve) => resolve())
  })

  test("mixed rollback clear failure prioritizes timeout quarantine (borrowed rollback)", async () => {
    let attached = true
    let detached = 0
    let forced = 0
    let cleared = 0
    let timeoutSignaled = false
    let postTimeoutCommands = 0
    let node2ClearAttempts = 0
    let node3ClearAttempts = 0
    const clearResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3, 4] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") return {}
            if (params.forcedPseudoClasses.length > 0) {
              forced++
              // Node 4 force failure triggers rollback (and is removed from nodeIds by the reducer).
              if (nodeId === 4) throw new Error("force rejected")
              return {}
            }
            if (timeoutSignaled) postTimeoutCommands++
            cleared++
            // Mixed clear failures during rollback (first attempt) on the still-tracked nodes:
            // ordinary failure on 2 + timeout on 3. Subsequent attempts (post-drain disable) succeed.
            if (nodeId === 2) {
              node2ClearAttempts++
              if (node2ClearAttempts === 1) throw new Error("clear rejected")
              return {}
            }
            if (nodeId === 3) {
              node3ClearAttempts++
              if (node3ClearAttempts === 1) {
                return new Promise<void>((resolve) => {
                  clearResolvers.push(resolve)
                })
              }
              return {}
            }
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
        },
      },
    }

    const failure = await rejection(setForceFocus(contents, true, 5))
    // Original enable error (force rejected) propagates; rollback internally prioritized the timeout.
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("force rejected")
    expect(forced).toBe(3)
    // Force failure removed node 4 from nodeIds; rollback cleared still-tracked nodes 2 and 3.
    expect(cleared).toBe(2)
    expect(detached).toBe(0)
    expect(attached).toBe(true)

    // Borrowed session is quarantined by the rollback clear timeout on node 3.
    timeoutSignaled = true
    const disable = setForceFocus(contents, false, 100)
    await tick(10)
    expect(postTimeoutCommands).toBe(0)
    expect(detached).toBe(0)

    // Drain pending raw so the borrowed session can recover; subsequent clears succeed.
    clearResolvers.splice(0).forEach((resolve) => resolve())
    await disable
  })

  test("disable in flight then enable reduces successful clears and re-forces cleared IDs", async () => {
    let attached = false
    let detached = 0
    let forced: number[] = []
    let cleared: number[] = []
    let resumeClear: () => void = () => {}
    let firstClearGated = false
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") return {}
            if (params.forcedPseudoClasses.length > 0) {
              forced.push(nodeId)
              return {}
            }
            cleared.push(nodeId)
            if (!firstClearGated) {
              firstClearGated = true
              await new Promise<void>((resolve) => {
                resumeClear = resolve
              })
            }
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
        },
      },
    }

    await setForceFocus(contents, true)
    expect(forced).toEqual([2, 3])

    // Start disable; the first clear is gated so enable can be queued mid-flight.
    const disable = setForceFocus(contents, false)
    await tick(2)

    // Queue enable while disable's clear is in flight.
    const enable = setForceFocus(contents, true)

    resumeClear()
    await Promise.all([disable, enable])

    // Disable reduced successful clears; both 2 and 3 were cleared.
    expect(cleared).toEqual([2, 3])
    // Disable did not detach (desired was now true).
    expect(detached).toBe(0)
    // Enable re-queried and re-forced both cleared IDs.
    expect(forced).toEqual([2, 3, 2, 3])
  })

  test("disable in flight with ordinary clear failure does not surface obsolete failure when enable supersedes", async () => {
    let attached = false
    let detached = 0
    let forced: number[] = []
    let cleared: number[] = []
    let resumeClear: () => void = () => {}
    let firstClearGated = false
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") return {}
            if (params.forcedPseudoClasses.length > 0) {
              forced.push(nodeId)
              return {}
            }
            cleared.push(nodeId)
            if (!firstClearGated) {
              firstClearGated = true
              await new Promise<void>((resolve) => {
                resumeClear = resolve
              })
              // Ordinary clear failure on the first gated clear.
              throw new Error("clear rejected")
            }
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
        },
      },
    }

    await setForceFocus(contents, true)
    expect(forced).toEqual([2, 3])

    const disable = setForceFocus(contents, false)
    await tick(2)
    const enable = setForceFocus(contents, true)

    resumeClear()
    // Neither disable nor enable rejects: the obsolete ordinary clear failure is swallowed because
    // desired is now true, and the latest enable re-runs.
    await Promise.all([disable, enable])

    expect(cleared).toEqual([2, 3])
    expect(detached).toBe(0)
    // Node 2's clear failed (retained); node 3's clear succeeded (removed). Enable re-queried and
    // re-forced only the cleared node 3.
    expect(forced).toEqual([2, 3, 3])
  })

  test("disable in flight with clear timeout still quarantines when enable supersedes", async () => {
    let attached = false
    let detached = 0
    let forced: number[] = []
    let cleared = 0
    let timeoutSignaled = false
    let postTimeoutCommands = 0
    const clearResolvers: Array<() => void> = []
    let resumeClear: () => void = () => {}
    let firstClearGated = false
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") return {}
            if (params.forcedPseudoClasses.length > 0) {
              if (timeoutSignaled) postTimeoutCommands++
              forced.push(nodeId)
              return {}
            }
            cleared++
            if (!firstClearGated) {
              firstClearGated = true
              await new Promise<void>((resolve) => {
                resumeClear = resolve
              })
              // First clear stalls so a clear timeout fires when the batch settles.
              return new Promise<void>((resolve) => {
                clearResolvers.push(resolve)
              })
            }
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
          onDetach()
        },
      },
    }

    await setForceFocus(contents, true)
    expect(forced).toEqual([2, 3])

    const disable = setForceFocus(contents, false, 5)
    await tick(2)
    // Queue enable while the disable's clear is gated.
    const enable = setForceFocus(contents, true, 100)

    resumeClear()
    // The disable's clear times out. The timeout is still quarantined (owned detach) even though
    // the latest desired is now true; the worker then reconciles to enable without surfacing the
    // obsolete timeout to the disable caller.
    timeoutSignaled = true
    await tick(10)
    expect(cleared).toBe(2)
    expect(detached).toBe(1)
    expect(attached).toBe(false)
    // Enable is waiting on the old raw work to drain before starting a new epoch.
    expect(postTimeoutCommands).toBe(0)

    clearResolvers.splice(0).forEach((resolve) => resolve())
    await Promise.all([disable, enable])
    expect(forced).toEqual([2, 3, 2, 3])
  })

  test("latest setForceFocus call shares the single worker and reconciles to its target", async () => {
    let attached = false
    let forced = 0
    let detached = 0
    let resumeDomEnable: () => void = () => {}
    let domEnableStarted = false
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: () => {},
        sendCommand: async (method) => {
          if (method === "DOM.enable") {
            domEnableStarted = true
            await new Promise<void>((resolve) => {
              resumeDomEnable = resolve
            })
            return {}
          }
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2] }
          if (method === "CSS.forcePseudoState") {
            forced++
            return {}
          }
          return {}
        },
        detach: () => {
          detached++
          attached = false
        },
      },
    }

    // Three concurrent calls; only one worker runs and the latest target (false) wins.
    const a = setForceFocus(contents, true).catch(() => undefined)
    await tick(2)
    expect(domEnableStarted).toBe(true)
    const b = setForceFocus(contents, true).catch(() => undefined)
    const c = setForceFocus(contents, false)

    resumeDomEnable()
    await Promise.all([a, b, c])

    // Enable was gated before any force; the latest disable target reconciled cleanly and detached
    // the half-built session the in-flight enable had created.
    expect(forced).toBe(0)
    expect(attached).toBe(false)
    expect(detached).toBe(1)
  })

  test("worker rejects on real failure for the still-current target and clears for retry", async () => {
    let attached = false
    let detached = 0
    let attempts = 0
    let onDetach = () => {}
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          attached = true
        },
        once: (_event, listener) => {
          onDetach = listener
        },
        sendCommand: async (method) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [] }
          return {}
        },
        detach: () => {
          attempts++
          if (attempts === 1) throw new Error("detach failed")
          attached = false
          onDetach()
        },
      },
    }

    await setForceFocus(contents, true)
    // Real failure for the still-current disable target: worker rejects.
    const failure = await rejection(setForceFocus(contents, false))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("detach failed")
    expect(detached).toBe(0)

    // Worker was cleared; a later call starts a fresh worker and succeeds.
    await setForceFocus(contents, false)
    expect(attempts).toBe(2)
    expect(attached).toBe(false)
  })

  test("borrowed force-timeout superseded by disable sends no clear command until raw force settles", async () => {
    let attached = true
    let forced = 0
    let cleared = 0
    let timeoutSignaled = false
    let postTimeoutCommands = 0
    const forceResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) {
              if (timeoutSignaled) postTimeoutCommands++
              forced++
              return new Promise<void>((resolve) => {
                forceResolvers.push(resolve)
              })
            }
            if (timeoutSignaled) postTimeoutCommands++
            cleared++
            return {}
          }
          return {}
        },
        detach: () => {
          throw new Error("must not detach borrowed")
        },
      },
    }

    // Start enable (forces stall, will time out).
    const enable = setForceFocus(contents, true, 5)
    await tick(2)

    // Queue disable while force is in flight.
    const disable = setForceFocus(contents, false, 100)
    timeoutSignaled = true

    // Force times out. Enable quarantines (borrowed, no detach) and returns silently because
    // disable is the latest target. The worker then runs disable, which recovers via settleAllRaw.
    await tick(10)
    // No clear/new commands issued while the borrowed session is quarantined.
    expect(forced).toBe(2)
    expect(postTimeoutCommands).toBe(0)
    expect(cleared).toBe(0)

    // Drain the raw force work so the borrowed session can recover and disable can clear.
    forceResolvers.splice(0).forEach((resolve) => resolve())
    await Promise.all([enable, disable])
    expect(cleared).toBe(2)
  })

  test("clear-timeout superseded by enable: late raw clear removes node so latest enable re-forces it", async () => {
    let attached = true
    let forced: number[] = []
    let cleared = 0
    let firstClearGated = false
    let resumeClear: () => void = () => {}
    const clearResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            const nodeId = params.nodeId
            if (typeof nodeId !== "number") return {}
            if (params.forcedPseudoClasses.length > 0) {
              forced.push(nodeId)
              return {}
            }
            cleared++
            if (!firstClearGated) {
              firstClearGated = true
              await new Promise<void>((resolve) => {
                resumeClear = resolve
              })
              // Stalls so the wrapper times out; the raw clear settles later (successfully).
              return new Promise<void>((resolve) => {
                clearResolvers.push(resolve)
              })
            }
            return {}
          }
          return {}
        },
        detach: () => {
          throw new Error("must not detach borrowed")
        },
      },
    }

    await setForceFocus(contents, true)
    expect(forced).toEqual([2, 3])

    // Start disable; first clear (node 2) is gated.
    const disable = setForceFocus(contents, false, 5)
    await tick(2)
    // Queue enable while clear is gated.
    const enable = setForceFocus(contents, true, 100)

    // Resume gated clear; node 2 stalls and the wrapper times out. Node 3 already cleared.
    resumeClear()
    // Disable quarantines (borrowed, no detach) and returns silently; enable is queued. Enable
    // waits on the old raw work via recoverIfNeeded.
    await tick(10)

    // Drain the late raw clear for node 2: the operation-aware callback removes node 2 from
    // nodeIds now that the raw clear has actually succeeded.
    clearResolvers.splice(0).forEach((resolve) => resolve())
    await Promise.all([disable, enable])
    expect(cleared).toBe(2)

    // With node 2 removed by the late raw-clear callback and node 3 removed by the reducer,
    // enable re-queried and re-forced both cleared IDs.
    expect(forced).toEqual([2, 3, 2, 3])
  })

  test("force-timeout late ordinary rejection: subsequent enable retries the rejected node", async () => {
    let attached = true
    let forced: number[] = []
    let node3ForceAttempts = 0
    const forceRejectors: Array<(error: Error) => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2, 3] }
          if (
            method === "CSS.forcePseudoState" &&
            Array.isArray(params?.forcedPseudoClasses) &&
            params.forcedPseudoClasses.length > 0
          ) {
            const nodeId = params.nodeId
            forced.push(nodeId)
            if (nodeId === 3) {
              node3ForceAttempts++
              if (node3ForceAttempts === 1) {
                // First attempt stalls until the test rejects it after the wrapper timeout fires.
                return new Promise<void>((_resolve, reject) => {
                  forceRejectors.push(reject)
                })
              }
              // Subsequent retry succeeds.
              return {}
            }
            return {}
          }
          return {}
        },
        detach: () => {
          throw new Error("must not detach borrowed")
        },
      },
    }

    // Enable: node 2 force succeeds; node 3 force stalls until the wrapper timeout fires.
    const failure = await rejection(setForceFocus(contents, true, 5))
    expect(failure).toBeInstanceOf(Error)
    if (!(failure instanceof Error)) throw failure
    expect(failure.message).toBe("CSS.forcePseudoState timed out after 5ms")
    expect(forced).toEqual([2, 3])

    // Now reject node 3's force raw. The operation-aware callback removes node 3 from nodeIds
    // (force rejection, even ordinary, frees the slot for retry).
    forceRejectors.splice(0).forEach((reject) => reject(new Error("force rejected late")))
    await tick(2)

    // Subsequent enable recovers (drained), re-queries, and re-forces only the freed node 3.
    await setForceFocus(contents, true, 100)
    expect(forced).toEqual([2, 3, 3])
  })

  test("force-timeout late raw fulfillment keeps the node tracked and disable clears it", async () => {
    let attached = true
    let forced = 0
    let cleared = 0
    const forceResolvers: Array<() => void> = []
    const contents: FocusDebugContents = {
      debugger: {
        isAttached: () => attached,
        attach: () => {
          throw new Error("must not attach")
        },
        once: () => {},
        sendCommand: async (method, params) => {
          if (method === "DOM.getDocument") return { root: { nodeId: 1 } }
          if (method === "DOM.querySelectorAll") return { nodeIds: [2] }
          if (method === "CSS.forcePseudoState" && Array.isArray(params?.forcedPseudoClasses)) {
            if (params.forcedPseudoClasses.length > 0) {
              forced++
              return new Promise<void>((resolve) => {
                forceResolvers.push(resolve)
              })
            }
            cleared++
            return {}
          }
          return {}
        },
        detach: () => {
          throw new Error("must not detach borrowed")
        },
      },
    }

    // Enable times out (force stalls). Node 2 stays tracked (timeout = uncertain).
    const failure = await rejection(setForceFocus(contents, true, 5))
    expect(failure.message).toBe("CSS.forcePseudoState timed out after 5ms")
    expect(forced).toBe(1)

    // Raw force later fulfills. Callback keeps the ID tracked (force fulfillment = still forced).
    forceResolvers.splice(0).forEach((resolve) => resolve())
    await tick(2)

    // Disable clears the still-tracked node 2 (it was actually forced).
    await setForceFocus(contents, false, 100)
    expect(cleared).toBe(1)
  })
})
