import router from "./router.js";
import util from "./util.js";

const TOKEN = "token";

function displayAllChildrenButID(element, id) {
    for (let childEle of element.children) {
        if (childEle.id == id) {
            childEle.style.display = "block";
        } else {
            childEle.style.display = "none";
        }
    }
}

// element是包含的容器
function refreshRightContainerForHome(element, path) {
    if (element == null) {
        return;
    }
    displayAllChildrenButID(element, "content-container-home");

    element.querySelector(
        "#content-container-home-article"
    ).innerHTML = `Hi 👋 I'm Onur (meaning Honour in English), a software engineer, dj, writer, and minimalist based in Amsterdam,
    The Netherlands.`;
    clearWritingPanel();
}

function refreshRightContainerForWriting(element, fullPath) {
    if (element == null) {
        return;
    }
    console.log("--------------------------------");
    console.log(fullPath);
    if (fullPath != null) {
        let splitedPath = router.splitPath(fullPath);
        if (
            splitedPath.length > 0 &&
            splitedPath[0].toLowerCase() == "writing"
        ) {
            displayAllChildrenButID(element, "content-container-writing");
            console.log("refreshRightContainerForWriting");
            showWritingPanel(splitedPath);
        }
    }
}

function refreshRightContainerForColumn(element, path) {
    if (element == null) {
        return;
    }
    if (path != null) {
        let splitedPath = router.splitPath(path);
        if (
            splitedPath.length > 0 &&
            splitedPath[0].toLowerCase() == "column"
        ) {
            displayAllChildrenButID(element, "content-container-column");
            console.log("refreshRightContainerForColumn");
        }
    }
    clearWritingPanel();
}

function refreshRightContainerForAbout(element, path) {
    if (element == null) {
        return;
    }
    if (path != null) {
        let splitedPath = router.splitPath(path);
        if (splitedPath.length > 0 && splitedPath[0].toLowerCase() == "about") {
            displayAllChildrenButID(element, "content-container-about");
            console.log("refreshRightContainerForAbout");
        }
    }
    element.querySelector(
        "#content-container-about-article"
    ).innerHTML = `<p><pre><h3 style="display:inline;">           将进酒</h3>（唐·李白）

    君不见，黄河之水天上来，奔流到海不复回。
    
    君不见，高堂明镜悲白发，朝如青丝暮成雪。
    
    人生得意须尽欢，莫使金樽空对月。
    
    天生我材必有用，千金散尽还复来。
    
    烹羊宰牛且为乐，会须一饮三百杯。
    
    岑夫子，丹丘生，将进酒，君莫停。
    
    与君歌一曲，请君为我倾耳听。
    
    钟鼓馔玉不足贵，但愿长醉不复醒。
    
    古来圣贤皆寂寞，惟有饮者留其名。
    
    陈王昔时宴平乐，斗酒十千恣欢谑。
    
    主人何为言少钱，径须沽取对君酌。
    
    五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。</pre></p>`;
    clearWritingPanel();
}

let writingItemBriefs = [];
function clearWritingPanel() {
    if (writingItemBriefs.length > 0) {
        writingItemBriefs = [];
        clearWritingListPanel();
        clearWritingContentPanel();
    }
}

function clearWritingListPanel() {
    let writingListContainerElement = document.getElementById(
        "content-container-writing-list"
    );
    if (writingListContainerElement != null) {
        writingListContainerElement.innerHTML = "";
    }
}

function createOneWritingListItemContainerEle(
    itemElementContainerID,
    title,
    hint,
    path
) {
    let itemElementContainer = document.createElement("div");
    itemElementContainer.setAttribute("id", itemElementContainerID);
    itemElementContainer.setAttribute(
        "class",
        "writing-brief-info-container menu-item-theme-light"
    );
    let itemElementTitle = document.createElement("div");
    itemElementTitle.setAttribute(
        "class",
        "writing-brief-info-title text-highlight"
    );
    itemElementTitle.innerHTML = title;

    let itemElementHint = document.createElement("div");
    itemElementHint.setAttribute(
        "class",
        "writing-brief-info-hint text-normal"
    );
    itemElementHint.innerHTML = hint;
    itemElementContainer.appendChild(itemElementTitle);
    itemElementContainer.appendChild(itemElementHint);
    itemElementContainer.addEventListener("click", function () {
        updateUrlPath("/writing/" + path);
        clearWritingContentPanel();
        // todo 根据后台内容，填充右侧writingcontentpanel
        showWritingContentPanel(
            "title: " +
                title +
                " content: " +
                "朝辞白帝彩云间，千里江陵一日还，两岸猿声啼不住，轻舟已过万重山。"
        );
        console.log(this);
        console.log(typeof this);
        console.log(this == itemElementContainer);
        updateWritingItemForSelectedAndUnselectedTheme(this);
    });
    itemElementContainer.setAttribute("writing-path", path);
    return itemElementContainer;
}

