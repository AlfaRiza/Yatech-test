## Setup
npm install

cp .env.example .env (fill the .env file)

sequelize db:migrate

sequelize db:seed:all

## Run app
node server.js
