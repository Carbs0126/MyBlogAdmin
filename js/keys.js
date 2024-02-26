function addKeyListeners() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            let loginPage = document.getElementById("login-page");
            var computedStyle = window.getComputedStyle(loginPage);
            var display = computedStyle.getPropertyValue("display");
            if (display != "none") {
                document.getElementById("login-button").click();
            }
        }
    });
}

export default {
    addKeyListeners,
};
