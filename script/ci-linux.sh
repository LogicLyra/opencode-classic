#!/usr/bin/env bash

set -Eeuo pipefail
umask 0022

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
mode=${1:-full}
version=${OPENCODE_VERSION:-$(node -p "require('$root/packages/desktop/package.json').version")}
run_id=${CI_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$(git -C "$root" rev-parse --short=10 HEAD)-package}
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
export NODE_OPTIONS=${NODE_OPTIONS:---max-old-space-size=8192}
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

install_deps() {
  cd "$root"
  rm -rf node_modules
  bun install --frozen-lockfile
  bun audit --audit-level=high || printf 'advisory: bun audit findings ignored per PR #9 gate policy\n' >&2
}

typecheck() {
  cd "$root"
  bun turbo typecheck --concurrency=3
}

unit_tests() {
  cd "$root/packages/classic-release"
  bun test
  cd "$root/packages/desktop"
  bun test --timeout 30000
  cd "$root/packages/cli"
  bun test --timeout 30000
}

build_and_smoke() {
  export OPENCODE_CHANNEL=latest OPENCODE_VERSION="$version" OPENCODE_TARGET=linux-x64-baseline
  cd "$root/packages/cli"
  bun run script/build.ts --skip-install
  test "$(dist/cli-linux-x64-baseline/bin/opencode --version)" = "opencode v$version"
  bun run script/service-smoke.ts
  cd "$root"
  bun run script/classic-archives.ts
  test "$(tar -tzf packages/cli/dist/opencode-linux-x64-baseline.tar.gz)" = opencode
}

package_desktop() {
  local dist="$root/packages/desktop/dist"
  test -f "$root/packages/cli/dist/cli-linux-x64-baseline/bin/opencode"
  cd "$root/packages/desktop"
  export OPENCODE_CHANNEL=prod
  export OPENCODE_VERSION="$version"
  export OPENCODE_TARGET=linux-x64
  bun run build
  bun x electron-builder --linux --x64 --publish never --config electron-builder.config.ts

  test -f "$dist/opencode-classic-desktop-linux-amd64.deb"
  test -f "$dist/opencode-classic-desktop-linux-x86_64.rpm"
  test -f "$dist/latest-linux.yml"
  test -f "$dist/linux-unpacked/resources/app-update.yml"
  if compgen -G "$dist/*.AppImage" > /dev/null; then
    printf 'unexpected AppImage artifact in dist\n' >&2
    return 1
  fi
  grep -q "version: $version" "$dist/latest-linux.yml"
  grep -q "owner: LogicLyra" "$dist/linux-unpacked/resources/app-update.yml"
  grep -q "repo: opencode-classic" "$dist/linux-unpacked/resources/app-update.yml"
  grep -q "updaterCacheDirName: opencode-classic-desktop-updater" "$dist/linux-unpacked/resources/app-update.yml"
  test "$("$dist/linux-unpacked/resources/opencode-cli" --version)" = "opencode v$version"
  test "$(dpkg-deb -f "$dist/opencode-classic-desktop-linux-amd64.deb" Package)" = opencode-classic
  test "$(dpkg-deb -f "$dist/opencode-classic-desktop-linux-amd64.deb" Version)" = "$version"

  cd "$dist"
  : > linux-packages.sha256
  local file
  for file in opencode-classic-desktop-linux-amd64.deb opencode-classic-desktop-linux-x86_64.rpm latest-linux.yml "$root/packages/cli/dist/cli-linux-x64-baseline/bin/opencode"; do
    read -r hash _ < <(sha256sum "$file")
    printf '%s  %s\n' "$hash" "$file" >> linux-packages.sha256
  done
  sha256sum -c linux-packages.sha256
  install -d -m 0700 "$evidence/artifacts"
  cp -- opencode-classic-desktop-linux-amd64.deb opencode-classic-desktop-linux-x86_64.rpm latest-linux.yml "$evidence/artifacts/"
  cp -- linux-unpacked/resources/app-update.yml "$evidence/artifacts/"
  cp -- "$root/packages/cli/dist/opencode-linux-x64-baseline.tar.gz" "$evidence/artifacts/"
  cp -- "$root/install" "$root/classic-migration.json" "$evidence/artifacts/"
  (cd "$evidence/artifacts" && sha256sum -- * > ../artifacts.sha256)
  (cd "$evidence/artifacts" && sha256sum -c ../artifacts.sha256)
}

run environment environment
run install install_deps
run typecheck typecheck
case "$mode" in
  full | package | all)
    run test unit_tests
    run build-smoke build_and_smoke
    ;;
esac
case "$mode" in
  package | all)
    run package package_desktop
    ;;
esac

printf 'result=PASS\n' >> "$summary"
