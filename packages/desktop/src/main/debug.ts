export type FocusDebugContents = {
  debugger: {
    isAttached: () => boolean
    attach: (version: string) => void
    once: (event: "detach", listener: () => void) => void
    sendCommand: (method: string, params?: Record<string, unknown>) => Promise<unknown>
    detach: () => void
  }
}

type FocusDebugSession = {
  readonly owner: boolean
  readonly nodeIds: Set<number>
  quarantined: boolean
  invalidated: boolean
  readonly rawCommands: Set<Promise<unknown>>
}

type FocusDebugController = {
  worker: Promise<void> | undefined
  session: FocusDebugSession | undefined
  draining: Promise<void> | undefined
  desired: boolean
  desiredTimeoutMs: number
  observedDetach: boolean
}

const controllers = new WeakMap<FocusDebugContents, FocusDebugController>()
const commandTimeoutMs = 3_000
const commandConcurrency = 32
const maxForcedFocusNodes = 512
class CommandTimeoutError extends Error {}
const focusableSelector = `
  a[href],
  button:not([disabled]),
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  summary,
  [contenteditable="true"],
  [tabindex]:not([tabindex="-1"])
`

export function setForceFocus(contents: FocusDebugContents, enabled: unknown, timeoutMs = commandTimeoutMs) {
  const desired = requireFocusDebugState(enabled)
  const controller = getController(contents)
  controller.desired = desired
  controller.desiredTimeoutMs = timeoutMs
  if (controller.worker) return controller.worker
  const worker = runWorker(contents)
  controller.worker = worker
  return worker
}

export function requireFocusDebugState(value: unknown) {
  if (typeof value !== "boolean") throw new TypeError("Focus debug state must be a boolean")
  return value
}

function getController(contents: FocusDebugContents) {
  let controller = controllers.get(contents)
  if (!controller) {
    controller = {
      worker: undefined,
      session: undefined,
      draining: undefined,
      desired: false,
      desiredTimeoutMs: commandTimeoutMs,
      observedDetach: false,
    }
    controllers.set(contents, controller)
  }
  return controller
}

async function runWorker(contents: FocusDebugContents) {
  const controller = getController(contents)
  try {
    while (true) {
      const target = controller.desired
      const timeoutMs = controller.desiredTimeoutMs
      try {
        if (target) await enableFocus(contents, timeoutMs)
        else await disableFocus(contents, timeoutMs)
      } catch (error) {
        // Superseded operation error: desired changed during the op. Swallow so the latest target runs.
        if (controller.desired !== target) continue
        // Real failure for the still-current target. Reject the worker so a later call can retry.
        throw error
      }
      if (controller.desired === target) {
        return
      }
      // desired changed during the op; loop with the latest target.
    }
  } finally {
    controller.worker = undefined
  }
}

