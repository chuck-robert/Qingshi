document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.getElementById("background").appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const balls = [];
    const numBalls = 50;
    const colors = ["#F73859", "#14FFEC", "#0084FF", "#FF99FE", "#FAF15D", "#51cf66"];
    for (let i = 0; i < numBalls; i++) {
        balls.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * (window.innerWidth / 50) + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * (window.innerWidth / 500),
            speedY: (Math.random() - 0.5) * (window.innerWidth / 500),
        });
    }

    function drawBall(ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.shadowColor = ball.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();
    }

    function backgroundUpdate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const ball of balls) {
            drawBall(ball);

            ball.x += ball.speedX;
            ball.y += ball.speedY;

            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                ball.speedX = -ball.speedX;
            }

            if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.speedY = -ball.speedY;
            }
        }

        requestAnimationFrame(backgroundUpdate);
    }

    backgroundUpdate();

    const topDiv = document.querySelector('div#toolsList .top');
    const activeAbleDivs = topDiv.querySelectorAll('[activeAble]');
    activeAbleDivs.forEach(function (div) {
        div.addEventListener("click", function () {
            activeAbleDivs.forEach(function (element) {
                element.classList.remove('active');
            });
            div.classList.add('active');
        });
    });

    const add = document.getElementById("mainAddInput");
    add.onclick = function () {
        location.hash = "#editor";
        if (!document.getElementById("editorJS")) { rendering(); }
        if (GetQueryString("memoId")) { saveMemo(GetQueryString("memoId"), "memos"); }
        ls = JSON.parse(localStorage.getItem("memoList"));
        newMemoForm = {
            "title": "未命名便签",
            "date": date("YYYY-MoMo-DDDD HHHH:MiMi"),
            "star": false,
            "content": "让生活充满色彩，让梦想更加绚丽",
            "type": "html",
            "icon": 5,
            "from": "old_update",
            "id": ls.memos.length
        }
        ls.memos.push(newMemoForm);
        localStorage.setItem("memoList", JSON.stringify(ls));
        console.log("🚀 ~ ls.memos.length:", ls.memos.length)
        totalLoad("memos");
        console.log("🚀 ~ ls.memos.length:", ls.memos.length)
        document.querySelector("div[data_memo_id=\"" + Number(Number(ls.memos.length) - 1) + "\"]").click();
    }
});
const memoList = localStorage.getItem('memoList');
if (memoList) {
    const memoListObj = JSON.parse(memoList);
    if (memoListObj.version === "3.0") {
        newMemoList = memoListObj;
        totalLoad("memos");
    } else if (memoListObj.version === "2.0") {
        memoListObj.version = "3.0";
        newMemoList = {
            memos: [],
            todos: [],
            version: "3.0"
        };
        for (let i = 0; i < memoListObj.memos.length; i++) {
            newMemoForm = {
                "title": "",
                "date": "",
                "star": false,
                "content": "",
                "type": "html",
                "icon": 5,
                "from": "old_update",
                "id": i
            }
            newMemoForm.title = memoListObj.memos[i].title;
            newMemoForm.date = memoListObj.memos[i].time;
            newMemoForm.star = memoListObj.memos[i].fiexd;
            newMemoForm.content = memoListObj.memos[i].text;
            newMemoList.memos.push(newMemoForm);
        }
        localStorage.setItem('memoList', JSON.stringify(newMemoList));
        totalLoad("memos");
    }
} else {
    newMemoList = {
        memos: [],
        todos: [],
        version: "3.0"
    };
    localStorage.setItem('memoList', JSON.stringify(newMemoList));
    totalLoad("memos");
}
editor_placeholder = document.getElementById("placeholder");
var saveTimer;
function totalLoad(key) {
    obj = JSON.parse(localStorage.getItem("memoList"));
    totalList = document.getElementById("totalList");
    totalList.innerHTML = "";
    obj[key].forEach(element => {
        index = obj[key].indexOf(element);
        var divElement = document.createElement("div");
        divElement.setAttribute("data_memo_id", element.id);
        divElement.innerHTML = '<div class="icon_li">\
                                <img src="./assets/image/icon_'+ element.icon + '.png" alt="icon">\
                            </div>\
                            <div class="infor_li">\
                                <div class="title_li">'+ element.title + '</div>\
                                <div class="about_li">'+ element.content.substring(0, 10) + "..." + '</div>\
                            </div>';
        divElement.addEventListener('click', function (event) {
            clearInterval(saveTimer);
            var memoId = this.getAttribute("data_memo_id");
            var iconId = element.icon;
            const newUrl = `./index.html?memoId=${memoId}#editor`;
            history.pushState(null, null, newUrl);
            document.getElementById("editor").style.display = "block";
            loadMemo(memoId, key, iconId);
            editorJS = document.getElementById("editorJS");
            if (!editorJS) { rendering(); }
            if (location.hash.split("#").join("") == "editor" && window.innerWidth <= 800) {
                document.getElementsByTagName("body")[0].classList.remove("noEditor");
            document.getElementsByTagName("body")[0].classList.add("hasEditor");
        }
        });
        totalList.appendChild(divElement);
    });
}
function loadMemo(memoId, key, iconId) {
    obj = JSON.parse(localStorage.getItem("memoList"));
    obj = obj[key].find(function (element) {
        return Number(element.id) === Number(memoId);
    });
    if (obj && obj.star) {
        document.getElementById("about_star").classList.add("active");
    } else {
        document.getElementById("about_star").classList.remove("active");
    }

    editorTextarea = document.getElementById("editorTextarea");
    editorTextarea.innerHTML = obj.content;
    note_title = document.getElementById("note_title");
    note_title.value = obj.title;
    icon = document.querySelector(".information > .image");
    src = "./assets/image/icon_" + obj.icon + ".png";
    icon.setAttribute("data-icon", obj.icon);
    icon.style.backgroundImage = "url(" + src + ")";

    saveTimer = setInterval(function () {
        saveMemo(memoId, key);
        totalLoad(key);
        console.log("sdsdsdsdddddddddddddddddddddddd");
    }, 1000);
    document.getElementById("list_memo").classList.add("active");
    document.getElementById("list_todos").classList.remove("active");
    document.getElementById("list_star").classList.remove("active");
}
function saveMemo(memoId, key) {
    obj = JSON.parse(localStorage.getItem("memoList"));
    obj[key][memoId].icon = document.querySelector(".information > .image").getAttribute("data-icon");
    obj[key][memoId].content = editorTextarea.innerHTML;
    obj[key][memoId].title = note_title.value;
    localStorage.setItem("memoList", JSON.stringify(obj));
}
icon = document.querySelector(".information > .image");
icon.onclick = function () {
    popup = document.getElementById("popup");
    if (popup) {
        popup.remove();
    } else {
        loadPopup();
    }
}
function loadPopup() {
    var iconRect = icon.getBoundingClientRect();
    var iconLeft = iconRect.left;
    var iconBottom = iconRect.bottom;
    var popup = document.createElement("div");
    popup.id = "popup";
    popup.style.left = iconLeft + "px";
    popup.style.top = iconBottom + "px";
    popup.style.position = "absolute";
    document.body.appendChild(popup);
    for (var i = 1; i <= 55; i++) {
        var img = document.createElement("img");
        img.src = "./assets/image/icon_" + i + ".png";
        popup.appendChild(img);
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.margin = "5px";
        img.style.borderRadius = "5px";
        img.style.cursor = "pointer";
        img.setAttribute("data-icon", i);
        img.onclick = function () {
            src = this.src;
            popup.remove();
            icon.style.backgroundImage = "url(" + src + ")";
            icon.setAttribute("data-icon", this.getAttribute("data-icon"));
        }
        popup.appendChild(img);
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}
function getHash() {
    return window.location.hash.substring(1);
}
hashValue = getHash();
rendering();
function rendering() {
    if (getHash()) {
        script = document.createElement("script");
        script.src = "/assets/js/editor.js";
        script.id = "editorJS";
        document.body.appendChild(script);
        document.getElementById("editor").style.display = "block";
    } else {
        document.getElementById("editor").style.display = "none";
    }
}

document.getElementById("about_star").onclick = function () {
    if (this.classList.contains("active")) {
        this.classList.remove("active");
    } else {
        this.classList.add("active");
    }
    saveStar(this.classList.contains("active"), Number(GetQueryString("memoId")));
}

function saveStar(mode, id) {
    id = Number(GetQueryString("memoId"));
    memoA = JSON.parse(localStorage.getItem("memoList"));
    memos = memoA.memos;
    memos[id].star = mode;
    localStorage.setItem("memoList", JSON.stringify(memoA));
}

if (GetQueryString("memoId")) {
    document.querySelector("div[data_memo_id=\"" + GetQueryString("memoId") + "\"]").click();
}
list_memo = document.getElementById("list_memo");
list_todos = document.getElementById("list_todos");
list_star = document.getElementById("list_star");
searchBox = document.getElementById("searchBox");
list_memo.onclick = function () {
    totalLoad("memos");
}
list_todos.onclick = function () {
    document.getElementById("editor").style.display = "none";
    clearInterval(saveTimer);
    var obj = JSON.parse(localStorage.getItem("memoList")).memos;
    var totalList = document.getElementById("totalList");
    totalList.innerHTML = "";

    obj.forEach(function (element) {
        if (element.icon == "55" || element.icon == "54") {
            var listItem = createListItem(element);
            totalList.appendChild(listItem);
        }
    });

}
function createListItem(element) {
    var divElement = document.createElement("div");
    divElement.setAttribute("data_memo_id", element.id);
    divElement.innerHTML = '<div class="icon_li">\
                            <img src="./assets/image/icon_'+ element.icon + '.png" alt="icon">\
                        </div>\
                        <div class="infor_li">\
                            <div class="title_li">'+ element.title + '</div>\
                            <div class="about_li">'+ element.content.substring(0, 10) + "..." + '</div>\
                        </div>';
    divElement.addEventListener('click', function (event) {
        clearInterval(saveTimer);
        var memoId = this.getAttribute("data_memo_id");
        var iconId = element.icon;
        const newUrl = `./index.html?memoId=${memoId}#editor`;
        history.pushState(null, null, newUrl);
        document.getElementById("editor").style.display = "block";
        loadMemo(memoId, "memos", iconId);
        editorJS = document.getElementById("editorJS");
        if (!editorJS) { rendering(); }
        if (location.hash.split("#").join("") == "editor" && window.innerWidth <= 800) {
            document.getElementsByTagName("body")[0].classList.remove("noEditor");
            document.getElementsByTagName("body")[0].classList.add("hasEditor");
        }
    });
    return divElement;
}

list_star.onclick = function () {
    document.getElementById("editor").style.display = "none";
    clearInterval(saveTimer);
    var obj = JSON.parse(localStorage.getItem("memoList")).memos;
    var totalList = document.getElementById("totalList");
    totalList.innerHTML = "";
    obj.forEach(function (element) {
        if (element.star) {
            var listItem = createListItem(element);
            totalList.appendChild(listItem);
        }
    });
}

searchBox.addEventListener('keyup', function (event) {
    clearInterval(saveTimer);
    var searchText = this.value;
    if (searchText.length > 0) {
        var totalList = document.getElementById("totalList");
        totalList.innerHTML = "";
        var searchList = JSON.parse(localStorage.getItem("memoList")).memos;
        var filteredList = searchList.filter(function (element) {
            return element.title.toLowerCase().includes(searchText.toLowerCase());
        });

        filteredList.forEach(function (element) {
            var listItem = createListItem(element);
            totalList.appendChild(listItem);
        });
    }
});

function date(f) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return f.replace('YYYY', year)
        .replace('MoMo', month)
        .replace('DDDD', day)
        .replace('HHHH', hour)
        .replace('MiMi', minute)
        .replace('SSSS', second);
}

