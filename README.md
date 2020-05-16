# Travelita App

Capstone project for FND written using nodejs, express, webpack and postgresql.


## Client logic

HTML5 + CSS3 + Vanilla JS

If city is not found on Pixabay - random image by travel search criteria is used.

## Server side

Node.js + Express + Postgres

dotenv is used to get environment variables from `.env` file

### Postgres DB

Postgres is used to provide CRUD operations for the application. 

Initial setup of db can be done using `db.sql`. It will create new tables and all required data.

Server automatically setups DB connection:
1. If process.env.DATABASE_URL is provided - it will be used to setup connection. E.g. it's useful on Heroku when they automaticall provide this URL to your application 
2. Otherwise - DB_USER, DB_HOST, DB_SCHEMA, DB_PASSWORD, DB_PORT are used to setup DB connection

### External APIs

WeatherBit - provides forecast and historical information for specified locations. Resides in `weather.js`

Geonames - information about cities/locations. Used to retrieve city and it's lat and lng parameters that later can be used by weatherApi. Can be found in `location.js`

Pixabay - free webservice that provides images by different criterias. Used to get a picture of city or random travel image if city is missing in Pixabay. Can be found in `pixabay.js`