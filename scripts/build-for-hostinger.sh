#!/usr/bin/env bash
# Build all three apps and assemble Hostinger-ready artifacts under dist/.
#   dist/web/   — self-contained Next.js standalone bundle for the public site
#   dist/admin/ — self-contained Next.js standalone bundle for the dashboard
#   dist/api/   — Laravel app with vendor/ pre-installed for production
#
# After this runs, upload each subdirectory to its corresponding subdomain
# folder on Hostinger (see docs/HOSTINGER.md), or run scripts/deploy-hostinger.sh.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
DIST="$ROOT/dist"

C_OK=$'\033[32m'; C_INFO=$'\033[36m'; C_ERR=$'\033[31m'; C_DIM=$'\033[2m'; C_RESET=$'\033[0m'
log()  { printf '%s==>%s %s\n' "$C_INFO" "$C_RESET" "$*"; }
ok()   { printf '  %s✓%s %s\n' "$C_OK" "$C_RESET" "$*"; }
die()  { printf '%s✗%s %s\n' "$C_ERR" "$C_RESET" "$*" >&2; exit 1; }

# ---- preflight ----
command -v pnpm >/dev/null  || die "pnpm is required"
command -v node >/dev/null  || die "node is required"
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 20 ] || die "Node 20+ required (got $NODE_MAJOR). Hostinger ships 20+; build with the same."

PHP_BIN=""
# Prefer 8.4-named binaries since Laravel requires PHP >= 8.4.
for cand in "$HOME/Library/Application Support/Herd/bin/php84" /opt/homebrew/bin/php84 /opt/homebrew/opt/php@8.4/bin/php /usr/local/opt/php@8.4/bin/php php; do
  resolved="$(command -v "$cand" 2>/dev/null || true)"
  if [ -n "$resolved" ] && [ -x "$resolved" ]; then PHP_BIN="$resolved"; break; fi
  if [ -x "$cand" ]; then PHP_BIN="$cand"; break; fi
done
[ -n "$PHP_BIN" ] || die "php not found (need 8.4+ for the Laravel build)"
PHP_VER="$("$PHP_BIN" -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
case "$PHP_VER" in
  8.4|8.5|8.6|8.7|8.8|8.9|9.*) ;;
  *) die "found PHP $PHP_VER at $PHP_BIN — Laravel requires 8.4+" ;;
esac
log "using PHP $PHP_VER ($PHP_BIN)"

# Composer shells out to `php`. Make sure the same php we picked is first on PATH.
PHP_DIR="$(dirname "$PHP_BIN")"
case ":$PATH:" in
  *":$PHP_DIR:"*) ;;
  *) PATH="$PHP_DIR:$PATH" ;;
esac
export PATH PHP_BINARY="$PHP_BIN"

COMPOSER_BIN="$(command -v composer || true)"
[ -n "$COMPOSER_BIN" ] || die "composer not found"

log "Cleaning dist/"
rm -rf "$DIST"
mkdir -p "$DIST"

# ---- 1) Next.js standalone bundles ----
build_next() {
  local app="$1"               # "web" or "admin"
  local src="apps/$app"
  local out="$DIST/$app"

  log "Building @repo/$app (standalone)…"
  ( cd "$ROOT" && NODE_ENV=production pnpm --filter "@repo/$app" build )

  [ -d "$src/.next/standalone" ] || die "$src/.next/standalone not found — is output:'standalone' set?"

  mkdir -p "$out"

  # The standalone bundle is rooted at the monorepo root because of
  # outputFileTracingRoot. Copy everything inside .next/standalone, then
  # re-anchor server.js by promoting apps/<app>/* to the bundle root.
  cp -R "$src/.next/standalone/." "$out/"

  # Static assets and public/ aren't included in the standalone copy.
  # Standalone server expects them at apps/<app>/.next/static and apps/<app>/public.
  mkdir -p "$out/apps/$app/.next"
  cp -R "$src/.next/static" "$out/apps/$app/.next/static"
  if [ -d "$src/public" ]; then
    cp -R "$src/public" "$out/apps/$app/public"
  fi

  # Drop a top-level server.js shim so Hostinger's "Application Startup File"
  # = server.js works regardless of monorepo layout.
  cat > "$out/server.js" <<JS
// Hostinger entry — boots the standalone Next server in apps/$app.
require('./apps/$app/server.js');
JS

  # Minimal package.json for Passenger (declares Node engine).
  cat > "$out/package.json" <<JSON
{
  "name": "$app-hostinger",
  "private": true,
  "version": "1.0.0",
  "scripts": { "start": "node server.js" },
  "engines": { "node": ">=20" }
}
JSON

  # Hostinger Passenger reads PORT from env; standalone server respects it.
  ok "$app → $out ($(du -sh "$out" | awk '{print $1}'))"
}

build_next web
build_next admin

# ---- 2) Laravel API ----
log "Building apps/api-php for production…"
API_OUT="$DIST/api"
mkdir -p "$API_OUT"

# Copy the Laravel project, excluding dev-only and host-specific stuff.
rsync -a --delete \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.env.backup' \
  --exclude='vendor/' \
  --exclude='node_modules/' \
  --exclude='public/storage' \
  --exclude='public/build' \
  --exclude='storage/framework/cache/data/*' \
  --exclude='storage/framework/sessions/*' \
  --exclude='storage/framework/views/*' \
  --exclude='storage/logs/*' \
  --exclude='tests/' \
  --exclude='.phpunit.cache/' \
  apps/api-php/ "$API_OUT/"

# Install production dependencies into the bundle.
# Invoke composer via the chosen PHP binary so it runs under 8.4+ (the Herd
# `php` symlink points to 8.2 even when 8.4 is installed alongside).
log "  composer install --no-dev --optimize-autoloader (PHP $PHP_VER)"
( cd "$API_OUT" && "$PHP_BIN" "$COMPOSER_BIN" install --no-dev --optimize-autoloader --no-interaction --prefer-dist )

# Ship a production env template (real .env is created on the server).
cp apps/api-php/.env.production.example "$API_OUT/.env.production.example"

ok "api-php → $API_OUT ($(du -sh "$API_OUT" | awk '{print $1}'))"

# ---- summary ----
echo
log "Build complete."
printf '  %sNext steps:%s\n' "$C_DIM" "$C_RESET"
printf '    1. Fill apps/api-php/.env on the server (copy .env.production.example).\n'
printf '    2. Run scripts/deploy-hostinger.sh, OR upload dist/{web,admin,api}/ via SFTP.\n'
printf '    3. In hPanel: configure Node.js for web + admin, Apache/PHP for api.\n'
printf '       See docs/HOSTINGER.md for click-by-click steps.\n'
