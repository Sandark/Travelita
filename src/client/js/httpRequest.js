/* HTTP requests, returns promises as result */

async function getRequest(url, params = "") {
    let compiledUrl = new URL(url);
    Object.keys(params).forEach(key => compiledUrl.searchParams.append(key, params[key]));

    let res = await fetch(compiledUrl);
    try {
        return await res.json();
    } catch (error) {
        console.log("error", error);
    }
}

const postRequest = async function (url, load) {
    const response = await fetch(url, {
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

const putRequest = async function (url, load) {
    const response = await fetch(url, {
        method: "PUT",
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

async function deleteRequest(id, url) {
    return await fetch(url + '/' + id, {
        method: 'delete'
    });
}

module.exports = {
    getRequest,
    deleteRequest,
    postRequest,
    putRequest
}