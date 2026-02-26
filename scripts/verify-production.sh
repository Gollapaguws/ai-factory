#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== AI Factory Production Verification =="

echo "[1/6] Docker Compose validation"
docker compose config >/dev/null

echo "[2/6] Service state"
docker compose ps

echo "[3/6] Local endpoint checks"
curl -fsS http://127.0.0.1:3000/health >/dev/null
curl -fsS http://127.0.0.1:3001/health >/dev/null

echo "[4/6] Port exposure checks"
if ss -tulnp | grep -E ':5432\s|:6379\s' >/dev/null; then
  echo "FAIL: Postgres or Redis appears exposed on host ports"
  ss -tulnp | grep -E ':5432\s|:6379\s'
  exit 1
fi

if ss -tulnp | grep -E '0\.0\.0\.0:3000|0\.0\.0\.0:3001|\[::\]:3000|\[::\]:3001' >/dev/null; then
  echo "FAIL: API or Web Console is bound publicly (expected localhost only)"
  ss -tulnp | grep -E '3000|3001'
  exit 1
fi

echo "[5/6] Optional HTTPS endpoint checks"
if [[ -n "${WEB_DOMAIN:-}" ]]; then
  curl -fsS "https://${WEB_DOMAIN}" >/dev/null
  echo "Web HTTPS OK: https://${WEB_DOMAIN}"
else
  echo "WEB_DOMAIN not set; skipping web HTTPS check"
fi

if [[ -n "${API_DOMAIN:-}" ]]; then
  curl -fsS "https://${API_DOMAIN}/health" >/dev/null
  echo "API HTTPS OK: https://${API_DOMAIN}/health"
else
  echo "API_DOMAIN not set; skipping API HTTPS check"
fi

echo "[6/6] Success"
echo "All required production checks passed."
