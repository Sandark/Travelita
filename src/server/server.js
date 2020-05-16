const express = require("express");
const compression = require("compression");
const app = express();

const dotenv = require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");

const queries = require("./queries");
const location = require("./location");
const pixabay = require("./pixabay");
const weather = require("./weather");

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static("dist"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Application is running of port ${port}`);
})

app.get("/", (req, res) => {
    res.sendFile("dist/index.html");
})

app.get("/trips", queries.getTrips);
app.get("/tripsWithItems", queries.getTripsWithItems);

app.get("/trips/:id", queries.getTripById);

app.post("/trips", queries.createTrip);

app.put("/trips/:id", queries.updateTrip);

app.delete("/trips/:id", queries.deleteTrip);

app.get("/city", location.searchForCity);

app.get("/img", pixabay.findImageForCity);

app.get("/weather", weather.getWeatherForecast);

app.get("/weatherHistory", weather.getWeatherHistory);