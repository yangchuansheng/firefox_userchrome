// ==UserScript==
// @name          QuickOpen.uc.js
// @description   QuickOpen 快速打开指定选项
// @author         Runningcheese
// @namespace   https://www.runningcheese.com
// @include        main
// @license         MIT License
// @compatibility  Firefox 73+
// @charset        UTF-8
// @version        v2020.02.03 for 73+ 
// @version        v2019.12.22 for 72+ 
// @version        v2019.12.20 for 71+ 
// @version        v2019.09.23 for 70+ 
// @version        v2019.05.25 for 67+ 
// @version        v2018.12.19 for 64+ 
// @version        v2018.11.12 
// @version        v2018.04.27 
// @version        v2018.04.11 
// @update        v2018-03-18 for 57+
// @version        v2017.04.02 
// @version        v2017.02.05 
// @version        v2016.01.05 
// @homepage    https://www.runningcheese.com/firefox-v10
// ==/UserScript==

//载入脚本
function jsonToDOM(json, doc, nodes) {

    var namespaces = {
        html: 'http://www.w3.org/1999/xhtml',
        xul: 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'
    };
    var defaultNamespace = namespaces.html;

    function namespace(name) {
        var m = /^(?:(.*):)?(.*)$/.exec(name);        
        return [namespaces[m[1]], m[2]];
    }

    function tag(name, attr) {
        if (Array.isArray(name)) {
            var frag = doc.createDocumentFragment();
            Array.prototype.forEach.call(arguments, function (arg) {
                if (!Array.isArray(arg[0]))
                    frag.appendChild(tag.apply(null, arg));
                else
                    arg.forEach(function (arg) {
                        frag.appendChild(tag.apply(null, arg));
                    });
            });
            return frag;
        }

        var args = Array.prototype.slice.call(arguments, 2);
        var vals = namespace(name);
        var elem = doc.createElementNS(vals[0] || defaultNamespace, vals[1]);

        for (var key in attr) {
            var val = attr[key];
            if (nodes && key == 'id')
                nodes[val] = elem;

            vals = namespace(key);
            if (typeof val == 'function')
                elem.addEventListener(key.replace(/^on/, ''), val, false);
            else
                elem.setAttributeNS(vals[0] || '', vals[1], val);
        }
        args.forEach(function(e) {
            try {
                elem.appendChild(
                                    Object.prototype.toString.call(e) == '[object Array]'
                                    ?
                                        tag.apply(null, e)
                                    :
                                        e instanceof doc.defaultView.Node
                                        ?
                                            e
                                        :
                                            doc.createTextNode(e)
                                );
            } catch (ex) {
                elem.appendChild(doc.createTextNode(ex));
            }
        });
        return elem;
    }
    return tag.apply(null, json);
}


