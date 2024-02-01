function getCookie(cookieName) {
    var name = cookieName + "=";
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
    getCookie,
    toast,
};
