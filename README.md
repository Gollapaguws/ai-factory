# AI Factory (Internal)

## Prereqs
- Docker + Docker Compose
- Node 20+

## Bootstrap (2 engineers)
make bootstrap

If `.env` does not exist yet:

cp .env.example .env

## URLs
- Web Console: http://localhost:3001
- API: http://localhost:3000

## Networking Defaults
- `web-console` and `orchestrator-api` bind to `127.0.0.1` only
- `postgres` and `redis` are internal-only (no public host ports)

## Common Commands
make build     # build images
make up        # start
make down      # stop
make reset     # wipe + rebuild
make logs      # tail logs
make verify-prod  # run production safety checks

## Reverse Proxy (Caddy)
- Use [infra/caddy/Caddyfile](infra/caddy/Caddyfile) as the starting point
- Replace the email and domains before deploying on VPS
- Keep API/Web bound to `127.0.0.1` in compose and expose only 80/443 via Caddy

## Production Verification
- Run: `make verify-prod`
- Optional HTTPS checks:
	- `WEB_DOMAIN=ai.infinitecraftmedia.com API_DOMAIN=api.ai.infinitecraftmedia.com make verify-prod`
- Script location: [scripts/verify-production.sh](scripts/verify-production.sh)

## Dev Flow
1. Create project in Web Console
2. Describe tool you want to build
3. Watch sandbox build logs
4. Preview app
5. Iterate

## Rules
- Do not add infra deps without policy update
- Never commit secrets
- AI outputs diffs only
