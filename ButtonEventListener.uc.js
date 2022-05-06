// 03. 自动恢复地址栏地址显示 
if (location.href.startsWith('chrome://browser/content/browser.x')) {
    var ub = document.getElementById("urlbar-input");
    ub.addEventListener("blur", function () {
        gURLBar.handleRevert();
    }, false);
}

// 04. 中键点击地址栏自动复制网址 
if (location.href.startsWith('chrome://browser/content/browser.x')) {
document.getElementById('urlbar').addEventListener('click', function(e) {
	if (e.button == 1)  var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);gClipboardHelper.copyString(gBrowser.currentURI.spec);  
}, false);
}


// 05. 双击地址栏 显示或关闭书签栏 
document.getElementById("urlbar-input").addEventListener('dblclick', function(event) {
var bar = document.getElementById("PersonalToolbar"); setToolbarVisibility(bar, bar.collapsed);
});

// 06. 双击 空白处 显示或关闭关闭书签栏 
/*
gBrowser.tabpanels.addEventListener('dblclick', function(event) {
var bar = document.getElementById("PersonalToolbar"); setToolbarVisibility(bar, bar.collapsed);
});
*/


// 07. 左键「侧边栏」显示历史
(function(doc) {
    var viewHistorySidebar  = doc.getElementById('sidebar-button');
    if (!viewHistorySidebar ) return;
    var menupopup = viewHistorySidebar .firstChild;
    viewHistorySidebar .addEventListener("click", function(e) {
        if (e.button == 0) {
    e.preventDefault();
            e.stopPropagation();
    //document.getElementById('toolbar-context-menu').style.display="none";
    SidebarUI.toggle("viewHistorySidebar");
    setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
        }
    }, false);
})(document);


// 08. 右键「侧边栏」显示书签
(function(doc) {
    var viewBookmarksSidebar  = doc.getElementById('sidebar-button');
    if (!viewBookmarksSidebar ) return;
    var menupopup = viewBookmarksSidebar .firstChild;
    viewBookmarksSidebar .addEventListener("click", function(e) {
        if (e.button == 2) {
    e.preventDefault();
            e.stopPropagation();
    //document.getElementById('toolbar-context-menu').style.display="none";
    SidebarUI.toggle("viewBookmarksSidebar");
    setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
        }
    }, false);
})(document);


// 09. 双击 侧边栏顶部  切换停靠位置
(function (doc) {
    var SidebarFloat = doc.getElementById('sidebar-header');
    if (!SidebarFloat) return;
    var menupopup = SidebarFloat.firstChild;
    SidebarFloat.addEventListener("dblclick", function (e) {
        if (e.button == 0) {
       var key = "sidebar.position_start"; Services.prefs.setBoolPref(key, ! Services.prefs.getBoolPref(key)); 
        }
    }, false);
})(document);



// 10. 右键「历史按钮」恢复最后关闭的标签 
(function(doc) {
    var UndoClosedTabs  = doc.getElementById('history-panelmenu');
    if (!UndoClosedTabs ) return;
    var menupopup = UndoClosedTabs .firstChild;
    UndoClosedTabs .addEventListener("click", function(e) {
        if (e.button == 2) {
    e.preventDefault();
    e.stopPropagation();
    //document.getElementById('toolbar-context-menu').style.display="none";
    setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
          undoCloseTab();
        }
    }, false);
})(document);



// 11. 右键「下载按钮」打开下载历史 
(function(doc) {
    var ShowAllDownload = doc.getElementById('downloads-button');
    if (!ShowAllDownload) return;
    var menupopup = ShowAllDownload.firstChild;
    ShowAllDownload.addEventListener("click", function(e) {
        if (e.button == 2) {
    e.preventDefault();
            e.stopPropagation();
    //document.getElementById('toolbar-context-menu').style.display="none";
    DownloadsPanel.showDownloadsHistory();
    setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
        }
    }, false);
})(document);


// 12. 右键「三道杠」列出当前打开标签 
(function(doc) {
    var OpenAllTabs = doc.getElementById('PanelUI-menu-button');
    if (!OpenAllTabs) return;
    var menupopup = OpenAllTabs.firstChild;
    OpenAllTabs.addEventListener("click", function(e) {
        if (e.button == 2) {
    e.preventDefault();
    e.stopPropagation();
    //document.getElementById('toolbar-context-menu').style.display="none";
        document.getElementById("button_treestyletab_piro_sakura_ne_jp-sidebar-action").click();  Services.prefs.setBoolPref("sidebar.position_start",false); 
    setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
        }
    }, false);
})(document);




