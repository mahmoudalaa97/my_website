#!/usr/bin/env bash
# Validates Hostinger deploy credentials and writes ~/.ssh/config (alias: hostinger).
set -euo pipefail

# Strip whitespace and accidental "KEY=value" paste from GitHub secrets UI.
normalize() {
  local raw="$1"
  shift
  raw="$(printf '%s' "$raw" | tr -d '[:space:]')"
  for prefix in "$@"; do
    raw="${raw#${prefix}=}"
  done
  printf '%s' "$raw"
}

require() {
  local name="$1" val="$2"
  if [ -z "$val" ]; then
    echo "::error::$name is empty"
    exit 1
  fi
}

HOSTINGER_SSH_KEY="${HOSTINGER_SSH_KEY:-}"
require "HOSTINGER_SSH_KEY" "$HOSTINGER_SSH_KEY"

HOSTINGER_HOST="$(normalize "${HOSTINGER_SSH_HOST:-${HOSTINGER_HOST:-}}" HOSTINGER_SSH_HOST HOSTINGER_HOST)"
require "HOSTINGER_SSH_HOST" "$HOSTINGER_HOST"

HOSTINGER_USER="$(normalize "${HOSTINGER_SSH_USER:-${HOSTINGER_USER:-}}" HOSTINGER_SSH_USER HOSTINGER_USER)"
require "HOSTINGER_SSH_USER" "$HOSTINGER_USER"

HOSTINGER_PORT="$(normalize "${HOSTINGER_SSH_PORT:-${HOSTINGER_PORT:-}}" HOSTINGER_SSH_PORT HOSTINGER_PORT)"
HOSTINGER_PORT="$(printf '%s' "$HOSTINGER_PORT" | sed 's/[^0-9]//g')"
[ -n "$HOSTINGER_PORT" ] || HOSTINGER_PORT="65002"

case "$HOSTINGER_PORT" in
  *[!0-9]*)
    echo "::error::SSH port must be numeric"
    exit 1
    ;;
esac

echo "SSH target: user_len=${#HOSTINGER_USER} host_len=${#HOSTINGER_HOST} port=${HOSTINGER_PORT}"

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

if ! ssh -F "$HOME/.ssh/config" -o BatchMode=yes -o ConnectTimeout=15 hostinger 'echo ok' >/dev/null 2>&1; then
  echo "::error::SSH preflight failed — verify HOSTINGER_SSH_HOST, HOSTINGER_SSH_USER, HOSTINGER_SSH_KEY"
  exit 1
fi

echo "SSH preflight ok"