//定义按钮
CustomizableUI.createWidget({
    id: 'QuickOpen',
    defaultArea: CustomizableUI.AREA_NAVBAR,
    label: '快捷工具',
    tooltiptext: '快速打开指定选项',
    onCreated: function(aNode) {
    aNode.setAttribute('type', 'menu');    
        
 //定义菜单      
        var myMenuJson = 
                                ['xul:menupopup', {id: 'QuickOpen_pop', position:'after_end'},
                                ['xul:menuitem', {label: '我的电脑',oncommand: 'QuickOpenMyComputer();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkAgcPNTlQfpVuAAAAuUlEQVQoz32RMQrCQBBFn1pobbFNOot0auMV9AaewMJSECwEa89gLaQRPYSohSDYWNuIokIai5AgYSyWuIFsMtv85b1hZlnI1pA9BTVAWBcJD1645lr5pzod4EPAHAfFm9hoVRZ8EYQzW2IE4UbPCB5iOQENjVtWLMyS/rEVHzUsA8r6mosR7lahaWI3Z4cJJS3U8HOUkR4R4lmHCLskukSW/k3anmbwEyf9Fwci2visWBKiONHnCvADq1hupO6nJmcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDItMDdUMTU6NTM6NTcrMDA6MDAS1u24AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAyLTA3VDE1OjUzOjU3KzAwOjAwY4tVBAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAASUVORK5CYII='}], 

                                ['xul:menuitem', {label: '管理书签',oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');", class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATElEQVQ4jWNgGGzgPxZMkmZSxAnaTAzGsOEomoKjxLj6P5oAKWEwXA04ysDAYMWACFCSDJjFwMDADmWzQ/kkGUAqoI4BMAbZKZEiAAA7FFJDJW1v5AAAAABJRU5ErkJggg=='}],                   
                                ['xul:menuitem', {label: '清理痕迹',oncommand: 'window.open(\'chrome://browser/content/sanitize.xhtml\', \'Toolkit:SanitizeDialog\', \'chrome,resizable=yes\');',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt6r1GAAAAJHRSTlMAzVQUwp9BDPLTp3dwPDUsGPvn39vHtauPh35sZlxMJB736yg/5R5gAAAAhklEQVQY01WPVxLDMAhEJatb1b07TsL9z5goGmckPoB5DAuL7InKoE1VAkLBlESMsKKD8QzVMDagLpITaB3u/mIPCdJRExg+Eqjgyac1Tli/RRDaap5jcxIv02k9/WoY6J6WNPsmvyGLb92BI4H2HrsbvJWovegyF2a5XrhwpTS2hSW+pNc/dQcGVNn7bGYAAAAASUVORK5CYII='}],                             
                                ['xul:menuitem', {label: '故障排除',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:support", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4jbXSIQ4CQQyF4S9ZNwaJ4hZ4FII74LEruQASg0buCbDY1XsFDoBCIUFsSUYAu7DwkknaTPu3My0/1gh7NKhRIn0K2eCMJQ4B6oSkqJZDmrCr8N9qgVsWmHANe4pTF2CJY1StsMuSRrh0AR5VxljHWcXdrE8HooNnb03aj9x3AcYR2GAbCVUAekNgrp3IKgDHbyAPFf+EbIdAJnqM9hWkzmAfq9AuXaldsOG6A+IHLLa/+ULtAAAAAElFTkSuQmCC'}], 
                                 ['xul:menuseparator', {}],
							   ['xul:menu', {label:'自定义设置' ,class:'menu-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4ja3SPUpDQRAH8B9KJJAUKYR0KYw2Sho7sVDBE4iWaS2CnkAvkICdrU3AE9ioB/ADtLEQQaN9UFOoYBUtnKfmQUgEB5Z57/8xO7O7/FMsYGVI7Wroe+ISXZxjqY9xMfguLtLkGeaiiwec4AatyKeBr2A+/nuihdKQI5RwnwaeUBmywGzovzfcx1Z8F6JQBRMYj5xghdBthw+8oIg9dHAVq4XHyAnWCV0xfOANdRwgN6D9XOjqeEUe3mOmMkZxjEbK2MBR8GU8hw8/dzuCqWitnSrQDnwydMmbARv4wAzGcI1mqkAz8DFMh34zITO+Hs5hMtOAMzgMfeY3kcUObrGLGqpYi1wL/C502X475LEcpvVfqxr4oA7/Hp/fA0aywESMdQAAAABJRU5ErkJggg=='},
                               ['xul:menupopup', {},
                               ['xul:menuitem', {label: '菜单',oncommand:'addMenu.edit(addMenu.FILE); ',onclick:'if (event.button == 2) { if (event.button == 2) { event.preventDefault(); setTimeout(function(){ addMenu.rebuild(true); }, 10);}}',class:'menuitem-iconic', tooltiptext: 'addmenu.js\n左键：编辑配置\n右键：重载配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAQlBMVEUAAADr6+v8/Pzh4eGSkpJVVVVERERBQUErKyscHBwWFhby8vLT09PPz8+2traxsbGhoaGgoKBtbW1ra2sLCwsKCgqT8ZvFAAAAAXRSTlMAQObYZgAAAD9JREFUGNPFzTcSwCAQxVAtGZzT/a/q8o/H9Kh5pejl/UdLrWWTxNO5K0qeCeyW1BmWKgllW0uQcOS0yzHbfy87/AR9dbQdjwAAAABJRU5ErkJggg=='}],
                               ['xul:menuitem', {label: '标签页',oncommand:'Tabplusjs();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/7a6a15d5gy1g03gsvdkebj20l70dyn11.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', tooltiptext: 'Tabplus.uc.js\n左键：编辑配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVElEQVQ4jc2Ruw0AIAgFr3IFJ3YB13EkhtBGEiuCnxheQgE8DhIgihJQAQG6I2T6kwIq0IDsXJinv2hBNoZXiGjSDaOrFw9gfeDPBbEAlt4CTuNOA8bzPo9tYBnVAAAAAElFTkSuQmCC'}],
                               ['xul:menuitem', {label: '快捷键',oncommand:'KeyChanger.edit(KeyChanger.file); var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/7a6a15d5gy1fx5iyfagicj215o0ixdli.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',onclick:'if (event.button == 2) { event.preventDefault(); setTimeout(function(){ KeyChanger.makeKeyset(true); }, 10);}',class:'menuitem-iconic', tooltiptext: 'keychanger.js\n左键：编辑配置\n右键：重载配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAxOqay5EAAAAiSURBVAjXY0ADUqtWrWRQYGBgYlACAgyW1ioIC0xAFKMCABYYBwHv+ZZuAAAAAElFTkSuQmCC'}],
                                ['xul:menuitem', {label: '鼠标手势',oncommand: 'MouseGesturesjs();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/7a6a15d5gy1fx5j1647izj20k00hnwfq.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',tooltiptext: 'MouseGestures.uc.js\n左键：编辑配置',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAkFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDIYgjAAAAMHRSTlMA6kEK4JpdD/7v2su9q5Z5b05FJyAbFAP208K3r6SAZzsxBtbOxbmxpp6QhWJaWSwB0NSsAAAAm0lEQVQY00WOhw7DIAxEzcreTchuRvf+/7+rQYRY4ux7xtKBrqL3vTZ1wVSdBB9ZL4/gYMAzYgAhgMOl9jNXfz18r1GD/g0GMFKiuk04YUdLBc+w00s+EnLugiZMszuCb4xSzfTHcBnhnA9gq7iiLO0OJqFi+dKC2FEqjpuvfJ2+JFvkwawcrskquhUMIUleZKeYgT1Ob1FC9fgHj9IH8vwTbm8AAAAASUVORK5CYII='}],
                                ['xul:menuitem', {label: '图标按键',oncommand:'ButtonEventListener();var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTab("https://tva1.sinaimg.cn/large/7a6a15d5gy1g72cvr10wwj20k00f3q5d.jpg", {triggeringPrincipal: gBrowser.contentPrincipal}), x);',class:'menuitem-iconic', tooltiptext: 'ButtonEventListener.uc.js\n左键：编辑配置',image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4jWNgoAJYzsDAcB8H/o1Hbj/MgP9E0q/RaJg4w38i8Gso/R6Nz8DAwMCwnoGBQQEHtsEjNxlmwHEGBoYEHHg2HrnNMAPmM5AHGogxQANZITkGMDBAAuw01DCyDNjMAAnx7wwMDA7kGFADNeA6uS7QgOLzUMNINgDZoBxKDEAHcAM2M0AyBjb8Ho/cYTItRgUAX/dLM5/IfscAAAAASUVORK5CYII='}],
                               ['xul:menuseparator', {}],
                               ['xul:menuitem', {label: '用户偏好',oncommand: 'QuickOpenUserjs();',tooltiptext: 'user.js',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4jWNgoCL4TwA3EGMAPrnrhAwhZIA4IUMIGcBAyJD/SDQyxiaG1TJ8LiBKLdUMIBSdtHcBxQbgczp9XECRAaRg6gAArMpGck8h/nAAAAAASUVORK5CYII='}],
                               ['xul:menuitem', {label: '高级选项',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:config", {triggeringPrincipal: gBrowser.contentPrincipal}), x); ',tooltiptext: 'about:config',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjs/FhvAYMUTAaBqNhQDYAAG8lJtrslB7sAAAAAElFTkSuQmCC'}],
                               ['xul:menuitem', {label: '所有设置',oncommand: 'var x = gBrowser.selectedTab._tPos + 1; gBrowser.moveTabTo(gBrowser.selectedTab =gBrowser.addTrustedTab("about:about", {triggeringPrincipal: gBrowser.contentPrincipal}), x); ',tooltiptext: 'about:about',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjs/FhvAYMUTAaBqNhQDYAAG8lJtrslB7sAAAAAElFTkSuQmCC'}],  
                               //['xul:menuitem', {label: '界面设置',oncommand: 'ChromeCSS(); ',tooltiptext: 'chrome.css',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAARklEQVQ4jWNgGCxgP5kYDv5D6fkMDAzdUPZhJDlcGMWA1QwMDNcZGBhOMzAwbGdgYHjOwMAwmxQDSAWjBgw/AxrIxIMAAADq9jfGHLxovAAAAABJRU5ErkJggg=='}],  
                               ]
                               ],
                                ['xul:menuitem', {label: '配置文件夹',tooltiptext: 'Profiles', oncommand: 'var canvas = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile).launch();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}],
                                ['xul:menuitem', {label: '脚本文件夹',tooltiptext: 'Chrome', oncommand: 'var canvas = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile).reveal();',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}],   
                                 ['xul:menuitem', {label: '火狐根目录', tooltiptext: 'Firefox', oncommand: 'QuickOpenApplication()',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4je2Syw2AIBAFJ1ZjD1RgJbRhtVSBWS/rj2UjqEcn4fKSN7wQ4CMmIAFyOknzJhIQiixo3iwYK7k4x6zzBB5m3Wb1bqwtkFJQvsHdAiPoRQCGB8ULv+AQLEDs6EXt7MxApv0jZe28ZwV+VzP4VojXiwAAAABJRU5ErkJggg=='}], 
                                  ['xul:menuseparator', {}],
                                 ['xul:menuitem', {label: '重启浏览器',oncommand: 'Services.startup.quit(Services.startup.eAttemptQuit | Services.startup.eRestart);',class:'menuitem-iconic', image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAq0lEQVQ4ja2SvQ3DIBCFv44qXXrXbrMDK2QFhqD2FhmAFbyD9/AILknBU2TH/FnJkxDScd9xBw/aGoFXR15RBlgA3wsMwCRo1T4BEbAt2AMb4FTIaPcq4FrwfIfbV3wU/KzBD2DLwAiswgCh1V5LkTTrTwXMhfzTSFc6GEhfe9BM/xs4ki8OspR/4SOdrxS6DeR9sIdnKpY2KpJzolP81HpOVjfF3Qoks/1fb/8xJcvKSjYUAAAAAElFTkSuQmCC'}],    
                        ]; 
						
        aNode.appendChild(jsonToDOM(myMenuJson, aNode.ownerDocument, {}));
        aNode.setAttribute('menupopup', 'QuickOpen_pop');
    }
});


//定义图标
var cssStr = '@-moz-document url("chrome://browser/content/browser.xul"), url(chrome://browser/content/browser.xhtml){'
		 + '#QuickOpen .toolbarbutton-icon {'
		 + 'list-style-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2UlEQVQ4jbWRIRKDMBREn8NhOoPrDLoqtifgAnG9AUfgAJU9SS2uAoOt6gWqIiqjqlrBMhNChoLozjA/2ewu/yfwRxRAC3jVYmtAD5yBXLXfYj4BndZ71U78KtwAK9NLf7fiV8HLMLY9Bvg1ZgM8gSoKqMSbJXMFOOACZDKOI2TinXQzWB0eI76M9kfpbBzgf7UXwJC4j0+w3iXCjPiUfkI0DHM7htlbhud04pulgLsMJXBQmw/VUl8r3SzgDdTBPpdxDMqDs1r6CeLbh+HZvOoa/QwZcFVN4gv6nzt18jn5zAAAAABJRU5ErkJggg==)'
		 + '}}';
	var sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
	sss.loadAndRegisterSheet(ios.newURI("data:text/css;base64," + btoa(cssStr), null, null), sss.USER_SHEET);




//定义函数

function	QuickOpenUserjs() { FileUtils.getFile('ProfD',['user.js']).launch();};

function	MouseGesturesjs() { FileUtils.getFile('UChrm',['SubScript', 'MouseGestures.uc.js']).launch();};

function	Tabplusjs() { FileUtils.getFile('UChrm',['SubScript', 'Tabplus.uc.js']).launch();};

function	ButtonEventListener() { FileUtils.getFile('UChrm',['SubScript', 'ButtonEventListener.uc.js']).launch();};

function	ChromeCSS() { FileUtils.getFile('UChrm',['css', 'chrome.css']).launch();};


function QuickOpenApplication() { 
var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath("/Applications/Firefox.app/Contents");file.launch();};


 function QuickOpenMyComputer() {var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath("/");file.launch();};