async function enableFocus(contents: FocusDebugContents, timeoutMs: number) {
  const controller = getController(contents)
  await recoverIfNeeded(contents)
  if (!controller.desired) return

  let session = controller.session
  if (!session || session.invalidated) {
    controller.session = undefined
    await waitDraining(controller)
    if (!controller.desired) return

    const debuggerApi = contents.debugger
    const owner = !debuggerApi.isAttached()
    if (owner) debuggerApi.attach("1.3")
    session = controller.session = {
      owner,
      nodeIds: new Set<number>(),
      quarantined: false,
      invalidated: false,
      rawCommands: new Set<Promise<unknown>>(),
    }
    observeDetach(contents, session)
  }

  if (session.nodeIds.size >= maxForcedFocusNodes) return

  try {
    await sendCommand(session, contents.debugger, "DOM.enable", timeoutMs)
    if (!controller.desired || session.invalidated) return
    await sendCommand(session, contents.debugger, "CSS.enable", timeoutMs)
    if (!controller.desired || session.invalidated) return
    const document: unknown = await sendCommand(session, contents.debugger, "DOM.getDocument", timeoutMs, {
      depth: 0,
      pierce: true,
    })
    if (!controller.desired || session.invalidated) return
    const nodes: unknown = await sendCommand(session, contents.debugger, "DOM.querySelectorAll", timeoutMs, {
      nodeId: readDocumentNodeId(document),
      selector: focusableSelector,
    })
    if (!controller.desired || session.invalidated) return

    const slot = maxForcedFocusNodes - session.nodeIds.size
    const candidateIds = readNodeIds(nodes).filter((nodeId) => !session.nodeIds.has(nodeId)).slice(0, slot)
    if (candidateIds.length === 0) return

    const results = await runNodeCommands(session, contents.debugger, timeoutMs, candidateIds, true)
    // Always reduce valid force results so successful/stale/ordinary outcomes are reflected in
    // nodeIds, even if desired changed while the batch was in flight.
    const failure = reduceForceResults(session, results, candidateIds)
    if (session.invalidated) return
    // Always quarantine on timeout, regardless of desired, before any desired-state return.
    if (failure instanceof CommandTimeoutError) {
      await handleTimeoutIfNeeded(contents, session)
      // Surface the timeout only if enable is still the current target; otherwise the latest
      // target (e.g., disable) will reconcile after the raw work drains.
      if (controller.desired) throw failure
      return
    }
    // If desired is no longer true, do not rollback or surface an obsolete ordinary failure.
    // The latest disable will clear any successfully-forced nodes via its own clear batch.
    if (!controller.desired) return
    if (failure !== undefined) throw failure
  } catch (error) {
    if (session.invalidated) throw error
    if (error instanceof CommandTimeoutError) await handleTimeoutIfNeeded(contents, session)
    else await rollbackEnableFailure(contents, session, timeoutMs)
    throw error
  }
}

async function disableFocus(contents: FocusDebugContents, timeoutMs: number) {
  const controller = getController(contents)
  if (controller.desired) return

  let session = controller.session
  if (!session || session.invalidated) {
    controller.session = undefined
    return
  }
  if (session.quarantined) {
    await recoverIfNeeded(contents)
    if (controller.desired) return
    session = controller.session
    if (!session || session.invalidated) {
      controller.session = undefined
      return
    }
  }

  if (session.nodeIds.size === 0) {
    if (session.owner) detachSession(contents, session)
    return
  }

  const nodeIds = [...session.nodeIds]
  try {
    const results = await runNodeCommands(session, contents.debugger, timeoutMs, nodeIds, false)
    // Always reduce valid completed clear results so successful clears are reflected in nodeIds,
    // even if desired changed while the batch was in flight.
    const failure = reduceClearResults(session, results, nodeIds)
    if (session.invalidated) return
    // Always quarantine on timeout, regardless of desired, before any desired-state return.
    if (failure instanceof CommandTimeoutError) {
      await handleTimeoutIfNeeded(contents, session)
      // Surface the timeout only if disable is still the current target; otherwise the latest
      // target will reconcile (e.g., enable will start a fresh epoch after the raw work drains).
      if (!controller.desired) throw failure
      return
    }
    // If desired is no longer false, do not detach or surface an obsolete ordinary failure.
    // Failed clears stay tracked; successful clears were removed by reduceClearResults.
    // The latest enable will re-query and re-force the cleared IDs.
    if (controller.desired) return
    if (session.nodeIds.size === 0 && session.owner && !session.invalidated) detachSession(contents, session)
    if (failure !== undefined) throw failure
  } catch (error) {
    if (error instanceof CommandTimeoutError) await handleTimeoutIfNeeded(contents, session)
    throw error
  }
}

function detachSession(contents: FocusDebugContents, session: FocusDebugSession) {
  contents.debugger.detach()
  invalidateSession(getController(contents), session)
}

async function recoverIfNeeded(contents: FocusDebugContents) {
  const controller = getController(contents)
  const session = controller.session
  if (!session || !session.quarantined || session.invalidated) return

  if (session.owner) {
    detachSession(contents, session)
  } else {
    await settleAllRaw(session.rawCommands)
    if (!session.invalidated) session.quarantined = false
  }
}

