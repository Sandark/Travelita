const support = require("./support");
const https = require("https");

/* */
const dailyBaseUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
const historicalBaseUrl = " https://api.weatherbit.io/v2.0/history/daily";

const apiKey = process.env.WEATHER_BIT_API_KEY;

const getWeatherForecast = (req, res) => {
    let params = {
        key: apiKey,
        lat: req.query.lat,
        lon: req.query.lng
    }

    let url = support.compileUrl(dailyBaseUrl, params);
    console.log(`Request with ${url}`);

    https.get(url, externalRes => {
        let data = "";
        externalRes.on('data', (chunk) => {
            data += chunk;
        })

        externalRes.on("end", () => {
            console.log(data);
            res.json(JSON.parse(data));
        })

        externalRes.on("error", (error) => {
            res.json(error);
        })
    })
}

const getWeatherHistory = (req, res) => {
    let params = {
        key: apiKey,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        lat: req.query.lat,
        lon: req.query.lng
    }

    let url = support.compileUrl(historicalBaseUrl, params);
    console.log(`Request with ${url}`);

    https.get(url, externalRes => {
        let data = "";
        externalRes.on('data', (chunk) => {
            data += chunk;
        })

        externalRes.on("end", () => {
            console.log(data);

            let result = JSON.parse(data);
            res.json({
                max_temp: result.data[0].max_temp,
                min_temp: result.data[0].min_temp
            });
        })

        externalRes.on("error", (error) => {
            res.json(error);
        })
    })
}

module.exports = {
    getWeatherForecast,
    getWeatherHistory
}