// 13. 右键「地址栏书签图标」 打开书签管理界面 
(function(doc) {
    var OpenPlacesOrganizer = doc.getElementById('star-button-box');
    if (!OpenPlacesOrganizer) return;
    var menupopup = OpenPlacesOrganizer.firstChild;
    OpenPlacesOrganizer.addEventListener("click", function(e) {
        if (e.button == 2) {
            e.preventDefault();
            PlacesCommandHook.showPlacesOrganizer('AllBookmarks');
        }
    }, false);
})(document);




// 14. 右键「新建标签按钮」访问剪切板内容  
location.href.startsWith('chrome://browser/content/browser.x') &&
window.addEventListener("click", function(e) {
if (e.button === 2 && (e.originalTarget.matches("#tabs-newtab-button")||e.originalTarget.matches("#new-tab-button"))) {
    let url = readFromClipboard();
    try {
        switchToTabHavingURI(url, true);
    } catch (ex) {
        url = 'https://www.baidu.com/s?wd='+ encodeURIComponent(url);
        switchToTabHavingURI(url, true);
    }
    e.preventDefault();
    e.stopPropagation();
    setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
    // document.getElementById('toolbar-context-menu').style.display="none";
}
}, false);


// 15. 中键「新建标签页按钮」恢复关闭的标签页 
(function() {
var ucjsUndoCloseTab = function(e) {
    // Nur mit Mittelkick
    if (e.button != 1) {
        return;
    }
    // Klick auf Tab-Leiste und die Neuer Tab Schaltfl?chen
    if (e.target.localName != 'tabs' && e.target.localName != 'toolbarbutton') {
        return;
    }
    undoCloseTab(0);
    e.preventDefault();
    e.stopPropagation();
}
// Schaltfl?che Neuer Tab
document.getElementById('new-tab-button').onclick = ucjsUndoCloseTab;
// Tab-Leiste
gBrowser.tabContainer.addEventListener('click', ucjsUndoCloseTab, true);
window.addEventListener('unload', function uninit() {
    gBrowser.tabContainer.removeEventListener('click', ucjsUndoCloseTab, true);
    window.removeEventListener('unload', uninit, false);
}, false);
})();




// 16. 右键「地址栏刷新按钮」 强制刷新页面（跳过缓存）
(function() {
    var UndoClosedTabs = document.getElementById('stop_reload_button');
    if (!UndoClosedTabs) return;
    UndoClosedTabs.addEventListener("click", function(event) {
        if (event.button == 2) {
            event.preventDefault();
            BrowserReloadSkipCache();
            setTimeout(e=>document.getElementById("toolbar-context-menu").hidePopup(), 0);
        }
    }, false);
})();




// 17. 搜索后自动清除搜索栏内容 
(function () {
if (BrowserSearch.searchBar && BrowserSearch.searchBar.textbox) {
        BrowserSearch.searchBar.textbox.addEventListener("blur", function () {
            this.value = "";
        }, !1);
    }
})();



// 18. 失出焦点自动关闭查找栏 
(function() {
function closeFindbar(e) {
    if (!gFindBar.hidden) {
        if (e.target.id != "findbar-container") {
            gFindBar.close();
        }
    }
}
addEventListener('blur', closeFindbar, false);
})();



// 19. Ctrl + F 显示/隐藏查找栏 
(function() {
if (location == 'chrome://browser/content/browser.xhtml') {
document.getElementById('cmd_find').setAttribute('oncommand',
  'if (!gFindBar || gFindBar.hidden) { gLazyFindCommand("onFindCommand") } else { gFindBar.close() }'
);
};
})();




// 20. 修改按钮名称和增加文字说明
(function () {
cars = ['2'];
for (var i = 0; i < cars.length; i++)
{
setTimeout(function () {

document.getElementById('PanelUI-menu-button').setAttribute("tooltiptext","左键：打开菜单\n右键：列出所有标签");
document.getElementById('star-button').setAttribute("tooltiptext","左键：将此页加入书签\r\n右键：打开书签管理器");
document.getElementById('reload-button').setAttribute("tooltiptext","左键：刷新当前页面\r\n右键：强制刷新当前页面");
document.getElementById('tabs-newtab-button').setAttribute("tooltiptext","左键：刷新当前页面\r\n右键：强制刷新当前页面");

}, cars[i] * 1000); //单位: 1秒
}
}) ();