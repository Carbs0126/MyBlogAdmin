class RouterUnit {
    // 请求某个url时，使用refreshFunction来刷新element
    // 比如请求 writing 时，对应包含两列的element，请求 /writing 后，调用对应的 refreshFunc 来刷新
    // 比如请求 writing/record-a-nice-day 时，对应包含右侧文章内容的element，请求 /writing/record-a-nice-day 后，调用对应的 refreshFunc 来刷新
    constructor(url, element, refreshFunc) {
        this.url = url;
        this.element = element;
        this.refreshFunc = refreshFunc;
    }
    refreshContent() {
        // 1. ajax请求 todo
        // 2. 返回的内容填充到element元素中
        this.refreshFunc(this.element, this.url);
    }
}

const allRouters = {};
const firstLevelRouters = {};
// 当页面刚加载后，会存入 /home /writing /journey /about 这四个地址
// 当页面加载 /writing 后，会添加所有的文章列表 /writing/aaaa  /writing/bbbb
function addRouter(path, containerElement, refreshFunc) {
    allRouters[path] = new RouterUnit(path, containerElement, refreshFunc);
}

function addFirstLevelRouter(path, contentContainerRightElement, refreshFunc) {
    firstLevelRouters[path] = new RouterUnit(
        path,
        contentContainerRightElement,
        refreshFunc
    );
}

function updateFirstLevelContainer(firstLevelPath) {
    if (firstLevelPath in firstLevelRouters) {
        firstLevelRouters[firstLevelPath].refreshContent();
    }
}

function splitPath(pathname) {
    return pathname.split("/").filter((part) => part !== "");
}

export default {
    addRouter,
    addFirstLevelRouter,
    updateFirstLevelContainer,
    splitPath,
};

/*
// 处理路由变化
const handleRouteChange = () => {
    const currentPath = window.location.pathname;
    const content = routes[currentPath] || "Page Not Found";
    appContainer.innerHTML = `<div>${content}</div>`;
};

// 初始化应用
const initApp = () => {
    // 初始路由处理
    handleRouteChange();

    // 监听浏览器历史记录变化
    window.addEventListener("popstate", handleRouteChange);
};

// 启动应用
initApp();
*/
