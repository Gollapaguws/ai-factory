#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== AI Factory Production Verification =="

echo "[1/7] Docker Compose validation"
docker compose config >/dev/null

echo "[2/7] Required .env safety checks"
if [[ ! -f .env ]]; then
  echo "FAIL: .env file is missing"
  exit 1
fi

if ! grep -Eq '^JWT_SECRET=' .env; then
  echo "FAIL: JWT_SECRET is missing in .env"
  exit 1
fi

if grep -Eq '^JWT_SECRET=change-me-in-production$|^JWT_SECRET=change-this-to-a-long-random-secret$' .env; then
  echo "FAIL: JWT_SECRET is using a default placeholder"
  exit 1
fi

if grep -Eq '^CORS_ORIGIN=\*$|^CORS_ORIGIN=$' .env; then
  echo "FAIL: CORS_ORIGIN must be an explicit origin, not '*' or empty"
  exit 1
fi

if ! grep -Eq '^ALLOW_SELF_REGISTER=false$' .env; then
  echo "FAIL: ALLOW_SELF_REGISTER must be false for production"
  exit 1
fi

echo "[3/7] Service state"
docker compose ps

echo "[4/7] Local endpoint checks"
curl -fsS http://127.0.0.1:3000/health >/dev/null
curl -fsS http://127.0.0.1:3001/health >/dev/null

echo "[5/7] Registration policy check"
register_status="$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:3000/auth/register -H 'Content-Type: application/json' -d '{"username":"prod-check-user","password":"Password1234"}')"
if [[ "$register_status" != "403" ]]; then
  echo "FAIL: /auth/register should return 403 in production, got $register_status"
  exit 1
fi

echo "[6/7] Port exposure checks"
compose_ps="$(docker compose ps)"

postgres_ports="$(echo "$compose_ps" | awk '/ai_factory_postgres/ {for (i=1;i<=NF;i++) printf $i" "; print ""}')"
redis_ports="$(echo "$compose_ps" | awk '/ai_factory_redis/ {for (i=1;i<=NF;i++) printf $i" "; print ""}')"
api_ports="$(echo "$compose_ps" | awk '/ai_factory_api/ {for (i=1;i<=NF;i++) printf $i" "; print ""}')"
web_ports="$(echo "$compose_ps" | awk '/ai_factory_web/ {for (i=1;i<=NF;i++) printf $i" "; print ""}')"

if echo "$postgres_ports" | grep -q -- '->'; then
  echo "FAIL: postgres service is published to host (expected internal-only)"
  echo "$postgres_ports"
  exit 1
fi

if echo "$redis_ports" | grep -q -- '->'; then
  echo "FAIL: redis service is published to host (expected internal-only)"
  echo "$redis_ports"
  exit 1
fi

if ! echo "$api_ports" | grep -q -- '127.0.0.1:3000->3000/tcp'; then
  echo "FAIL: orchestrator-api must bind to 127.0.0.1:3000"
  echo "$api_ports"
  exit 1
fi

if ! echo "$web_ports" | grep -q -- '127.0.0.1:3001->3001/tcp'; then
  echo "FAIL: web-console must bind to 127.0.0.1:3001"
  echo "$web_ports"
  exit 1
fi

echo "[7/7] Optional HTTPS endpoint checks"
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

echo "[7/7] Success"
echo "All required production checks passed."
