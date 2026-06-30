#!/usr/bin/env bash
# Normalize a Hostinger remote path secret (handles accidental KEY=value paste).
normalize_remote_dir() {
  local raw="$1"
  raw="$(printf '%s' "$raw" | tr -d '[:space:]')"
  raw="${raw#HOSTINGER_WEB_DIR=}"
  raw="${raw#HOSTINGER_ADMIN_DIR=}"
  raw="${raw#HOSTINGER_API_DIR=}"
  printf '%s' "$raw"
}
