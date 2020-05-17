<p align="center">
  <a href="https://travelita.herokuapp.com/"><img src="https://user-images.githubusercontent.com/203106/82113206-f7e53300-975c-11ea-9edf-bb9238715d29.png" alt="Travelita logo"/></a>
</p>

# Travelita App

Capstone project for FND written using nodejs, express, webpack and postgresql.

App is deployed on heroku - https://travelita.herokuapp.com and using Postgres DB.

Before use run `npm install` and `npm run build-dev`. Setup `.env` file with following configuration:

`DATABASE_URL` - Postgres DB url to establish connection (more details in [Postgres DB](#postgres-db) section)
`WEATHER_BIT_API_KEY` - api key for https://www.weatherbit.io/
`PIXABAY_API_KEY` - api key for https://pixabay.com/
`GEONAMES_API_KEY` - api key for https://www.geonames.org/

Initial migration for DB is in `db.sql`.

## Client side

<p align="center">
  <img src="https://user-images.githubusercontent.com/203106/82126123-4ae9d500-97b3-11ea-8ad7-d9ca43300dfc.png" alt="Trip Entry"/>

HTML5 + CSS3 + Vanilla JS

Client has following functionality:
1. Trip entries can be created using `+` button, updated - `save` button and deleted using `delete` button
2. Package items can be added and will be persisted together with the trip on click on `save`. Can be added using `add` button in package section, and later removed using red cross icon to remove one item record
3. City search provides suggestion box from which user has to select proper city (this is required to retrieve proper lat/lon data that is used for weather request)
4. Once city is selected - trip image will be update accordingly - either by city or, if not found, by country name
5. Finally weather will be retrieved for specified dates. If specified dates are in next 16 days range - forecast will be used. Otherwise historical data from last year will be used to show what is the usual weather
6. UI has a flexible layout that is equally useful on mobile devices and desktops

### Service worker

Client uses service worker that persists information from fetching trips. If user offline he still can see latest trip entries.

## Server side

Node.js + Express + Postgres

dotenv is used to get environment variables from `.env` file

### NPM scripts

'clean' - cleans up dist folder and creates an empty one
'start' - starts node server
'build-server' - runs build-dev and starts the server
'build-dev' - builds project using development configuration
'dev-server' - runs webpack development server
'build-prod' - builds project using production configuration, optimizations are enabled
'heroku-postbuild' - for Heroku deployment
'test' - runs Jest tests

### API

Server side exposes REST API endpoints to work with trip and package item entites, as well as accessing external APIs through node server.

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

## Tests

Tests examples are provided to client and server side in `__test__` folders in under `src/client` and `src/server`