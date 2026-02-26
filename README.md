# AI Factory (Internal)

## Prereqs
- Docker + Docker Compose
- Node 20+

## Bootstrap (2 engineers)
make bootstrap

## URLs
- Web Console: http://localhost:3001
- API: http://localhost:3000

## Common Commands
make up        # start
make down      # stop
make reset     # wipe + rebuild
make logs      # tail logs

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
