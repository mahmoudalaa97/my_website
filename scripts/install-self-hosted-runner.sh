#!/usr/bin/env bash
# Register this Mac as a GitHub Actions self-hosted runner for Hostinger deploys.
# Hostinger blocks SSH from GitHub cloud IPs — the deploy job must run on your network.
#
# Prerequisites: Homebrew, curl
# Usage:
#   1. GitHub → repo → Settings → Actions → Runners → New self-hosted runner → macOS
#   2. Copy the token from that page
#   3. RUNNER_TOKEN=xxxx ./scripts/install-self-hosted-runner.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNNER_DIR="${RUNNER_DIR:-$HOME/actions-runner-my-website}"
REPO="${GITHUB_REPO:-mahmoudalaa97/my_website}"

C_INFO=$'\033[36m'; C_RESET=$'\033[0m'
log() { printf '%s==>%s %s\n' "$C_INFO" "$C_RESET" "$*"; }

[ -n "${RUNNER_TOKEN:-}" ] || {
  echo "Get a token from:"
  echo "  https://github.com/$REPO/settings/actions/runners/new"
  echo "Then run:"
  echo "  RUNNER_TOKEN=your_token ./scripts/install-self-hosted-runner.sh"
  exit 1
}

log "Installing runner to $RUNNER_DIR"
mkdir -p "$RUNNER_DIR" && cd "$RUNNER_DIR"

if [ ! -f ./config.sh ]; then
  ARCH="x64"
  [ "$(uname -m)" = "arm64" ] && ARCH="arm64"
  curl -sL "https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-osx-${ARCH}-2.321.0.tar.gz" | tar xz
fi

./config.sh \
  --url "https://github.com/$REPO" \
  --token "$RUNNER_TOKEN" \
  --name "$(hostname -s)-hostinger" \
  --labels "self-hosted,hostinger,macOS" \
  --unattended \
  --replace

log "Starting runner (Ctrl+C to stop; use ./svc.sh install for background service)"
./run.sh
