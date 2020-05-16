/* HTTP requests, returns promises as result */

async function getRequest(url, params = "") {
    let compiledUrl = new URL(getApiBaseUrl() + url);
    Object.keys(params).forEach(key => compiledUrl.searchParams.append(key, params[key]));

    let res = await fetch(compiledUrl.toString());
    try {
        return await res.json();
    } catch (error) {
        console.log("error", error);
    }
}

const postRequest = async function (url, load) {
    const response = await fetch(getApiBaseUrl() + url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(load)
    });

    return await response.json();
}

const putRequest = async function (url, params) {
    const response = await fetch(getApiBaseUrl() + url, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });

    return await response.json();
}

async function deleteRequest(url, id) {
    return await fetch(getApiBaseUrl() + url + '/' + id, {
        method: 'delete'
    });
}

/* Retrieves current base url */
function getApiBaseUrl() {
    if (window.location.hostname === "localhost") {
        return "http://" + [window.location.hostname, window.location.port].join(":")
    }

    return "https://" + [window.location.hostname, window.location.port].join(":");
}

module.exports = {
    getRequest,
    deleteRequest,
    postRequest,
    putRequest
}