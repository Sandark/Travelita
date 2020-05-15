const support = require("./support");
const httpRequest = require("./httpRequest");

/*https://pixabay.com/api/docs/*/
const baseUrl = "https://pixabay.com/api/";
const apiKey = process.env.PIXABAY_API_KEY;

const findImageForCity = (req, res) => {
    let params = {
        key: apiKey,
        q: req.query.q,
        orientation: "horizontal",
        category: "travel",
        order: "popular",
        min_width: "640",
        min_height: "360"
    }

    let url = support.compileUrl(baseUrl, params);

    httpRequest.httpsGet(url,
        (data) => res.json(JSON.parse(data)),
        (error) => res.json(error));
}

module.exports = {
    findImageForCity
}