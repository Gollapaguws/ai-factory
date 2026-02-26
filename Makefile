.PHONY: bootstrap build up down reset logs verify-prod

bootstrap:
	cp .env.example .env || true
	docker compose build
	docker compose up -d

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

reset:
	docker compose down -v
	docker compose up -d --build

logs:
	docker compose logs -f

verify-prod:
	bash ./scripts/verify-production.sh
