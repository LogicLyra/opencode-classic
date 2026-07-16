#!/usr/bin/env bash

set -Eeuo pipefail
umask 0022

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
evidence=${CI_ARTIFACT_DIR:?CI_ARTIFACT_DIR is required}
archive="$evidence/runtime"
runtime=${CI_RUNTIME_DIR:-$archive}
display=${CI_DISPLAY:-:93}
executable=$(readlink -f -- "${CI_RUNTIME_EXECUTABLE:-$root/packages/desktop/dist/linux-unpacked/io.github.logiclyra.opencodeclassic}")

if [[ ${1:-} != session ]]; then
  test -x "$executable"
  test ! -e "$runtime"
  if [[ $runtime != "$archive" ]]; then test ! -e "$archive"; fi
  install -d -m 0700 \
    "$runtime" \
    "$runtime/home" \
    "$runtime/tmp" \
    "$runtime/xdg/config" \
    "$runtime/xdg/data" \
    "$runtime/xdg/cache" \
    "$runtime/xdg/state" \
    "$runtime/xdg/runtime"
  install -d -m 0755 "$runtime/project"
  printf '%s\n' '# OpenCode Classic runtime fixture' > "$runtime/project/README.md"
  export HOME="$runtime/home"
  export TMPDIR="$runtime/tmp"
  export XDG_CONFIG_HOME="$runtime/xdg/config"
  export XDG_DATA_HOME="$runtime/xdg/data"
  export XDG_CACHE_HOME="$runtime/xdg/cache"
  export XDG_STATE_HOME="$runtime/xdg/state"
  export XDG_RUNTIME_DIR="$runtime/xdg/runtime"
  export XDG_CURRENT_DESKTOP=Openbox
  export DESKTOP_SESSION=openbox
  exec dbus-run-session -- "$0" session
fi

app_pid=
openbox_pid=
xvfb_pid=
cleanup() {
  set +e
  [[ -z $app_pid ]] || kill -TERM "$app_pid" 2>/dev/null
  [[ -z $openbox_pid ]] || kill -TERM "$openbox_pid" 2>/dev/null
  [[ -z $xvfb_pid ]] || kill -TERM "$xvfb_pid" 2>/dev/null
  wait "$app_pid" "$openbox_pid" "$xvfb_pid" 2>/dev/null
}
trap cleanup EXIT

test ! -e "/tmp/.X11-unix/X${display#:}"
if curl -fsS http://127.0.0.1:9333/json/version >/dev/null 2>&1; then
  printf 'debugger port 9333 is already in use\n' >&2
  exit 1
fi
Xvfb "$display" -screen 0 1440x900x24 -nolisten tcp -noreset -ac > "$runtime/xvfb.log" 2>&1 &
xvfb_pid=$!
for _ in {1..100}; do
  DISPLAY=$display xdpyinfo >/dev/null 2>&1 && break
  kill -0 "$xvfb_pid"
  sleep 0.1
done

DISPLAY=$display openbox --sm-disable > "$runtime/openbox.log" 2>&1 &
openbox_pid=$!
for _ in {1..100}; do
  DISPLAY=$display wmctrl -m >/dev/null 2>&1 && break
  kill -0 "$openbox_pid"
  sleep 0.1
done
DISPLAY=$display wmctrl -m >/dev/null

(
  cd "$HOME"
  exec env \
    -u GH_TOKEN \
    -u GITHUB_TOKEN \
    -u OPENCODE_CONFIG_DIR \
    -u OPENCODE_DB \
    -u OPENCODE_TEST_HOME \
    ELECTRON_ENABLE_LOGGING=1 \
    DISPLAY="$display" \
    "$executable" \
    --remote-debugging-address=127.0.0.1 \
    --remote-debugging-port=9333 \
    "opencode-classic://open-project?directory=$runtime/project"
) > "$runtime/app.stdout.log" 2> "$runtime/app.stderr.log" &
app_pid=$!

for _ in {1..240}; do
  kill -0 "$app_pid"
  if curl -fsS http://127.0.0.1:9333/json/version > "$runtime/cdp.json" 2>/dev/null; then
    break
  fi
  sleep 0.25
done
test -s "$runtime/cdp.json"

DISPLAY=$display "$executable" \
  "opencode-classic://open-project?directory=$runtime/project" \
  > "$runtime/deep-link.log" 2>&1

DISPLAY=$display \
  CI_CDP_ENDPOINT=http://127.0.0.1:9333 \
  CI_RUNTIME_DIR="$runtime" \
  node "$root/script/ci-linux-visual.mjs"

classic="$XDG_CONFIG_HOME/io.github.logiclyra.opencodeclassic"
for directory in config data cache state tmp; do
  test -d "$classic/sidecar/$directory"
done
for path in \
  "$XDG_CONFIG_HOME/opencode" \
  "$XDG_DATA_HOME/opencode" \
  "$XDG_CACHE_HOME/opencode" \
  "$XDG_STATE_HOME/opencode"; do
  test ! -e "$path"
done

kill -TERM "$app_pid"
wait "$app_pid"
app_pid=
if pgrep -f -- "$executable" > "$runtime/residual-processes.txt"; then
  printf 'residual application process\n' >&2
  exit 1
fi
if ss -lntp | grep -Eq '127\.0\.0\.1:9333'; then
  printf 'residual debugger listener\n' >&2
  exit 1
fi
kill -TERM "$openbox_pid" "$xvfb_pid"
wait "$openbox_pid" "$xvfb_pid" 2>/dev/null || true
openbox_pid=
xvfb_pid=
(cd "$runtime" && sha256sum visual.png visual-report.json > visual.sha256)
if [[ $runtime != "$archive" ]]; then cp -a -- "$runtime" "$archive"; fi
