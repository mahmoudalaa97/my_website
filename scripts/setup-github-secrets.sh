#!/usr/bin/env bash
# Provision the GitHub repo secrets + variables that the deploy workflows need.
# Reads values from .env.deploy (gitignored) so they don't end up in shell
# history. Uses `gh` CLI and writes the secrets via `gh secret set`.
#
# Usage:
#   ./scripts/setup-github-secrets.sh             # interactive — confirms each
#   ./scripts/setup-github-secrets.sh --yes       # non-interactive
#   ./scripts/setup-github-secrets.sh --dry-run   # show what would happen

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

C_OK=$'\033[32m'; C_INFO=$'\033[36m'; C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_DIM=$'\033[2m'; C_RESET=$'\033[0m'
log()  { printf '%s==>%s %s\n' "$C_INFO" "$C_RESET" "$*"; }
ok()   { printf '  %s✓%s %s\n' "$C_OK" "$C_RESET" "$*"; }
warn() { printf '  %s!%s %s\n' "$C_WARN" "$C_RESET" "$*"; }
die()  { printf '%s✗%s %s\n' "$C_ERR" "$C_RESET" "$*" >&2; exit 1; }

YES=""; DRY=""
for arg in "$@"; do
  case "$arg" in
    --yes|-y) YES=1 ;;
    --dry-run|-n) DRY=1 ;;
    *) die "unknown arg: $arg" ;;
  esac
done

command -v gh >/dev/null || die "gh CLI is required (https://cli.github.com)"
gh auth status -h github.com >/dev/null 2>&1 || die "gh is not authenticated — run: gh auth login"

# Resolve current repo (assumes cwd is a clone with a github remote).
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
[ -n "$REPO" ] || die "could not detect GitHub repo (gh repo view failed). Run inside a cloned repo or set: gh repo set-default OWNER/NAME"
log "target repo: $REPO"

# Source .env.deploy for the deploy targets and SSH host info.
if [ -f .env.deploy ]; then
  set -a; . ./.env.deploy; set +a
else
  warn ".env.deploy not found — you'll be prompted for each value"
fi

# Helper: ask the user for a missing value (or use the env var if set).
prompt() {
  local name="$1" default="${!1:-}" hidden="${2:-}"
  if [ -z "$default" ]; then
    if [ -n "$YES" ]; then die "missing required value: $name (set in .env.deploy or remove --yes)"; fi
    if [ -n "$hidden" ]; then
      read -r -s -p "  $name: " val; echo
    else
      read -r -p "  $name: " val
    fi
    eval "$name=\$val"
  fi
}

# Helper: read a file and pass it to gh as a secret value.
prompt_file() {
  local name="$1" path="${!1:-}"
  if [ -z "$path" ]; then
    if [ -n "$YES" ]; then die "missing required file path: $name (set in .env.deploy)"; fi
    read -r -p "  $name (file path): " path
    eval "$name=\$path"
  fi
  [ -f "$path" ] || die "$name: file does not exist: $path"
}

# ---- collect required values ----
log "collecting values (press enter to use the value from .env.deploy)"
prompt HOSTINGER_HOST
prompt HOSTINGER_USER
prompt HOSTINGER_PORT
prompt HOSTINGER_WEB_DIR
prompt HOSTINGER_ADMIN_DIR
prompt HOSTINGER_API_DIR

# SSH key — path on disk (default ~/.ssh/id_ed25519_hostinger if it exists).
SSH_KEY_PATH="${HOSTINGER_SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_hostinger}"
if [ ! -f "$SSH_KEY_PATH" ]; then
  warn "default key path $SSH_KEY_PATH not found"
  prompt HOSTINGER_SSH_KEY_PATH
  SSH_KEY_PATH="$HOSTINGER_SSH_KEY_PATH"
fi
[ -f "$SSH_KEY_PATH" ] || die "SSH key file not found: $SSH_KEY_PATH"

# Optional: pinned known_hosts entry. If absent, ssh-keyscan in CI will TOFU
# the host on first run, which is fine but not as safe.
KNOWN_HOSTS=""
if [ -z "${HOSTINGER_KNOWN_HOSTS:-}" ]; then
  log "fetching host key for $HOSTINGER_HOST:$HOSTINGER_PORT (used as a known_hosts pin)"
  KNOWN_HOSTS="$(ssh-keyscan -p "$HOSTINGER_PORT" -H "$HOSTINGER_HOST" 2>/dev/null || true)"
  [ -n "$KNOWN_HOSTS" ] || warn "ssh-keyscan returned nothing — workflows will fall back to TOFU"
