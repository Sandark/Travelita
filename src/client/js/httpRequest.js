

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

function deleteRequest(id, url) {
    return fetch(url + '/' + id, {
        method: 'delete'
    })
        .then(response => response.json());
}

module.exports = {
    getRequest,
    deleteRequest
}