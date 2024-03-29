import router from "./router.js";
import util from "./util.js";
import net from "./net.js";
import keys from "./keys.js";
import consts from "./consts.js";

const TOKEN = "token";
const EDITOR_MODE_ADD = 0;
const EDITOR_MODE_UPDATE = 1;
let ArticleChanged = false;
let EnableQuillEditorTextChangedListener = false;
let EditorMode = EDITOR_MODE_ADD;

function updateUrlPath(path) {
    window.history.replaceState(null, "", path);
}

function checkToken() {
    return new Promise((resolve, reject) => {
        let tokenInCookie = util.getCookie(TOKEN);
        if (tokenInCookie.length > 0) {
            net.postData(consts.URL_CHECK_TOKEN, {
                token: tokenInCookie,
            }).then((data) => {
                if (data.code == 0) {
                    util.toast("token有效");
                    resolve(data);
                } else {
                    util.toast(data.message);
                    util.toast("重新登录");
                    reject(null);
                }
            });
        } else {
            reject(null);
        }
    });
}

function setLoginPageVisibility(isVisible) {
    console.log("setLoginPageVisibility");
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
        console.log("focus");
        wrapperEle.setAttribute("class", "login-input-wrapper-style-focus");
    });
    inputEle.addEventListener("blur", function () {
        console.log("blur");
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
            readOnly: false,
        });
        quillEditor.on("text-change", quillEditorTextChange);
    }
}
function quillEditorTextChange(delta, oldDelta, source) {
    if (EnableQuillEditorTextChangedListener) {
        ArticleChanged = true;
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
            ele.setAttribute("class", "content-page-nav-item-selected");
        } else {
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
    articleHtmlContent = articleHtmlContent.replace(
        /<select class="ql-ui".*?>.*?<\/select>/gi,
        ""
    );
    var delta = quillEditor.getContents();
    var deltaJSON = JSON.stringify(delta);
    // console.log("delta:", delta);
    // console.log("type of delta:", typeof delta);
    // quillEditor.root.innerHTML = "";
    // setTimeout(function () {
    // console.log("before set Content");
    // quillEditor.setContents(delta);
    // }, 2000);
    if (EditorMode == EDITOR_MODE_ADD) {
        net.postData(consts.URL_PUBLISH_ARTICLE, {
            token: util.getCookie(TOKEN),
            article_title: document.getElementById("article-title-input").value,
            article_content: articleHtmlContent,
            article_content_quill: deltaJSON,
            article_comment: document.getElementById("article-comment-input")
                .value,
            article_state: 0,
            author_id: "1",
        }).then((data) => {
            if (data.code == 0) {
                util.toast("文章发布成功");
                ArticleChanged = false;
                clearContentViews();
            } else {
                util.toast(data.message);
            }
            console.log(data);
        });
    } else if (EditorMode == EDITOR_MODE_UPDATE) {
        net.postData(consts.URL_UPDATE_ARTICLE, {
            token: util.getCookie(TOKEN),
            article_title: document.getElementById("article-title-input").value,
            article_content: articleHtmlContent,
            article_content_quill: deltaJSON,
            article_comment: document.getElementById("article-comment-input")
                .value,
            article_state: 0,
            unique_identifier: document.getElementById(
                "article-identifier-input"
            ).value,
            author_id: "1",
        }).then((data) => {
            if (data.code == 0) {
                util.toast("文章发布成功");
                ArticleChanged = false;
                clearContentViews();
            } else {
                util.toast(data.message);
            }
            console.log(data);
        });
    }
}

function setListeners() {
    // 登录页面
    addClickListener("login-button", adminLogin);
    addClickListener("login-password-toggle-div", togglePasswordVisibility);
    // 编辑页面
    addClickListener("content-page-nav-new-article", writeNewArticle);
    addClickListener("content-page-nav-all-article", showAllArticles);
    addClickListener("content-page-nav-all-draft", showAllDrafts);
    addClickListener("content-page-nav-logout", adminLogout);
    addClickListener("article-publish", publishArticle);
}

function setInputListeners() {
    document
        .getElementById("article-title-input")
        .addEventListener("input", function (event) {
            ArticleChanged = true;
        });
    document
        .getElementById("article-comment-input")
        .addEventListener("input", function (event) {
            ArticleChanged = true;
        });
}

function togglePasswordVisibility() {
    let inputPassword = document.getElementById("login-input-password");
    if (inputPassword.type === "password") {
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
}
function adminLogout() {
    util.clearCookie(TOKEN);
    showLoginPage();
}

function showComfirmDialog(finishFunc) {
    Swal.fire({
        title:
            EditorMode == EDITOR_MODE_ADD
                ? "当前处于【新增】模式，发现有内容已经修改暂未保存，是否需要上传当前新文章？"
                : "当前处于【修改】模式，发现有内容已经修改暂未保存，是否需要保存当前文章？",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "是",
        denyButtonText: "否",
    }).then((result) => {
        if (result.isConfirmed) {
            if (EditorMode == EDITOR_MODE_ADD) {
                // 上传当前文章
                util.toast("开始上传当前新文章");
                // TODO
                // finishFunc()
            } else if (EditorMode == EDITOR_MODE_UPDATE) {
                // 上传当前文章
                util.toast("开始更新当前文章");
                // TODO
            }
            // Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            // Swal.fire("Changes are not saved", "", "info");
            finishFunc();
        }
    });
}

function writeNewArticle() {
    showEditorContainer();
    if (ArticleChanged) {
        showComfirmDialog(clearContentViews);
    } else {
        clearContentViews();
        ArticleChanged = false;
    }
}

function clearContentViews() {
    updateArticleItemForSelectedAndUnselectedTheme(null);
    clearArticleInputs();
    clearQuillEditor();
    updateBillboard("新增模式");
    EditorMode = EDITOR_MODE_ADD;
}

function clearArticleInputs() {
    document.getElementById("article-title-input").value = "";
    document.getElementById("article-identifier-input").value = "";
    document.getElementById("article-comment-input").value = "";
}
function updateBillboard(text) {
    document.getElementById(
        "article-info-container-right-billboard"
    ).textContent = text;
}
function clearQuillEditor() {
    quillEditor.root.innerHTML = "";
}
function showEditorContainer() {
    setEditorContainerVisibility(true);
}
function setEditorContainerVisibility(isVisible) {
    let contentPage = document.getElementById("content-page-content");
    if (isVisible) {
        contentPage.style.display = "block";
    } else {
        contentPage.style.display = "none";
    }
}

function showAllArticles() {
    clearListContainer();
    net.getData(consts.URL_ARTICLE_LIST_ALL).then((data) => {
        if (data.code == 0) {
            util.toast("所有文章列表请求成功");
            let articleListContainerElement =
                document.getElementById("content-page-list");
            articleListContainerElement.style.display = "block";
            for (let i = 0; i < data.data.length; i++) {
                let dataItem = data.data[i];
                let createDateStr = util.secondTimeToDateStr(
                    dataItem.create_date
                );
                let updateDateStr = util.secondTimeToDateStr(
                    dataItem.update_date
                );
                let hint = createDateStr;
                if (dataItem.create_date != dataItem.update_date) {
                    hint = createDateStr + "  " + updateDateStr;
                }
                let itemContainerEle = createOneArticleListItemContainerEle(
                    "article-brief-info-container-id-" + i,
                    dataItem.title,
                    hint,
                    dataItem.unique_identifier
                );
                articleListContainerElement.appendChild(itemContainerEle);
            }
        } else {
            util.toast(data.message);
        }
        console.log(data);
    });
}

function showAllDrafts() {
    clearListContainer();
    net.getData(consts.URL_ARTICLE_LIST_ALL_DRAFT).then((data) => {
        if (data.code == 0) {
            util.toast("草稿列表请求成功");
            let articleListContainerElement =
                document.getElementById("content-page-list");
            articleListContainerElement.style.display = "block";
            for (let i = 0; i < data.data.length; i++) {
                let dataItem = data.data[i];
                let createDateStr = util.secondTimeToDateStr(
                    dataItem.create_date
                );
                let updateDateStr = util.secondTimeToDateStr(
                    dataItem.update_date
                );
                let hint = createDateStr;
                if (dataItem.create_date != dataItem.update_date) {
                    hint = createDateStr + "  " + updateDateStr;
                }
                let itemContainerEle = createOneArticleListItemContainerEle(
                    "article-brief-info-container-id-" + i,
                    dataItem.title,
                    hint,
                    dataItem.unique_identifier
                );
                articleListContainerElement.appendChild(itemContainerEle);
            }
        } else {
            util.toast(data.message);
        }
        console.log(data);
    });
}

function clearListContainer() {
    document.getElementById("content-page-list").innerHTML = "";
}

function createOneArticleListItemContainerEle(containerID, title, hint, path) {
    let itemElementContainer = document.createElement("div");
    itemElementContainer.setAttribute("id", containerID);
    itemElementContainer.setAttribute(
        "class",
        "article-brief-info-container menu-item-theme-light"
    );
    let itemElementTitle = document.createElement("div");
    itemElementTitle.setAttribute(
        "class",
        "article-brief-info-title text-highlight"
    );
    itemElementTitle.innerHTML = title;

    let itemElementHint = document.createElement("div");
    itemElementHint.setAttribute(
        "class",
        "article-brief-info-hint text-normal"
    );
    itemElementHint.innerHTML = hint;
    itemElementContainer.appendChild(itemElementTitle);
    itemElementContainer.appendChild(itemElementHint);
    itemElementContainer.addEventListener("click", function () {
        let that = this;
        if (ArticleChanged) {
            showComfirmDialog(function () {
                requestArticleDetailAndShowContent(path);
                updateArticleItemForSelectedAndUnselectedTheme(that);
            });
        } else {
            requestArticleDetailAndShowContent(path);
            updateArticleItemForSelectedAndUnselectedTheme(that);
        }
    });
    itemElementContainer.setAttribute("article-path", path);
    return itemElementContainer;
}

function updateArticleItemForSelectedAndUnselectedTheme(selectedElement) {
    let articleItemBriefs =
        document.getElementById("content-page-list").children;
    for (let element of articleItemBriefs) {
        if (element == selectedElement) {
            element.setAttribute(
                "class",
                "article-brief-info-container menu-item-theme-light menu-item-selection"
            );
            let titleElement = element.children[0];
            titleElement.setAttribute("class", "text-highlight-reverse-bg");
        } else {
            element.setAttribute(
                "class",
                "article-brief-info-container menu-item-theme-light"
            );
            let titleElement = element.children[0];
            titleElement.setAttribute("class", "text-highlight");
        }
    }
}

function requestArticleDetailAndShowContent(articleIdentifier) {
    net.getData(consts.URL_ARTICLE_DETAIL + articleIdentifier).then((data) => {
        if (data.code == 0) {
            EditorMode = EDITOR_MODE_UPDATE;
            showEditorContainer();
            showArticleContentPanel(
                data.data.title,
                data.data.quill_content,
                articleIdentifier,
                data.data.update_date,
                data.data.comment
            );
            updateBillboard("更新模式");
        } else {
            util.toast(data.message);
        }
        console.log(data);
    });
}

// todo  comment
function showArticleContentPanel(
    title,
    quillContent,
    articleIdentifier,
    updateDate,
    comment
) {
    console.log("comment ======>" + comment);
    document.getElementById("article-title-input").value = title;
    document.getElementById("article-identifier-input").value =
        articleIdentifier;
    document.getElementById("article-comment-input").value = comment;
    // quillEditor.clipboard.dangerouslyPasteHTML(content);
    let restoredDelta = JSON.parse(quillContent);
    EnableQuillEditorTextChangedListener = false;
    console.log("before set contents");
    quillEditor.setContents(restoredDelta);
    console.log("after set contents");
    EnableQuillEditorTextChangedListener = true;
}

function addClickListener(elementID, onClickFunc) {
    document.getElementById(elementID).addEventListener("click", onClickFunc);
}

(function () {
    window.onload = function () {
        setListeners();
        setInputListeners();
        checkToken().then(
            function (result) {
                showContentPage();
            },
            function (error) {
                showLoginPage();
            }
        );
        keys.addKeyListeners();
    };
})();
