USER=node

up:
	docker-compose up --build

down:
	docker-compose down

stop:
	docker-compose stop

sh:
	docker-compose exec nodejs sh

logs:
	docker-compose logs

setup:
	cp .env.example .env