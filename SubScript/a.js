// 01. 刷新按钮移动到地址栏
(function() {
    function moveReloadIntoURL() {
        try {
            var btn0 = document.getElementById("page-action-buttons");
            var btn1 = document.getElementById("reload-button");
            if (!btn0 || !btn1) return;

            var btn = document.createXULElement("toolbarbutton");
            btn.style.margin = '0px';
            btn.setAttribute("id", "stop_reload_button");
            btn.setAttribute("class", btn1.getAttribute("class"));

            btn.addEventListener("command", function(e) {
                var btn = document.getElementById("reload-button");
                if (btn && btn.getAttribute('displaystop'))
                    BrowserStop();
                else
                    BrowserReload(); 
            }, false);
            btn0.parentNode.insertBefore(btn, btn0);
            btn1.addEventListener('DOMAttrModified', reloadBtnAttr);
            reloadBtnAttr();
            btn1.parentNode.hidden = true;
        }catch(e){ alert(e) }
    }

    function reloadBtnAttr(e) {
        btn = document.getElementById("stop_reload_button");
        if (btn && (!e || e.attrName=='displaystop')) {
            var newVal = e ? e.newValue : document.getElementById(
                "reload-button").getAttribute('displaystop');
            if (newVal)
                btn.style.listStyleImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQElEQVQ4jWNgGAXo4D8DA4M9Hnl7qBqCCrAZgk+OoEKiNWPTQLJmdEPI0kyxARR5gaJApDgaqZKQCAGyYgQnAAB0ERxLFkz7bAAAAABJRU5ErkJggg==')";
            else
                btn.style.listStyleImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAeklEQVQ4jdWSyxGAIAxE39WbHdgJLdCLJVgbpVBHxksYMyj/k+/CgeyGZIE/cKyKBXArJk5N/IjIA0GFAsSRl1wq8MCupwBnb+eoQpjYQeA961AKYrqXqBq2DDatKfI1giWlUy2wS7TsPOlUyWNMUUa96yL/SK3R5rkBybEfI1071/QAAAAASUVORK5CYII=')";
        }
    }

    moveReloadIntoURL();
})();