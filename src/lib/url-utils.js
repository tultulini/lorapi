

export function getQueryStringObject(url) {
    if (!url) {
        return {}
    }

    let queryIndex = url.indexOf('?')
    if (queryIndex < 0 || queryIndex == url.length - 1) {
        return {}
    }

    const pl = /\+/g  // Regex for replacing addition symbol with a space
    const search = /([^&=]+)=?([^&]*)/g
    const decode = (s) => decodeURIComponent(s.replace(pl, " "));
    const query = url.substring(queryIndex + 1);

    let urlParams = {};
    let match = undefined
    while ((match = search.exec(query))) {
        urlParams[decode(match[1])] = decode(match[2]);
    }

    console.log(`urlParams: ${JSON.stringify(urlParams)}`)
    return urlParams
}