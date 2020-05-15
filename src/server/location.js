/* api.geonames.org/search? */
const support = require("./support");
const httpRequest = require("./httpRequest");

const baseUrl = "http://api.geonames.org/searchJSON?";

const searchForCity = (req, res) => {
    let params = {
        q: req.query.cityName,
        username: process.env.GEONAMES_API_KEY,
        maxRows: 5,
        fuzzy: 0.8
    }

    let url = support.compileUrl(baseUrl, params);

    httpRequest.httpGet(url,
        (data) => res.json(JSON.parse(data)),
        (error) => res.json(error));
}

module.exports = {
    searchForCity
}

