#!/bin/sh
set -eu

cd /app

PORT="${PORT:-8080}"
export PORT
export SERVER_NAME=":${PORT}"

mkdir -p \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

php artisan storage:link --force
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan view:cache

exec frankenphp run --config /etc/caddy/Caddyfile --adapter caddyfile
