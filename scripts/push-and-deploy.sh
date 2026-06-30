#!/usr/bin/env bash
# Push to GitHub, build locally, deploy to Hostinger (no GitHub runner needed).
# Usage: ./scripts/push-and-deploy.sh [web|admin|api|all]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TARGET="${1:-all}"

git push origin main

case "$TARGET" in
  all) APPS=(web admin api) ;;
  web|admin|api) APPS=("$TARGET") ;;
  *) echo "usage: $0 [web|admin|api|all]" >&2; exit 1 ;;
esac

./scripts/build-for-hostinger.sh
for app in "${APPS[@]}"; do
  ./scripts/deploy-hostinger.sh "$app"
done

echo "Done — deployed: ${APPS[*]}"
