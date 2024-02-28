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
    return null;
}

function clearCookie(key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

function secondTimeToDateStr(timeInSecondUnit) {
    var date = new Date(timeInSecondUnit * 1000);

    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要+1，并且保证两位数
    var day = ("0" + date.getDate()).slice(-2); // 保证两位数
    var hours = ("0" + date.getHours()).slice(-2); // 保证两位数
    var minutes = ("0" + date.getMinutes()).slice(-2); // 保证两位数
    var seconds = ("0" + date.getSeconds()).slice(-2); // 保证两位数

    return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
    );
}

export default {
    setCookie,
    getCookie,
    clearCookie,
    toast,
    secondTimeToDateStr,
};
