/* api.geonames.org/search? */
const support = require("./support");
const http = require("http");

const baseUrl = "http://api.geonames.org/searchJSON?";

const searchForCity = (req, res) => {
    let params = {
        q: req.query.cityName,
        username: process.env.GEONAMES_API_KEY,
        maxRows: 5,
        fuzzy: 0.8
    }

    let url = support.compileUrl(baseUrl, params);
    console.log(`Request with ${url}`);

    http.get(url, externalRes => {
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

module.exports = {
    searchForCity
}

