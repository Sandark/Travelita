const compileUrl = (url, params) => {
    let newUrl = new URL(url);

    Object.keys(params).forEach(key => newUrl.searchParams.append(key, params[key]));

    return newUrl;
}

module.exports = {
    compileUrl
}