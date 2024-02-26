async function postData(url = "", data = {}) {
    var params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        params.append(key, data[key]);
    });
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow",
        body: params,
    });
    return response.json();
}

export default {
    postData,
};
