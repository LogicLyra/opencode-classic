#!/usr/bin/env bash

set -Eeuo pipefail
umask 0022

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
mode=${1:-full}
version=${OPENCODE_VERSION:-$(node -p "require('$root/packages/desktop/package.json').version")}
run_id=${CI_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$(git -C "$root" rev-parse --short=10 HEAD)}
evidence=${CI_ARTIFACT_DIR:-$HOME/qa/runs/linux-ci-$run_id}
tmp=${CI_TMPDIR:-/var/tmp/opencode-classic-ci-$run_id}

case "$mode" in
  quick | full | package | all) ;;
  *)
    printf 'usage: %s [quick|full|package|all]\n' "$0" >&2
    exit 2
    ;;
esac

install -d -m 0700 "$evidence" "$tmp"
export PATH="$HOME/.local/bin:$PATH"
export NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=4096}
export ASTRO_TELEMETRY_DISABLED=1
export TMPDIR="$tmp"

summary="$evidence/summary.txt"
baseline="$evidence/git-status-before.txt"
git -C "$root" status --porcelain=v1 > "$baseline"

failed=
current=
finish() {
  local code=$?
  if (( code != 0 )); then
    failed=${current:-unknown}
    printf 'result=FAIL\nstage=%s\nexit_code=%s\n' "$failed" "$code" >> "$summary"
  fi
}
trap finish EXIT

run() {
  current=$1
  shift
  printf 'stage=%s status=START time=%s\n' "$current" "$(date -u +%FT%TZ)" | tee -a "$summary"
  "$@" 2>&1 | tee "$evidence/$current.log"
  printf 'stage=%s status=PASS time=%s\n' "$current" "$(date -u +%FT%TZ)" | tee -a "$summary"
}

environment() {
  printf 'run_id=%s\nmode=%s\nroot=%s\nevidence=%s\ntmp=%s\nversion=%s\n' \
    "$run_id" "$mode" "$root" "$evidence" "$tmp" "$version"
  uname -a
  bun --version
  node --version
  git -C "$root" rev-parse HEAD
  free -h
  df -h "$root" "$tmp"
}

static_checks() {
  git -C "$root" diff --check
  actionlint -color=false -shellcheck shellcheck \
    "$root/.github/workflows/release-classic.yml" \
    "$root/.github/workflows/publish-classic.yml"
  bash -n "$root/install" "$root/script/ci-linux.sh" "$root/script/ci-linux-runtime.sh"
  shellcheck --severity=error "$root/install" "$root/script/ci-linux.sh" "$root/script/ci-linux-runtime.sh"
}

dependencies() {
  (
    cd "$root"
    bun install --frozen-lockfile
    bun audit --audit-level=high
  )
}

focused() {
  (
    cd "$root/packages/desktop"
    bun test \
      electron-builder.config.test.ts \
      src/main/apps.test.ts \
      src/main/renderer-security.test.ts \
      src/main/sidecar-env.test.ts \
      src/main/store-name.test.ts \
      src/renderer/html.test.ts
  )
  (
    cd "$root/packages/opencode"
    bun test test/installation/installation.test.ts --timeout 30000
  )
}

typecheck() {
  (
    cd "$root"
    bun turbo typecheck --concurrency=1
  )
}

lint() {
  (
    cd "$root"
    bun run lint
  )
}

broad_tests() {
  local packages=(
    app
    client
    codemode
    core
    effect-drizzle-sqlite
    http-recorder
    httpapi-codegen
    llm
    opencode
    sdk/js
    sdk-next
    session-ui
    tui
    ui
  )
  export CI=1
  export GITHUB_ACTIONS=false
  for package in "${packages[@]}"; do
    (
      cd "$root/packages/$package"
      bun run test
    )
  done
  (
    cd "$root/packages/desktop"
    bun test
  )
  (
    cd "$root/packages/opencode"
    bun run script/httpapi-exercise.ts --mode coverage --fail-on-missing --fail-on-skip
    bun run script/httpapi-exercise.ts --mode auth --fail-on-missing --fail-on-skip
    timeout --signal=TERM --kill-after=30s 30m \
      bun run script/httpapi-exercise.ts --mode effect --progress --fail-on-missing --fail-on-skip
  )
  (
    cd "$root/packages/client"
    bun run check:generated
  )
}

