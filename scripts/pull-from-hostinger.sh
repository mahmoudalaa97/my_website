#!/usr/bin/env bash
# Pull existing files FROM Hostinger TO local backup (reverse of deploy-hostinger.sh).
# Does NOT delete anything on the server — read-only rsync.
#
# Usage:
#   ./scripts/pull-from-hostinger.sh           # pull web + admin + api
#   ./scripts/pull-from-hostinger.sh api        # one app
#   ./scripts/pull-from-hostinger.sh --check    # dry run

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ -f .env.deploy ]; then
  set -a; . ./.env.deploy; set +a
fi

C_OK=$'\033[32m'; C_INFO=$'\033[36m'; C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_RESET=$'\033[0m'
log()  { printf '%s==>%s %s\n' "$C_INFO" "$C_RESET" "$*"; }
warn() { printf '%s!%s %s\n' "$C_WARN" "$C_RESET" "$*"; }
die()  { printf '%s✗%s %s\n' "$C_ERR" "$C_RESET" "$*" >&2; exit 1; }

require() { [ -n "${!1:-}" ] || die "missing env var: $1 (set in .env.deploy)"; }
require HOSTINGER_HOST
require HOSTINGER_USER
require HOSTINGER_PORT

DRY=""
TARGETS=()
for arg in "$@"; do
  case "$arg" in
    --check|-n) DRY="--dry-run -v" ;;
    web|admin|api) TARGETS+=("$arg") ;;
    *) die "unknown arg: $arg (use: web|admin|api or --check)" ;;
  esac
done
[ ${#TARGETS[@]} -eq 0 ] && TARGETS=(web admin api)

SSH_KEY="${HOSTINGER_SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_hostinger}"
SSH_KEY="${SSH_KEY/#\~/$HOME}"
[ -f "$SSH_KEY" ] || die "SSH key not found: $SSH_KEY"

BACKUP_ROOT="$ROOT/server-pull"
mkdir -p "$BACKUP_ROOT"

SSH_OPTS="-p $HOSTINGER_PORT -i $SSH_KEY -o StrictHostKeyChecking=accept-new"
RSYNC_OPTS="-az --human-readable $DRY"

pull_one() {
  local app="$1" target_dir=""
  case "$app" in
    web)   target_dir="${HOSTINGER_WEB_DIR:-}" ;;
    admin) target_dir="${HOSTINGER_ADMIN_DIR:-}" ;;
    api)   target_dir="${HOSTINGER_API_DIR:-}" ;;
  esac
  [ -n "$target_dir" ] || die "set remote dir for $app in .env.deploy"

  local dest="$BACKUP_ROOT/$app/"
  mkdir -p "$dest"

  log "pull $HOSTINGER_USER@$HOSTINGER_HOST:$target_dir/ → $dest"
  # shellcheck disable=SC2086
  rsync $RSYNC_OPTS \
    -e "ssh $SSH_OPTS" \
    "$HOSTINGER_USER@$HOSTINGER_HOST:$target_dir/" \
    "$dest"

  if [ -z "$DRY" ]; then
    printf '  %s✓%s %s saved to server-pull/%s/\n' "$C_OK" "$C_RESET" "$app" "$app"
  fi
}

for t in "${TARGETS[@]}"; do
  pull_one "$t"
done

if [ -n "$DRY" ]; then
  warn "dry-run only — no files downloaded."
else
  log "Pull complete → $BACKUP_ROOT/"
  du -sh "$BACKUP_ROOT"/* 2>/dev/null || true
fi