else
  KNOWN_HOSTS="$HOSTINGER_KNOWN_HOSTS"
fi

# ---- optional: public-facing URLs for health checks ----
log "(optional) health-check URLs — leave blank to skip"
[ -n "$YES" ] || {
  : "${API_HEALTH_URL:=}"
  : "${WEB_HEALTH_URL:=}"
  : "${ADMIN_HEALTH_URL:=}"
  read -r -p "  API_HEALTH_URL [${API_HEALTH_URL:-https://api.yourdomain.com/api/health}]: " v; API_HEALTH_URL="${v:-${API_HEALTH_URL:-}}"
  read -r -p "  WEB_HEALTH_URL [${WEB_HEALTH_URL:-https://yourdomain.com}]: " v; WEB_HEALTH_URL="${v:-${WEB_HEALTH_URL:-}}"
  read -r -p "  ADMIN_HEALTH_URL [${ADMIN_HEALTH_URL:-https://admin.yourdomain.com}]: " v; ADMIN_HEALTH_URL="${v:-${ADMIN_HEALTH_URL:-}}"
}

# ---- write secrets ----
write_secret() {
  local name="$1" value="$2"
  if [ -z "$value" ]; then warn "  $name → skipped (empty)"; return 0; fi
  if [ -n "$DRY" ]; then ok "DRY: would set secret $name (${#value} chars)"; return 0; fi
  printf '%s' "$value" | gh secret set "$name" --repo "$REPO" --body - >/dev/null
  ok "set secret: $name"
}

write_var() {
  local name="$1" value="$2"
  if [ -z "$value" ]; then warn "  $name → skipped (empty)"; return 0; fi
  if [ -n "$DRY" ]; then ok "DRY: would set variable $name = $value"; return 0; fi
  gh variable set "$name" --repo "$REPO" --body "$value" >/dev/null
  ok "set variable: $name"
}

normalize_field() {
  local raw="$1" prefix="$2"
  raw="$(printf '%s' "$raw" | tr -d '[:space:]')"
  raw="${raw#${prefix}=}"
  printf '%s' "$raw"
}

log "writing repository secrets and variables to $REPO"
write_secret HOSTINGER_SSH_KEY    "$(cat "$SSH_KEY_PATH")"
write_secret HOSTINGER_KNOWN_HOSTS "$KNOWN_HOSTS"
write_secret HOSTINGER_WEB_DIR    "$(normalize_field "$HOSTINGER_WEB_DIR" HOSTINGER_WEB_DIR)"
write_secret HOSTINGER_ADMIN_DIR  "$(normalize_field "$HOSTINGER_ADMIN_DIR" HOSTINGER_ADMIN_DIR)"
write_secret HOSTINGER_API_DIR    "$(normalize_field "$HOSTINGER_API_DIR" HOSTINGER_API_DIR)"
write_secret API_HEALTH_URL       "${API_HEALTH_URL:-}"
write_secret WEB_HEALTH_URL       "${WEB_HEALTH_URL:-}"
write_secret ADMIN_HEALTH_URL     "${ADMIN_HEALTH_URL:-}"

# Non-sensitive connection details — repo variables (visible, easy to fix in UI).
write_var HOSTINGER_SSH_HOST      "$(normalize_field "$HOSTINGER_HOST" HOSTINGER_HOST)"
write_var HOSTINGER_SSH_USER      "$(normalize_field "$HOSTINGER_USER" HOSTINGER_USER)"
write_var HOSTINGER_SSH_PORT      "$(normalize_field "${HOSTINGER_PORT:-65002}" HOSTINGER_PORT | sed 's/[^0-9]//g')"
write_var HOSTINGER_SSH_KEY_PATH  "${HOSTINGER_SSH_KEY_PATH:-$HOME/.ssh/id_ed25519_hostinger}"
write_var NEXT_PUBLIC_API_URL     "${NEXT_PUBLIC_API_URL:-https://api.yourdomain.com/api}"

log "done"
[ -n "$DRY" ] && warn "dry-run only — nothing was actually written"
printf '%s\n' "
${C_DIM}Trigger a deploy:
  Push to main with changes under apps/api-php/        → deploy-api workflow
  Push to main with changes under apps/admin/          → deploy-admin workflow
  Push to main with changes under apps/web/            → deploy-web workflow
  Or manually:  gh workflow run deploy-api.yml
                gh workflow run deploy-admin.yml
                gh workflow run deploy-web.yml${C_RESET}
"