builds() {
  (
    cd "$root/packages/app"
    bun run build
  )
  (
    cd "$root/packages/opencode"
    env -u OPENCODE_RELEASE -u GH_TOKEN -u GITHUB_TOKEN OPENCODE_VERSION="$version" bun run build
  )
  for package in console/app stats/app web storybook; do
    (
      cd "$root/packages/$package"
      bun run build
    )
  done
}

desktop_build() {
  (
    cd "$root/packages/desktop"
    OPENCODE_CHANNEL=prod OPENCODE_VERSION="$version" RUST_TARGET=x86_64-unknown-linux-gnu \
      bun ./scripts/prepare.ts
    OPENCODE_CHANNEL=prod OPENCODE_VERSION="$version" bun run build
  )
}

package_linux() {
  local dist="$root/packages/desktop/dist"
  (
    cd "$root/packages/desktop"
    TMPDIR="$tmp" OPENCODE_CHANNEL=prod \
      bun x electron-builder --linux --x64 --publish never --config electron-builder.config.ts
  )
  test -f "$dist/opencode-classic-desktop-linux-amd64.deb"
  test -f "$dist/opencode-classic-desktop-linux-x86_64.rpm"
  test -f "$dist/latest-linux.yml"
  test -f "$dist/linux-unpacked/resources/app-update.yml"
  test -f "$dist/linux-unpacked/resources/icons/icon.png"
  if compgen -G "$dist/*.AppImage" >/dev/null; then
    printf 'unexpected AppImage artifact\n' >&2
    return 1
  fi
  VERSION="$version" DIST="$dist" bun -e '
    const metadata = await Bun.file(`${process.env.DIST}/latest-linux.yml`).text()
    for (const value of [`version: ${process.env.VERSION}`, ".deb", ".rpm"]) {
      if (!metadata.includes(value)) throw new Error(`missing updater metadata: ${value}`)
    }
    if (metadata.toLowerCase().includes("appimage")) throw new Error("AppImage metadata found")
    const provider = await Bun.file(`${process.env.DIST}/linux-unpacked/resources/app-update.yml`).text()
    for (const value of ["owner: LogicLyra", "repo: opencode-classic", "updaterCacheDirName: opencode-classic-desktop-updater"]) {
      if (!provider.includes(value)) throw new Error(`missing provider metadata: ${value}`)
    }
  '
  sha256sum "$dist"/*.deb "$dist"/*.rpm "$dist/latest-linux.yml" > "$evidence/linux-packages.sha256"
  dpkg-deb -f "$dist/opencode-classic-desktop-linux-amd64.deb" \
    Package Version Architecture Maintainer Homepage > "$evidence/deb-fields.txt"
  install -d -m 0700 "$tmp/rpmdb"
  rpm --dbpath "$tmp/rpmdb" -qip "$dist/opencode-classic-desktop-linux-x86_64.rpm" \
    > "$evidence/rpm-info.txt"
}

run environment environment
run static static_checks
run dependencies dependencies
run focused focused

if [[ $mode != quick ]]; then
  run typecheck typecheck
  run lint lint
  run broad-tests broad_tests
  run builds builds
fi

if [[ $mode == package || $mode == all ]]; then
  run desktop-build desktop_build
  run package-linux package_linux
fi

if [[ $mode == all ]]; then
  run runtime-visual env CI_ARTIFACT_DIR="$evidence" CI_RUNTIME_DIR="$tmp/runtime" "$root/script/ci-linux-runtime.sh"
fi

git -C "$root" status --porcelain=v1 > "$evidence/git-status-after.txt"
cmp "$baseline" "$evidence/git-status-after.txt"
sha256sum "$evidence"/*.log "$evidence"/*.txt > "$evidence/evidence.sha256"
if [[ -z ${CI_TMPDIR:-} ]]; then rm -rf -- "$tmp"; fi
printf 'result=PASS\n' | tee -a "$summary"
trap - EXIT
