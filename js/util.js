function setCookie(key, value, expireDay = 7) {
    // 构造要设置的cookie字符串
    var cookieString = key + "=" + encodeURIComponent(value);

    // 设置cookie的过期时间（可选）
    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expireDay); // 7天后过期
    cookieString += "; expires=" + expirationDate.toUTCString();

    // 设置cookie的路径（可选）
    cookieString += "; path=/";

    // 设置cookie
    document.cookie = cookieString;
}

function getCookie(key) {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(";");

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null; // 如果找不到对应名称的Cookie
}

function toast(str) {
    Toastify({
        text: str,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#0b2447",
            borderRadius: "8px",
        },
        onClick: function () {}, // Callback after click
    }).showToast();
}

export default {
    setCookie,
    getCookie,
    toast,
};
