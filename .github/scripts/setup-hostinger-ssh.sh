#!/usr/bin/env bash
# Validates Hostinger deploy secrets and writes ~/.ssh/config (alias: hostinger).
#
# Required env:
#   HOSTINGER_SSH_KEY, HOSTINGER_HOST, HOSTINGER_USER
# Port (first non-empty wins, default 65002):
#   HOSTINGER_SSH_PORT  — GitHub repo variable (preferred)
#   HOSTINGER_PORT      — legacy secret fallback
# Optional:
#   HOSTINGER_KNOWN_HOSTS
set -euo pipefail

require() {
  local name="$1" val="${!1:-}"
  if [ -z "$val" ]; then
    echo "::error::$name is empty — set the matching GitHub secret"
    exit 1
  fi
}

normalize_port() {
  local raw="$1"
  raw="$(printf '%s' "$raw" | tr -d '[:space:]')"
  raw="${raw#HOSTINGER_PORT=}"
  raw="${raw#HOSTINGER_SSH_PORT=}"
  # Keep digits only (handles pasted lines like "Port: 65002").
  raw="$(printf '%s' "$raw" | sed 's/[^0-9]//g')"
  printf '%s' "$raw"
}

require HOSTINGER_SSH_KEY
require HOSTINGER_HOST
require HOSTINGER_USER

HOSTINGER_PORT="$(normalize_port "${HOSTINGER_SSH_PORT:-}${HOSTINGER_PORT:-}")"
if [ -z "$HOSTINGER_PORT" ]; then
  HOSTINGER_PORT="65002"
  echo "HOSTINGER_SSH_PORT not set — using default 65002"
fi

case "$HOSTINGER_PORT" in
  *[!0-9]*)
    echo "::error::HOSTINGER_SSH_PORT must be numeric (length ${#HOSTINGER_PORT})"
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
