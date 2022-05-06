// =====================addmenuplus 配置 感谢 runningcheese ======================
// 使用 addMenuPlus 代替 ButtonEventListener.uc.js
tool([{
    id: 'downloads-button',
    tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? '左键：显示下载进度\n中键：下载视频\n右键：打开下载历史（CTRL + J）' : 'Left click: show download progress\nMiddle click: download video\nRight click: open download management(CTRL + J)',
    onclick: function (e) {
        if (e.button == 1) {
            e.preventDefault();
            e.stopPropagation();
            let binPath, savePath, uri = gBrowser.selectedBrowser.currentURI;

            // 自定修改 cookies 存储路径
            const cookiesPath = FileUtils.getDir("UChrm", ["resources", "cookies"], true);

            // 非网页不响应，可以细化为匹配 you-get.exe 支持的网站，我懒得写正则了
            if (uri.spec.startsWith('http')) {

                binPath = Services.prefs.getStringPref("userChromeJS.addMenuPlus.youGetPath", "");
                savePath = Services.prefs.getStringPref("userChromeJS.addMenuPlus.youGetSavePath", "");

                function setYouGetPath() {
                    alert(Services.locale.appLocaleAsBCP47.includes("zh-") ? "请先设置 you-get.exe 的路径!!!" : "Please set you-get.exe path first!!!");
                    if (Services.locale.appLocaleAsBCP47.includes("zh-")) {
                        addMenu.openCommand({ 'target': this }, 'https://lussac.lanzoui.com/b00nc5aab', 'tab');
                    } else {
                        addMenu.openCommand({ 'target': this }, 'https://github.com/LussacZheng/you-get.exe/releases', 'tab');
                    }
                    let fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
                    fp.init(window, Services.locale.appLocaleAsBCP47.includes("zh-") ? "设置 you-get.exe 路径" : "Set you-get.exe path", Ci.nsIFilePicker.modeOpen);
                    fp.appendFilter(Services.locale.appLocaleAsBCP47.includes("zh-") ? "执行文件" : "Executable file", "*.exe");
                    fp.open(res => {
                        if (res != Ci.nsIFilePicker.returnOK) return;
                        Services.prefs.setStringPref("userChromeJS.addMenuPlus.youGetPath", fp.file.path);
                    });
                }

                function setSavePath() {
                    let fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
                    fp.init(window, Services.locale.appLocaleAsBCP47.includes("zh-") ? "设置视频保存路径" : "Set video save path", Ci.nsIFilePicker.modeGetFolder);
                    fp.open(res => {
                        if (res != Ci.nsIFilePicker.returnOK) return;
                        Services.prefs.setStringPref("userChromeJS.addMenuPlus.youGetSavePath", fp.file.path + '\\');
                    });
                }

                // 转换成 netscape 格式，抄袭自 cookie_txt 扩展
                function formatCookie(co) {
                    return [
                        [
                            co.isHttpOnly ? '#HttpOnly_' : '',
                            co.host
                        ].join(''),
                        co.isDomain ? 'TRUE' : 'FALSE',
                        co.path,
                        co.isSecure ? 'TRUE' : 'FALSE',
                        co.expires,
                        co.name,
                        co.value + '\n'
                    ].join('\t');
                }

                // 保存 cookie 并返回路径
                function getCookiePathForSite(host) {
                    if (!host) return;
                    let cookies = Services.cookies.getCookiesFromHost(host, {});
                    let string = cookies.map(formatCookie).join('');

                    let file = cookiesPath.clone();
                    file.append(`${host}.txt`);
                    if (file.exists()) {
                        file.remove(0);
                    }
                    file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, 0o666);

                    // 保存文件，抄袭自 saveUCJS.uc.js
                    const charset = 'UTF-8';
                    const fileStream = Components.classes['@mozilla.org/network/file-output-stream;1']
                        .createInstance(Components.interfaces.nsIFileOutputStream);
                    fileStream.init(file, 0x02 | 0x08 | 0x20, -1, 0);

                    const converterStream = Components.classes['@mozilla.org/intl/converter-output-stream;1']
                        .createInstance(Components.interfaces.nsIConverterOutputStream);
                    converterStream.init(
                        fileStream,
                        charset,
                        string.length,
                        Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER
                    );

                    converterStream.writeString(string);
                    converterStream.close();
                    fileStream.close();
                    return file.path;
                }


                if (!binPath) {
                    setYouGetPath();
                    binPath = Services.prefs.getStringPref("userChromeJS.addMenuPlus.youGetPath", "");
                    return;
                }
                if (!savePath) {
                    setSavePath();
                    savePath = Services.prefs.getStringPref("userChromeJS.addMenuPlus.youGetSavePath", "");
                    return;
                }
                let youGet = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
                try {
                    youGet.initWithPath(binPath);
                } catch (E) {
                    alert(Services.locale.appLocaleAsBCP47.includes("zh-") ? "you-get.exe 不存在，需要重新设置 you-get.exe 路径" : "you-get.exe not exists, please reset you-get.exe path");
                    setYouGetPath();
                    return;
                }
                let p = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);

                // 自行修改系统编码 Please change text encoding
                if (Services.locale.appLocaleAsBCP47.includes("zh-CN")) {
                    let converter = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
                    converter.charset = 'gbk';
                    savePath = converter.ConvertFromUnicode(savePath) + converter.Finish();
                }
                let commandArgs = ['-c', getCookiePathForSite(uri.host), '-o', savePath, uri.spec];

                p.init(youGet);
                p.run(false, commandArgs, commandArgs.length);
            }
        } else if (e.button == 2 && !e.shiftKey) {
            // 右键打开下载历史
            e.preventDefault();
            e.stopPropagation();
            DownloadsPanel.showDownloadsHistory();
        }
    },
    clone: false
},
// {
//     id: 'treestyletab_piro_sakura_ne_jp-browser-action',
//     hidden: true,
//     clone: false
// },
// {
//     id: 'PanelUI-menu-button',
//     tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? '左键：打开菜单\n右键：列出所有标签' : 'Left click: open PanelUP menu\nRight click: show all tabs',
//     onclick: function (e) {
//         if (e.button == 2) {
//             e.preventDefault();
//             e.stopPropagation();
//             document.getElementById('treestyletab_piro_sakura_ne_jp-browser-action').click();
//             Services.prefs.setBoolPref("sidebar.position_start", false);
//         }
//     },
//     clone: false
// }, 
{
    id: 'star-button',
    tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? '左键：将此页加入书签\n右键：打开书签管理器' : 'Left click: bookmark this tab\nRight click: open bookmarks management.',
    onclick: function (event) {
        if (event.button == 2) {
            event.preventDefault();
            PlacesCommandHook.showPlacesOrganizer('AllBookmarks');
        }
    },
    clone: false
}, {
    id: 'reload-button',
    tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? '左键：刷新\n右键：强制刷新' : 'Left click: refresh page\nRight click: force refresh page',
    onclick: function (event) {
        if (event.button == 2) {
            event.preventDefault();
            BrowserReloadSkipCache();
        }
    },
    clone: false
}, {
    id: 'eom-button',
    tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? '左键：拓展选项菜单\n右键：扩展和主题' : 'Left click: show extensions options menu\nRight click: open addons and themes management',
    onclick: function (event) {
        if (event.button == 2) {
            event.preventDefault();
            BrowserOpenAddonsMgr();
        }
    },
    clone: false
}]);
// 移动菜单 Start ================================================================
page([{
    id: "addMenu-rebuild",
    insertBefore: "uc-menuseparator",
    image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNS4yODkgMTguOTA2IEMgMy42NTcgMTguOTA2IDIuMzMyIDE4LjAyMyAxLjYxOCAxNi43ODYgQyAwLjkwNCAxNS41NSAwLjgwMiAxMy45NiAxLjYxOCAxMi41NDcgQyAxLjk5NiAxMS44OTEgMi41MzYgMTEuMzYxIDMuMTY5IDEwLjk5NiBDIDMuODAzIDEwLjYzIDQuNTMxIDEwLjQyOCA1LjI4OSAxMC40MjggQyA2LjkyMSAxMC40MjggOC4yNDYgMTEuMzExIDguOTYgMTIuNTQ3IEMgOS42NzQgMTMuNzgzIDkuNzc2IDE1LjM3MyA4Ljk2IDE2Ljc4NiBDIDguNTgyIDE3LjQ0MyA4LjA0MyAxNy45NzIgNy40MDkgMTguMzM4IEMgNi43NzUgMTguNzA0IDYuMDQ3IDE4LjkwNiA1LjI4OSAxOC45MDYgWiBNIDE0LjcxIDE4LjkwNiBDIDEzLjA3OCAxOC45MDYgMTEuNzUyIDE4LjAyMyAxMS4wMzggMTYuNzg2IEMgMTAuMzI0IDE1LjU1IDEwLjIyMyAxMy45NiAxMS4wMzkgMTIuNTQ3IEMgMTEuNDE3IDExLjg5MSAxMS45NTYgMTEuMzYxIDEyLjU5IDEwLjk5NiBDIDEzLjIyMyAxMC42MyAxMy45NTIgMTAuNDI4IDE0LjcxIDEwLjQyOCBDIDE2LjM0MiAxMC40MjggMTcuNjY3IDExLjMxMSAxOC4zODEgMTIuNTQ3IEMgMTkuMDk1IDEzLjc4MyAxOS4xOTcgMTUuMzczIDE4LjM4MSAxNi43ODYgQyAxOC4wMDIgMTcuNDQzIDE3LjQ2MyAxNy45NzIgMTYuODI5IDE4LjMzOCBDIDE2LjE5NSAxOC43MDQgMTUuNDY3IDE4LjkwNiAxNC43MSAxOC45MDYgWiBNIDUuMjg5IDE3LjAyMiBDIDYuMTk2IDE3LjAyMiA2LjkzMiAxNi41MzEgNy4zMjkgMTUuODQ0IEMgNy43MjUgMTUuMTU3IDcuNzgxIDE0LjI3NCA3LjMyOCAxMy40ODkgQyA3LjExOCAxMy4xMjUgNi44MTkgMTIuODMxIDYuNDY3IDEyLjYyOCBDIDYuMTE1IDEyLjQyNCA1LjcxIDEyLjMxMiA1LjI4OSAxMi4zMTIgQyA0LjM4MyAxMi4zMTIgMy42NDYgMTIuODAzIDMuMjUgMTMuNDkgQyAyLjg1MyAxNC4xNzcgMi43OTYgMTUuMDYgMy4yNDkgMTUuODQ0IEMgMy40NiAxNi4yMDkgMy43NiAxNi41MDQgNC4xMTIgMTYuNzA3IEMgNC40NjQgMTYuOTEgNC44NjkgMTcuMDIyIDUuMjg5IDE3LjAyMiBaIE0gMTQuNzEgMTcuMDIyIEMgMTUuNjE3IDE3LjAyMiAxNi4zNTMgMTYuNTMxIDE2Ljc0OSAxNS44NDQgQyAxNy4xNDUgMTUuMTU3IDE3LjIwMiAxNC4yNzQgMTYuNzQ5IDEzLjQ4OSBDIDE2LjUzOCAxMy4xMjUgMTYuMjM5IDEyLjgzMSAxNS44ODcgMTIuNjI4IEMgMTUuNTM1IDEyLjQyNCAxNS4xMyAxMi4zMTIgMTQuNzEgMTIuMzEyIEMgMTMuODAzIDEyLjMxMiAxMy4wNjcgMTIuODAzIDEyLjY3IDEzLjQ5IEMgMTIuMjc0IDE0LjE3NyAxMi4yMTcgMTUuMDYgMTIuNjcgMTUuODQ0IEMgMTIuODggMTYuMjA5IDEzLjE4IDE2LjUwNCAxMy41MzIgMTYuNzA3IEMgMTMuODg1IDE2LjkxIDE0LjI4OSAxNy4wMjIgMTQuNzEgMTcuMDIyIFoiIHN0eWxlPSJzdHJva2UtbWl0ZXJsaW1pdDogMzsiLz4KICA8cGF0aCBkPSJNIDUuMjg5IDkuNTYyIEMgMy42NTcgOS41NjIgMi4zMzIgOC42NzkgMS42MTggNy40NDIgQyAwLjkwNCA2LjIwNiAwLjgwMiA0LjYxNiAxLjYxOCAzLjIwMyBDIDEuOTk2IDIuNTQ3IDIuNTM2IDIuMDE3IDMuMTY5IDEuNjUxIEMgMy44MDMgMS4yODYgNC41MzEgMS4wODQgNS4yODkgMS4wODQgQyA2LjkyMSAxLjA4NCA4LjI0NiAxLjk2NyA4Ljk2IDMuMjAzIEMgOS42NzQgNC40NCA5Ljc3NiA2LjAyOSA4Ljk2IDcuNDQyIEMgOC41ODIgOC4wOTkgOC4wNDMgOC42MjggNy40MDkgOC45OTQgQyA2Ljc3NSA5LjM2IDYuMDQ3IDkuNTYyIDUuMjg5IDkuNTYyIFogTSAxNC43MSA5LjU2MiBDIDEzLjA3OCA5LjU2MiAxMS43NTIgOC42NzkgMTEuMDM4IDcuNDQyIEMgMTAuMzI0IDYuMjA2IDEwLjIyMyA0LjYxNiAxMS4wMzkgMy4yMDMgQyAxMS40MTcgMi41NDcgMTEuOTU2IDIuMDE3IDEyLjU5IDEuNjUxIEMgMTMuMjIzIDEuMjg2IDEzLjk1MiAxLjA4NCAxNC43MSAxLjA4NCBDIDE2LjM0MiAxLjA4NCAxNy42NjcgMS45NjcgMTguMzgxIDMuMjAzIEMgMTkuMDk1IDQuNDQgMTkuMTk3IDYuMDI5IDE4LjM4MSA3LjQ0MiBDIDE4LjAwMiA4LjA5OSAxNy40NjMgOC42MjggMTYuODI5IDguOTk0IEMgMTYuMTk1IDkuMzYgMTUuNDY3IDkuNTYyIDE0LjcxIDkuNTYyIFogTSA1LjI4OSA3LjY3OCBDIDYuMTk2IDcuNjc4IDYuOTMyIDcuMTg3IDcuMzI5IDYuNSBDIDcuNzI1IDUuODEzIDcuNzgxIDQuOTMgNy4zMjggNC4xNDUgQyA3LjExOCAzLjc4MSA2LjgxOSAzLjQ4NyA2LjQ2NyAzLjI4NCBDIDYuMTE1IDMuMDggNS43MSAyLjk2OCA1LjI4OSAyLjk2OCBDIDQuMzgzIDIuOTY4IDMuNjQ2IDMuNDU5IDMuMjUgNC4xNDYgQyAyLjg1MyA0LjgzMyAyLjc5NiA1LjcxNiAzLjI0OSA2LjUgQyAzLjQ2IDYuODY1IDMuNzYgNy4xNTkgNC4xMTIgNy4zNjMgQyA0LjQ2NCA3LjU2NiA0Ljg2OSA3LjY3OCA1LjI4OSA3LjY3OCBaIE0gMTQuNzEgNy42NzggQyAxNS42MTcgNy42NzggMTYuMzUzIDcuMTg3IDE2Ljc0OSA2LjUgQyAxNy4xNDUgNS44MTMgMTcuMjAyIDQuOTMgMTYuNzQ5IDQuMTQ1IEMgMTYuNTM4IDMuNzgxIDE2LjIzOSAzLjQ4NyAxNS44ODcgMy4yODQgQyAxNS41MzUgMy4wOCAxNS4xMyAyLjk2OCAxNC43MSAyLjk2OCBDIDEzLjgwMyAyLjk2OCAxMy4wNjcgMy40NTkgMTIuNjcgNC4xNDYgQyAxMi4yNzQgNC44MzMgMTIuMjE3IDUuNzE2IDEyLjY3IDYuNSBDIDEyLjg4IDYuODY1IDEzLjE4IDcuMTU5IDEzLjUzMiA3LjM2MyBDIDEzLjg4NSA3LjU2NiAxNC4yODkgNy42NzggMTQuNzEgNy42NzggWiIgc3R5bGU9InN0cm9rZS1taXRlcmxpbWl0OiAzOyIvPgo8L3N2Zz4=",
    clone: false
}, {
    id: "toolsbar_KeyChanger_rebuild",
    insertBefore: "uc-menuseparator",
    image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTcuNjggMi44NDIgTCA5Ljk1IDIuODQyIEwgMi4yMiAyLjg0MiBDIDEuNzQ3IDIuODQyIDEuMzE4IDMuMDM1IDEuMDA3IDMuMzQ3IEMgMC42OTUgMy42NTggMC41MDIgNC4wODggMC41MDIgNC41NiBMIDAuNTAyIDEwLjE0MyBMIDAuNTAyIDE1LjcyNSBDIDAuNTAyIDE2LjE5OCAwLjY5NSAxNi42MjcgMS4wMDcgMTYuOTM4IEMgMS4zMTggMTcuMjUgMS43NDcgMTcuNDQzIDIuMjIgMTcuNDQzIEwgOS45NSAxNy40NDMgTCAxNy42OCAxNy40NDMgQyAxOC4xNTIgMTcuNDQzIDE4LjU4MSAxNy4yNSAxOC44OTMgMTYuOTM4IEMgMTkuMjA0IDE2LjYyNyAxOS4zOTcgMTYuMTk4IDE5LjM5NyAxNS43MjUgTCAxOS4zOTcgMTAuMTQzIEwgMTkuMzk3IDQuNTYgQyAxOS4zOTcgNC4wODggMTkuMjA0IDMuNjU4IDE4Ljg5MyAzLjM0NyBDIDE4LjU4MSAzLjAzNSAxOC4xNTIgMi44NDIgMTcuNjggMi44NDIgWiBNIDE3LjY4IDE1LjcyNSBMIDkuOTUgMTUuNzI1IEwgMi4yMiAxNS43MjUgTCAyLjIyIDEwLjE0MyBMIDIuMjIgNC41NiBMIDkuOTUgNC41NiBMIDE3LjY4IDQuNTYgTCAxNy42OCAxMC4xNDMgWiBNIDcuMzczIDYuMjc4IEwgOC4yMzIgNi4yNzggTCA5LjA5MSA2LjI3OCBMIDkuMDkxIDcuMTM3IEwgOS4wOTEgNy45OTUgTCA4LjIzMiA3Ljk5NSBMIDcuMzczIDcuOTk1IEwgNy4zNzMgNy4xMzcgWiBNIDMuOTM4IDYuMjc4IEwgNC43OTcgNi4yNzggTCA1LjY1NSA2LjI3OCBMIDUuNjU1IDcuMTM3IEwgNS42NTUgNy45OTUgTCA0Ljc5NyA3Ljk5NSBMIDMuOTM4IDcuOTk1IEwgMy45MzggNy4xMzcgWiBNIDYuNTE0IDEzLjE0OSBMIDkuOTUgMTMuMTQ5IEwgMTMuMzg1IDEzLjE0OSBMIDEzLjM4NSAxMy41NzggTCAxMy4zODUgMTQuMDA3IEwgOS45NSAxNC4wMDcgTCA2LjUxNCAxNC4wMDcgTCA2LjUxNCAxMy41NzggWiBNIDEwLjgwOSA2LjI3OCBMIDExLjY2NyA2LjI3OCBMIDEyLjUyNiA2LjI3OCBMIDEyLjUyNiA3LjEzNyBMIDEyLjUyNiA3Ljk5NSBMIDExLjY2NyA3Ljk5NSBMIDEwLjgwOSA3Ljk5NSBMIDEwLjgwOSA3LjEzNyBaIE0gNy4zNzMgOS43MTMgTCA4LjIzMiA5LjcxMyBMIDkuMDkxIDkuNzEzIEwgOS4wOTEgMTAuNTcyIEwgOS4wOTEgMTEuNDMxIEwgOC4yMzIgMTEuNDMxIEwgNy4zNzMgMTEuNDMxIEwgNy4zNzMgMTAuNTcyIFogTSAzLjkzOCA5LjcxMyBMIDQuNzk3IDkuNzEzIEwgNS42NTUgOS43MTMgTCA1LjY1NSAxMC41NzIgTCA1LjY1NSAxMS40MzEgTCA0Ljc5NyAxMS40MzEgTCAzLjkzOCAxMS40MzEgTCAzLjkzOCAxMC41NzIgWiBNIDEwLjgwOSA5LjcxMyBMIDExLjY2NyA5LjcxMyBMIDEyLjUyNiA5LjcxMyBMIDEyLjUyNiAxMC41NzIgTCAxMi41MjYgMTEuNDMxIEwgMTEuNjY3IDExLjQzMSBMIDEwLjgwOSAxMS40MzEgTCAxMC44MDkgMTAuNTcyIFogTSAxNC4yNDQgNi4yNzggTCAxNS4xMDMgNi4yNzggTCAxNS45NjIgNi4yNzggTCAxNS45NjIgNy4xMzcgTCAxNS45NjIgNy45OTUgTCAxNS4xMDMgNy45OTUgTCAxNC4yNDQgNy45OTUgTCAxNC4yNDQgNy4xMzcgWiBNIDE0LjI0NCA5LjcxMyBMIDE1LjEwMyA5LjcxMyBMIDE1Ljk2MiA5LjcxMyBMIDE1Ljk2MiAxMC41NzIgTCAxNS45NjIgMTEuNDMxIEwgMTUuMTAzIDExLjQzMSBMIDE0LjI0NCAxMS40MzEgTCAxNC4yNDQgMTAuNTcyIFoiIHN0eWxlPSIiLz4KPC9zdmc+",
    clone: false,
}, {
    id: "ud-update-lepton",
    label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "更新 Lepton 主题（black7375）" : 'Update Lepton Theme(black7375)',
    insertBefore: 'uc-menuseparator',
    image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTI0LjQxNzk2OSA0LjAwMzkwNkMxNS40NzI2NTYgMy44MzU5MzggNy4wNTA3ODEgOS40NDkyMTkgNC4wNzgxMjUgMTguMzc1QzIuMzEyNSAyMy42OTkyMTkgMi43MTg3NSAyOS4zOTA2MjUgNS4yMzQzNzUgMzQuNDA2MjVDNy43NDYwOTQgMzkuNDIxODc1IDEyLjA2MjUgNDMuMTU2MjUgMTcuMzgyODEzIDQ0LjkyNTc4MUMxOS41NzQyMTkgNDUuNjUyMzQ0IDIxLjgwMDc4MSA0NiAyMy45ODgyODEgNDZDMjUuNjk1MzEzIDQ2IDI3LjM3NSA0NS43ODUxNTYgMjkgNDUuMzg2NzE5TDI5IDQzLjMxNjQwNkMyNS41MDc4MTMgNDQuMjc3MzQ0IDIxLjcwMzEyNSA0NC4yNTM5MDYgMTguMDE1NjI1IDQzLjAzMTI1QzEzLjE5OTIxOSA0MS40Mjk2ODggOS4yOTI5NjkgMzguMDQ2ODc1IDcuMDIzNDM4IDMzLjUxMTcxOUM0Ljc1IDI4Ljk3MjY1NiA0LjM3ODkwNiAyMy44MjQyMTkgNS45NzY1NjMgMTkuMDA3ODEzQzguNjI1IDExLjA0Njg3NSAxNi4wNTg1OTQgNiAyNC4wMTk1MzEgNkMyNi4wMDM5MDYgNiAyOC4wMTk1MzEgNi4zMTI1IDMwIDYuOTcyNjU2QzM0LjgxNjQwNiA4LjU3NDIxOSAzOC43MTg3NSAxMS45NTMxMjUgNDAuOTkyMTg4IDE2LjQ4ODI4MUM0MS42MDkzNzUgMTcuNzIyNjU2IDQyLjA3NDIxOSAxOSA0Mi40MTAxNTYgMjAuMzA0Njg4TDM2LjM4NjcxOSAxNy44MjQyMTlDMzUuODcxMDk0IDE3LjYxMzI4MSAzNS4yODkwNjMgMTcuODU1NDY5IDM1LjA3ODEyNSAxOC4zNjMyODFDMzQuODY3MTg4IDE4Ljg3NSAzNS4xMDkzNzUgMTkuNDYwOTM4IDM1LjYyMTA5NCAxOS42NzE4NzVMNDMuNTI3MzQ0IDIyLjkyNTc4MUM0My42NTIzNDQgMjIuOTc2NTYzIDQzLjc3NzM0NCAyMyA0My45MDYyNSAyM0M0NC4zMDA3ODEgMjMgNDQuNjcxODc1IDIyLjc2OTUzMSA0NC44MzIwMzEgMjIuMzgyODEzTDQ3LjkyNTc4MSAxNC44NzEwOTRDNDguMTM2NzE5IDE0LjM1OTM3NSA0Ny44OTA2MjUgMTMuNzczNDM4IDQ3LjM3ODkwNiAxMy41NjI1QzQ2Ljg3MTA5NCAxMy4zNTU0NjkgNDYuMjg1MTU2IDEzLjU5NzY1NiA0Ni4wNzQyMTkgMTQuMTA5Mzc1TDQ0LjA5Mzc1IDE4LjkyMTg3NUM0My43NSAxNy43ODkwNjMgNDMuMzIwMzEzIDE2LjY3NTc4MSA0Mi43ODEyNSAxNS41OTM3NUM0MC4yNjk1MzEgMTAuNTgyMDMxIDM1Ljk1MzEyNSA2Ljg0Mzc1IDMwLjYyODkwNiA1LjA3NDIxOUMyOC41NzAzMTMgNC4zOTA2MjUgMjYuNDgwNDY5IDQuMDQyOTY5IDI0LjQxNzk2OSA0LjAwMzkwNiBaIE0gMzQuODMyMDMxIDMxQzMyLjcyNjU2MyAzMSAzMSAzMi43MjY1NjMgMzEgMzQuODMyMDMxTDMxIDQ2LjE2Nzk2OUMzMSA0OC4yNjk1MzEgMzIuNzI2NTYzIDUwIDM0LjgzMjAzMSA1MEw0Ni4xNjc5NjkgNTBDNDguMjY5NTMxIDUwIDUwIDQ4LjI3MzQzOCA1MCA0Ni4xNjc5NjlMNTAgMzQuODMyMDMxQzUwIDMyLjcyNjU2MyA0OC4yNzM0MzggMzEgNDYuMTY3OTY5IDMxIFogTSAzNC44MzIwMzEgMzNMNDYuMTY3OTY5IDMzQzQ3LjE3OTY4OCAzMyA0OCAzMy44MjAzMTMgNDggMzQuODMyMDMxTDQ4IDQ2LjE2Nzk2OUM0OCA0Ny4xNzk2ODggNDcuMTc5Njg4IDQ4IDQ2LjE2Nzk2OSA0OEwzNC44MzIwMzEgNDhDMzMuODIwMzEzIDQ4IDMzIDQ3LjE3OTY4OCAzMyA0Ni4xNjc5NjlMMzMgMzQuODMyMDMxQzMzIDMzLjgyMDMxMyAzMy44MjAzMTMgMzMgMzQuODMyMDMxIDMzIFogTSA0NS4xOTkyMTkgMzZMMzkuODAwNzgxIDQyLjMwMDc4MUwzNi41IDM5LjgwMDc4MUwzNS4zMDA3ODEgNDEuNDAyMzQ0TDQwIDQ1TDQ2LjY5OTIxOSAzNy4zMDA3ODFaIiAvPg0KPC9zdmc+",
    onclick: function () {
        const targetPath = FileUtils.getDir("UChrm", ["resources", "bin", "UpdateLepton.bat"], false);
        if (event.button == 0) addMenu.exec(targetPath.path, PathUtils.profileDir);
        if (event.button == 2) addMenu.edit(targetPath.path);
    },
}]);
new function () {
    var groupMenu = GroupMenu({
        class: 'showFirstText',
        insertBefore: 'ud-update-lepton',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '浏览器内容工具箱...' : 'Browser Content Toolbox...',
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '浏览器内容工具箱' : 'Browser Content Toolbox',
        oncommand: function () {
            var document = event.target.ownerDocument;
            if (!document.getElementById('menu_browserToolbox')) {
                let { require } = Cu.import("resource://devtools/shared/loader/Loader.jsm", {});
                require("devtools/client/framework/devtools-browser");
            };
            document.getElementById('menu_browserToolbox').click();
        },
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgPHBhdGgKICAgc3R5bGU9ImZpbGw6Y29udGV4dC1maWxsO2ZpbGwtb3BhY2l0eTpjb250ZXh0LWZpbGwtb3BhY2l0eSIKICAgZD0iTSAzLjUgMCBDIDIuNjcxNTcgMCAyIDAuNjcxNTcgMiAxLjUgTCAyIDUuNDE2MDE1NiBDIDIuMzE3NSA1LjI3NzI5NTYgMi42NTIyIDUuMTcwMjA5NCAzIDUuMDk5NjA5NCBMIDMgMS41IEMgMyAxLjIyMzg2IDMuMjIzODYgMSAzLjUgMSBMIDggMSBMIDggNC41IEMgOCA1LjMyODQzIDguNjcxNiA2IDkuNSA2IEwgMTMgNiBMIDEzIDE0LjUgQyAxMyAxNC43NzYxIDEyLjkxMDg2MSAxNSAxMi42MzQ3NjYgMTUgTCAxMS4wNzYxNzIgMTUgQyAxMS4xMzk5ODIgMTUuMzgwODA1IDExLjEyMzYxNiAxNS42OTg2MjcgMTEuMTAzNTE2IDE2IEwgMTIuNSAxNiBDIDEzLjMyODQgMTYgMTQgMTUuMzI4NCAxNCAxNC41IEwgMTQgNS40MTQwNjI1IEMgMTQgNS4wMTYyNDI1IDEzLjg0MTg0NyA0LjYzNDgyNTYgMTMuNTYwNTQ3IDQuMzUzNTE1NiBMIDkuNjQ2NDg0NCAwLjQzOTQ1MzEyIEMgOS4zNjUxODQ0IDAuMTU4MTUzMTMgOC45ODM3Mzc1IDAgOC41ODU5Mzc1IDAgTCAzLjUgMCB6IE0gOSAxLjIwNzAzMTIgTCAxMi43OTI5NjkgNSBMIDkuNSA1IEMgOS4yMjM5IDUgOSA0Ljc3NjE0IDkgNC41IEwgOSAxLjIwNzAzMTIgeiBNIDQgNiBDIDEuNzkwODYgNiAwIDcuNzkwODYgMCAxMCBDIDAgMTIuMjA5MSAxLjc5MDg2IDE0IDQgMTQgQyA0LjkyNDMyIDE0IDUuNzc1Nzk1IDEzLjY4NjY1NiA2LjQ1MzEyNSAxMy4xNjAxNTYgTCA5LjE0NDUzMTIgMTUuODUxNTYyIEMgOS4zMzk4MzEyIDE2LjA0Njg2MyA5LjY1NjI2MjUgMTYuMDQ2ODYyIDkuODUxNTYyNSAxNS44NTE1NjIgQyAxMC4wNDY4NjIgMTUuNjU2MzYzIDEwLjA0Njg2MiAxNS4zMzk4MzEgOS44NTE1NjI1IDE1LjE0NDUzMSBMIDcuMTYwMTU2MiAxMi40NTMxMjUgQyA3LjY4NjcyNjIgMTEuNzc1NzI1IDggMTAuOTI0NCA4IDEwIEMgOCA3Ljc5MDg2IDYuMjA5MTQgNiA0IDYgeiBNIDQgNyBDIDUuNjU2ODUgNyA3IDguMzQzMSA3IDEwIEMgNyAxMS42NTY5IDUuNjU2ODUgMTMgNCAxMyBDIDIuMzQzMTUgMTMgMSAxMS42NTY5IDEgMTAgQyAxIDguMzQzMSAyLjM0MzE1IDcgNCA3IHogIiAvPgo8L3N2Zz4K",
        accesskey: "L"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "修复" : 'Fix',
        tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? "修复【浏览器内容工具箱】打不开" : 'Fix browser content toolbox',
        oncommand: function () {
            let targetPath;
            if (addMenu.appVersion >= 100) {
                // 先记录一下，下边的也能用
                targetPath = PathUtils.join(
                    PathUtils.profileDir,
                    "chrome_debugger_profile"
                );
            } else {
                targetPath = FileUtils.getFile("ProfD", ["chrome_debugger_profile"], false).path;
            }
            IOUtils.setPermissions(targetPath, 0o660);
            IOUtils.remove(targetPath, {
                recursive: true
            });
        },
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTIwLjcxLDMuMjljLTEuMDQtMS4wNC0yLjUtMS41NS00LjEyLTEuNDVjLTEuNSwwLjEtMi45NSwwLjc0LTMuOTgsMS43N2MtMS4wNiwxLjA2LTEuNDksMi4zNS0xLjI1LDMuNzJjMC4wNCwwLjI0LDAuMSwwLjQ3LDAuMTgsMC43MWwtMy41LDMuNWMtMC4yNC0wLjA4LTAuNDctMC4xNC0wLjcxLTAuMThjLTEuMzctMC4yNC0yLjY2LDAuMTktMy43MiwxLjI1Yy0xLjAzLDEuMDMtMS42NywyLjQ4LTEuNzcsMy45OGMtMC4xLDEuNjIsMC40MSwzLjA4LDEuNDUsNC4xMmMwLjk1LDAuOTUsMi4yNiwxLjQ2LDMuNzEsMS40NmMwLjEzLDAsMC4yNywwLDAuNDEtMC4wMWMxLjUtMC4xLDIuOTUtMC43NCwzLjk4LTEuNzdjMS4wNi0xLjA2LDEuNDktMi4zNSwxLjI1LTMuNzJjLTAuMDQtMC4yNC0wLjEtMC40Ny0wLjE4LTAuNzFsMy41LTMuNWMwLjI0LDAuMDgsMC40NywwLjE0LDAuNzEsMC4xOGMwLjI1LDAuMDUsMC40OSwwLjA3LDAuNzMsMC4wN2MxLjEsMCwyLjEyLTAuNDUsMi45OS0xLjMyYzEuMDMtMS4wMywxLjY3LTIuNDgsMS43Ny0zLjk4QzIyLjI2LDUuNzksMjEuNzUsNC4zMywyMC43MSwzLjI5eiBNMTguOTgsOS45N2MtMC4zOSwwLjM5LTAuNzksMC42My0xLjIzLDAuN2MtMC4yNCwwLjA1LTAuNDgsMC4wNS0wLjc0LDBjLTAuNDYtMC4wOC0wLjk1LTAuMy0xLjQ1LTAuNjVsLTEuNDMsMS40M2wtMi42OCwyLjY4bC0xLjQzLDEuNDNjMC4zNSwwLjUsMC41NywwLjk5LDAuNjUsMS40NWMwLjAyLDAuMTMsMC4wNCwwLjI2LDAuMDQsMC4zOWMwLDAuMS0wLjAxLDAuMi0wLjAyLDAuMjljLTAuMDcsMC40Ni0wLjMxLDAuODgtMC43MSwxLjI4Yy0wLjY5LDAuNjktMS42OCwxLjEyLTIuNywxLjE5Yy0wLjYzNCwwLjA0My0xLjIxNS0wLjA3NC0xLjcyMS0wLjMwNGwyLjE0OC0yLjE0OWMwLjM5MS0wLjM5MSwwLjM5MS0xLjAyMywwLTEuNDE0cy0xLjAyMy0wLjM5MS0xLjQxNCwwbC0yLjE0OCwyLjE0OWMtMC4yMzEtMC41MDYtMC4zNDgtMS4wODgtMC4zMDUtMS43MjJjMC4wNy0xLjAyLDAuNS0yLjAxLDEuMTgtMi42OWMwLjQxLTAuNDEsMC44NC0wLjY1LDEuMy0wLjcxYzAuMDktMC4wMiwwLjE5LTAuMDMsMC4yOS0wLjAzYzAuMTIsMCwwLjI1LDAuMDEsMC4zOCwwLjA0YzAuNDYsMC4wOCwwLjk1LDAuMywxLjQ1LDAuNjVsMS40My0xLjQzbDIuNjgtMi42OGwxLjQzLTEuNDNjLTAuMzUtMC41LTAuNTctMC45OS0wLjY1LTEuNDVjLTAuMDQtMC4yNC0wLjA1LTAuNDYtMC4wMi0wLjY4YzAuMDctMC40NiwwLjMxLTAuODgsMC43MS0xLjI4YzAuNjktMC42OSwxLjY4LTEuMTIsMi43LTEuMTljMC4xLTAuMDEsMC4xOS0wLjAxLDAuMjgtMC4wMWMwLjUzLDAsMS4wMSwwLjEsMS40NCwwLjMxaDAuMDA1bC0yLjE1MywyLjE1M2MtMC4zOTEsMC4zOTEtMC4zOTEsMS4wMjMsMCwxLjQxNEMxNi40ODgsNy45MDIsMTYuNzQ0LDgsMTcsOHMwLjUxMi0wLjA5OCwwLjcwNy0wLjI5M2wyLjE2My0yLjE2M1Y1LjU1YzAuMjMsMC41LDAuMzMsMS4xLDAuMjksMS43M0MyMC4wOSw4LjMsMTkuNjYsOS4yOSwxOC45OCw5Ljk3eiIgLz4NCjwvc3ZnPg==",
    }]);
}
// 移动菜单 End ==================================================================
// 页面右键菜单 Start ============================================================
new function () {
    var groupMenu = new GroupMenu({
        id: 'addMenu-tab-favcion',
        class: 'showFirstText',
        insertBefore: 'context_reopenInContainer',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? 'Favicon 操作...' : 'Favicon operate...',
        onshowing: function () {
            this.hidden = gBrowser.currentURI.spec.startsWith('file') || !gBrowser.getIcon(gBrowser.selectedTab);
        }
    });
    groupMenu([{
        label: "复制 Favicon 链接",
        text: "%FAVICON%",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjYgMjYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTQgMEMxLjc5Njg3NSAwIDAgMS43OTY4NzUgMCA0TDAgMThDMCAyMC4yMDMxMjUgMS43OTY4NzUgMjIgNCAyMkw3IDIyTDcgMjBMNCAyMEMyLjg5NDUzMSAyMCAyIDE5LjEwNTQ2OSAyIDE4TDIgNEMyIDIuODk0NTMxIDIuODk0NTMxIDIgNCAyTDEwLjI4MTI1IDJDMTAuNDMzNTk0IDIuMDM5MDYzIDEwLjU2MjUgMi4xMjEwOTQgMTAuNjU2MjUgMi4yMTg3NUMxMS4wODk4NDQgMi4wOTc2NTYgMTEuNTMxMjUgMiAxMiAyTDEzLjA2MjUgMkMxMS43NzM0MzggMC43MTg3NSAxMC45MDIzNDQgMCAxMCAwIFogTSAxMiAzQzkuNzk2ODc1IDMgOCA0Ljc5Njg3NSA4IDdMOCAyMkM4IDI0LjIwMzEyNSA5Ljc5Njg3NSAyNiAxMiAyNkwyMiAyNkMyNC4yMDMxMjUgMjYgMjYgMjQuMjAzMTI1IDI2IDIyTDI2IDExQzI2IDkuOTM3NSAyNS4wMjczNDQgOC45Mjk2ODggMjMuMjgxMjUgNy4yMTg3NUMyMy4wMzkwNjMgNi45ODA0NjkgMjIuNzc3MzQ0IDYuNzE0ODQ0IDIyLjUzMTI1IDYuNDY4NzVDMjIuMjg1MTU2IDYuMjIyNjU2IDIyLjAxOTUzMSA1Ljk5MjE4OCAyMS43ODEyNSA1Ljc1QzIwLjA3MDMxMyA0LjAwMzkwNiAxOS4wNjI1IDMgMTggMyBaIE0gMTIgNUwxOC4yODEyNSA1QzE5LjAwMzkwNiA1LjE4MzU5NCAxOSA2LjA1MDc4MSAxOSA2LjkzNzVMMTkgOUMxOSA5LjU1MDc4MSAxOS40NDkyMTkgMTAgMjAgMTBMMjIgMTBDMjIuOTk2MDk0IDEwIDI0IDEwLjAwMzkwNiAyNCAxMUwyNCAyMkMyNCAyMy4xMDU0NjkgMjMuMTA1NDY5IDI0IDIyIDI0TDEyIDI0QzEwLjg5NDUzMSAyNCAxMCAyMy4xMDU0NjkgMTAgMjJMMTAgN0MxMCA1Ljg5NDUzMSAxMC44OTQ1MzEgNSAxMiA1IFogTSAxOS41MzEyNSAxMi4wOTM3NUMxOC45MDYyNSAxMi4xMjUgMTguMzA4NTk0IDEyLjM3ODkwNiAxNy44NDM3NSAxMi44NDM3NUwxNi41OTM3NSAxNC4xMjVDMTYuODc4OTA2IDEzLjgzNTkzOCAxNy45Mjk2ODggMTQuMDIzNDM4IDE4LjE4NzUgMTQuMjgxMjVMMTguNzE4NzUgMTMuNzE4NzVDMTguOTY0ODQ0IDEzLjQ3NjU2MyAxOS4yODEyNSAxMy4zMjgxMjUgMTkuNTkzNzUgMTMuMzEyNUMxOS44MDQ2ODggMTMuMzAwNzgxIDIwLjEwOTM3NSAxMy4zNTkzNzUgMjAuMzc1IDEzLjYyNUMyMC42MjEwOTQgMTMuODc1IDIwLjY4NzUgMTQuMTQ4NDM4IDIwLjY4NzUgMTQuMzQzNzVDMjAuNjg3NSAxNC42NzE4NzUgMjAuNTM5MDYzIDE1LjAyMzQzOCAyMC4yODEyNSAxNS4yODEyNUwxNy45Njg3NSAxNy41NjI1QzE3LjQ4ODI4MSAxOC4wNDI5NjkgMTYuNzM4MjgxIDE4LjExMzI4MSAxNi4zMTI1IDE3LjY4NzVDMTYuMDcwMzEzIDE3LjQ0NTMxMyAxNS42Nzk2ODggMTcuNDQ1MzEzIDE1LjQzNzUgMTcuNjg3NUMxNS4xOTUzMTMgMTcuOTI5Njg4IDE1LjE5NTMxMyAxOC4zMjAzMTMgMTUuNDM3NSAxOC41NjI1QzE1Ljg3NSAxOSAxNi40Njg3NSAxOS4yMTg3NSAxNy4wNjI1IDE5LjIxODc1QzE3LjcwMzEyNSAxOS4yMTg3NSAxOC4zMzk4NDQgMTguOTcyNjU2IDE4Ljg0Mzc1IDE4LjQ2ODc1TDIxLjE1NjI1IDE2LjE1NjI1QzIxLjY0NDUzMSAxNS42Njc5NjkgMjEuOTM3NSAxNSAyMS45Mzc1IDE0LjM0Mzc1QzIxLjkzNzUgMTMuNzM4MjgxIDIxLjY3OTY4OCAxMy4xNzk2ODggMjEuMjUgMTIuNzVDMjAuNzkyOTY5IDEyLjI5Mjk2OSAyMC4xNzk2ODggMTIuMDY2NDA2IDE5LjUzMTI1IDEyLjA5Mzc1IFogTSAxNi43ODEyNSAxNC45Mzc1QzE2LjE0MDYyNSAxNC45Mzc1IDE1LjUgMTUuMjE0ODQ0IDE1IDE1LjcxODc1TDEyLjg0Mzc1IDE3Ljg0Mzc1QzEyLjM1NTQ2OSAxOC4zMzIwMzEgMTIuMDYyNSAxOSAxMi4wNjI1IDE5LjY1NjI1QzEyLjA2MjUgMjAuMjY1NjI1IDEyLjMyMDMxMyAyMC44MjAzMTMgMTIuNzUgMjEuMjVDMTMuMjEwOTM4IDIxLjcwNzAzMSAxMy44MTY0MDYgMjEuOTM3NSAxNC40Njg3NSAyMS45MDYyNUMxNS4wODk4NDQgMjEuODc1IDE1LjY5MTQwNiAyMS42MjEwOTQgMTYuMTU2MjUgMjEuMTU2MjVMMTcuMjUgMjAuMDMxMjVDMTYuOTY0ODQ0IDIwLjMyMDMxMyAxNS45MTQwNjMgMjAuMTMyODEzIDE1LjY1NjI1IDE5Ljg3NUwxNS4yODEyNSAyMC4yODEyNUMxNS4wMzUxNTYgMjAuNTIzNDM4IDE0LjcxODc1IDIwLjY3MTg3NSAxNC40MDYyNSAyMC42ODc1QzE0LjE5NTMxMyAyMC42OTkyMTkgMTMuODkwNjI1IDIwLjY0MDYyNSAxMy42MjUgMjAuMzc1QzEzLjM3ODkwNiAyMC4xMjg5MDYgMTMuMzEyNSAxOS44NTE1NjMgMTMuMzEyNSAxOS42NTYyNUMxMy4zMTI1IDE5LjMyODEyNSAxMy40NjA5MzggMTguOTc2NTYzIDEzLjcxODc1IDE4LjcxODc1TDE1Ljg3NSAxNi41OTM3NUMxNi4zNTkzNzUgMTYuMTEzMjgxIDE3LjA3NDIxOSAxNi4wNDY4NzUgMTcuNSAxNi40Njg3NUMxNy43NDIxODggMTYuNzEwOTM4IDE4LjE2NDA2MyAxNi43MTA5MzggMTguNDA2MjUgMTYuNDY4NzVDMTguNjQ4NDM4IDE2LjIyNjU2MyAxOC42NDg0MzggMTUuODM1OTM4IDE4LjQwNjI1IDE1LjU5Mzc1QzE3Ljk2ODc1IDE1LjE1NjI1IDE3LjM3NSAxNC45Mzc1IDE2Ljc4MTI1IDE0LjkzNzVaIiAvPg0KPC9zdmc+",
    }, {
        label: "复制 Favicon Base64",
        text: "%FAVICON_BASE64%",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNOS44MDMwNyAzLjA0MzFDMTAuMDU1NCAzLjE1NTI1IDEwLjE2OTEgMy40NTA3MyAxMC4wNTY5IDMuNzAzMDdMNi4wNTY5MSAxMi43MDMxQzUuOTQ0NzUgMTIuOTU1NCA1LjY0OTI3IDEzLjA2OTEgNS4zOTY5MyAxMi45NTY5QzUuMTQ0NTkgMTIuODQ0OCA1LjAzMDk0IDEyLjU0OTMgNS4xNDMwOSAxMi4yOTY5TDkuMTQzMDkgMy4yOTY5M0M5LjI1NTI1IDMuMDQ0NTkgOS41NTA3MyAyLjkzMDk0IDkuODAzMDcgMy4wNDMxWk00LjMzMjE4IDUuMzc2M0M0LjUzODU3IDUuNTU5NzYgNC41NTcxNiA1Ljg3NTc5IDQuMzczNyA2LjA4MjE4TDIuNjY4OTggOEw0LjM3MzcgOS45MTc4MkM0LjU1NzE2IDEwLjEyNDIgNC41Mzg1NyAxMC40NDAyIDQuMzMyMTggMTAuNjIzN0M0LjEyNTc5IDEwLjgwNzIgMy44MDk3NSAxMC43ODg2IDMuNjI2MyAxMC41ODIyTDEuNjI2MyA4LjMzMjE4QzEuNDU3OSA4LjE0Mjc0IDEuNDU3OSA3Ljg1NzI2IDEuNjI2MyA3LjY2NzgyTDMuNjI2MyA1LjQxNzgyQzMuODA5NzUgNS4yMTE0MyA0LjEyNTc5IDUuMTkyODQgNC4zMzIxOCA1LjM3NjNaTTExLjY2NzggNS4zNzYzQzExLjg3NDIgNS4xOTI4NCAxMi4xOTAyIDUuMjExNDMgMTIuMzczNyA1LjQxNzgyTDE0LjM3MzcgNy42Njc4MkMxNC41NDIxIDcuODU3MjYgMTQuNTQyMSA4LjE0Mjc0IDE0LjM3MzcgOC4zMzIxOEwxMi4zNzM3IDEwLjU4MjJDMTIuMTkwMiAxMC43ODg2IDExLjg3NDIgMTAuODA3MiAxMS42Njc4IDEwLjYyMzdDMTEuNDYxNCAxMC40NDAyIDExLjQ0MjggMTAuMTI0MiAxMS42MjYzIDkuOTE3ODJMMTMuMzMxIDhMMTEuNjI2MyA2LjA4MjE4QzExLjQ0MjggNS44NzU3OSAxMS40NjE0IDUuNTU5NzYgMTEuNjY3OCA1LjM3NjNaIi8+Cjwvc3ZnPgo="
    }]);
}
// 标签页右键菜单 End =============================================================
// 移动菜单 Start ================================================================
// 页面信息右键菜单
new function () {
    var items = [{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "编辑当前页面" : 'Edit current page',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTUuNjk0IDEuNzE4IEMgMTQuOTE5IDEuNzIgMTQuMTc0IDIuMDMxIDEzLjYzIDIuNTg0IEwgMi4zOTUgMTMuODE3IEwgMi4zNTEgMTQuMDQgTCAxLjU3NCAxNy45NDggTCAxLjM1MiAxOC45OTEgTCAyLjM5NiAxOC43NjkgTCA2LjMwMyAxNy45OTEgTCA2LjUyNCAxNy45NDcgTCAxNy43NTkgNi43MTQgQyAxOC45MTUgNS41NzggMTguOTE1IDMuNzE4IDE3Ljc1OSAyLjU4MyBDIDE3LjIxNCAyLjAzMSAxNi40NzEgMS43MiAxNS42OTQgMS43MTggWiBNIDE1LjY5NCAzLjA3MiBDIDE2LjA1MiAzLjA3MiAxNi40MTMgMy4yMzYgMTYuNzYgMy41ODMgQyAxNy40NTEgNC4yNzQgMTcuNDUxIDUuMDIyIDE2Ljc2IDUuNzE1IEwgMTYuMjUgNi4yMDMgTCAxNC4xMzkgNC4wOTMgTCAxNC42MjkgMy41ODMgQyAxNC45NzYgMy4yMzYgMTUuMzM2IDMuMDcyIDE1LjY5NCAzLjA3MiBaIE0gMTMuMTQxIDUuMDkzIEwgMTUuMjQ5IDcuMjAyIEwgNi42NTkgMTUuNzkzIEMgNi4xOTQgMTQuODg2IDUuNDU2IDE0LjE0OCA0LjU0OCAxMy42ODQgWiBNIDMuNjM5IDE0LjgzOSBDIDQuNDg5IDE1LjE4MSA1LjE2MyAxNS44NTUgNS41MDMgMTYuNzA1IEwgMy4xNzIgMTcuMTcxIFoiIHN0eWxlPSJzdHJva2UtbWl0ZXJsaW1pdDogMTsgc3Ryb2tlLXdpZHRoOiAwcHg7Ii8+Cjwvc3ZnPg==",
        oncommand: function () {
            gBrowser.loadURI("javascript:document.body.contentEditable%20=%20'true';%20document.designMode='on';%20void%200", {
                triggeringPrincipal: gBrowser.contentPrincipal
            });
        },
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '解除网页限制' : 'Remove web pages limit',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTAuMDM3IDAuNTI2IEMgNC44MTEgMC41MjYgMC41NzIgNC43NjQgMC41NzIgOS45OTEgQyAwLjU3MiAxNS4yMTggNC44MTEgMTkuNDU2IDEwLjAzNyAxOS40NTYgQyAxNS4yNjUgMTkuNDU2IDE5LjUwMiAxNS4yMTggMTkuNTAyIDkuOTkxIEMgMTkuNTAyIDQuNzY0IDE1LjI2NSAwLjUyNiAxMC4wMzcgMC41MjYgWiBNIDEwLjAzNyAxNy44NSBDIDUuNjk4IDE3Ljg1IDIuMTc4IDE0LjMzMSAyLjE3OCA5Ljk5MSBDIDIuMTc4IDguMTExIDIuODM5IDYuMzgzIDMuOTQyIDUuMDMxIEwgMTQuOTk4IDE2LjA4NiBDIDEzLjY0NiAxNy4xODkgMTEuOTE4IDE3Ljg1IDEwLjAzNyAxNy44NSBaIE0gMTYuMTMzIDE0Ljk1MiBMIDUuMDc3IDMuODk2IEMgNi40MjkgMi43OTMgOC4xNTcgMi4xMzEgMTAuMDM3IDIuMTMxIEMgMTQuMzc3IDIuMTMxIDE3Ljg5NyA1LjY1MiAxNy44OTcgOS45OTEgQyAxNy44OTcgMTEuODcyIDE3LjIzNSAxMy42IDE2LjEzMyAxNC45NTIgWiIgc3R5bGU9IiIvPgo8L3N2Zz4=",
        oncommand: function () {
            gBrowser.loadURI("javascript:(function(bookmarklets)%7Bfor(var%20i=0;i%3Cbookmarklets.length;i++)%7Bvar%20code=bookmarklets%5Bi%5D.url;if(code.indexOf(%22javascript:%22)!=-1)%7Bcode=code.replace(%22javascript:%22,%22%22);eval(code)%7Delse%7Bcode=code.replace(/%5Es+%7Cs+$/g,%22%22);if(code.length%3E0)%7Bwindow.open(code)%7D%7D%7D%7D)(%5B%7Btitle:%22%E7%A0%B4%E9%99%A4%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E9%99%90%E5%88%B6%22,url:%22javascript:function%20applyWin(a)%7Bif(typeof%20a.__nnANTImm__===%5Cx22undefined%5Cx22)%7Ba.__nnANTImm__=%7B%7D;a.__nnANTImm__.evts=%5B%5Cx22mousedown%5Cx22,%5Cx22mousemove%5Cx22,%5Cx22copy%5Cx22,%5Cx22contextmenu%5Cx22%5D;a.__nnANTImm__.initANTI=function()%7Ba.__nnantiflag__=true;a.__nnANTImm__.evts.forEach(function(c,b,d)%7Ba.addEventListener(c,this.fnANTI,true)%7D,a.__nnANTImm__)%7D;a.__nnANTImm__.clearANTI=function()%7Bdelete%20a.__nnantiflag__;a.__nnANTImm__.evts.forEach(function(c,b,d)%7Ba.removeEventListener(c,this.fnANTI,true)%7D,a.__nnANTImm__);delete%20a.__nnANTImm__%7D;a.__nnANTImm__.fnANTI=function(b)%7Bb.stopPropagation();return%20true%7D;a.addEventListener(%5Cx22unload%5Cx22,function(b)%7Ba.removeEventListener(%5Cx22unload%5Cx22,arguments.callee,false);if(a.__nnantiflag__===true)%7Ba.__nnANTImm__.clearANTI()%7D%7D,false)%7Da.__nnantiflag__===true?a.__nnANTImm__.clearANTI():a.__nnANTImm__.initANTI()%7DapplyWin(top);var%20fs=top.document.querySelectorAll(%5Cx22frame,%20iframe%5Cx22);for(var%20i=0,len=fs.length;i%3Clen;i++)%7Bvar%20win=fs%5Bi%5D.contentWindow;try%7Bwin.document%7Dcatch(ex)%7Bcontinue%7DapplyWin(fs%5Bi%5D.contentWindow)%7D;void%200;%22%7D,%7Btitle:%22%E7%A0%B4%E9%99%A4%E9%80%89%E6%8B%A9%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%22,url:%22javascript:(function()%7Bvar%20doc=document;var%20bd=doc.body;bd.onselectstart=bd.oncopy=bd.onpaste=bd.onkeydown=bd.oncontextmenu=bd.onmousemove=bd.onselectstart=bd.ondragstart=doc.onselectstart=doc.oncopy=doc.onpaste=doc.onkeydown=doc.oncontextmenu=null;doc.onselectstart=doc.oncontextmenu=doc.onmousedown=doc.onkeydown=function%20()%7Breturn%20true;%7D;with(document.wrappedJSObject%7C%7Cdocument)%7Bonmouseup=null;onmousedown=null;oncontextmenu=null;%7Dvar%20arAllElements=document.getElementsByTagName(%5Cx27*%5Cx27);for(var%20i=arAllElements.length-1;i%3E=0;i--)%7Bvar%20elmOne=arAllElements;with(elmOne.wrappedJSObject%7C%7CelmOne)%7Bonmouseup=null;onmousedown=null;%7D%7Dvar%20head=document.getElementsByTagName(%5Cx27head%5Cx27)%5B0%5D;if(head)%7Bvar%20style=document.createElement(%5Cx27style%5Cx27);style.type=%5Cx27text/css%5Cx27;style.innerHTML=%5Cx22html,*%7B-moz-user-select:auto!important;%7D%5Cx22;head.appendChild(style);%7Dvoid(0);%7D)();%22%7D%5D)", {
                triggeringPrincipal: gBrowser.contentPrincipal
            });
        }
    }, {}, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "http 转 https" : "http to https",
        oncommand: function () {
            gBrowser.loadURI("javascript:(function(){document.location.href=document.location.href.replace('http:','https:')})();", {
                triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
            });
        },
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNy44NzEgMTYuODE3IEwgNC40NDcgMTYuODE3IEwgMy44MjkgMTYuMTk5IEwgMy44MjkgMTAuNzM3IEwgNC40NDcgMTAuMTE5IEwgMTEuNjA2IDEwLjExOSBMIDExLjg4MSA5LjY0MSBDIDEyLjExNSA5LjIzMyAxMi40NjkgOC45NzMgMTIuODYgOC44MzMgQyAxMi44NTUgOC44MzIgMTIuODUxIDguODMxIDEyLjg0NiA4LjgzMSBMIDEyLjg0NiA1LjczOSBDIDEyLjg0NiAzLjQ2NiAxMC45OTcgMS42MTcgOC43MjQgMS42MTcgQyA2LjQ1MSAxLjYxNyA0LjYwMiAzLjQ2NiA0LjYwMiA1LjczOSBMIDQuNjAyIDguODMxIEMgMy40NjMgOC44MzEgMi41NDEgOS43NTQgMi41NDEgMTAuODkyIEwgMi41NDEgMTYuMDQ0IEMgMi41NDEgMTcuMTgzIDMuNDYzIDE4LjEwNSA0LjYwMiAxOC4xMDUgTCA4LjA2NCAxOC4xMDUgQyA3Ljg0MyAxNy43MTUgNy43NzUgMTcuMjU2IDcuODcxIDE2LjgxNyBaIE0gNS44OSA1LjczOSBDIDUuODkgNC4xNzYgNy4xNjEgMi45MDUgOC43MjQgMi45MDUgQyAxMC4yODcgMi45MDUgMTEuNTU4IDQuMTc2IDExLjU1OCA1LjczOSBMIDExLjU1OCA4LjgzMSBMIDUuODkgOC44MzEgTCA1Ljg5IDUuNzM5IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDE3Ljk2OSAxNi4zMTggTCAxNC41NTcgMTAuMzY5IEMgMTQuMDg5IDkuNTU0IDEyLjg5MyA5LjU1NCAxMi40MjUgMTAuMzY5IEwgOS4wMTMgMTYuMzE4IEMgOC41NTMgMTcuMTE3IDkuMTQyIDE4LjEwNSAxMC4wNzggMTguMTA1IEwgMTYuOTAzIDE4LjEwNSBDIDE3LjgzOCAxOC4xMDUgMTguNDI3IDE3LjExNyAxNy45NjkgMTYuMzE4IFogTSAxNC4xMzQgMTQuMzY5IEMgMTQuMTM0IDE0Ljg2NSAxMy41OTcgMTUuMTc0IDEzLjE2OCAxNC45MjcgQyAxMi45NjkgMTQuODEyIDEyLjg0NiAxNC41OTkgMTIuODQ2IDE0LjM2OSBMIDEyLjg0NiAxMi41NjggQyAxMi44NDYgMTIuMDczIDEzLjM4MiAxMS43NjMgMTMuODEyIDEyLjAxMSBDIDE0LjAxMiAxMi4xMjYgMTQuMTM0IDEyLjMzOSAxNC4xMzQgMTIuNTY4IEwgMTQuMTM0IDE0LjM2OSBaIE0gMTMuNDkgMTcuMDc1IEMgMTIuOTk1IDE3LjA3NSAxMi42ODQgMTYuNTM5IDEyLjkzMiAxNi4xMDkgQyAxMy4wNDcgMTUuOTEgMTMuMjU5IDE1Ljc4NyAxMy40OSAxNS43ODcgQyAxMy45ODYgMTUuNzg3IDE0LjI5NSAxNi4zMjQgMTQuMDQ4IDE2Ljc1MyBDIDEzLjkzMiAxNi45NTIgMTMuNzIgMTcuMDc1IDEzLjQ5IDE3LjA3NSBaIiBzdHlsZT0iIi8+Cjwvc3ZnPg==",
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "双语网页翻译" : "Translate this page",
        oncommand: function () {
            gBrowser.loadURI("javascript:(function(){var%20s=document.getElementById(%22tongwenlet_cn%22);if(s!=null){document.body.removeChild(s);}var%20s=document.createElement(%22script%22);s.language=%22javascript%22;s.type=%22text/javascript%22;s.src=%22https://caiyunapp.com/dest/trs.js%22;s.id=%22tongwenlet_cn%22;document.body.appendChild(s);%20})();", {
                triggeringPrincipal: gBrowser.contentPrincipal
            });
        },
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTAuNzcxIDEyLjg1NSBMIDEwLjI1IDEyLjM0IEwgOS43MjkgMTEuODI1IEwgOS4yMDcgMTEuMzEgTCA4LjY4NiAxMC43OTQgTCA4LjY5MiAxMC43ODggTCA4LjY5OCAxMC43ODIgTCA4LjcwNSAxMC43NzYgTCA4LjcxMSAxMC43NyBDIDkuMDU5IDEwLjM4NCA5LjM4NCA5Ljk4IDkuNjg3IDkuNTYgQyA5Ljk5IDkuMTQgMTAuMjcgOC43MDUgMTAuNTI1IDguMjU1IEMgMTAuNzggNy44MDUgMTEuMDExIDcuMzQyIDExLjIxNyA2Ljg2NyBDIDExLjQyMyA2LjM5MiAxMS42MDMgNS45MDYgMTEuNzU3IDUuNDEgTCAxMi4zNTkgNS40MSBMIDEyLjk2IDUuNDEgTCAxMy41NjEgNS40MSBMIDE0LjE2MiA1LjQxIEwgMTQuMTYyIDQuOTk5IEwgMTQuMTYyIDQuNTg5IEwgMTQuMTYyIDQuMTc5IEwgMTQuMTYyIDMuNzY4IEwgMTIuNzI2IDMuNzY4IEwgMTEuMjg5IDMuNzY4IEwgOS44NTMgMy43NjggTCA4LjQxNiAzLjc2OCBMIDguNDE2IDMuMzU4IEwgOC40MTYgMi45NDcgTCA4LjQxNiAyLjUzNyBMIDguNDE2IDIuMTI3IEwgOC4wMDYgMi4xMjcgTCA3LjU5NSAyLjEyNyBMIDcuMTg1IDIuMTI3IEwgNi43NzQgMi4xMjcgTCA2Ljc3NCAyLjUzNyBMIDYuNzc0IDIuOTQ3IEwgNi43NzQgMy4zNTggTCA2Ljc3NCAzLjc2OCBMIDUuMzM4IDMuNzY4IEwgMy45MDEgMy43NjggTCAyLjQ2NSAzLjc2OCBMIDEuMDI5IDMuNzY4IEwgMS4wMjkgNC4xNzcgTCAxLjAyOSA0LjU4NSBMIDEuMDI5IDQuOTk0IEwgMS4wMjkgNS40MDIgTCAzLjMyMSA1LjQwMiBMIDUuNjEyIDUuNDAyIEwgNy45MDQgNS40MDIgTCAxMC4xOTYgNS40MDIgQyAxMC4wNTkgNS43OTggOS45MDIgNi4xODkgOS43MjUgNi41NzMgQyA5LjU0NyA2Ljk1NyA5LjM1IDcuMzM0IDkuMTMzIDcuNzAzIEMgOC45MTYgOC4wNzIgOC42NzkgOC40MzMgOC40MjMgOC43ODMgQyA4LjE2NyA5LjEzMyA3Ljg5MSA5LjQ3MyA3LjU5NSA5LjgwMSBDIDcuNDA0IDkuNTkgNy4yMjEgOS4zNzQgNy4wNDcgOS4xNTMgQyA2Ljg3MiA4LjkzMiA2LjcwNiA4LjcwNiA2LjU0OCA4LjQ3NiBDIDYuMzkgOC4yNDYgNi4yNDEgOC4wMTIgNi4wOTkgNy43NzQgQyA1Ljk1OCA3LjUzNyA1LjgyNCA3LjI5NiA1LjY5OSA3LjA1MSBMIDUuMjg5IDcuMDUxIEwgNC44NzkgNy4wNTEgTCA0LjQ2OCA3LjA1MSBMIDQuMDU4IDcuMDUxIEMgNC4yMDggNy4zODYgNC4zNzEgNy43MTYgNC41NDkgOC4wNCBDIDQuNzI2IDguMzY1IDQuOTE2IDguNjg0IDUuMTIxIDguOTk3IEMgNS4zMjUgOS4zMSA1LjU0MiA5LjYxNyA1Ljc3MyA5LjkxNyBDIDYuMDAzIDEwLjIxNiA2LjI0NyAxMC41MDkgNi41MDMgMTAuNzk0IEwgNS40NTggMTEuODI0IEwgNC40MTQgMTIuODU0IEwgMy4zNjkgMTMuODg0IEwgMi4zMjUgMTQuOTE0IEwgMi42MTYgMTUuMjA1IEwgMi45MDggMTUuNDk3IEwgMy4xOTkgMTUuNzg4IEwgMy40OTEgMTYuMDggTCA0LjUxNyAxNS4wNTQgTCA1LjU0MyAxNC4wMjggTCA2LjU2OSAxMy4wMDIgTCA3LjU5NSAxMS45NzYgTCA4LjIzMyAxMi42MTQgTCA4Ljg3MSAxMy4yNTIgTCA5LjUwOSAxMy44OSBMIDEwLjE0NyAxNC41MjggTCAxMC4zMDMgMTQuMTEgTCAxMC40NTkgMTMuNjkyIEwgMTAuNjE1IDEzLjI3MyBaIE0gMTUuMzkzIDguNjkzIEwgMTQuOTgzIDguNjkzIEwgMTQuNTcyIDguNjkzIEwgMTQuMTYxIDguNjkzIEwgMTMuNzUxIDguNjkzIEwgMTIuODI3IDExLjE1NiBMIDExLjkwNCAxMy42MTggTCAxMC45OCAxNi4wOCBMIDEwLjA1NyAxOC41NDIgTCAxMC40NjcgMTguNTQyIEwgMTAuODc4IDE4LjU0MiBMIDExLjI4OCAxOC41NDIgTCAxMS42OTggMTguNTQyIEwgMTEuOTI4IDE3LjkyNyBMIDEyLjE1OCAxNy4zMTEgTCAxMi4zODggMTYuNjk2IEwgMTIuNjE4IDE2LjA4IEwgMTMuNTkyIDE2LjA4IEwgMTQuNTY3IDE2LjA4IEwgMTUuNTQxIDE2LjA4IEwgMTYuNTE2IDE2LjA4IEwgMTYuNzQ4IDE2LjY5NiBMIDE2Ljk4IDE3LjMxMSBMIDE3LjIxMiAxNy45MjcgTCAxNy40NDQgMTguNTQyIEwgMTcuODU0IDE4LjU0MiBMIDE4LjI2NSAxOC41NDIgTCAxOC42NzUgMTguNTQyIEwgMTkuMDg2IDE4LjU0MiBMIDE4LjE2MyAxNi4wOCBMIDE3LjI0IDEzLjYxOCBMIDE2LjMxNiAxMS4xNTYgWiBNIDEzLjI0MiAxNC40MzggTCAxMy41NzUgMTMuNTUgTCAxMy45MDcgMTIuNjYxIEwgMTQuMjM5IDExLjc3MiBMIDE0LjU3MiAxMC44ODQgTCAxNC45MDQgMTEuNzcyIEwgMTUuMjM2IDEyLjY2MSBMIDE1LjU2OSAxMy41NSBMIDE1LjkwMSAxNC40MzggTCAxNS4yMzYgMTQuNDM4IEwgMTQuNTcxIDE0LjQzOCBMIDEzLjkwNyAxNC40MzggWiIgc3R5bGU9IiIvPgo8L3N2Zz4="
    }, {}, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "页面自动滚屏" : "Auto scroll",
        oncommand: function () {
            gBrowser.loadURI("javascript:var%20_ss_interval_pointer;_ss_speed=3;_ss_speed_pairs=[[0,0],[1,200.0],[1,120.0],[1,72.0],[1,43.2],[1,25.9],[2,31.0],[4,37.2],[8,44.8],[8,26.4],[16,32.0]];_ss_last_onkeypress=document.onkeypress;_ss_stop=function(){clearTimeout(_ss_interval_pointer)};_ss_start=function(){_ss_abs_speed=Math.abs(_ss_speed);_ss_direction=_ss_speed/_ss_abs_speed;_ss_speed_pair=_ss_speed_pairs[_ss_abs_speed];_ss_interval_pointer=setInterval('scrollBy(0,'+_ss_direction*_ss_speed_pair[0]+');%20if((pageYOffset<=1)||(pageYOffset==document.height-innerHeight))%20_ss_speed=0;',_ss_speed_pair[1]);};_ss_adj=function(q){_ss_speed+=q;if(Math.abs(_ss_speed)>=_ss_speed_pairs.length)_ss_speed=(_ss_speed_pairs.length-1)*(_ss_speed/Math.abs(_ss_speed))};_ss_quit=function(){_ss_stop();document.onkeypress=_ss_last_onkeypress;};document.onkeypress=function(e){if((e.charCode==113)||(e.keyCode==27)){_ss_quit();return;};if(e.charCode>=48&&e.charCode<=57)_ss_speed=e.charCode-48;else%20switch(e.charCode){case%2095:_ss_adj(-2);case%2045:_ss_adj(-1);break;case%2043:_ss_adj(2);case%2061:_ss_adj(1);break;};_ss_stop();_ss_start();};_ss_stop();_ss_start();", {
                triggeringPrincipal: gBrowser.contentPrincipal
            });
        },
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTYuOTE4IDQuMjMzIEwgMTAuMjIxIDEwLjkzMSBMIDMuNTIzIDQuMjMzIE0gMy41MjMgMTUuMzk2IEwgMTYuOTE4IDE1LjM5NiIgc3R5bGU9InN0cm9rZS13aWR0aDogMnB4OyBzdHJva2UtbGluZWpvaW46IHJvdW5kOyBzdHJva2UtbGluZWNhcDogcm91bmQ7IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTSAxNy42MjUgNC45NCBMIDEwLjIyMSAxMi4zNDUgTCAyLjgxNiA0Ljk0IEwgNC4yMyAzLjUyNiBMIDEwLjIyMSA5LjUxNyBMIDE2LjIxMSAzLjUyNiBaIE0gMTYuOTE4IDE2LjM5NiBMIDMuNTIzIDE2LjM5NiBMIDMuNTIzIDE0LjM5NiBMIDE2LjkxOCAxNC4zOTYgWiIgc3R5bGU9IiIvPgo8L3N2Zz4="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "页面自动刷新" : "Auto refresh",
        oncommand: function () {
            gBrowser.loadURI("javascript:(function(p){open('','',p).document.write('%3Cbody%20id=1%3E%3Cnobr%20id=2%3E%3C/nobr%3E%3Chr%3E%3Cnobr%20id=3%3E%3C/nobr%3E%3Chr%3E%3Ca%20href=%22#%22onclick=%22return!(c=t)%22%3EForce%3C/a%3E%3Cscript%3Efunction%20i(n){return%20d.getElementById(n)}function%20z(){c+=0.2;if(c%3E=t){c=0;e.location=u;r++}x()}function%20x(){s=t-Math.floor(c);m=Math.floor(s/60);s-=m*60;i(1).style.backgroundColor=(r==0||c/t%3E2/3?%22fcc%22:c/t%3C1/3?%22cfc%22:%22ffc%22);i(2).innerHTML=%22Reloads:%20%22+r;i(3).innerHTML=%22Time:%20%22+m+%22:%22+(s%3C10?%220%22+s:s)}c=r=0;d=document;e=opener.top;u=prompt(%22URL%22,e.location.href);t=u?prompt(%22Seconds%22,60):0;setInterval(%22z()%22,200);if(!t){window.close()}%3C/script%3E%3C/body%3E')})('status=0,scrollbars=0,width=100,height=115,left=1,top=1')", {
                triggeringPrincipal: gBrowser.contentPrincipal
            });
        },
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTcuMTQ1IDkuNjUxIEMgMTcuMTQzIDkuNjQyIDE3LjAwNyA4Ljg3NSAxNi45MTUgOC41NDggQyAxNi44MjIgOC4yMTkgMTYuNzE5IDcuOTI4IDE2LjU4NiA3LjYyNSBDIDE2LjMyNSA3LjAxOSAxNi4wMTQgNi41MTEgMTUuNjExIDYuMDE4IEMgMTUuMjE2IDUuNTIyIDE0Ljc5MyA1LjEyMiAxNC4yODYgNC43NTIgQyAxMy43ODUgNC4zNzkgMTMuMjc4IDQuMDk3IDEyLjY5OCAzLjg2NSBDIDEyLjEyMSAzLjYyNyAxMS41NjEgMy40NzYgMTAuOTQgMy4zOTQgQyAxMC4zMTkgMy4zMDcgOS43MzcgMy4zIDkuMTA3IDMuMzc5IEMgOC40NzQgMy40NTMgNy44OTYgMy41OTkgNy4yODggMy44NTMgQyA2LjY3NSA0LjEgNi4xMjUgNC40MTUgNS41NjMgNC44NTcgQyA1LjQzNyA0Ljk1NSA1LjMyNiA1LjA0OCA1LjIwNSA1LjE1NCBDIDUuMDg4IDUuMjU5IDQuOTgyIDUuMzYgNC44NjggNS40NzQgQyA0Ljc1NiA1LjU4NiA0LjY1OSA1LjY5MSA0LjU1NiA1LjgxIEMgNC40NTIgNS45MyA0LjM2IDYuMDQzIDQuMjY0IDYuMTY5IEMgNC4xNjggNi4yOTQgNC4wODQgNi40MTIgMy45OTYgNi41NDQgQyAzLjk2NiA2LjU5IDMuOTM3IDYuNjM0IDMuOTA4IDYuNjc4IEwgNi4wNjYgNi42NzggTCA2LjA2NiA4LjI1NCBMIDEuMzMzIDguMjU0IEwgMS4zMzMgMy41MiBMIDIuOTA5IDMuNTIgTCAyLjkwOSA1LjM1MiBDIDIuOTQzIDUuMzA1IDIuOTc4IDUuMjU4IDMuMDEyIDUuMjEzIEMgMy4xMjMgNS4wNjkgMy4yNDYgNC45MTcgMy4zNjYgNC43NzggQyAzLjQ4NyA0LjYzOSAzLjYyMyA0LjQ5MyAzLjc1MyA0LjM2MSBDIDMuODgxIDQuMjMzIDQuMDI0IDQuMDk4IDQuMTYyIDMuOTc1IEMgNC4yOTkgMy44NTMgNC40NTEgMy43MjcgNC41OTcgMy42MTMgQyA1LjI0OSAzLjExMSA1Ljk4MyAyLjY4OCA2LjY5MSAyLjM5NSBDIDcuNDA0IDIuMTA3IDguMTg2IDEuOTA3IDguOTE4IDEuODE1IEMgOS42NTIgMS43MyAxMC40MzYgMS43MzkgMTEuMTU0IDEuODM0IEMgMTEuODcyIDEuOTM2IDEyLjYyMSAyLjEzNyAxMy4yOSAyLjQwNSBDIDEzLjk1OCAyLjY3OSAxNC42MzUgMy4wNTcgMTUuMjIgMy40ODQgQyAxNS44MDEgMy45MTYgMTYuMzcgNC40NTYgMTYuODM3IDUuMDI4IEMgMTcuMjk4IDUuNjA1IDE3LjcxOSA2LjI5NCAxOC4wMyA2Ljk5NiBDIDE4LjMzMyA3LjY5OSAxOC42MjUgOS4xMjQgMTguNjI1IDkuMTI0IEMgMTguNjQzIDkuMTcyIDE3LjE0MiA5LjYyNSAxNy4xNDUgOS42NTEgWiBNIDE3LjE0NSA5LjY1MSBDIDE3LjE0NSA5LjY1MSAxNy4xNDUgOS42NTEgMTcuMTQ1IDkuNjUxIEMgMTcuMTQ1IDkuNjUxIDE3LjE0NSA5LjY1MSAxNy4xNDUgOS42NTEgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gMi44NzkgMTEuMTk4IEMgMi44ODEgMTEuMjA3IDMuMDE3IDExLjk3NCAzLjEwOSAxMi4zMDIgQyAzLjIwMiAxMi42MyAzLjMwNSAxMi45MjEgMy40MzggMTMuMjI0IEMgMy42OTkgMTMuODMxIDQuMDExIDE0LjMzOSA0LjQxMyAxNC44MzEgQyA0LjgwOCAxNS4zMjggNS4yMzEgMTUuNzI4IDUuNzM4IDE2LjA5OCBDIDYuMjQgMTYuNDcxIDYuNzQ4IDE2Ljc1IDcuMzI2IDE2Ljk4NSBDIDcuOTA0IDE3LjIyIDguNDY0IDE3LjM3NCA5LjA4NSAxNy40NTYgQyA5LjcwNSAxNy41NDQgMTAuMjg4IDE3LjU1MSAxMC45MTggMTcuNDcxIEMgMTEuNTQ5IDE3LjM5OSAxMi4xMjcgMTcuMjUxIDEyLjczNyAxNi45OTggQyAxMy4zNTEgMTYuNzUgMTMuODk5IDE2LjQzNiAxNC40NiAxNS45OTQgQyAxNC41ODYgMTUuODk2IDE0LjY5OCAxNS44MDIgMTQuODE4IDE1LjY5NiBDIDE0LjkzOCAxNS41OSAxNS4wNDIgMTUuNDkyIDE1LjE1MyAxNS4zNzkgQyAxNS4yNjYgMTUuMjY0IDE1LjM2NiAxNS4xNTggMTUuNDY4IDE1LjA0IEMgMTUuNTcxIDE0LjkyMiAxNS42NjIgMTQuODA4IDE1Ljc2IDE0LjY4IEMgMTUuODU2IDE0LjU1NiAxNS45NCAxNC40MzggMTYuMDI4IDE0LjMwNSBDIDE2LjA1OCAxNC4yNiAxNi4wODcgMTQuMjE2IDE2LjExNSAxNC4xNzIgTCAxMy45NTggMTQuMTcyIEwgMTMuOTU4IDEyLjU5NiBMIDE4LjY5MSAxMi41OTYgTCAxOC42OTEgMTcuMzI5IEwgMTcuMTE1IDE3LjMyOSBMIDE3LjExNSAxNS40OTggQyAxNy4wODEgMTUuNTQ1IDE3LjA0NiAxNS41OTEgMTcuMDExIDE1LjYzNyBDIDE2LjkwMSAxNS43OCAxNi43NzkgMTUuOTMyIDE2LjY1OCAxNi4wNzIgQyAxNi41MzYgMTYuMjEyIDE2LjQgMTYuMzU4IDE2LjI3MyAxNi40ODcgQyAxNi4xNDMgMTYuNjE4IDE1Ljk5OSAxNi43NTMgMTUuODYyIDE2Ljg3NSBDIDE1LjcyNSAxNi45OTcgMTUuNTc0IDE3LjEyMiAxNS40MjggMTcuMjM2IEMgMTQuNzc1IDE3Ljc0IDE0LjA0IDE4LjE2MiAxMy4zMzMgMTguNDU2IEMgMTIuNjIxIDE4Ljc0MyAxMS44NCAxOC45NDMgMTEuMTA4IDE5LjAzNSBDIDEwLjM3NCAxOS4xMjEgOS41ODkgMTkuMTEyIDguODcxIDE5LjAxNiBDIDguMTUyIDE4LjkxNCA3LjQwMiAxOC43MTYgNi43MzQgMTguNDQ1IEMgNi4wNjYgMTguMTc0IDUuMzg5IDE3Ljc5MyA0LjgwNCAxNy4zNjYgQyA0LjIyMyAxNi45MzQgMy42NTQgMTYuMzk0IDMuMTg3IDE1LjgyIEMgMi43MjcgMTUuMjQ1IDIuMzA1IDE0LjU1NyAxLjk5NCAxMy44NTMgQyAxLjY5MSAxMy4xNSAxLjM5OSAxMS43MjUgMS4zOTkgMTEuNzI1IEMgMS4zODEgMTEuNjc3IDIuODgyIDExLjIyNCAyLjg3OSAxMS4xOTggWiBNIDIuODc5IDExLjE5OCBDIDIuODc5IDExLjE5OCAyLjg3OSAxMS4xOTggMi44NzkgMTEuMTk4IEMgMi44NzkgMTEuMTk4IDIuODc5IDExLjE5OCAyLjg3OSAxMS4xOTggWiIgc3R5bGU9IiIvPgo8L3N2Zz4="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "恢复默认窗口" : "Reset windows size",
        tooltiptext: "注意：需要根据自己屏幕的大小手动调整数值",
        oncommand: function (e) {
            window.innerWidth = 1240, window.innerHeight = 740;
            window.moveTo(100, 50);
        },
        //可视区域居中
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTSAxNy43NTggNi45NTYgTCAxNS43ODggNi45NTYgTCAxMy44MTcgNi45NTYgTCAxMS44NDcgNi45NTYgTCA5Ljg3NiA2Ljk1NiBMIDcuOTA2IDYuOTU2IEwgNS45MzUgNi45NTYgTCAzLjk2NSA2Ljk1NiBMIDEuOTk0IDYuOTU2IEwgMS45OTQgOC4wODIgTCAxLjk5NCA5LjIwOCBMIDEuOTk0IDEwLjMzNCBMIDEuOTk0IDExLjQ2IEwgMS45OTQgMTIuNTg2IEwgMS45OTQgMTMuNzEyIEwgMS45OTQgMTQuODM4IEwgMS45OTQgMTUuOTY0IEMgMS45OTQgMTYuMDQxIDIuMDAyIDE2LjExNyAyLjAxNyAxNi4xOTEgQyAyLjAzMiAxNi4yNjQgMi4wNTUgMTYuMzM1IDIuMDgzIDE2LjQwMyBDIDIuMTEyIDE2LjQ3IDIuMTQ2IDE2LjUzNCAyLjE4NyAxNi41OTQgQyAyLjIyNyAxNi42NTQgMi4yNzMgMTYuNzA5IDIuMzI0IDE2Ljc2IEMgMi4zNzUgMTYuODExIDIuNDMxIDE2Ljg1NyAyLjQ5MSAxNi44OTggQyAyLjU1MSAxNi45MzggMi42MTUgMTYuOTczIDIuNjgyIDE3LjAwMiBDIDIuNzUgMTcuMDMgMi44MiAxNy4wNTIgMi44OTQgMTcuMDY3IEMgMi45NjcgMTcuMDgyIDMuMDQzIDE3LjA5IDMuMTIgMTcuMDkgTCA0LjgwOSAxNy4wOSBMIDYuNDk4IDE3LjA5IEwgOC4xODcgMTcuMDkgTCA5Ljg3NiAxNy4wOSBMIDExLjU2NSAxNy4wOSBMIDEzLjI1NCAxNy4wOSBMIDE0Ljk0MyAxNy4wOSBMIDE2LjYzMiAxNy4wOSBDIDE2LjcxIDE3LjA5IDE2Ljc4NiAxNy4wODIgMTYuODU5IDE3LjA2NyBDIDE2LjkzMyAxNy4wNTMgMTcuMDA0IDE3LjAzIDE3LjA3MSAxNy4wMDIgQyAxNy4xMzggMTYuOTczIDE3LjIwMiAxNi45MzggMTcuMjYyIDE2Ljg5OCBDIDE3LjMyMiAxNi44NTcgMTcuMzc4IDE2LjgxMSAxNy40MjggMTYuNzYgQyAxNy40NzkgMTYuNzA5IDE3LjUyNSAxNi42NTQgMTcuNTY2IDE2LjU5NCBDIDE3LjYwNyAxNi41MzQgMTcuNjQyIDE2LjQ3IDE3LjY3IDE2LjQwMyBDIDE3LjY5OSAxNi4zMzUgMTcuNzIxIDE2LjI2NCAxNy43MzUgMTYuMTkxIEMgMTcuNzUgMTYuMTE3IDE3Ljc1OCAxNi4wNDEgMTcuNzU4IDE1Ljk2NCBMIDE3Ljc1OCAxNC44MzggTCAxNy43NTggMTMuNzEyIEwgMTcuNzU4IDEyLjU4NiBMIDE3Ljc1OCAxMS40NiBMIDE3Ljc1OCAxMC4zMzQgTCAxNy43NTggOS4yMDggTCAxNy43NTggOC4wODIgWiBNIDE3Ljc1OCA1LjgzIEwgMTUuNzg4IDUuODMgTCAxMy44MTcgNS44MyBMIDExLjg0NyA1LjgzIEwgOS44NzYgNS44MyBMIDcuOTA2IDUuODMgTCA1LjkzNSA1LjgzIEwgMy45NjUgNS44MyBMIDEuOTk0IDUuODMgTCAxLjk5NCA1LjY5IEwgMS45OTQgNS41NDkgTCAxLjk5NCA1LjQwOCBMIDEuOTk0IDUuMjY3IEwgMS45OTQgNS4xMjYgTCAxLjk5NCA0Ljk4NSBMIDEuOTk0IDQuODQ0IEwgMS45OTQgNC43MDQgQyAxLjk5NCA0LjYyNiAyLjAwMiA0LjU1IDIuMDE3IDQuNDc3IEMgMi4wMzIgNC40MDMgMi4wNTUgNC4zMzMgMi4wODMgNC4yNjYgQyAyLjExMiA0LjE5OCAyLjE0NiA0LjEzNCAyLjE4NyA0LjA3NSBDIDIuMjI3IDQuMDE1IDIuMjczIDMuOTU5IDIuMzI0IDMuOTA4IEMgMi4zNzUgMy44NTcgMi40MzEgMy44MTEgMi40OTEgMy43NyBDIDIuNTUxIDMuNzMgMi42MTUgMy42OTQgMi42ODIgMy42NjYgQyAyLjc1IDMuNjM3IDIuODIgMy42MTYgMi44OTQgMy42MDEgQyAyLjk2NyAzLjU4NiAzLjA0MyAzLjU3OCAzLjEyIDMuNTc4IEwgNC44MDkgMy41NzggTCA2LjQ5OCAzLjU3OCBMIDguMTg3IDMuNTc4IEwgOS44NzYgMy41NzggTCAxMS41NjUgMy41NzggTCAxMy4yNTQgMy41NzggTCAxNC45NDMgMy41NzggTCAxNi42MzIgMy41NzggQyAxNi43MSAzLjU3OCAxNi43ODYgMy41ODYgMTYuODU5IDMuNjAxIEMgMTYuOTMzIDMuNjE2IDE3LjAwNCAzLjYzOCAxNy4wNzEgMy42NjYgQyAxNy4xMzggMy42OTQgMTcuMjAyIDMuNzMgMTcuMjYyIDMuNzcgQyAxNy4zMjIgMy44MTEgMTcuMzc4IDMuODU3IDE3LjQyOCAzLjkwOCBDIDE3LjQ3OSAzLjk1OSAxNy41MjUgNC4wMTUgMTcuNTY2IDQuMDc1IEMgMTcuNjA3IDQuMTM0IDE3LjY0MiA0LjE5OCAxNy42NyA0LjI2NiBDIDE3LjY5OSA0LjMzMyAxNy43MjEgNC40MDMgMTcuNzM1IDQuNDc3IEMgMTcuNzUgNC41NSAxNy43NTggNC42MjYgMTcuNzU4IDQuNzA0IEwgMTcuNzU4IDQuODQ0IEwgMTcuNzU4IDQuOTg1IEwgMTcuNzU4IDUuMTI2IEwgMTcuNzU4IDUuMjY3IEwgMTcuNzU4IDUuNDA4IEwgMTcuNzU4IDUuNTQ5IEwgMTcuNzU4IDUuNjkgWiBNIDE4Ljg4NCA0LjcwNCBDIDE4Ljg4NCA0LjU0OSAxOC44NjggNC4zOTcgMTguODM4IDQuMjUgQyAxOC44MDggNC4xMDQgMTguNzY0IDMuOTYyIDE4LjcwNyAzLjgyOCBDIDE4LjY1IDMuNjkzIDE4LjU4IDMuNTY1IDE4LjQ5OSAzLjQ0NSBDIDE4LjQxOCAzLjMyNiAxOC4zMjYgMy4yMTQgMTguMjI0IDMuMTEyIEMgMTguMTIyIDMuMDEgMTguMDExIDIuOTE4IDE3Ljg5MSAyLjgzNyBDIDE3Ljc3MSAyLjc1NiAxNy42NDMgMi42ODYgMTcuNTA5IDIuNjI5IEMgMTcuMzc0IDIuNTcyIDE3LjIzMiAyLjUyOCAxNy4wODYgMi40OTggQyAxNi45MzkgMi40NjggMTYuNzg3IDIuNDUyIDE2LjYzMiAyLjQ1MiBMIDE0Ljk0MyAyLjQ1MiBMIDEzLjI1NCAyLjQ1MiBMIDExLjU2NSAyLjQ1MiBMIDkuODc2IDIuNDUyIEwgOC4xODcgMi40NTIgTCA2LjQ5OCAyLjQ1MiBMIDQuODA5IDIuNDUyIEwgMy4xMiAyLjQ1MiBDIDIuOTY1IDIuNDUyIDIuODE0IDIuNDY4IDIuNjY3IDIuNDk4IEMgMi41MjEgMi41MjggMi4zNzkgMi41NzIgMi4yNDQgMi42MjkgQyAyLjExIDIuNjg2IDEuOTgyIDIuNzU2IDEuODYyIDIuODM3IEMgMS43NDIgMi45MTggMS42MyAzLjAxIDEuNTI4IDMuMTEyIEMgMS40MjYgMy4yMTQgMS4zMzQgMy4zMjYgMS4yNTMgMy40NDYgQyAxLjE3MiAzLjU2NSAxLjEwMiAzLjY5NCAxLjA0NSAzLjgyOCBDIDAuOTg4IDMuOTYzIDAuOTQ0IDQuMTA0IDAuOTE0IDQuMjUxIEMgMC44ODQgNC4zOTcgMC44NjggNC41NDkgMC44NjggNC43MDQgTCAwLjg2OCA2LjExMiBMIDAuODY4IDcuNTE5IEwgMC44NjggOC45MjcgTCAwLjg2OCAxMC4zMzQgTCAwLjg2OCAxMS43NDIgTCAwLjg2OCAxMy4xNDkgTCAwLjg2OCAxNC41NTcgTCAwLjg2OCAxNS45NjQgQyAwLjg2OCAxNi4xMiAwLjg4NCAxNi4yNzEgMC45MTQgMTYuNDE4IEMgMC45NDQgMTYuNTY1IDAuOTg4IDE2LjcwNiAxLjA0NSAxNi44NDEgQyAxLjEwMiAxNi45NzYgMS4xNzIgMTcuMTA0IDEuMjUzIDE3LjIyMyBDIDEuMzM0IDE3LjM0MyAxLjQyNiAxNy40NTUgMS41MjggMTcuNTU3IEMgMS42MyAxNy42NTkgMS43NDIgMTcuNzUxIDEuODYyIDE3LjgzMSBDIDEuOTgxIDE3LjkxMiAyLjExIDE3Ljk4MiAyLjI0NCAxOC4wMzkgQyAyLjM3OSAxOC4wOTYgMi41MjEgMTguMTQgMi42NjcgMTguMTcgQyAyLjgxNCAxOC4yIDIuOTY1IDE4LjIxNiAzLjEyIDE4LjIxNiBMIDQuODA5IDE4LjIxNiBMIDYuNDk4IDE4LjIxNiBMIDguMTg3IDE4LjIxNiBMIDkuODc2IDE4LjIxNiBMIDExLjU2NSAxOC4yMTYgTCAxMy4yNTQgMTguMjE2IEwgMTQuOTQzIDE4LjIxNiBMIDE2LjYzMiAxOC4yMTYgQyAxNi43ODggMTguMjE2IDE2LjkzOSAxOC4yIDE3LjA4NiAxOC4xNyBDIDE3LjIzMyAxOC4xNCAxNy4zNzQgMTguMDk2IDE3LjUwOSAxOC4wMzkgQyAxNy42NDQgMTcuOTgyIDE3Ljc3MSAxNy45MTIgMTcuODkxIDE3LjgzMSBDIDE4LjAxMSAxNy43NTEgMTguMTIyIDE3LjY1OSAxOC4yMjQgMTcuNTU3IEMgMTguMzI2IDE3LjQ1NSAxOC40MTggMTcuMzQzIDE4LjQ5OSAxNy4yMjMgQyAxOC41OCAxNy4xMDQgMTguNjUgMTYuOTc2IDE4LjcwNyAxNi44NDEgQyAxOC43NjQgMTYuNzA2IDE4LjgwOCAxNi41NjUgMTguODM4IDE2LjQxOCBDIDE4Ljg2OCAxNi4yNzEgMTguODg0IDE2LjEyIDE4Ljg4NCAxNS45NjQgTCAxOC44ODQgMTQuNTU3IEwgMTguODg0IDEzLjE0OSBMIDE4Ljg4NCAxMS43NDIgTCAxOC44ODQgMTAuMzM0IEwgMTguODg0IDguOTI3IEwgMTguODg0IDcuNTE5IEwgMTguODg0IDYuMTEyIFoiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDBweDsgc3Ryb2tlLW1pdGVybGltaXQ6IDM7Ii8+CiAgPHBhdGggZD0iTSA0LjI0NiAxNC4yNzUgQyA0LjI0NiAxNC4xMiA0LjMwOSAxMy45NzkgNC40MTEgMTMuODc3IEMgNC41MTMgMTMuNzc1IDQuNjU0IDEzLjcxMiA0LjgwOSAxMy43MTIgTCA1LjM3MiAxMy43MTIgTCA1LjkzNSAxMy43MTIgQyA2LjA5MSAxMy43MTIgNi4yMzEgMTMuNzc1IDYuMzMzIDEzLjg3NyBDIDYuNDM1IDEzLjk3OSA2LjQ5OCAxNC4xMiA2LjQ5OCAxNC4yNzUgTCA2LjQ5OCAxNC44MzggTCA2LjQ5OCAxNS40MDEgQyA2LjQ5OCAxNS41NTcgNi40MzUgMTUuNjk3IDYuMzMzIDE1Ljc5OSBDIDYuMjMxIDE1LjkwMSA2LjA5MSAxNS45NjQgNS45MzUgMTUuOTY0IEwgNS4zNzIgMTUuOTY0IEwgNC44MDkgMTUuOTY0IEMgNC42NTQgMTUuOTY0IDQuNTEzIDE1LjkwMSA0LjQxMSAxNS43OTkgQyA0LjMwOSAxNS42OTcgNC4yNDYgMTUuNTU3IDQuMjQ2IDE1LjQwMSBMIDQuMjQ2IDE0LjgzOCBaIE0gOC43NSAxNC4yNzUgQyA4Ljc1IDE0LjEyIDguODEzIDEzLjk3OSA4LjkxNSAxMy44NzcgQyA5LjAxNyAxMy43NzUgOS4xNTggMTMuNzEyIDkuMzEzIDEzLjcxMiBMIDkuODc2IDEzLjcxMiBMIDEwLjQzOSAxMy43MTIgQyAxMC41OTUgMTMuNzEyIDEwLjczNSAxMy43NzUgMTAuODM3IDEzLjg3NyBDIDEwLjkzOSAxMy45NzkgMTEuMDAyIDE0LjEyIDExLjAwMiAxNC4yNzUgTCAxMS4wMDIgMTQuODM4IEwgMTEuMDAyIDE1LjQwMSBDIDExLjAwMiAxNS41NTcgMTAuOTM5IDE1LjY5NyAxMC44MzcgMTUuNzk5IEMgMTAuNzM1IDE1LjkwMSAxMC41OTUgMTUuOTY0IDEwLjQzOSAxNS45NjQgTCA5Ljg3NiAxNS45NjQgTCA5LjMxMyAxNS45NjQgQyA5LjE1OCAxNS45NjQgOS4wMTcgMTUuOTAxIDguOTE1IDE1Ljc5OSBDIDguODEzIDE1LjY5NyA4Ljc1IDE1LjU1NyA4Ljc1IDE1LjQwMSBMIDguNzUgMTQuODM4IFogTSAxMy4yNTQgMTQuMjc1IEMgMTMuMjU0IDE0LjEyIDEzLjMxNyAxMy45NzkgMTMuNDE5IDEzLjg3NyBDIDEzLjUyMSAxMy43NzUgMTMuNjYyIDEzLjcxMiAxMy44MTcgMTMuNzEyIEwgMTQuMzggMTMuNzEyIEwgMTQuOTQzIDEzLjcxMiBDIDE1LjA5OSAxMy43MTIgMTUuMjM5IDEzLjc3NSAxNS4zNDEgMTMuODc3IEMgMTUuNDQzIDEzLjk3OSAxNS41MDYgMTQuMTIgMTUuNTA2IDE0LjI3NSBMIDE1LjUwNiAxNC44MzggTCAxNS41MDYgMTUuNDAxIEMgMTUuNTA2IDE1LjU1NyAxNS40NDMgMTUuNjk3IDE1LjM0MSAxNS43OTkgQyAxNS4yMzkgMTUuOTAxIDE1LjA5OSAxNS45NjQgMTQuOTQzIDE1Ljk2NCBMIDE0LjM4IDE1Ljk2NCBMIDEzLjgxNyAxNS45NjQgQyAxMy42NjIgMTUuOTY0IDEzLjUyMSAxNS45MDEgMTMuNDE5IDE1Ljc5OSBDIDEzLjMxNyAxNS42OTcgMTMuMjU0IDE1LjU1NyAxMy4yNTQgMTUuNDAxIEwgMTMuMjU0IDE0LjgzOCBaIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxM3B4OyIvPgo8L3N2Zz4="
    }, {}, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "页面另存为" : " Save page",
        command: "Browser:SavePage",
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMS40MDQgMy45NDggQyAxLjQwNCAzLjIxMiAxLjcwMiAyLjU0NSAyLjE4NSAyLjA2MyBDIDIuNjY3IDEuNTggMy4zMzQgMS4yODIgNC4wNyAxLjI4MiBMIDguODk5IDEuMjgyIEwgMTMuNzI4IDEuMjgyIEMgMTQuMTQ2IDEuMjgyIDE0LjU1NSAxLjM2NSAxNC45MzQgMS41MjIgQyAxNS4zMTMgMS42NzggMTUuNjYxIDEuOTA5IDE1Ljk1NyAyLjIwNSBMIDE2Ljk0MyAzLjE5MSBMIDE3LjkyOSA0LjE3NyBDIDE4LjIyNSA0LjQ3MyAxOC40NTYgNC44MjEgMTguNjEzIDUuMiBDIDE4Ljc2OSA1LjU3OSAxOC44NTIgNS45ODggMTguODUyIDYuNDA2IEwgMTguODUyIDExLjIzNSBMIDE4Ljg1MiAxNi4wNjQgQyAxOC44NTIgMTYuODAxIDE4LjU1NCAxNy40NjcgMTguMDcxIDE3Ljk0OSBDIDE3LjU4OSAxOC40MzIgMTYuOTIyIDE4LjczIDE2LjE4NiAxOC43MyBMIDEwLjEyOCAxOC43MyBMIDQuMDcgMTguNzMgQyAzLjMzNCAxOC43MyAyLjY2NyAxOC40MzIgMi4xODUgMTcuOTQ5IEMgMS43MDIgMTcuNDY3IDEuNDA0IDE2LjggMS40MDQgMTYuMDY0IEwgMS40MDQgMTAuMDA2IFogTSA0LjA3IDIuNzM2IEMgMy43MzYgMi43MzYgMy40MzMgMi44NzIgMy4yMTMgMy4wOTEgQyAyLjk5NCAzLjMxMSAyLjg1OCAzLjYxNCAyLjg1OCAzLjk0OCBMIDIuODU4IDEwLjAwNiBMIDIuODU4IDE2LjA2NCBDIDIuODU4IDE2LjM5OSAyLjk5NCAxNi43MDIgMy4yMTMgMTYuOTIxIEMgMy40MzMgMTcuMTQgMy43MzYgMTcuMjc2IDQuMDcgMTcuMjc2IEwgNC4xOTEgMTcuMjc2IEwgNC4zMTIgMTcuMjc2IEwgNC4zMTIgMTQuNzMyIEwgNC4zMTIgMTIuMTg3IEMgNC4zMTIgMTEuNTg1IDQuNTU2IDExLjAzOSA0Ljk1MSAxMC42NDUgQyA1LjM0NSAxMC4yNSA1Ljg5MSAxMC4wMDYgNi40OTMgMTAuMDA2IEwgMTAuMTI4IDEwLjAwNiBMIDEzLjc2MyAxMC4wMDYgQyAxNC4zNjYgMTAuMDA2IDE0LjkxMSAxMC4yNSAxNS4zMDUgMTAuNjQ1IEMgMTUuNyAxMS4wMzkgMTUuOTQ0IDExLjU4NSAxNS45NDQgMTIuMTg3IEwgMTUuOTQ0IDE0LjczMiBMIDE1Ljk0NCAxNy4yNzYgTCAxNi4wNjUgMTcuMjc2IEwgMTYuMTg2IDE3LjI3NiBDIDE2LjUyMSAxNy4yNzYgMTYuODI0IDE3LjE0IDE3LjA0MyAxNi45MjEgQyAxNy4yNjIgMTYuNzAyIDE3LjM5OCAxNi4zOTkgMTcuMzk4IDE2LjA2NCBMIDE3LjM5OCAxMS4yMzUgTCAxNy4zOTggNi40MDYgQyAxNy4zOTggNi4xODEgMTcuMzU0IDUuOTYgMTcuMjY5IDUuNzU2IEMgMTcuMTg1IDUuNTUyIDE3LjA2MSA1LjM2NSAxNi45MDEgNS4yMDYgTCAxNS45MTUgNC4yMiBMIDE0LjkyOCAzLjIzMyBDIDE0LjgwMyAzLjEwOCAxNC42NiAzLjAwMyAxNC41MDQgMi45MjMgQyAxNC4zNDggMi44NDMgMTQuMTggMi43ODcgMTQuMDA1IDIuNzU4IEwgMTQuMDA1IDQuMDggTCAxNC4wMDUgNS40MDIgQyAxNC4wMDUgNi4wMDQgMTMuNzYxIDYuNTQ5IDEzLjM2NiA2Ljk0NCBDIDEyLjk3MiA3LjMzOSAxMi40MjcgNy41ODMgMTEuODI0IDcuNTgzIEwgOS42NDMgNy41ODMgTCA3LjQ2MiA3LjU4MyBDIDYuODYgNy41ODMgNi4zMTQgNy4zMzkgNS45MiA2Ljk0NCBDIDUuNTI1IDYuNTQ5IDUuMjgxIDYuMDA0IDUuMjgxIDUuNDAyIEwgNS4yODEgNC4wNjkgTCA1LjI4MSAyLjczNiBMIDQuNjc2IDIuNzM2IFogTSAxNC40OSAxNy4yNzYgTCAxNC40OSAxNC43MzIgTCAxNC40OSAxMi4xODcgQyAxNC40OSAxMS45ODcgMTQuNDA5IDExLjgwNSAxNC4yNzcgMTEuNjczIEMgMTQuMTQ1IDExLjU0MiAxMy45NjQgMTEuNDYgMTMuNzYzIDExLjQ2IEwgMTAuMTI4IDExLjQ2IEwgNi40OTMgMTEuNDYgQyA2LjI5MyAxMS40NiA2LjExMSAxMS41NDIgNS45NzkgMTEuNjczIEMgNS44NDggMTEuODA1IDUuNzY2IDExLjk4NyA1Ljc2NiAxMi4xODcgTCA1Ljc2NiAxNC43MzIgTCA1Ljc2NiAxNy4yNzYgTCAxMC4xMjggMTcuMjc2IFogTSA2LjczNSAyLjczNiBMIDYuNzM1IDQuMDY5IEwgNi43MzUgNS40MDIgQyA2LjczNSA1LjYwMyA2LjgxNyA1Ljc4NCA2Ljk0OCA1LjkxNiBDIDcuMDggNi4wNDcgNy4yNjIgNi4xMjkgNy40NjIgNi4xMjkgTCA5LjY0MyA2LjEyOSBMIDExLjgyNCA2LjEyOSBDIDEyLjAyNSA2LjEyOSAxMi4yMDcgNi4wNDcgMTIuMzM4IDUuOTE2IEMgMTIuNDcgNS43ODQgMTIuNTUxIDUuNjAzIDEyLjU1MSA1LjQwMiBMIDEyLjU1MSA0LjA2OSBMIDEyLjU1MSAyLjczNiBMIDkuNjQzIDIuNzM2IFoiIHN0eWxlPSIiLz4KPC9zdmc+"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "其他浏览器中打开" : "Open in other browser",
        text: "%l",
        tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? "左键打开，右键设置浏览器路径" : "Left click: open in other browser\nRight click: set browser path",
        oncommand: function (event) {
            let browser, prefs = addMenu.prefs;
            browser = prefs.getStringPref("chooseBrowser");
            try {
                if (!browser) {
                    chooseBrowser();
                    browser = prefs.getStringPref("chooseBrowser");
                }
            } catch (e) { addMenu.log(e); }


            function chooseBrowser() {
                alert(Services.locale.appLocaleAsBCP47.includes("zh-") ? "请先设置浏览器的路径!!!" : "Please set browser path first!!!");
                let fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
                fp.init(window, Services.locale.appLocaleAsBCP47.includes("zh-") ? "设置浏览器路径" : "Set browser path", Ci.nsIFilePicker.modeOpen);
                fp.appendFilter(Services.locale.appLocaleAsBCP47.includes("zh-") ? "执行文件" : "Executable file", "*.exe");
                fp.open(res => {
                    if (res != Ci.nsIFilePicker.returnOK) return;
                    prefs.setStringPref("chooseBrowser", fp.file.path);
                });
            }

            if (event.button == 0) {
                let href = addMenu.convertText("%URL%");
                if (href.startsWith('http')) {
                    addMenu.exec(browser, href);
                } else {
                    addMenu.exec(browser);
                }
            } else if (event.button == 2) {
                if (event.ctrlKey) chooseBrowser()
                else addMenu.exec(browser);
            }
        },
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTkuNTY0IDEwLjEwOCBDIDE5LjU2NCAxMC43NTYgMTkuNDkzIDExLjQwMSAxOS4zNjEgMTIuMDI5IEMgMTkuMjI4IDEyLjY1OCAxOS4wMzQgMTMuMjcxIDE4Ljc4NiAxMy44NTUgQyAxOC41MzkgMTQuNDQgMTguMjM4IDE0Ljk5NyAxNy44OTQgMTUuNTEzIEMgMTcuNTUgMTYuMDI5IDE3LjE2MiAxNi41MDUgMTYuNzQgMTYuOTI3IEMgMTYuMzE3IDE3LjM1IDE1Ljg0MiAxNy43MzcgMTUuMzI2IDE4LjA4MSBDIDE0LjgxIDE4LjQyNSAxNC4yNTMgMTguNzI2IDEzLjY2OCAxOC45NzMgQyAxMy4wODMgMTkuMjIgMTIuNDcxIDE5LjQxNSAxMS44NDIgMTkuNTQ3IEMgMTEuMjE0IDE5LjY4IDEwLjU2OSAxOS43NTEgOS45MjEgMTkuNzUxIEMgOS4yNzQgMTkuNzUxIDguNjI5IDE5LjY4IDggMTkuNTQ3IEMgNy4zNzIgMTkuNDE1IDYuNzU5IDE5LjIyIDYuMTc0IDE4Ljk3MyBDIDUuNTg5IDE4LjcyNiA1LjAzMiAxOC40MjUgNC41MTYgMTguMDgxIEMgNCAxNy43MzcgMy41MjUgMTcuMzUgMy4xMDIgMTYuOTI3IEMgMi42OCAxNi41MDUgMi4yOTIgMTYuMDI5IDEuOTQ4IDE1LjUxMyBDIDEuNjA0IDE0Ljk5NyAxLjMwNCAxNC40NCAxLjA1NiAxMy44NTUgQyAwLjgwOSAxMy4yNzEgMC42MTUgMTIuNjU4IDAuNDgyIDEyLjAyOSBDIDAuMzQ5IDExLjQwMSAwLjI3OCAxMC43NTYgMC4yNzggMTAuMTA4IEMgMC4yNzggOS40NjEgMC4zNDkgOC44MTYgMC40ODIgOC4xODcgQyAwLjYxNSA3LjU1OSAwLjgwOSA2Ljk0NiAxLjA1NiA2LjM2MSBDIDEuMzA0IDUuNzc2IDEuNjA0IDUuMjE5IDEuOTQ4IDQuNzAzIEMgMi4yOTIgNC4xODcgMi42OCAzLjcxMiAzLjEwMiAzLjI4OSBDIDMuNTI1IDIuODY3IDQgMi40NzkgNC41MTYgMi4xMzUgQyA1LjAzMiAxLjc5MSA1LjU4OSAxLjQ5MSA2LjE3NCAxLjI0MyBDIDYuNzU5IDAuOTk2IDcuMzcyIDAuODAyIDggMC42NjkgQyA4LjYyOSAwLjUzNiA5LjI3NCAwLjQ2NSA5LjkyMSAwLjQ2NSBDIDEwLjU2OSAwLjQ2NSAxMS4yMTQgMC41MzYgMTEuODQyIDAuNjY5IEMgMTIuNDcxIDAuODAyIDEzLjA4NCAwLjk5NiAxMy42NjggMS4yNDMgQyAxNC4yNTMgMS40OTEgMTQuODEgMS43OTEgMTUuMzI2IDIuMTM1IEMgMTUuODQyIDIuNDc5IDE2LjMxOCAyLjg2NyAxNi43NCAzLjI4OSBDIDE3LjE2MyAzLjcxMiAxNy41NSA0LjE4NyAxNy44OTQgNC43MDMgQyAxOC4yMzggNS4yMTkgMTguNTM5IDUuNzc2IDE4Ljc4NiA2LjM2MSBDIDE5LjAzNCA2Ljk0NiAxOS4yMjggNy41NTkgMTkuMzYxIDguMTg3IEMgMTkuNDkzIDguODE2IDE5LjU2NCA5LjQ2MSAxOS41NjQgMTAuMTA4IFogTSAxNS4zMjUgNC43MDQgQyAxNC45NjUgNC4zNDUgMTQuNTg1IDQuMDI1IDE0LjE4MSAzLjc0NyBDIDEzLjc3OCAzLjQ3IDEzLjM1MiAzLjIzNSAxMi45MDIgMy4wNDUgQyAxMi40NTIgMi44NTUgMTEuOTggMi43MSAxMS40ODQgMi42MTMgQyAxMC45ODcgMi41MTUgMTAuNDY3IDIuNDY1IDkuOTIxIDIuNDY1IEMgOS4zNzUgMi40NjUgOC44NTUgMi41MTUgOC4zNTkgMi42MTMgQyA3Ljg2MiAyLjcxIDcuMzg5IDIuODU1IDYuOTQgMy4wNDUgQyA2LjQ5IDMuMjM1IDYuMDY0IDMuNDcgNS42NjEgMy43NDcgQyA1LjI1NyA0LjAyNSA0Ljg3NyA0LjM0NSA0LjUxNyA0LjcwNCBDIDQuMTU4IDUuMDY0IDMuODM4IDUuNDQ1IDMuNTYgNS44NDggQyAzLjI4MyA2LjI1MiAzLjA0OCA2LjY3OCAyLjg1OCA3LjEyNyBDIDIuNjY4IDcuNTc2IDIuNTIzIDguMDQ5IDIuNDI1IDguNTQ1IEMgMi4zMjggOS4wNDIgMi4yNzggOS41NjMgMi4yNzggMTAuMTA4IEMgMi4yNzggMTAuNjU0IDIuMzI4IDExLjE3NCAyLjQyNSAxMS42NzEgQyAyLjUyMyAxMi4xNjggMi42NjggMTIuNjQgMi44NTggMTMuMDg5IEMgMy4wNDggMTMuNTM5IDMuMjgzIDEzLjk2NSAzLjU2IDE0LjM2OCBDIDMuODM4IDE0Ljc3MiA0LjE1OCAxNS4xNTMgNC41MTcgMTUuNTEyIEMgNC44NzcgMTUuODcyIDUuMjU4IDE2LjE5MSA1LjY2MSAxNi40NjkgQyA2LjA2NSAxNi43NDYgNi40OTEgMTYuOTgxIDYuOTQgMTcuMTcxIEMgNy4zOSAxNy4zNjEgNy44NjIgMTcuNTA2IDguMzU5IDE3LjYwNCBDIDguODU1IDE3LjcwMSA5LjM3NiAxNy43NTEgOS45MjEgMTcuNzUxIEMgMTAuNDY3IDE3Ljc1MSAxMC45ODcgMTcuNzAxIDExLjQ4NCAxNy42MDQgQyAxMS45OCAxNy41MDYgMTIuNDUzIDE3LjM2MSAxMi45MDIgMTcuMTcxIEMgMTMuMzUyIDE2Ljk4MSAxMy43NzggMTYuNzQ2IDE0LjE4MSAxNi40NjkgQyAxNC41ODUgMTYuMTkxIDE0Ljk2NiAxNS44NzIgMTUuMzI1IDE1LjUxMiBDIDE1LjY4NSAxNS4xNTMgMTYuMDA0IDE0Ljc3MiAxNi4yODIgMTQuMzY4IEMgMTYuNTU5IDEzLjk2NSAxNi43OTQgMTMuNTM5IDE2Ljk4NCAxMy4wODkgQyAxNy4xNzQgMTIuNjQgMTcuMzE5IDEyLjE2OCAxNy40MTcgMTEuNjcxIEMgMTcuNTE0IDExLjE3NCAxNy41NjQgMTAuNjU0IDE3LjU2NCAxMC4xMDggQyAxNy41NjQgOS41NjMgMTcuNTE0IDkuMDQyIDE3LjQxNyA4LjU0NiBDIDE3LjMxOSA4LjA0OSAxNy4xNzQgNy41NzcgMTYuOTg0IDcuMTI3IEMgMTYuNzk0IDYuNjc4IDE2LjU1OSA2LjI1MiAxNi4yODIgNS44NDggQyAxNi4wMDQgNS40NDUgMTUuNjg1IDUuMDY0IDE1LjMyNSA0LjcwNCBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSAxNC4zNzggMTAuMTA4IEMgMTQuMzc4IDEwLjY4OCAxNC4yNCAxMS4yODggMTQuMDA3IDExLjgzNyBDIDEzLjc3NSAxMi4zODYgMTMuNDQ5IDEyLjg4NCAxMy4wNzMgMTMuMjYgQyAxMi42OTcgMTMuNjM2IDEyLjE5OSAxMy45NjIgMTEuNjUgMTQuMTk0IEMgMTEuMTAxIDE0LjQyNiAxMC41MDEgMTQuNTY1IDkuOTIxIDE0LjU2NSBDIDkuMzQyIDE0LjU2NSA4Ljc0MSAxNC40MjYgOC4xOTIgMTQuMTk0IEMgNy42NDMgMTMuOTYyIDcuMTQ1IDEzLjYzNiA2Ljc2OSAxMy4yNiBDIDYuMzk0IDEyLjg4NCA2LjA2NyAxMi4zODYgNS44MzUgMTEuODM3IEMgNS42MDMgMTEuMjg4IDUuNDY0IDEwLjY4OCA1LjQ2NCAxMC4xMDggQyA1LjQ2NCA5LjUyOSA1LjYwMyA4LjkyOSA1LjgzNSA4LjM3OSBDIDYuMDY3IDcuODMgNi4zOTQgNy4zMzIgNi43NjkgNi45NTYgQyA3LjE0NSA2LjU4MSA3LjY0MyA2LjI1NCA4LjE5MiA2LjAyMiBDIDguNzQyIDUuNzkgOS4zNDIgNS42NTEgOS45MjEgNS42NTEgQyAxMC41MDEgNS42NTEgMTEuMTAxIDUuNzkgMTEuNjUgNi4wMjIgQyAxMi4xOTkgNi4yNTQgMTIuNjk3IDYuNTgxIDEzLjA3MyA2Ljk1NiBDIDEzLjQ0OSA3LjMzMiAxMy43NzUgNy44MyAxNC4wMDcgOC4zNzkgQyAxNC4yNCA4LjkyOSAxNC4zNzggOS41MjkgMTQuMzc4IDEwLjEwOCBaIE0gMTEuNjU4IDguMzcxIEMgMTEuNDA5IDguMTIxIDExLjE2MiA3Ljk0MSAxMC44ODQgNy44MjQgQyAxMC42MDYgNy43MDYgMTAuMjk2IDcuNjUxIDkuOTIxIDcuNjUxIEMgOS41NDYgNy42NTEgOS4yMzcgNy43MDYgOC45NTggNy44MjQgQyA4LjY4IDcuOTQxIDguNDM0IDguMTIxIDguMTg0IDguMzcxIEMgNy45MzQgOC42MjEgNy43NTQgOC44NjcgNy42MzYgOS4xNDUgQyA3LjUxOSA5LjQyNCA3LjQ2NCA5LjczMyA3LjQ2NCAxMC4xMDggQyA3LjQ2NCAxMC40ODMgNy41MTkgMTAuNzkzIDcuNjM2IDExLjA3MSBDIDcuNzU0IDExLjM0OSA3LjkzNCAxMS41OTYgOC4xODQgMTEuODQ1IEMgOC40MzMgMTIuMDk1IDguNjggMTIuMjc1IDguOTU4IDEyLjM5MyBDIDkuMjM3IDEyLjUxIDkuNTQ2IDEyLjU2NSA5LjkyMSAxMi41NjUgQyAxMC4yOTYgMTIuNTY1IDEwLjYwNiAxMi41MSAxMC44ODQgMTIuMzkzIEMgMTEuMTYyIDEyLjI3NSAxMS40MDggMTIuMDk1IDExLjY1OCAxMS44NDUgQyAxMS45MDggMTEuNTk2IDEyLjA4OCAxMS4zNDkgMTIuMjA1IDExLjA3MSBDIDEyLjMyMyAxMC43OTMgMTIuMzc4IDEwLjQ4MyAxMi4zNzggMTAuMTA4IEMgMTIuMzc4IDkuNzMzIDEyLjMyMyA5LjQyNCAxMi4yMDUgOS4xNDUgQyAxMi4wODggOC44NjcgMTEuOTA4IDguNjIxIDExLjY1OCA4LjM3MSBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSA5LjkyMSA1LjY1MSBMIDEwLjkxMiA1LjY1MSBMIDExLjkwMyA1LjY1MSBMIDEyLjg5MyA1LjY1MSBMIDEzLjg4NCA1LjY1MSBMIDE0Ljg3NSA1LjY1MSBMIDE1Ljg2NiA1LjY1MSBMIDE2Ljg1NiA1LjY1MSBMIDE3Ljg0NyA1LjY1MSBMIDE3Ljg0NyA2LjY1MSBMIDE3Ljg0NyA3LjY1MSBMIDE2Ljg1NiA3LjY1MSBMIDE1Ljg2NiA3LjY1MSBMIDE0Ljg3NSA3LjY1MSBMIDEzLjg4NCA3LjY1MSBMIDEyLjg5NCA3LjY1MSBMIDExLjkwMyA3LjY1MSBMIDEwLjkxMiA3LjY1MSBMIDkuOTIxIDcuNjUxIEwgOS45MjEgNi42NTEgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gMy44MyA0LjQ3NCBMIDQuMzI2IDUuMzMyIEwgNC44MjIgNi4xODkgTCA1LjMxOCA3LjA0NyBMIDUuODE0IDcuOTA1IEwgNi4zMSA4Ljc2MyBMIDYuODA2IDkuNjIxIEwgNy4zMDIgMTAuNDc5IEwgNy43OTcgMTEuMzM2IEwgNi45MzEgMTEuODM2IEwgNi4wNjUgMTIuMzM2IEwgNS41NyAxMS40NzkgTCA1LjA3NCAxMC42MjEgTCA0LjU3OCA5Ljc2NCBMIDQuMDgyIDguOTA2IEwgMy41ODYgOC4wNDkgTCAzLjA5IDcuMTkxIEwgMi41OTQgNi4zMzMgTCAyLjA5OCA1LjQ3NCBMIDIuOTY0IDQuOTc0IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDkuODE5IDE5LjE5OSBMIDEwLjMxNCAxOC4zNDIgTCAxMC44MDkgMTcuNDg0IEwgMTEuMzA0IDE2LjYyNiBMIDExLjc5OSAxNS43NjggTCAxMi4yOTQgMTQuOTEgTCAxMi43ODkgMTQuMDUyIEwgMTMuMjgzIDEzLjE5MyBMIDEzLjc3OCAxMi4zMzUgTCAxMi45MTIgMTEuODM2IEwgMTIuMDQ2IDExLjMzNyBMIDExLjU1MSAxMi4xOTQgTCAxMS4wNTcgMTMuMDUyIEwgMTAuNTYyIDEzLjkxIEwgMTAuMDY3IDE0Ljc2OCBMIDkuNTcyIDE1LjYyNiBMIDkuMDc3IDE2LjQ4NCBMIDguNTgyIDE3LjM0MiBMIDguMDg3IDE4LjE5OSBMIDguOTUzIDE4LjY5OSBaIiBzdHlsZT0iIi8+Cjwvc3ZnPg==",
        accesskey: 'e'
    }];
    var menu = PageMenu({
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "多功能菜单" : "Multifunction Menu",
        id: "addMenu-multiFunction",
        condition: 'normal',
        insertBefore: 'context-savepage',
        accesskey: 'M',
        onpopupshowing: syncHidden,
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMjAgMjAiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIGZpbGw9ImNvbnRleHQtZmlsbCIgZmlsbC1vcGFjaXR5PSJjb250ZXh0LWZpbGwtb3BhY2l0eSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNIDE3LjgwNyAzLjIwNSBMIDEuNTkgMy4yMDUgQyAxLjQ5OSAzLjIwNSAxLjQyNSAzLjI4NSAxLjQyNSAzLjM4IEwgMS40MjUgNC43ODQgQyAxLjQyNSA0Ljg4IDEuNDk5IDQuOTU4IDEuNTkgNC45NTggTCAxNy44MDcgNC45NTggQyAxNy44MDcgNS4yMzIgMTcuOTczIDQuODggMTcuOTczIDQuNzg0IEwgMTcuOTczIDMuMzggQyAxNy45NzMgMy4yODUgMTcuODk4IDMuMjA1IDE3LjgwNyAzLjIwNSBaIE0gMTcuODA3IDE1LjYwOCBMIDEuNTkgMTUuNjA4IEMgMS40OTkgMTUuNjA4IDEuNDI1IDE1LjY4NyAxLjQyNSAxNS43ODQgTCAxLjQyNSAxNy4xODcgQyAxLjQyNSAxNy4yODMgMS40OTkgMTcuMzYxIDEuNTkgMTcuMzYxIEwgMTcuODA3IDE3LjM2MSBDIDE3Ljg5OCAxNy4zNjEgMTcuOTczIDE3LjI4MyAxNy45NzMgMTcuMTg3IEwgMTcuOTczIDE1Ljc4NCBDIDE3Ljk3MyAxNS42ODcgMTcuODk4IDE1LjYwOCAxNy44MDcgMTUuNjA4IFogTSAxNy44MDcgOS40NzMgTCAxLjU5IDkuNDczIEMgMS40OTkgOS40NzMgMS40MjUgOS41NTMgMS40MjUgOS42NSBMIDEuNDI1IDExLjA1MyBDIDEuNDI1IDExLjE1IDEuNDk5IDExLjIyOSAxLjU5IDExLjIyOSBMIDE3LjgwNyAxMS4yMjkgQyAxNy44OTggMTEuMjI5IDE3Ljk3MyAxMS4xNSAxNy45NzMgMTEuMDUzIEwgMTcuOTczIDkuNjUgQyAxNy45NzMgOS41NTMgMTcuODk4IDkuNDczIDE3LjgwNyA5LjQ3MyBaIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAwcHg7Ii8+Cjwvc3ZnPg=="
    });
    menu(items);
    css('#context-savepage { display: none }');
};
//检查页面
new function () {
    var groupMenu = GroupMenu({
        id: 'addMenu-inspect-page',
        class: 'showFirstText',
        insertAfter: 'inspect-separator',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '检查页面' : 'Inspect node',
        condition: 'normal',
        onpopupshowing: syncHidden
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '检查页面' : 'Inspect node',
        oncommand: 'gContextMenu.inspectNode();',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjkuODE3IiBjeT0iOS45NTciIHI9IjguMTk5IiBzdHlsZT0iIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0gMTkuMDE2IDkuOTU3IEMgMTkuMDE2IDEyLjQyNSAxNy45MzEgMTQuODUyIDE2LjMyMiAxNi40NjIgQyAxNC43MTIgMTguMDcxIDEyLjI4NSAxOS4xNTYgOS44MTcgMTkuMTU2IEMgNy4zNDkgMTkuMTU2IDQuOTIyIDE4LjA3MSAzLjMxMiAxNi40NjIgQyAxLjcwMyAxNC44NTIgMC42MTggMTIuNDI1IDAuNjE4IDkuOTU3IEMgMC42MTggNy40ODkgMS43MDMgNS4wNjIgMy4zMTIgMy40NTIgQyA0LjkyMiAxLjg0MyA3LjM0OSAwLjc1OCA5LjgxNyAwLjc1OCBDIDEyLjI4NSAwLjc1OCAxNC43MTIgMS44NDMgMTYuMzIyIDMuNDUyIEMgMTcuOTMxIDUuMDYyIDE5LjAxNiA3LjQ4OSAxOS4wMTYgOS45NTcgWiBNIDE0LjkwNyA0Ljg2NyBDIDEzLjU1IDMuNTA5IDExLjg3NyAyLjc1OCA5LjgxNyAyLjc1OCBDIDcuNzU3IDIuNzU4IDYuMDg0IDMuNTA5IDQuNzI3IDQuODY3IEMgMy4zNjkgNi4yMjQgMi42MTggNy44OTcgMi42MTggOS45NTcgQyAyLjYxOCAxMi4wMTcgMy4zNjkgMTMuNjkgNC43MjcgMTUuMDQ3IEMgNi4wODQgMTYuNDA1IDcuNzU3IDE3LjE1NiA5LjgxNyAxNy4xNTYgQyAxMS44NzcgMTcuMTU2IDEzLjU1IDE2LjQwNSAxNC45MDcgMTUuMDQ3IEMgMTYuMjY1IDEzLjY5IDE3LjAxNiAxMi4wMTcgMTcuMDE2IDkuOTU3IEMgMTcuMDE2IDcuODk3IDE2LjI2NSA2LjIyNCAxNC45MDcgNC44NjcgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gOS44MTcgMS43NTggTCA5LjgxNyAyLjY2OSBMIDkuODE3IDMuNTggTCA5LjgxNyA0LjQ5MSBMIDkuODE3IDUuNDAyIiBzdHlsZT0iIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0gOC44MTcgMi43NTggTCA4LjgxNyAzLjY2OSBMIDguODE3IDQuNTggTCA4LjgxNyA1LjQ5MSBMIDguODE3IDYuNDAyIEwgMTAuODE3IDYuNDAyIEwgMTAuODE3IDUuNDkxIEwgMTAuODE3IDQuNTggTCAxMC44MTcgMy42NjkgTCAxMC44MTcgMi43NTggWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gOS44MTcgMTguMTU2IEwgOS44MTcgMTYuNzkgTCA5LjgxNyAxNS40MjMiIHN0eWxlPSIiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHBhdGggZD0iTSA4LjgxNyAxNy4xNTYgTCA4LjgxNyAxNS43OSBMIDguODE3IDE0LjQyMyBMIDEwLjgxNyAxNC40MjMgTCAxMC44MTcgMTUuNzkgTCAxMC44MTcgMTcuMTU2IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDEuNjE3IDkuOTU3IEwgMy40MzkgOS45NTcgTCA1LjI2MSA5Ljk1NyIgc3R5bGU9IiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNIDIuNjE3IDEwLjk1NyBMIDQuNDM5IDEwLjk1NyBMIDYuMjYxIDEwLjk1NyBMIDYuMjYxIDguOTU3IEwgNC40MzkgOC45NTcgTCAyLjYxNyA4Ljk1NyBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSAxOC4wMTYgOS45NTcgTCAxNi42NSA5Ljk1NyBMIDE1LjI4MyA5Ljk1NyIgc3R5bGU9IiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNIDE0LjI4MyA4Ljk1NyBMIDE1LjY1IDguOTU3IEwgMTcuMDE2IDguOTU3IEwgMTcuMDE2IDEwLjk1NyBMIDE1LjY1IDEwLjk1NyBMIDE0LjI4MyAxMC45NTcgWiIgc3R5bGU9IiIvPgogIDxjaXJjbGUgc3R5bGU9InN0cm9rZS13aWR0aDogMHB4OyIgY3g9IjkuNDEiIGN5PSIxMC4zNjQiIHI9IjEuNDA3Ii8+Cjwvc3ZnPg==",
        accesskey: 'i'
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '查看页面代码' : 'View page source',
        oncommand: 'BrowserViewSource(gContextMenu.browser);',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNS43MjQgMTQuMzUgQyA1LjQ3OSAxNC4zNSA1LjI0MyAxNC4yNjEgNS4wNiAxNC4wOTggTCAwIDkuNiBMIDUuMzQxIDQuODUyIEMgNS45MjYgNC4zNTIgNi44MzQgNC42NzIgNi45NzQgNS40MjkgQyA3LjAzNyA1Ljc2NyA2LjkyMiA2LjExNCA2LjY2OSA2LjM0NyBMIDMuMDEgOS42IEwgNi4zODggMTIuNjAyIEMgNi45NjQgMTMuMTEzIDYuNzcxIDE0LjA1NiA2LjA0IDE0LjI5OSBDIDUuOTM5IDE0LjMzMyA1LjgzMiAxNC4zNSA1LjcyNCAxNC4zNSBaIE0gMTQuNjY5IDE0LjM0OCBMIDIwLjAxIDkuNiBMIDE0Ljk1IDUuMTAyIEMgMTQuMzc1IDQuNTkxIDEzLjQ2MiA0Ljg5NCAxMy4zMDcgNS42NDggQyAxMy4yMzUgNS45OTggMTMuMzU1IDYuMzYgMTMuNjIyIDYuNTk3IEwgMTcgOS42IEwgMTMuMzQxIDEyLjg1MiBDIDEyLjc2NSAxMy4zNjMgMTIuOTU5IDE0LjMwNiAxMy42ODkgMTQuNTQ5IEMgMTQuMDI5IDE0LjY2MiAxNC40MDIgMTQuNTg1IDE0LjY2OSAxNC4zNDggWiBNIDkuOTkxIDE1Ljc2NSBMIDExLjk5MSAzLjc2NSBDIDEyLjEzOSAzLjAwOSAxMS40MTMgMi4zNzggMTAuNjg1IDIuNjI4IEMgMTAuMzI4IDIuNzUgMTAuMDcxIDMuMDYzIDEwLjAxOSAzLjQzNiBMIDguMDE5IDE1LjQzNiBDIDcuODcyIDE2LjE5MiA4LjU5OCAxNi44MjMgOS4zMjYgMTYuNTczIEMgOS42ODIgMTYuNDUxIDkuOTM5IDE2LjEzOCA5Ljk5MSAxNS43NjUgWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMHB4OyIvPgo8L3N2Zz4=",
        accesskey: 'v'
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '查看页面信息' : 'View page info',
        oncommand: 'gContextMenu.viewInfo();',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMC45OSAyLjY1OSBDIDAuOTk0IDIuMTcxIDEuMzg5IDEuNzc1IDEuODc3IDEuNzcxIEwgMTcuOTc5IDEuNzcxIEMgMTguNDY5IDEuNzcxIDE4Ljg2NiAyLjE2OSAxOC44NjYgMi42NTkgTCAxOC44NjYgMTYuOTcyIEMgMTguODYyIDE3LjQ2IDE4LjQ2OCAxNy44NTYgMTcuOTc5IDE3Ljg1OSBMIDEuODc3IDE3Ljg1OSBDIDEuMzg3IDE3Ljg1OCAwLjk5IDE3LjQ2MSAwLjk5IDE2Ljk3MiBMIDAuOTkgMi42NTkgWiBNIDIuNzc4IDMuNTU5IEwgMi43NzggMTYuMDcyIEwgMTcuMDc4IDE2LjA3MiBMIDE3LjA3OCAzLjU1OSBMIDIuNzc4IDMuNTU5IFogTSA0LjU2NSA1LjM0NiBMIDkuOTI4IDUuMzQ2IEwgOS45MjggMTAuNzA5IEwgNC41NjUgMTAuNzA5IEwgNC41NjUgNS4zNDYgWiBNIDYuMzUzIDcuMTM0IEwgNi4zNTMgOC45MjEgTCA4LjE0IDguOTIxIEwgOC4xNCA3LjEzNCBMIDYuMzUzIDcuMTM0IFogTSA0LjU2NSAxMi40OTYgTCAxNS4yOTEgMTIuNDk2IEwgMTUuMjkxIDE0LjI4NCBMIDQuNTY1IDE0LjI4NCBMIDQuNTY1IDEyLjQ5NiBaIE0gMTEuNzE1IDUuMzQ2IEwgMTUuMjkxIDUuMzQ2IEwgMTUuMjkxIDcuMTM0IEwgMTEuNzE1IDcuMTM0IEwgMTEuNzE1IDUuMzQ2IFogTSAxMS43MTUgOC45MjEgTCAxNS4yOTEgOC45MjEgTCAxNS4yOTEgMTAuNzA5IEwgMTEuNzE1IDEwLjcwOSBMIDExLjcxNSA4LjkyMSBaIiBzdHlsZT0iIi8+Cjwvc3ZnPg==",
        accesskey: 'o'
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "检查无障碍环境属性" : "Checking accessibility properties",
        oncommand: "gContextMenu.inspectA11Y();",
        image: "chrome://devtools/skin/images/tool-accessibility.svg",
        accesskey: "c"
    }]);
    css('#context-viewsource, #context-inspect-a11y, #context-inspect, #context-media-eme-separator { display: none }');
};
// 站内搜索
new function () {
    var groupMenu = new GroupMenu({
        id: 'addMenu-site-search',
        class: 'showFirstText',
        insertAfter: 'context-selectall',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '站内搜索...' : 'Site search...',
        condition: 'normal',
        onshowing: function () {
            this.hidden = !gBrowser.currentURI.spec.startsWith('http');
        }
    });
    var items = [{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '站内搜索' : 'Site search',
        oncommand: function () {
            var text = prompt(Services.locale.appLocaleAsBCP47.includes("zh-") ? '站内搜索:' : 'Site search:', '');
            if (text.length > 0) {
                Services.search.getDefault().then(
                    engine => {
                        let submission = engine.getSubmission(encodeURIComponent(gBrowser.currentURI.host) + ' ' + encodeURIComponent(text), null, 'search');
                        openLinkIn(submission.uri.spec, 'tab', {
                            private: false,
                            postData: submission.postData,
                            inBackground: false,
                            relatedToCurrent: true,
                            triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}),
                        });
                    }
                );
            }
        },
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTMgNC41IEEgMS41IDEuNSAwIDAgMCAxLjUgNiBBIDEuNSAxLjUgMCAwIDAgMyA3LjUgQSAxLjUgMS41IDAgMCAwIDQuNSA2IEEgMS41IDEuNSAwIDAgMCAzIDQuNSB6IE0gNyA1TDcgN0wyMiA3TDIyIDVMNyA1IHogTSAzIDEwLjUgQSAxLjUgMS41IDAgMCAwIDEuNSAxMiBBIDEuNSAxLjUgMCAwIDAgMyAxMy41IEEgMS41IDEuNSAwIDAgMCA0LjUgMTIgQSAxLjUgMS41IDAgMCAwIDMgMTAuNSB6IE0gNyAxMUw3IDEzTDEzLjEwNTQ2OSAxM0MxNC4zNjc0NjkgMTEuNzY0IDE2LjA5NCAxMSAxOCAxMUw3IDExIHogTSAxOCAxM0MxNS4yIDEzIDEzIDE1LjIgMTMgMThDMTMgMjAuOCAxNS4yIDIzIDE4IDIzQzE5IDIzIDIwLjAwMDc4MSAyMi42OTkyMTkgMjAuODAwNzgxIDIyLjE5OTIxOUwyMi41OTk2MDkgMjRMMjQgMjIuNTk5NjA5TDIyLjE5OTIxOSAyMC44MDA3ODFDMjIuNjk5MjE5IDIwLjAwMDc4MSAyMyAxOSAyMyAxOEMyMyAxNS4yIDIwLjggMTMgMTggMTMgeiBNIDE4IDE1QzE5LjcgMTUgMjEgMTYuMyAyMSAxOEMyMSAxOS43IDE5LjcgMjEgMTggMjFDMTYuMyAyMSAxNSAxOS43IDE1IDE4QzE1IDE2LjMgMTYuMyAxNSAxOCAxNSB6IE0gMyAxNi41IEEgMS41IDEuNSAwIDAgMCAxLjUgMTggQSAxLjUgMS41IDAgMCAwIDMgMTkuNSBBIDEuNSAxLjUgMCAwIDAgNC41IDE4IEEgMS41IDEuNSAwIDAgMCAzIDE2LjUgeiBNIDcgMTdMNyAxOUwxMS4wODAwNzggMTlDMTEuMDMzMDc4IDE4LjY3MyAxMSAxOC4zNCAxMSAxOEMxMSAxNy42NiAxMS4wMzMwNzggMTcuMzI3IDExLjA4MDA3OCAxN0w3IDE3IHoiIC8+DQo8L3N2Zz4=",
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '百度站内搜索' : 'Baidu site search',
        oncommand: function () {
            var text = prompt(Services.locale.appLocaleAsBCP47.includes("zh-") ? '百度站内搜索:' : 'Baidu site search:', '');
            if (text.length > 0) {
                let url = 'https://www.baidu.com/s?wd=site:' + encodeURIComponent(gBrowser.currentURI.host) + ' ' + encodeURIComponent(text);
                addMenu.openCommand({ 'target': this }, url, 'tab');
            }
        },
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+DQogIDxwYXRoIGZpbGw9IiMxNTY1YzAiIGQ9Ik0zNi4wOTQgMzEuMzVjLTEuNjk1LTEuNS0zLjc1NC0zLjIyNS02LjY2LTcuMzUtMS44NjUtMi42NDctMy41MTItNC01LjkzNC00LTIuNjY0IDAtNC4xMTcgMS4yNS01LjU1MiAzLjI3OS0yLjEgMi45NzEtMi45MjUgMy45NzEtNS4wODggNS42NzUtLjc4Ni42MTktNC44NjEgMy4xNzItNC44NiA3LjY3MUM4LjAwMSA0MS44NzUgMTEuNzUzIDQ0IDE1LjE1NSA0NGM0LjQ2OSAwIDUuNDM5LTEgOC4zNDUtMSAzLjYzMyAwIDUuNTcgMSA4LjQ3NiAxQzM3Ljc4OSA0NCAzOSAzOS42MjUgMzkgMzYuODcyIDM5IDM0LjI1IDM3Ljc4OSAzMi44NSAzNi4wOTQgMzEuMzV6TTExLjM4OSAyNC44ODVjMy4xMjQtLjY5NCAzLjYxNi0zLjczOSAzLjYxMS01LjczMi0uMDAyLS42OTYtLjA2NC0xLjI2My0uMDk2LTEuNTU4LS4xOTgtMS42NzgtMi4wMjctNC41NS00LjU1MS00LjU5NC0uMTItLjAwMi0uMjQyLjAwMi0uMzY1LjAxMy0zLjQxMi4zMTQtMy45MTEgNS40MTItMy45MTEgNS40MTItLjA1Ni4yODctLjA4Mi42MTMtLjA3OC45NjMuMDMxIDIuMjYzIDEuMzU2IDUuNTI3IDQuMjc0IDUuNjFDMTAuNjIzIDI1LjAwOCAxMC45OTQgMjQuOTczIDExLjM4OSAyNC44ODVNMTkuNTAzIDE2QzIxLjk5IDE2IDI0IDEzLjMxNSAyNCA5Ljk5OCAyNCA2LjY4MSAyMS45OSA0IDE5LjUwMyA0IDE3LjAxNSA0IDE1IDYuNjgxIDE1IDkuOTk4IDE1IDEzLjMxNSAxNy4wMTUgMTYgMTkuNTAzIDE2TTI5LjUyMiAxNi45NjRjLjIyMS4wMzEuNDM2LjA0MS42NDUuMDMzIDIuNjk2LS4xMDMgNC40MTYtMy4yNzYgNC43ODEtNS43MjMuMDM3LS4yNDEuMDU0LS40ODYuMDUyLS43MzMtLjAxNS0yLjQ0MS0xLjgzMS01LjAxMi0zLjc5OS01LjQ5LTIuMTc3LS41MzItNC44OTMgMy4xNzMtNS4xMzggNS41OS0uMDM3LjM3LS4wNTkuNzM5LS4wNjMgMS4xMDNDMjUuOTc1IDE0LjI5NiAyNi44NDEgMTYuNTk5IDI5LjUyMiAxNi45NjRNNDEuOTg0IDIxLjE0MmMwLTEuMjgxLTEuMDA0LTUuMTQyLTQuNzQyLTUuMTQyQzMzLjQ5NiAxNiAzMyAxOS42NDQgMzMgMjIuMjE5YzAgMi40MS4xODcgNS43NTIgNC41NzggNS43ODEuMDg3LjAwMS4xNzYgMCAuMjY3LS4wMDIgNC4wMjctLjA5NCA0LjE4My00LjIwMyA0LjE1Mi02LjEzOEM0MS45OTMgMjEuNTYxIDQxLjk4NCAyMS4zMTUgNDEuOTg0IDIxLjE0MiIgLz4NCiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI0IDMxdjcuNWMwIDAgMCAxLjg3NSAyLjYyNSAyLjVIMzNWMzFoLTIuNjI1djcuNWgtMi43NWMwIDAtLjg3NS0uMTI1LTEtLjc1VjMxSDI0ek0yMCAyN3Y0aC0zYy0yLjEyNS4zNzUtNCAyLjI1LTMuOTk5IDQuODc1QzEzLjAwMSAzNS45MTcgMTMgMzUuOTU4IDEzIDM2YzAgMi43NSAxLjg3NSA0LjYyNSA0IDVoNS42MjVWMjdIMjB6TTIwIDM4Ljc1aC0yLjM3NWMtLjc1IDAtMi0xLjEyNS0yLTIuNzVzMS4yNS0yLjc1IDItMi43NUgyMFYzOC43NXoiIC8+DQo8L3N2Zz4="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '谷歌站内搜索' : 'Google site search',
        condition: 'normal',
        oncommand: function () {
            var sel = (gContextMenu || { textSelected: "" }).textSelected;
            if (sel.length == 0) sel = prompt(Services.locale.appLocaleAsBCP47.includes("zh-") ? '谷歌站内搜索:' : 'Google site search:', '');
            if (sel.length > 0) {
                let url = 'https://www.google.com/search?q=site:' + encodeURIComponent(gBrowser.currentURI.host) + ' ' + encodeURIComponent(sel);
                addMenu.openCommand({ 'target': this }, url, 'tab');
            }
        },
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA0OCA0OCI+DQogIDxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCiAgPHBhdGggZmlsbD0iI0ZGM0QwMCIgZD0iTTYuMzA2LDE0LjY5MWw2LjU3MSw0LjgxOUMxNC42NTUsMTUuMTA4LDE4Ljk2MSwxMiwyNCwxMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzE2LjMxOCw0LDkuNjU2LDguMzM3LDYuMzA2LDE0LjY5MXoiIC8+DQogIDxwYXRoIGZpbGw9IiM0Q0FGNTAiIGQ9Ik0yNCw0NGM1LjE2NiwwLDkuODYtMS45NzcsMTMuNDA5LTUuMTkybC02LjE5LTUuMjM4QzI5LjIxMSwzNS4wOTEsMjYuNzE1LDM2LDI0LDM2Yy01LjIwMiwwLTkuNjE5LTMuMzE3LTExLjI4My03Ljk0NmwtNi41MjIsNS4wMjVDOS41MDUsMzkuNTU2LDE2LjIyNyw0NCwyNCw0NHoiIC8+DQogIDxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCjwvc3ZnPg=="
    }];
    groupMenu(items);
}
// 页面右键菜单 End ==============================================================
// 链接右键菜单 Start ============================================================
//打开链接的各种方法
new function () {
    var groupMenu = GroupMenu({
        id: 'addMenu-openLink-tab',
        class: 'showFirstText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "打开链接..." : "Open Link...",
        condition: 'link',
        insertAfter: 'spell-suggestions-separator',
        onshowing: function () {
            // open in private tab need privateTab.uc.js https://github.com/xiaoxiaoflood/firefox-scripts/blob/master/chrome/privateTab.uc.js
            let privateBtn = document.getElementById('addMenu-openLink-tab-private')
            if (privateBtn) privateBtn.hidden = typeof UC.privateTab === "undefined";
        }
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "打开链接" : "Open Link",
        oncommand: 'gContextMenu.openLinkInCurrent();',
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ij4NCiAgPHBhdGggZD0iTTE0IDFDNi44IDEgMSA2LjggMSAxNEwxIDI4TDEgMTE0QzEgMTIxLjIgNi44IDEyNyAxNCAxMjdMMTE0IDEyN0MxMjEuMiAxMjcgMTI3IDEyMS4yIDEyNyAxMTRMMTI3IDE0QzEyNyA2LjggMTIxLjIgMSAxMTQgMUwxNCAxIHogTSAxNCA3TDExNCA3QzExNy45IDcgMTIxIDEwLjEgMTIxIDE0TDEyMSAyOUw3IDI5TDcgMTRDNyAxMC4xIDEwLjEgNyAxNCA3IHogTSAxOCAxNUMxNi4zIDE1IDE1IDE2LjMgMTUgMThDMTUgMTkuNyAxNi4zIDIxIDE4IDIxTDIyIDIxQzIzLjcgMjEgMjUgMTkuNyAyNSAxOEMyNSAxNi4zIDIzLjcgMTUgMjIgMTVMMTggMTUgeiBNIDM0IDE1QzMyLjMgMTUgMzEgMTYuMyAzMSAxOEMzMSAxOS43IDMyLjMgMjEgMzQgMjFMMzggMjFDMzkuNyAyMSA0MSAxOS43IDQxIDE4QzQxIDE2LjMgMzkuNyAxNSAzOCAxNUwzNCAxNSB6IE0gNyAzNUwxMjEgMzVMMTIxIDExNEMxMjEgMTE3LjkgMTE3LjkgMTIxIDExNCAxMjFMMTQgMTIxQzEwLjEgMTIxIDcgMTE3LjkgNyAxMTRMNyAzNSB6IE0gNDAgNjRDMzEuNyA2NCAyNSA3MC43IDI1IDc5QzI1IDg3LjMgMzEuNyA5NCA0MCA5NEw1MS41IDk0QzUzLjIgOTQgNTQuNSA5Mi43IDU0LjUgOTFDNTQuNSA4OS4zIDUzLjIgODggNTEuNSA4OEw0MCA4OEMzNSA4OCAzMSA4NCAzMSA3OUMzMSA3NCAzNSA3MCA0MCA3MEw1MS41IDcwQzUzLjIgNzAgNTQuNSA2OC43IDU0LjUgNjdDNTQuNSA2NS4zIDUzLjIgNjQgNTEuNSA2NEw0MCA2NCB6IE0gNzYuNSA2NEM3NC44IDY0IDczLjUgNjUuMyA3My41IDY3QzczLjUgNjguNyA3NC44IDcwIDc2LjUgNzBMODggNzBDOTMgNzAgOTcgNzQgOTcgNzlDOTcgODQgOTMgODggODggODhMNzYuNSA4OEM3NC44IDg4IDczLjUgODkuMyA3My41IDkxQzczLjUgOTIuNyA3NC44IDk0IDc2LjUgOTRMODggOTRDOTYuMyA5NCAxMDMgODcuMyAxMDMgNzlDMTAzIDcwLjcgOTYuMyA2NCA4OCA2NEw3Ni41IDY0IHogTSA1NCA3NkM1Mi4zIDc2IDUxIDc3LjMgNTEgNzlDNTEgODAuNyA1Mi4zIDgyIDU0IDgyTDc0IDgyQzc1LjcgODIgNzcgODAuNyA3NyA3OUM3NyA3Ny4zIDc1LjcgNzYgNzQgNzZMNTQgNzYgeiIgLz4NCjwvc3ZnPg==",
        accesskey: "H"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "在新标签中打开" : "Open in New Tab",
        oncommand: 'gContextMenu.openLinkInTab(event);',
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiBzdHJva2Utd2lkdGg9IjEiPg0KICA8cGF0aCBkPSJNNSAyQzMuMzU1NDY5IDIgMiAzLjM1NTQ2OSAyIDVMMiAxOUMyIDIwLjY0NDUzMSAzLjM1NTQ2OSAyMiA1IDIyTDE5IDIyQzIwLjY0NDUzMSAyMiAyMiAyMC42NDQ1MzEgMjIgMTlMMjIgNUMyMiAzLjM1NTQ2OSAyMC42NDQ1MzEgMiAxOSAyIFogTSA1IDRMMTkgNEMxOS41NjY0MDYgNCAyMCA0LjQzMzU5NCAyMCA1TDIwIDE5QzIwIDE5LjU2NjQwNiAxOS41NjY0MDYgMjAgMTkgMjBMNSAyMEM0LjQzMzU5NCAyMCA0IDE5LjU2NjQwNiA0IDE5TDQgNUM0IDQuNDMzNTk0IDQuNDMzNTk0IDQgNSA0IFogTSA2IDZMNiA4TDE0LjU5Mzc1IDhMNiAxNi41OTM3NUw3LjQwNjI1IDE4TDE2IDkuNDA2MjVMMTYgMThMMTggMThMMTggNloiIC8+DQo8L3N2Zz4=",
    }, {
        id: 'addMenu-openLink-tab-private',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "在无痕标签中打开" : "Open in Private Tab",
        oncommand: "var dom = document.getElementById('openLinkInPrivateTab'); if (dom) dom.doCommand();",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTAgNTAiIGZpbGw9ImNvbnRleHQtZmlsbCIgZmlsbC1vcGFjaXR5PSJjb250ZXh0LWZpbGwtb3BhY2l0eSI+PHBhdGggZD0iTTIxLjk4MDQ2OSAyQzE4LjEzNjcxOSAyLjA4NTkzOCAxNS4zNzUgMy4xOTkyMTkgMTMuNzY1NjI1IDUuMzEyNUMxMS45NDkyMTkgNy43MDMxMjUgMTEuNjMyODEzIDExLjI2NTYyNSAxMi43OTY4NzUgMTYuMTk1MzEzQzEyLjM4NjcxOSAxNi43MjY1NjMgMTIuMDExNzE5IDE3LjU3NDIxOSAxMi4xMDkzNzUgMTguNzM0Mzc1QzEyLjQwMjM0NCAyMC44OTg0MzggMTMuMjI2NTYzIDIxLjc4OTA2MyAxMy44OTg0MzggMjIuMTUyMzQ0QzE0LjIzNDM3NSAyMy45NTMxMjUgMTUuMjE4NzUgMjUuODYzMjgxIDE2LjEwMTU2MyAyNi43NjU2MjVDMTYuMTA1NDY5IDI2Ljk4ODI4MSAxNi4xMDkzNzUgMjcuMjAzMTI1IDE2LjExMzI4MSAyNy40MTc5NjlDMTYuMTMyODEzIDI4LjM3NSAxNi4xNDQ1MzEgMjkuMjAzMTI1IDE2LjAxOTUzMSAzMC4yNjU2MjVDMTUuNDcyNjU2IDMxLjY3MTg3NSAxMy40NDE0MDYgMzIuNDc2NTYzIDExLjA5Mzc1IDMzLjQwNjI1QzcuMTkxNDA2IDM0Ljk1MzEyNSAyLjMzNTkzOCAzNi44Nzg5MDYgMiA0Mi45NDkyMTlMMS45NDUzMTMgNDRMMjUuMzcxMDk0IDQ0QzI1LjE3OTY4OCA0My42MDU0NjkgMjUuMDE1NjI1IDQzLjE5NTMxMyAyNC44NTkzNzUgNDIuNzgxMjVDMjQuNTY2NDA2IDM5LjI1IDIyLjUgMzUuODAwNzgxIDIyLjUgMzUuODAwNzgxTDI0LjY2Nzk2OSAzMy45MDIzNDRDMjQuMzkwNjI1IDMzLjM0NzY1NiAyNC4wNTg1OTQgMzIuOTI1NzgxIDIzLjczMDQ2OSAzMi41ODIwMzFMMjUuNTg5ODQ0IDMxLjU1MDc4MUMyNS43MzgyODEgMzEuMjY1NjI1IDI1LjkwNjI1IDMwLjk5MjE4OCAyNi4wNzQyMTkgMzAuNzE4NzVDMjYuMjgxMjUgMzAuMzc4OTA2IDI2LjUwMzkwNiAzMC4wNTA3ODEgMjYuNzM0Mzc1IDI5LjczNDM3NUMyNi43ODkwNjMgMjkuNjY0MDYzIDI2LjgzNTkzOCAyOS41ODk4NDQgMjYuODkwNjI1IDI5LjUxOTUzMUMyNy4xNzk2ODggMjkuMTQwNjI1IDI3LjQ4ODI4MSAyOC43NzM0MzggMjcuODEyNSAyOC40MjU3ODFDMjcuODA0Njg4IDI3Ljg3ODkwNiAyNy44MDA3ODEgMjcuMzQzNzUgMjcuODAwNzgxIDI2Ljc1MzkwNkMyOC42Njc5NjkgMjUuODM5ODQ0IDI5LjU4OTg0NCAyMy45MjU3ODEgMjkuOTcyNjU2IDIyLjE5MTQwNkMzMC42OTE0MDYgMjEuODUxNTYzIDMxLjU4OTg0NCAyMC45Njg3NSAzMS43OTY4NzUgMTguNjgzNTk0QzMxLjg5MDYyNSAxNy41NTg1OTQgMzEuNTgyMDMxIDE2LjczMDQ2OSAzMS4xNTYyNSAxNi4xOTkyMTlDMzEuODE2NDA2IDE0LjEyODkwNiAzMi45Mzc1IDkuNTM1MTU2IDMxLjA5Mzc1IDYuNDg4MjgxQzMwLjI1MzkwNiA1LjEwMTU2MyAyOC45NDE0MDYgNC4yMzA0NjkgMjcuMTgzNTk0IDMuODgyODEzQzI2LjIxODc1IDIuNjY0MDYzIDI0LjM5ODQzOCAyIDIxLjk4MDQ2OSAyIFogTSAyMiA0QzIzLjg5MDYyNSA0IDI1LjI1MzkwNiA0LjQ3NjU2MyAyNS43MzQzNzUgNS4zMDQ2ODhMMjUuOTgwNDY5IDUuNzIyNjU2TDI2LjQ1NzAzMSA1Ljc4OTA2M0MyNy44MzU5MzggNS45ODQzNzUgMjguNzkyOTY5IDYuNTUwNzgxIDI5LjM3ODkwNiA3LjUyMzQzOEMzMC42NjQwNjMgOS42NDA2MjUgMzAuMDA3ODEzIDEzLjUgMjkuMDU4NTk0IDE2LjE2MDE1NkwyOC43NDIxODggMTYuOTg0Mzc1TDI5LjUzNTE1NiAxNy4zODI4MTNDMjkuNjI1IDE3LjQ0NTMxMyAyOS44NjMyODEgMTcuNzg5MDYzIDI5LjgwNDY4OCAxOC41MDc4MTNDMjkuNjY3OTY5IDE5Ljk4ODI4MSAyOS4xOTkyMTkgMjAuMzgyODEzIDI5LjA5NzY1NiAyMC40MDIzNDRMMjguMjM0Mzc1IDIwLjQwMjM0NEwyOC4xMDkzNzUgMjEuMjYxNzE5QzI3LjgzNTkzOCAyMy4xODM1OTQgMjYuNjgzNTk0IDI1LjE1NjI1IDI2LjMwNDY4OCAyNS40MzM1OTRMMjUuODAwNzgxIDI1LjcxODc1TDI1LjgwMDc4MSAyNi4zMDA3ODFDMjUuODAwNzgxIDI3LjMyMDMxMyAyNS44MTI1IDI4LjE5NTMxMyAyNS44NDM3NSAyOS4xMjEwOTRMMjIgMzEuMjUzOTA2TDE4LjEwNTQ2OSAyOS4wOTM3NUMxOC4xMjUgMjguNTAzOTA2IDE4LjEyMTA5NCAyNy45NDUzMTMgMTguMTA5Mzc1IDI3LjM3ODkwNkMxOC4xMDU0NjkgMjcuMDM1MTU2IDE4LjA5NzY1NiAyNi42Nzk2ODggMTguMDk3NjU2IDI2LjI5Njg3NUwxOC4wMzUxNTYgMjUuNzM0Mzc1TDE3LjYwOTM3NSAyNS40Mzc1QzE3LjIxNDg0NCAyNS4xNjc5NjkgMTUuOTcyNjU2IDIzLjE3MTg3NSAxNS43OTY4NzUgMjEuMzA0Njg4TDE1Ljc4MTI1IDIwLjQwNjI1TDE0Ljg3NSAyMC40MDYyNUMxNC43MzA0NjkgMjAuMzUxNTYzIDE0LjI4NTE1NiAxOS44Nzg5MDYgMTQuMDkzNzUgMTguNTE1NjI1QzE0LjAyNzM0NCAxNy42Nzk2ODggMTQuNDUzMTI1IDE3LjMzMjAzMSAxNC40NTMxMjUgMTcuMzMyMDMxTDE1LjA0Njg3NSAxNi45Mzc1TDE0Ljg3MTA5NCAxNi4yNTM5MDZDMTMuNzA3MDMxIDExLjY2Nzk2OSAxMy44NjcxODggOC40ODQzNzUgMTUuMzU5Mzc1IDYuNTIzNDM4QzE2LjU3ODEyNSA0LjkyMTg3NSAxOC44MjAzMTMgNC4wNzAzMTMgMjIgNCBaIE0gMzggMjZDMzEuMzkwNjI1IDI2IDI2IDMxLjM5NDUzMSAyNiAzOEMyNiA0NC42MDU0NjkgMzEuMzkwNjI1IDUwIDM4IDUwQzQ0LjYwOTM3NSA1MCA1MCA0NC42MDU0NjkgNTAgMzhDNTAgMzEuMzk0NTMxIDQ0LjYwOTM3NSAyNiAzOCAyNiBaIE0gMzggMjhDNDMuNTIzNDM4IDI4IDQ4IDMyLjQ3NjU2MyA0OCAzOEM0OCA0My41MjM0MzggNDMuNTIzNDM4IDQ4IDM4IDQ4QzMyLjQ3NjU2MyA0OCAyOCA0My41MjM0MzggMjggMzhDMjggMzIuNDc2NTYzIDMyLjQ3NjU2MyAyOCAzOCAyOCBaIE0gMTcuNzczNDM4IDMxLjE5NTMxM0wyMC4yNjk1MzEgMzIuNTgyMDMxTDE3Ljk4ODI4MSAzNS40MTc5NjlMMTYuMTIxMDk0IDMzLjE1MjM0NEMxNi44NDM3NSAzMi42MTcxODggMTcuNDE0MDYzIDMxLjk4NDM3NSAxNy43NzM0MzggMzEuMTk1MzEzIFogTSAzNyAzMkwzNyAzN0wzMiAzN0wzMiAzOUwzNyAzOUwzNyA0NEwzOSA0NEwzOSAzOUw0NCAzOUw0NCAzN0wzOSAzN0wzOSAzMiBaIE0gMTQuMzc1IDM0LjE3OTY4OEwxNy4yMzA0NjkgMzcuNjM2NzE5QzE3LjQxNzk2OSAzNy44NjcxODggMTcuNzA3MDMxIDM4LjAwMzkwNiAxOC4wMDc4MTMgMzhDMTguMzA4NTk0IDM4IDE4LjU4OTg0NCAzNy44NTkzNzUgMTguNzgxMjUgMzcuNjI1TDIwLjc0MjE4OCAzNS4xODc1TDIxLjUgMzUuODAwNzgxQzIxLjUgMzUuODAwNzgxIDE5Ljc0NjA5NCAzOC44MTI1IDE5LjI0MjE4OCA0Mkw0LjEyMTA5NCA0MkM0Ljg1NTQ2OSAzOC4wMjczNDQgOC4zOTg0MzggMzYuNjI1IDExLjgyODEyNSAzNS4yNjU2MjVDMTIuNzE0ODQ0IDM0LjkxNDA2MyAxMy41NzgxMjUgMzQuNTY2NDA2IDE0LjM3NSAzNC4xNzk2ODhaIi8+PC9zdmc+"
    }]);
    css("#openLinkInPrivateTab,#context-openlinkintab { display:none }");
};

new function () {
    var groupMenu = GroupMenu({
        id: 'addMenu-openLink-window',
        class: 'showFirstText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "打开链接..." : "Open Link...",
        condition: 'link',
        insertBefore: 'context-openlinkinusercontext-menu',
        onpopupshowing: syncHidden
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '新窗口打开' : 'Open in new window',
        oncommand: 'gContextMenu.openLink();',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNy4yNjQgOC43ODkgTCA4LjYzMSA4Ljc4OSBMIDguNjMxIDEwLjE1NiBMIDcuMjY0IDEwLjE1NiBMIDcuMjY0IDguNzg5IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDQuNzEzIDE1Ljk4NSBMIDQuNzEzIDE0LjEzNiBMIDQuNzEzIDEyLjI4NyBMIDQuNzEzIDEwLjQzOCBMIDQuNzEzIDguNTg5IEMgNC43MjEgOC40MjYgNC43NDUgOC4yNTggNC43ODMgOC4wOTIgQyA0LjgyMSA3LjkyNSA0Ljg3NCA3Ljc2IDQuOTM4IDcuNjAzIEMgNS4wMDMgNy40NDUgNS4wOCA3LjI5NSA1LjE2NyA3LjE1NyBDIDUuMjU0IDcuMDIgNS4zNTIgNi44OTUgNS40NTcgNi43OSBDIDUuNTYzIDYuNjg0IDUuNjg3IDYuNTg3IDUuODI0IDYuNSBDIDUuOTYxIDYuNDEzIDYuMTExIDYuMzM2IDYuMjY5IDYuMjcyIEMgNi40MjcgNi4yMDcgNi41OTIgNi4xNTQgNi43NTggNi4xMTYgQyA2LjkyNSA2LjA3NyA3LjA5MiA2LjA1MyA3LjI1NSA2LjA0NiBMIDkuNzk4IDYuMDQ2IEwgMTIuMzQgNi4wNDYgTCAxNC44ODMgNi4wNDYgTCAxNy40MjYgNi4wNDYgQyAxNy41ODkgNi4wNTMgMTcuNzU3IDYuMDc3IDE3LjkyMyA2LjExNiBDIDE4LjA4OSA2LjE1NCAxOC4yNTQgNi4yMDcgMTguNDExIDYuMjcyIEMgMTguNTY5IDYuMzM2IDE4LjcxOSA2LjQxMyAxOC44NTcgNi41IEMgMTguOTk0IDYuNTg3IDE5LjExOSA2LjY4NCAxOS4yMjQgNi43OSBDIDE5LjMzIDYuODk1IDE5LjQyNyA3LjAyIDE5LjUxNCA3LjE1NyBDIDE5LjYwMSA3LjI5NSAxOS42NzggNy40NDUgMTkuNzQzIDcuNjAzIEMgMTkuODA3IDcuNzYgMTkuODYgNy45MjUgMTkuODk4IDguMDkxIEMgMTkuOTM2IDguMjU4IDE5Ljk2IDguNDI1IDE5Ljk2OCA4LjU4OSBMIDE5Ljk2OCAxMC40MzggTCAxOS45NjggMTIuMjg3IEwgMTkuOTY4IDE0LjEzNiBMIDE5Ljk2OCAxNS45ODUgQyAxOS45NiAxNi4xNDggMTkuOTM2IDE2LjMxNiAxOS44OTggMTYuNDgyIEMgMTkuODYgMTYuNjQ4IDE5LjgwNyAxNi44MTMgMTkuNzQzIDE2Ljk3MSBDIDE5LjY3OCAxNy4xMjkgMTkuNjAxIDE3LjI3OSAxOS41MTQgMTcuNDE2IEMgMTkuNDI3IDE3LjU1NCAxOS4zMyAxNy42NzggMTkuMjI0IDE3Ljc4NCBDIDE5LjExOSAxNy44OSAxOC45OTQgMTcuOTg3IDE4Ljg1NyAxOC4wNzQgQyAxOC43MTkgMTguMTYxIDE4LjU2OSAxOC4yMzggMTguNDExIDE4LjMwMiBDIDE4LjI1NCAxOC4zNjcgMTguMDg5IDE4LjQyIDE3LjkyMyAxOC40NTggQyAxNy43NTYgMTguNDk2IDE3LjU4OSAxOC41MiAxNy40MjYgMTguNTI4IEwgMTQuODgzIDE4LjUyOCBMIDEyLjM0IDE4LjUyOCBMIDkuNzk3IDE4LjUyOCBMIDcuMjU1IDE4LjUyOCBDIDcuMDkxIDE4LjUyMSA2LjkyNCAxOC40OTcgNi43NTcgMTguNDU4IEMgNi41OTEgMTguNDIgNi40MjYgMTguMzY3IDYuMjY5IDE4LjMwMiBDIDYuMTExIDE4LjIzOCA1Ljk2MSAxOC4xNjEgNS44MjQgMTguMDc0IEMgNS42ODcgMTcuOTg3IDUuNTYyIDE3Ljg5IDUuNDU3IDE3Ljc4NCBDIDUuMzUxIDE3LjY3OCA1LjI1NCAxNy41NTQgNS4xNjcgMTcuNDE2IEMgNS4wNzkgMTcuMjc5IDUuMDAyIDE3LjEyOSA0LjkzOCAxNi45NzEgQyA0Ljg3MyAxNi44MTQgNC44MiAxNi42NDkgNC43ODIgMTYuNDgyIEMgNC43NDQgMTYuMzE2IDQuNzIgMTYuMTQ4IDQuNzEzIDE1Ljk4NSBaIE0gNi40MzggMTYuODAzIEMgNi41IDE2Ljg2NSA2LjU1OSAxNi45MTkgNi42MTggMTYuOTY1IEMgNi42NzggMTcuMDEgNi43MzcgMTcuMDQ4IDYuODAxIDE3LjA3NiBDIDYuODY1IDE3LjEwNSA2LjkzMiAxNy4xMjUgNy4wMDcgMTcuMTM2IEMgNy4wODEgMTcuMTQ3IDcuMTYzIDE3LjE0OSA3LjI1NSAxNy4xNDEgTCA5Ljc5OCAxNy4xNDEgTCAxMi4zNDEgMTcuMTQxIEwgMTQuODgzIDE3LjE0MSBMIDE3LjQyNiAxNy4xNDEgQyAxNy41MTggMTcuMTQ5IDE3LjYgMTcuMTQ3IDE3LjY3NCAxNy4xMzYgQyAxNy43NDkgMTcuMTI1IDE3LjgxNiAxNy4xMDUgMTcuODggMTcuMDc2IEMgMTcuOTQ0IDE3LjA0OCAxOC4wMDMgMTcuMDEgMTguMDYzIDE2Ljk2NSBDIDE4LjEyMiAxNi45MTkgMTguMTgxIDE2Ljg2NSAxOC4yNDMgMTYuODAzIEMgMTguMzA1IDE2Ljc0MSAxOC4zNTkgMTYuNjgyIDE4LjQwNSAxNi42MjMgQyAxOC40NSAxNi41NjMgMTguNDg3IDE2LjUwMyAxOC41MTYgMTYuNDM5IEMgMTguNTQ1IDE2LjM3NiAxOC41NjUgMTYuMzA4IDE4LjU3NiAxNi4yMzQgQyAxOC41ODcgMTYuMTU5IDE4LjU4OSAxNi4wNzggMTguNTgxIDE1Ljk4NSBMIDE4LjU4MSAxNC4xMzYgTCAxOC41ODEgMTIuMjg3IEwgMTguNTgxIDEwLjQzOCBMIDE4LjU4MSA4LjU4OSBDIDE4LjU4OSA4LjQ5NyAxOC41ODcgOC40MTUgMTguNTc2IDguMzQgQyAxOC41NjUgOC4yNjYgMTguNTQ1IDguMTk5IDE4LjUxNiA4LjEzNSBDIDE4LjQ4NyA4LjA3MSAxOC40NSA4LjAxMSAxOC40MDUgNy45NTIgQyAxOC4zNTkgNy44OTIgMTguMzA1IDcuODMzIDE4LjI0MyA3Ljc3MSBDIDE4LjE4MSA3LjcxIDE4LjEyMiA3LjY1NiAxOC4wNjMgNy42MSBDIDE4LjAwMyA3LjU2NSAxNy45NDQgNy41MjcgMTcuODggNy40OTggQyAxNy44MTYgNy40NyAxNy43NDkgNy40NSAxNy42NzQgNy40MzkgQyAxNy42IDcuNDI4IDE3LjUxOCA3LjQyNiAxNy40MjYgNy40MzMgTCAxNC44ODMgNy40MzMgTCAxMi4zNDEgNy40MzMgTCA5Ljc5OCA3LjQzMyBMIDcuMjU1IDcuNDMzIEMgNy4xNjMgNy40MjYgNy4wODEgNy40MjggNy4wMDcgNy40MzkgQyA2LjkzMiA3LjQ1IDYuODY0IDcuNDcgNi44MDEgNy40OTggQyA2LjczNyA3LjUyNyA2LjY3OCA3LjU2NSA2LjYxOCA3LjYxIEMgNi41NTkgNy42NTYgNi41IDcuNzEgNi40MzggNy43NzEgQyA2LjM3NiA3LjgzMyA2LjMyMiA3Ljg5MiA2LjI3NyA3Ljk1MiBDIDYuMjMxIDguMDExIDYuMTkzIDguMDcxIDYuMTY1IDguMTM1IEMgNi4xMzYgOC4xOTkgNi4xMTYgOC4yNjYgNi4xMDUgOC4zNCBDIDYuMDk0IDguNDE1IDYuMDkyIDguNDk3IDYuMSA4LjU4OSBMIDYuMSAxMC40MzggTCA2LjEgMTIuMjg3IEwgNi4xIDE0LjEzNiBMIDYuMSAxNS45ODUgQyA2LjA5MiAxNi4wNzggNi4wOTQgMTYuMTU5IDYuMTA1IDE2LjIzNCBDIDYuMTE2IDE2LjMwOCA2LjEzNiAxNi4zNzYgNi4xNjUgMTYuNDM5IEMgNi4xOTMgMTYuNTAzIDYuMjMxIDE2LjU2MyA2LjI3NyAxNi42MjMgQyA2LjMyMiAxNi42ODIgNi4zNzYgMTYuNzQxIDYuNDM4IDE2LjgwMyBaIiBzdHlsZT0iIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDxwYXRoIGQ9Ik0gNC45NDQgMTMuOTA1IEwgNC4zNjYgMTMuOTA1IEwgMy43ODggMTMuOTA1IEwgMy4yMSAxMy45MDUgTCAyLjYzMiAxMy45MDUgQyAyLjQ2OSAxMy44OTcgMi4zMDEgMTMuODc0IDIuMTM1IDEzLjgzNSBDIDEuOTY5IDEzLjc5NyAxLjgwNCAxMy43NDUgMS42NDcgMTMuNjggQyAxLjQ4OSAxMy42MTUgMS4zMzkgMTMuNTM4IDEuMjAxIDEzLjQ1MSBDIDEuMDY0IDEzLjM2NCAwLjkzOSAxMy4yNjcgMC44MzQgMTMuMTYxIEMgMC43MjggMTMuMDU1IDAuNjMxIDEyLjkzMSAwLjU0NCAxMi43OTMgQyAwLjQ1NiAxMi42NTYgMC4zNzkgMTIuNTA2IDAuMzE1IDEyLjM0OCBDIDAuMjUgMTIuMTkxIDAuMTk3IDEyLjAyNiAwLjE1OSAxMS44NiBDIDAuMTIxIDExLjY5NCAwLjA5NyAxMS41MjYgMC4wOSAxMS4zNjMgTCAwLjA5IDkuNTE0IEwgMC4wOSA3LjY2NCBMIDAuMDkgNS44MTUgTCAwLjA5IDMuOTY2IEMgMC4wOTcgMy44MDMgMC4xMjEgMy42MzUgMC4xNTkgMy40NjkgQyAwLjE5NyAzLjMwMiAwLjI1IDMuMTM4IDAuMzE1IDIuOTggQyAwLjM3OSAyLjgyMyAwLjQ1NiAyLjY3MiAwLjU0NCAyLjUzNSBDIDAuNjMxIDIuMzk4IDAuNzI4IDIuMjc0IDAuODM0IDIuMTY4IEMgMC45MzkgMi4wNjMgMS4wNjQgMS45NjUgMS4yMDEgMS44NzggQyAxLjMzOSAxLjc5MSAxLjQ4OSAxLjcxNCAxLjY0NyAxLjY0OSBDIDEuODA0IDEuNTg0IDEuOTY5IDEuNTMxIDIuMTM1IDEuNDkzIEMgMi4zMDEgMS40NTUgMi40NjkgMS40MzEgMi42MzIgMS40MjMgTCA1LjE3NCAxLjQyMyBMIDcuNzE3IDEuNDIzIEwgMTAuMjYgMS40MjMgTCAxMi44MDMgMS40MjMgQyAxMi45NjYgMS40MzEgMTMuMTMzIDEuNDU1IDEzLjMgMS40OTMgQyAxMy40NjYgMS41MzEgMTMuNjMgMS41ODQgMTMuNzg4IDEuNjQ5IEMgMTMuOTQ1IDEuNzE0IDE0LjA5NiAxLjc5MSAxNC4yMzMgMS44NzggQyAxNC4zNzEgMS45NjUgMTQuNDk1IDIuMDYzIDE0LjYwMSAyLjE2OCBDIDE0LjcwNiAyLjI3NCAxNC44MDQgMi4zOTggMTQuODkxIDIuNTM1IEMgMTQuOTc4IDIuNjcyIDE1LjA1NSAyLjgyMyAxNS4xMiAyLjk4IEMgMTUuMTg1IDMuMTM4IDE1LjIzNyAzLjMwMyAxNS4yNzYgMy40NjkgQyAxNS4zMTQgMy42MzUgMTUuMzM3IDMuODAzIDE1LjM0NSAzLjk2NiBMIDE1LjM0NSA0LjY2IEwgMTUuMzQ1IDUuMzUzIEwgMTUuMzQ1IDYuMDQ3IEwgMTUuMzQ1IDYuNzQgTCAxNC45OTggNi43NCBMIDE0LjY1MSA2Ljc0IEwgMTQuMzA0IDYuNzQgTCAxMy45NTggNi43NCBMIDEzLjk1OCA2LjA0NyBMIDEzLjk1OCA1LjM1MyBMIDEzLjk1OCA0LjY2IEwgMTMuOTU4IDMuOTY2IEMgMTMuOTY1IDMuODc0IDEzLjk2NCAzLjc5MiAxMy45NTMgMy43MTggQyAxMy45NDIgMy42NDMgMTMuOTIyIDMuNTc2IDEzLjg5MyAzLjUxMiBDIDEzLjg2NCAzLjQ0OSAxMy44MjcgMy4zODkgMTMuNzgxIDMuMzI5IEMgMTMuNzM1IDMuMjcgMTMuNjgxIDMuMjExIDEzLjYyIDMuMTQ5IEMgMTMuNTU4IDMuMDg4IDEzLjQ5OSAzLjAzNCAxMy40NCAyLjk4OCBDIDEzLjM4IDIuOTQyIDEzLjMyIDIuOTA1IDEzLjI1NyAyLjg3NiBDIDEzLjE5NCAyLjg0NyAxMy4xMjYgMi44MjcgMTMuMDUxIDIuODE2IEMgMTIuOTc3IDIuODA1IDEyLjg5NSAyLjgwMyAxMi44MDMgMi44MSBMIDEwLjI2MSAyLjgxIEwgNy43MTggMi44MSBMIDUuMTc1IDIuODEgTCAyLjYzMiAyLjgxIEMgMi41NCAyLjgwMyAyLjQ1OCAyLjgwNSAyLjM4NCAyLjgxNiBDIDIuMzA5IDIuODI3IDIuMjQyIDIuODQ3IDIuMTc4IDIuODc2IEMgMi4xMTUgMi45MDUgMi4wNTUgMi45NDIgMS45OTUgMi45ODcgQyAxLjkzNiAzLjAzMyAxLjg3NyAzLjA4NyAxLjgxNSAzLjE0OSBDIDEuNzU0IDMuMjExIDEuNyAzLjI2OSAxLjY1NCAzLjMyOSBDIDEuNjA4IDMuMzg4IDEuNTcxIDMuNDQ4IDEuNTQyIDMuNTEyIEMgMS41MTMgMy41NzYgMS40OTMgMy42NDMgMS40ODIgMy43MTcgQyAxLjQ3MSAzLjc5MiAxLjQ3IDMuODc0IDEuNDc3IDMuOTY2IEwgMS40NzcgNS44MTUgTCAxLjQ3NyA3LjY2NCBMIDEuNDc3IDkuNTE0IEwgMS40NzcgMTEuMzYzIEMgMS40NyAxMS40NTUgMS40NzEgMTEuNTM3IDEuNDgyIDExLjYxMSBDIDEuNDkzIDExLjY4NiAxLjUxMyAxMS43NTMgMS41NDIgMTEuODE3IEMgMS41NzEgMTEuODgxIDEuNjA4IDExLjk0IDEuNjU0IDEyIEMgMS43IDEyLjA1OSAxLjc1NCAxMi4xMTggMS44MTUgMTIuMTggQyAxLjg3NyAxMi4yNDIgMS45MzYgMTIuMjk2IDEuOTk1IDEyLjM0MiBDIDIuMDU1IDEyLjM4NyAyLjExNSAxMi40MjQgMi4xNzggMTIuNDUzIEMgMi4yNDIgMTIuNDgyIDIuMzA5IDEyLjUwMiAyLjM4NCAxMi41MTMgQyAyLjQ1OCAxMi41MjQgMi41NCAxMi41MjYgMi42MzIgMTIuNTE4IEwgMy4yMSAxMi41MTggTCAzLjc4OCAxMi41MTggTCA0LjM2NiAxMi41MTggTCA0Ljk0NCAxMi41MTggTCA0Ljk0NCAxMi44NjUgTCA0Ljk0NCAxMy4yMTIgTCA0Ljk0NCAxMy41NTggWiIgc3R5bGU9IiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8cGF0aCBkPSJNIDkuMDk3IDguNzg5IEwgMTAuNDY0IDguNzg5IEwgMTAuNDY0IDEwLjE1NiBMIDkuMDk3IDEwLjE1NiBMIDkuMDk3IDguNzg5IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDEwLjk4IDguNzg5IEwgMTIuMzQ3IDguNzg5IEwgMTIuMzQ3IDEwLjE1NiBMIDEwLjk4IDEwLjE1NiBMIDEwLjk4IDguNzg5IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDIuNjAxIDMuODA0IEwgMy45NjggMy44MDQgTCAzLjk2OCA1LjE3MSBMIDIuNjAxIDUuMTcxIEwgMi42MDEgMy44MDQgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gNC40MzQgMy44MDQgTCA1LjgwMSAzLjgwNCBMIDUuODAxIDUuMTcxIEwgNC40MzQgNS4xNzEgTCA0LjQzNCAzLjgwNCBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSA2LjMxNyAzLjgwNCBMIDcuNjg0IDMuODA0IEwgNy42ODQgNS4xNzEgTCA2LjMxNyA1LjE3MSBMIDYuMzE3IDMuODA0IFoiIHN0eWxlPSIiLz4KPC9zdmc+"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '在隐私窗口中打开' : 'Open in private window',
        oncommand: 'gContextMenu.openLinkInPrivateWindow();',
        image: "chrome://browser/skin/privateBrowsing.svg"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "其他浏览器中打开" : "Open in other browser",
        text: "%l",
        tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? "左键打开，右键设置浏览器路径" : "Left click: open in other browser\nRight click: set browser path",
        oncommand: function (event) {
            let browser;
            try {
                browser = Services.prefs.getComplexValue("userChromeJS.addMenuPlus.chooseBrowser", Ci.nsIFile);
            } catch (e) { }

            function chooseBrowser() {
                alert(Services.locale.appLocaleAsBCP47.includes("zh-") ? "请先设置浏览器的路径!!!" : "Please set browser path first!!!");
                let fp = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
                fp.init(window, Services.locale.appLocaleAsBCP47.includes("zh-") ? "设置浏览器路径" : "Set browser path", Ci.nsIFilePicker.modeOpen);
                fp.appendFilter(Services.locale.appLocaleAsBCP47.includes("zh-") ? "执行文件" : "Executable file", "*.exe");
                fp.open(res => {
                    if (res != Ci.nsIFilePicker.returnOK) return;
                    Services.prefs.setCharPref("userChromeJS.addMenuPlus.chooseBrowser", fp.file.path);
                });
            }

            if (event.button == 0) {
                let href = gBrowser.selectedBrowser.currentURI.spec;
                if (href) {
                    if (!browser) {
                        chooseBrowser();
                        browser = Services.prefs.getComplexValue("userChromeJS.addMenuPlus.chooseBrowser", Ci.nsIFile);
                    }
                    let extraBrowser = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
                    try {
                        extraBrowser.initWithPath(browser.path);
                    } catch (E) {
                        alert(Services.locale.appLocaleAsBCP47.includes("zh-") ? "浏览器不存在，请右键点击菜单重新设置浏览器。" : "Browser not exists, please right click to reset browser.");
                        return;
                    }
                    let p = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
                    let commandArgs = [href];
                    p.init(extraBrowser);
                    p.run(false, commandArgs, commandArgs.length);
                }
            } else if (event.button == 2) {
                chooseBrowser();
            }
        },
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTI0LjM3NSAyQzE4LjY5NTMxMyAyIDE0LjQxMDE1NiAzLjk4MDQ2OSAxMS4zMTI1IDYuMzQzNzVDMy40NTMxMjUgMTIuMzM1OTM4IDIuNjg3NSAyMi40Njg3NSAyLjY4NzUgMjIuNDY4NzVDMi42NDQ1MzEgMjIuOTI5Njg4IDIuOTIxODc1IDIzLjM2MzI4MSAzLjM2MzI4MSAyMy41MTE3MTlDMy44MDA3ODEgMjMuNjYwMTU2IDQuMjg1MTU2IDIzLjQ4ODI4MSA0LjUzMTI1IDIzLjA5Mzc1QzQuNTMxMjUgMjMuMDkzNzUgNy40MTc5NjkgMTguNjI1IDEyLjQzNzUgMTUuNUMxNC4xMzY3MTkgMTQuNDQxNDA2IDE2LjMwNDY4OCAxMy42Njc5NjkgMTguNSAxMy4xMjVDMTcuNjMyODEzIDEzLjUxMTcxOSAxNC42MzY3MTkgMTQuOTYwOTM4IDExLjgxMjUgMTguMjVDOS4yNjE3MTkgMjEuMjE4NzUgNy44MTI1IDI1LjI2MTcxOSA3LjgxMjUgMjkuNUM3LjgxMjUgMzAuNTY2NDA2IDcuNzkyOTY5IDMyLjYxMzI4MSA4LjQwNjI1IDM0Ljc4MTI1QzguOTc2NTYzIDM2LjgwMDc4MSAxMC4wNzgxMjUgMzguNzYxNzE5IDExLjA5Mzc1IDQwLjI1QzE0LjAzNTE1NiA0NC41NTQ2ODggMTguMzU5Mzc1IDQ2LjM1NTQ2OSAyMC40Mzc1IDQ3LjAzMTI1QzIyLjgzMjAzMSA0Ny44MDg1OTQgMjUuMjkyOTY5IDQ4IDI3LjU2MjUgNDhDMzUuNjkxNDA2IDQ4IDQxLjEyNSA0NC42NTYyNSA0MS4xMjUgNDQuNjU2MjVDNDEuNDI1NzgxIDQ0LjQ2ODc1IDQxLjYwMTU2MyA0NC4xMzY3MTkgNDEuNTkzNzUgNDMuNzgxMjVMNDEuNTkzNzUgMzQuNTMxMjVDNDEuNjAxNTYzIDM0LjE1NjI1IDQxLjM5ODQzOCAzMy44MTI1IDQxLjA3MDMxMyAzMy42MzI4MTNDNDAuNzQyMTg4IDMzLjQ1NzAzMSA0MC4zMzk4NDQgMzMuNDc2NTYzIDQwLjAzMTI1IDMzLjY4NzVDNDAuMDMxMjUgMzMuNjg3NSAzNy44OTg0MzggMzUuMTQwNjI1IDM1Ljg0Mzc1IDM1Ljc1QzM0LjI5Njg3NSAzNi4yMTA5MzggMzMuMDM1MTU2IDM2LjgxMjUgMjguNzE4NzUgMzYuODEyNUMyMi42MDkzNzUgMzYuODEyNSAyMC4wMjczNDQgMzQuNjk1MzEzIDE4Ljc4MTI1IDMyLjY1NjI1QzE3Ljk4ODI4MSAzMS4zNTU0NjkgMTcuNzgxMjUgMzAuMjkyOTY5IDE3LjcxODc1IDI5LjUzMTI1TDQ0LjMxMjUgMjkuNTMxMjVDNDQuODYzMjgxIDI5LjUzMTI1IDQ1LjMxMjUgMjkuMDgyMDMxIDQ1LjMxMjUgMjguNTMxMjVMNDUuMzEyNSAyMy45Mzc1QzQ1LjMxMjUgMjMuOTI1NzgxIDQ1LjMxMjUgMjMuOTE3OTY5IDQ1LjMxMjUgMjMuOTA2MjVDNDUuMzEyNSAyMy45MDYyNSA0NS4yMjI2NTYgMjAuMzM5ODQ0IDQ0LjQ2ODc1IDE3LjI1QzQ0LjA2NjQwNiAxNS42MDE1NjMgNDMuNDQ5MjE5IDEzLjkxMDE1NiA0Mi42MjUgMTIuNTMxMjVDNDAuODUxNTYzIDkuNTU0Njg4IDM5LjEwMTU2MyA3LjMyODEyNSAzNS4xMjUgNC44NzVDMzEuMDE1NjI1IDIuMzM5ODQ0IDI2LjUzOTA2MyAyIDI0LjM3NSAyIFogTSAyNC4zNzUgNEMyNi4zMDQ2ODggNCAzMC40NDE0MDYgNC4zNTkzNzUgMzQuMDYyNSA2LjU5Mzc1QzM3LjgyMDMxMyA4LjkxMDE1NiAzOS4xOTUzMTMgMTAuNjk1MzEzIDQwLjkwNjI1IDEzLjU2MjVDNDEuNTg1OTM4IDE0LjcwNzAzMSA0Mi4xNjc5NjkgMTYuMjM4MjgxIDQyLjUzMTI1IDE3LjcxODc1QzQzLjIwNzAzMSAyMC40ODgyODEgNDMuMzEyNSAyMy45Mzc1IDQzLjMxMjUgMjMuOTM3NUw0My4zMTI1IDI3LjUzMTI1TDE2LjY4NzUgMjcuNTMxMjVDMTYuMTYwMTU2IDI3LjUzMTI1IDE1LjcxODc1IDI3Ljk0MTQwNiAxNS42ODc1IDI4LjQ2ODc1QzE1LjY4NzUgMjguNDY4NzUgMTUuNDY4NzUgMzEuMDgyMDMxIDE3LjA2MjUgMzMuNjg3NUMxOC42NTYyNSAzNi4yOTI5NjkgMjIuMTIxMDk0IDM4LjgxMjUgMjguNzE4NzUgMzguODEyNUMzMy4yNDIxODggMzguODEyNSAzNS4wNDY4NzUgMzguMDU4NTk0IDM2LjQwNjI1IDM3LjY1NjI1QzM3LjYwNTQ2OSAzNy4zMDA3ODEgMzguNzI2NTYzIDM2Ljc1MzkwNiAzOS41OTM3NSAzNi4yODEyNUwzOS41OTM3NSA0My4xNTYyNUMzOC45Mzc1IDQzLjUzOTA2MyAzNC41OTc2NTYgNDYgMjcuNTYyNSA0NkMyNS40MDYyNSA0NiAyMy4xNjc5NjkgNDUuODA4NTk0IDIxLjA2MjUgNDUuMTI1QzE5LjIxMDkzOCA0NC41MjM0MzggMTUuMzE2NDA2IDQyLjg4MjgxMyAxMi43NSAzOS4xMjVDMTEuODIwMzEzIDM3Ljc2MTcxOSAxMC43ODkwNjMgMzUuOTM3NSAxMC4zMTI1IDM0LjI1QzkuNzkyOTY5IDMyLjQxMDE1NiA5LjgxMjUgMzAuNTc4MTI1IDkuODEyNSAyOS41QzkuODEyNSAyNS43MTg3NSAxMS4xMDkzNzUgMjIuMDk3NjU2IDEzLjMxMjUgMTkuNTMxMjVDMTQuMzkwNjI1IDE4LjI3MzQzOCAxNS41MjczNDQgMTcuMzUxNTYzIDE2LjU5Mzc1IDE2LjU5Mzc1QzE2LjU3ODEyNSAxNi42MjUgMTYuNTc4MTI1IDE2LjYyMTA5NCAxNi41NjI1IDE2LjY1NjI1QzE1LjcxNDg0NCAxOC42NTYyNSAxNS41IDIwLjYyNSAxNS41IDIwLjYyNUMxNS40NzI2NTYgMjAuOTA2MjUgMTUuNTY2NDA2IDIxLjE4MzU5NCAxNS43NTc4MTMgMjEuMzk0NTMxQzE1Ljk0OTIxOSAyMS42MDE1NjMgMTYuMjE4NzUgMjEuNzE4NzUgMTYuNSAyMS43MTg3NUwzMi4wOTM3NSAyMS43MTg3NUMzMi42MDE1NjMgMjEuNzIyNjU2IDMzLjAzMTI1IDIxLjM0NzY1NiAzMy4wOTM3NSAyMC44NDM3NUMzMy4wOTM3NSAyMC44NDM3NSAzMy4zNTU0NjkgMTguMjg5MDYzIDMyLjI1IDE1LjY4NzVDMzEuMTQ0NTMxIDEzLjA4NTkzOCAyOC40NDE0MDYgMTAuNDA2MjUgMjMuMjUgMTAuNDA2MjVDMTkuMzQ3NjU2IDEwLjQwNjI1IDE0LjczODI4MSAxMS43MTg3NSAxMS4zNzUgMTMuODEyNUM4LjkyMTg3NSAxNS4zMzk4NDQgNy4wMjM0MzggMTcuMTI1IDUuNTkzNzUgMTguNjU2MjVDNi41MTk1MzEgMTUuNDY4NzUgOC4zODI4MTMgMTEuMDk3NjU2IDEyLjUzMTI1IDcuOTM3NUMxNS4zNTkzNzUgNS43ODEyNSAxOS4xNTYyNSA0IDI0LjM3NSA0IFogTSAyMy4yNSAxMi40MDYyNUMyNy44MDA3ODEgMTIuNDA2MjUgMjkuNTMxMjUgMTQuNDEwMTU2IDMwLjQwNjI1IDE2LjQ2ODc1QzMwLjk4MDQ2OSAxNy44MTY0MDYgMzEuMDgyMDMxIDE4LjkzMzU5NCAzMS4wOTM3NSAxOS43MTg3NUwxNy43ODEyNSAxOS43MTg3NUMxNy44OTQ1MzEgMTkuMDgyMDMxIDE3LjkyOTY4OCAxOC41NjI1IDE4LjQwNjI1IDE3LjQzNzVDMTkuMTA5Mzc1IDE1Ljc3NzM0NCAyMC4yODEyNSAxNC4zNzUgMjAuMjgxMjUgMTQuMzc1QzIwLjQ3NjU2MyAxNC4xNjAxNTYgMjAuNTY2NDA2IDEzLjg3MTA5NCAyMC41MzEyNSAxMy41ODIwMzFDMjAuNDkyMTg4IDEzLjI5Mjk2OSAyMC4zMzU5MzggMTMuMDM1MTU2IDIwLjA5Mzc1IDEyLjg3NUMyMS4xNzE4NzUgMTIuNjg3NSAyMi4yNzM0MzggMTIuNDA2MjUgMjMuMjUgMTIuNDA2MjVaIiAvPg0KPC9zdmc+",
        accesskey: 'e'
    }])
    css("#context-openlink,#context-openlinkprivate { display: none }");
};
//复制链接地址
new function () {
    var groupMenu = GroupMenu({
        id: 'addMenu-copy-link',
        class: 'showFirstText',
        insertAfter: 'context-copylink',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '复制链接...' : 'Copy Link...',
        condition: 'link',
        onpopupshowing: syncHidden
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '复制链接' : 'Copy Link',
        oncommand: "Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(decodeURIComponent(gContextMenu.linkURL));;",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjYgMjYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTQgMEMxLjc5Njg3NSAwIDAgMS43OTY4NzUgMCA0TDAgMThDMCAyMC4yMDMxMjUgMS43OTY4NzUgMjIgNCAyMkw3IDIyTDcgMjBMNCAyMEMyLjg5NDUzMSAyMCAyIDE5LjEwNTQ2OSAyIDE4TDIgNEMyIDIuODk0NTMxIDIuODk0NTMxIDIgNCAyTDEwLjI4MTI1IDJDMTAuNDMzNTk0IDIuMDM5MDYzIDEwLjU2MjUgMi4xMjEwOTQgMTAuNjU2MjUgMi4yMTg3NUMxMS4wODk4NDQgMi4wOTc2NTYgMTEuNTMxMjUgMiAxMiAyTDEzLjA2MjUgMkMxMS43NzM0MzggMC43MTg3NSAxMC45MDIzNDQgMCAxMCAwIFogTSAxMiAzQzkuNzk2ODc1IDMgOCA0Ljc5Njg3NSA4IDdMOCAyMkM4IDI0LjIwMzEyNSA5Ljc5Njg3NSAyNiAxMiAyNkwyMiAyNkMyNC4yMDMxMjUgMjYgMjYgMjQuMjAzMTI1IDI2IDIyTDI2IDExQzI2IDkuOTM3NSAyNS4wMjczNDQgOC45Mjk2ODggMjMuMjgxMjUgNy4yMTg3NUMyMy4wMzkwNjMgNi45ODA0NjkgMjIuNzc3MzQ0IDYuNzE0ODQ0IDIyLjUzMTI1IDYuNDY4NzVDMjIuMjg1MTU2IDYuMjIyNjU2IDIyLjAxOTUzMSA1Ljk5MjE4OCAyMS43ODEyNSA1Ljc1QzIwLjA3MDMxMyA0LjAwMzkwNiAxOS4wNjI1IDMgMTggMyBaIE0gMTIgNUwxOC4yODEyNSA1QzE5LjAwMzkwNiA1LjE4MzU5NCAxOSA2LjA1MDc4MSAxOSA2LjkzNzVMMTkgOUMxOSA5LjU1MDc4MSAxOS40NDkyMTkgMTAgMjAgMTBMMjIgMTBDMjIuOTk2MDk0IDEwIDI0IDEwLjAwMzkwNiAyNCAxMUwyNCAyMkMyNCAyMy4xMDU0NjkgMjMuMTA1NDY5IDI0IDIyIDI0TDEyIDI0QzEwLjg5NDUzMSAyNCAxMCAyMy4xMDU0NjkgMTAgMjJMMTAgN0MxMCA1Ljg5NDUzMSAxMC44OTQ1MzEgNSAxMiA1IFogTSAxOS41MzEyNSAxMi4wOTM3NUMxOC45MDYyNSAxMi4xMjUgMTguMzA4NTk0IDEyLjM3ODkwNiAxNy44NDM3NSAxMi44NDM3NUwxNi41OTM3NSAxNC4xMjVDMTYuODc4OTA2IDEzLjgzNTkzOCAxNy45Mjk2ODggMTQuMDIzNDM4IDE4LjE4NzUgMTQuMjgxMjVMMTguNzE4NzUgMTMuNzE4NzVDMTguOTY0ODQ0IDEzLjQ3NjU2MyAxOS4yODEyNSAxMy4zMjgxMjUgMTkuNTkzNzUgMTMuMzEyNUMxOS44MDQ2ODggMTMuMzAwNzgxIDIwLjEwOTM3NSAxMy4zNTkzNzUgMjAuMzc1IDEzLjYyNUMyMC42MjEwOTQgMTMuODc1IDIwLjY4NzUgMTQuMTQ4NDM4IDIwLjY4NzUgMTQuMzQzNzVDMjAuNjg3NSAxNC42NzE4NzUgMjAuNTM5MDYzIDE1LjAyMzQzOCAyMC4yODEyNSAxNS4yODEyNUwxNy45Njg3NSAxNy41NjI1QzE3LjQ4ODI4MSAxOC4wNDI5NjkgMTYuNzM4MjgxIDE4LjExMzI4MSAxNi4zMTI1IDE3LjY4NzVDMTYuMDcwMzEzIDE3LjQ0NTMxMyAxNS42Nzk2ODggMTcuNDQ1MzEzIDE1LjQzNzUgMTcuNjg3NUMxNS4xOTUzMTMgMTcuOTI5Njg4IDE1LjE5NTMxMyAxOC4zMjAzMTMgMTUuNDM3NSAxOC41NjI1QzE1Ljg3NSAxOSAxNi40Njg3NSAxOS4yMTg3NSAxNy4wNjI1IDE5LjIxODc1QzE3LjcwMzEyNSAxOS4yMTg3NSAxOC4zMzk4NDQgMTguOTcyNjU2IDE4Ljg0Mzc1IDE4LjQ2ODc1TDIxLjE1NjI1IDE2LjE1NjI1QzIxLjY0NDUzMSAxNS42Njc5NjkgMjEuOTM3NSAxNSAyMS45Mzc1IDE0LjM0Mzc1QzIxLjkzNzUgMTMuNzM4MjgxIDIxLjY3OTY4OCAxMy4xNzk2ODggMjEuMjUgMTIuNzVDMjAuNzkyOTY5IDEyLjI5Mjk2OSAyMC4xNzk2ODggMTIuMDY2NDA2IDE5LjUzMTI1IDEyLjA5Mzc1IFogTSAxNi43ODEyNSAxNC45Mzc1QzE2LjE0MDYyNSAxNC45Mzc1IDE1LjUgMTUuMjE0ODQ0IDE1IDE1LjcxODc1TDEyLjg0Mzc1IDE3Ljg0Mzc1QzEyLjM1NTQ2OSAxOC4zMzIwMzEgMTIuMDYyNSAxOSAxMi4wNjI1IDE5LjY1NjI1QzEyLjA2MjUgMjAuMjY1NjI1IDEyLjMyMDMxMyAyMC44MjAzMTMgMTIuNzUgMjEuMjVDMTMuMjEwOTM4IDIxLjcwNzAzMSAxMy44MTY0MDYgMjEuOTM3NSAxNC40Njg3NSAyMS45MDYyNUMxNS4wODk4NDQgMjEuODc1IDE1LjY5MTQwNiAyMS42MjEwOTQgMTYuMTU2MjUgMjEuMTU2MjVMMTcuMjUgMjAuMDMxMjVDMTYuOTY0ODQ0IDIwLjMyMDMxMyAxNS45MTQwNjMgMjAuMTMyODEzIDE1LjY1NjI1IDE5Ljg3NUwxNS4yODEyNSAyMC4yODEyNUMxNS4wMzUxNTYgMjAuNTIzNDM4IDE0LjcxODc1IDIwLjY3MTg3NSAxNC40MDYyNSAyMC42ODc1QzE0LjE5NTMxMyAyMC42OTkyMTkgMTMuODkwNjI1IDIwLjY0MDYyNSAxMy42MjUgMjAuMzc1QzEzLjM3ODkwNiAyMC4xMjg5MDYgMTMuMzEyNSAxOS44NTE1NjMgMTMuMzEyNSAxOS42NTYyNUMxMy4zMTI1IDE5LjMyODEyNSAxMy40NjA5MzggMTguOTc2NTYzIDEzLjcxODc1IDE4LjcxODc1TDE1Ljg3NSAxNi41OTM3NUMxNi4zNTkzNzUgMTYuMTEzMjgxIDE3LjA3NDIxOSAxNi4wNDY4NzUgMTcuNSAxNi40Njg3NUMxNy43NDIxODggMTYuNzEwOTM4IDE4LjE2NDA2MyAxNi43MTA5MzggMTguNDA2MjUgMTYuNDY4NzVDMTguNjQ4NDM4IDE2LjIyNjU2MyAxOC42NDg0MzggMTUuODM1OTM4IDE4LjQwNjI1IDE1LjU5Mzc1QzE3Ljk2ODc1IDE1LjE1NjI1IDE3LjM3NSAxNC45Mzc1IDE2Ljc4MTI1IDE0LjkzNzVaIiAvPg0KPC9zdmc+",
        accesskey: "L"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '链接另存为' : 'Save link as',
        oncommand: "gContextMenu.saveLink();",
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMS40MDQgMy45NDggQyAxLjQwNCAzLjIxMiAxLjcwMiAyLjU0NSAyLjE4NSAyLjA2MyBDIDIuNjY3IDEuNTggMy4zMzQgMS4yODIgNC4wNyAxLjI4MiBMIDguODk5IDEuMjgyIEwgMTMuNzI4IDEuMjgyIEMgMTQuMTQ2IDEuMjgyIDE0LjU1NSAxLjM2NSAxNC45MzQgMS41MjIgQyAxNS4zMTMgMS42NzggMTUuNjYxIDEuOTA5IDE1Ljk1NyAyLjIwNSBMIDE2Ljk0MyAzLjE5MSBMIDE3LjkyOSA0LjE3NyBDIDE4LjIyNSA0LjQ3MyAxOC40NTYgNC44MjEgMTguNjEzIDUuMiBDIDE4Ljc2OSA1LjU3OSAxOC44NTIgNS45ODggMTguODUyIDYuNDA2IEwgMTguODUyIDExLjIzNSBMIDE4Ljg1MiAxNi4wNjQgQyAxOC44NTIgMTYuODAxIDE4LjU1NCAxNy40NjcgMTguMDcxIDE3Ljk0OSBDIDE3LjU4OSAxOC40MzIgMTYuOTIyIDE4LjczIDE2LjE4NiAxOC43MyBMIDEwLjEyOCAxOC43MyBMIDQuMDcgMTguNzMgQyAzLjMzNCAxOC43MyAyLjY2NyAxOC40MzIgMi4xODUgMTcuOTQ5IEMgMS43MDIgMTcuNDY3IDEuNDA0IDE2LjggMS40MDQgMTYuMDY0IEwgMS40MDQgMTAuMDA2IFogTSA0LjA3IDIuNzM2IEMgMy43MzYgMi43MzYgMy40MzMgMi44NzIgMy4yMTMgMy4wOTEgQyAyLjk5NCAzLjMxMSAyLjg1OCAzLjYxNCAyLjg1OCAzLjk0OCBMIDIuODU4IDEwLjAwNiBMIDIuODU4IDE2LjA2NCBDIDIuODU4IDE2LjM5OSAyLjk5NCAxNi43MDIgMy4yMTMgMTYuOTIxIEMgMy40MzMgMTcuMTQgMy43MzYgMTcuMjc2IDQuMDcgMTcuMjc2IEwgNC4xOTEgMTcuMjc2IEwgNC4zMTIgMTcuMjc2IEwgNC4zMTIgMTQuNzMyIEwgNC4zMTIgMTIuMTg3IEMgNC4zMTIgMTEuNTg1IDQuNTU2IDExLjAzOSA0Ljk1MSAxMC42NDUgQyA1LjM0NSAxMC4yNSA1Ljg5MSAxMC4wMDYgNi40OTMgMTAuMDA2IEwgMTAuMTI4IDEwLjAwNiBMIDEzLjc2MyAxMC4wMDYgQyAxNC4zNjYgMTAuMDA2IDE0LjkxMSAxMC4yNSAxNS4zMDUgMTAuNjQ1IEMgMTUuNyAxMS4wMzkgMTUuOTQ0IDExLjU4NSAxNS45NDQgMTIuMTg3IEwgMTUuOTQ0IDE0LjczMiBMIDE1Ljk0NCAxNy4yNzYgTCAxNi4wNjUgMTcuMjc2IEwgMTYuMTg2IDE3LjI3NiBDIDE2LjUyMSAxNy4yNzYgMTYuODI0IDE3LjE0IDE3LjA0MyAxNi45MjEgQyAxNy4yNjIgMTYuNzAyIDE3LjM5OCAxNi4zOTkgMTcuMzk4IDE2LjA2NCBMIDE3LjM5OCAxMS4yMzUgTCAxNy4zOTggNi40MDYgQyAxNy4zOTggNi4xODEgMTcuMzU0IDUuOTYgMTcuMjY5IDUuNzU2IEMgMTcuMTg1IDUuNTUyIDE3LjA2MSA1LjM2NSAxNi45MDEgNS4yMDYgTCAxNS45MTUgNC4yMiBMIDE0LjkyOCAzLjIzMyBDIDE0LjgwMyAzLjEwOCAxNC42NiAzLjAwMyAxNC41MDQgMi45MjMgQyAxNC4zNDggMi44NDMgMTQuMTggMi43ODcgMTQuMDA1IDIuNzU4IEwgMTQuMDA1IDQuMDggTCAxNC4wMDUgNS40MDIgQyAxNC4wMDUgNi4wMDQgMTMuNzYxIDYuNTQ5IDEzLjM2NiA2Ljk0NCBDIDEyLjk3MiA3LjMzOSAxMi40MjcgNy41ODMgMTEuODI0IDcuNTgzIEwgOS42NDMgNy41ODMgTCA3LjQ2MiA3LjU4MyBDIDYuODYgNy41ODMgNi4zMTQgNy4zMzkgNS45MiA2Ljk0NCBDIDUuNTI1IDYuNTQ5IDUuMjgxIDYuMDA0IDUuMjgxIDUuNDAyIEwgNS4yODEgNC4wNjkgTCA1LjI4MSAyLjczNiBMIDQuNjc2IDIuNzM2IFogTSAxNC40OSAxNy4yNzYgTCAxNC40OSAxNC43MzIgTCAxNC40OSAxMi4xODcgQyAxNC40OSAxMS45ODcgMTQuNDA5IDExLjgwNSAxNC4yNzcgMTEuNjczIEMgMTQuMTQ1IDExLjU0MiAxMy45NjQgMTEuNDYgMTMuNzYzIDExLjQ2IEwgMTAuMTI4IDExLjQ2IEwgNi40OTMgMTEuNDYgQyA2LjI5MyAxMS40NiA2LjExMSAxMS41NDIgNS45NzkgMTEuNjczIEMgNS44NDggMTEuODA1IDUuNzY2IDExLjk4NyA1Ljc2NiAxMi4xODcgTCA1Ljc2NiAxNC43MzIgTCA1Ljc2NiAxNy4yNzYgTCAxMC4xMjggMTcuMjc2IFogTSA2LjczNSAyLjczNiBMIDYuNzM1IDQuMDY5IEwgNi43MzUgNS40MDIgQyA2LjczNSA1LjYwMyA2LjgxNyA1Ljc4NCA2Ljk0OCA1LjkxNiBDIDcuMDggNi4wNDcgNy4yNjIgNi4xMjkgNy40NjIgNi4xMjkgTCA5LjY0MyA2LjEyOSBMIDExLjgyNCA2LjEyOSBDIDEyLjAyNSA2LjEyOSAxMi4yMDcgNi4wNDcgMTIuMzM4IDUuOTE2IEMgMTIuNDcgNS43ODQgMTIuNTUxIDUuNjAzIDEyLjU1MSA1LjQwMiBMIDEyLjU1MSA0LjA2OSBMIDEyLjU1MSAyLjczNiBMIDkuNjQzIDIuNzM2IFoiIHN0eWxlPSIiLz4KPC9zdmc+",
        accesskey: "K"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '收藏链接' : 'Bookmark link',
        oncommand: "gContextMenu.bookmarkLink();",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNOC44MDgwMiAyLjEwMTc5QzguNDc3ODkgMS40MzI4NyA3LjUyNDAzIDEuNDMyODcgNy4xOTM5IDIuMTAxNzlMNS42NzI4MSA1LjE4Mzg0TDIuMjcxNTYgNS42NzgwN0MxLjUzMzM2IDUuNzg1MzQgMS4yMzg2MSA2LjY5MjUxIDEuNzcyNzcgNy4yMTMyTDQuMjMzOTQgOS42MTIyNEwzLjY1Mjk0IDEyLjk5OTdDMy41MjY4NCAxMy43MzUgNC4yOTg1MyAxNC4yOTU2IDQuOTU4NzkgMTMuOTQ4NUw4LjAwMDk2IDEyLjM0OTFMOC40ODI5IDEyLjYwMjVDOC4xODU5NyAxMi4zMjg0IDggMTEuOTM1OSA4IDExLjVDOCAxMS40NDQ2IDguMDAzIDExLjM5IDguMDA4ODQgMTEuMzM2MkM3Ljg2MjM2IDExLjMzNDkgNy43MTU2NCAxMS4zNjk0IDcuNTgyMTUgMTEuNDM5NUw0LjY3MjggMTIuOTY5MUw1LjIyODQzIDkuNzI5NDdDNS4yNzg1MSA5LjQzNzUxIDUuMTgxNzEgOS4xMzk2MSA0Ljk2OTYgOC45MzI4NUwyLjYxNTg4IDYuNjM4NTRMNS44Njg2NCA2LjE2NTg5QzYuMTYxNzggNi4xMjMyOSA2LjQxNTE5IDUuOTM5MTggNi41NDYyOCA1LjY3MzU1TDguMDAwOTYgMi43MjYwNUw4LjczMzUxIDQuMjEwMzZDOC45NTc4MiA0LjA3Njc1IDkuMjE5OTUgNCA5LjUgNEg5Ljc0NDg1TDguODA4MDIgMi4xMDE3OVpNOS41IDVDOS4yMjM4NiA1IDkgNS4yMjM4NiA5IDUuNUM5IDUuNzc2MTQgOS4yMjM4NiA2IDkuNSA2SDE0LjVDMTQuNzc2MSA2IDE1IDUuNzc2MTQgMTUgNS41QzE1IDUuMjIzODYgMTQuNzc2MSA1IDE0LjUgNUg5LjVaTTkuNSA4QzkuMjIzODYgOCA5IDguMjIzODYgOSA4LjVDOSA4Ljc3NjE0IDkuMjIzODYgOSA5LjUgOUgxNC41QzE0Ljc3NjEgOSAxNSA4Ljc3NjE0IDE1IDguNUMxNSA4LjIyMzg2IDE0Ljc3NjEgOCAxNC41IDhIOS41Wk05LjUgMTFDOS4yMjM4NiAxMSA5IDExLjIyMzkgOSAxMS41QzkgMTEuNzc2MSA5LjIyMzg2IDEyIDkuNSAxMkgxNC41QzE0Ljc3NjEgMTIgMTUgMTEuNzc2MSAxNSAxMS41QzE1IDExLjIyMzkgMTQuNzc2MSAxMSAxNC41IDExSDkuNVoiLz4KPC9zdmc+Cg==",
        accesskey: 'B'
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "复制链接HTML" : "Copy link as html",
        text: '<a href="%l" target="_blank">%LINK_TEXT%</a>',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTcuMTM2IDUuMTY3IEMgMTcuMjE5IDUuMTY3IDE3LjMgNS4xNzYgMTcuMzc4IDUuMTkyIEMgMTcuNDU2IDUuMjA4IDE3LjUzMSA1LjIzMSAxNy42MDMgNS4yNjEgQyAxNy42NzUgNS4yOTEgMTcuNzQzIDUuMzI4IDE3LjgwNyA1LjM3MSBDIDE3Ljg3IDUuNDE0IDE3LjkzIDUuNDYzIDE3Ljk4NCA1LjUxOCBDIDE4LjAzOSA1LjU3MiAxOC4wODggNS42MzIgMTguMTMgNS42OTYgQyAxOC4xNzMgNS43NTkgMTguMjEgNS44MjcgMTguMjQxIDUuODk5IEMgMTguMjcxIDUuOTcxIDE4LjI5NSA2LjA0NiAxOC4zMTEgNi4xMjQgQyAxOC4zMjcgNi4yMDIgMTguMzM1IDYuMjgzIDE4LjMzNSA2LjM2NiBMIDE4LjMzNSA3LjU2NiBMIDE4LjMzNSA4Ljc2NiBMIDE4LjMzNSA5Ljk2NSBMIDE4LjMzNSAxMS4xNjUgTCAxOC4zMzUgMTIuMzY1IEwgMTguMzM1IDEzLjU2NCBMIDE4LjMzNSAxNC43NjQgTCAxOC4zMzUgMTUuOTYzIEMgMTguMzM1IDE2LjA0NiAxOC4zMjcgMTYuMTI3IDE4LjMxMSAxNi4yMDUgQyAxOC4yOTUgMTYuMjg0IDE4LjI3MSAxNi4zNTkgMTguMjQxIDE2LjQzMSBDIDE4LjIxIDE2LjUwMyAxOC4xNzMgMTYuNTcxIDE4LjEzIDE2LjYzNCBDIDE4LjA4OCAxNi42OTggMTguMDM5IDE2Ljc1OCAxNy45ODQgMTYuODEyIEMgMTcuOTMgMTYuODY3IDE3Ljg3MSAxNi45MTYgMTcuODA3IDE2Ljk1OSBDIDE3Ljc0MyAxNy4wMDIgMTcuNjc1IDE3LjAzOSAxNy42MDMgMTcuMDY5IEMgMTcuNTMxIDE3LjEgMTcuNDU2IDE3LjEyMyAxNy4zNzggMTcuMTM5IEMgMTcuMyAxNy4xNTUgMTcuMjE5IDE3LjE2MyAxNy4xMzYgMTcuMTYzIEwgMTUuMzM3IDE3LjE2MyBMIDEzLjUzOCAxNy4xNjMgTCAxMS43MzkgMTcuMTYzIEwgOS45MzkgMTcuMTYzIEwgOC4xNCAxNy4xNjMgTCA2LjM0IDE3LjE2MyBMIDQuNTQxIDE3LjE2MyBMIDIuNzQxIDE3LjE2MyBDIDIuNjU4IDE3LjE2MyAyLjU3NyAxNy4xNTUgMi40OTkgMTcuMTM5IEMgMi40MjEgMTcuMTIzIDIuMzQ1IDE3LjEgMi4yNzMgMTcuMDY5IEMgMi4yMDIgMTcuMDM5IDIuMTMzIDE3LjAwMiAyLjA2OSAxNi45NTkgQyAyLjAwNiAxNi45MTYgMS45NDYgMTYuODY3IDEuODkyIDE2LjgxMiBDIDEuODM4IDE2Ljc1OCAxLjc4OSAxNi42OTkgMS43NDYgMTYuNjM1IEMgMS43MDMgMTYuNTcxIDEuNjY1IDE2LjUwMyAxLjYzNSAxNi40MzEgQyAxLjYwNSAxNi4zNTkgMS41ODEgMTYuMjg0IDEuNTY1IDE2LjIwNSBDIDEuNTQ5IDE2LjEyNyAxLjU0MSAxNi4wNDYgMS41NDEgMTUuOTYzIEwgMS41NDEgMTQuNzYzIEwgMS41NDEgMTMuNTY0IEwgMS41NDEgMTIuMzY0IEwgMS41NDEgMTEuMTY1IEwgMS41NDEgOS45NjUgTCAxLjU0MSA4Ljc2NiBMIDEuNTQxIDcuNTY2IEwgMS41NDEgNi4zNjYgQyAxLjU0MSA2LjI4MyAxLjU0OSA2LjIwMyAxLjU2NSA2LjEyNSBDIDEuNTgxIDYuMDQ3IDEuNjA1IDUuOTcxIDEuNjM1IDUuODk5IEMgMS42NjUgNS44MjggMS43MDIgNS43NTkgMS43NDUgNS42OTUgQyAxLjc4OCA1LjYzMiAxLjgzNyA1LjU3MiAxLjg5MiA1LjUxOCBDIDEuOTQ2IDUuNDY0IDIuMDA1IDUuNDE1IDIuMDY5IDUuMzcyIEMgMi4xMzMgNS4zMjkgMi4yMDIgNS4yOTIgMi4yNzQgNS4yNjEgQyAyLjM0NSA1LjIzMSAyLjQyMSA1LjIwOCAyLjQ5OSA1LjE5MiBDIDIuNTc3IDUuMTc2IDIuNjU4IDUuMTY3IDIuNzQxIDUuMTY3IEwgNC41NCA1LjE2NyBMIDYuMzQgNS4xNjcgTCA4LjEzOSA1LjE2NyBMIDkuOTM5IDUuMTY3IEwgMTEuNzM4IDUuMTY3IEwgMTMuNTM4IDUuMTY3IEwgMTUuMzM3IDUuMTY3IFogTSAyLjc0MSAzLjk2NyBDIDIuNTc2IDMuOTY3IDIuNDE0IDMuOTg0IDIuMjU4IDQuMDE2IEMgMi4xMDIgNC4wNDggMS45NTIgNC4wOTUgMS44MDggNC4xNTYgQyAxLjY2NSA0LjIxNyAxLjUyOCA0LjI5MSAxLjQgNC4zNzcgQyAxLjI3MyA0LjQ2MyAxLjE1NCA0LjU2MiAxLjA0NSA0LjY3IEMgMC45MzcgNC43NzkgMC44MzggNC44OTggMC43NTIgNS4wMjUgQyAwLjY2NiA1LjE1MyAwLjU5MiA1LjI4OSAwLjUzMSA1LjQzMyBDIDAuNDcgNS41NzcgMC40MjMgNS43MjcgMC4zOTEgNS44ODMgQyAwLjM1OSA2LjAzOSAwLjM0MiA2LjIwMSAwLjM0MiA2LjM2NiBMIDAuMzQyIDcuNTY2IEwgMC4zNDIgOC43NjUgTCAwLjM0MiA5Ljk2NSBMIDAuMzQyIDExLjE2NCBMIDAuMzQyIDEyLjM2NCBMIDAuMzQyIDEzLjU2NCBMIDAuMzQyIDE0Ljc2NCBMIDAuMzQyIDE1Ljk2MyBDIDAuMzQyIDE2LjEyOSAwLjM1OSAxNi4yOSAwLjM5MSAxNi40NDcgQyAwLjQyMyAxNi42MDMgMC40NyAxNi43NTQgMC41MzEgMTYuODk3IEMgMC41OTIgMTcuMDQxIDAuNjY2IDE3LjE3NyAwLjc1MiAxNy4zMDQgQyAwLjgzOCAxNy40MzIgMC45MzcgMTcuNTUxIDEuMDQ1IDE3LjY1OSBDIDEuMTU0IDE3Ljc2OCAxLjI3MyAxNy44NjYgMS40IDE3Ljk1MiBDIDEuNTI4IDE4LjAzOCAxLjY2NSAxOC4xMTMgMS44MDggMTguMTczIEMgMS45NTIgMTguMjM0IDIuMTAyIDE4LjI4MSAyLjI1OCAxOC4zMTMgQyAyLjQxNCAxOC4zNDUgMi41NzYgMTguMzYyIDIuNzQxIDE4LjM2MiBMIDQuNTQxIDE4LjM2MiBMIDYuMzQgMTguMzYyIEwgOC4xNCAxOC4zNjIgTCA5LjkzOSAxOC4zNjIgTCAxMS43MzkgMTguMzYyIEwgMTMuNTM4IDE4LjM2MiBMIDE1LjMzNyAxOC4zNjIgTCAxNy4xMzYgMTguMzYyIEMgMTcuMzAyIDE4LjM2MiAxNy40NjMgMTguMzQ1IDE3LjYyIDE4LjMxMyBDIDE3Ljc3NiAxOC4yODEgMTcuOTI2IDE4LjIzNCAxOC4wNyAxOC4xNzMgQyAxOC4yMTQgMTguMTEzIDE4LjM1IDE4LjAzOCAxOC40NzcgMTcuOTUyIEMgMTguNjA1IDE3Ljg2NiAxOC43MjQgMTcuNzY4IDE4LjgzMiAxNy42NTkgQyAxOC45NDEgMTcuNTUxIDE5LjAzOSAxNy40MzIgMTkuMTI2IDE3LjMwNCBDIDE5LjIxMiAxNy4xNzcgMTkuMjg2IDE3LjA0MSAxOS4zNDcgMTYuODk3IEMgMTkuNDA4IDE2Ljc1NCAxOS40NTUgMTYuNjAzIDE5LjQ4NiAxNi40NDcgQyAxOS41MTggMTYuMjkgMTkuNTM1IDE2LjEyOCAxOS41MzUgMTUuOTYzIEwgMTkuNTM1IDE0Ljc2NCBMIDE5LjUzNSAxMy41NjQgTCAxOS41MzUgMTIuMzY0IEwgMTkuNTM1IDExLjE2NCBMIDE5LjUzNSA5Ljk2NSBMIDE5LjUzNSA4Ljc2NSBMIDE5LjUzNSA3LjU2NiBMIDE5LjUzNSA2LjM2NiBDIDE5LjUzNSA2LjIwMSAxOS41MTggNi4wMzkgMTkuNDg2IDUuODgyIEMgMTkuNDU1IDUuNzI2IDE5LjQwOCA1LjU3NSAxOS4zNDcgNS40MzIgQyAxOS4yODYgNS4yODggMTkuMjEyIDUuMTUyIDE5LjEyNiA1LjAyNSBDIDE5LjAzOSA0Ljg5NyAxOC45NDEgNC43NzggMTguODMyIDQuNjcgQyAxOC43MjQgNC41NjEgMTguNjA1IDQuNDYzIDE4LjQ3NyA0LjM3NyBDIDE4LjM1IDQuMjkxIDE4LjIxNCA0LjIxNiAxOC4wNyA0LjE1NiBDIDE3LjkyNyA0LjA5NSAxNy43NzYgNC4wNDggMTcuNjIgNC4wMTYgQyAxNy40NjMgMy45ODQgMTcuMzAxIDMuOTY3IDE3LjEzNiAzLjk2NyBMIDE1LjMzNyAzLjk2NyBMIDEzLjUzOCAzLjk2NyBMIDExLjczOSAzLjk2NyBMIDkuOTM5IDMuOTY3IEwgOC4xNCAzLjk2NyBMIDYuMzQgMy45NjcgTCA0LjU0MSAzLjk2NyBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSA5LjA3OSA4LjQ4OCBMIDguNzIxIDguODQ2IEwgOC4zNjIgOS4yMDUgTCA4LjAwMyA5LjU2NCBMIDcuNjQ0IDkuOTIzIEwgNy4yODYgMTAuMjgxIEwgNi45MjcgMTAuNjQgTCA2LjU2OCAxMC45OTkgTCA2LjIwOSAxMS4zNTggTCA2LjU2OCAxMS43MTYgTCA2LjkyNyAxMi4wNzUgTCA3LjI4NiAxMi40MzMgTCA3LjY0NCAxMi43OTIgTCA4LjAwMyAxMy4xNSBMIDguMzYyIDEzLjUwOSBMIDguNzIxIDEzLjg2NyBMIDkuMDc5IDE0LjIyNiBMIDguOTg2IDE0LjQxMyBMIDguODkyIDE0LjYgTCA4Ljc5OCAxNC43ODcgTCA4LjcwNCAxNC45NzUgTCA4LjYxMSAxNS4xNjIgTCA4LjUxNyAxNS4zNDkgTCA4LjQyMyAxNS41MzYgTCA4LjMyOSAxNS43MjMgTCA3Ljc4NCAxNS4xNzcgTCA3LjIzOCAxNC42MzIgTCA2LjY5MiAxNC4wODYgTCA2LjE0NiAxMy41NDEgTCA1LjYwMSAxMi45OTUgTCA1LjA1NSAxMi40NSBMIDQuNTA5IDExLjkwNCBMIDMuOTYzIDExLjM1OCBMIDQuNTA5IDEwLjgxMiBMIDUuMDU1IDEwLjI2NyBMIDUuNjAxIDkuNzIxIEwgNi4xNDYgOS4xNzUgTCA2LjY5MiA4LjYyOSBMIDcuMjM4IDguMDgzIEwgNy43ODQgNy41MzcgTCA4LjMyOSA2Ljk5MSBMIDguNDIzIDcuMTc4IEwgOC41MTcgNy4zNjYgTCA4LjYxMSA3LjU1MyBMIDguNzA0IDcuNzQgTCA4Ljc5OCA3LjkyNyBMIDguODkyIDguMTE0IEwgOC45ODYgOC4zMDEgWiBNIDEwLjU3NSAxNC4yMjYgTCAxMC45MzMgMTMuODY4IEwgMTEuMjkyIDEzLjUwOSBMIDExLjY1MSAxMy4xNTEgTCAxMi4wMSAxMi43OTIgTCAxMi4zNjggMTIuNDM0IEwgMTIuNzI3IDEyLjA3NSBMIDEzLjA4NSAxMS43MTcgTCAxMy40NDQgMTEuMzU4IEwgMTMuMDg1IDExIEwgMTIuNzI3IDEwLjY0MSBMIDEyLjM2OCAxMC4yODIgTCAxMi4wMSA5LjkyMyBMIDExLjY1MSA5LjU2NSBMIDExLjI5MiA5LjIwNiBMIDEwLjkzMyA4Ljg0NyBMIDEwLjU3NSA4LjQ4OCBMIDEwLjY2OSA4LjMwMSBMIDEwLjc2MiA4LjExNCBMIDEwLjg1NiA3LjkyNyBMIDEwLjk0OSA3Ljc0IEwgMTEuMDQzIDcuNTUzIEwgMTEuMTM2IDcuMzY2IEwgMTEuMjMgNy4xNzkgTCAxMS4zMjQgNi45OTEgTCAxMS44NyA3LjUzNyBMIDEyLjQxNSA4LjA4MyBMIDEyLjk2MSA4LjYyOSBMIDEzLjUwNyA5LjE3NSBMIDE0LjA1MyA5LjcyMSBMIDE0LjU5OCAxMC4yNjcgTCAxNS4xNDQgMTAuODEzIEwgMTUuNjkgMTEuMzU4IEwgMTUuMTQ0IDExLjkwNCBMIDE0LjU5OCAxMi40NSBMIDE0LjA1MyAxMi45OTYgTCAxMy41MDcgMTMuNTQxIEwgMTIuOTYxIDE0LjA4NyBMIDEyLjQxNSAxNC42MzIgTCAxMS44NyAxNS4xNzggTCAxMS4zMjQgMTUuNzIzIEwgMTEuMjMgMTUuNTM2IEwgMTEuMTM2IDE1LjM0OSBMIDExLjA0MyAxNS4xNjIgTCAxMC45NDkgMTQuOTc1IEwgMTAuODU2IDE0Ljc4OCBMIDEwLjc2MiAxNC42IEwgMTAuNjY5IDE0LjQxMyBaIiBzdHlsZT0iIi8+Cjwvc3ZnPg==",
        accesskey: "H"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '复制链接 MARKDOWN' : 'Copy link as markdown type',
        text: '[%RLT_OR_UT%](%RLINK_OR_URL%)',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTcuMTM4IDQuMzI3IEMgMTcuMjIxIDQuMzI3IDE3LjMwMiA0LjMzNiAxNy4zOCA0LjM1MiBDIDE3LjQ1OCA0LjM2OCAxNy41MzMgNC4zOTEgMTcuNjA1IDQuNDIxIEMgMTcuNjc3IDQuNDUxIDE3Ljc0NSA0LjQ4OSAxNy44MDkgNC41MzIgQyAxNy44NzMgNC41NzUgMTcuOTMyIDQuNjI0IDE3Ljk4NiA0LjY3OCBDIDE4LjA0MSA0LjczMyAxOC4wOSA0Ljc5MiAxOC4xMzMgNC44NTYgQyAxOC4xNzYgNC45MiAxOC4yMTMgNC45ODkgMTguMjQzIDUuMDYgQyAxOC4yNzQgNS4xMzIgMTguMjk3IDUuMjA3IDE4LjMxMyA1LjI4NSBDIDE4LjMyOSA1LjM2MyAxOC4zMzcgNS40NDQgMTguMzM3IDUuNTI3IEwgMTguMzM3IDYuNzI3IEwgMTguMzM3IDcuOTI2IEwgMTguMzM3IDkuMTI2IEwgMTguMzM3IDEwLjMyNSBMIDE4LjMzNyAxMS41MjUgTCAxOC4zMzcgMTIuNzI0IEwgMTguMzM3IDEzLjkyNCBMIDE4LjMzNyAxNS4xMjMgQyAxOC4zMzcgMTUuMjA2IDE4LjMyOSAxNS4yODcgMTguMzEzIDE1LjM2NSBDIDE4LjI5NyAxNS40NDQgMTguMjc0IDE1LjUxOSAxOC4yNDMgMTUuNTkxIEMgMTguMjEzIDE1LjY2MyAxOC4xNzYgMTUuNzMxIDE4LjEzMyAxNS43OTUgQyAxOC4wOSAxNS44NTkgMTguMDQxIDE1LjkxOCAxNy45ODYgMTUuOTcyIEMgMTcuOTMyIDE2LjAyNyAxNy44NzMgMTYuMDc2IDE3LjgwOSAxNi4xMTkgQyAxNy43NDUgMTYuMTYyIDE3LjY3NyAxNi4xOTkgMTcuNjA1IDE2LjIyOSBDIDE3LjUzMyAxNi4yNiAxNy40NTggMTYuMjgzIDE3LjM4IDE2LjI5OSBDIDE3LjMwMiAxNi4zMTUgMTcuMjIxIDE2LjMyMyAxNy4xMzggMTYuMzIzIEwgMTUuMzM5IDE2LjMyMyBMIDEzLjU0IDE2LjMyMyBMIDExLjc0MSAxNi4zMjMgTCA5Ljk0MSAxNi4zMjMgTCA4LjE0MiAxNi4zMjMgTCA2LjM0MiAxNi4zMjMgTCA0LjU0MyAxNi4zMjMgTCAyLjc0MyAxNi4zMjMgQyAyLjY2MSAxNi4zMjMgMi41OCAxNi4zMTUgMi41MDIgMTYuMjk5IEMgMi40MjQgMTYuMjgzIDIuMzQ4IDE2LjI2IDIuMjc2IDE2LjIyOSBDIDIuMjA1IDE2LjE5OSAyLjEzNyAxNi4xNjIgMi4wNzMgMTYuMTE5IEMgMi4wMDkgMTYuMDc2IDEuOTUgMTYuMDI3IDEuODk1IDE1Ljk3MiBDIDEuODQxIDE1LjkxOCAxLjc5MiAxNS44NTkgMS43NDkgMTUuNzk1IEMgMS43MDYgMTUuNzMxIDEuNjY4IDE1LjY2MyAxLjYzOCAxNS41OTEgQyAxLjYwOCAxNS41MTkgMS41ODQgMTUuNDQ0IDEuNTY4IDE1LjM2NSBDIDEuNTUyIDE1LjI4NyAxLjU0NCAxNS4yMDYgMS41NDQgMTUuMTIzIEwgMS41NDQgMTMuOTI0IEwgMS41NDQgMTIuNzI0IEwgMS41NDQgMTEuNTI1IEwgMS41NDQgMTAuMzI1IEwgMS41NDQgOS4xMjYgTCAxLjU0NCA3LjkyNiBMIDEuNTQ0IDYuNzI3IEwgMS41NDQgNS41MjcgQyAxLjU0NCA1LjQ0NCAxLjU1MiA1LjM2MyAxLjU2OCA1LjI4NSBDIDEuNTg0IDUuMjA3IDEuNjA4IDUuMTMyIDEuNjM4IDUuMDYgQyAxLjY2OCA0Ljk4OCAxLjcwNiA0LjkyIDEuNzQ5IDQuODU2IEMgMS43OTIgNC43OTIgMS44NDEgNC43MzMgMS44OTUgNC42NzggQyAxLjk1IDQuNjI0IDIuMDA5IDQuNTc1IDIuMDczIDQuNTMyIEMgMi4xMzcgNC40ODkgMi4yMDUgNC40NTIgMi4yNzYgNC40MjEgQyAyLjM0OCA0LjM5MSAyLjQyNCA0LjM2OCAyLjUwMiA0LjM1MiBDIDIuNTggNC4zMzYgMi42NjEgNC4zMjcgMi43NDMgNC4zMjcgTCA0LjU0MyA0LjMyNyBMIDYuMzQyIDQuMzI3IEwgOC4xNDIgNC4zMjcgTCA5Ljk0MSA0LjMyNyBMIDExLjc0MSA0LjMyNyBMIDEzLjU0IDQuMzI3IEwgMTUuMzM5IDQuMzI3IFogTSAyLjc0MyAzLjEyOCBDIDIuNTc3IDMuMTI4IDIuNDE2IDMuMTQ1IDIuMjYgMy4xNzcgQyAyLjEwNCAzLjIwOSAxLjk1NCAzLjI1NiAxLjgxIDMuMzE3IEMgMS42NjcgMy4zNzggMS41MyAzLjQ1MiAxLjQwMiAzLjUzOCBDIDEuMjc1IDMuNjI0IDEuMTU2IDMuNzIzIDEuMDQ3IDMuODMxIEMgMC45MzggMy45NCAwLjg0IDQuMDU5IDAuNzU0IDQuMTg2IEMgMC42NjggNC4zMTQgMC41OTMgNC40NTEgMC41MzMgNC41OTQgQyAwLjQ3MiA0LjczOCAwLjQyNSA0Ljg4OCAwLjM5MyA1LjA0NCBDIDAuMzYxIDUuMiAwLjM0NCA1LjM2MiAwLjM0NCA1LjUyNyBMIDAuMzQ0IDYuNzI3IEwgMC4zNDQgNy45MjYgTCAwLjM0NCA5LjEyNiBMIDAuMzQ0IDEwLjMyNSBMIDAuMzQ0IDExLjUyNSBMIDAuMzQ0IDEyLjcyNCBMIDAuMzQ0IDEzLjkyNCBMIDAuMzQ0IDE1LjEyMyBDIDAuMzQ0IDE1LjI4OSAwLjM2MSAxNS40NSAwLjM5MyAxNS42MDcgQyAwLjQyNSAxNS43NjMgMC40NzIgMTUuOTE0IDAuNTMzIDE2LjA1NyBDIDAuNTkzIDE2LjIgMC42NjggMTYuMzM2IDAuNzU0IDE2LjQ2NCBDIDAuODQgMTYuNTkyIDAuOTM4IDE2LjcxMSAxLjA0NyAxNi44MTkgQyAxLjE1NiAxNi45MjggMS4yNzUgMTcuMDI2IDEuNDAyIDE3LjExMyBDIDEuNTMgMTcuMTk5IDEuNjY2IDE3LjI3MyAxLjgxIDE3LjMzNCBDIDEuOTUzIDE3LjM5NSAyLjEwNCAxNy40NDIgMi4yNiAxNy40NzMgQyAyLjQxNiAxNy41MDUgMi41NzcgMTcuNTIyIDIuNzQzIDE3LjUyMiBMIDQuNTQyIDE3LjUyMiBMIDYuMzQyIDE3LjUyMiBMIDguMTQxIDE3LjUyMiBMIDkuOTQxIDE3LjUyMiBMIDExLjc0IDE3LjUyMiBMIDEzLjU0IDE3LjUyMiBMIDE1LjMzOSAxNy41MjIgTCAxNy4xMzggMTcuNTIyIEMgMTcuMzA0IDE3LjUyMiAxNy40NjYgMTcuNTA1IDE3LjYyMiAxNy40NzMgQyAxNy43NzggMTcuNDQyIDE3LjkyOCAxNy4zOTUgMTguMDcyIDE3LjMzNCBDIDE4LjIxNSAxNy4yNzMgMTguMzUyIDE3LjE5OSAxOC40NzkgMTcuMTEzIEMgMTguNjA3IDE3LjAyNiAxOC43MjUgMTYuOTI4IDE4LjgzNCAxNi44MTkgQyAxOC45NDIgMTYuNzExIDE5LjA0MSAxNi41OTIgMTkuMTI3IDE2LjQ2NCBDIDE5LjIxMyAxNi4zMzYgMTkuMjg3IDE2LjIgMTkuMzQ4IDE2LjA1NyBDIDE5LjQwOSAxNS45MTMgMTkuNDU2IDE1Ljc2MiAxOS40ODggMTUuNjA2IEMgMTkuNTIgMTUuNDUgMTkuNTM3IDE1LjI4OSAxOS41MzcgMTUuMTIzIEwgMTkuNTM3IDEzLjkyNCBMIDE5LjUzNyAxMi43MjQgTCAxOS41MzcgMTEuNTI1IEwgMTkuNTM3IDEwLjMyNSBMIDE5LjUzNyA5LjEyNiBMIDE5LjUzNyA3LjkyNiBMIDE5LjUzNyA2LjcyNyBMIDE5LjUzNyA1LjUyNyBDIDE5LjUzNyA1LjM2MiAxOS41MiA1LjIgMTkuNDg4IDUuMDQ0IEMgMTkuNDU2IDQuODg4IDE5LjQwOSA0LjczNyAxOS4zNDggNC41OTMgQyAxOS4yODcgNC40NSAxOS4yMTMgNC4zMTMgMTkuMTI3IDQuMTg2IEMgMTkuMDQxIDQuMDU4IDE4Ljk0MiAzLjk0IDE4LjgzNCAzLjgzMSBDIDE4LjcyNSAzLjcyMiAxOC42MDcgMy42MjQgMTguNDc5IDMuNTM4IEMgMTguMzUyIDMuNDUxIDE4LjIxNSAzLjM3NyAxOC4wNzIgMy4zMTYgQyAxNy45MjggMy4yNTYgMTcuNzc4IDMuMjA5IDE3LjYyMSAzLjE3NyBDIDE3LjQ2NSAzLjE0NSAxNy4zMDMgMy4xMjggMTcuMTM4IDMuMTI4IEwgMTUuMzM4IDMuMTI4IEwgMTMuNTM5IDMuMTI4IEwgMTEuNzM5IDMuMTI4IEwgOS45NCAzLjEyOCBMIDguMTQxIDMuMTI4IEwgNi4zNDIgMy4xMjggTCA0LjU0MiAzLjEyOCBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNIDExLjMxNSAxMC41IEMgMTEuMzQ1IDEwLjQ3MSAxMS4zNzYgMTAuNDQ2IDExLjQxIDEwLjQyNCBDIDExLjQ0MyAxMC40MDIgMTEuNDc4IDEwLjM4MyAxMS41MTQgMTAuMzY4IEMgMTEuNTUgMTAuMzU0IDExLjU4NyAxMC4zNDMgMTEuNjI1IDEwLjMzNSBDIDExLjY2MyAxMC4zMjggMTEuNzAyIDEwLjMyNCAxMS43NCAxMC4zMjQgQyAxMS43NzkgMTAuMzI0IDExLjgxNyAxMC4zMjggMTEuODU1IDEwLjMzNSBDIDExLjg5MyAxMC4zNDMgMTEuOTMgMTAuMzU0IDExLjk2NiAxMC4zNjggQyAxMi4wMDIgMTAuMzgzIDEyLjAzNyAxMC40MDIgMTIuMDcxIDEwLjQyNCBDIDEyLjEwNCAxMC40NDYgMTIuMTM1IDEwLjQ3MSAxMi4xNjUgMTAuNSBMIDEyLjQxMSAxMC43NDcgTCAxMi42NTggMTAuOTk0IEwgMTIuOTA1IDExLjI0MSBMIDEzLjE1MiAxMS40ODggTCAxMy4zOTggMTEuNzM1IEwgMTMuNjQ1IDExLjk4MiBMIDEzLjg5MiAxMi4yMjkgTCAxNC4xMzkgMTIuNDc2IEwgMTQuMzg1IDEyLjIyOSBMIDE0LjYzMiAxMS45ODIgTCAxNC44NzkgMTEuNzM1IEwgMTUuMTI2IDExLjQ4OCBMIDE1LjM3MiAxMS4yNDEgTCAxNS42MTkgMTAuOTk0IEwgMTUuODY2IDEwLjc0NyBMIDE2LjExMyAxMC41IEMgMTYuMTUzIDEwLjQ2IDE2LjE5OCAxMC40MjYgMTYuMjQ1IDEwLjQgQyAxNi4yOTIgMTAuMzc0IDE2LjM0MSAxMC4zNTUgMTYuMzkxIDEwLjM0MiBDIDE2LjQ0MSAxMC4zMyAxNi40OTIgMTAuMzI0IDE2LjU0MyAxMC4zMjQgQyAxNi41OTQgMTAuMzI1IDE2LjY0NSAxMC4zMzIgMTYuNjk0IDEwLjM0NSBDIDE2Ljc0MiAxMC4zNTggMTYuNzkgMTAuMzc3IDE2LjgzNCAxMC40MDIgQyAxNi44NzggMTAuNDI2IDE2LjkyIDEwLjQ1NyAxNi45NTcgMTAuNDkzIEMgMTYuOTk0IDEwLjUyOSAxNy4wMjcgMTAuNTcgMTcuMDU0IDEwLjYxNiBDIDE3LjA4MSAxMC42NjIgMTcuMTAzIDEwLjcxMyAxNy4xMTggMTAuNzY5IEMgMTcuMTI1IDEwLjc5NSAxNy4xMyAxMC44MjEgMTcuMTM0IDEwLjg0OCBDIDE3LjEzNyAxMC44NzQgMTcuMTM5IDEwLjkgMTcuMTM5IDEwLjkyNiBDIDE3LjEzOCAxMC45NTIgMTcuMTM2IDEwLjk3OCAxNy4xMzMgMTEuMDA0IEMgMTcuMTI5IDExLjAzIDE3LjEyNCAxMS4wNTUgMTcuMTE4IDExLjA4IEMgMTcuMTExIDExLjEwNiAxNy4xMDMgMTEuMTMgMTcuMDkzIDExLjE1NCBDIDE3LjA4MyAxMS4xNzggMTcuMDcyIDExLjIwMiAxNy4wNTkgMTEuMjI0IEMgMTcuMDQ2IDExLjI0NyAxNy4wMzEgMTEuMjY4IDE3LjAxNSAxMS4yODkgQyAxNi45OTkgMTEuMzEgMTYuOTgyIDExLjMzIDE2Ljk2MyAxMS4zNDkgTCAxNi42NjMgMTEuNjQ5IEwgMTYuMzYzIDExLjk0OSBMIDE2LjA2MyAxMi4yNDkgTCAxNS43NjQgMTIuNTQ5IEwgMTUuNDY0IDEyLjg0OSBMIDE1LjE2NCAxMy4xNDkgTCAxNC44NjQgMTMuNDQ5IEwgMTQuNTY0IDEzLjc0OSBDIDE0LjUzNCAxMy43NzkgMTQuNTAzIDEzLjgwNCAxNC40NyAxMy44MjYgQyAxNC40MzYgMTMuODQ4IDE0LjQwMSAxMy44NjYgMTQuMzY1IDEzLjg4MSBDIDE0LjMyOSAxMy44OTYgMTQuMjkyIDEzLjkwNyAxNC4yNTQgMTMuOTE0IEMgMTQuMjE2IDEzLjkyMSAxNC4xNzcgMTMuOTI1IDE0LjEzOSAxMy45MjUgQyAxNC4xIDEzLjkyNSAxNC4wNjIgMTMuOTIxIDE0LjAyNCAxMy45MTQgQyAxMy45ODYgMTMuOTA3IDEzLjk0OSAxMy44OTYgMTMuOTEzIDEzLjg4MSBDIDEzLjg3NyAxMy44NjcgMTMuODQyIDEzLjg0OCAxMy44MDkgMTMuODI2IEMgMTMuNzc1IDEzLjgwNCAxMy43NDMgMTMuNzc5IDEzLjcxNCAxMy43NDkgTCAxMy40MTQgMTMuNDQ5IEwgMTMuMTE0IDEzLjE0OSBMIDEyLjgxNCAxMi44NDkgTCAxMi41MTUgMTIuNTQ5IEwgMTIuMjE1IDEyLjI0OSBMIDExLjkxNSAxMS45NDkgTCAxMS42MTUgMTEuNjQ5IEwgMTEuMzE1IDExLjM0OSBDIDExLjI4NSAxMS4zMiAxMS4yNiAxMS4yODkgMTEuMjM4IDExLjI1NSBDIDExLjIxNiAxMS4yMjIgMTEuMTk3IDExLjE4NyAxMS4xODMgMTEuMTUxIEMgMTEuMTY4IDExLjExNSAxMS4xNTcgMTEuMDc4IDExLjE1IDExLjA0IEMgMTEuMTQzIDExLjAwMiAxMS4xMzkgMTAuOTY0IDExLjEzOSAxMC45MjUgQyAxMS4xMzkgMTAuODg3IDExLjE0MyAxMC44NDggMTEuMTUgMTAuODEgQyAxMS4xNTcgMTAuNzcyIDExLjE2OCAxMC43MzUgMTEuMTgzIDEwLjY5OSBDIDExLjE5NyAxMC42NjMgMTEuMjE2IDEwLjYyNyAxMS4yMzggMTAuNTk0IEMgMTEuMjYgMTAuNTYxIDExLjI4NSAxMC41MjkgMTEuMzE1IDEwLjUgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTSAxNC4xMzkgNi43MjYgQyAxNC4xOCA2LjcyNiAxNC4yMjEgNi43MyAxNC4yNiA2LjczOCBDIDE0LjI5OSA2Ljc0NiAxNC4zMzcgNi43NTggMTQuMzczIDYuNzczIEMgMTQuNDA5IDYuNzg5IDE0LjQ0MyA2LjgwNyAxNC40NzUgNi44MjkgQyAxNC41MDcgNi44NTEgMTQuNTM2IDYuODc1IDE0LjU2MyA2LjkwMiBDIDE0LjU5MSA2LjkzIDE0LjYxNSA2Ljk1OSAxNC42MzcgNi45OTEgQyAxNC42NTkgNy4wMjMgMTQuNjc3IDcuMDU3IDE0LjY5MiA3LjA5MyBDIDE0LjcwNyA3LjEyOSAxNC43MTkgNy4xNjcgMTQuNzI3IDcuMjA2IEMgMTQuNzM1IDcuMjQ1IDE0LjczOSA3LjI4NSAxNC43MzkgNy4zMjYgTCAxNC43MzkgNy45MjYgTCAxNC43MzkgOC41MjYgTCAxNC43MzkgOS4xMjYgTCAxNC43MzkgOS43MjUgTCAxNC43MzkgMTAuMzI1IEwgMTQuNzM5IDEwLjkyNSBMIDE0LjczOSAxMS41MjUgTCAxNC43MzkgMTIuMTI0IEMgMTQuNzM5IDEyLjE4MiAxNC43MzEgMTIuMjM3IDE0LjcxNyAxMi4yODkgQyAxNC43MDMgMTIuMzQgMTQuNjgyIDEyLjM4OSAxNC42NTUgMTIuNDMzIEMgMTQuNjI5IDEyLjQ3NyAxNC41OTYgMTIuNTE3IDE0LjU2IDEyLjU1MyBDIDE0LjUyMyAxMi41ODggMTQuNDgzIDEyLjYxOSAxNC40MzkgMTIuNjQ0IEMgMTQuMzk1IDEyLjY3IDE0LjM0OCAxMi42ODkgMTQuMjk5IDEyLjcwMyBDIDE0LjI1IDEyLjcxNyAxNC4yIDEyLjcyNCAxNC4xNDggMTIuNzI1IEMgMTQuMDk3IDEyLjcyNiAxNC4wNDQgMTIuNzIgMTMuOTkyIDEyLjcwNyBDIDEzLjk0MSAxMi42OTQgMTMuODg5IDEyLjY3MyAxMy44MzkgMTIuNjQ0IEMgMTMuODE2IDEyLjYzMSAxMy43OTQgMTIuNjE2IDEzLjc3MyAxMi42IEMgMTMuNzUyIDEyLjU4NCAxMy43MzIgMTIuNTY3IDEzLjcxNCAxMi41NDggQyAxMy42OTYgMTIuNTMgMTMuNjc4IDEyLjUxIDEzLjY2MyAxMi40OSBDIDEzLjY0NyAxMi40NjkgMTMuNjMzIDEyLjQ0OCAxMy42MiAxMi40MjUgQyAxMy42MDcgMTIuNDAzIDEzLjU5NiAxMi4zNzkgMTMuNTg2IDEyLjM1NSBDIDEzLjU3NiAxMi4zMzEgMTMuNTY3IDEyLjMwNyAxMy41NiAxMi4yODEgQyAxMy41NTMgMTIuMjU2IDEzLjU0OCAxMi4yMyAxMy41NDQgMTIuMjA0IEMgMTMuNTQxIDEyLjE3OCAxMy41MzkgMTIuMTUxIDEzLjUzOSAxMi4xMjQgTCAxMy41MzkgMTEuNTI1IEwgMTMuNTM5IDEwLjkyNSBMIDEzLjUzOSAxMC4zMjUgTCAxMy41MzkgOS43MjUgTCAxMy41MzkgOS4xMjYgTCAxMy41MzkgOC41MjYgTCAxMy41MzkgNy45MjYgTCAxMy41MzkgNy4zMjYgQyAxMy41MzkgNy4yODUgMTMuNTQzIDcuMjQ0IDEzLjU1MSA3LjIwNSBDIDEzLjU1OSA3LjE2NyAxMy41NzEgNy4xMjkgMTMuNTg2IDcuMDkzIEMgMTMuNjAxIDcuMDU3IDEzLjYyIDcuMDIzIDEzLjY0MSA2Ljk5MSBDIDEzLjY2MyA2Ljk1OSAxMy42ODggNi45MjkgMTMuNzE1IDYuOTAyIEMgMTMuNzQyIDYuODc1IDEzLjc3MiA2Ljg1IDEzLjgwNCA2LjgyOSBDIDEzLjgzNiA2LjgwNyAxMy44NyA2Ljc4OSAxMy45MDYgNi43NzMgQyAxMy45NDIgNi43NTggMTMuOTc5IDYuNzQ2IDE0LjAxOCA2LjczOCBDIDE0LjA1NyA2LjczIDE0LjA5OCA2LjcyNiAxNC4xMzkgNi43MjYgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gNC42MTQgMTMuOTI0IEwgNC42MTQgMTMuMzI2IEwgNC42MTQgMTIuNzI4IEwgNC42MTQgMTIuMTI5IEwgNC42MTQgMTEuNTMxIEwgNC42MTQgMTAuOTMzIEwgNC42MTQgMTAuMzM0IEwgNC42MTQgOS43MzYgTCA0LjYxNCA5LjEzNyBMIDQuNjIzIDkuMTM3IEwgNC42MzEgOS4xMzcgTCA0LjYzOSA5LjEzNyBMIDQuNjQ4IDkuMTM3IEwgNC42NTYgOS4xMzcgTCA0LjY2NSA5LjEzNyBMIDQuNjczIDkuMTM3IEwgNC42ODIgOS4xMzcgTCA0Ljg5NiA5LjYyMyBMIDUuMTEgMTAuMTA5IEwgNS4zMjQgMTAuNTk1IEwgNS41MzggMTEuMDggTCA1Ljc1MiAxMS41NjYgTCA1Ljk2NyAxMi4wNTEgTCA2LjE4MSAxMi41MzcgTCA2LjM5NSAxMy4wMjMgTCA2LjUxMSAxMy4wMjMgTCA2LjYyNyAxMy4wMjMgTCA2Ljc0MyAxMy4wMjMgTCA2Ljg1OSAxMy4wMjMgTCA2Ljk3NSAxMy4wMjMgTCA3LjA5MSAxMy4wMjMgTCA3LjIwNyAxMy4wMjMgTCA3LjMyMyAxMy4wMjMgTCA3LjUzNiAxMi41MzcgTCA3Ljc0OSAxMi4wNTEgTCA3Ljk2MiAxMS41NjYgTCA4LjE3NSAxMS4wOCBMIDguMzg4IDEwLjU5NCBMIDguNjAxIDEwLjEwOCBMIDguODEzIDkuNjIyIEwgOS4wMjYgOS4xMzYgTCA5LjAzNCA5LjEzNiBMIDkuMDQzIDkuMTM2IEwgOS4wNTEgOS4xMzYgTCA5LjA2IDkuMTM2IEwgOS4wNjggOS4xMzYgTCA5LjA3NyA5LjEzNiBMIDkuMDg1IDkuMTM2IEwgOS4wOTQgOS4xMzYgTCA5LjA5NCA5LjczNCBMIDkuMDk0IDEwLjMzMyBMIDkuMDk0IDEwLjkzMSBMIDkuMDk0IDExLjUzIEwgOS4wOTQgMTIuMTI4IEwgOS4wOTQgMTIuNzI3IEwgOS4wOTQgMTMuMzI1IEwgOS4wOTQgMTMuOTI0IEwgOS4yNTUgMTMuOTI0IEwgOS40MTYgMTMuOTI0IEwgOS41NzcgMTMuOTI0IEwgOS43MzggMTMuOTI0IEwgOS44OTggMTMuOTI0IEwgMTAuMDU5IDEzLjkyNCBMIDEwLjIyIDEzLjkyNCBMIDEwLjM4MSAxMy45MjQgTCAxMC4zODEgMTMuMDI0IEwgMTAuMzgxIDEyLjEyNSBMIDEwLjM4MSAxMS4yMjUgTCAxMC4zODEgMTAuMzI2IEwgMTAuMzgxIDkuNDI2IEwgMTAuMzgxIDguNTI3IEwgMTAuMzgxIDcuNjI3IEwgMTAuMzgxIDYuNzI4IEwgMTAuMjAxIDYuNzI4IEwgMTAuMDIxIDYuNzI4IEwgOS44NDEgNi43MjggTCA5LjY2MSA2LjcyOCBMIDkuNDgxIDYuNzI4IEwgOS4zMDEgNi43MjggTCA5LjEyMSA2LjcyOCBMIDguOTQxIDYuNzI4IEwgOC42ODQgNy4zMTIgTCA4LjQyOCA3Ljg5NiBMIDguMTcxIDguNDggTCA3LjkxNSA5LjA2NCBMIDcuNjU5IDkuNjQ3IEwgNy40MDMgMTAuMjMxIEwgNy4xNDYgMTAuODE1IEwgNi44OSAxMS4zOTkgTCA2Ljg4NCAxMS4zOTkgTCA2Ljg3OCAxMS4zOTkgTCA2Ljg3MiAxMS4zOTkgTCA2Ljg2NiAxMS4zOTkgTCA2Ljg2IDExLjM5OSBMIDYuODU1IDExLjM5OSBMIDYuODQ5IDExLjM5OSBMIDYuODQzIDExLjM5OSBMIDYuNTg2IDEwLjgxNSBMIDYuMzMgMTAuMjMxIEwgNi4wNzMgOS42NDcgTCA1LjgxNyA5LjA2NCBMIDUuNTYxIDguNDggTCA1LjMwNSA3Ljg5NiBMIDUuMDQ4IDcuMzEyIEwgNC43OTIgNi43MjggTCA0LjYxMSA2LjcyOCBMIDQuNDMgNi43MjggTCA0LjI0OCA2LjcyOCBMIDQuMDY3IDYuNzI4IEwgMy44ODYgNi43MjggTCAzLjcwNSA2LjcyOCBMIDMuNTI0IDYuNzI4IEwgMy4zNDMgNi43MjggTCAzLjM0MyA3LjYyNyBMIDMuMzQzIDguNTI3IEwgMy4zNDMgOS40MjYgTCAzLjM0MyAxMC4zMjYgTCAzLjM0MyAxMS4yMjUgTCAzLjM0MyAxMi4xMjUgTCAzLjM0MyAxMy4wMjQgTCAzLjM0MyAxMy45MjQgTCAzLjUwMiAxMy45MjQgTCAzLjY2MSAxMy45MjQgTCAzLjgxOSAxMy45MjQgTCAzLjk3OCAxMy45MjQgTCA0LjEzNyAxMy45MjQgTCA0LjI5NiAxMy45MjQgTCA0LjQ1NSAxMy45MjQgWiIgc3R5bGU9IiIvPgo8L3N2Zz4=",
        accesskey: "M"
    }]);
    css('#context-copylink, #context-bookmarklink, #context-savelink { display: none; }');
}
//复制链接文本
new function () {
    var groupMenu = GroupMenu({
        id: 'context-copytext-group',
        class: 'showText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "复制链接文字..." : "Copy Text...",
        condition: 'link noimage',
        insertBefore: 'context-savelink',
        onpopupshowing: syncHidden
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "复制链接文字" : "Copy Text",
        text: "%LINK_TEXT%",
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNi40NDIgMTkuMDUgTCA1LjU5OSAxOS4wNSBMIDQuNzU2IDE5LjA1IEwgMy45MTMgMTkuMDUgTCAzLjA3IDE5LjA1IEMgMi45NiAxOS4wMzkgMi44NCAxOS4wMTcgMi43MTggMTguOTg1IEMgMi41OTYgMTguOTUzIDIuNDcyIDE4LjkxMiAyLjM1MyAxOC44NjMgQyAyLjIzNSAxOC44MTUgMi4xMjEgMTguNzU5IDIuMDE5IDE4LjY5NyBDIDEuOTE4IDE4LjYzNSAxLjgyOSAxOC41NjggMS43NTkgMTguNDk2IEMgMS42OSAxOC40MjYgMS42MjUgMTguMzM2IDEuNTY2IDE4LjIzNCBDIDEuNTA2IDE4LjEzMiAxLjQ1MyAxOC4wMTkgMS40MDYgMTcuOSBDIDEuMzYgMTcuNzgyIDEuMzIgMTcuNjU4IDEuMjkgMTcuNTM3IEMgMS4yNiAxNy40MTYgMS4yMzkgMTcuMjk4IDEuMjI4IDE3LjE4OCBMIDEuMjI4IDE2LjMyNSBMIDEuMjI4IDE1LjQ2MiBMIDEuMjI4IDE0LjU5OSBMIDEuMjI4IDEzLjczNiBMIDEuNzI4IDEzLjczNiBMIDIuMjI4IDEzLjczNiBMIDIuMzk1IDEzLjczNiBMIDIuODk1IDEzLjczNiBMIDIuODk1IDE0LjU5OSBMIDIuODk1IDE1LjQ2MiBMIDIuODk1IDE2LjMyNSBMIDIuODk1IDE3LjYwNSBDIDIuODg1IDE3LjYxNSAyLjg3NSAxNy42MTIgMi44NjcgMTcuNjAzIEMgMi44NTkgMTcuNTk0IDIuODUzIDE3LjU3OSAyLjg0OSAxNy41NjMgQyAyLjg0NiAxNy41NDggMi44NDQgMTcuNTMzIDIuODQ1IDE3LjUyMyBDIDIuODQ2IDE3LjUxMyAyLjg1IDE3LjUwOSAyLjg1NyAxNy41MTYgQyAyLjg2NCAxNy41MjMgMi44NTkgMTcuNTI2IDIuODQ3IDE3LjUyNiBDIDIuODM1IDE3LjUyNiAyLjgxNyAxNy41MjQgMi43OTggMTcuNTE5IEMgMi43OCAxNy41MTQgMi43NjIgMTcuNTA3IDIuNzUgMTcuNDk4IEMgMi43MzcgMTcuNDg5IDIuNzMxIDE3LjQ3OSAyLjczNyAxNy40NjcgTCAzLjU4IDE3LjQ2NyBMIDQuNzU2IDE3LjQ2NyBMIDUuNTk5IDE3LjQ2NyBMIDYuNDQyIDE3LjQ2NyBMIDYuNDQyIDE3LjYzNCBMIDYuNDQyIDE4LjEzNCBMIDYuNDQyIDE4LjU1IEwgNi40NDIgMTkuMDUgWiIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gMTEuMjI3IDEyLjAyMiBMIDEwLjg2NCAxMi4wMjIgTCAxMC41MDEgMTIuMDIyIEwgMTAuMTM4IDEyLjAyMiBMIDkuNzc1IDEyLjAyMiBMIDkuNDEyIDEyLjAyMiBMIDkuMDQ5IDEyLjAyMiBMIDguNjg2IDEyLjAyMiBMIDguMzIyIDEyLjAyMiBMIDguMjMyIDEyLjM2MSBMIDguMTQxIDEyLjcwMSBMIDguMDUxIDEzLjA0IEwgNy45NiAxMy4zNzkgTCA3Ljg3IDEzLjcxOCBMIDcuNzc5IDE0LjA1NyBMIDcuNjg5IDE0LjM5NiBMIDcuNTk4IDE0LjczNiBMIDcuMzAxIDE0LjczNiBMIDcuMDAzIDE0LjczNiBMIDYuNzA1IDE0LjczNiBMIDYuNDA3IDE0LjczNiBMIDYuMTEgMTQuNzM2IEwgNS44MTIgMTQuNzM2IEwgNS41MTQgMTQuNzM2IEwgNS4yMTYgMTQuNzM2IEwgNS42MDUgMTMuNDggTCA1Ljk5MyAxMi4yMjMgTCA2LjM4MSAxMC45NjcgTCA2Ljc2OSA5LjcxIEwgNy4xNTggOC40NTQgTCA3LjU0NiA3LjE5NyBMIDcuOTM0IDUuOTQxIEwgOC4zMjIgNC42ODUgTCA4LjY5OSA0LjY4NSBMIDkuMDc2IDQuNjg1IEwgOS40NTMgNC42ODUgTCA5LjgzIDQuNjg1IEwgMTAuMjA3IDQuNjg1IEwgMTAuNTg0IDQuNjg1IEwgMTAuOTYxIDQuNjg1IEwgMTEuMzM3IDQuNjg1IEwgMTEuNzMxIDUuOTQxIEwgMTIuMTI0IDcuMTk3IEwgMTIuNTE3IDguNDU0IEwgMTIuOTEgOS43MSBMIDEzLjMwNCAxMC45NjcgTCAxMy42OTcgMTIuMjIzIEwgMTQuMDkgMTMuNDggTCAxNC40ODMgMTQuNzM2IEwgMTQuMTc0IDE0LjczNiBMIDEzLjg2NSAxNC43MzYgTCAxMy41NTYgMTQuNzM2IEwgMTMuMjQ3IDE0LjczNiBMIDEyLjkzOCAxNC43MzYgTCAxMi42MjkgMTQuNzM2IEwgMTIuMzIgMTQuNzM2IEwgMTIuMDEgMTQuNzM2IEwgMTEuOTEzIDE0LjM5NiBMIDExLjgxNSAxNC4wNTcgTCAxMS43MTcgMTMuNzE4IEwgMTEuNjE5IDEzLjM3OSBMIDExLjUyMSAxMy4wNCBMIDExLjQyMyAxMi43MDEgTCAxMS4zMjUgMTIuMzYxIEwgMTEuMjI3IDEyLjAyMiBNIDguNjUzIDEwLjM5NCBMIDguOTM0IDEwLjM5NCBMIDkuMjE0IDEwLjM5NCBMIDkuNDk0IDEwLjM5NCBMIDkuNzc0IDEwLjM5NCBMIDEwLjA1NCAxMC4zOTQgTCAxMC4zMzQgMTAuMzk0IEwgMTAuNjE0IDEwLjM5NCBMIDEwLjg5NSAxMC4zOTQgTCAxMC44MTUgMTAuMTI3IEwgMTAuNzM2IDkuODYxIEwgMTAuNjU3IDkuNTk1IEwgMTAuNTc4IDkuMzI5IEwgMTAuNDk4IDkuMDYyIEwgMTAuNDE5IDguNzk2IEwgMTAuMzQgOC41MjkgTCAxMC4yNjEgOC4yNjMgTCAxMC4yMjggOC4xNDEgTCAxMC4xOTYgOC4wMTkgTCAxMC4xNjMgNy44OTcgTCAxMC4xMzEgNy43NzUgTCAxMC4wOTggNy42NTMgTCAxMC4wNjUgNy41MzEgTCAxMC4wMzIgNy40MDkgTCAxMCA3LjI4OCBMIDkuOTY4IDcuMTY3IEwgOS45MzcgNy4wNDYgTCA5LjkwNiA2LjkyNSBMIDkuODc1IDYuODA1IEwgOS44NDMgNi42ODQgTCA5LjgxMiA2LjU2NCBMIDkuNzggNi40NDMgTCA5Ljc0OSA2LjMyMyBMIDkuNzQ1IDYuMzIzIEwgOS43NDEgNi4zMjMgTCA5LjczNyA2LjMyMyBMIDkuNzM0IDYuMzIzIEwgOS43MyA2LjMyMyBMIDkuNzI2IDYuMzIzIEwgOS43MjIgNi4zMjMgTCA5LjcxOCA2LjMyMyBMIDkuNjkgNi40NDQgTCA5LjY2MyA2LjU2NiBMIDkuNjM1IDYuNjg4IEwgOS42MDggNi44MSBMIDkuNTgxIDYuOTMyIEwgOS41NTMgNy4wNTQgTCA5LjUyNiA3LjE3NiBMIDkuNDk4IDcuMjk4IEwgOS40NjggNy40MjEgTCA5LjQzOCA3LjU0NCBMIDkuNDA4IDcuNjY3IEwgOS4zNzcgNy43OTEgTCA5LjM0NyA3LjkxNCBMIDkuMzE3IDguMDM3IEwgOS4yODcgOC4xNiBMIDkuMjU2IDguMjgzIEwgOS4xODEgOC41NDcgTCA5LjEwNiA4LjgxMSBMIDkuMDMxIDkuMDc1IEwgOC45NTUgOS4zMzkgTCA4Ljg4IDkuNjAzIEwgOC44MDQgOS44NjcgTCA4LjcyOSAxMC4xMyBMIDguNjUzIDEwLjM5NCIgc3R5bGU9IiIvPgogIDxwYXRoIGQ9Ik0gNi40OTIgNi4zNjQgTCA1LjY0OSA2LjM2NCBMIDQuODA2IDYuMzY0IEwgMy45NjMgNi4zNjQgTCAzLjEyIDYuMzY0IEMgMy4wMSA2LjM1MyAyLjg5IDYuMzMxIDIuNzY4IDYuMjk5IEMgMi42NDYgNi4yNjcgMi41MjIgNi4yMjYgMi40MDMgNi4xNzcgQyAyLjI4NSA2LjEyOSAyLjE3MSA2LjA3MyAyLjA2OSA2LjAxMSBDIDEuOTY4IDUuOTQ5IDEuODc5IDUuODgyIDEuODA5IDUuODEgQyAxLjc0IDUuNzQgMS42NzUgNS42NSAxLjYxNiA1LjU0OCBDIDEuNTU2IDUuNDQ2IDEuNTAzIDUuMzMzIDEuNDU2IDUuMjE0IEMgMS40MSA1LjA5NiAxLjM3IDQuOTcyIDEuMzQgNC44NTEgQyAxLjMxIDQuNzMgMS4yODkgNC42MTIgMS4yNzggNC41MDIgTCAxLjI3OCAzLjYzOSBMIDEuMjc4IDIuNzc2IEwgMS4yNzggMS45MTMgTCAxLjI3OCAxLjA1IEwgMS43NzggMS4wNSBMIDIuMjc4IDEuMDUgTCAyLjQ0NSAxLjA1IEwgMi45NDUgMS4wNSBMIDIuOTQ1IDEuOTEzIEwgMi45NDUgMi43NzYgTCAyLjk0NSAzLjYzOSBMIDIuOTQ1IDQuOTE5IEMgMi45MzUgNC45MjkgMi45MjUgNC45MjYgMi45MTcgNC45MTcgQyAyLjkwOSA0LjkwOCAyLjkwMyA0Ljg5MyAyLjg5OSA0Ljg3NyBDIDIuODk2IDQuODYyIDIuODk0IDQuODQ3IDIuODk1IDQuODM3IEMgMi44OTYgNC44MjcgMi45IDQuODIzIDIuOTA3IDQuODMgQyAyLjkxNCA0LjgzNyAyLjkwOSA0Ljg0IDIuODk3IDQuODQgQyAyLjg4NSA0Ljg0IDIuODY3IDQuODM4IDIuODQ4IDQuODMzIEMgMi44MyA0LjgyOCAyLjgxMiA0LjgyMSAyLjggNC44MTIgQyAyLjc4NyA0LjgwMyAyLjc4MSA0Ljc5MyAyLjc4NyA0Ljc4MSBMIDMuNjMgNC43ODEgTCA0LjgwNiA0Ljc4MSBMIDUuNjQ5IDQuNzgxIEwgNi40OTIgNC43ODEgTCA2LjQ5MiA0Ljk0OCBMIDYuNDkyIDUuNDQ4IEwgNi40OTIgNS44NjQgTCA2LjQ5MiA2LjM2NCBaIiBzdHlsZT0iIiB0cmFuc2Zvcm09Im1hdHJpeCgwLCAxLCAtMSwgMCwgNy41OTIsIC0wLjE3OCkiLz4KICA8cGF0aCBkPSJNIDE4Ljg3IDYuMzE0IEwgMTguMDI3IDYuMzE0IEwgMTcuMTg0IDYuMzE0IEwgMTYuMzQxIDYuMzE0IEwgMTUuNDk4IDYuMzE0IEMgMTUuMzg4IDYuMzAzIDE1LjI2OCA2LjI4MSAxNS4xNDYgNi4yNDkgQyAxNS4wMjQgNi4yMTcgMTQuOSA2LjE3NiAxNC43ODEgNi4xMjcgQyAxNC42NjMgNi4wNzkgMTQuNTQ5IDYuMDIzIDE0LjQ0NyA1Ljk2MSBDIDE0LjM0NiA1Ljg5OSAxNC4yNTcgNS44MzIgMTQuMTg3IDUuNzYgQyAxNC4xMTggNS42OSAxNC4wNTMgNS42IDEzLjk5NCA1LjQ5OCBDIDEzLjkzNCA1LjM5NiAxMy44ODEgNS4yODMgMTMuODM0IDUuMTY0IEMgMTMuNzg4IDUuMDQ2IDEzLjc0OCA0LjkyMiAxMy43MTggNC44MDEgQyAxMy42ODggNC42OCAxMy42NjcgNC41NjIgMTMuNjU2IDQuNDUyIEwgMTMuNjU2IDMuNTg5IEwgMTMuNjU2IDIuNzI2IEwgMTMuNjU2IDEuODYzIEwgMTMuNjU2IDEgTCAxNC4xNTYgMSBMIDE0LjY1NiAxIEwgMTQuODIzIDEgTCAxNS4zMjMgMSBMIDE1LjMyMyAxLjg2MyBMIDE1LjMyMyAyLjcyNiBMIDE1LjMyMyAzLjU4OSBMIDE1LjMyMyA0Ljg2OSBDIDE1LjMxMyA0Ljg3OSAxNS4zMDMgNC44NzYgMTUuMjk1IDQuODY3IEMgMTUuMjg3IDQuODU4IDE1LjI4MSA0Ljg0MyAxNS4yNzcgNC44MjcgQyAxNS4yNzQgNC44MTIgMTUuMjcyIDQuNzk3IDE1LjI3MyA0Ljc4NyBDIDE1LjI3NCA0Ljc3NyAxNS4yNzggNC43NzMgMTUuMjg1IDQuNzggQyAxNS4yOTIgNC43ODcgMTUuMjg3IDQuNzkgMTUuMjc1IDQuNzkgQyAxNS4yNjMgNC43OSAxNS4yNDUgNC43ODggMTUuMjI2IDQuNzgzIEMgMTUuMjA4IDQuNzc4IDE1LjE5IDQuNzcxIDE1LjE3OCA0Ljc2MiBDIDE1LjE2NSA0Ljc1MyAxNS4xNTkgNC43NDMgMTUuMTY1IDQuNzMxIEwgMTYuMDA4IDQuNzMxIEwgMTcuMTg0IDQuNzMxIEwgMTguMDI3IDQuNzMxIEwgMTguODcgNC43MzEgTCAxOC44NyA0Ljg5OCBMIDE4Ljg3IDUuMzk4IEwgMTguODcgNS44MTQgTCAxOC44NyA2LjMxNCBaIiBzdHlsZT0iIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSwgMCwgMCwgLTEsIDMyLjUyNjAwMSwgNy4zMTQpIi8+CiAgPHBhdGggZD0iTSAxOC40NzIgMTkuMSBMIDE3LjYyOSAxOS4xIEwgMTYuNzg2IDE5LjEgTCAxNS45NDMgMTkuMSBMIDE1LjEgMTkuMSBDIDE0Ljk5IDE5LjA4OSAxNC44NyAxOS4wNjcgMTQuNzQ4IDE5LjAzNSBDIDE0LjYyNiAxOS4wMDMgMTQuNTAyIDE4Ljk2MiAxNC4zODMgMTguOTEzIEMgMTQuMjY1IDE4Ljg2NSAxNC4xNTEgMTguODA5IDE0LjA0OSAxOC43NDcgQyAxMy45NDggMTguNjg1IDEzLjg1OSAxOC42MTggMTMuNzg5IDE4LjU0NiBDIDEzLjcyIDE4LjQ3NiAxMy42NTUgMTguMzg2IDEzLjU5NiAxOC4yODQgQyAxMy41MzYgMTguMTgyIDEzLjQ4MyAxOC4wNjkgMTMuNDM2IDE3Ljk1IEMgMTMuMzkgMTcuODMyIDEzLjM1IDE3LjcwOCAxMy4zMiAxNy41ODcgQyAxMy4yOSAxNy40NjYgMTMuMjY5IDE3LjM0OCAxMy4yNTggMTcuMjM4IEwgMTMuMjU4IDE2LjM3NSBMIDEzLjI1OCAxNS41MTIgTCAxMy4yNTggMTQuNjQ5IEwgMTMuMjU4IDEzLjc4NiBMIDEzLjc1OCAxMy43ODYgTCAxNC4yNTggMTMuNzg2IEwgMTQuNDI1IDEzLjc4NiBMIDE0LjkyNSAxMy43ODYgTCAxNC45MjUgMTQuNjQ5IEwgMTQuOTI1IDE1LjUxMiBMIDE0LjkyNSAxNi4zNzUgTCAxNC45MjUgMTcuNjU1IEMgMTQuOTE1IDE3LjY2NSAxNC45MDUgMTcuNjYyIDE0Ljg5NyAxNy42NTMgQyAxNC44ODkgMTcuNjQ0IDE0Ljg4MyAxNy42MjkgMTQuODc5IDE3LjYxMyBDIDE0Ljg3NiAxNy41OTggMTQuODc0IDE3LjU4MyAxNC44NzUgMTcuNTczIEMgMTQuODc2IDE3LjU2MyAxNC44OCAxNy41NTkgMTQuODg3IDE3LjU2NiBDIDE0Ljg5NCAxNy41NzMgMTQuODg5IDE3LjU3NiAxNC44NzcgMTcuNTc2IEMgMTQuODY1IDE3LjU3NiAxNC44NDcgMTcuNTc0IDE0LjgyOCAxNy41NjkgQyAxNC44MSAxNy41NjQgMTQuNzkyIDE3LjU1NyAxNC43OCAxNy41NDggQyAxNC43NjcgMTcuNTM5IDE0Ljc2MSAxNy41MjkgMTQuNzY3IDE3LjUxNyBMIDE1LjYxIDE3LjUxNyBMIDE2Ljc4NiAxNy41MTcgTCAxNy42MjkgMTcuNTE3IEwgMTguNDcyIDE3LjUxNyBMIDE4LjQ3MiAxNy42ODQgTCAxOC40NzIgMTguMTg0IEwgMTguNDcyIDE4LjYgTCAxOC40NzIgMTkuMSBaIiBzdHlsZT0iIiB0cmFuc2Zvcm09Im1hdHJpeCgwLCAtMSwgMSwgMCwgLTAuNTc4LCAzMi4zMDgwMDEpIi8+Cjwvc3ZnPg=="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "文字和链接" : "Copy Text and Link",
        text: "%LINK_TEXT%\n%l",
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gNy4yNiA4Ljc0NiBDIDcuMjA0IDguNzQ2IDcuMTUxIDguNzU0IDcuMTAxIDguNzY4IEMgNy4wNTEgOC43ODIgNy4wMDUgOC44MDIgNi45NjIgOC44MjggQyA2LjkxOSA4Ljg1MyA2Ljg4IDguODg1IDYuODQ2IDguOTIgQyA2LjgxMSA4Ljk1NSA2Ljc4MiA4Ljk5NCA2Ljc1NyA5LjAzNyBDIDYuNzMzIDkuMDggNi43MTMgOS4xMjUgNi43IDkuMTcyIEMgNi42ODcgOS4yMTkgNi42NzkgOS4yNjggNi42NzggOS4zMTggQyA2LjY3NyA5LjM2OCA2LjY4MyA5LjQxOSA2LjY5NiA5LjQ2OSBDIDYuNzA5IDkuNTE5IDYuNzI5IDkuNTY5IDYuNzU3IDkuNjE4IEMgNi43NyA5LjY0MSA2Ljc4NCA5LjY2MiA2LjggOS42ODIgQyA2LjgxNSA5LjcwMyA2LjgzMiA5LjcyMiA2Ljg1IDkuNzQgQyA2Ljg2OCA5Ljc1NyA2Ljg4NyA5Ljc3NCA2LjkwNyA5Ljc4OSBDIDYuOTI3IDkuODA1IDYuOTQ4IDkuODE4IDYuOTcgOS44MzEgQyA2Ljk5MSA5Ljg0MyA3LjAxNCA5Ljg1NSA3LjAzNyA5Ljg2NCBDIDcuMDYgOS44NzQgNy4wODQgOS44ODIgNy4xMDkgOS44ODkgQyA3LjEzMyA5Ljg5NiA3LjE1OCA5LjkwMSA3LjE4MyA5LjkwNCBDIDcuMjA4IDkuOTA3IDcuMjM0IDkuOTA5IDcuMjYgOS45MDkgTCA3Ljk4NiA5LjkwOSBMIDguNzEzIDkuOTA5IEwgOS40MzkgOS45MDkgTCAxMC4xNjYgOS45MDkgTCAxMC44OTIgOS45MDkgTCAxMS42MTkgOS45MDkgTCAxMi4zNDUgOS45MDkgTCAxMy4wNzIgOS45MDkgQyAxMy4xMjggOS45MDkgMTMuMTgxIDkuOTAxIDEzLjIzMSA5Ljg4OCBDIDEzLjI4MSA5Ljg3NCAxMy4zMjggOS44NTMgMTMuMzcxIDkuODI3IEMgMTMuNDE0IDkuODAyIDEzLjQ1MyA5Ljc3MSAxMy40ODcgOS43MzUgQyAxMy41MjIgOS43IDEzLjU1MSA5LjY2MSAxMy41NzYgOS42MTggQyAxMy42IDkuNTc2IDEzLjYxOSA5LjUzMSAxMy42MzIgOS40ODQgQyAxMy42NDUgOS40MzYgMTMuNjUzIDkuMzg3IDEzLjY1NCA5LjMzNyBDIDEzLjY1NSA5LjI4NyAxMy42NDkgOS4yMzYgMTMuNjM2IDkuMTg2IEMgMTMuNjIzIDkuMTM2IDEzLjYwMyA5LjA4NiAxMy41NzYgOS4wMzcgQyAxMy41NjMgOS4wMTUgMTMuNTQ4IDguOTkzIDEzLjUzMyA4Ljk3MyBDIDEzLjUxNyA4Ljk1MyAxMy41IDguOTM0IDEzLjQ4MyA4LjkxNiBDIDEzLjQ2NSA4Ljg5OCAxMy40NDYgOC44ODEgMTMuNDI2IDguODY2IEMgMTMuNDA1IDguODUxIDEzLjM4NCA4LjgzNyAxMy4zNjMgOC44MjQgQyAxMy4zNDEgOC44MTIgMTMuMzE4IDguODAxIDEzLjI5NSA4Ljc5MSBDIDEzLjI3MiA4Ljc4MSAxMy4yNDggOC43NzMgMTMuMjI0IDguNzY2IEMgMTMuMTk5IDguNzYgMTMuMTc0IDguNzU1IDEzLjE0OSA4Ljc1MSBDIDEzLjEyNCA4Ljc0OCAxMy4wOTggOC43NDYgMTMuMDcyIDguNzQ2IEwgMTIuMzQ1IDguNzQ2IEwgMTEuNjE5IDguNzQ2IEwgMTAuODkyIDguNzQ2IEwgMTAuMTY2IDguNzQ2IEwgOS40MzkgOC43NDYgTCA4LjcxMyA4Ljc0NiBMIDcuOTg2IDguNzQ2IFogTSA2LjY3OSAxMS42NTIgQyA2LjY3OSAxMS42MTIgNi42ODMgMTEuNTcyIDYuNjkxIDExLjUzNSBDIDYuNjk5IDExLjQ5NyA2LjcxIDExLjQ2MSA2LjcyNSAxMS40MjYgQyA2Ljc0IDExLjM5MSA2Ljc1OCAxMS4zNTggNi43NzggMTEuMzI3IEMgNi43OTkgMTEuMjk2IDYuODIzIDExLjI2OCA2Ljg0OSAxMS4yNDEgQyA2Ljg3NiAxMS4yMTUgNi45MDQgMTEuMTkxIDYuOTM1IDExLjE3IEMgNi45NjYgMTEuMTUgNi45OTkgMTEuMTMyIDcuMDM0IDExLjExNyBDIDcuMDY5IDExLjEwMiA3LjEwNSAxMS4wOTEgNy4xNDMgMTEuMDgzIEMgNy4xODEgMTEuMDc1IDcuMjIgMTEuMDcxIDcuMjYgMTEuMDcxIEwgNy45ODcgMTEuMDcxIEwgOC43MTMgMTEuMDcxIEwgOS40NCAxMS4wNzEgTCAxMC4xNjYgMTEuMDcxIEwgMTAuODkzIDExLjA3MSBMIDExLjYxOSAxMS4wNzEgTCAxMi4zNDYgMTEuMDcxIEwgMTMuMDcyIDExLjA3MSBDIDEzLjEyOCAxMS4wNzEgMTMuMTgxIDExLjA3OSAxMy4yMzEgMTEuMDkzIEMgMTMuMjgxIDExLjEwNyAxMy4zMjggMTEuMTI3IDEzLjM3MSAxMS4xNTMgQyAxMy40MTQgMTEuMTc5IDEzLjQ1MyAxMS4yMSAxMy40ODcgMTEuMjQ1IEMgMTMuNTIyIDExLjI4IDEzLjU1MSAxMS4zMTkgMTMuNTc2IDExLjM2MSBDIDEzLjYgMTEuNDA0IDEzLjYxOSAxMS40NDkgMTMuNjMyIDExLjQ5NiBDIDEzLjY0NSAxMS41NDQgMTMuNjUzIDExLjU5MyAxMy42NTQgMTEuNjQzIEMgMTMuNjU1IDExLjY5MyAxMy42NDkgMTEuNzQ0IDEzLjYzNiAxMS43OTQgQyAxMy42MjQgMTEuODQ1IDEzLjYwMyAxMS44OTUgMTMuNTc2IDExLjk0MyBDIDEzLjU2MyAxMS45NjYgMTMuNTQ4IDExLjk4NyAxMy41MzMgMTIuMDA3IEMgMTMuNTE3IDEyLjAyOCAxMy41IDEyLjA0NyAxMy40ODMgMTIuMDY0IEMgMTMuNDY1IDEyLjA4MiAxMy40NDYgMTIuMDk5IDEzLjQyNiAxMi4xMTQgQyAxMy40MDUgMTIuMTI5IDEzLjM4NCAxMi4xNDMgMTMuMzYzIDEyLjE1NSBDIDEzLjM0MSAxMi4xNjggMTMuMzE4IDEyLjE3OSAxMy4yOTUgMTIuMTg5IEMgMTMuMjcyIDEyLjE5OCAxMy4yNDggMTIuMjA3IDEzLjIyNCAxMi4yMTMgQyAxMy4xOTkgMTIuMjIgMTMuMTc0IDEyLjIyNSAxMy4xNDkgMTIuMjI4IEMgMTMuMTI0IDEyLjIzMSAxMy4wOTggMTIuMjMzIDEzLjA3MiAxMi4yMzMgTCAxMi4zNDUgMTIuMjMzIEwgMTEuNjE5IDEyLjIzMyBMIDEwLjg5MiAxMi4yMzMgTCAxMC4xNjYgMTIuMjMzIEwgOS40MzkgMTIuMjMzIEwgOC43MTMgMTIuMjMzIEwgNy45ODYgMTIuMjMzIEwgNy4yNiAxMi4yMzMgQyA3LjIxOSAxMi4yMzMgNy4xOCAxMi4yMjkgNy4xNDIgMTIuMjIxIEMgNy4xMDQgMTIuMjE0IDcuMDY4IDEyLjIwMiA3LjAzMyAxMi4xODcgQyA2Ljk5OCAxMi4xNzMgNi45NjUgMTIuMTU1IDYuOTM1IDEyLjEzNCBDIDYuOTA0IDEyLjExMyA2Ljg3NSAxMi4wOSA2Ljg0OSAxMi4wNjMgQyA2LjgyMiAxMi4wMzcgNi43OTkgMTIuMDA4IDYuNzc4IDExLjk3NyBDIDYuNzU3IDExLjk0NiA2LjczOSAxMS45MTMgNi43MjUgMTEuODc4IEMgNi43MSAxMS44NDQgNi42OTggMTEuODA3IDYuNjkxIDExLjc2OSBDIDYuNjgzIDExLjczMSA2LjY3OSAxMS42OTIgNi42NzkgMTEuNjUyIFogTSA2LjY3OSAxMy45NzcgQyA2LjY3OSAxMy45MzcgNi42ODMgMTMuODk4IDYuNjkxIDEzLjg2IEMgNi42OTkgMTMuODIzIDYuNzEgMTMuNzg2IDYuNzI1IDEzLjc1MSBDIDYuNzQgMTMuNzE2IDYuNzU4IDEzLjY4MyA2Ljc3OCAxMy42NTIgQyA2Ljc5OSAxMy42MjEgNi44MjMgMTMuNTkzIDYuODQ5IDEzLjU2NiBDIDYuODc2IDEzLjU0IDYuOTA0IDEzLjUxNiA2LjkzNSAxMy40OTUgQyA2Ljk2NiAxMy40NzUgNi45OTkgMTMuNDU3IDcuMDM0IDEzLjQ0MiBDIDcuMDY5IDEzLjQyNyA3LjEwNSAxMy40MTYgNy4xNDMgMTMuNDA4IEMgNy4xODEgMTMuNCA3LjIyIDEzLjM5NiA3LjI2IDEzLjM5NiBMIDcuNTUxIDEzLjM5NiBMIDcuODQxIDEzLjM5NiBMIDguMTMyIDEzLjM5NiBMIDguNDIyIDEzLjM5NiBMIDguNzEzIDEzLjM5NiBMIDkuMDAzIDEzLjM5NiBMIDkuMjk0IDEzLjM5NiBMIDkuNTg1IDEzLjM5NiBDIDkuNjQxIDEzLjM5NiA5LjY5NCAxMy40MDQgOS43NDQgMTMuNDE4IEMgOS43OTQgMTMuNDMyIDkuODQxIDEzLjQ1MiA5Ljg4NCAxMy40NzggQyA5LjkyNyAxMy41MDQgOS45NjYgMTMuNTM1IDEwIDEzLjU3IEMgMTAuMDM0IDEzLjYwNSAxMC4wNjQgMTMuNjQ0IDEwLjA4OCAxMy42ODYgQyAxMC4xMTIgMTMuNzI5IDEwLjEzMiAxMy43NzQgMTAuMTQ1IDEzLjgyMSBDIDEwLjE1OCAxMy44NjkgMTAuMTY2IDEzLjkxOCAxMC4xNjcgMTMuOTY4IEMgMTAuMTY3IDE0LjAxOCAxMC4xNjIgMTQuMDY5IDEwLjE0OSAxNC4xMTkgQyAxMC4xMzYgMTQuMTcgMTAuMTE2IDE0LjIyIDEwLjA4OCAxNC4yNjggQyAxMC4wNzUgMTQuMjkxIDEwLjA2MSAxNC4zMTIgMTAuMDQ1IDE0LjMzMiBDIDEwLjAzIDE0LjM1MiAxMC4wMTMgMTQuMzcxIDkuOTk1IDE0LjM4OSBDIDkuOTc3IDE0LjQwNyA5Ljk1OCAxNC40MjMgOS45MzggMTQuNDM4IEMgOS45MTggMTQuNDU0IDkuODk4IDE0LjQ2OCA5Ljg3NiAxNC40OCBDIDkuODU0IDE0LjQ5MyA5LjgzMiAxNC41MDQgOS44MDggMTQuNTE0IEMgOS43ODUgMTQuNTIzIDkuNzYyIDE0LjUzMiA5LjczNyAxNC41MzggQyA5LjcxMyAxNC41NDUgOS42ODggMTQuNTUgOS42NjIgMTQuNTUzIEMgOS42MzcgMTQuNTU2IDkuNjExIDE0LjU1OCA5LjU4NSAxNC41NTggTCA5LjI5NCAxNC41NTggTCA5LjAwMyAxNC41NTggTCA4LjcxMyAxNC41NTggTCA4LjQyMiAxNC41NTggTCA4LjEzMiAxNC41NTggTCA3Ljg0MSAxNC41NTggTCA3LjU1MSAxNC41NTggTCA3LjI2IDE0LjU1OCBDIDcuMjIgMTQuNTU4IDcuMTggMTQuNTU0IDcuMTQyIDE0LjU0NiBDIDcuMTA1IDE0LjUzOSA3LjA2OCAxNC41MjcgNy4wMzMgMTQuNTEyIEMgNi45OTkgMTQuNDk4IDYuOTY2IDE0LjQ4IDYuOTM1IDE0LjQ1OSBDIDYuOTA0IDE0LjQzOCA2Ljg3NSAxNC40MTUgNi44NDkgMTQuMzg4IEMgNi44MjMgMTQuMzYyIDYuNzk5IDE0LjMzMyA2Ljc3OCAxNC4zMDIgQyA2Ljc1NyAxNC4yNzEgNi43NCAxNC4yMzggNi43MjUgMTQuMjAzIEMgNi43MSAxNC4xNjkgNi42OTkgMTQuMTMyIDYuNjkxIDE0LjA5NCBDIDYuNjgzIDE0LjA1NiA2LjY3OSAxNC4wMTcgNi42NzkgMTMuOTc3IFoiIHN0eWxlPSIiLz4KICA8cGF0aCBkPSJNIDExLjkxIDAuNjEgTCAxMS4xMTEgMC42MSBMIDEwLjMxMiAwLjYxIEwgOS41MTMgMC42MSBMIDguNzE0IDAuNjEgTCA3LjkxNSAwLjYxIEwgNy4xMTYgMC42MSBMIDYuMzE3IDAuNjEgTCA1LjUxNyAwLjYxIEMgNS4zNTcgMC42MSA1LjIgMC42MjYgNS4wNDggMC42NTcgQyA0Ljg5NyAwLjY4OCA0Ljc1MSAwLjczNCA0LjYxMiAwLjc5MyBDIDQuNDczIDAuODUyIDQuMzQxIDAuOTI0IDQuMjE3IDEuMDA3IEMgNC4wOTQgMS4wOTEgMy45NzkgMS4xODYgMy44NzMgMS4yOTEgQyAzLjc2OCAxLjM5NiAzLjY3MyAxLjUxMSAzLjU4OSAxLjYzNSBDIDMuNTA1IDEuNzU4IDMuNDM0IDEuODkgMy4zNzUgMi4wMjkgQyAzLjMxNiAyLjE2OCAzLjI3IDIuMzE0IDMuMjM5IDIuNDY1IEMgMy4yMDggMi42MTcgMy4xOTIgMi43NzQgMy4xOTIgMi45MzQgTCAzLjE5MiA0LjY3OCBMIDMuMTkyIDYuNDIyIEwgMy4xOTIgOC4xNjYgTCAzLjE5MiA5LjkwOSBMIDMuMTkyIDExLjY1MyBMIDMuMTkyIDEzLjM5NiBMIDMuMTkyIDE1LjE0IEwgMy4xOTIgMTYuODgzIEMgMy4xOTIgMTcuMDQ0IDMuMjA4IDE3LjIgMy4yMzkgMTcuMzUyIEMgMy4yNyAxNy41MDMgMy4zMTYgMTcuNjQ5IDMuMzc1IDE3Ljc4OCBDIDMuNDM0IDE3LjkyNyAzLjUwNiAxOC4wNTkgMy41ODkgMTguMTgzIEMgMy42NzMgMTguMzA3IDMuNzY4IDE4LjQyMiAzLjg3MyAxOC41MjcgQyAzLjk3OSAxOC42MzMgNC4wOTQgMTguNzI4IDQuMjE3IDE4LjgxMSBDIDQuMzQxIDE4Ljg5NSA0LjQ3MyAxOC45NjcgNC42MTIgMTkuMDI1IEMgNC43NTEgMTkuMDg0IDQuODk3IDE5LjEzIDUuMDQ4IDE5LjE2MSBDIDUuMiAxOS4xOTIgNS4zNTcgMTkuMjA4IDUuNTE3IDE5LjIwOCBMIDYuNjggMTkuMjA4IEwgNy44NDIgMTkuMjA4IEwgOS4wMDUgMTkuMjA4IEwgMTAuMTY3IDE5LjIwOCBMIDExLjMzIDE5LjIwOCBMIDEyLjQ5MiAxOS4yMDggTCAxMy42NTQgMTkuMjA4IEwgMTQuODE2IDE5LjIwOCBDIDE0Ljk3NyAxOS4yMDggMTUuMTMzIDE5LjE5MiAxNS4yODUgMTkuMTYxIEMgMTUuNDM2IDE5LjEzIDE1LjU4MiAxOS4wODQgMTUuNzIxIDE5LjAyNSBDIDE1Ljg2IDE4Ljk2NyAxNS45OTIgMTguODk1IDE2LjExNiAxOC44MTEgQyAxNi4yNCAxOC43MjggMTYuMzU1IDE4LjYzMyAxNi40NiAxOC41MjcgQyAxNi41NjUgMTguNDIyIDE2LjY2MSAxOC4zMDcgMTYuNzQ0IDE4LjE4MyBDIDE2LjgyOCAxOC4wNTkgMTYuODk5IDE3LjkyNyAxNi45NTggMTcuNzg4IEMgMTcuMDE3IDE3LjY0OSAxNy4wNjMgMTcuNTAzIDE3LjA5NCAxNy4zNTIgQyAxNy4xMjUgMTcuMiAxNy4xNDEgMTcuMDQ0IDE3LjE0MSAxNi44ODMgTCAxNy4xNDEgMTUuNTAzIEwgMTcuMTQxIDE0LjEyMiBMIDE3LjE0MSAxMi43NDIgTCAxNy4xNDEgMTEuMzYyIEwgMTcuMTQxIDkuOTgyIEwgMTcuMTQxIDguNjAxIEwgMTcuMTQxIDcuMjIxIEwgMTcuMTQxIDUuODQgTCAxNi40ODcgNS4xODYgTCAxNS44MzMgNC41MzIgTCAxNS4xNzkgMy44NzkgTCAxNC41MjYgMy4yMjUgTCAxMy44NzIgMi41NzEgTCAxMy4yMTggMS45MTcgTCAxMi41NjQgMS4yNjQgWiBNIDExLjkxIDEuNzcyIEwgMTEuOTEgMi4wNjMgTCAxMS45MSAyLjM1NCBMIDExLjkxIDIuNjQ1IEwgMTEuOTEgMi45MzUgTCAxMS45MSAzLjIyNiBMIDExLjkxIDMuNTE2IEwgMTEuOTEgMy44MDcgTCAxMS45MSA0LjA5NyBDIDExLjkxIDQuMjE4IDExLjkyMiA0LjMzNSAxMS45NDYgNC40NDkgQyAxMS45NjkgNC41NjIgMTIuMDAzIDQuNjcyIDEyLjA0NyA0Ljc3NiBDIDEyLjA5MSA0Ljg4IDEyLjE0NSA0Ljk3OSAxMi4yMDggNS4wNzIgQyAxMi4yNzEgNS4xNjUgMTIuMzQyIDUuMjUxIDEyLjQyMSA1LjMzIEMgMTIuNSA1LjQwOSAxMi41ODYgNS40OCAxMi42NzkgNS41NDIgQyAxMi43NzIgNS42MDUgMTIuODcxIDUuNjU5IDEyLjk3NSA1LjcwMyBDIDEzLjA3OSA1Ljc0NyAxMy4xODkgNS43ODEgMTMuMzAyIDUuODA1IEMgMTMuNDE2IDUuODI4IDEzLjUzMyA1Ljg0IDEzLjY1MyA1Ljg0IEwgMTMuOTQ0IDUuODQgTCAxNC4yMzUgNS44NCBMIDE0LjUyNiA1Ljg0IEwgMTQuODE2IDUuODQgTCAxNS4xMDcgNS44NCBMIDE1LjM5NyA1Ljg0IEwgMTUuNjg4IDUuODQgTCAxNS45NzggNS44NCBMIDE1Ljk3OCA3LjIyIEwgMTUuOTc4IDguNiBMIDE1Ljk3OCA5Ljk4MSBMIDE1Ljk3OCAxMS4zNjEgTCAxNS45NzggMTIuNzQyIEwgMTUuOTc4IDE0LjEyMiBMIDE1Ljk3OCAxNS41MDMgTCAxNS45NzggMTYuODgzIEMgMTUuOTc4IDE2Ljk2MyAxNS45NyAxNy4wNDEgMTUuOTU1IDE3LjExNyBDIDE1LjkzOSAxNy4xOTMgMTUuOTE3IDE3LjI2NiAxNS44ODcgMTcuMzM1IEMgMTUuODU4IDE3LjQwNSAxNS44MjIgMTcuNDcxIDE1Ljc4IDE3LjUzMiBDIDE1LjczOCAxNy41OTQgMTUuNjkxIDE3LjY1MiAxNS42MzggMTcuNzA1IEMgMTUuNTg2IDE3Ljc1OCAxNS41MjggMTcuODA1IDE1LjQ2NiAxNy44NDcgQyAxNS40MDUgMTcuODg5IDE1LjMzOSAxNy45MjUgMTUuMjY5IDE3Ljk1NCBDIDE1LjIgMTcuOTgzIDE1LjEyNyAxOC4wMDYgMTUuMDUxIDE4LjAyMSBDIDE0Ljk3NSAxOC4wMzcgMTQuODk3IDE4LjA0NSAxNC44MTYgMTguMDQ1IEwgMTMuNjU0IDE4LjA0NSBMIDEyLjQ5MiAxOC4wNDUgTCAxMS4zMyAxOC4wNDUgTCAxMC4xNjcgMTguMDQ1IEwgOS4wMDUgMTguMDQ1IEwgNy44NDIgMTguMDQ1IEwgNi42OCAxOC4wNDUgTCA1LjUxNyAxOC4wNDUgQyA1LjQzNyAxOC4wNDUgNS4zNTkgMTguMDM3IDUuMjgzIDE4LjAyMSBDIDUuMjA3IDE4LjAwNiA1LjEzNCAxNy45ODMgNS4wNjQgMTcuOTU0IEMgNC45OTUgMTcuOTI1IDQuOTI5IDE3Ljg4OSA0Ljg2NyAxNy44NDcgQyA0LjgwNSAxNy44MDUgNC43NDggMTcuNzU4IDQuNjk1IDE3LjcwNSBDIDQuNjQzIDE3LjY1MiA0LjU5NSAxNy41OTQgNC41NTMgMTcuNTMyIEMgNC41MTEgMTcuNDcxIDQuNDc1IDE3LjQwNSA0LjQ0NSAxNy4zMzUgQyA0LjQxNiAxNy4yNjYgNC4zOTMgMTcuMTkzIDQuMzc4IDE3LjExNyBDIDQuMzYyIDE3LjA0MSA0LjM1NCAxNi45NjMgNC4zNTQgMTYuODgzIEwgNC4zNTQgMTUuMTM5IEwgNC4zNTQgMTMuMzk1IEwgNC4zNTQgMTEuNjUxIEwgNC4zNTQgOS45MDggTCA0LjM1NCA4LjE2NCBMIDQuMzU0IDYuNDIxIEwgNC4zNTQgNC42NzcgTCA0LjM1NCAyLjkzNCBDIDQuMzU0IDIuODUzIDQuMzYyIDIuNzc1IDQuMzc4IDIuNjk5IEMgNC4zOTMgMi42MjMgNC40MTYgMi41NSA0LjQ0NSAyLjQ4MSBDIDQuNDc1IDIuNDExIDQuNTExIDIuMzQ1IDQuNTUzIDIuMjg0IEMgNC41OTUgMi4yMjIgNC42NDMgMi4xNjQgNC42OTUgMi4xMTIgQyA0Ljc0OCAyLjA1OSA0LjgwNSAyLjAxMiA0Ljg2NyAxLjk3IEMgNC45MjkgMS45MjggNC45OTUgMS44OTIgNS4wNjQgMS44NjMgQyA1LjEzNCAxLjgzMyA1LjIwNyAxLjgxMSA1LjI4MyAxLjc5NSBDIDUuMzU5IDEuNzggNS40MzcgMS43NzIgNS41MTcgMS43NzIgTCA2LjMxNyAxLjc3MiBMIDcuMTE2IDEuNzcyIEwgNy45MTUgMS43NzIgTCA4LjcxNCAxLjc3MiBMIDkuNTEzIDEuNzcyIEwgMTAuMzEyIDEuNzcyIEwgMTEuMTExIDEuNzcyIFoiIHN0eWxlPSIiLz4KPC9zdmc+"
    }]);
};
// 链接右键菜单 End ==============================================================
// 图片右键菜单 Start ============================================================
// 复制图片
new function () {
    var groupMenu = GroupMenu({
        id: 'context-copy-image',
        class: 'showFirstText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '复制图片...' : 'Copy image...',
        condition: 'image',
        insertBefore: 'context-copyimage-contents'
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '复制图片' : 'Copy image',
        oncommand: 'document.getElementById("context-copyimage-contents").doCommand();',
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICA8cGF0aCBzdHlsZT0iZmlsbDpjb250ZXh0LWZpbGw7ZmlsbC1vcGFjaXR5OmNvbnRleHQtZmlsbC1vcGFjaXR5IiBkPSJNNiAwYTIgMiAwIDAgMC0yIDJ2LjVhLjUuNSAwIDAgMCAxIDBWMmExIDEgMCAwIDEgMS0xaC41YS41LjUgMCAwIDAgMC0xSDZ6bTIuNSAwYS41LjUgMCAwIDAgMCAxaDNhLjUuNSAwIDAgMCAwLTFoLTN6bTUgMGEuNS41IDAgMCAwIDAgMWguNWExIDEgMCAwIDEgMSAxdi41YS41LjUgMCAwIDAgMSAwVjJhMiAyIDAgMCAwLTItMmgtLjV6TTIgNGEyIDIgMCAwIDAtMiAydjYuNUEzLjUgMy41IDAgMCAwIDMuNSAxNkgxMGEyIDIgMCAwIDAgMi0ydi0xaC0xdjFhMSAxIDAgMCAxLTEgMUgzLjVBMi41IDIuNSAwIDAgMSAxIDEyLjVWNmExIDEgMCAwIDEgMS0xaDFWNEgyem0yLjUgMGEuNS41IDAgMCAwLS41LjV2M2EuNS41IDAgMCAwIDEgMHYtM2EuNS41IDAgMCAwLS41LS41em0xMSAwYS41LjUgMCAwIDAtLjUuNXYzYS41LjUgMCAwIDAgMSAwdi0zYS41LjUgMCAwIDAtLjUtLjV6bS0xMSA1YS41LjUgMCAwIDAtLjUuNXYuNWEyIDIgMCAwIDAgMiAyaC41YS41LjUgMCAwIDAgMC0xSDZhMSAxIDAgMCAxLTEtMXYtLjVhLjUuNSAwIDAgMC0uNS0uNXptMTEgMGEuNS41IDAgMCAwLS41LjV2LjVhMSAxIDAgMCAxLTEgMWgtLjVhLjUuNSAwIDAgMCAwIDFoLjVhMiAyIDAgMCAwIDItMnYtLjVhLjUuNSAwIDAgMC0uNS0uNXptLTcgMmEuNS41IDAgMCAwIDAgMWgzYS41LjUgMCAwIDAgMC0xaC0zeiIvPgo8L3N2Zz4K"
    }, {
        label: '图片链接',
        text: '%IMAGE_URL%',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJjb250ZXh0LWZpbGwiIGZpbGwtb3BhY2l0eT0iY29udGV4dC1maWxsLW9wYWNpdHkiPgogIDxwYXRoIGQ9Ik02IDdDMy4yMzkgNyAxIDkuMjM5IDEgMTJDMSAxNC43NjEgMy4yMzkgMTcgNiAxN0wxMCAxN0wxMCAxNUw2IDE1QzQuMzQzIDE1IDMgMTMuNjU3IDMgMTJDMyAxMC4zNDMgNC4zNDMgOSA2IDlMMTAgOUwxMCA3TDYgNyB6IE0gMTQgN0wxNCA5TDE4IDlDMTkuNjU3IDkgMjEgMTAuMzQzIDIxIDEyQzIxIDEzLjY1NyAxOS42NTcgMTUgMTggMTVMMTQgMTVMMTQgMTdMMTggMTdDMjAuNzYxIDE3IDIzIDE0Ljc2MSAyMyAxMkMyMyA5LjIzOSAyMC43NjEgNyAxOCA3TDE0IDcgeiBNIDcgMTFMNyAxM0wxNyAxM0wxNyAxMUw3IDExIHoiIC8+Cjwvc3ZnPg=="
    }, {
        label: '复制图像base64',
        text: "%IMAGE_BASE64%",
        condition: "image",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTUgNUw1IDI3TDI3IDI3TDI3IDUgWiBNIDcgN0wyNSA3TDI1IDI1TDcgMjUgWiBNIDEzLjIxODc1IDExLjkzNzVMMTEuMDMxMjUgMTQuNDY4NzVDMTAuMzc1IDE1LjIyMjY1NiAxMCAxNi4xODc1IDEwIDE3LjE4NzVMMTAgMTcuNUMxMCAxOC44NjcxODggMTEuMTMyODEzIDIwIDEyLjUgMjBMMTMuNSAyMEMxNC44NjcxODggMjAgMTYgMTguODY3MTg4IDE2IDE3LjVDMTYgMTYuMTMyODEzIDE0Ljg2NzE4OCAxNSAxMy41IDE1TDEzLjIxODc1IDE1TDE0LjcxODc1IDEzLjI1IFogTSAyMCAxMkwyMCAxNUwxOSAxNUwxOSAxMi4wMzEyNUwxNyAxMi4wMzEyNUwxNyAxN0wyMCAxN0wyMCAyMEwyMiAyMEwyMiAxMiBaIE0gMTIuMDYyNSAxN0wxMy41IDE3QzEzLjc4NTE1NiAxNyAxNCAxNy4yMTQ4NDQgMTQgMTcuNUMxNCAxNy43ODUxNTYgMTMuNzg1MTU2IDE4IDEzLjUgMThMMTIuNSAxOEMxMi4yMTQ4NDQgMTggMTIgMTcuNzg1MTU2IDEyIDE3LjVMMTIgMTcuMTg3NUMxMiAxNy4xMjEwOTQgMTIuMDU0Njg4IDE3LjA2NjQwNiAxMi4wNjI1IDE3WiIgLz4NCjwvc3ZnPg=="
    }]);
    css("#context-copyimage-contents, #context-copyimage { display: none }");
};

// 打开图片
new function () {
    var groupMenu = GroupMenu({
        id: 'context-view-image',
        class: 'showText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '新标签打开图片...' : 'View image in new tab',
        condition: 'image',
        insertBefore: 'context-viewimage'
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '打开图片' : 'View image in new tab',
        oncommand: "gContextMenu.viewMedia(event);",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0xMy41MjQgMi4yODZBMi40NzYgMi40NzYgMCAwIDEgMTYgNC43NjJ2OC43NjJBMi40NzcgMi40NzcgMCAwIDEgMTMuNTI0IDE2SDQuNzYyYTIuNDc2IDIuNDc2IDAgMCAxLTIuNDc2LTIuNDc2VjguNzYzYy4zNjEuMTUxLjc0NC4yNiAxLjE0My4zMjJ2NC40MzljMCAuMTU5LjAyNy4zMTEuMDc4LjQ1Mmw0LjQzNi00LjM0M2ExLjcxNCAxLjcxNCAwIDAgMSAyLjMwMS0uMDg5bC4wOTguMDg5IDQuNDM2IDQuMzQ0Yy4wNTEtLjE0Mi4wNzktLjI5NC4wNzktLjQ1M1Y0Ljc2MmMwLS43MzYtLjU5Ny0xLjMzMy0xLjMzMy0xLjMzM0g5LjA4NWE0LjkxNiA0LjkxNiAwIDAgMC0uMzIyLTEuMTQzaDQuNzYxWm0tNC43MTcgOC4xMDktLjA2NC4wNTQtNC40MjQgNC4zMzNjLjEzOC4wNDkuMjg4LjA3NS40NDMuMDc1aDguNzYyYy4xNTUgMCAuMzA0LS4wMjYuNDQyLS4wNzVsLTQuNDIzLTQuMzMzYS41NzQuNTc0IDAgMCAwLS43MzYtLjA1NFptMi44MTQtNS40NDNhMS43MTcgMS43MTcgMCAxIDEtLjAwMiAzLjQzNCAxLjcxNyAxLjcxNyAwIDAgMSAuMDAyLTMuNDM0Wk00LjE5IDBhNC4xOSA0LjE5IDAgMSAxIC4wMDEgOC4zOEE0LjE5IDQuMTkgMCAwIDEgNC4xOSAwWm03LjQzMSA2LjA5NWEuNTczLjU3MyAwIDEgMCAwIDEuMTQ2LjU3My41NzMgMCAwIDAgMC0xLjE0NlpNNC4xOSAxLjUyM2wtLjA2OC4wMDZhLjM4MS4zODEgMCAwIDAtLjMwNi4zMDdsLS4wMDYuMDY4LS4wMDEgMS45MDUtMS45MDYuMDAxLS4wNjkuMDA2YS4zOC4zOCAwIDAgMC0uMzA2LjMwNmwtLjAwNi4wNjguMDA2LjA2OWEuMzgxLjM4MSAwIDAgMCAuMzA2LjMwNmwuMDY5LjAwNkgzLjgxdjEuOTA4bC4wMDcuMDY4Yy4wMjguMTU2LjE1LjI3OC4zMDYuMzA3bC4wNjguMDA2LjA2OS0uMDA2YS4zODIuMzgyIDAgMCAwIC4zMDYtLjMwN2wuMDA2LS4wNjhWNC41NzFINi40OGwuMDY4LS4wMDZhLjM4LjM4IDAgMCAwIC4zMDYtLjMwNmwuMDA3LS4wNjktLjAwNy0uMDY4YS4zNzkuMzc5IDAgMCAwLS4zMDYtLjMwNkw2LjQ4IDMuODFsLTEuOTA5LS4wMDFWMS45MDRsLS4wMDYtLjA2OGEuMzgyLjM4MiAwIDAgMC0uMzA2LS4zMDdsLS4wNjktLjAwNloiLz4KPC9zdmc+Cg=="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '发送图片' : 'Send image by email',
        oncommand: 'gContextMenu.sendMedia();',
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTAuMDAzOTA2MjUgM0wwLjAwMzkwNjI1IDM1TDIgMzVMMiA1TDQ1IDVMNDUgMyBaIE0gNCA3TDQgMzlMMjcgMzlMMjcgMzdMNiAzN0w2IDM0Ljk4MDQ2OUwxOC44MDg1OTQgMjQuODUxNTYzQzE5Ljg0Mzc1IDI1Ljc1NzgxMyAyMS43NTc4MTMgMjcuNDIxODc1IDIyIDI3LjYzMjgxM0MyMy41MjM0MzggMjguOTYwOTM4IDI1LjE0MDYyNSAyOS4yOTY4NzUgMjYuMTc1NzgxIDI5LjI5Njg3NUMyNy4yMTA5MzggMjkuMjk2ODc1IDI4LjgyODEyNSAyOC45NjA5MzggMzAuMzU1NDY5IDI3LjYzMjgxM0MzMS41MzkwNjMgMjYuNjAxNTYzIDQzLjE3OTY4OCAxNi40NTMxMjUgNDYgMTMuOTk2MDk0TDQ2IDMxTDQ4IDMzTDQ4IDcgWiBNIDYgOUw0NiA5TDQ2IDExLjM0Mzc1QzQ0Ljk2NDg0NCAxMi4yNDYwOTQgMzAuMzEyNSAyNS4wMTk1MzEgMjkuMDQyOTY5IDI2LjEyNUMyNy45MjE4NzUgMjcuMTAxNTYzIDI2Ljc4MTI1IDI3LjI5Njg3NSAyNi4xNzU3ODEgMjcuMjk2ODc1QzI1LjU3MDMxMyAyNy4yOTY4NzUgMjQuNDMzNTk0IDI3LjA5NzY1NiAyMy4zMTI1IDI2LjEyNUMyMi4wMDc4MTMgMjQuOTg4MjgxIDYuNDQxNDA2IDExLjQyMTg3NSA2IDExLjAzNTE1NiBaIE0gNiAxMy42ODc1QzcuNjk1MzEzIDE1LjE2Nzk2OSAxMi43MTg3NSAxOS41NDY4NzUgMTcuMjczNDM4IDIzLjUxNTYyNUw2IDMyLjQyOTY4OCBaIE0gMzkuOTg4MjgxIDI5Ljk4ODI4MUMzOS41ODIwMzEgMjkuOTkyMTg4IDM5LjIxODc1IDMwLjIzODI4MSAzOS4wNjI1IDMwLjYxMzI4MUMzOC45MTAxNTYgMzAuOTkyMTg4IDM5IDMxLjQyMTg3NSAzOS4yOTI5NjkgMzEuNzA3MDMxTDQ0LjU4NTkzOCAzN0wzMSAzN0wzMSAzOUw0NC41ODU5MzggMzlMMzkuMjkyOTY5IDQ0LjI5Mjk2OUMzOS4wMzEyNSA0NC41NDI5NjkgMzguOTI1NzgxIDQ0LjkxNzk2OSAzOS4wMTk1MzEgNDUuMjY1NjI1QzM5LjEwOTM3NSA0NS42MTcxODggMzkuMzgyODEzIDQ1Ljg5MDYyNSAzOS43MzQzNzUgNDUuOTgwNDY5QzQwLjA4MjAzMSA0Ni4wNzQyMTkgNDAuNDU3MDMxIDQ1Ljk2ODc1IDQwLjcwNzAzMSA0NS43MDcwMzFMNDguNDE0MDYzIDM4TDQwLjcwNzAzMSAzMC4yOTI5NjlDNDAuNTE5NTMxIDMwLjA5NzY1NiA0MC4yNjE3MTkgMjkuOTkyMTg4IDM5Ljk4ODI4MSAyOS45ODgyODFaIiAvPg0KPC9zdmc+"
    }]);
    css("#context-viewimage, #context-sendimage { display: none }");
};

// 保存图片
new function () {
    var groupMenu = GroupMenu({
        id: 'context-save-image',
        class: 'showText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '保存图片...' : 'Save image...',
        condition: 'image',
        insertBefore: 'context-saveimage'
    });
    groupMenu([{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '保存图片' : 'Save image',
        oncommand: 'gContextMenu.saveMedia();',
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMS40MDQgMy45NDggQyAxLjQwNCAzLjIxMiAxLjcwMiAyLjU0NSAyLjE4NSAyLjA2MyBDIDIuNjY3IDEuNTggMy4zMzQgMS4yODIgNC4wNyAxLjI4MiBMIDguODk5IDEuMjgyIEwgMTMuNzI4IDEuMjgyIEMgMTQuMTQ2IDEuMjgyIDE0LjU1NSAxLjM2NSAxNC45MzQgMS41MjIgQyAxNS4zMTMgMS42NzggMTUuNjYxIDEuOTA5IDE1Ljk1NyAyLjIwNSBMIDE2Ljk0MyAzLjE5MSBMIDE3LjkyOSA0LjE3NyBDIDE4LjIyNSA0LjQ3MyAxOC40NTYgNC44MjEgMTguNjEzIDUuMiBDIDE4Ljc2OSA1LjU3OSAxOC44NTIgNS45ODggMTguODUyIDYuNDA2IEwgMTguODUyIDExLjIzNSBMIDE4Ljg1MiAxNi4wNjQgQyAxOC44NTIgMTYuODAxIDE4LjU1NCAxNy40NjcgMTguMDcxIDE3Ljk0OSBDIDE3LjU4OSAxOC40MzIgMTYuOTIyIDE4LjczIDE2LjE4NiAxOC43MyBMIDEwLjEyOCAxOC43MyBMIDQuMDcgMTguNzMgQyAzLjMzNCAxOC43MyAyLjY2NyAxOC40MzIgMi4xODUgMTcuOTQ5IEMgMS43MDIgMTcuNDY3IDEuNDA0IDE2LjggMS40MDQgMTYuMDY0IEwgMS40MDQgMTAuMDA2IFogTSA0LjA3IDIuNzM2IEMgMy43MzYgMi43MzYgMy40MzMgMi44NzIgMy4yMTMgMy4wOTEgQyAyLjk5NCAzLjMxMSAyLjg1OCAzLjYxNCAyLjg1OCAzLjk0OCBMIDIuODU4IDEwLjAwNiBMIDIuODU4IDE2LjA2NCBDIDIuODU4IDE2LjM5OSAyLjk5NCAxNi43MDIgMy4yMTMgMTYuOTIxIEMgMy40MzMgMTcuMTQgMy43MzYgMTcuMjc2IDQuMDcgMTcuMjc2IEwgNC4xOTEgMTcuMjc2IEwgNC4zMTIgMTcuMjc2IEwgNC4zMTIgMTQuNzMyIEwgNC4zMTIgMTIuMTg3IEMgNC4zMTIgMTEuNTg1IDQuNTU2IDExLjAzOSA0Ljk1MSAxMC42NDUgQyA1LjM0NSAxMC4yNSA1Ljg5MSAxMC4wMDYgNi40OTMgMTAuMDA2IEwgMTAuMTI4IDEwLjAwNiBMIDEzLjc2MyAxMC4wMDYgQyAxNC4zNjYgMTAuMDA2IDE0LjkxMSAxMC4yNSAxNS4zMDUgMTAuNjQ1IEMgMTUuNyAxMS4wMzkgMTUuOTQ0IDExLjU4NSAxNS45NDQgMTIuMTg3IEwgMTUuOTQ0IDE0LjczMiBMIDE1Ljk0NCAxNy4yNzYgTCAxNi4wNjUgMTcuMjc2IEwgMTYuMTg2IDE3LjI3NiBDIDE2LjUyMSAxNy4yNzYgMTYuODI0IDE3LjE0IDE3LjA0MyAxNi45MjEgQyAxNy4yNjIgMTYuNzAyIDE3LjM5OCAxNi4zOTkgMTcuMzk4IDE2LjA2NCBMIDE3LjM5OCAxMS4yMzUgTCAxNy4zOTggNi40MDYgQyAxNy4zOTggNi4xODEgMTcuMzU0IDUuOTYgMTcuMjY5IDUuNzU2IEMgMTcuMTg1IDUuNTUyIDE3LjA2MSA1LjM2NSAxNi45MDEgNS4yMDYgTCAxNS45MTUgNC4yMiBMIDE0LjkyOCAzLjIzMyBDIDE0LjgwMyAzLjEwOCAxNC42NiAzLjAwMyAxNC41MDQgMi45MjMgQyAxNC4zNDggMi44NDMgMTQuMTggMi43ODcgMTQuMDA1IDIuNzU4IEwgMTQuMDA1IDQuMDggTCAxNC4wMDUgNS40MDIgQyAxNC4wMDUgNi4wMDQgMTMuNzYxIDYuNTQ5IDEzLjM2NiA2Ljk0NCBDIDEyLjk3MiA3LjMzOSAxMi40MjcgNy41ODMgMTEuODI0IDcuNTgzIEwgOS42NDMgNy41ODMgTCA3LjQ2MiA3LjU4MyBDIDYuODYgNy41ODMgNi4zMTQgNy4zMzkgNS45MiA2Ljk0NCBDIDUuNTI1IDYuNTQ5IDUuMjgxIDYuMDA0IDUuMjgxIDUuNDAyIEwgNS4yODEgNC4wNjkgTCA1LjI4MSAyLjczNiBMIDQuNjc2IDIuNzM2IFogTSAxNC40OSAxNy4yNzYgTCAxNC40OSAxNC43MzIgTCAxNC40OSAxMi4xODcgQyAxNC40OSAxMS45ODcgMTQuNDA5IDExLjgwNSAxNC4yNzcgMTEuNjczIEMgMTQuMTQ1IDExLjU0MiAxMy45NjQgMTEuNDYgMTMuNzYzIDExLjQ2IEwgMTAuMTI4IDExLjQ2IEwgNi40OTMgMTEuNDYgQyA2LjI5MyAxMS40NiA2LjExMSAxMS41NDIgNS45NzkgMTEuNjczIEMgNS44NDggMTEuODA1IDUuNzY2IDExLjk4NyA1Ljc2NiAxMi4xODcgTCA1Ljc2NiAxNC43MzIgTCA1Ljc2NiAxNy4yNzYgTCAxMC4xMjggMTcuMjc2IFogTSA2LjczNSAyLjczNiBMIDYuNzM1IDQuMDY5IEwgNi43MzUgNS40MDIgQyA2LjczNSA1LjYwMyA2LjgxNyA1Ljc4NCA2Ljk0OCA1LjkxNiBDIDcuMDggNi4wNDcgNy4yNjIgNi4xMjkgNy40NjIgNi4xMjkgTCA5LjY0MyA2LjEyOSBMIDExLjgyNCA2LjEyOSBDIDEyLjAyNSA2LjEyOSAxMi4yMDcgNi4wNDcgMTIuMzM4IDUuOTE2IEMgMTIuNDcgNS43ODQgMTIuNTUxIDUuNjAzIDEyLjU1MSA1LjQwMiBMIDEyLjU1MSA0LjA2OSBMIDEyLjU1MSAyLjczNiBMIDkuNjQzIDIuNzM2IFoiIHN0eWxlPSIiLz4KPC9zdmc+"
    }, {
        label: '设为背景',
        oncommand: 'gContextMenu.setDesktopBackground();',
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0xMi4yODYgNS4zMjFhMS42MDggMS42MDggMCAxIDEtMy4yMTYgMCAxLjYwOCAxLjYwOCAwIDAgMSAzLjIxNiAwWm0tMS4wNzIgMGEuNTM2LjUzNiAwIDEgMC0xLjA3MS4wMDEuNTM2LjUzNiAwIDAgMCAxLjA3MS0uMDAxWk0uNSAzLjcxNEEzLjIxNCAzLjIxNCAwIDAgMSAzLjcxNC41aDguNTcyQTMuMjE0IDMuMjE0IDAgMCAxIDE1LjUgMy43MTR2OC41NzJhMy4yMTQgMy4yMTQgMCAwIDEtMy4yMTQgMy4yMTRIMy43MTRBMy4yMTQgMy4yMTQgMCAwIDEgLjUgMTIuMjg2VjMuNzE0Wm0zLjIxNC0yLjE0M2MtMS4xODMgMC0yLjE0My45Ni0yLjE0MyAyLjE0M3Y4LjU3MmMwIC4zOTkuMTEuNzczLjMgMS4wOTNsNS4wMDMtNC45MTZhMS42MDUgMS42MDUgMCAwIDEgMi4yNTIgMGw1LjAwMyA0LjkxNmMuMTktLjMyLjMtLjY5NC4zLTEuMDkzVjMuNzE0YzAtMS4xODMtLjk2LTIuMTQzLTIuMTQzLTIuMTQzSDMuNzE0Wm0wIDEyLjg1OGg4LjU3MmMuMzk1IDAgLjc2Ni0uMTA4IDEuMDg0LS4yOTRMOC4zNzUgOS4yMjdhLjUzNC41MzQgMCAwIDAtLjc1IDBMMi42MyAxNC4xMzVjLjMxOC4xODYuNjg5LjI5NCAxLjA4NC4yOTRaIi8+Cjwvc3ZnPgo="
    }]);
    css("#context-saveimage, #context-setDesktopBackground, #context-sep-setbackground { display: none }");
};
// 搜索图片
new function () {
    var items = [{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "以图搜图..." : "Search image...",
        image: "chrome://global/skin/icons/search-glass.svg",
        onclick: function () {
            this.nextSibling.click();
        }
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '谷歌搜图' : 'Google',
        where: 'tab',
        condition: 'image',
        url: "https://www.google.com/searchbyimage?safe=off&image_url=%IMAGE_URL%",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA0OCA0OCI+DQogIDxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCiAgPHBhdGggZmlsbD0iI0ZGM0QwMCIgZD0iTTYuMzA2LDE0LjY5MWw2LjU3MSw0LjgxOUMxNC42NTUsMTUuMTA4LDE4Ljk2MSwxMiwyNCwxMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzE2LjMxOCw0LDkuNjU2LDguMzM3LDYuMzA2LDE0LjY5MXoiIC8+DQogIDxwYXRoIGZpbGw9IiM0Q0FGNTAiIGQ9Ik0yNCw0NGM1LjE2NiwwLDkuODYtMS45NzcsMTMuNDA5LTUuMTkybC02LjE5LTUuMjM4QzI5LjIxMSwzNS4wOTEsMjYuNzE1LDM2LDI0LDM2Yy01LjIwMiwwLTkuNjE5LTMuMzE3LTExLjI4My03Ljk0NmwtNi41MjIsNS4wMjVDOS41MDUsMzkuNTU2LDE2LjIyNyw0NCwyNCw0NHoiIC8+DQogIDxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCjwvc3ZnPg=="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? 'Yandex搜图' : 'Yandex',
        where: 'tab',
        condition: 'image',
        url: "https://yandex.com/images/search?source=collections&&url=%IMAGE_URL%&rpt=imageview",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABI0lEQVQ4jZ3OvUrDYBjF8f8m6FbBltJakyZv0i9BXBxcnJ3ES3DyAoRugkWr96Gbm1chuLgVFxGkWhDphxbSkhyXClJoTfOOz/uc33Mg5htanMhDcqjPXBrb7Mrn8BFWpv8iw3NURG8ZKjOB0KUhH3WzHP2dBzlqKqGRzc3cmu0s6zIoMtxPNWvKIBXYmwsAvFrcqYT6S3i/Mxm6nxZf/4YBnjLsq4YGBc4A6stsq4w+HJqxgMnFYduhB9DJcKkyeljFjw28p2mogkYpdrRBa+zRih0G6KSxQ4Pk8iIPDdY4XggA+Ha4lUHy6fVypBYG+mscqIyCHNcLhwGCPFX5KMhzkQyw2IwcJMN5YkAuCosJgVGBrQlwlaxBkapcFNqcztv7Ae/0dba36CN6AAAAAElFTkSuQmCC"
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? 'TinEye搜图' : 'TinEye',
        where: 'tab',
        condition: 'image',
        url: "https://www.tineye.com/search?url=%IMAGE_URL%",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADf0lEQVQ4jT2RbUwUBBjHn+acfWGSWq7SUVMqWyhTzMQXQsEOmAUKGF0SwiYOEZ3BiW53vpzjDjkUhPOQE8vLHJokUKJFCXqE2A3Hi8QQwdU8xDljPPXBqfnrg3XP9v/2//+23x65fvehP7rcp/MOdGrUoWtqcLTqygMtGufs1KRTfk36+o4meoY1yTOsq78c1ujKHp1raVbDQa/231W/fOZup37HB1wqjCKm9AqL7O2sqh4gofIa8z61EBKVyisLDUwNjyVk7mLW7Khga90gi+xXWVvdhWQWHVO2C5olxFnrSDj1gNSqDiQ4FBEJZJII6Wvfx2h3kuOqJa+ylgznRZV4V5emGz9mZfIG1p/2Y7l0h5SEpSSKsG2+YF09k6Npb1JnXUf5KBT0PyX30gBp7gbS9pepxNcM6vQsN2HGvey/0MMn9dc50niWgTobbVe+peHHelwnqjHu3MOqvN1sspWTe8CJ6VwbW5p6VeKrujU8180K4yZsvfcxX/QRsX4rz0fEMzk0gqDprxH00kzytptYsnABIsIEEVJ3FlEygsryYq+mHL5MfsOvZNac4+VpU7CY8tm9d1/A32xz8P+9PicMESFpl53SUVQi7a26ocbHkaGHyAsv8uq0KYGyw3kUEeEXXyc9XV08ffKYZu9VRISYtAwOP0DFcLRPI3PKyKjwMCHkLdasTmC/rRjPF8cBEHmOAvMeNuduZrC/j38g8JUC92kVQ6VPF+efZMvJZgyFNkSE2NhYhvp6/wM80zjfdJFHOkbepmxEhIlBwSSb9qnElLTqckcHpsZh3LfGmZOaxbKERBov/EB65sYAYPaCSIyFVsKSs/iwyIW1cwTnCCqrSr26wnGFaFsLu74bwHMPCpq7iS3xEFNUw8azbWy50E12Uzc5LTepHoczT8Dy0++EJW17Bogra2N58WUizM2kHPLy+Te9mL2jOIagyg+Vtx5R8dvfWFtuk+NqYtm6rYgEs2SCqCyxt6rhoJdoeyvJNT7SartZf6KDbIuDmIXhhMwOJ+y9aGbMepugaTMDSktFaKirUvmoop2Q/POYfh7ixN1xvhoZ48jQGPbO25jtFkJFEJnI9CmTA+OpIpQXplJ6H+TGH2P+xKp2zazv1rzvb+i+9mE9NjCqzpt/quMv9PiZYxo3Y5LOnf+uzpr9hoZMFC1Ofkdd/fd08DH+fwH9MmqFwCCktQAAAABJRU5ErkJggg==",
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '解析二维码' : 'Parse QR code',
        where: 'tab',
        condition: 'image',
        url: "https://zxing.org/w/decode?u=%IMAGE_URL%",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAHOUlEQVRYhb2XS0xT2xrHFwGDidFEAxMIAwfiQGOMjnyAr0gcmHDPQBM9MTExKviIRnRAAhqVEyImngmkEoOCkUSDGOUmwLFG8QH4aC3t3qUtbSl9QEtLA7ZFpAV+d1C6LQrqfZy7m1+/tf7f/1vrS/bOfgiRdABHme+YmQ0zM7NxVlIGMDM7SP6PxxnlxwwwNXVUzHdMT0/z/2TO5rHYFLFYjNhUjKlYjMR8aiqOMo8l8j9g6uv4q3fqO89ULBZvIhqNHo1Go/ydvH79mpaWFp4/f050cjI5d1R8+fKFnzP5C57vefXqFQMDA6xZswYhBEIIXr16leyJiYmJCf5TPk9MMDHxeTZOMPE5Hv2BAJ2dnQgh8Pv9rFu3Tmng8ePHiv/z5wnE+Pg4/0tcLhfj4+NYLBalAZ1Ox5s3bzh16hR5eXn4fD7FL8KRCJFIhEg4OYYJRyKEw/F5OBwmEgkTCYeVeZwI4UiYSCQenU4njx494tKlS0oDw/5hzp8/z/79+ykqKkKlUtHR0aHUi1AoRDKfPn1CkiT++KOCzZs3sXbtWjZv3kxvby/Pnj3D7/fzbU0oFMLpdNLZ2UllZSX5+flKAyUlJRQXF5Obm8vhw4exWCxcuHABl8tFKBRCfBobY2yWYDDI7du32b17N7t27ZpDIBDg5MmT1NfXMzg4iMvlwmKxcPfuXex2O42NjZSWlnLgwAHy8/Nxu91KbU9PDxUVFVRVVdHd3c2uXbtob29nbGwMMTo6SoKBgQFsNhvBYFC5CUajUWRZRpZlwuEwHo+HoaEhAKxWK0IIfD4fACdOnGDp0qXk5eUp9UajkVAoBMDIyAj9/f1Eo1FevnyJz+dDBINBgsEgGo2GoaEh1q9fT3V1tbKAw+FQruDW1lYOHTpEUVHRvA0AVFZWzmkgNTWVO3fuYLfbuXLlCps2bcLpdCKEoL6+HhEIjDAyMkJtba2yUXID09PTBINB0tPTEUJQUVFBWVkZQgiWL19OMBhUnhEHDx5U1kiQnZ2N3W4nEAhgNBpRqVRKrr29HeH3+/H7/ZSXl9PS0sKqVauUBp4+fUpubi65ubmkpKQghCAzM5OMjAyEEKSmpir53Nxcli1bRmFhIZ2dndy/f5+0tDQePHhAYg+/349er6e+vp6bN2/i9/sRPp8Pn8/HkydPCIfDNDU1IcsyAP39/ahUKlQqFYsWLeLUqVOoVCoKCwsRQrBkyRIln5OTgxCCY8eO8f79e/bs2UNJSQmJ9RdCeL1evF4vPp+PGzduYLPZAHjx4gVlZWUKx48f5+zZs3R2dvL06VPOnDlDUVERZWVlhMNhrl+/zurVq9mwYQP79u1DCMGjR4/wer14h7wMzUavNz4eGhrCO+RFDA4OotPpaGxs5MSJE1RVVdHU1MS5c+fYsWOHQiAQoLi4mKamJkwmEx0dHXg8Hnbs2EFdXR3Dw8NzroGVK1ficDgYHBz8IcLj8fDixQuysrL46692du/eTVZWFqWlpYyNjaHX67/j9OnTbNy4UTlVaWlpqNVqpYGMjAy6urpwu91JePC43Xg8Htxuj6ILs8nM6Ogo09PTaLVaACYnJ3G5XDQ3NyOEYMuWLVy9epXMzMw5V/iKFSuYnJxk8eLFcxo4fvw4LpfrlxDv3r2jtbWVbdu2sXfvXtRqNQ0NDTx7pqa5uZkVK1bQ3d3NwMAAFouF2tpaSkpKlNNlNBoxmUxEo1FCoRBlZWW0tbUxMDDwS4i+vj7evX2HRqPh5cuX7Ny5k7q6OkpKSsjOzubw4cM4HI4k+r+ZO3C73cp9Q6/Xf5d3OPpx9H+rxRF2ux273Y5erwegoaEBtVrNhw8fqKmpobm5mYRnIcrLy5EkCQCTyfRTfzLCZrNis1mRJIny8nLq6+uRjTLXrl2jvLycf7a0YLNZsVptWK2z0WadHVux2mwUFBSgVquZnp5Gp9PNem3YlJqE15qUi2uir6+Pvr4+LBYLeXl5VFdX09fXx6VLl9i+fTu3bt0i4VmIkydP0tHRQVdX10+93yLMFjNmsxmTycTw8DCybMRsNmMwGLBabTidTsxms4LFbMZsscSj2YzZYsbpdNLd/ZbLly/P8f4KwmQyYTKZ6DX2Mjw8jCRJJLSHDx/icDioq6tTtPlwu1wcOXKEvK15X/Xehf0mk4ne2SiMRiNGoxFZlhkcHOTevXsktI8fP2IwGMjJyeHt27eKnowsy6Snp9PQ0MC5c+fQ6XTz+hZCxF82JCRZwm63s3XrVnS6j8hSXG9rayMlJQWtVotW+xFJlpBkGVmSlBeVlpYWNBoNv/32DwoKCuK6lECKry/F6+IxrhkkKSYMBsNRg8GAwWBAo9FQU1ODVqsloRkMBv788wYajQaNRjNHT67TarVcvHiR338/OK9nAeLfiT09evQ9PfT06GfpUdDre5LmX3P6b7wL1f+IOd+HOp2O/5aP/4Z33i/k+Hn++0ne818wW8F9OkLXLgAAAABJRU5ErkJggg=="
    }];
    var menu = GroupMenu({
        id: 'addMenu-search-image',
        class: 'showFirstText',
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "以图搜图..." : "Search image...",
        condition: 'image',
    });
    menu(items);
};
// 图片右键菜单 End ==============================================================
// 文本右键菜单 Start ============================================================
// 搜索文本
new function () {
    var items = [{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '谷歌' : 'Google',
        where: 'tab',
        url: "https://www.google.com/search?&q=%s",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA0OCA0OCI+DQogIDxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCiAgPHBhdGggZmlsbD0iI0ZGM0QwMCIgZD0iTTYuMzA2LDE0LjY5MWw2LjU3MSw0LjgxOUMxNC42NTUsMTUuMTA4LDE4Ljk2MSwxMiwyNCwxMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzE2LjMxOCw0LDkuNjU2LDguMzM3LDYuMzA2LDE0LjY5MXoiIC8+DQogIDxwYXRoIGZpbGw9IiM0Q0FGNTAiIGQ9Ik0yNCw0NGM1LjE2NiwwLDkuODYtMS45NzcsMTMuNDA5LTUuMTkybC02LjE5LTUuMjM4QzI5LjIxMSwzNS4wOTEsMjYuNzE1LDM2LDI0LDM2Yy01LjIwMiwwLTkuNjE5LTMuMzE3LTExLjI4My03Ljk0NmwtNi41MjIsNS4wMjVDOS41MDUsMzkuNTU2LDE2LjIyNyw0NCwyNCw0NHoiIC8+DQogIDxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCjwvc3ZnPg=="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '百度搜索' : 'Baidu',
        where: 'tab',
        url: "https://www.baidu.com/baidu?wd=%s",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiI+DQogIDxwYXRoIGZpbGw9IiMxNTY1YzAiIGQ9Ik0zNi4wOTQgMzEuMzVjLTEuNjk1LTEuNS0zLjc1NC0zLjIyNS02LjY2LTcuMzUtMS44NjUtMi42NDctMy41MTItNC01LjkzNC00LTIuNjY0IDAtNC4xMTcgMS4yNS01LjU1MiAzLjI3OS0yLjEgMi45NzEtMi45MjUgMy45NzEtNS4wODggNS42NzUtLjc4Ni42MTktNC44NjEgMy4xNzItNC44NiA3LjY3MUM4LjAwMSA0MS44NzUgMTEuNzUzIDQ0IDE1LjE1NSA0NGM0LjQ2OSAwIDUuNDM5LTEgOC4zNDUtMSAzLjYzMyAwIDUuNTcgMSA4LjQ3NiAxQzM3Ljc4OSA0NCAzOSAzOS42MjUgMzkgMzYuODcyIDM5IDM0LjI1IDM3Ljc4OSAzMi44NSAzNi4wOTQgMzEuMzV6TTExLjM4OSAyNC44ODVjMy4xMjQtLjY5NCAzLjYxNi0zLjczOSAzLjYxMS01LjczMi0uMDAyLS42OTYtLjA2NC0xLjI2My0uMDk2LTEuNTU4LS4xOTgtMS42NzgtMi4wMjctNC41NS00LjU1MS00LjU5NC0uMTItLjAwMi0uMjQyLjAwMi0uMzY1LjAxMy0zLjQxMi4zMTQtMy45MTEgNS40MTItMy45MTEgNS40MTItLjA1Ni4yODctLjA4Mi42MTMtLjA3OC45NjMuMDMxIDIuMjYzIDEuMzU2IDUuNTI3IDQuMjc0IDUuNjFDMTAuNjIzIDI1LjAwOCAxMC45OTQgMjQuOTczIDExLjM4OSAyNC44ODVNMTkuNTAzIDE2QzIxLjk5IDE2IDI0IDEzLjMxNSAyNCA5Ljk5OCAyNCA2LjY4MSAyMS45OSA0IDE5LjUwMyA0IDE3LjAxNSA0IDE1IDYuNjgxIDE1IDkuOTk4IDE1IDEzLjMxNSAxNy4wMTUgMTYgMTkuNTAzIDE2TTI5LjUyMiAxNi45NjRjLjIyMS4wMzEuNDM2LjA0MS42NDUuMDMzIDIuNjk2LS4xMDMgNC40MTYtMy4yNzYgNC43ODEtNS43MjMuMDM3LS4yNDEuMDU0LS40ODYuMDUyLS43MzMtLjAxNS0yLjQ0MS0xLjgzMS01LjAxMi0zLjc5OS01LjQ5LTIuMTc3LS41MzItNC44OTMgMy4xNzMtNS4xMzggNS41OS0uMDM3LjM3LS4wNTkuNzM5LS4wNjMgMS4xMDNDMjUuOTc1IDE0LjI5NiAyNi44NDEgMTYuNTk5IDI5LjUyMiAxNi45NjRNNDEuOTg0IDIxLjE0MmMwLTEuMjgxLTEuMDA0LTUuMTQyLTQuNzQyLTUuMTQyQzMzLjQ5NiAxNiAzMyAxOS42NDQgMzMgMjIuMjE5YzAgMi40MS4xODcgNS43NTIgNC41NzggNS43ODEuMDg3LjAwMS4xNzYgMCAuMjY3LS4wMDIgNC4wMjctLjA5NCA0LjE4My00LjIwMyA0LjE1Mi02LjEzOEM0MS45OTMgMjEuNTYxIDQxLjk4NCAyMS4zMTUgNDEuOTg0IDIxLjE0MiIgLz4NCiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI0IDMxdjcuNWMwIDAgMCAxLjg3NSAyLjYyNSAyLjVIMzNWMzFoLTIuNjI1djcuNWgtMi43NWMwIDAtLjg3NS0uMTI1LTEtLjc1VjMxSDI0ek0yMCAyN3Y0aC0zYy0yLjEyNS4zNzUtNCAyLjI1LTMuOTk5IDQuODc1QzEzLjAwMSAzNS45MTcgMTMgMzUuOTU4IDEzIDM2YzAgMi43NSAxLjg3NSA0LjYyNSA0IDVoNS42MjVWMjdIMjB6TTIwIDM4Ljc1aC0yLjM3NWMtLjc1IDAtMi0xLjEyNS0yLTIuNzVzMS4yNS0yLjc1IDItMi43NUgyMFYzOC43NXoiIC8+DQo8L3N2Zz4="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '谷歌英文' : 'Google in English',
        where: 'tab',
        url: "https://www.google.com/search?hl=en&lr=lang_en&q=%s",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA0OCA0OCI+DQogIDxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCiAgPHBhdGggZmlsbD0iI0ZGM0QwMCIgZD0iTTYuMzA2LDE0LjY5MWw2LjU3MSw0LjgxOUMxNC42NTUsMTUuMTA4LDE4Ljk2MSwxMiwyNCwxMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzE2LjMxOCw0LDkuNjU2LDguMzM3LDYuMzA2LDE0LjY5MXoiIC8+DQogIDxwYXRoIGZpbGw9IiM0Q0FGNTAiIGQ9Ik0yNCw0NGM1LjE2NiwwLDkuODYtMS45NzcsMTMuNDA5LTUuMTkybC02LjE5LTUuMjM4QzI5LjIxMSwzNS4wOTEsMjYuNzE1LDM2LDI0LDM2Yy01LjIwMiwwLTkuNjE5LTMuMzE3LTExLjI4My03Ljk0NmwtNi41MjIsNS4wMjVDOS41MDUsMzkuNTU2LDE2LjIyNyw0NCwyNCw0NHoiIC8+DQogIDxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIgLz4NCjwvc3ZnPg=="
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? '生成二维码' : 'Generate QR code',
        where: 'tab',
        url: "https://my.tv.sohu.com/user/a/wvideo/getQRCode.do?text=%s",
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTMgM0wzIDlMOSA5TDkgM0wzIDMgeiBNIDExIDNMMTEgNUwxMyA1TDEzIDNMMTEgMyB6IE0gMTUgM0wxNSA5TDIxIDlMMjEgM0wxNSAzIHogTSA1IDVMNyA1TDcgN0w1IDdMNSA1IHogTSAxNyA1TDE5IDVMMTkgN0wxNyA3TDE3IDUgeiBNIDExIDdMMTEgOUwxMyA5TDEzIDdMMTEgNyB6IE0gMyAxMUwzIDEzTDUgMTNMNSAxMUwzIDExIHogTSA3IDExTDcgMTNMOSAxM0w5IDExTDcgMTEgeiBNIDExIDExTDExIDEzTDEzIDEzTDEzIDExTDExIDExIHogTSAxMyAxM0wxMyAxNUwxNSAxNUwxNSAxM0wxMyAxMyB6IE0gMTUgMTNMMTcgMTNMMTcgMTFMMTUgMTFMMTUgMTMgeiBNIDE3IDEzTDE3IDE1TDE5IDE1TDE5IDEzTDE3IDEzIHogTSAxOSAxM0wyMSAxM0wyMSAxMUwxOSAxMUwxOSAxMyB6IE0gMTkgMTVMMTkgMTdMMjEgMTdMMjEgMTVMMTkgMTUgeiBNIDE5IDE3TDE3IDE3TDE3IDE5TDE5IDE5TDE5IDE3IHogTSAxOSAxOUwxOSAyMUwyMSAyMUwyMSAxOUwxOSAxOSB6IE0gMTcgMTlMMTUgMTlMMTUgMjFMMTcgMjFMMTcgMTkgeiBNIDE1IDE5TDE1IDE3TDEzIDE3TDEzIDE5TDE1IDE5IHogTSAxMyAxOUwxMSAxOUwxMSAyMUwxMyAyMUwxMyAxOSB6IE0gMTMgMTdMMTMgMTVMMTEgMTVMMTEgMTdMMTMgMTcgeiBNIDE1IDE3TDE3IDE3TDE3IDE1TDE1IDE1TDE1IDE3IHogTSAzIDE1TDMgMjFMOSAyMUw5IDE1TDMgMTUgeiBNIDUgMTdMNyAxN0w3IDE5TDUgMTlMNSAxNyB6IiAvPg0KPC9zdmc+"
    }];
    var menu = PageMenu({
        id: 'addMenu-search-select',
        condition: 'select',
        image: "data:image/svg+xml;base64,77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5Ij4NCiAgPHBhdGggZD0iTTMgNC41IEEgMS41IDEuNSAwIDAgMCAxLjUgNiBBIDEuNSAxLjUgMCAwIDAgMyA3LjUgQSAxLjUgMS41IDAgMCAwIDQuNSA2IEEgMS41IDEuNSAwIDAgMCAzIDQuNSB6IE0gNyA1TDcgN0wyMiA3TDIyIDVMNyA1IHogTSAzIDEwLjUgQSAxLjUgMS41IDAgMCAwIDEuNSAxMiBBIDEuNSAxLjUgMCAwIDAgMyAxMy41IEEgMS41IDEuNSAwIDAgMCA0LjUgMTIgQSAxLjUgMS41IDAgMCAwIDMgMTAuNSB6IE0gNyAxMUw3IDEzTDEzLjEwNTQ2OSAxM0MxNC4zNjc0NjkgMTEuNzY0IDE2LjA5NCAxMSAxOCAxMUw3IDExIHogTSAxOCAxM0MxNS4yIDEzIDEzIDE1LjIgMTMgMThDMTMgMjAuOCAxNS4yIDIzIDE4IDIzQzE5IDIzIDIwLjAwMDc4MSAyMi42OTkyMTkgMjAuODAwNzgxIDIyLjE5OTIxOUwyMi41OTk2MDkgMjRMMjQgMjIuNTk5NjA5TDIyLjE5OTIxOSAyMC44MDA3ODFDMjIuNjk5MjE5IDIwLjAwMDc4MSAyMyAxOSAyMyAxOEMyMyAxNS4yIDIwLjggMTMgMTggMTMgeiBNIDE4IDE1QzE5LjcgMTUgMjEgMTYuMyAyMSAxOEMyMSAxOS43IDE5LjcgMjEgMTggMjFDMTYuMyAyMSAxNSAxOS43IDE1IDE4QzE1IDE2LjMgMTYuMyAxNSAxOCAxNSB6IE0gMyAxNi41IEEgMS41IDEuNSAwIDAgMCAxLjUgMTggQSAxLjUgMS41IDAgMCAwIDMgMTkuNSBBIDEuNSAxLjUgMCAwIDAgNC41IDE4IEEgMS41IDEuNSAwIDAgMCAzIDE2LjUgeiBNIDcgMTdMNyAxOUwxMS4wODAwNzggMTlDMTEuMDMzMDc4IDE4LjY3MyAxMSAxOC4zNCAxMSAxOEMxMSAxNy42NiAxMS4wMzMwNzggMTcuMzI3IDExLjA4MDA3OCAxN0w3IDE3IHoiIC8+DQo8L3N2Zz4=",
        onshowing: function () {
            var sel = addMenu.convertText(Services.locale.appLocaleAsBCP47.includes("zh-") ? "搜索: %SEL%" : "Search %SEL% by");
            if (sel && sel.length > 15)
                sel = sel.substr(0, 15) + "...";
            this.label = sel;
        },
    });
    menu(items);
    css("#context-searchselect { display: none } #contentAreaContextMenu #addMenu-search-select .menu-accel-container { visibility: hidden; }");
};
// 文本右键菜单 End ==============================================================
// 输入右键菜单 Start ============================================================
//快捷回复
new function () {
    var items = [{
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "当前日期和时间" : "Current Date and Time",
        condition: "input",
        position: 2,
        oncommand: function () {
            var localnow = new Date();
            var yy = localnow.getFullYear();
            var mm = localnow.getMonth() + 1;
            if (mm < 10) mm = '0' + mm;
            var dd = localnow.getDate();
            if (dd < 10) dd = '0' + dd;
            var hh = localnow.getHours();
            if (hh < 10) hh = '0' + hh;
            var mi = localnow.getMinutes();
            if (mi < 10) mi = '0' + mi;
            var localnowstr = '【' + yy + '.' + mm + '.' + dd + ' - ' + hh + ':' + mi + '】';
            addMenu.copy(localnowstr);
            goDoCommand("cmd_paste");
        },
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "用户名" : "Username",
        tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? "左键：填写用户名\n右键：设置用户名" : "Left click: paste username\nRight click: set username",
        onclick: function (event) {
            function setPref(pref) {
                pref = pref || ""
                var text = prompt(Services.locale.appLocaleAsBCP47.includes("zh-") ? '设置用户名:' : 'Set username:', pref);
                if (text) Services.prefs.setStringPref('userChromeJS.addMenuPlus.username', text);
            }
            if (event.button == 0) {
                let pref = Services.prefs.getStringPref('userChromeJS.addMenuPlus.username', null);
                if (pref) { addMenu.copy(pref); goDoCommand("cmd_paste"); }
                else { setPref() }
            }
            if (event.button == 2) {
                setPref();
            }
        },
        image: " "
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "邮箱" : "Email",
        tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? "左键：填写邮箱\n右键：设置邮箱" : "Left click: paste Email\nRight click: set Email",
        onclick: function (event) {
            function setPref(pref) {
                pref = pref || ""
                var text = prompt(Services.locale.appLocaleAsBCP47.includes("zh-") ? '设置邮箱:' : 'Set Email:', pref);
                if (text) Services.prefs.setStringPref('userChromeJS.addMenuPlus.email', text);
            }
            if (event.button == 0) {
                let pref = Services.prefs.getStringPref('userChromeJS.addMenuPlus.email', null);
                if (pref) { addMenu.copy(pref); goDoCommand("cmd_paste"); }
                else { setPref() }
            }
            if (event.button == 2) {
                setPref();
            }
        },
        image: " "
    }, {
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "网站" : "Webstie",
        tooltiptext: Services.locale.appLocaleAsBCP47.includes("zh-") ? "左键：填写网站\n右键：设置网站" : "Left click: paste WebSite\nRight click: set Website",
        onclick: function (event) {
            function setPref(pref) {
                pref = pref || ""
                var text = prompt(Services.locale.appLocaleAsBCP47.includes("zh-") ? '设置网站:' : 'Set Website:', pref);
                if (text) Services.prefs.setStringPref('userChromeJS.addMenuPlus.website', text);
            }
            if (event.button == 0) {
                let pref = Services.prefs.getStringPref('userChromeJS.addMenuPlus.website', null);
                if (pref) { addMenu.copy(pref); goDoCommand("cmd_paste"); }
                else { setPref() }
            }
            if (event.button == 2) {
                setPref();
            }
        },
        image: " "
    }, {}, {
        label: "不明觉厉~~~",
        input_text: "虽然不知道LZ在说什么但是感觉很厉害的样子～",
        image: " "
    }, {
        label: "不用客气~~~",
        input_text: "不用客气，大家互相帮助……\n\u256E\uFF08\u256F\u25C7\u2570\uFF09\u256D",
        image: " "
    }, {
        label: "反馈情况再说",
        input_text: "Mark，看反馈情况再说。。。",
        image: " "
    }, {
        label: "看起来很不错",
        input_text: "看起来很不错哦，收藏之~~~\n谢谢LZ啦！！！",
        image: " "
    }, {
        label: "谢谢楼主分享",
        input_text: "谢谢楼主的分享!这个绝对要顶！！！",
        image: " "
    }, {
        label: "楼上正解~~~",
        input_text: "楼上正解……\u0285\uFF08\u00B4\u25D4\u0C6A\u25D4\uFF09\u0283",
        image: " "
    }, {
        label: "坐等楼下解答",
        input_text: "坐等楼下高手解答~~~⊙_⊙",
        image: " "
    }, {
        label: "这个要支持~~~",
        input_text: "很好、很强大，这个一定得支持！！！",
        image: " "
    }, {
        label: "不明真相的~~~",
        input_text: "不明真相的围观群众~~~\u0285\uFF08\u00B4\u25D4\u0C6A\u25D4\uFF09\u0283",
        image: " "
    }, {
        label: "没图没真相~~~",
        input_text: "没图没真相，纯支持下了~~~",
        image: " "
    }, {
        label: "嘿嘿~~~",
        input_text: "\u2606\u002E\u3002\u002E\u003A\u002A\u0028\u563F\u00B4\u0414\uFF40\u563F\u0029\u002E\u3002\u002E\u003A\u002A\u2606",
        image: " "
    }];
    var menu = PageMenu({
        id: "quick_input",
        label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "快速输入..." : "Quick Input",
        condition: "input",
        // insertAfter:"context-paste",
        position: 1,
        image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9ImNvbnRleHQtZmlsbCIgZmlsbC1vcGFjaXR5PSJjb250ZXh0LWZpbGwtb3BhY2l0eSI+DQo8cGF0aCBkPSJNMTkwLjMsNDUuMkw5OCwxMzcuNUg2NC43di0zMy4zTDE1NywxMS45YzEuMy0xLjMsMy0xLjksNC43LTEuOWMxLjcsMCwzLjQsMC42LDQuNywxLjlsMjMuOSwyMy45YzEuMywxLjMsMS45LDMsMS45LDQuNw0KCUMxOTIuMiw0Mi4yLDE5MS42LDQzLjksMTkwLjMsNDUuMnogTTE2MS43LDI5LjRsLTgwLjQsODAuNHYxMS4xaDExLjFsODAuNC04MC40TDE2MS43LDI5LjRMMTYxLjcsMjkuNHogTTEwMC43LDM3LjdIMzEuNHYxMzNoMTMzDQoJdi02OS4zYzAtNC42LDMuNy04LjMsOC4zLTguM2M0LjYsMCw4LjMsMy43LDguMyw4LjN2NzQuOGMwLDYuMS01LDExLjEtMTEuMSwxMS4xSDI1LjljLTYuMSwwLTExLjEtNS0xMS4xLTExLjFWMzIuMg0KCWMwLTYuMSw1LTExLjEsMTEuMS0xMS4xaDc0LjhjNC42LDAsOC4zLDMuNyw4LjMsOC4zUzEwNS4zLDM3LjcsMTAwLjcsMzcuN3oiLz4NCjwvc3ZnPg0K",
        oncommand: function (event) {
            var input_text = event.target.getAttribute('input_text');
            if (input_text) {
                addMenu.copy(input_text);
                goDoCommand("cmd_paste");
            }
        }
    });
    menu(items);
};
//颜文字输入
var Specialcharacters = PageMenu({
    id: "quick_inputemoji",
    label: Services.locale.appLocaleAsBCP47.includes("zh-") ? "颜文字输入" : "Emoji",
    condition: "input",
    insertAfter: "quick_input",
    oncommand: function (event) {
        var input_text = event.target.getAttribute('input_text');
        if (input_text) {
            addMenu.copy(input_text);
            goDoCommand("cmd_paste");
        }
    },
    image: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY29udGV4dC1maWxsIiBmaWxsLW9wYWNpdHk9ImNvbnRleHQtZmlsbC1vcGFjaXR5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0gMTAuMDc0IDAuNDQzIEMgOC43NDkgMC40NDMgNy40ODYgMC43MTIgNi4zMzcgMS4xOTggQyA1LjE4OSAxLjY4NCA0LjE1NSAyLjM4NiAzLjI4NiAzLjI1NSBDIDIuNDE4IDQuMTI0IDEuNzE1IDUuMTU4IDEuMjI5IDYuMzA2IEMgMC43NDMgNy40NTUgMC40NzQgOC43MTggMC40NzQgMTAuMDQzIEMgMC40NzUgMTEuODkxIDAuOTc1IDEzLjU2NSAxLjgyNSAxNC45NzkgQyAyLjY3NSAxNi4zOTQgMy44NzUgMTcuNTQ4IDUuMjc1IDE4LjM1NiBDIDYuNjc1IDE5LjE2NSA4LjI3NSAxOS42MjcgOS45MjUgMTkuNjU1IEMgMTEuNTc1IDE5LjY4NCAxMy4yNzUgMTkuMjggMTQuODc1IDE4LjM1NiBDIDE1LjYxOCAxNy45MjggMTYuMjg5IDE3LjQwOCAxNi44NzggMTYuODE2IEMgMTcuNDY3IDE2LjIyNCAxNy45NzUgMTUuNTYgMTguMzg5IDE0Ljg0MiBDIDE4LjgwMyAxNC4xMjUgMTkuMTI1IDEzLjM1MyAxOS4zNDIgMTIuNTQ3IEMgMTkuNTYgMTEuNzQxIDE5LjY3NSAxMC45IDE5LjY3NCAxMC4wNDIgQyAxOS42NzQgOC43MTcgMTkuNDA1IDcuNDU1IDE4LjkxOSA2LjMwNiBDIDE4LjQzNCA1LjE1OCAxNy43MzEgNC4xMjQgMTYuODYyIDMuMjU1IEMgMTUuOTk0IDIuMzg3IDE0Ljk1OSAxLjY4NCAxMy44MSAxLjE5OCBDIDEyLjY2MiAwLjcxMiAxMS4zOTkgMC40NDMgMTAuMDc0IDAuNDQzIFogTSAxMC4wNzQgMTcuNjQyIEMgOC42MTIgMTcuNjU5IDcuMjgxIDE3LjI3OCA2LjE1NCAxNi42MTggQyA1LjAyNyAxNS45NTggNC4xMDIgMTUuMDE5IDMuNDQ5IDEzLjkxOCBDIDIuNzk3IDEyLjgxNyAyLjQxNyAxMS41NTUgMi4zNzkgMTAuMjQ5IEMgMi4zNDEgOC45NDMgMi42NDYgNy41OTMgMy4zNjIgNi4zMTggQyAzLjcwMyA1LjcxMyA0LjExOSA1LjE2NiA0LjU5NSA0LjY4NyBDIDUuMDcxIDQuMjA4IDUuNjA3IDMuNzk2IDYuMTg3IDMuNDYxIEMgNi43NjcgMy4xMjYgNy4zOTIgMi44NjggOC4wNDUgMi42OTUgQyA4LjY5OCAyLjUyMiA5LjM4IDIuNDM1IDEwLjA3NCAyLjQ0MyBDIDExLjUzNyAyLjQyNyAxMi44NjcgMi44MDcgMTMuOTk0IDMuNDY3IEMgMTUuMTIyIDQuMTI3IDE2LjA0NyA1LjA2NyAxNi42OTkgNi4xNjcgQyAxNy4zNTEgNy4yNjggMTcuNzMyIDguNTMxIDE3Ljc3IDkuODM3IEMgMTcuODA3IDExLjE0MyAxNy41MDMgMTIuNDkyIDE2Ljc4NiAxMy43NjcgQyAxNi40NDYgMTQuMzczIDE2LjAzIDE0LjkxOSAxNS41NTQgMTUuMzk4IEMgMTUuMDc4IDE1Ljg3OCAxNC41NDEgMTYuMjg5IDEzLjk2MSAxNi42MjQgQyAxMy4zODEgMTYuOTYgMTIuNzU2IDE3LjIxOCAxMi4xMDMgMTcuMzkxIEMgMTEuNDUgMTcuNTYzIDEwLjc2OCAxNy42NSAxMC4wNzQgMTcuNjQyIFogTSA3LjU3NSA5Ljc5MyBDIDcuNzgyIDkuNzkzIDcuOTc5IDkuNzQ0IDguMTU5IDkuNjU2IEMgOC4zMzggOS41NjcgOC41IDkuNDM5IDguNjM1IDkuMjgxIEMgOC43NzEgOS4xMjMgOC44OCA4LjkzNCA4Ljk1NiA4LjcyNCBDIDkuMDMyIDguNTE1IDkuMDc0IDguMjg1IDkuMDc0IDguMDQzIEMgOS4wNzQgNy44MDEgOS4wMzIgNy41NzEgOC45NTYgNy4zNjEgQyA4Ljg4IDcuMTUyIDguNzcxIDYuOTY0IDguNjM1IDYuODA1IEMgOC40OTkgNi42NDcgOC4zMzcgNi41MTkgOC4xNTggNi40MyBDIDcuOTc4IDYuMzQyIDcuNzgxIDYuMjkzIDcuNTc0IDYuMjkzIEMgNy4zNjcgNi4yOTMgNy4xNyA2LjM0MiA2Ljk5IDYuNDMgQyA2LjgxMSA2LjUxOSA2LjY0OSA2LjY0NyA2LjUxMyA2LjgwNSBDIDYuMzc3IDYuOTY0IDYuMjY4IDcuMTUyIDYuMTkyIDcuMzYyIEMgNi4xMTYgNy41NzEgNi4wNzQgNy44MDIgNi4wNzQgOC4wNDMgQyA2LjA3NCA4LjI4NSA2LjExNiA4LjUxNSA2LjE5MiA4LjcyNCBDIDYuMjY4IDguOTM0IDYuMzc4IDkuMTIyIDYuNTE0IDkuMjgxIEMgNi42NSA5LjQzOSA2LjgxMSA5LjU2NyA2Ljk5MSA5LjY1NiBDIDcuMTcxIDkuNzQ0IDcuMzY4IDkuNzkzIDcuNTc1IDkuNzkzIFogTSAxMi41NzQgOS43OTMgQyAxMi43ODIgOS43OTMgMTIuOTc5IDkuNzQ0IDEzLjE1OSA5LjY1NiBDIDEzLjMzOCA5LjU2NyAxMy41IDkuNDM5IDEzLjYzNSA5LjI4MSBDIDEzLjc3MSA5LjEyMyAxMy44OCA4LjkzNCAxMy45NTYgOC43MjQgQyAxNC4wMzIgOC41MTUgMTQuMDc0IDguMjg1IDE0LjA3NCA4LjA0MyBDIDE0LjA3NCA3LjgwMSAxNC4wMzIgNy41NzEgMTMuOTU2IDcuMzYxIEMgMTMuODggNy4xNTIgMTMuNzcxIDYuOTY0IDEzLjYzNSA2LjgwNSBDIDEzLjQ5OSA2LjY0NyAxMy4zMzcgNi41MTkgMTMuMTU4IDYuNDMgQyAxMi45NzggNi4zNDIgMTIuNzgxIDYuMjkzIDEyLjU3NCA2LjI5MyBDIDEyLjM2NyA2LjI5MyAxMi4xNyA2LjM0MiAxMS45OSA2LjQzMSBDIDExLjgxMSA2LjUxOSAxMS42NSA2LjY0NyAxMS41MTQgNi44MDYgQyAxMS4zNzggNi45NjQgMTEuMjY4IDcuMTUzIDExLjE5MiA3LjM2MiBDIDExLjExNiA3LjU3MSAxMS4wNzQgNy44MDIgMTEuMDc0IDguMDQzIEMgMTEuMDc0IDguMjg1IDExLjExNiA4LjUxNSAxMS4xOTIgOC43MjQgQyAxMS4yNjggOC45MzMgMTEuMzc4IDkuMTIyIDExLjUxNCA5LjI4IEMgMTEuNjUgOS40MzkgMTEuODExIDkuNTY3IDExLjk5IDkuNjU1IEMgMTIuMTcgOS43NDQgMTIuMzY3IDkuNzkzIDEyLjU3NCA5Ljc5MyBaIE0gMTQuNDE1IDExLjM3OSBDIDE0LjMyMyAxMS4zMzMgMTQuMjI2IDExLjMwNyAxNC4xMyAxMS4zIEMgMTQuMDMzIDExLjI5MyAxMy45MzcgMTEuMzA1IDEzLjg0NiAxMS4zMzMgQyAxMy43NTUgMTEuMzYyIDEzLjY2OSAxMS40MDggMTMuNTk0IDExLjQ3IEMgMTMuNTE5IDExLjUzMSAxMy40NTUgMTEuNjA4IDEzLjQwNyAxMS42OTkgQyAxMy4zOTkgMTEuNzE2IDEzLjM0IDExLjgyMyAxMy4yMTkgMTEuOTc2IEMgMTMuMDk3IDEyLjEyOCAxMi45MTMgMTIuMzI1IDEyLjY1MiAxMi41MiBDIDEyLjM5MiAxMi43MTUgMTIuMDU1IDEyLjkwOCAxMS42MyAxMy4wNTIgQyAxMS4yMDUgMTMuMTk3IDEwLjY5MSAxMy4yOTIgMTAuMDc1IDEzLjI5MiBDIDkuNDYyIDEzLjI5MiA4Ljk1IDEzLjE5OCA4LjUyNiAxMy4wNTUgQyA4LjEwMiAxMi45MTIgNy43NjYgMTIuNzIgNy41MDUgMTIuNTI2IEMgNy4yNDQgMTIuMzMyIDcuMDU5IDEyLjEzNiA2LjkzNiAxMS45ODMgQyA2LjgxMyAxMS44MyA2Ljc1MyAxMS43MiA2Ljc0MiAxMS43IEMgNi42NzcgMTEuNTcxIDYuNTgzIDExLjQ3MiA2LjQ3NCAxMS40MDMgQyA2LjM2NSAxMS4zMzQgNi4yNCAxMS4yOTYgNi4xMTQgMTEuMjg5IEMgNS45ODggMTEuMjgyIDUuODYgMTEuMzA3IDUuNzQ0IDExLjM2MyBDIDUuNjI4IDExLjQyIDUuNTI0IDExLjUwNyA1LjQ0NSAxMS42MjggQyA1LjQwOSAxMS42ODQgNS4zOCAxMS43NDQgNS4zNiAxMS44MDcgQyA1LjM0IDExLjg2OSA1LjMyOCAxMS45MzMgNS4zMjQgMTEuOTk4IEMgNS4zMiAxMi4wNjIgNS4zMjUgMTIuMTI4IDUuMzM4IDEyLjE5MiBDIDUuMzUxIDEyLjI1NiA1LjM3MyAxMi4zMTggNS40MDMgMTIuMzc4IEMgNS40MTYgMTIuNDAzIDUuNSAxMi41NjYgNS42NzMgMTIuNzk3IEMgNS44NDYgMTMuMDI4IDYuMTA3IDEzLjMyNiA2LjQ3NCAxMy42MjIgQyA2Ljg0MSAxMy45MTcgNy4zMTMgMTQuMjEgNy45MDggMTQuNDI5IEMgOC41MDIgMTQuNjQ3IDkuMjE5IDE0Ljc5MiAxMC4wNzUgMTQuNzkyIEMgMTAuOTMyIDE0Ljc5MiAxMS42NDkgMTQuNjQ3IDEyLjI0MyAxNC40MjkgQyAxMi44MzggMTQuMjEgMTMuMzEgMTMuOTE4IDEzLjY3NiAxMy42MjIgQyAxNC4wNDMgMTMuMzI2IDE0LjMwNCAxMy4wMjcgMTQuNDc2IDEyLjc5NiBDIDE0LjY0OSAxMi41NjUgMTQuNzMzIDEyLjQwMiAxNC43NDUgMTIuMzc3IEMgMTQuNzkxIDEyLjI4NSAxNC44MTYgMTIuMTg5IDE0LjgyMyAxMi4wOTIgQyAxNC44MjkgMTEuOTk2IDE0LjgxNiAxMS45IDE0Ljc4NiAxMS44MSBDIDE0Ljc1NyAxMS43MTkgMTQuNzEgMTEuNjM1IDE0LjY0NyAxMS41NjEgQyAxNC41ODUgMTEuNDg4IDE0LjUwNyAxMS40MjUgMTQuNDE1IDExLjM3OSBaIiBzdHlsZT0iIi8+CiAgPHBhdGggZD0iTSAyMC4xNzQgMTAuMDQyIEMgMjAuMTQxIDEzLjU5NyAxOC4xODYgMTYuOTgzIDE1LjEyNSAxOC43ODkgQyAxMS43ODQgMjAuNjY5IDcuOTIxIDIwLjQ2MSA1LjAyNSAxOC43ODkgQyAyLjEyOSAxNy4xMTggMC4wMTYgMTMuODc3IC0wLjAyNiAxMC4wNDMgQyAtMC4wMDQgNy4yOSAxLjEzMiA0LjcwMSAyLjkzMiAyLjkwMSBDIDQuNzMyIDEuMTAxIDcuMzIxIC0wLjA1NyAxMC4wNzQgLTAuMDU3IEMgMTIuODI3IC0wLjA1NyAxNS40MTUgMS4xMDEgMTcuMjE1IDIuOTAxIEMgMTkuMDE2IDQuNzAxIDIwLjE1MiA3LjI4OSAyMC4xNzQgMTAuMDQyIFogTSAxNi41MDggMy42MDggQyAxNC44MzQgMS45MzQgMTIuNjIyIDAuOTQzIDEwLjA3NCAwLjk0MyBDIDcuNTI1IDAuOTQzIDUuMzE0IDEuOTM0IDMuNjM5IDMuNjA4IEMgMS45NjUgNS4yODMgMC45NTIgNy40OTQgMC45NzQgMTAuMDQzIEMgMC45MzMgMTMuNTk5IDIuODIxIDE2LjM2MiA1LjUyNSAxNy45MjMgQyA4LjIyOSAxOS40ODQgMTEuNTY2IDE5LjczOCAxNC42MjUgMTcuOTIzIEMgMTcuNTA0IDE2LjI5OSAxOS4yMDkgMTMuMzQ3IDE5LjE3NCAxMC4wNDIgQyAxOS4xOTYgNy40OTQgMTguMTgzIDUuMjgyIDE2LjUwOCAzLjYwOCBaIE0gMTAuMDc2IDE4LjE0MiBDIDcuMDE0IDE4LjEzNCA0LjM4MSAxNi40NyAzLjAxOSAxNC4xNzMgQyAxLjY1NyAxMS44NzUgMS40NjEgOC43NjQgMi45MjYgNi4wNzMgQyA0LjM4IDMuNTU4IDcuMTcgMS45NDcgMTAuMDcyIDEuOTQzIEMgMTMuMTM0IDEuOTUxIDE1Ljc2NyAzLjYxNSAxNy4xMjkgNS45MTIgQyAxOC40OTEgOC4yMSAxOC42ODcgMTEuMzIxIDE3LjIyMiAxNC4wMTIgQyAxNS43NjggMTYuNTI3IDEyLjk3OSAxOC4xMzggMTAuMDc2IDE4LjE0MiBaIE0gMTYuMzUgMTMuNTIyIEMgMTcuNzUyIDExLjExMyAxNy41MTcgOC41MjkgMTYuMjY5IDYuNDIyIEMgMTUuMDIgNC4zMTYgMTIuODY2IDIuODY5IDEwLjA4IDIuOTQzIEMgNy40MzEgMi44NzcgNS4wNjYgNC4yMzYgMy43OTggNi41NjMgQyAyLjM5NiA4Ljk3MiAyLjYzMSAxMS41NTYgMy44NzkgMTMuNjYzIEMgNS4xMjggMTUuNzY5IDcuMjgyIDE3LjIxNiAxMC4wNjggMTcuMTQyIEMgMTIuNzE4IDE3LjIwOCAxNS4wODIgMTUuODQ5IDE2LjM1IDEzLjUyMiBaIE0gNS41NzQgOC4wNDMgQyA1LjU3NCA3LjQ3IDUuODA4IDYuODYgNi4xMzQgNi40OCBDIDYuNDY2IDYuMDkzIDcuMDQ0IDUuNzkzIDcuNTc0IDUuNzkzIEMgOC4xMDQgNS43OTMgOC42ODIgNi4wOTMgOS4wMTQgNi40OCBDIDkuMzQgNi44NiA5LjU3NCA3LjQ3IDkuNTc0IDguMDQzIEMgOS41NzQgOC42MTYgOS4zNDEgOS4yMjYgOS4wMTUgOS42MDYgQyA4LjY4MyA5Ljk5MyA4LjEwNSAxMC4yOTMgNy41NzUgMTAuMjkzIEMgNy4wNDUgMTAuMjkzIDYuNDY2IDkuOTkzIDYuMTM0IDkuNjA2IEMgNS44MDggOS4yMjYgNS41NzQgOC42MTYgNS41NzQgOC4wNDMgWiBNIDYuODkzIDguOTU1IEMgNy4xMDQgOS4yMDEgNy4yNzYgOS4yOTMgNy41NzUgOS4yOTMgQyA3Ljg3MyA5LjI5MyA4LjA0NSA5LjIwMSA4LjI1NSA4Ljk1NSBDIDguNDcyIDguNzAyIDguNTc0IDguNDM3IDguNTc0IDguMDQzIEMgOC41NzQgNy42NDkgOC40NzIgNy4zODQgOC4yNTUgNy4xMzEgQyA4LjA0NCA2Ljg4NSA3Ljg3MiA2Ljc5MyA3LjU3NCA2Ljc5MyBDIDcuMjc2IDYuNzkzIDcuMTA0IDYuODg1IDYuODkzIDcuMTMxIEMgNi42NzYgNy4zODQgNi41NzQgNy42NDkgNi41NzQgOC4wNDMgQyA2LjU3NCA4LjQzNyA2LjY3NiA4LjcwMiA2Ljg5MyA4Ljk1NSBaIE0gMTAuNTc0IDguMDQzIEMgMTAuNTc0IDcuNDcgMTAuODA4IDYuODYxIDExLjEzNCA2LjQ4IEMgMTEuNDY2IDYuMDkzIDEyLjA0NCA1Ljc5MyAxMi41NzQgNS43OTMgQyAxMy4xMDQgNS43OTMgMTMuNjgyIDYuMDkzIDE0LjAxNCA2LjQ4IEMgMTQuMzQgNi44NiAxNC41NzQgNy40NyAxNC41NzQgOC4wNDMgQyAxNC41NzQgOC42MTYgMTQuMzQxIDkuMjI2IDE0LjAxNSA5LjYwNiBDIDEzLjY4MyA5Ljk5MyAxMy4xMDQgMTAuMjkzIDEyLjU3NCAxMC4yOTMgQyAxMi4wNDQgMTAuMjkzIDExLjQ2NiA5Ljk5MyAxMS4xMzQgOS42MDYgQyAxMC44MDggOS4yMjUgMTAuNTc0IDguNjE2IDEwLjU3NCA4LjA0MyBaIE0gMTEuODkzIDguOTU1IEMgMTIuMTA0IDkuMjAxIDEyLjI3NiA5LjI5MyAxMi41NzQgOS4yOTMgQyAxMi44NzMgOS4yOTMgMTMuMDQ0IDkuMjAxIDEzLjI1NSA4Ljk1NSBDIDEzLjQ3MiA4LjcwMiAxMy41NzQgOC40MzcgMTMuNTc0IDguMDQzIEMgMTMuNTc0IDcuNjQ5IDEzLjQ3MiA3LjM4NCAxMy4yNTUgNy4xMzEgQyAxMy4wNDQgNi44ODUgMTIuODcyIDYuNzkzIDEyLjU3NCA2Ljc5MyBDIDEyLjI3NiA2Ljc5MyAxMi4xMDQgNi44ODUgMTEuODkzIDcuMTMxIEMgMTEuNjc2IDcuMzg0IDExLjU3NCA3LjY1IDExLjU3NCA4LjA0MyBDIDExLjU3NCA4LjQzNiAxMS42NzYgOC43MDIgMTEuODkzIDguOTU1IFogTSAxNS4xOTIgMTIuNjAxIEMgMTUuMTU4IDEyLjY2OCAxNC44MDIgMTMuMzU2IDEzLjk5IDE0LjAxMSBDIDEzLjIxNSAxNC42MzYgMTEuOSAxNS4yOTIgMTAuMDc1IDE1LjI5MiBDIDguMjUxIDE1LjI5MiA2LjkzNSAxNC42MzYgNi4xNiAxNC4wMTEgQyA1LjM0OCAxMy4zNTcgNC45ODUgMTIuNjU5IDQuOTU3IDEyLjYwNCBDIDQuODA5IDEyLjIzOCA0LjgzOSAxMS43MDIgNS4wMjYgMTEuMzU1IEMgNS4yOTUgMTEuMDIgNS43NzggMTAuNzcgNi4xNDEgMTAuNzkgQyA2LjUwNCAxMC44MSA2Ljk1OCAxMS4xMTEgNy4xODggMTEuNDc0IEMgNy4yMjEgMTEuNTM3IDcuMzY1IDExLjc5OCA3LjgwNCAxMi4xMjQgQyA4LjI4NCAxMi40ODIgOC45NTQgMTIuNzkyIDEwLjA3NSAxMi43OTIgQyAxMS4yMDEgMTIuNzkyIDExLjg3MyAxMi40NzkgMTIuMzUyIDEyLjEyIEMgMTIuNzkgMTEuNzkyIDEyLjk1MSAxMS40OTIgMTIuOTY2IDExLjQ2NCBDIDEzLjEyOCAxMS4yMDQgMTMuNDI5IDEwLjk0MSAxMy42OTUgMTAuODU3IEMgMTMuOTYgMTAuNzczIDE0LjM1OCAxMC44MTQgMTQuNjQxIDEwLjkzMyBDIDE0LjkwNSAxMS4wOTEgMTUuMTczIDExLjM4OCAxNS4yNjEgMTEuNjUzIEMgMTUuMzQ5IDExLjkxOCAxNS4zMSAxMi4zMTYgMTUuMTkyIDEyLjYwMSBaIE0gMTQuMzEyIDExLjk2NyBDIDE0LjI4IDExLjg3MSAxNC4yOTIgMTEuODUzIDE0LjE5IDExLjgyNSBDIDE0LjEwNiAxMS43NTkgMTQuMDk1IDExLjc3OSAxMy45OTcgMTEuODEgQyAxMy44OTkgMTEuODQxIDEzLjg3OSAxMS44MzEgMTMuODQ5IDExLjkzNCBDIDEzLjgxMiAxMi4wMDEgMTMuNTU2IDEyLjQ2OCAxMi45NTIgMTIuOTIgQyAxMi4zODkgMTMuMzQyIDExLjQxMiAxMy43OTIgMTAuMDc1IDEzLjc5MiBDIDguNzQ1IDEzLjc5MiA3Ljc3IDEzLjM0NiA3LjIwNyAxMi45MjcgQyA2LjYwMiAxMi40NzcgNi4zMjQgMTEuOTc4IDYuMzAxIDExLjkzNSBDIDYuMjcgMTEuNzgyIDYuMjI4IDExLjc5NiA2LjA4NiAxMS43ODkgQyA1Ljk0NSAxMS43ODEgNS45MSAxMS43NTMgNS44NjQgMTEuOTAxIEMgNS43NTcgMTIuMDAzIDUuNzU1IDEyLjA0IDUuODQ5IDEyLjE1MiBDIDUuODczIDEyLjIgNi4xMzIgMTIuNzA1IDYuNzg3IDEzLjIzMyBDIDcuNDggMTMuNzkxIDguNDc1IDE0LjI5MiAxMC4wNzUgMTQuMjkyIEMgMTEuNjc1IDE0LjI5MiAxMi42NyAxMy43OSAxMy4zNjIgMTMuMjMyIEMgMTQuMDE3IDEyLjcwNCAxNC4yNzQgMTIuMjAxIDE0LjI5NyAxMi4xNTUgQyAxNC4zNjMgMTIuMDczIDE0LjM0MyAxMi4wNjMgMTQuMzEyIDExLjk2NyBaIiBzdHlsZT0iZmlsbDogbm9uZTsiLz4KPC9zdmc+"
});

Specialcharacters([{
    id: "spe-charaters",
    style: "display:none;"
}]);


var SPE4 = PageMenu({
    label: "卖萌",
    condition: "input",
    insertBefore: "spe-charaters",
});
SPE4([{
    label: "｡◕‿◕｡",
    input_text: "｡◕‿◕｡"
}, {
    label: "(●'‿'●) ",
    input_text: "(●'‿'●) "
}, {
    label: "(ง •̀_•́)ง",
    input_text: "(ง •̀_•́)ง"
}, {
    label: "(๑•̀ω•́๑)",
    input_text: "(๑•̀ω•́๑)"
}, {
    label: "(๑¯∀¯๑)",
    input_text: "(๑¯∀¯๑)"
}, {
    label: "(๑•̀ㅂ•́)و✧",
    input_text: "(๑•̀ㅂ•́)و✧"
}, {
    label: "(๑•́ ₃ •̀๑) ",
    input_text: "(๑•́ ₃ •̀๑) "
}, {
    label: "_(:з」∠)_",
    input_text: "_(:з」∠)_"
}, {
    label: "(ฅ´ω`ฅ)",
    input_text: "(ฅ´ω`ฅ)"
}, {
    label: " (¬､¬)",
    input_text: " (¬､¬) "
}, {
    label: " ( ˙ε ˙ ) ",
    input_text: " ( ˙ε ˙ )"
}, {
    label: "(๑¯ิε ¯ิ๑) ",
    input_text: "(๑¯ิε ¯ิ๑) "
}, {
    label: "_(•̀ω•́ 」∠)_",
    input_text: "_(•̀ω•́ 」∠)_"
},

]);

var SPE6 = PageMenu({
    label: "不开心",
    condition: "input",
    insertBefore: "spe-charaters",
});
SPE6([{
    label: "Ծ‸Ծ",
    input_text: "Ծ‸Ծ"
}, {
    label: "●﹏●",
    input_text: "●﹏●"
}, {
    label: "≥﹏≤",
    input_text: "≥﹏≤"
}, {
    label: "◔ ‸◔？",
    input_text: "◔ ‸◔？"
}, {
    label: "ᕙ(⇀‸↼‵‵)ᕗ ",
    input_text: "ᕙ(⇀‸↼‵‵)ᕗ "
}, {
    label: "ヘ(-ω-ヘ)",
    input_text: "ヘ(-ω-ヘ)"
}, {
    label: "(￣_￣|||)",
    input_text: "(￣_￣|||)"
}, {
    label: "(눈_눈)",
    input_text: "(눈_눈)"
}, {
    label: "o(╥﹏╥)o",
    input_text: "o(╥﹏╥)o"
}, {
    label: "(￣▽￣*)b",
    input_text: "(￣▽￣*)b"
}, {
    label: "(｡•ˇ‸ˇ•｡)",
    input_text: "(｡•ˇ‸ˇ•｡)"
}, {
    label: "(｡•́︿•̀｡)",
    input_text: "(｡•́︿•̀｡)"
}, {
    label: "Σ(๑０ω０๑) ",
    input_text: "Σ(๑０ω０๑)"
}, {
    label: "( ´◔‸◔`)",
    input_text: "( ´◔‸◔`)"
}, {
    label: "( ´･ᴗ･` )",
    input_text: "( ´･ᴗ･` )"
}, {
    label: "( ⊙⊙)!!",
    input_text: "( ⊙⊙)!!"
}, {
    label: "(｡ì _ í｡)",
    input_text: "(｡ì _ í｡)"
},

]);

var SPE5 = PageMenu({
    label: "Emoji",
    condition: "input",
    insertBefore: "spe-charaters",
});
SPE5([{
    label: "😂",
    input_text: "😂"
}, {
    label: "😍",
    input_text: "😍"
}, {
    label: "😘",
    input_text: "😘"
}, {
    label: "😝",
    input_text: "😝"
}, {
    label: "😒",
    input_text: "😒"
}, {
    label: "😓",
    input_text: "😓"
}, {
    label: "😭",
    input_text: "😭"
}, {
    label: "😱",
    input_text: "😱"
}, {
    label: "😡",
    input_text: "😡"
}, {
    label: "😎",
    input_text: "😎"
}, {
    label: "❤️",
    input_text: "❤️"
}, {
    label: "💔",
    input_text: "💔"
}, {
    label: "👍",
    input_text: "👍"
}, {
    label: "👎",
    input_text: "👎"
}, {
    label: "👌",
    input_text: "👌"
}, {
    label: "🤝",
    input_text: "🤝"
},

]);

var SPE7 = PageMenu({
    label: "表情包",
    condition: "input",
    insertBefore: "spe-charaters",
});
SPE7([{
    label: "Instereting",
    input_text: '<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9t6ejgzj2050050jr7.jpg"/>'
}, {
    label: "辣眼睛",
    input_text: '<img src="https://tva3.sinaimg.cn/large/7a6a15d5gy1fcl8r7n590j20d10cbk1y.jpg"/>'
}, {
    label: "爱心发射",
    input_text: '<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl8s0pnqnj2060060aah.jpg"/>'
}, {
    label: "不错不错",
    input_text: '<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl9wbtpwgg2046046jtp.gif"/>'
}, {
    label: "我不能接受",
    input_text: '<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl8sipccsj208w06k0tf.jpg"/>'
}, {
    label: "可以，这很清真",
    input_text: '<img src="https://tva3.sinaimg.cn/large/7a6a15d5gy1fcl9i616lcj205i04wglr.jpg"/>'
}, {
    label: "不可以，这不清真",
    input_text: '<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9ii6wkwj206l05wgm5.jpg"/>'
}, {
    label: "厉害了，我的哥",
    input_text: '<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9jhl9btj20dc0a0aa7.jpg"/>'
}, {
    label: "老哥，稳",
    input_text: '<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9jsvmwhj204e04e0sk.jpg"/>'
}, {
    label: "尼克杨问题号脸",
    input_text: '<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl6ba3jznj208k086glk.jpg"/>'
}, {
    label: "在座的各位都是垃圾",
    input_text: '<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl8ogllg0j206r03tt8o.jpg"/>'
}, {
    label: "别说了....我",
    input_text: '<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl9kl6q47g207u078av3.gif"/>'
}, {
    label: "exo me?",
    input_text: '<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl9l01y74j205k05kq2s.jpg"/>'
}, {
    label: "哎呦，好叼哦",
    input_text: '<img src="https://tva3.sinaimg.cn/large/7a6a15d5gy1fcmq68293hj205k063js0.jpg"/>'
}, {
    label: "又在背后说我帅",
    input_text: '<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl9thd9a2j204404fglg.jpg"/>'
}, {
    label: "鸡年大吉吧",
    input_text: '<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9vw59yaj204w050glj.jpg"/>'
}, {
    label: "如此厚颜无耻之人",
    input_text: '<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl8q2ekhkg208w06oe81.gif"/>'
},]);

var SPE1 = PageMenu({
    label: "特殊图形",
    condition: "input",
    insertBefore: "spe-charaters",
});
SPE1([{
    label: "❤♥♡",
    input_text: "❤♥♡"
}, {
    label: "☻☺",
    input_text: "☻☺"
}, {
    label: "♂♀",
    input_text: "♂♀"
}, {
    label: "★☆",
    input_text: "★☆"
}, {
    label: "■◻",
    input_text: "■◻"
}, {
    label: "●○",
    input_text: "●○"
}, {
    label: "▲▼",
    input_text: "▲▼"
}, {
    label: "►◄",
    input_text: "►◄"
}, {
    label: "√×",
    input_text: "√×"
}, {
    label: "♪♫♬♩",
    input_text: "♪♫♬♩"
}, {
    label: "♠♥♣♦",
    input_text: "♠♥♣♦"
},]);

var SPE3 = PageMenu({
    label: "特殊字符",
    condition: "input",
    insertBefore: "spe-charaters",
});
SPE3([{
    label: "©®™",
    input_text: "©®™"
}, {
    label: "のあぃ",
    input_text: "のあぃ"
}, {
    label: "•",
    input_text: "•"
}, {
    label: "×÷",
    input_text: "×÷"
}, {
    label: "≠≈",
    input_text: "≠≈"
}, {
    label: "↑↓",
    input_text: "↑↓"
}, {
    label: "←→",
    input_text: "←→"
}, {
    label: "»«",
    input_text: "»«"
}, {
    label: "「」",
    input_text: "「」"
}, {
    label: "『』",
    input_text: "『』"
}, {
    label: "℃℉",
    input_text: "℃℉"
},]);
// 输入右键菜单 End ==============================================================
//隐藏相同项。必须，不能删除
function syncHidden(event) {
    Array.from(event.target.children).forEach(function (elem) {
        var command = elem.getAttribute('command');
        if (!command) return;
        var original = document.getElementById(command);
        if (!original) {
            elem.hidden = true;
            return;
        };
        elem.hidden = original.hidden;
        elem.collapsed = original.collapsed;
        elem.disabled = original.disabled;
    });
};
