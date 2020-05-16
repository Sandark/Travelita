const support = require("./support");
const httpRequest = require("./httpRequest");

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

    if (isNaN(params.lat) || isNaN(params.lon)) {
        res.status(400).send({
            message: "Lat/Lng parameters are missing or wrong"
        })
    } else {

        let url = support.compileUrl(dailyBaseUrl, params);

        httpRequest.httpsGet(url,
            (data) => {
                let filteredData = [];

                JSON.parse(data).data.forEach(temp => {
                    filteredData.push({
                        max_temp: temp.max_temp,
                        min_temp: temp.min_temp,
                        weather_code: temp.weather.code,
                        date: temp.valid_date
                    });
                })

                res.json(filteredData);
            },
            (error) => res.json(error));
    }
}

const getWeatherHistory = (req, res) => {
    let endDate = new Date(req.query.start_date);
    endDate.setDate(endDate.getDate() + 1);

    let params = {
        key: apiKey,
        start_date: req.query.start_date,
        end_date: endDate.toISOString().split("T")[0],
        lat: req.query.lat,
        lon: req.query.lng
    }

    if (isNaN(params.lat) || isNaN(params.lon)) {
        res.status(400).send({
            message: "Lat/Lng parameters are missing or wrong"
        })
    } else {

        let url = support.compileUrl(historicalBaseUrl, params);

        httpRequest.httpsGet(url,
            (data) => {
                let result = JSON.parse(data);

                res.json({
                    max_temp: result.data[0].max_temp,
                    min_temp: result.data[0].min_temp
                });
            },
            (error) => res.json(error));
    }
}

module.exports = {
    getWeatherForecast,
    getWeatherHistory
}