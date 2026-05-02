#!/usr/bin/env bash
# Local dev runner — starts web, admin, and PHP API together.
# Usage: ./dev.sh           # runs all
#        ./dev.sh web       # web only
#        ./dev.sh admin api # admin + api

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

WEB_PORT="${WEB_PORT:-3002}"
ADMIN_PORT="${ADMIN_PORT:-3000}"
API_PORT="${API_PORT:-8000}"

C_RESET=$'\033[0m'
C_WEB=$'\033[36m'   # cyan
C_ADMIN=$'\033[35m' # magenta
C_API=$'\033[33m'   # yellow
C_ERR=$'\033[31m'

pids=()

prefix() {
  local name="$1" color="$2"
  while IFS= read -r line; do
    printf '%s[%s]%s %s\n' "$color" "$name" "$C_RESET" "$line"
  done
}

require() {
  command -v "$1" >/dev/null 2>&1 || {
    printf '%s[err]%s missing required command: %s\n' "$C_ERR" "$C_RESET" "$1" >&2
    exit 1
  }
}

resolve_php() {
  if [ -n "${PHP_BIN:-}" ] && [ -x "$PHP_BIN" ]; then
    return 0
  fi
  # composer.json in apps/api-php requires PHP >= 8.4, so prefer 8.4-named binaries.
  local candidates=(
    "$HOME/Library/Application Support/Herd/bin/php84"
    "/opt/homebrew/bin/php84"
    "/opt/homebrew/opt/php@8.4/bin/php"
    "/usr/local/opt/php@8.4/bin/php"
  )
  local c
  for c in "${candidates[@]}"; do
    if [ -x "$c" ]; then
      PHP_BIN="$c"; return 0
    fi
  done
  # Fall back to whichever php is on PATH (may fail platform_check if < 8.4).
  if command -v php >/dev/null 2>&1; then
    PHP_BIN="php"; return 0
  fi
  return 1
}

start_web() {
  ( pnpm --filter @repo/web dev --port "$WEB_PORT" 2>&1 | prefix "web  :$WEB_PORT" "$C_WEB" ) &
  pids+=($!)
}

start_admin() {
  ( pnpm --filter @repo/admin dev --port "$ADMIN_PORT" 2>&1 | prefix "admin:$ADMIN_PORT" "$C_ADMIN" ) &
  pids+=($!)
}

start_api() {
  if ! resolve_php; then
    printf '%s[api]%s php not found — skipping. Install via Herd or brew, or set PHP_BIN env var.\n' "$C_ERR" "$C_RESET"
    return
  fi
  if [ ! -f "apps/api-php/.env" ] && [ -f "apps/api-php/.env.example" ]; then
    cp apps/api-php/.env.example apps/api-php/.env
    ( cd apps/api-php && "$PHP_BIN" artisan key:generate --ansi >/dev/null 2>&1 || true )
  fi
  ( cd apps/api-php && "$PHP_BIN" artisan serve --host=127.0.0.1 --port="$API_PORT" 2>&1 | prefix "api  :$API_PORT" "$C_API" ) &
  pids+=($!)
}

cleanup() {
  printf '\n%s[dev]%s shutting down...\n' "$C_ERR" "$C_RESET"
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  # also kill grandchildren by process group where possible
  for pid in "${pids[@]}"; do
    pkill -P "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

require pnpm

targets=("$@")
if [ ${#targets[@]} -eq 0 ]; then
  targets=(web admin api)
fi

for t in "${targets[@]}"; do
  case "$t" in
    web)   start_web   ;;
    admin) start_admin ;;
    api)   start_api   ;;
    *)
      printf '%s[err]%s unknown target: %s (use: web, admin, api)\n' "$C_ERR" "$C_RESET" "$t" >&2
      cleanup
      ;;
  esac
done

printf '%s[dev]%s started %d service(s). Ctrl+C to stop.\n' "$C_WEB" "$C_RESET" "${#pids[@]}"
wait
