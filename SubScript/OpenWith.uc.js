// ==UserScript==
// @name           OpenWith.uc.js
// @description    用其他浏览器打开页面、链接、书签及标签
// @author         ding
// @include        main
// @version        2018.2.3.1
// @homepageURL    https://bbs.kafan.cn/thread-2114879-1-1.html
// @startup        window.OpenWithManager.init();
// @shutdown       window.OpenWithManager.destroy();
// @note           适配Firefox57+
// ==/UserScript==
location == "chrome://browser/content/browser.xhtml" && (function () {
  
    const MENU_NAME = "外部打开";
  
    //是否使用二级菜单
    const USE_MENU_AREA = false; //页面
    const USE_MENU_TAB = false; //标签
    const USE_MENU_PLACE = false; //书签
  
    function getFirefoxPath(){//firefox.exe所在路径
        return OS.Constants.Path.libDir;
    }
    function getRootPath() {//firefox所在盘路径
        var path = getFirefoxPath();
        var index = path.indexOf(":");
        return path.substring(0,index+1);
    }
    //修改内容后请将脚本改名来保证加载的是最新，或使用无缓存的userChrome.js
    //相对路径：path: OS.Constants.Path.libDir+ "\\..\\..\\..\\Program Files\\Internet Explorer\\iexplore.exe"
    var browsers = {
        IE: {
            enable: false,
            name: "IE",
            path: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABDlBMVEUAAAAAf39VVao/f78zZpkqf6okbbY/f784cakqf6o6dbAvb68teLQzcrI4cbM0eLQydK4xeLE2c7A1dbAzdrMzdLEzd7Myd7E0dLAydLIzdbMydbEzdrM0drAydrI0dbI0drI0dbAzdrEydbIydrEzdrEzdbI0dbEzdbI0dbI0drI0drE0dbE0drIzdbI0dbEzdbEzdrA0dbI0dbE0drE0dbIzdbI0dbE0drIzdbI0drIzdLI0dbI0dbIydbA0dLEydrI0drIzdrI0dbE0drAydbIydrEzdLAydrIzdrA0dLIzdLI0drA0dbIydrA0dLAydLI0dLA0dLI0drA0dLAydrI0drA0dLI0dLI0drJFyzboAAAAWXRSTlMAAgMEBQYHCAkMDRARFBsiIyQqNDY7QEJERkpMVFhaXWFiY2RpbHF6fH5/g4SMj5GUlZaYm5yjpaapqq2wtLa4u77LzM3Oz9DY2tvf4Obn6uzu8PT19vj5/YY/MsoAAAC1SURBVBgZTcGJOgIBGIbRN0RmhmRQJEKTLbTZUpIi+67pu/8b8efJk3MYmSvfX+4xFPOThbDkkZ5lIH7Sk/RVcIjNY1Y+3097Mg8JpoCF8CL5pl+PHhDpHiZe1di/lSkCS+funSoQvZH0PQ05tyaVgiBoyqTAy+ifLDgvkrb8oRnYllkD1g+Mw/izzJM/kQkldWBRNY0sw0YneqU/u0C6HZk86mvgYxMzdnxdza/u1FtnORfzA76xL0zsUvxRAAAAAElFTkSuQmCC"
        },
        Chrome:{
            enable:true,
            name:"Chrome",
            path:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACSklEQVQ4jX2QT0jUcRDF35ufbq5pEiVRUGSUFYIV7hpCoQsiq0YUdSvBwFCoUDqU9G8LPAR1rhYEUY+ZBK6hIatLoRVmFCQdOiTZIbwklbnib6aDf3bdjR58YRjevPnOh0jRTFmZ31VtErJCzXYAgABTJjIsZDh/dHQ82c+V4nt5eQ7j8Qcg61JDk2VA+5zHc6kgFptfDfhWUpKd6fFEARz+33CShvJnZ2s5ObkgAODNytoMoDjVpYCpqvuPF5jJy2sDANb0VAUU4u26/8MH8g4AmFnUHOf6dFHRW184vAjSAMCGyzPWbKiIuQz2BrsI+M8N/fFXTMTfA/jcerThdP9W/z0SZ1VBEt1NBdHWm7ueDwqkNMHDHgoNRwjs66hcV0+ghWRzZJvvLolGAOtFkE2iMfwl0CZ0WtYCtUqhYfvSwXK74eqWF/ljY58EPJOGTVknxZExVfuVaMpOWSkp2LRg87eW3ZI6D4Et77VEqJoY8XU1BLxY21O5R8HutABDp36o9olIblLoVAaJEQAFy61ME+fRxoXxE7Men0FZB4HB0JnjeK+YyVMmZRISZW1vValBXq+9V2NCXo6cGpwIhUICAKGTb2pA6UtYYCL0EQCqnwQ7SNSncVP9KSKv+gtzj7mLvz8KuTtxEcLOgf4mAQAnM+MCVF+mc5Mcc3nN3LmWlOFhet3mJQ+AyPHIXLa7oQpAOxSrlI3ofLaf06p6Y+XbBoTpdaulcCC+xCFFwcfBQyJ2Xg1lok51316ETBmgYITmhuXgwLtk/198KfCC5H3+pQAAAABJRU5ErkJggg=="
        },
        Edge:{
            enable:true,
            name:"Edge",
            path:"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACGUlEQVRIibVWr28TcRR/4kQX2vW+7yoQiMoJBAKBqKhATCD4ExATkxMENfFNJknWZL33vkGQCgQJE4glTCAqJiYqlqwp1/u+bzKxBASiAlExUQS90vau15aVT/Lc+34+7/cdwBIoimuK7Ftke6lIBopkgMZ10NhTDOO90ru4sowjEz7HLxW7G2QZLbGhH8rB6szUKwZsz1YgnrGA7dnybKhXVOQu1iWfmLG3leP+08VlMdLMeqjY/vRZ2mhcS5GcI8mPxSKuA1p7afJGVJ+LJkJ2R4riWspZay8g+wpZhlkiZe7vpwVY2sgyUmTvsBlp0NoDrT0/lIPMiACgzP39zIxJBjP92DqRR2PyK5/sk6QfyO4rsm3ktQ2Nvc1semgPJ05BaA8VuQugXhEA4AH1HqJxHWQZbZ/IszyBgOIPCxp+OuXkTEIOAOCTfJ44ktv1G1F9kSmS8+zBkO7fMKbIFcW1fx7TOctMOWn2fxGovOmX0LjvmxKovO+XZgRKzXhnU+TIMkyXZ37ZWEZV3S7kTdFaKJpvj1Np5t2WdVHV7UJ63NzHjQkAACiWbtbSrFKqqm4XlIle5DqNj1jGfbFX2LSvJ6ckgdZewPY5GtdCsr8Wzn+CMl8rxfLlXvN//GkrVwTJ7Sqydxvd4Hn4jaie+2G5rwDA+KqyvVxnuZDd0coC0yVD41qKpavY3Uzbn18Y18Iw3ps+mgl+A9E4JERQR7sXAAAAAElFTkSuQmCC"
        },
        Opera:{
            enable:false,
            name:"Opera",
            path:"",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAABxklEQVQokYWTQWtTQRSFv3sTA0oV3FRKS4MighQRrKBYRJeCdqN5Biy4cJH/4KpL8Te4qWBtEyOCtCoILhJQlCBSRXChpAlU3AgKtaX0zXFR83xPHnhXM/d+58wZmDFS9S2KhjZ9o2boMsGO4ewj8BMPK5I9LJW27ozce74+4G2wWK1ePCtswWEUgEAbU0uyKXPOA4QQ+kV5day59CoR969On44tfuH4bgBJ98uN5ZmBca96qQFEO57hl5nOlRefdvxDFJWE5gfCACrKbqavI7aTveN7FBfmO7XJXb7XN69hHEqGQe9GHyz10uJy/dlnoU8J4xwZ/jESuUmVNIjbe3LKsJVMmsAVB05kKGktT4z0NWNmTHqwMJw9wjZyxWbrmb044A5xLvyfChB7kK9m02koDxZk+k7ouhntf7jRPLGJkWzDWw6ay0I6nptTTGRza87L9eW24MnfPD7Rq0wfTnPdyvRBnKOJj3g03lx+4wDbZjcI6iZD0239eboCc49vpRJ8KRaoQepj9GcujMVbxaY7pwBC4LWZWiabwjmzE5WXKnhUXny8lhEDaHbW+x/fVoPpOgoncfaDf7egDm53x+tLDQMN+N9FzrK3IXGG5QAAAABJRU5ErkJggg=="
        },
        FireFox:{
            enable:false,
            name:"FireFox",
            path:"",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAABHVBMVEUAAAD/f38/f7/akUjni0Xpfz/riTrsf0jyjD/Tg08jlL0hk7rpij/liULrhj7qiT7rh0HqiD/kiUbkh0EilLwjlLsrkLjdiEbhh0nfikfeh0jdiEbfiUffh0fghkbTh014jYavi2PhiEXhh0UjlLwklLvQiU7dh0jeiEXjh0Lfh0bhiUXjiUTqh0DmiEPih0Qhkrroh0LoiEHoiEIjkrq0imEjlLwolLkolLouk7Yxk7Mzk7I9k6xEkqhIkqVKkqRPkaFQkaBhkJZlkJRukI5yj4t9joR9j4WTjXeZjXOdjXGjjG6sjGiyi2S3i2C4i2C6i1+8i17Ci1rOilLRiVHSilDTiU/Xik3diUnfiEjmiUTpiELqiEDriEHsiEBADhTDAAAANnRSTlMAAgQHCwwNDhQdKy0wMjU9QlhiaY2XmJ+kqK2usrO4wsXN1dja2t3l5unr7O7v9/j6+vv7/v6MjNp+AAAAsElEQVQIHQXBA2IDAAAEwa1t27YuNdKmtrn/f0ZnAGjomlxdnequB4C28s7Nwl6So62xOqBsafT07LaQZOf8a6UJalWvkyTZ/5ivoF3Vh+MkyaUdzKl6kSTJsyNMq7/vxSTJ9p3rLKuvhSRJim+us6j6dHp1f5iUdIFBVf0s7ebgRgdoVf0ubScnLz/aAsOqf49Xd7/qEFAzoaqq49UAVf2qqn2VAEBz7+zG2kxPI8A/m2E1d8xSFegAAAAASUVORK5CYII="
        },
          
        others:{
            enable:false,
            name:"360极速",
            path:"D:\\Program Files\\360Chrome\\Chrome\\Application\\360chrome.exe",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADBElEQVQ4jXWTb0zUdRzHP7FylLPMGLOF5M5MRjGmRMj946yjQZ4e4EDJWWba1oZOZz3xQbtkaxeQRiSxUbb1Z7e5zK3WKDdxi/UARJ2eBzmyc3LccbuRccfd/f7c/V49AIRovrfXs+/79dln+3xFluTdHxL5TT61fftX2pe/dqhFI/XqoH+bmrzhViKje9T3g3uDuUs799L0neJ09uoRe4/O1l5tbNit3Lz+qop/EYE65ebw2+FH/lfe9Y2y3dGjp6u6dWzdOm+2qtP91iS/b0kx/Eqaa7XKgsitRBckHk/O0Z/iec4ePWI/pWP/bJb39iQ5Uxrnx/I4580zDDhSDFWnuVozJ3JrFz3iyZGD3/Lo7q+zh21dOrbOBVrq45wqnOL0+rv4SqY5V5bgl8oZfqtKqJddsQvXG8J2ERFxeC4+uOO0dsh6Usd6Usd6YpaGA0mOL4/Slhfj04Ipzq3tJ7K6QlVWi6oW50/oNRWdHK5bKVvCJ85W3/7c91L3TMzSoWOew+LVOPRElGO5IQLLnaQeENK5gpovaOuXkXnhSWiy+eTlyY+D1kgb1mAX5i/C2UqvRqVXY7NX4/aEwfiISvJZmRWsENSnBL14BdkXC8BVFpOa6Cfj1kgb81Re8lH+cx8bv+/jyt8hQvEA2QFBfUdIPyZohUKm5HEMy9Pg3nRXXJOd1xYLKu58QOnYUTb491F4qYrjVx7CCAjZQUE/IGimHDIb8zFsJthpHpW6ya6u+bJ54kPKgsd4brQF09Vm1g2VEvlT4JZgjAnZAUErntvf8Qy8VdMq+0O9BVXh9vGl09cMuTlyowiiORAWCAncETKND8/uv3XTrekjjatERMQW6Si2hbxTi6cf/KM6TaIc4iXwzwaYWguxPIx2k9+wrZtmb+3m/5yyI+hZaf7L02kZaTl7JtrsJ+MCrRY0JygOSFkgUU6m3/66al7z/H0/lKruKMJoSGDUc4+sGzIu0Ov7AoHGZfctzwdln4ns7o8wmgcwdvkxXhsk+0ZrKrW/YOnbfwGaHza07T0rkAAAAABJRU5ErkJggg=="
        },
          
        all:{
            enable:false,
            name:"所有浏览器",
            image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABfVBMVEUAAAAcjbwijMIimM8nm9UnoNkooNonoN4loOLurVS+snG/xYOUtZgloN381GJEREDrrFLzvlfcynK7vn7Dv3Y1n82AsqWTup/gznL81GFEREBEREDsrVHtslP40mHoyWK0u4FfrLpBps7rz2jw0WbvzmjMrFZEREDsrlL2yVzty2AvntN0sqo1pNUqoNtKqMY9o9Fdp7d2rKTtrFPuymCvuoGYtpC8xIb30mLkyGbox2LgyWo2i7OyvYPEwHeXuZtfrr80pNX30mP40WAgiL0on9hWrL/y0mfuy2H50mAgiL0mndeCuKj302FDn8JDoMN2s6771GIgi78klMmSuZ6iv5JosLn71GEdicQhir8kntz30mPv0GYrm9NIqMn50mL+0mMfi78gj8Qnn9zRyHknot3Kx3wgjsJYprVKob0nod8nouApd5wkiLgmlMoknNUnoN8not8spt1EREAontkon9onot4not8nod7yzWDwy2D71GL602IpndcpnNWyKzl3AAAAdHRSTlMAG3+r3PXXiRtbrbzE9FsBXcbGw8by3NjHWQEEHNz04MPb59LWzSAFi8Hw+N/4/N7q1nrW18TEwPHW3bjnw8XC1PHq+Pj419nr+NTbxujm5crSh7/DwNCFGt305Nb84fEXWMT+w/1OvdHg8FMgf6zX0IIXCfpjDT4AAADLSURBVBgZXcGxK0QBHMDx7ze5Uq+ewfSyKHJ1SREWkwy6UtcNItNl8dfYGCxMSgYpdZMy4wpdBmHFovAG9Yafd5fJ5yP/SMk/P4DAkLqt7vlFKgzbsxUH9jGqm0e6xol9VG2cqXXalt5lVl0K4NJSVxbtmYfrBePqQpZ1jpu3FW9nYqDTlrpOw31t8E5rD6fSdPx5kseqUbxMPB3LunandCyKeNVDoaV2VqMIPtxPBVoVHSmCb3czBbKmWlR0J9s4F9IkyfNPSmmS5L+9fjn4t8/zTwAAAABJRU5ErkJggg=="
        }
    };
  
    if (window.OpenWithManager) {
        window.OpenWithManager.destroy();
        delete window.OpenWithManager;
    }
  
    function $(id) {
        return document.getElementById(id);
    }
  
    window.OpenWithManager = {
        useMenu: false,
        getTypeDesc: function (type) {
            switch (type) {
                case "page":
                    return "本页";
                case "link":
                    return "链接";
                case "tab": return "标签";
                case "bm": return "书签";
            }
            return "";
        },
        buildMenuName: function (label, type) {
            return "用 " + label + " 打开" + this.getTypeDesc(type);
        },
        attachNode: function (anchorNode, node) {
            if (this.useMenu) {
                anchorNode.appendChild(node);
            } else {
                anchorNode.parentNode.insertBefore(node, anchorNode);
            }
        },
        createMenuPopup: function (anchorNode, type) {
            let menu = document.createXULElement("menu");
            menu.setAttribute("label", MENU_NAME);
        menu.setAttribute("accesskey", "O");
            menu.setAttribute("id", "openwith-menu-" + type);
            menu.setAttribute("class", "menu-iconic openwith-menu open-" + type);
            menu.setAttribute("image", browsers.all.image);
            anchorNode.parentNode.insertBefore(menu, anchorNode);
  
            let popup = document.createXULElement("menupopup");
            popup.id = "openwith-popup-" + type;
            menu.appendChild(popup);
            return popup;
        },
        createMenuItem: function (anchorNode, id, browser, type) {
            let menuitem = document.createXULElement("menuitem");
            menuitem.id = "openwith-m-" + type + "-" + id;
            menuitem.setAttribute("label", this.buildMenuName(browser.name, type));
            menuitem.setAttribute("oncommand", "OpenWithManager.openWithOtherBrowser(this,'" + id + "','" + type + "')");
            menuitem.setAttribute("class", "menuitem-iconic openwith-menuitem open-" + type);
            if (browser.image) {
                menuitem.setAttribute("image", browser.image);
            }
            this.attachNode(anchorNode, menuitem);
        },
        createBrowserMenu: function (anchorNode, type) {
            for (let key in browsers) {
                try {
                    if (browsers[key].enable) {
                        this.createMenuItem(anchorNode, key, browsers[key], type);
                    }
                } catch (e) {
                    alert(e.message);
                }
            }
        },
        //contentAreaContextMenu
        initContentAreaMenu: function () {
            var inspos = $("inspect-separator");
            let sep = document.createXULElement("menuseparator");
            sep.setAttribute("class", "openwith-menuitem");
            sep.setAttribute("hidden", "true");
            inspos.parentNode.insertBefore(sep, inspos);
            this.useMenu = USE_MENU_AREA;
  
            var anchorNode;
            if (this.useMenu) {
                anchorNode = this.createMenuPopup(inspos, "area");
            } else {
                anchorNode = inspos;
            }
            //链接部分
            this.createBrowserMenu(anchorNode, "link");
  
  
  
            //控制链接菜单的显示
            inspos.parentNode.addEventListener("popupshowing", this, false);
  
            //页面部分
            this.createBrowserMenu(anchorNode, "page");
  
        },
        //tabContextMenu
        initTabContextMenu: function () {
  
            var inspos = $("context_closeTabOptions");
            let sep = document.createXULElement("menuseparator");
            sep.setAttribute("class", "openwith-menuitem");
            inspos.parentNode.insertBefore(sep, inspos.nextSibling);
  
            this.useMenu = USE_MENU_TAB;
  
            var anchorNode;
            if (this.useMenu) {
                anchorNode = this.createMenuPopup(sep.nextSibling, "tab");
            } else {
                anchorNode = sep.nextSibling;
            }
            this.createBrowserMenu(anchorNode, "tab");
  
        },
        //placesContext
        initPlacesContextMenu: function () {
  
            var inspos = $("placesContext_openSeparator");
            //let sep = document.createXULElement("menuseparator");
            //inspos.parentNode.insertBefore(sep, inspos);
  
            this.useMenu = USE_MENU_PLACE;
            var anchorNode;
            if (this.useMenu) {
                anchorNode = this.createMenuPopup(inspos, "place");
            } else {
                anchorNode = inspos;
            }
            this.createBrowserMenu(anchorNode, "place");
  
            //文件夹显示
            inspos.parentNode.addEventListener("popupshowing",this, false);
        },
        handleEvent: function (event) {
            if(event.target.id=="placesContext"){
                var isFloder = false;
                try {
                    let selectedNode = PlacesUIUtils.getViewForNode(event.target.ownerDocument.popupNode).selectedNode;
                    isFloder = !selectedNode || selectedNode.hasChildren;
                } catch (e) {
                }
                let menus = $("placesContext").querySelectorAll(".open-place");
                for (let menu of menus) {
                    if (isFloder) {
                        menu.hidden = true;
                    } else {
                        menu.hidden = false;
                        menu.disabled = false;
                    }
                }
            }
            if(event.target.id=="contentAreaContextMenu"){
                let menus = $("contentAreaContextMenu").querySelectorAll(".open-link");
                let menuspage = $("contentAreaContextMenu").querySelectorAll(".open-page");
                for (let menu of menus) {
                    if (gContextMenu.onLink) {
                        menu.hidden = false;
                    } else {
                        menu.hidden = true;
                    }
                }
                for (let menu of menuspage) {
                    if (gContextMenu.onLink) {
                        menu.hidden = true;
                    } else {
                        menu.hidden = false;
                    }
                }
            }
  
        },
        init: function () {
  
            //contentAreaContextMenu
            this.initContentAreaMenu();
  
            //tabContextMenu
            this.initTabContextMenu();
  
            //placesContext
            this.initPlacesContextMenu();
  
        },
        destroy:function () {
            $("contentAreaContextMenu").removeEventListener("popupshowing", this, false);
            $("placesContext_openSeparator").removeEventListener("popupshowing", this, false);
  
            let menus = document.querySelectorAll(".openwith-menu"),
                menuitems = document.querySelectorAll(".openwith-menuitem");
            for(let menuitem of menuitems){
                menuitem.parentNode.removeChild(menuitem);
            }
            for(let menu of menus){
                menu.parentNode.removeChild(menu);
            }
        },
        openWithBrowser: function (url, path) {
            if (!path) {
                alert("浏览器路径未设置 ");
                return;
            }
            if (path == "microsoft-edge") {
                //edge用url打开
                var cmdUrl = path + ":" + url;
                let win = window.openDialog(cmdUrl, "", "chrome");
                win.close();
                return;
            }
  
            let clientApp = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
            clientApp.initWithPath(path);
            if (!clientApp.exists()) {
                alert("浏览器路径错误: " + path);
                return;
            }
            try {
                let ss = Cc["@mozilla.org/browser/shell-service;1"]
                    .getService(Ci.nsIShellService);
                ss.openApplicationWithURI(clientApp, url);
            } catch (e) {
                let p = Cc["@mozilla.org/process/util;1"]
                    .createInstance(Ci.nsIProcess);
                p.init(clientApp);
                p.run(false, [url], 1);
            }
        },
        openWithOtherBrowser : function (obj, id, type) {
            var url;
            switch (type) {
                case "page":
                    url = gBrowser.currentURI.spec;
                    break;
                case "link":
                    url = gContextMenu.linkURL;
                    break;
                case "tab": {
                    let tab = TabContextMenu.contextTab; 
                    let bw = tab && tab.linkedBrowser;
                    url = bw && bw.currentURI.spec;
                }
                    break;
                case "place":
                    url = PlacesUIUtils.getViewForNode(document.popupNode).selectedNode.uri;
                    break;
            }
            if (url) {
                if (id == "all") {
                    for (let key in browsers) {
                        let browser = browsers[key];
                        if (browser.enable && key != "all" && browser.path) {
                            this.openWithBrowser(url, browser.path);
                        }
                    }
                } else {
                    let browser = browsers[id];
                    this.openWithBrowser(url, browser.path);
                }
            }
        }
  
    };
    OpenWithManager.init();
})();
