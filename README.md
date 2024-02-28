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

### To view the database at pgadmin: 
- visit http://localhost:5050
- login with admin@admin.com : root
- create a new server:
     - hostname: dvdrental
     - maintenance database: postgres
     - port: 5432
     - username: postgres
     - password: postgres
 






   

