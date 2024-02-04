
color = ["#000", "#fff", "#7a7a7a",
    "#fa5252", "#ff8787", "#ffc9c9",
    "#e64980", "#f783ac", "#fcc2d7",
    "#be4bdb", "#da77f2", "#eebefa",
    "#7950f2", "#9775fa", "#d0bfff",
    "#4263eb", "#748ffc", "#bac8ff",
    "#1c7ed6", "#4dabf7", "#a5d8ff",
    "#0ca678", "#3bc9db", "#96f2d7",
    "#37b24d", "#69db7c", "#b2f2bb",
    "#74b816", "#a9e34b", "#fff3bf",
    "#f59f00", "#ffd43b", "#ffec99",
    "#f76707", "#ffa94d", "#ffd8a8"]
const actions = [
    {
        title: "字体大小",
        icon: "<i class=\"fas fa-h1\"></i>",
        result: function result() {
            toolDiv = document.getElementById("tool");
            toolDiv.innerHTML = "";
            toolDiv.classList.add("size");
            range = [1, 2, 3, 4, 5, 6, 7]
            for (let i = 0; i < range.length; i++) {
                let button = document.createElement("button");
                button.innerHTML = "你好世界";
                button.style.fontSize = range[i] * 5 + "px";
                button.onclick = function () {
                    exec('fontSize', range[i]);
                    document.getElementById("tool").remove();
                }
                toolDiv.appendChild(button);
                toolDiv.appendChild(document.createElement("br"));
            }
        }
    }, {
        title: "字体颜色",
        icon: "<i class=\"fas fa-paint-brush\"></i>",
        result: function result() {
            toolDiv = document.getElementById("tool");
            toolDiv.innerHTML = "";
            toolDiv.classList.add("color");
            num = 0;
            for (let i = 0; i < color.length; i++) {
                num++;
                let button = document.createElement("button");
                button.style.color = color[i];
                button.innerText = "真理"
                button.onclick = function () {
                    exec('foreColor', color[i]);
                    document.getElementById("tool").remove();
                }
                toolDiv.appendChild(button);
                if (num == 3) {
                    num = 0;
                    toolDiv.appendChild(document.createElement("br"));
                }
            }
        }
    }, {
        title: "背景颜色",
        icon: "<span class=\"icon background\">A</span>",
        result: function result() {
            toolDiv = document.getElementById("tool");
            toolDiv.innerHTML = "";
            toolDiv.classList.add("background");
            num = 0;
            for (let i = 0; i < color.length; i++) {
                num++;
                let button = document.createElement("button");
                button.style.backgroundColor = color[i];
                button.innerText = "真理"
                button.onclick = function () {
                    exec('backColor', color[i]);
                    document.getElementById("tool").remove();
                }
                toolDiv.appendChild(button);
                if (num == 3) {
                    num = 0;
                    toolDiv.appendChild(document.createElement("br"));
                }
            }
        }
    }, {
        title: "斜体",
        icon: "<i class=\"fas fa-italic\"></i>",
        result: function result() {
            document.getElementById("tool").remove();
            return exec('italic');
        }
    }, {
        title: "下划线",
        icon: "<i class=\"fas fa-underline\"></i>",
        result: function result() {
            document.getElementById("tool").remove();
            return exec('underline');
        }
    }, {
        title: "贯穿线",
        icon: "<i class=\"fas fa-strikethrough\"></i>",
        result: function result() {
            document.getElementById("tool").remove();
            return exec('strikeThrough');
        }
    }, {
        title: "加粗",
        icon: "<i class=\"fas fa-bold\"></i>",
        result: function result() {
            document.getElementById("tool").remove();
            return exec('bold');
        }
    }, {
        title: "列表",
        icon: "<i class=\"fas fa-list\"></i>",
        result: function result() {
            toolDiv = document.getElementById("tool");
            toolDiv.innerHTML = "";
            json = [
                {
                    title: "有序列表",
                    icon: "<i class=\"fas fa-list-ol\"></i>",
                    result: function result() {
                        [].concat(Array.from(arguments)).forEach(function (item) {
                            exec('insertOrderedList');
                            document.getElementById("tool").remove();
                        });
                    }
                }, {
                    title: "无序列表",
                    icon: "<i class=\"fas fa-list-ul\"></i>",
                    result: function result() {
                        [].concat(Array.from(arguments)).forEach(function (item) {
                            exec('insertUnorderedList');
                            document.getElementById("tool").remove();
                        });
                    }
                }
            ]
            json.forEach(function (item) {
                var button = document.createElement("button");
                button.innerHTML = item.icon;
                button.onclick = item.result;
                toolDiv.appendChild(button);
            });
        }
    }, {
        title: "引用",
        icon: "<i class=\"fas fa-quote-right\"></i>",
        result: function result() {
            exec('formatBlock', '<blockquote>');
        }
    }
]
const importDom = [{
    title: "图片",
    icon: "<i class=\"fas fa-image\"></i>",
    result: function result() {
        importBox = document.getElementById("importBox");
        importBox.classList.add("active");
        importBox.innerHTML = '';
        input = document.createElement("input");
        input.type = "text";
        input.placeholder = "http://";
        button = document.createElement("button");
        button.innerHTML = "确认";
        button.onclick = function () {
            if (input.value.match(/^http[s]?:\/\/.+$/i)) {
                var data = document.getElementById("data");
                var img = document.createElement("img");
                img.src = input.value;
                data.replaceWith(img);
                importBox.remove();
            } else {
                input.value = '格式不正确';
            }
        };
        importBox.appendChild(input);
        importBox.appendChild(button);
    }
}, {
    title: "链接",
    icon: "<i class=\"fas fa-link\"></i>",
    result: function result() {
        importBox = document.getElementById("importBox");
        importBox.classList.add("active");
        importBox.classList.add("link");
        importBox.innerHTML = '<div><span>标题</span><input type=\"text\" id="editor_link_title" placeholder=\"标题\"></div><div><span>链接</span><input type=\"text\" id="editor_link_src" placeholder=\"https://\"></div>';
        button = document.createElement("button");
        button.innerHTML = "确认";
        button.onclick = function () {
            var title = document.getElementById("editor_link_title").value;
            var src = document.getElementById("editor_link_src").value;
            if (title.length > 0 && src.match(/^http[s]?:\/\/.+$/i)) {
                var link = document.createElement("a");
                link.href = src;
                link.innerText = title;
                data.replaceWith(link);
                importBox.remove();
            }
        }
        importBox.appendChild(button);
    }
}, {
    title: "代码",
    icon: "<i class=\"fab fa-github-alt\"></i>",
    result: function result() {
        importBox = document.getElementById("importBox");
        pre = document.createElement("pre");
        code = document.createElement("code");
        code.innerText = "Hello World!"
        pre.appendChild(code);
        data.replaceWith(pre);
        importBox.remove();
    }
}, {
    title: "分割线",
    icon: "<i class=\"fas fa-ruler-horizontal\"></i>",
    result: function result() {
        data.remove();
        exec('insertHorizontalRule');
    }
}, {
    title: "表格",
    icon: "<i class=\"fas fa-table\"></i>",
    result: function result() {
        importBox = document.getElementById("importBox");
        importBox.classList.add("active");
        importBox.classList.add("link");
        importBox.innerHTML = '<div><span>行</span><input type=\"text\" id="editor_table_x"></div><div><span>列</span><input type=\"text\" id="editor_table_y"></div>';
        button = document.createElement("button");
        button.innerHTML = "确认";
        button.onclick = function () {
            x = document.getElementById("editor_table_x").value;
            y = document.getElementById("editor_table_y").value;
            data.replaceWith(createTable(x, y));
            importBox.remove();
        }
        importBox.appendChild(button);
        createTable = function createTable(x, y) {
            var table = document.createElement("table");
            for (var i = 0; i < x; i++) {
                var tr = document.createElement("tr");
                for (var j = 0; j < y; j++) {
                    var td = document.createElement("td");
                    td.contentEditable = true;
                    td.innerText = '';
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            return table;
        }
    }
}]
element = document.getElementById("editorTextarea");
element.contentEditable = true;
var placeholder = document.createElement("div");
placeholder.id = "placeholder";
element_x = element.getBoundingClientRect().x;
element_y = element.getBoundingClientRect().y;
placeholder.style.position = "absolute";
placeholder.style.top = element_y + 10 + "px";
placeholder.style.left = element_x + 10 + "px";
placeholder.style.pointerEvents = "none";
placeholder.style.color = "#999";
placeholder.innerText = "请输入内容...";
document.body.appendChild(placeholder);
element.addEventListener("input", function () {
    if (element.innerText == "") {
        placeholder.style.display = "block";
    } else {
        placeholder.style.display = "none";
    }
})
if (GetQueryString("memoId")) {
    placeholder.style.display = "none";
}
var savedRange = null;

function getSelectedTextInfo() {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var selectedText = selection.toString();
        if (selectedText !== "") {
            if (!document.getElementById("tool")) {
                addToolBox();
            } else {
                document.getElementById("tool").remove();
                addToolBox();
            }
        }
        function addToolBox() {
            var mousePosition = getMousePosition(event);  // 传递事件对象
            var toolDiv = document.createElement("div");
            toolDiv.id = "tool";
            toolDiv.style.position = "absolute";
            toolDiv.style.left = mousePosition.x + "px";
            toolDiv.style.top = mousePosition.y + "px";
            document.body.appendChild(toolDiv);
            loadTools();
            toolDiv.addEventListener('click', function (event) {
                event.preventDefault();
                document.getElementById('editor').focus();
                if (savedRange) {
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                }
            });
        }
        function getMousePosition(event) {
            return {
                x: event.clientX,
                y: event.clientY
            };
        }
        savedRange = selection.getRangeAt(0);
    }
}
function loadTools() {
    toolDiv = document.getElementById("tool");
    actions.forEach(action => {
        var button = document.createElement('button');
        button.innerHTML = action.icon;
        button.addEventListener('click', function () {
            action.result();
        });
        toolDiv.appendChild(button);
        if (actions.indexOf(action) === 4) {
            toolDiv.appendChild(document.createElement('br'));
        }
    });
}
document.getElementById('editor').addEventListener('mouseup', function (event) {
    if (document.getElementById("tool")) {
        document.getElementById("tool").remove();
    } else {
        getSelectedTextInfo(event);
    }
});

var exec = function exec(command) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return document.execCommand(command, false, value);
};
// 判断是否按下斜杠键
let slashCount = 0;
document.addEventListener('keydown', function (event) {
    importBox = document.getElementById('importBox');
    if (document.getElementById("editorTextarea").contains(document.activeElement) && event.key === '/') {
        slashCount++;
        if (slashCount === 2) {
            var range = document.getSelection().getRangeAt(0);
            var rect = range.getBoundingClientRect();
            if (importBox) { importBox.remove(); loadImportBox(rect); } else { loadImportBox(rect); }
            slashCount = 0;
        }
    } else if (importBox) {
        if (!importBox.classList.contains("active")) {
            importBox.remove();
        }
        slashCount = 0;
    } else {
        slashCount = 0;
    }
});
function loadImportBox(rect) {
    var importBox = document.createElement('div');
    importBox.id = 'importBox';
    importBox.style.position = 'absolute';
    importBox.style.left = rect.left + 'px';
    importBox.style.top = rect.top + 30 + 'px';
    document.getElementsByTagName('body')[0].appendChild(importBox);
    importDom.forEach(function (item) {
        var button = document.createElement('button');
        button.innerHTML = item.icon;
        button.addEventListener('click', function (event) {
            exec('insertHTML', '<div id="data" style="display: none;"></div>');
            event.preventDefault();
            item.result();
        });
        importBox.appendChild(button);
        if (importDom.indexOf(item) === 2) {
            importBox.appendChild(document.createElement('br'));
        }
    })
}