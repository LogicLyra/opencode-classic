import { join } from "node:path"

export function createIsolatedSidecarEnv(userDataPath: string, source = process.env) {
  const env = Object.fromEntries(
    Object.entries(source).flatMap(([key, value]) => (value === undefined ? [] : [[key, String(value)]])),
  )
  const root = join(userDataPath, "sidecar")

  Object.assign(env, {
    XDG_CONFIG_HOME: join(root, "config"),
    XDG_DATA_HOME: join(root, "data"),
    XDG_CACHE_HOME: join(root, "cache"),
    XDG_STATE_HOME: join(root, "state"),
    TMPDIR: join(root, "tmp"),
  })
  delete env.OPENCODE_CONFIG_DIR
  delete env.OPENCODE_DB
  delete env.OPENCODE_TEST_HOME
  delete env.DEBUG
  if (process.platform === "linux") delete env.LD_PRELOAD
  return env
}
