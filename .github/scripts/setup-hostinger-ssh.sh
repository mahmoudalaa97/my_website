#!/usr/bin/env bash
# Validates Hostinger deploy secrets and writes ~/.ssh/config (alias: hostinger).
# Expects: HOSTINGER_SSH_KEY, HOSTINGER_HOST, HOSTINGER_USER, HOSTINGER_PORT
# Optional: HOSTINGER_KNOWN_HOSTS
set -euo pipefail

require() {
  local name="$1" val="${!1:-}"
  if [ -z "$val" ]; then
    echo "::error::$name is empty — set the matching GitHub secret"
    exit 1
  fi
}

require HOSTINGER_SSH_KEY
require HOSTINGER_HOST
require HOSTINGER_USER
require HOSTINGER_PORT

# Trim whitespace/newlines (common when secrets are pasted).
HOSTINGER_PORT="$(printf '%s' "$HOSTINGER_PORT" | tr -d '[:space:]')"

case "$HOSTINGER_PORT" in
  ''|*[!0-9]*)
    echo "::error::HOSTINGER_PORT must be numeric (got: '${HOSTINGER_PORT}')"
    exit 1
    ;;
esac

mkdir -p ~/.ssh
chmod 700 ~/.ssh
printf '%s\n' "$HOSTINGER_SSH_KEY" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519

cat > ~/.ssh/config <<EOF
Host hostinger
  HostName ${HOSTINGER_HOST}
  User ${HOSTINGER_USER}
  Port ${HOSTINGER_PORT}
  IdentityFile ~/.ssh/id_ed25519
  StrictHostKeyChecking accept-new
EOF
chmod 600 ~/.ssh/config

if [ -n "${HOSTINGER_KNOWN_HOSTS:-}" ]; then
  printf '%s\n' "$HOSTINGER_KNOWN_HOSTS" > ~/.ssh/known_hosts
else
  ssh-keyscan -p "$HOSTINGER_PORT" -H "$HOSTINGER_HOST" >> ~/.ssh/known_hosts 2>/dev/null || true
fi
chmod 600 ~/.ssh/known_hosts

echo "SSH configured for hostinger (${HOSTINGER_USER}@${HOSTINGER_HOST}:${HOSTINGER_PORT})"
