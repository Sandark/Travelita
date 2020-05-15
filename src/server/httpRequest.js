const http = require("http");
const https = require("https");

function httpGet(url, callback, errorCallback) {
    console.debug(`Request with ${url}`);
    http.get(url, externalResponse => {
        processExternalRequest(externalResponse, callback, errorCallback)
    })
}

function httpsGet(url, callback, errorCallback) {
    console.debug(`Request with ${url}`);
    https.get(url, externalResponse => {
        processExternalRequest(externalResponse, callback, errorCallback);
    })
}

function processExternalRequest(externalResponse, callback, errorCallback) {
    let data = "";
    externalResponse.on('data', (chunk) => {
        data += chunk;
    })

    externalResponse.on("end", () => {
        console.log(data);
        callback(data);
    })

    externalResponse.on("error", (error) => {
        errorCallback(error);
    })
}


module.exports = {
    httpGet,
    httpsGet
}