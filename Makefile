.PHONY: bootstrap up down reset logs

bootstrap:
	cp .env.example .env || true
	docker compose build
	docker compose up -d

up:
	docker compose up -d

down:
	docker compose down

reset:
	docker compose down -v
	docker compose up -d --build

logs:
	docker compose logs -f
