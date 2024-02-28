import router from "./router.js";
import util from "./util.js";
import net from "./net.js";
import keys from "./keys.js";
import consts from "./consts.js";

const TOKEN = "token";

function updateUrlPath(path) {
    window.history.replaceState(null, "", path);
}

function checkToken() {
    return new Promise((resolve, reject) => {
        let tokenInCookie = util.getCookie(TOKEN);
        console.log("token in cookie :" + tokenInCookie);
        if (tokenInCookie.length > 0) {
            // TODO 等待对话框
            net.postData(consts.URL_CHECK_TOKEN, {
                token: tokenInCookie,
            }).then((data) => {
                if (data.code == 0) {
                    util.toast("token有效");
                    showContentPage();
                } else {
                    util.toast(data.message);
                }
                console.log(data);
            });
        } else {
            reject(null);
        }
    });
}

function setLoginPageVisibility(isVisible) {
    let loginPage = document.getElementById("login-page");
    if (isVisible) {
        loginPage.style.display = "flex";
        setInputUIEffect(
            "login-input-username",
            "login-input-username-wrapper"
        );
        setInputUIEffect(
            "login-input-password",
            "login-input-password-wrapper"
        );
    } else {
        loginPage.style.display = "none";
    }
}

function setContentPageVisibility(isVisible) {
    let contentPage = document.getElementById("content-page");
    if (isVisible) {
        contentPage.style.display = "flex";
    } else {
        contentPage.style.display = "none";
    }
}

function setInputUIEffect(focusID, changeStyleID) {
    let wrapperEle = document.getElementById(changeStyleID);
    let inputEle = document.getElementById(focusID);
    inputEle.addEventListener("focus", function () {
        wrapperEle.setAttribute("class", "login-input-wrapper-style-focus");
    });
    inputEle.addEventListener("blur", function () {
        wrapperEle.setAttribute("class", "login-input-wrapper-style");
    });
}

function adminLogin() {
    let username = document.getElementById("login-input-username").value;
    let password = document.getElementById("login-input-password").value;
    if (username.length == 0) {
        util.toast("请输入用户名");
        return;
    }
    if (password.length == 0) {
        util.toast("请输入密码");
        return;
    }
    net.postData(consts.URL_LOGIN, {
        username: username,
        password: password,
    }).then((data) => {
        if (data.code == 0) {
            util.toast("登录成功");
            util.setCookie(TOKEN, data.data.token);
            showContentPage();
        } else {
            util.toast(data.message);
        }
        console.log(data);
    });
}

let quillEditor = null;

function showQuillEditor() {
    if (quillEditor == null) {
        const toolbarOptions = [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            ["link", "image", "video", "formula"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
        ];
        quillEditor = new Quill("#article-editor", {
            modules: {
                syntax: true,
                toolbar: toolbarOptions,
            },
            theme: "snow",
            placeholder: "Article Content...",
            readOnly: false,
        });
    }
}

function addContentPageNavItemsListener() {
    addClickListenerForContentPageNavItem("content-page-nav-all-article");
    addClickListenerForContentPageNavItem("content-page-nav-all-draft");
    addClickListenerForContentPageNavItem("content-page-nav-all-column");
}
let allNavItemIDs = [
    "content-page-nav-all-article",
    "content-page-nav-all-draft",
    "content-page-nav-all-column",
];
let selectedContentNavElementID = null;

function addClickListenerForContentPageNavItem(elementID) {
    let itemEle = document.getElementById(elementID);
    if (!itemEle.hasAttribute("hasOnClickListener")) {
        itemEle.addEventListener("click", function () {
            selectedContentNavElementID = elementID;
            updateNavElementUI();
        });
        itemEle.setAttribute("hasOnClickListener", "added");
    }
}

function updateNavElementUI() {
    for (let id of allNavItemIDs) {
        let ele = document.getElementById(id);
        if (id === selectedContentNavElementID) {
            console.log("updateNavElementUI() selected id : " + id);
            ele.setAttribute("class", "content-page-nav-item-selected");
        } else {
            console.log("updateNavElementUI() id : " + id);
            ele.setAttribute("class", "content-page-nav-item");
        }
    }
}

function showContentPage() {
    setLoginPageVisibility(false);
    setContentPageVisibility(true);
    updateUrlPath("/content");
    addContentPageNavItemsListener();
    showQuillEditor();
}

function showLoginPage() {
    setContentPageVisibility(false);
    setLoginPageVisibility(true);
    updateUrlPath("/login");
}

function publishArticle() {
    let articleHtmlContent = quillEditor.root.innerHTML;

    net.postData(consts.URL_PUBLISH_ARTICLE, {
        token: util.getCookie(TOKEN),
        article_title: document.getElementById("article-title-input").value,
        article_content: articleHtmlContent,
        article_comment: document.getElementById("article-comment-input").value,
        author_id: "1",
    }).then((data) => {
        if (data.code == 0) {
            util.toast("文章发布成功");
        } else {
            util.toast(data.message);
        }
        console.log(data);
    });
}

function setListeners() {
    // 登录页面
    document
        .getElementById("login-button")
        .addEventListener("click", function () {
            adminLogin();
        });
    document
        .getElementById("login-password-toggle-div")
        .addEventListener("click", function () {
            console.log("toggleButton clicked ");
            let inputPassword = document.getElementById("login-input-password");
            if (inputPassword.type === "password") {
                inputPassword.type = "text";
                console.log("inputPassword.type = text");
            } else {
                inputPassword.type = "password";
                console.log("inputPassword.type = password");
            }
        });
    // 编辑页面
    document
        .getElementById("content-page-nav-logout")
        .addEventListener("click", function () {
            adminLogout();
        });
    document
        .getElementById("article-publish")
        .addEventListener("click", function () {
            publishArticle();
        });
}

function adminLogout() {
    util.clearCookie(TOKEN);
    showLoginPage();
}

function showWaitingDialog() {}

function hideWaitingDialog() {}

(function () {
    window.onload = function () {
        setListeners();
        showWaitingDialog();
        checkToken().then(
            function (result) {
                hideWaitingDialog();
                // resolve
                // 内容界面
                console.log("----展示内容界面-----");
                console.log(result);
                showContentPage();
            },
            function (error) {
                hideWaitingDialog();
                // reject
                // 登录界面
                // console.log("----展示登录界面-----");
                // showLoginPage();
            }
        );
        keys.addKeyListeners();
    };
})();
