#!/usr/bin/env bash
# Deploy dist/{web,admin,api}/ to Hostinger over SSH using rsync.
#
# Configure once via env vars (or .env.deploy at repo root):
#   HOSTINGER_HOST=ssh.hostinger.com
#   HOSTINGER_USER=u123456789
#   HOSTINGER_PORT=65002
#   HOSTINGER_WEB_DIR=domains/yourdomain.com/public_html
#   HOSTINGER_ADMIN_DIR=domains/admin.yourdomain.com/public_html
#   HOSTINGER_API_DIR=domains/api.yourdomain.com/public_html
#
# Usage:
#   ./scripts/deploy-hostinger.sh           # deploy all three
#   ./scripts/deploy-hostinger.sh web       # web only
#   ./scripts/deploy-hostinger.sh api admin # subset
#
# Safety: pass --check to do a dry run first.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Load .env.deploy if present so secrets don't have to live in shell history.
if [ -f .env.deploy ]; then
  set -a; . ./.env.deploy; set +a
fi

C_OK=$'\033[32m'; C_INFO=$'\033[36m'; C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_RESET=$'\033[0m'
log()  { printf '%s==>%s %s\n' "$C_INFO" "$C_RESET" "$*"; }
warn() { printf '%s!%s %s\n' "$C_WARN" "$C_RESET" "$*"; }
die()  { printf '%s✗%s %s\n' "$C_ERR" "$C_RESET" "$*" >&2; exit 1; }

require() { [ -n "${!1:-}" ] || die "missing env var: $1 (set it or define in .env.deploy)"; }
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

[ -d dist ] || die "dist/ missing — run scripts/build-for-hostinger.sh first"

# Optional deploy key (self-hosted runner on your Mac uses ~/.ssh/id_ed25519_hostinger).
SSH_KEY="${HOSTINGER_SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_hostinger}"
SSH_KEY="${SSH_KEY/#\~/$HOME}"
SSH_OPTS="-p $HOSTINGER_PORT -o StrictHostKeyChecking=accept-new"
if [ -f "$SSH_KEY" ]; then
  SSH_OPTS="$SSH_OPTS -i $SSH_KEY"
fi
RSYNC_OPTS="-az --delete --human-readable $DRY"

deploy_one() {
  local app="$1" target_dir=""
  case "$app" in
    web)   target_dir="${HOSTINGER_WEB_DIR:-}" ;;
    admin) target_dir="${HOSTINGER_ADMIN_DIR:-}" ;;
    api)   target_dir="${HOSTINGER_API_DIR:-}" ;;
  esac
  [ -n "$target_dir" ] || die "set remote dir for $app in .env.deploy"

  local src="dist/$app/"
  [ -d "$src" ] || die "dist/$app/ not built — run scripts/build-for-hostinger.sh"

  log "rsync $src → $HOSTINGER_USER@$HOSTINGER_HOST:$target_dir/"
  # shellcheck disable=SC2086
  rsync $RSYNC_OPTS \
    -e "ssh $SSH_OPTS" \
    "$src" \
    "$HOSTINGER_USER@$HOSTINGER_HOST:$target_dir/"

  if [ -n "$DRY" ]; then return 0; fi

  case "$app" in
    web|admin)
      # Touch the Passenger restart marker so the new bundle is picked up
      # without waiting for an idle timeout.
      ssh $SSH_OPTS "$HOSTINGER_USER@$HOSTINGER_HOST" \
        "mkdir -p '$target_dir/tmp' && touch '$target_dir/tmp/restart.txt'"
      printf '  %s✓%s %s restarted via tmp/restart.txt\n' "$C_OK" "$C_RESET" "$app"
      ;;
    api)
      # Run the Laravel post-deploy steps remotely. Idempotent.
      ssh $SSH_OPTS "$HOSTINGER_USER@$HOSTINGER_HOST" \
        "cd '$target_dir' && \
         php artisan migrate --force && \
         php artisan storage:link || true && \
         php artisan config:cache && \
         php artisan route:cache && \
         php artisan view:cache"
      printf '  %s✓%s api migrated + caches warmed\n' "$C_OK" "$C_RESET"
      ;;
  esac
}

for t in "${TARGETS[@]}"; do
  deploy_one "$t"
done

if [ -n "$DRY" ]; then
  warn "dry-run only — no files transferred. Re-run without --check to deploy."
else
  log "Deploy complete."
fi