async function handleTimeoutIfNeeded(contents: FocusDebugContents, session: FocusDebugSession) {
  if (session.invalidated || session.quarantined) return
  session.quarantined = true
  if (session.owner) {
    try {
      detachSession(contents, session)
    } catch {
      // detach failed: stay quarantined; recoverIfNeeded retries detach on a later call
    }
  }
}

function observeDetach(contents: FocusDebugContents, session: FocusDebugSession) {
  const controller = getController(contents)
  if (controller.observedDetach) return
  controller.observedDetach = true
  contents.debugger.once("detach", () => {
    handleDetachEvent(contents, session)
  })
}

function handleDetachEvent(contents: FocusDebugContents, expectedSession: FocusDebugSession) {
  const controller = getController(contents)
  controller.observedDetach = false
  const currentSession = controller.session

  if (currentSession === expectedSession) {
    invalidateSession(controller, expectedSession)
    return
  }

  // Stale event: the expected session is no longer current (it was invalidated by some other path).
  // Determine whether the current session also lost attachment.
  if (currentSession && !contents.debugger.isAttached()) {
    invalidateSession(controller, currentSession)
  } else if (currentSession) {
    // Delayed old event; the current session is still attached. Preserve it but ensure it has a listener.
    observeDetach(contents, currentSession)
  }
}

function invalidateSession(controller: FocusDebugController, session: FocusDebugSession) {
  session.invalidated = true
  if (session.rawCommands.size > 0 && !controller.draining) {
    controller.draining = settleAllRaw(session.rawCommands)
  }
  if (controller.session === session) controller.session = undefined
}

async function rollbackEnableFailure(contents: FocusDebugContents, session: FocusDebugSession, timeoutMs: number) {
  if (session.invalidated) return
  if (session.owner) {
    try {
      detachSession(contents, session)
    } catch {
      session.quarantined = true
    }
    return
  }
  if (session.nodeIds.size === 0) return
  const nodeIds = [...session.nodeIds]
  try {
    const results = await runNodeCommands(session, contents.debugger, timeoutMs, nodeIds, false)
    if (session.invalidated) return
    const failure = reduceClearResults(session, results, nodeIds)
    if (failure instanceof CommandTimeoutError) await handleTimeoutIfNeeded(contents, session)
  } catch (error) {
    if (error instanceof CommandTimeoutError) await handleTimeoutIfNeeded(contents, session)
    // otherwise retain cleanup failures in nodeIds; original enable error propagates to caller
  }
}

async function waitDraining(controller: FocusDebugController) {
  if (controller.draining) {
    const pending = controller.draining
    controller.draining = undefined
    await pending
  }
}

async function settleAllRaw(rawCommands: Set<Promise<unknown>>) {
  if (rawCommands.size === 0) return
  await Promise.allSettled(rawCommands)
}

type NodeOperation = { kind: "force" | "clear"; nodeId: number }

async function sendCommand(
  session: FocusDebugSession,
  debuggerApi: FocusDebugContents["debugger"],
  method: string,
  timeoutMs: number,
  params?: Record<string, unknown>,
  nodeOp?: NodeOperation,
) {
  while (session.rawCommands.size >= commandConcurrency) {
    if (session.invalidated) throw new CommandTimeoutError(`${method} aborted; session invalidated`)
    await Promise.race([...session.rawCommands].map((promise) => promise.then(() => undefined, () => undefined)))
    if (session.invalidated) throw new CommandTimeoutError(`${method} aborted; session invalidated`)
  }
  if (session.invalidated) throw new CommandTimeoutError(`${method} aborted; session invalidated`)

  const raw = debuggerApi.sendCommand(method, params)
  session.rawCommands.add(raw)
  // Operation-aware raw settlement bookkeeping. The wrapper timeout may reject before the raw
  // settles; when the raw eventually resolves we apply its actual outcome to nodeIds so a later
  // operation sees consistent state. Callbacks only mutate the still-valid captured session.
  raw.then(
    () => {
      session.rawCommands.delete(raw)
      if (!session.invalidated && nodeOp?.kind === "clear") session.nodeIds.delete(nodeOp.nodeId)
    },
    (error: unknown) => {
      session.rawCommands.delete(raw)
      if (session.invalidated || !nodeOp) return
      if (nodeOp.kind === "force") {
        // Force rejection (stale or ordinary) removes the ID so a later enable can retry.
        session.nodeIds.delete(nodeOp.nodeId)
      } else if (staleNodeError(error)) {
        // Clear stale rejection removes; ordinary rejection keeps the ID tracked.
        session.nodeIds.delete(nodeOp.nodeId)
      }
    },
  )

  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      raw,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new CommandTimeoutError(`${method} timed out after ${timeoutMs}ms`)), timeoutMs)
      }),
    ])
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}