function updateWritingItemForSelectedAndUnselectedTheme(selectedElement) {
    for (let element of writingItemBriefs) {
        if (element == selectedElement) {
            element.setAttribute(
                "class",
                "writing-brief-info-container menu-item-theme-light menu-item-selection"
            );
            let titleElement = element.children[0];
            titleElement.setAttribute(
                "class",
                "writing-brief-info-title text-highlight-reverse-bg"
            );
        } else {
            element.setAttribute(
                "class",
                "writing-brief-info-container menu-item-theme-light"
            );
            let titleElement = element.children[0];
            titleElement.setAttribute(
                "class",
                "writing-brief-info-title text-highlight"
            );
        }
    }
}

function showWritingPanel(splitedPath) {
    let writingListContainerElement = document.getElementById(
        "content-container-writing-list"
    );
    console.log("-------show writing panel 111");

    if (writingItemBriefs.length == 0) {
        console.log("-------show writing panel 222");
        for (let i = 0; i < 20; i++) {
            let itemContainerEle = createOneWritingListItemContainerEle(
                "writing-brief-info-container-id-" + i,
                "今天天气不错今天天气不错今天天气不错今天天气不错今天天气不错天气不错今天天气不错今天天气不错" +
                    i,
                "October 06 2023·1500 views",
                "this-is-an-article-path-" + i
            );
            writingListContainerElement.appendChild(itemContainerEle);
            writingItemBriefs.push(itemContainerEle);
        }
    }
    if (splitedPath.length > 1) {
        console.log("show writing panel content 33333");
        showWritingContentPanel("hahahaahahahah 测试一下子");
    }
    addListenerForWritingNavElement();
}

function showWritingContentPanel(content) {
    document.getElementById(
        "content-container-writing-content-article-container"
    ).style.display = "block";
    document.getElementById(
        "content-container-writing-content-article"
    ).innerHTML = content;
}

function addListenerForWritingNavElement() {
    let writingNavEle = document.getElementById(
        "content-container-writing-list-sticky-panel-title"
    );
    console.log(writingNavEle);
    if (writingNavEle != null) {
        if (!writingNavEle.hasAttribute("hasOnClickListener")) {
            writingNavEle.addEventListener("click", function () {
                console.log("writing nav clicked ");
                updateUrlPath("/writing");
                clearWritingContentPanel();
            });
            writingNavEle.setAttribute("hasOnClickListener", "added");
        }
    }
}

function clearWritingContentPanel() {
    let writingContentEmptyEle = document.getElementById(
        "content-container-writing-content-empty"
    );
    writingContentEmptyEle.style.display = "none";
    let writingContentArticleContainerEle = document.getElementById(
        "content-container-writing-content-article-container"
    );
    writingContentArticleContainerEle.style.display = "none";
    let writingContentArticleEle = document.getElementById(
        "content-container-writing-content-article"
    );
    writingContentArticleEle.innerHTML = "";
}

let firstLevelIDS = [
    "menu-item-card-home",
    "menu-item-card-writing",
    "menu-item-card-column",
    "menu-item-card-about",
];

let refreshFunctions = {
    home: refreshRightContainerForHome,
    writing: refreshRightContainerForWriting,
    column: refreshRightContainerForColumn,
    about: refreshRightContainerForAbout,
};

const firstLevelIDElementMap = new Map();

function updateFirstLevelMenuItemUIForSelected(element) {
    if (!element.classList.contains("menu-item-selection")) {
        element.classList.add("menu-item-selection");
    }
}

function updateFirstLevelMenuItemUIForUnselected(element) {
    element.classList.remove("menu-item-selection");
}

function inflateFirstLevelIDElementMap() {
    for (let key of firstLevelIDS) {
        firstLevelIDElementMap.set(key, document.getElementById(key));
    }
}

function addEventListenerForMenuItems() {
    let contentRightContainer = document.getElementById(
        "content-container-right"
    );
    firstLevelIDElementMap.forEach((value, key) => {
        // 添加一级菜单router
        router.addFirstLevelRouter(
            value.dataset.link,
            contentRightContainer,
            refreshFunctions[value.dataset.link]
        );
        // 添加一级菜单点击事件
        value.addEventListener("click", function () {
            // 更新MenuItem的UI
            for (let ele of firstLevelIDElementMap.values()) {
                if (value === ele) {
                    updateFirstLevelMenuItemUIForSelected(value);
                } else {
                    updateFirstLevelMenuItemUIForUnselected(ele);
                }
            }
            // 先变更地址
            updateUrlPath("/" + value.dataset.link);
            // 更新右侧面板
            router.updateFirstLevelContainer(value.dataset.link);
        });
    });
}

