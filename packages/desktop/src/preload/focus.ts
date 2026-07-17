export function createFocusSetter(invoke: (enabled: boolean) => Promise<unknown>) {
  let desired = false
  let requested = false
  let task: Promise<void> | undefined

  return (enabled: boolean) => {
    if (task && desired === enabled) return task
    desired = enabled
    requested = true
    if (task) return task

    task = Promise.resolve().then(async () => {
      try {
        while (requested) {
          const target = desired
          requested = false
          try {
            await invoke(target)
          } catch (error) {
            if (requested && desired !== target) continue
            requested = false
            throw error
          }
          if (requested && desired === target) requested = false
        }
      } finally {
        task = undefined
      }
    })
    return task
  }
}