async function runNodeCommands(
  session: FocusDebugSession,
  debuggerApi: FocusDebugContents["debugger"],
  timeoutMs: number,
  nodeIds: number[],
  reserve: boolean,
): Promise<PromiseSettledResult<unknown>[]> {
  const results: PromiseSettledResult<unknown>[] = []
  const forcedPseudoClasses = reserve ? ["focus", "focus-visible"] : []
  const kind: NodeOperation["kind"] = reserve ? "force" : "clear"
  for (let index = 0; index < nodeIds.length; index += commandConcurrency) {
    if (session.invalidated) break
    const batch = nodeIds.slice(index, index + commandConcurrency)
    if (reserve) for (const nodeId of batch) session.nodeIds.add(nodeId)
    const batchResults = await Promise.allSettled(
      batch.map((nodeId) =>
        sendCommand(
          session,
          debuggerApi,
          "CSS.forcePseudoState",
          timeoutMs,
          { nodeId, forcedPseudoClasses },
          { kind, nodeId },
        ),
      ),
    )
    results.push(...batchResults)
    if (batchResults.some((result) => result.status === "rejected" && result.reason instanceof CommandTimeoutError)) break
  }
  return results
}

function reduceForceResults(session: FocusDebugSession, results: PromiseSettledResult<unknown>[], nodeIds: number[]) {
  let failure: unknown
  let timeoutFailure: unknown
  results.forEach((result, index) => {
    const nodeId = nodeIds[index]
    if (nodeId === undefined) return
    if (result.status === "fulfilled") return // keep tracked
    if (staleNodeError(result.reason)) {
      session.nodeIds.delete(nodeId)
      return
    }
    if (result.reason instanceof CommandTimeoutError) {
      timeoutFailure ??= result.reason
      return // keep tracked; raw outcome still pending
    }
    // Ordinary force rejection removes the ID so a later enable can retry. Consistent with the
    // operation-aware raw settlement callback.
    session.nodeIds.delete(nodeId)
    failure ??= result.reason
  })
  return timeoutFailure ?? failure
}

function reduceClearResults(session: FocusDebugSession, results: PromiseSettledResult<unknown>[], nodeIds: number[]) {
  let failure: unknown
  let timeoutFailure: unknown
  results.forEach((result, index) => {
    const nodeId = nodeIds[index]
    if (nodeId === undefined) return
    if (result.status === "fulfilled" || staleNodeError(result.reason)) {
      session.nodeIds.delete(nodeId)
      return
    }
    if (result.reason instanceof CommandTimeoutError) timeoutFailure ??= result.reason
    else failure ??= result.reason
  })
  return timeoutFailure ?? failure
}

function staleNodeError(value: unknown) {
  return value instanceof Error && /(?:could not find node|no node with given id|node .*not found)/i.test(value.message)
}

function readDocumentNodeId(value: unknown) {
  if (
    !value ||
    typeof value !== "object" ||
    !("root" in value) ||
    !value.root ||
    typeof value.root !== "object" ||
    !("nodeId" in value.root) ||
    typeof value.root.nodeId !== "number"
  ) {
    throw new Error("Invalid DOM.getDocument response")
  }
  return value.root.nodeId
}

function readNodeIds(value: unknown) {
  if (
    !value ||
    typeof value !== "object" ||
    !("nodeIds" in value) ||
    !Array.isArray(value.nodeIds) ||
    !value.nodeIds.every((nodeId) => typeof nodeId === "number")
  ) {
    throw new Error("Invalid DOM.querySelectorAll response")
  }
  return value.nodeIds
}
