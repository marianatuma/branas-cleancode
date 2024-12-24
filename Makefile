create-db:
	psql -d app -f create.sql -U postgres 

start-api:
	npx nodemon backend/ride/src/main.ts