function updateUIForPath(urlPath) {
    let splitedPath = router.splitPath(urlPath);
    let menuItemElementIDToBeSelected = "menu-item-card-home";
    if (splitedPath.length > 0) {
        let firstLevelPath = splitedPath[0].toLowerCase();
        if (
            firstLevelPath != "home" &&
            firstLevelPath != "index.html" &&
            firstLevelPath in refreshFunctions
        ) {
            menuItemElementIDToBeSelected = "menu-item-card-" + firstLevelPath;
        } else {
            updateUrlPath("/home");
        }
    }
    updateMenuItemsUIForPath(splitedPath, menuItemElementIDToBeSelected);
    updateRightContainerForPath(
        urlPath,
        splitedPath,
        menuItemElementIDToBeSelected
    );
}

function updateUrlPath(path) {
    window.history.replaceState(null, "", path);
}

function updateMenuItemsUIForPath(splitedPath, menuItemElementIDToBeSelected) {
    firstLevelIDElementMap.forEach((value, key) => {
        if (key == menuItemElementIDToBeSelected) {
            updateFirstLevelMenuItemUIForSelected(value);
        } else {
            updateFirstLevelMenuItemUIForUnselected(value);
        }
    });
}

function updateRightContainerForPath(
    urlPath,
    splitedPath,
    menuItemElementIDToBeSelected
) {
    let contentRightContainer = document.getElementById(
        "content-container-right"
    );
    if (menuItemElementIDToBeSelected == "menu-item-card-home") {
        // home
        refreshRightContainerForHome(contentRightContainer, "home");
    } else if (splitedPath.length > 0 && splitedPath[0] in refreshFunctions) {
        // 展示firstlevel
        refreshFunctions[splitedPath[0]](contentRightContainer, urlPath);
    }
}

function updateAvatar() {
    document.getElementById("my-avatar-image").src = "/img/rick-avatar.png";
}

function checkAuth() {
    return new Promise((resolve, reject) => {
        let tokenInCookie = util.getCookie(TOKEN);
        if (tokenInCookie.length > 0) {
            // TODO 等待对话框
            axios
                .get("/auth?token=" + tokenInCookie)
                .then(function (response) {
                    // handle success
                    console.log(response);
                    resolve(response);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    reject(error);
                })
                .finally(function () {
                    // always executed
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
        setTogglePasswordVisibilityButtonListener();
        setLoginButtonListener();
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

function setLoginButtonListener() {
    let loginButtonEle = document.getElementById("login-button");
    if (!loginButtonEle.hasAttribute("hasOnClickListener")) {
        loginButtonEle.addEventListener("click", function () {
            console.log("loginButtonEle clicked ");
            util.toast("假装登录成功");
            setLoginPageVisibility(false);
            setContentPageVisibility(true);
            updateUrlPath("/content");
            showQuillEditor();
        });
        loginButtonEle.setAttribute("hasOnClickListener", "added");
    }
}

function setTogglePasswordVisibilityButtonListener() {
    let toggleButton = document.getElementById("login-password-toggle-div");
    if (!toggleButton.hasAttribute("hasOnClickListener")) {
        toggleButton.addEventListener("click", function () {
            console.log("toggleButton clicked ");
            let inputPassword = document.getElementById("login-input-password");
            if (inputPassword.type === "password") {
                inputPassword.type = "text";
            } else {
                inputPassword.type = "password";
            }
        });
        toggleButton.setAttribute("hasOnClickListener", "added");
    }
}

let quillEditor = null;

function showQuillEditor() {
    quillEditor = new Quill("#article-editor", {
        theme: "snow",
        placeholder: "在此输入文字内容...",
        readOnly: false,
    });
}

(function () {
    window.onload = function () {
        checkAuth().then(
            function (result) {
                // resolve
                // 内容界面
                console.log("----展示内容界面-----");
                console.log(result);
                setLoginPageVisibility(false);
                setContentPageVisibility(true);
                updateUrlPath("/content");
                showQuillEditor();
            },
            function (error) {
                // reject
                // 登录界面
                console.log("----展示登录界面-----");
                setContentPageVisibility(false);
                setLoginPageVisibility(true);
                updateUrlPath("/login");
            }
        );
    };
})();
