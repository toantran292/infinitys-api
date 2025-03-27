makemigrations:
	npm run migration:generate --name="$(name)"

migrate:
	npm run migration:run

reset-container:
	docker compose down -v
	docker compose up -d --build
	npm run migration:run
	npm run seed

seed:
	npm run seed

setup-db:
	npm run migration:run
	npm run seed