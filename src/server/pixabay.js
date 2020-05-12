const support = require("./support");
const https = require("https");

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

module.exports = {
    findImageForCity
}