const about_actions = [
    [
        {
            "title": "导入",
            "icon": "fas fa-file-import",
            "class": "",
            result: function result() {
                input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt,.md';
                document.getElementsByTagName('body')[0].appendChild(input);
                input.click();
                input.onchange = function () {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const content = e.target.result;
                        if (file.name.endsWith('.txt')) {
                            document.getElementById('editorTextarea').innerText += content;
                        } else {
                            document.getElementById('editorTextarea').innerHTML += marked.parse(content);
                        }
                    };
                    reader.readAsText(file);
                }
                input.remove();
                document.getElementById("about_more_menu").style.display = "none";
            }
        }, {
            "title": "导出(HTML)",
            "icon": "fas fa-file-export",
            "class": "",
            result: function result() {
                const content = document.getElementById('editorTextarea').innerHTML;
                const blob = new Blob([content], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'memo.html';
                a.click();
                URL.revokeObjectURL(url);
                document.getElementById("about_more_menu").style.display = "none";
            }
        }, {
            "title": "导出(TXT)",
            "icon": "fas fa-file-export",
            "class": "",
            result: function result() {
                const content = document.getElementById('editorTextarea').innerText;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'memo.txt';
                a.click();
                URL.revokeObjectURL(url);
                document.getElementById("about_more_menu").style.display = "none";
            }
        }
    ], [
        {
            "title": "删除",
            "icon": "fas fa-trash-alt",
            "class": "del",
            result: function result() {
                var id = GetQueryString("memoId");
                var ls = JSON.parse(localStorage.getItem("memoList"));
                var memosD = ls.memos;
                var indexToRemove = memosD.findIndex(function (memo) {
                    return memo.id === parseInt(id);
                });
                if (indexToRemove !== -1) {
                    memosD.splice(indexToRemove, 1);
                    ls.memos = memosD;
                    for (var i = 0; i < ls.memos.length; i++) {
                        ls.memos[i].id = i;
                    }
                    localStorage.setItem("memoList", JSON.stringify(ls));
                    location.href = "index.html";
                }
                document.getElementById("about_more_menu").style.display = "none";
            }
        }
    ]
]
am = document.getElementById("about_more");
am.onclick = function () {
    amm = document.getElementById("about_more_menu");
    if (!amm) {
        const about_more_rect = am.getBoundingClientRect();
        const x = about_more_rect.right;
        const y = about_more_rect.bottom;
        const div = document.createElement('div');
        div.id = "about_more_menu";
        div.style.position = 'absolute';
        div.style.left = x - 155 + 'px';
        div.style.top = y + 10 + 'px';
        div.style.width = '150px';
        document.body.appendChild(div);
        for (let i = 0; i < about_actions.length; i++) {
            e = about_actions[i];
            for (let j = 0; j < e.length; j++) {
                const element = e[j];
                const button = document.createElement('button');
                button.className = element.class;
                button.innerHTML = "<i class=\"" + element.icon + "\"></i><span>" + element.title + "</span>";
                button.onclick = element.result;
                div.appendChild(button);
            }
        }
    } else {
        if (amm.style.display == "none") {
            amm.style.display = "block";
        } else {
            amm.style.display = "none";
        }
    }
}

if (location.hash.split("#").join("") !== "editor") {
    document.getElementsByTagName("body")[0].classList.add("noEditor");
}

document.querySelector(".page_back.page_item").onclick = function () {
    location.href = "index.html";
}