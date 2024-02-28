### Description
This technical task involves 4 api endpoints, each solving queries made to the dvdrental database. 

### Components
- Postgres database 'dvdrental' 
- Node.js server using Express and Typescript
- Pgadmin to view the database 

All components are built as a single multi-container using the docker-compose.yml file

### Setup 
- pnpm install
- docker compose up
- copy the .env.example contents to a .env file
- pnpm build
- pnpm test
- access the api endpoint at http://localhost:8000

### Endpoint examples
- curl --location 'localhost:8000/films/category?categoryName=action'
- curl --location 'localhost:8000/customers' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "store_id" : 1,
    "first_name" : "John",
    "last_name" : "Doe",
    "email" : "doejohn@gmail.com",
    "phone" : "0771321480",
    "address" : "72 Jury Lane",
    "district" : "Alberta",
    "city_id" : 300,
    "postal_code" : "HA-G30"
}'
- curl --location --request DELETE 'localhost:8000/customers/70'
- curl --location 'localhost:8000/films?title=to&length=60'


Note: The search endpoint may return more than 6 results in the example if tests have been run

### To view the database at pgadmin: 
- visit http://localhost:5050
- login with admin@admin.com : root
- create a new server:
     - hostname: dvdrental
     - maintenance database: postgres
     - port: 5432
     - username: postgres
     - password: postgres
 






   

