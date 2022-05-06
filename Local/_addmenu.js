// =====================addmenuplus 配置 runningcheese 版======================

// =====================右键菜单定制======================
//复制所选
page([{label:'复制',id:"context-copy",condition:"select",accesskey:"",clone:false},{label:'粘贴所选',id:"context-paste",condition:"input",accesskey:"",clone:false},{label:'剪切所选',id:"context-cut",condition:"input",accesskey:"",clone:false},{label: '删除所选',id: "context-delete",condition:"input",accesskey:"",clone:false}]);



// 页面信息右键菜单
new function () {
	var items = [

{
    label: "编辑当前页面",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAzklEQVQ4y73SIUuDYRAA4FMeNK9Pqz/B4mSbQ2Wg/8E2g+CPEctYXzcZrNaJQYMsj7kiBmHwhZULMsTt+8KuvO8dPPDevRexqUALL/jCHXbL4EvMcY09POC+DP7EIM8mapiXwYeZn2R+hY9S+Fd9mO20quAjzNCtghuJz6vgduKz/3AXP2gs1TuJ26uG9pqL8o6DrJ0mbq7C+5hiGz2Ms50Zjtf57xv0876DEb6X2/krthI9RsRbRNQi4iIixhFxWxTF87rrOsFTvqQem4wFTec0RRu9Et4AAAAASUVORK5CYII=",
oncommand:function ()
				{gBrowser.loadURI("javascript:document.body.contentEditable%20=%20'true';%20document.designMode='on';%20void%200", {triggeringPrincipal: gBrowser.contentPrincipal});},},
{
                label: '解除网页限制',
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIVBMVEUAAAAAAAC4uLjb29tmZmY6OjqRkZHr6+vIyMiurq6enp6fJmq8AAAAAXRSTlMAQObYZgAAAGVJREFUCNdjQAJMS5MawHSgoKAYiFEYwMBg6ABkhACxYhhQJgCIhQwNGFgTgAIKLAkMjAZAAQY2ByADKMDABGIABUAiLAlAAQZWoKCQEEg/EDsCBZhBHBYhY2MgBwgmCgoGIbkBAF+5CxbmrSXzAAAAAElFTkSuQmCC",
                oncommand: function() {
                gBrowser.loadURI("javascript:(function(bookmarklets)%7Bfor(var%20i=0;i%3Cbookmarklets.length;i++)%7Bvar%20code=bookmarklets%5Bi%5D.url;if(code.indexOf(%22javascript:%22)!=-1)%7Bcode=code.replace(%22javascript:%22,%22%22);eval(code)%7Delse%7Bcode=code.replace(/%5Es+%7Cs+$/g,%22%22);if(code.length%3E0)%7Bwindow.open(code)%7D%7D%7D%7D)(%5B%7Btitle:%22%E7%A0%B4%E9%99%A4%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E9%99%90%E5%88%B6%22,url:%22javascript:function%20applyWin(a)%7Bif(typeof%20a.__nnANTImm__===%5Cx22undefined%5Cx22)%7Ba.__nnANTImm__=%7B%7D;a.__nnANTImm__.evts=%5B%5Cx22mousedown%5Cx22,%5Cx22mousemove%5Cx22,%5Cx22copy%5Cx22,%5Cx22contextmenu%5Cx22%5D;a.__nnANTImm__.initANTI=function()%7Ba.__nnantiflag__=true;a.__nnANTImm__.evts.forEach(function(c,b,d)%7Ba.addEventListener(c,this.fnANTI,true)%7D,a.__nnANTImm__)%7D;a.__nnANTImm__.clearANTI=function()%7Bdelete%20a.__nnantiflag__;a.__nnANTImm__.evts.forEach(function(c,b,d)%7Ba.removeEventListener(c,this.fnANTI,true)%7D,a.__nnANTImm__);delete%20a.__nnANTImm__%7D;a.__nnANTImm__.fnANTI=function(b)%7Bb.stopPropagation();return%20true%7D;a.addEventListener(%5Cx22unload%5Cx22,function(b)%7Ba.removeEventListener(%5Cx22unload%5Cx22,arguments.callee,false);if(a.__nnantiflag__===true)%7Ba.__nnANTImm__.clearANTI()%7D%7D,false)%7Da.__nnantiflag__===true?a.__nnANTImm__.clearANTI():a.__nnANTImm__.initANTI()%7DapplyWin(top);var%20fs=top.document.querySelectorAll(%5Cx22frame,%20iframe%5Cx22);for(var%20i=0,len=fs.length;i%3Clen;i++)%7Bvar%20win=fs%5Bi%5D.contentWindow;try%7Bwin.document%7Dcatch(ex)%7Bcontinue%7DapplyWin(fs%5Bi%5D.contentWindow)%7D;void%200;%22%7D,%7Btitle:%22%E7%A0%B4%E9%99%A4%E9%80%89%E6%8B%A9%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%22,url:%22javascript:(function()%7Bvar%20doc=document;var%20bd=doc.body;bd.onselectstart=bd.oncopy=bd.onpaste=bd.onkeydown=bd.oncontextmenu=bd.onmousemove=bd.onselectstart=bd.ondragstart=doc.onselectstart=doc.oncopy=doc.onpaste=doc.onkeydown=doc.oncontextmenu=null;doc.onselectstart=doc.oncontextmenu=doc.onmousedown=doc.onkeydown=function%20()%7Breturn%20true;%7D;with(document.wrappedJSObject%7C%7Cdocument)%7Bonmouseup=null;onmousedown=null;oncontextmenu=null;%7Dvar%20arAllElements=document.getElementsByTagName(%5Cx27*%5Cx27);for(var%20i=arAllElements.length-1;i%3E=0;i--)%7Bvar%20elmOne=arAllElements;with(elmOne.wrappedJSObject%7C%7CelmOne)%7Bonmouseup=null;onmousedown=null;%7D%7Dvar%20head=document.getElementsByTagName(%5Cx27head%5Cx27)%5B0%5D;if(head)%7Bvar%20style=document.createElement(%5Cx27style%5Cx27);style.type=%5Cx27text/css%5Cx27;style.innerHTML=%5Cx22html,*%7B-moz-user-select:auto!important;%7D%5Cx22;head.appendChild(style);%7Dvoid(0);%7D)();%22%7D%5D)", {triggeringPrincipal: gBrowser.contentPrincipal});
                }
                },
{},
{
	label: "开启阅读模式",
  tooltiptext: "快捷键Alt+E",
	oncommand: "ReaderParent.toggleReaderMode(event);",
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIElEQVQ4jWNgGB4gNTX1Pzl4oN2NBEa9MBjAEHMutQEA6URvK/bX0hAAAAAASUVORK5CYII=",
	},
{
		label:"繁体转为简体",
			oncommand :
				function ()
				{
					gBrowser.loadURI("javascript:(function(){var%20s=document.getElementById(%22tongwenlet_cn%22);if(s!=null){document.body.removeChild(s);}var%20s=document.createElement(%22script%22);s.language=%22javascript%22;s.type=%22text/javascript%22;s.src=%22https://git.oschina.net/runningcheese/JiathisQR.js/raw/master/bookmarklet_cn.js%22;s.id=%22tongwenlet_cn%22;document.body.appendChild(s);%20})();", {triggeringPrincipal: gBrowser.contentPrincipal});
				},
		image:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAACVBMVEUAAAAAAADs4udxvSaxAAAAAXRSTlMAQObYZgAAABtJREFUCNdjQADW0BAgycaAi2ANAbEccBMgAABgfgLQN3XpGgAAAABJRU5ErkJggg=="
	},

{
		label:"双语网页翻译",
			oncommand :
				function ()
				{
					gBrowser.loadURI("javascript:(function(){var%20s=document.getElementById(%22tongwenlet_cn%22);if(s!=null){document.body.removeChild(s);}var%20s=document.createElement(%22script%22);s.language=%22javascript%22;s.type=%22text/javascript%22;s.src=%22https://caiyunapp.com/dest/trs.js%22;s.id=%22tongwenlet_cn%22;document.body.appendChild(s);%20})();", {triggeringPrincipal: gBrowser.contentPrincipal});
				},
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7ElEQVR42mNkwATrgXg/EE9iIAIwYhETAOKDQFwOxDuIMeA/A3FgFhCnE+MCZBAMxI1ArEOMFw4AcTIQ30USOwrEcWhiOA2wBeIOILaG8j2AOAKIE0gJRJCmQCC+CsThQOwNxB9IMUAAGoXfiNGMbIA8EG+BBpYnEN8G4jtQORVoGChDxUKAeC22aFTBEViggLSCpg1WIOYEYiN80fgfjzjIkkXIMUOsAaD00ATE2kCcB8RuQOxDigEgb8wA4s1ArADE54FYEBTIuAwgJrm3A3EVIxF5YCaUbgPij1C2MxCvARlOjAG4AvUcKDYAi+YxEXgzorIAAAAASUVORK5CYII="
	},

{
	label: "http 转 https",
	oncommand:function() { gBrowser.loadURI("javascript:(function(){document.location.href=document.location.href.replace('http:','https:')})();", {triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(), });},
 image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgGCrAjoGB4ReUptgQf3yK/hOJyXIJUS4gpNmBHM1k20aWP/0p0WzHQHws0MYFMOBADUOGEAAAtLMgYRGzlKoAAAAASUVORK5CYII=",
	},
{},
{
		label:"页面自动滚屏",
	oncommand: function() {
               gBrowser.loadURI("javascript:var%20_ss_interval_pointer;_ss_speed=3;_ss_speed_pairs=[[0,0],[1,200.0],[1,120.0],[1,72.0],[1,43.2],[1,25.9],[2,31.0],[4,37.2],[8,44.8],[8,26.4],[16,32.0]];_ss_last_onkeypress=document.onkeypress;_ss_stop=function(){clearTimeout(_ss_interval_pointer)};_ss_start=function(){_ss_abs_speed=Math.abs(_ss_speed);_ss_direction=_ss_speed/_ss_abs_speed;_ss_speed_pair=_ss_speed_pairs[_ss_abs_speed];_ss_interval_pointer=setInterval('scrollBy(0,'+_ss_direction*_ss_speed_pair[0]+');%20if((pageYOffset<=1)||(pageYOffset==document.height-innerHeight))%20_ss_speed=0;',_ss_speed_pair[1]);};_ss_adj=function(q){_ss_speed+=q;if(Math.abs(_ss_speed)>=_ss_speed_pairs.length)_ss_speed=(_ss_speed_pairs.length-1)*(_ss_speed/Math.abs(_ss_speed))};_ss_quit=function(){_ss_stop();document.onkeypress=_ss_last_onkeypress;};document.onkeypress=function(e){if((e.charCode==113)||(e.keyCode==27)){_ss_quit();return;};if(e.charCode>=48&&e.charCode<=57)_ss_speed=e.charCode-48;else%20switch(e.charCode){case%2095:_ss_adj(-2);case%2045:_ss_adj(-1);break;case%2043:_ss_adj(2);case%2061:_ss_adj(1);break;};_ss_stop();_ss_start();};_ss_stop();_ss_start();", {triggeringPrincipal: gBrowser.contentPrincipal});
},
		image:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABHRSTlMAPvpPlVb7NgAAAC1JREFUCNdjQAEshBmMLIwQBpOIEFRERREqZ2IAU4RqqgsYgMxwACE4AyEFBwC6ugU6mH43HwAAAABJRU5ErkJggg=="
	},{
		label:"页面自动刷新",
	oncommand: function() {
               gBrowser.loadURI("javascript:(function(p){open('','',p).document.write('%3Cbody%20id=1%3E%3Cnobr%20id=2%3E%3C/nobr%3E%3Chr%3E%3Cnobr%20id=3%3E%3C/nobr%3E%3Chr%3E%3Ca%20href=%22#%22onclick=%22return!(c=t)%22%3EForce%3C/a%3E%3Cscript%3Efunction%20i(n){return%20d.getElementById(n)}function%20z(){c+=0.2;if(c%3E=t){c=0;e.location=u;r++}x()}function%20x(){s=t-Math.floor(c);m=Math.floor(s/60);s-=m*60;i(1).style.backgroundColor=(r==0||c/t%3E2/3?%22fcc%22:c/t%3C1/3?%22cfc%22:%22ffc%22);i(2).innerHTML=%22Reloads:%20%22+r;i(3).innerHTML=%22Time:%20%22+m+%22:%22+(s%3C10?%220%22+s:s)}c=r=0;d=document;e=opener.top;u=prompt(%22URL%22,e.location.href);t=u?prompt(%22Seconds%22,60):0;setInterval(%22z()%22,200);if(!t){window.close()}%3C/script%3E%3C/body%3E')})('status=0,scrollbars=0,width=100,height=115,left=1,top=1')", {triggeringPrincipal: gBrowser.contentPrincipal});
			   },
		image:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEUAAAAAAAAfEgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQf2vJAAAAEXRSTlMAHw17Z1b3ybmFRSnn0qgynGqaBMMAAABoSURBVBjTbY/bCoAwDEN725zzMvP/PyuVrVMwD4FDS0IotF30lRw6gddlX1bUwZqNhRU2uIhnIHVu2ZnSYDotsqy4g2c43CGzGr8f5ZVxuteokNz6JWFzLjo+oSxsOcZUPFuYQnpE9Q1ElwJ0eM5iRAAAAABJRU5ErkJggg=="
	},
		{
       label: "恢复默认窗口",
       tooltiptext: "注意：需要根据自己屏幕的大小手动调整数值",
       oncommand: function(e) {window.innerWidth=1240, window.innerHeight=740; window.moveTo(100, 50);},//可视区域居中
       image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgUlEQVQ4jd3Orw3CYBCG8V9JJQMgKjoCkoQg2IRRukMHqEQiOkM9IyBwFYzQGkB8yaVNERDe5HJ/nrvLy7eV4YxdwAvcA3bDEYYETPV9Oh9mRP/Mj6QHl8DilGrIscEpWNqjC1j5KpqFDipYLTx+6w8eZGixDvgW14DlOHxq4Ac0Am4mHKhHtyEUAAAAAElFTkSuQmCC"},
];
	var menu = PageMenu({
		label: "多功能菜单",
    id:"Multi-functionMenu",
		condition: 'normal',
		insertBefore: 'context-openlinkincurrent',
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABBJREFUCNdjgID6fxCaIBcAcUwEeC1dweYAAAAASUVORK5CYII="
	});
	menu(items);
};






//当前页面
new function () {
	var items = [
{label:'查看页面元素',oncommand:'gContextMenu.inspectNode();',image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXklEQVQ4jaVTQQ4AMATzFq/y/49sFxIRoWiyU9eWDaIar+FLsBrwVCgqjEcmYku1Fqya0iSKvQFkgvRrJjiBBGUP5jnk3q2ClkCDzr+QmYzmIJqsJtFjvQsep22E8AGEZDOcIlQ9sgAAAABJRU5ErkJggg=="},
	{label:'查看页面信息',oncommand:'gContextMenu.viewInfo();',image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhUlEQVQ4jWNgGAzgP4UYQlBgOcKAuWv3/ZdU0v4vqaT9f+7afcQYjGqAiLwm3GlQNtUMwOp3rF4Qkdf8LyKvSboX5q7d919CURuuCS0cCLsAqvn/3J1X/s/deeU/AwPDf0klbUKuQBggJKuJYQtSOBB2wazVe/+jByIR4UC9hERRUh5YAAC4EIMapwmRSwAAAABJRU5ErkJggg=="},	
	{label:'查看页面代码',oncommand:'BrowserViewSource(gContextMenu.browser);',image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVQ4jdWRsRGDMAxFX0nBAC5oswFDpGAUSjZIT5sBXLJZuKPyABTId0KxgHRBlfyl9627D3ep5pfll3k/gOTMinAyWg+8pU9HJqMsBKN/gE76IDvjVbgSg1ppXyYeDPAE5oK+M4nAYn7JFYGhoNfCTFmYHJPElsIh7Jno+E5hfXKGdHz6oujB2gT28dnZpWrZYvzzWgGWLic48BXAeAAAAABJRU5ErkJggg=="},
{
		label: "查看页面链接",
oncommand: function() {
               gBrowser.loadURI("javascript:if(frames.length>1)alert('Sorry,%20frames%20detected.');else{var%20wnd=open('','lnkswnd','width=400,height=500,top=0,left=0,scrollbars,resizable');var%20lnks=document.links;with(wnd.document){var%20s='<html><base%20target=_blank>';for(var%20i=0;i<lnks.length;i++){s+='<li><a%20href='+lnks[i].href+'><span%20onClick=window.close()>'+lnks[i].text+'</span></a></li>';}s+='</html>';writeln(s);void(close());}}", {triggeringPrincipal: gBrowser.contentPrincipal});
			   },
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4jWNgGFbgPxQjswnhQQZGvTAYwDDwAlkAAEEYL9GD9eUiAAAAAElFTkSuQmCC"
	},
	{label: '查看页面图片',
	oncommand:function() { gBrowser.loadURI("javascript:outText='';for(i=0;i<document.images.length;i++){if(outText.indexOf(document.images%5Bi%5D.src)==-1){outText+='<tr><td><img%20src='+document.images%5Bi%5D.src+'></td><td>'+document.images%5Bi%5D.height+'</td><td>'+document.images%5Bi%5D.width+'</td><td>'+document.images%5Bi%5D.src+'</td></tr>'}};if(outText!=''){imgWindow=window.open('','imgWin','width=800,height=600');imgWindow.document.write%20('<table%20border=1%20cellpadding=10><tr><th>Image</th><th>Height</th><th>Width</th><th>URL</th></tr>'+outText+'</table>');imgWindow.document.close()}else{alert('No%20images!')}", {triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(), });},
	image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA90lEQVQ4jc2SK27DUBBF3xoM3ufcMkMvIKspC8sKQgIDvJawlliBhsEhlSoZmRgFRDKJVDIvSh03lULakQaMZubM17l/KSGEBVBL2knaAXUIYfFrIrCU1EsagSPQmB4ljZL6lNLrT8kNcJa0fVCgNvjb1NFK6r33pXPOee9LYG9VR6CZ+IYrJKW0Bk45wIB7oIsxVjHGCuiANvsNcgZWDjgBq9uOJI0xxirbBrlMut4AgzPS8hHAKn4D5M4zaTpCK+nTe18WRfEi6QM4zI6QE4BusqgWuJgeZpbY3F3CqJv7A15H29qp32cDgBUwPPVIt/L0K/+JfAFStWPClMt7cwAAAABJRU5ErkJggg=='},

];
	
var menu = PageMenu({id:'ContextMenu_ViewInfo_New',condition: 'normal', insertBefore: 'context-openlinkincurrent',onpopupshowing: syncHidden });
	menu(items);
};








//复制链接文本地址
new function () {
	var items = [
{	
    label:"复制链接地址",
		oncommand:"Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(decodeURIComponent(gContextMenu.linkURL));;",	
		 image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyUlEQVQ4jbWTLw6DMBjFfwaDmauq5QhY9C4wyQWQOA6whAtwBS6wO0xOzeKQO8REH6EUwsqWvaRpk37vT7+28AfYX8gZ8NIcIgf6GJESGAATpBqAc2ySFrgDCZACD6CKJU/oNW5Ad5SMnEdc9OQbgQp4SqA8QsyAWu6W+WZaoPhEblQ8sGxah+vFKKHdyFbFl0C4A064G6lDsmV+QIWc0o19G6xXDkbxffcJtdyNaht/0z/jKp6Hq2pWbyPDNSffIU8oJLT1X47jDR7gLDGf5CLwAAAAAElFTkSuQmCC"
	},
		{
		label:"复制链接文本",
		text:"%LINK_TEXT%",
		image:" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jWNgGCzgPxZMSA2GJKkWEmXAfwYGBg9yDfBgYGCYCcXEWogCjjIwMChDaZIBssY8KCYJ5DGghjhJrlBmwPTjTKg4ToCsAVvAeaCJ0S8dkGQARUl54AAAWsMsNkwmkt8AAAAASUVORK5CYII="
	},
{
		label:"复制链接文本和地址",
		text:"%LINK_TEXT%\n%l",
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII="
	},
{
    label: "复制链接HTML",
		text:'<a href="%l" target="_blank">%LINK_TEXT%</a>',
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEUAAAAAAABmZmbc3Ny3t7eRkZE6OjpRDxSxAAAAAXRSTlMAQObYZgAAADJJREFUCNdjwASCECDAIADhY2UwMQoKsgqAGUyMJiAGoyATYzJMhEEYxhDAoh1hBQYAAPxVA4qkxzcpAAAAAElFTkSuQmCC"
},
{
    label: "复制链接MarkDown",
		text:'[%RLT_OR_UT%](%RLINK_OR_URL%)',
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEUAAAAAAABmZmbc3Ny3t7eRkZE6OjpRDxSxAAAAAXRSTlMAQObYZgAAADJJREFUCNdjwASCECDAIADhY2UwMQoKsgqAGUyMJiAGoyATYzJMhEEYxhDAoh1hBQYAAPxVA4qkxzcpAAAAAElFTkSuQmCC"
},
];
	var menu = PageMenu({ id:'context-copylink_new',condition:'link', insertBefore:'context-openlink', onpopupshowing: syncHidden });
	menu(items);
	items.forEach(function(it){
		if (it.command)
			css('#contentAreaContextMenu[addMenu~="link"] #' + it.command + '{ display: none !important; }')
	});
};

//打开链接的各种方法
new function () {
	var items = [
{
			label: '当前标签打开'
			,image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWNxwqAAAAB3RSTlMA6xeSuwaF7u2ifAAAADBJREFUCNdjwASshuVAUGjKwOwE4jK5MTAqgCUUGdghKtixMtiBuuAixDLKIQBuOQBI1gi6H+1sQAAAAABJRU5ErkJggg=="
			,oncommand: 'document.getElementById("context-openlinkincurrent").doCommand();'
		},
{
label:"侧边栏中打开",
id:"context_TabFloatSidebar",
oncommand:'document.getElementById("side-view_mozilla_org-menuitem-_open-link-in-sidebar").click();',
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4jWNgoALwZGBgeMbAwPCfRPwMqpfhGQMDgzWJlh6B6nnGADWNXPAfRlCCMVxAiotGDRg+BqAnZWINgCdlijMTRQAA+35MwhZlde0AAAAASUVORK5CYII="
},{
		label:"隐私窗口打开",
		oncommand:"gContextMenu.openLinkInPrivateWindow();",
	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyUlEQVQ4je3RIUzDQBjF8V9CMotEoTCYufopBBqLx1ZOYiZn0JVIVC0WXTuJm6mqmpmY6Dt2CYIESXjJ9a7/vn7fvTv+hJ6wRocPTNhnfg+fcMCA1/gfsIIjtmgLiC5SfIPrsCZsiz6F58cvNcInbgJKhBHPlXEd3xgPLLGTnPeBh2T7qh7tMz/GI76+VH+p4JBd1NHK+1A16Mzn5iod7n4KXGmVfy4LaALawAVus7s260W+tYn3reHS+Wom8wF1Gbtkn/AW77+iE6SaONczlmqVAAAAAElFTkSuQmCC"
	},
   {
		label:"IE 浏览器打开",
		oncommand: function() {
	try {
		var path ="/Applications/Google Chrome.app";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));
		var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		process.init(file);
		process.run(false, [gContextMenu.linkURL], 1);
	} catch (ex) {
		alert("打开IE失败!")
	}
},
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEElEQVQ4jZXSnVuDYRQG8B8EQTAIgkEQBMEgDIIwGA4Hg0EYBMH+gyAIh0EwHIRBEARBEAzDwWAweIP3bD17rmd9nOu64X3ec9/3+eJ/cYpL9DHAwabEHZyjG7jAbQik0SsRHzBHlWGBYebaSclNvEfyFK8FkQoznCSGqxhGwmP0t9ggsBTZS8n7QbjHVSQ9oRUu3UJbN6lAB2O0E+d+CC/xnAnMU4F2uM1+KLuEtRmMs5+fmPyCZlpBrn5mPY7Ud5BiFXl/FUZoJOS8vdGS3PC9+1xkirfC+yJmhnoDFQ7Vq/vL8Ppp+YMYCPVUr+O7RPyQna9Qm2RvLfWh9MKgi2Ns5WTYxot6bXfhsFtKLMUX/+qC1cGn0mkAAAAASUVORK5CYII="
	},
{
		label:"Chrome 浏览器打开",
		text:"%l",
    tooltiptext: "注意：需要手动指定其他浏览器.exe所在路径",
	oncommand:function() { var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath("/Applications/Google Chrome.app");file.launch();},
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACSklEQVQ4jX2QT0jUcRDF35ufbq5pEiVRUGSUFYIV7hpCoQsiq0YUdSvBwFCoUDqU9G8LPAR1rhYEUY+ZBK6hIatLoRVmFCQdOiTZIbwklbnib6aDf3bdjR58YRjevPnOh0jRTFmZ31VtErJCzXYAgABTJjIsZDh/dHQ82c+V4nt5eQ7j8Qcg61JDk2VA+5zHc6kgFptfDfhWUpKd6fFEARz+33CShvJnZ2s5ObkgAODNytoMoDjVpYCpqvuPF5jJy2sDANb0VAUU4u26/8MH8g4AmFnUHOf6dFHRW184vAjSAMCGyzPWbKiIuQz2BrsI+M8N/fFXTMTfA/jcerThdP9W/z0SZ1VBEt1NBdHWm7ueDwqkNMHDHgoNRwjs66hcV0+ghWRzZJvvLolGAOtFkE2iMfwl0CZ0WtYCtUqhYfvSwXK74eqWF/ljY58EPJOGTVknxZExVfuVaMpOWSkp2LRg87eW3ZI6D4Et77VEqJoY8XU1BLxY21O5R8HutABDp36o9olIblLoVAaJEQAFy61ME+fRxoXxE7Men0FZB4HB0JnjeK+YyVMmZRISZW1vValBXq+9V2NCXo6cGpwIhUICAKGTb2pA6UtYYCL0EQCqnwQ7SNSncVP9KSKv+gtzj7mLvz8KuTtxEcLOgf4mAQAnM+MCVF+mc5Mcc3nN3LmWlOFhet3mJQ+AyPHIXLa7oQpAOxSrlI3ofLaf06p6Y+XbBoTpdaulcCC+xCFFwcfBQyJ2Xg1lok51316ETBmgYITmhuXgwLtk/198KfCC5H3+pQAAAABJRU5ErkJggg=="
	},
	{
		label:"Edge 浏览器打开",
		text:"%l",
    tooltiptext: "注意：需要手动指定其他浏览器.exe所在路径",
	oncommand:function() { var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath("/Applications/Microsoft Edge.app");file.launch();},
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACGUlEQVRIibVWr28TcRR/4kQX2vW+7yoQiMoJBAKBqKhATCD4ExATkxMENfFNJknWZL33vkGQCgQJE4glTCAqJiYqlqwp1/u+bzKxBASiAlExUQS90vau15aVT/Lc+34+7/cdwBIoimuK7Ftke6lIBopkgMZ10NhTDOO90ru4sowjEz7HLxW7G2QZLbGhH8rB6szUKwZsz1YgnrGA7dnybKhXVOQu1iWfmLG3leP+08VlMdLMeqjY/vRZ2mhcS5GcI8mPxSKuA1p7afJGVJ+LJkJ2R4riWspZay8g+wpZhlkiZe7vpwVY2sgyUmTvsBlp0NoDrT0/lIPMiACgzP39zIxJBjP92DqRR2PyK5/sk6QfyO4rsm3ktQ2Nvc1semgPJ05BaA8VuQugXhEA4AH1HqJxHWQZbZ/IszyBgOIPCxp+OuXkTEIOAOCTfJ44ktv1G1F9kSmS8+zBkO7fMKbIFcW1fx7TOctMOWn2fxGovOmX0LjvmxKovO+XZgRKzXhnU+TIMkyXZ37ZWEZV3S7kTdFaKJpvj1Np5t2WdVHV7UJ63NzHjQkAACiWbtbSrFKqqm4XlIle5DqNj1jGfbFX2LSvJ6ckgdZewPY5GtdCsr8Wzn+CMl8rxfLlXvN//GkrVwTJ7Sqydxvd4Hn4jaie+2G5rwDA+KqyvVxnuZDd0coC0yVD41qKpavY3Uzbn18Y18Iw3ps+mgl+A9E4JERQR7sXAAAAAElFTkSuQmCC"
	},
	{
		label:"Safari 浏览器打开",
		text:"%l",
    tooltiptext: "注意：需要手动指定其他浏览器.exe所在路径",
	oncommand:function() { var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath("/Applications/Safari.app");file.launch();},
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAASG0lEQVR4nN1baVBUWZbO6umJ6OmYmZiZnh/TE1UTMz3Rf3qiZyKmeqJ/dBUvt5eZL1lFE9eyXEoU3nu5gKioIIuyJCAIliggIKXlrqUIAq6IiohIJsmSyOKCC65sQr5c4JsfSSaZJCAq4PTciO9H3rxx7/3OPffec849j8ebwxITc+XnEknYFyJZyH+SVAghkjABXmI2kJQpRaRc8wcvH+VvvwwO/uVczmlWi1we+k9eUna5QMZkCrxVdwQyliNIGlNCTI8IKWWrQKYs8pIqVV5ize95PN5nn5rLtItIRP+KEIeuEVOqKj5JjxASBv7L461r435EVNF1JJ1pRPrFTuypfo58wwAKmoeQq+vBnurnSCu/h+gfbkCZ+hMWMhlWkVxlI0gaQkrZTpBsrIhif/ep+U1axOKN/yKQsHv5EtYqpFTDqzbljySc1iNP34eiVvMHobB5CKnnjQjZcQTkvPUWgqRBSNlrYpma/6n5OgsVyH4ukilzBTLGFrA83rIp5xJydT1OEgdazcg3cigwcjjaYcb3jRyyDBwyDSbkNHMoeWhBpsGELAOH7xs57G3mUNFlQb6RwwFXYbSYsP3EXSiCUywESUMgYa9/akF8JpSqvxNQqiH5gk226EM3ccDIoWiUcHYTh4wGE1J0dhy8Z4axx+b8naIz4cc2M5rfuNcVtnJo6x3GTr39d0aDCXuaOOSP9l3Uaoa2tAXz1yRZCZIGn2RzqaXs384pcyqQ/VzkHXZZLFfZNBnFyDcMoHCU9E69CQVGDqc6zW7E9jRyaO8bRnYT56w73GZG0zgBnLlvQd1L97o0vQmnOs1I19uFUWjkcMDIIepAFciA9RaBTPVUJKHJOSFPksyfhHJVv9/SWGtW1WMUGDnsbuSQqnNf7dZeG3a5aECKzoSWHhsOt5mnFMC1p1ZcemxxqzvWYUZLjw1p+rG63Qb7tsqpe43FygwrQdIQSNnNvNm8MYQkPU8gVVlXbsofyWvoR3aTnfipTrObuqfqTWh8bcPp++5Ebj23oviBxU1Q+lfuArjzwopjHe7aU/fShvIu9772NXP44Z7ZqRHhWaUgSAYCKZsTE3Pl5zNOXiRjQgmSGdm49wLymk3OPZqiM+HuSxuuPLG6TbD4gQW6ceS+b7Qffq51GQ1T/97f4rl10vUm6F/ZUDEqlJ16e7uYwzUQUsphvpQ+r1Bo/mrGyAvkqiUESSMy7xL2ukzEgbzRSR68N7ZyWQYOVc+sbmr7ITjRYfYQbnmXBYbXNg9h7W3ikHS2ESK50kbI2JM84GcfTV4sDv1KKGNsEXvKsbvRk7wD5x9Z0PjGhvSPJPwuODSisNV9LluK72FbxQPsNnCIP3EXfJIeIaRs2keR9/JR/lZIqQbU6WeRZbAPuMtgQsNrG/KN7hPYqTeh7JHFY1VmGjnNHE64nBHau4NYk3QafJLBuozzSNGZkGkwYWPuZRAkDaE4lPkg8itWxPxC7K3pWMxm2TLHkarossDYY8P+lsk1Yi4Qe/kJAlclgiBp+C+LQ3LdW+d/mQYTQhKPj/BJxiqQav7jvQUgppTbJQHrbWk3X0w4+IVRIeQ0fxohqAtugpSrwSdpCKUstpXf92iTpXsLv2VxVr5UVf/ll8F/OW3yIor9nVDGDkcfvYMUnQnpDaYJD7+ShxYUtZpnleh4JNT0YNmGPAgkDKJ9aYikDEKyKjzaObZiUkU7CAkz4iVWbpkee+BnYm9N7YqIXJvjBC9qNaO9bxhljyxu199cY0vxPfgoNmOBtxIXFDSWeSuxYG0qtPVDbsQvPLagrdd+S6TpTWBTfwJB0hbSb8M/v1v1par5fJIeSbj80G3wolYzGl/boHtlQ+4c731t/SDW7jwHgYRBlD+L1kU0dvjRkHhrEF/Z7WxX2Mqh4bUN+lc2FLgc0ul1fSD9IqxCMjTj3QLwDbu7IrJwZKKJZDSYcPmJ1cMqm03EV3ZjwZpUSGUsTgbSeLiYxvH5NPgSBmFFNc52aXoTmt7YLcaJrmJV1nkQMqX5a2nwryff+yLV/xASZiTuUtcnU3NXhB+shdQnDKt9lTAstJOvUtAIlLNYtiHPo33qFNsz+XYvxP7hFiFJp04uAB/N8SXh+2yOzk51mt1M0LlCUm0fvt1SBD5JI8ufxtMlNB4tplETRGODDw35/E1IvPVmWn1lN3FIHz0Q12l/Ap9SvlQoFH/hQT4gIObvCCk7HFZ0y75vGkyofWFFe98wbnZbcfCe2c3jmy1ElXbAd1EUAuRKXFXQeD5K/nYQjYJ5NPgkjU2nmqbsY6fehCPtZtx+bp+/wwONqXgAgqQxYSDFS8wGirzVw4k1vW6d5bVwuPLEinu9nh7ZTEJbP4TQzHIIpSw2+LLoWOxO/oKChlymxKrtx6bsJ1VnguG1DcYeu7O0b5yd4rs01uxFhmZ7CEAgV+UtCc8enqzjTIPJw5ObKWyveomg0AyQMhZHAml0L7GT7xolfzOIxjofFn5LY5F8Z+Cd/eUbx9R+PEJ2noNQwr7ijYsbfCby0XQr91fNuoqPR8SResj81mO5jxL1C+3EXclXB9HI9J/c2ntfbDnbCoKkIfFl/s3J/ivvkN8QJI2o0g6k6OwhratPrfjpvgWFRm5WHJzk2n6sjP0RfAmDNH8GT5aMkX/kQv7cAhriSay96SCjwc7ncJv9DEuq7QchYUbEUtX8sbtfrJISEmbEoV7ZTRwuPrbH5tp6h9HWa5vR2yC6/AH8l8bCj1Lh4oIx4uPJ3wiisdSbhWKdu7U3HRxtt0eb2vuG0d43jDsvrM5t4bMkbkggYRLG9r9EGUwtiuYm6min3uRxkHwMViecgJBiofFVom2xO/muJTRqF9rJVwfR2D6BtTdd5LXY3eb9LZyH+b5sY76FkISWugiASVio2WubaTUfj80/tYBP0qAoJfQLx5FfTOO2C/ljo9ae5sCtGZ/H6sST4MtV9U4B8Cnm8DdbDswq+YSaHngvikJ8UiHUG3Zhnq8GDQsnJl85au0tjcidlbmEZJRBIFPdH9MASl22fNshZ4MCI4fC1lEYOeyZIhQ2XXyzuRCKb6Lx6nUvenr7nUK4G8Q497wDG3wYyAM3Ttvamww79fYAarrePYjL5lSCkClfj5nAvutLV8YdcTZo7R07PByW4MdMJKyoBnwpi7u6VgwOmTA4ZEJPbz+U6zPg56NGyfwx8tO19t6FnGbOjUN737AzlBZWVAO+hDG5+ABhp1bumNrC+lDEV3ZD6r8euflnneQdAtA13EMwo4Wft10IDmtv9TusvfcRQl7LGBxaoMq7BqFMNaYBhFx1yHULzBS09UMIonfhO1qL/oFBJ/nevgE0tXRC39iOO/VGBDNa+HqrsVo+fWvvYxCSVQG+TNXpcgvQe4OUWZOawR8a2w/JqgDpo0F7x+MJyTtwvVoPn8AI8CX0jFh778Ia7RkI5Ko7TgEIxbTae/E2s6vqFD+w4NpTKxpe28+D3Pe0BaLLOiGkVDh9tnJK8qfPXYP/wkh4L47GhqO6GSGYpjfh+jP7G+OJDjNyWzi3RVy+7UerF8meGzsDJDQpkqtsDmurvMuC2hdWXBztIO89Q2DJdwYQ8O0ObIzKxtvBoQnJ6wz3oN15EHwJi28iCzHeC/1YnOw0o/Kp1WkNur5B+q1IekuQ9A6nAL6WBv+aIGnEXX02I4Ov2nEM/opIPOt+hcEhE/r636LZeN9J/kpVPVYGJ4D0DYOmsHrWVX5Xg8lpymvrByGilDYhSc9z8wYFlKpfmVv50YNtPGEAX8Kg6obOhfzYyhcdOg+pXxgC12gRe/nJrJMfj23l9+3eoCTsC7d4gJBSn1kUnjNpMPREh3nCtwFXJFS/gVyxGWm7jniQr61vwabofeBLGHyXdBrau4OzRnKyWECKzgQm+zL4MtXL8fEAnkhGLxL5hFu19WMTy2vhcOmxBa29NjS+cQ81j4e2fghLI3KwdFUc3vT0o7d/wEm+tKIaimXRoBZEIvJU46yucKreBGOPDbdfWHGk3exxgwWsSeW8pMrdvPHFz2/V3/AlSmvkqWak6OwxdocVeKjNPGXENUVngqrgBoSUEoamDvQNvEVL633oDG3IzD4OoYzFIk02dtz8ONN2ushu4lA++nTX5LJw26+9AJ+kR0iS+ZOHAHg8Hk9MqcsWafYMp+jssTXHi/C7EHflKUjfcPxwqAx9/Xby1281IESZCpFcBWbv5ff252dqKxzvMDt9mZDMMgilqu5J8wZEVOgCQsKMxF6Z+DbYqbe/B7qmsGjrB7FgbRpoTTp6+gbQ0nofR09dgs/8DfBfHo/o8gdzQjavhcPR9snfKbX1g5AFRZkEUmXchOR5PB6PB/xM5K3pWL7toEcH+UYOulc2GF67P4uvTS+FzH89Ojofw9DUidiEfPAlDFbEHkZybf+crfYPo4lZN7utEyZyKPOqwJeyJpGI/tXkAuDxeATJKIRyjTXexSYofmBBe98wLj52T4DYWtIOoUyJc6U3UFlVj6Ur4yCdtwERh+vmXN1TdPa9X/vCipYeG460uydRUEFRnJBkk6Yk79ACgY+mLUi9b8Sxb4912DM+XQdLqu2D77JYRMflIf9AMcTeaihC0xF/7fknIe9Aqt6ea1j5dMyFD919AQIZy/n6Bv/juwXA4/FEEtqHIGlofqiZdKAVsYdBBYSDVqdBIGWxLuP8nB90BUYO1d1Wj3xEV8Rc7oLYN9wskLHKaZF3FLFcfUC6YIt1xw3PDJGII/XO9HbvxVHYUnzvk6z2rgZ7it6dF9YJQ/dJtf2YH5JhEVGq2++dMaZQhP61UK55vCgsezjhVo+z0x03XkE2fxMIksayyAIk1vQ4JzOVoTRT2Nvk/uqTabALoXacELR1b7EuvRQCGct95R3ym/ci7ygSueqPhJQdXhF31El0ZdwRiH3CoC646TaxG91WXH/2caGz6eDGMyuuPXUfxyGE46PXs7buLVT51yGQsTYvqWr5B5F3FLGEDSFIBiG7ziPxVg9iLz728BqPd9ivoLl4Ss9p5tDW655znKIbyw1IrhvA+sN1EHprLEKZOuajyDsKIVNFCCnVMLvvKhKq3c3Z7xs5GHtsHtnhRa1mj6zvD8H1Z3ZT3LXu3EMLmt/YPB5rk2r7sPG4HtJ5Gzm+TF3Am8nEaRGljhPKlMPBacWIu/oM2nr7oGfuWyaMGld3W3HZJcU102BPenYNT2c02LO+Hb/T9PZkaVcT3BGcce07TW/v64xLMvaOG6+gKayGxD/CzKdUp2YjYfozoUwZQ5AMvo05jOiy+0io6Zlw1fY22R0p12QqxwcTrkkWpQ8tHvvZ2GPDjy4r7uhrfD6iI9afXDuAmEtdoPdcgoBSWwlKuW9GcoQnK0KK9eVTqqHA4J22jccbEHvxMZJr3aO4F7osuD1u1UoeWnDruXtd2SOLx8FZ89yKkoeeafYXx31DkFz3FvGV3dhc3IZvth4YFkgZGyFTR/Lm4gszimL/XUipjUKfcOva9FJsLWlHzMVHzpecskcWj2Tmm91WlD2yeAig6plnJviNcXWFRg4XRrNTkmr7EHflCbaWtENdUA35wmizgFK+EItDv5p14q7ly+DgX3pJ6Hi+lLEErNFaVfuvY2tJO6LOdyLu6jMk3nrjZhnqXtk8DrPyLk8BHGk3o97l8NTWDyGxphfxld3YVvEAW0vaEXFUh0XhOTahlLEJKHWhVKH5hzkl71okkrAvhN5hxwiSRsAarVWZV4Wt59qwtaQdW0vasa3iIeKuPEXyzZdIrOlBUm0fku8MILnuLY61cSh+YIb27iC0dW+RVNuPxJpepN56g7irz7DtwiNEne9w9hVx+C4Whu21CWXssEiubpDIVX/8ZMTHF1Ku+YOI0hznS5RWSrGFWx59EOEHa52T/1BsON6A1Qkn4fvtDo4gaYhk6ptCkpXw/q9+TfqVd8jfC8WhjEiuaSVIGpRiy9CisD3DqxJPQrX/OiJPNblpiCu2nG1FWNEtrEk9i8UR+0d8lsUO8kl6RECpXhLS0OTRz2j/bMpnsgD1v3qJVUuE3mE5Qp+wNoKkR+xOFDMi9l1vlszfNCRZEDkk9gs3CymlzeFgCeTqlwIZWyYg6bCvpfR/z+q1NpdlxYqYX1CB7OcCn7D/ElKMkCAZBV8SulQsVfqTMqXIS6z5/f+rr8f/HMr/ArTbNmuKQ51gAAAAAElFTkSuQmCC"
	},
{command: 'context-savelink',image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbklEQVQ4jWNgoDH4PzQNkMVhgCy6QmxAmYGB4TUDA4M9mgH2UHFlYgyBKbaHGoDMJxrANP0nRzMMBEMNCCZHMwyYEKvQk4GB4RnURkL4GVQ9CnjGwMBgTaRl1lD1KIBQgvmPpgZDPcUuoDgMyAYA/mQv97JO38EAAAAASUVORK5CYII=" 
}

];
	var menu = PageMenu({ condition: 'link', insertAfter:'context-openlinkintab', onpopupshowing: syncHidden});
	menu(items);
	items.forEach(function(it){
		if (it.command)
			css('#contentAreaContextMenu[addMenu~="link"] #' + it.command + '{ display: none !important; }')
	});
};

//复制文本
new function () {
	var items = [
	{ command: 'context-copy',
	  image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII=" },
	{
		label:"复制纯文本",
		text:"%S%",
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jWNgGCzgPxZMSA2GJKkWEmXAfwYGBg9yDfBgYGCYCcXEWogCjjIwMChDaZIBssY8KCYJ5DGghjhJrlBmwPTjTKg4ToCsAVvAeaCJ0S8dkGQARUl54AAAWsMsNkwmkt8AAAAASUVORK5CYII="
	},
];
	
	var menu = PageMenu({ id:'addmenu_context-copy',condition:'select', insertBefore:'context-paste', onpopupshowing: syncHidden,image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII="  });
	menu(items);
	//page({ condition:'select', insertBefore:'context-sep-copylink' });
	items.forEach(function(it){
		if (it.command)
			css('#contentAreaContextMenu[addMenu~="select"] #' + it.command + '{ display: none !important; }')
	});
};




//当前页面
new function () {
	var items = [
{
label:"侧边栏中打开",
id:"context_TabFloatSidebar",
oncommand:'window.document.getElementById("pageActionButton").click(); window.setTimeout(function() {window.document.getElementById("pageAction-panel-side-view_mozilla_org").click();}, 0);',
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4jWNgoALwZGBgeMbAwPCfRPwMqpfhGQMDgzWJlh6B6nnGADWNXPAfRlCCMVxAiotGDRg+BqAnZWINgCdlijMTRQAA+35MwhZlde0AAAAASUVORK5CYII="
},{
		label:"新窗口中打开",
		oncommand:"gBrowser.replaceTabsWithWindow(TabContextMenu.contextTab);",
	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVklEQVQ4jWNgGEzgPgMDw38SMUUAbsB+MjCKATDGfAYGhm4o+zCSHC6noxiwmoGB4ToDA8NpBgaG7QwMDM8ZGBhmk2IAKWDUACoacJ9SA+CggQxMPQAASkhJNASQ/4kAAAAASUVORK5CYII="
},
{
		label:"隐私窗口打开",
		oncommand:"openTrustedLinkIn(gBrowser.currentURI.spec, 'window',{private:true});",
	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyUlEQVQ4je3RIUzDQBjF8V9CMotEoTCYufopBBqLx1ZOYiZn0JVIVC0WXTuJm6mqmpmY6Dt2CYIESXjJ9a7/vn7fvTv+hJ6wRocPTNhnfg+fcMCA1/gfsIIjtmgLiC5SfIPrsCZsiz6F58cvNcInbgJKhBHPlXEd3xgPLLGTnPeBh2T7qh7tMz/GI76+VH+p4JBd1NHK+1A16Mzn5iod7n4KXGmVfy4LaALawAVus7s260W+tYn3reHS+Wom8wF1Gbtkn/AW77+iE6SaONczlmqVAAAAAElFTkSuQmCC"
},
{
		label:"IE 浏览器打开",
		oncommand: function() {
	try {
		var path ="..\\..\\..\\Program Files\\Internet Explorer\\iexplore.exe";	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);file.initWithPath(path.replace(/^\./, Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsIFile).path));

		var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
		process.init(file);
		process.run(false, [gBrowser.currentURI.spec], 1);
	} catch (ex) {
		alert("打开IE失败!")
	}
},
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEElEQVQ4jZXSnVuDYRQG8B8EQTAIgkEQBMEgDIIwGA4Hg0EYBMH+gyAIh0EwHIRBEARBEAzDwWAweIP3bD17rmd9nOu64X3ec9/3+eJ/cYpL9DHAwabEHZyjG7jAbQik0SsRHzBHlWGBYebaSclNvEfyFK8FkQoznCSGqxhGwmP0t9ggsBTZS8n7QbjHVSQ9oRUu3UJbN6lAB2O0E+d+CC/xnAnMU4F2uM1+KLuEtRmMs5+fmPyCZlpBrn5mPY7Ud5BiFXl/FUZoJOS8vdGS3PC9+1xkirfC+yJmhnoDFQ7Vq/vL8Ppp+YMYCPVUr+O7RPyQna9Qm2RvLfWh9MKgi2Ns5WTYxot6bXfhsFtKLMUX/+qC1cGn0mkAAAAASUVORK5CYII="},
{
		label:"其他浏览器打开",
		text:"%u",
    tooltiptext: "注意：需要手动指定其他浏览器.exe所在路径",
		exec:"D:\\Chrome\\RunningCheeseChrome\\chrome.exe",
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABDklEQVQ4jY2ToW7DQBBEH4sUFh5UEFAQaGQSUKk/YGKpX1CpIGFhBuGhIQEBRQVFplFQYH6gJKikoMggxAE3J63Wd1VHWkuendnds/cgjRnwBuwUS2Ce0Q6wBTqgT8QOGOeMc+CaMdr40YQDfPzDbOPRml+BErgZwRmoxdfSPCsqYBrNDzK8SNgDjcnFTlPgE9gr2phbydTJsJehNdNcxF3cMRpkiMS7hFXizKU6Wu6AHpYcSewLPBG+/qDA2pGnxLhXcb7ZhsRYPWELARb66gBFQleQqdwT9qLU6ABfLn/EYER+fQ+awvMTHGbArxN1yn07vvTmiAnhV0ZhRbhA8b3FbOBfKAhXeKwCTa7rHaO8i7rzBML3AAAAAElFTkSuQmCC"
	},	

];
	
var menu = TabMenu({id:"context_SidebarOpen",  insertAfter: 'context_StickOnTop', onpopupshowing: syncHidden });
	menu(items);
};







//图片
new function () {
	var items = [
	{command: 'context-copyimage-contents',
	 image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII="
	},
 {
    label:"复制图像地址",
	  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA50lEQVQ4jb3SPUpDURAF4A8bbdxC9mEX8WcBIkYQbN2D2UQsxdYNiCiCgRQK9pogYgpdwPMHC41NUry5ECSP3Nd4YODO3Htmzsxc/hFX+ML1dHChBvkWy+iF1cL7H39UR8E+FtEO/xB3uZUvMQ4FN/hGd9bDo3hUoIMDfAT5fF6VDi7QCDsLYoG9HJlFEBMaITULVUNcwinWpmLbuFduYIDddDGrhULZxhhDnOAFm8HZwCt2UpI0xLc4wwqO8RmJEjmhiX5Om/BTER/lfuWnCgXPuQq2lDNYDX89/FZuAsotPOAXj2ILE+UhOi1pfPDEAAAAAElFTkSuQmCC",
	  class: "context-copyimage", 
	  oncommand: "gContextMenu.copyMediaLocation();",
},
{
    label: "在线编辑图片",
    condition: "image",
    tooltiptext: "图片地址已经复制到粘贴板",
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAOVBMVEUAAAAbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxvvg6/eAAAAEnRSTlMA+ehJNOrxZz3e1MVLKyXEfVKQKrX3AAAAWUlEQVQY043PSQ6AMAgFUAQ6Dyr3P6xYo8Gu+hckPEICsJAiJruC2KlYIE8vxPiH6pDsyonMSAY8A7Cr0FJ4ALWoHBhSGNBhSI7QnUx34AztbrJsX6Qs/HoBLJEDskHKRZMAAAAASUVORK5CYII=",
    oncommand: "gContextMenu.copyMediaLocation(); gBrowser.selectedTab = gBrowser.addTrustedTab('https://www.photopea.com/');",
},
{
    label: "用PS打开图片",
   tooltiptext: "注意：需要手动指定Photoshop.exe所在路径",
   image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAElBMVEUAAAAbGxsbGxsbGxsbGxsAAAC8TvM5AAAABHRSTlMA+cXUPrUbAwAAAD9JREFUCNdjgAMmFzBQYGCB8B2QGKyhAVAGAyuCERoAYbDC1LAGgBggFawQKSCAMlhD4QYiM5gdBYFARAHuCgDDrgkmIWoUrQAAAABJRU5ErkJggg==",
    oncommand: function() {
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
file.initWithPath("/Applications/Safari.app");
file.launch();
    },
},
];
	
	var menu = PageMenu({ condition:'image', id:'context-copyimage_new',insertAfter:'context-viewimage', icon:'image', 	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII=",onpopupshowing: syncHidden});
	menu(items);
	items.forEach(function(it){
		if (it.command)
			css('#contentAreaContextMenu[addMenu~="image"] #' + it.command + '{ display: none !important; }')
	});
};






//快捷回复
new function(){
	var items = [
		 {
        label: "当前日期和时间",
        condition: "input",
        position: 2,
        oncommand: function() {
            var localnow = new Date();
            var yy = localnow.getFullYear();
            var mm = localnow.getMonth()+1;
            if(mm < 10) mm = '0' + mm;
            var dd = localnow.getDate();
            if(dd < 10) dd = '0' + dd;
            var hh = localnow.getHours();
            if(hh < 10) hh = '0' + hh;
            var mi = localnow.getMinutes();
            if(mi < 10) mi = '0' + mi;
            var localnowstr = '【' + yy + '.' + mm + '.' + dd + ' - ' + hh + ':' + mi + '】';
            addMenu.copy(localnowstr);
            goDoCommand("cmd_paste");
			},
        },
		{label:"用户名Username", input_text: "你的用户名",image:" "},
		{label:"邮箱E-mail", input_text: "你的邮箱@qqcom",image:" "},
		{label:"网站Website", input_text: "http://www.yoursite.com",image:" "},
    {},
		{label:"不明觉厉~~~", input_text: "虽然不知道LZ在说什么但是感觉很厉害的样子～",image:" "},
		{label:"不用客气~~~", input_text: "不用客气，大家互相帮助……\n\u256E\uFF08\u256F\u25C7\u2570\uFF09\u256D",image:" "},
		{label:"反馈情况再说", input_text: "Mark，看反馈情况再说。。。",image:" "},
		{label:"看起来很不错", input_text: "看起来很不错哦，收藏之~~~\n谢谢LZ啦！！！",image:" "},
		{label:"谢谢楼主分享", input_text: "谢谢楼主的分享!这个绝对要顶！！！",image:" "},
		{label:"楼上正解~~~", input_text: "楼上正解……\u0285\uFF08\u00B4\u25D4\u0C6A\u25D4\uFF09\u0283",image:" "},
		{label:"坐等楼下解答", input_text: "坐等楼下高手解答~~~⊙_⊙",image:" "},
		{label:"这个要支持~~~", input_text: "很好、很强大，这个一定得支持！！！",image:" "},
		{label:"不明真相的~~~", input_text: "不明真相的围观群众~~~\u0285\uFF08\u00B4\u25D4\u0C6A\u25D4\uFF09\u0283",image:" "},
		{label:"没图没真相~~~", input_text: "没图没真相，纯支持下了~~~",image:" "},
		{label:"嘿嘿~~~", input_text: "\u2606\u002E\u3002\u002E\u003A\u002A\u0028\u563F\u00B4\u0414\uFF40\u563F\u0029\u002E\u3002\u002E\u003A\u002A\u2606",image:" "}
	];
	var menu = PageMenu({
    id:"quick_input",
		label:"快速输入...",
		condition:"input",
// insertAfter:"context-paste",
		position: 1,
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAATlBMVEUAAAABAQEFBQUFBQUAAAAFBQUBAQEFBQUFBQUBAQEBAQEBAQEFBQUFBQUFBQUFBQUFBQUBAQEFBQUFBQUFBQUFBQUFBQUFBQUFBQUDAwNxFq0VAAAAGXRSTlMA5xCm+wj2i5Tu7eudShoMB+/Df35nWiolwh78/gAAAGNJREFUGNN9ykkSgCAMRNEmRnAWZ7n/RU2hSBaWvcp/Feg5NofuwtBmgHDvlC4xsADiYo/tIpCb2goCuRtpAd0JOuNBtQM9QDzG7tPHbjFMTs4EhbW8QgF3vYeCuB+YwzuLj12wlgVNTTHpdAAAAABJRU5ErkJggg==",
		oncommand: function(event){
			var input_text = event.target.getAttribute('input_text');
			if(input_text) {
				addMenu.copy(input_text);
				goDoCommand("cmd_paste");
			}
		}
	});
	menu(items);
};




//颜文字输入
var Specialcharacters = PageMenu({
                id:"quick_inputemoji",
                label:"颜文字输入",
			         	condition:"input",
                insertAfter:"quick_input",
                oncommand: function(event){
                        var input_text = event.target.getAttribute('input_text');
                        if(input_text) {
                                addMenu.copy(input_text);
                                goDoCommand("cmd_paste");
                }
        },
    image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAD4+PghISERERExMTEUFBSVlZVPT08eHh4YGBi8vLyioqKBgYF4eHhJSUlBQUHg4ODR0dG1tbWamppzc3NgYGBXV1ft7e3i4uKvr6+oqKiPj4+JiYkoKCgkJCQICAgmMdadAAAAAXRSTlMAQObYZgAAAINJREFUGNNti1cSAyEMQwX20mGzJb3d/5YxJX+rGSw/IeNQJztp7eflz4ayAlSiPPij+qLc3vokPBIfZNqMmCpuT0QWnxT8F3WZ5IlrqfYjma4HQwMI4FsrcAPML6QC0dlirY2FJGSzlfcV7t5+GIi2GAW+oGn3j2qrGwwEJq1JBxzpB9l0A8JvhjyGAAAAAElFTkSuQmCC"
});

Specialcharacters([
	{id: "spe-charaters", style: "display:none;"}
]);


var SPE4 = PageMenu({
	label: "卖萌",
	condition: "input",
	insertBefore: "spe-charaters",
});
SPE4([
                {label: "｡◕‿◕｡", input_text:"｡◕‿◕｡"},
                {label: "(●'‿'●) ", input_text:"(●'‿'●) "},
                {label: "(ง •̀_•́)ง", input_text:"(ง •̀_•́)ง"},
                {label: "(๑•̀ω•́๑)", input_text:"(๑•̀ω•́๑)"}, 
                {label: "(๑¯∀¯๑)", input_text:"(๑¯∀¯๑)"},
                {label: "(๑•̀ㅂ•́)و✧", input_text:"(๑•̀ㅂ•́)و✧"},
                {label: "(๑•́ ₃ •̀๑) ", input_text:"(๑•́ ₃ •̀๑) "},
                {label: "_(:з」∠)_", input_text:"_(:з」∠)_"},
                {label: "(ฅ´ω`ฅ)", input_text:"(ฅ´ω`ฅ)"},
                {label: " (¬､¬)", input_text:" (¬､¬) "},
                {label: " ( ˙ε ˙ ) ", input_text:" ( ˙ε ˙ )"},
                {label: "(๑¯ิε ¯ิ๑) ", input_text:"(๑¯ิε ¯ิ๑) "},
                {label: "_(•̀ω•́ 」∠)_", input_text:"_(•̀ω•́ 」∠)_"},    

]);

var SPE6 = PageMenu({
	label: "不开心",
	condition: "input",
	insertBefore: "spe-charaters",
});
SPE6([
                {label: "Ծ‸Ծ", input_text:"Ծ‸Ծ"},
                {label: "●﹏●", input_text:"●﹏●"},
                {label: "≥﹏≤", input_text:"≥﹏≤"},
                {label: "◔ ‸◔？", input_text:"◔ ‸◔？"},
                {label: "ᕙ(⇀‸↼‵‵)ᕗ ", input_text:"ᕙ(⇀‸↼‵‵)ᕗ "},
                {label: "ヘ(-ω-ヘ)", input_text:"ヘ(-ω-ヘ)"},
                {label: "(￣_￣|||)", input_text:"(￣_￣|||)"},
                {label: "(눈_눈)", input_text:"(눈_눈)"},
                {label: "o(╥﹏╥)o", input_text:"o(╥﹏╥)o"},
                {label: "(￣▽￣*)b", input_text:"(￣▽￣*)b"},
                {label: "(｡•ˇ‸ˇ•｡)", input_text:"(｡•ˇ‸ˇ•｡)"},
                {label: "(｡•́︿•̀｡)", input_text:"(｡•́︿•̀｡)"},
                {label: "Σ(๑０ω０๑) ", input_text:"Σ(๑０ω０๑)"},
                 {label: "( ´◔‸◔`)", input_text:"( ´◔‸◔`)"},
                {label: "( ´･ᴗ･` )", input_text:"( ´･ᴗ･` )"},
                {label: "( ⊙⊙)!!", input_text:"( ⊙⊙)!!"}, 
                {label: "(｡ì _ í｡)", input_text:"(｡ì _ í｡)"}, 

]);

var SPE5 = PageMenu({
	label: "Emoji",
	condition: "input",
	insertBefore: "spe-charaters",
});
SPE5([
                {label: "😂", input_text:"😂"},
                {label: "😍", input_text:"😍"},
                {label: "😘", input_text:"😘"},
                {label: "😝", input_text:"😝"},
                {label: "😒", input_text:"😒"},
                {label: "😓", input_text:"😓"},
                {label: "😭", input_text:"😭"},
                {label: "😱", input_text:"😱"},
                {label: "😡", input_text:"😡"},
                {label: "😎", input_text:"😎"},
                {label: "❤️", input_text:"❤️"},
                {label: "💔", input_text:"💔"},
                {label: "👍", input_text:"👍"},
                {label: "👎", input_text:"👎"},
                {label: "👌", input_text:"👌"},
                {label: "🤝", input_text:"🤝"},

]);

var SPE7 = PageMenu({
	label: "表情包",
	condition: "input",
	insertBefore: "spe-charaters",
});
SPE7([
                {label: "Instereting", input_text:'<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9t6ejgzj2050050jr7.jpg"/>'},
                {label: "辣眼睛", input_text:'<img src="https://tva3.sinaimg.cn/large/7a6a15d5gy1fcl8r7n590j20d10cbk1y.jpg"/>'},
                {label: "爱心发射", input_text:'<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl8s0pnqnj2060060aah.jpg"/>'},
                {label: "不错不错", input_text:'<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl9wbtpwgg2046046jtp.gif"/>'},
                {label: "我不能接受", input_text:'<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl8sipccsj208w06k0tf.jpg"/>'},
                {label: "可以，这很清真", input_text:'<img src="https://tva3.sinaimg.cn/large/7a6a15d5gy1fcl9i616lcj205i04wglr.jpg"/>'},    
                {label: "不可以，这不清真", input_text:'<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9ii6wkwj206l05wgm5.jpg"/>'},   
                {label: "厉害了，我的哥", input_text:'<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9jhl9btj20dc0a0aa7.jpg"/>'},    
                {label: "老哥，稳", input_text:'<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9jsvmwhj204e04e0sk.jpg"/>'},    
                {label: "尼克杨问题号脸", input_text:'<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl6ba3jznj208k086glk.jpg"/>'},    
                {label: "在座的各位都是垃圾", input_text:'<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl8ogllg0j206r03tt8o.jpg"/>'},                
                {label: "别说了....我", input_text:'<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl9kl6q47g207u078av3.gif"/>'},    
                {label: "exo me?", input_text:'<img src="https://tva4.sinaimg.cn/large/7a6a15d5gy1fcl9l01y74j205k05kq2s.jpg"/>'},    
                {label: "哎呦，好叼哦", input_text:'<img src="https://tva3.sinaimg.cn/large/7a6a15d5gy1fcmq68293hj205k063js0.jpg"/>'},    
                {label: "又在背后说我帅", input_text:'<img src="https://tva1.sinaimg.cn/large/7a6a15d5gy1fcl9thd9a2j204404fglg.jpg"/>'},    
                {label: "鸡年大吉吧", input_text:'<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl9vw59yaj204w050glj.jpg"/>'},  
                {label: "如此厚颜无耻之人", input_text:'<img src="https://tva2.sinaimg.cn/large/7a6a15d5gy1fcl8q2ekhkg208w06oe81.gif"/>'},  
]);

var SPE1 = PageMenu({
	label: "特殊图形",
	condition: "input",
	insertBefore: "spe-charaters",
});
SPE1([
{label: "❤♥♡",	input_text: "❤♥♡"},	
{label: "☻☺",	input_text: "☻☺"},	
{label: "♂♀",	input_text: "♂♀"},	
{label: "★☆",	input_text: "★☆"},	
{label: "■◻",	input_text: "■◻"},	
{label: "●○",	input_text: "●○"},	
{label: "▲▼",	input_text: "▲▼"},	
{label: "►◄",	input_text: "►◄"},	
{label: "√×",	input_text: "√×"},	
{label: "♪♫♬♩",	input_text: "♪♫♬♩"},	
{label: "♠♥♣♦", input_text: "♠♥♣♦"},	
]);

var SPE3 = PageMenu({
	label: "特殊字符",
	condition: "input",
	insertBefore: "spe-charaters",
});
SPE3([
{label: "©®™",	input_text: "©®™"},
{label: "のあぃ",	input_text: "のあぃ"},
{label: "•",	input_text: "•"},
{label: "×÷",	input_text: "×÷"},
{label: "≠≈",	input_text: "≠≈"},
{label: "↑↓",	input_text: "↑↓"},
{label: "←→",	input_text: "←→"},
{label: "»«",	input_text: "»«"},
{label: "「」",	input_text: "「」"},
{label: "『』",	input_text: "『』"},
{label: "℃℉",	input_text: "℃℉"},
]);









new function () {
	var items = [
{
		label: "关闭右侧标签",
    id:"context_closeTabsToTheLast",
    oncommand:  function() {gBrowser.removeTabsToTheEndFrom(gBrowser.selectedTab); gBrowser.removeTabsToTheEndFrom(gBrowser.selectedTab);gBrowser.removeTabsToTheEndFrom(gBrowser.selectedTab);},
	 image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGGzgPxQPNwPyGBhyGRgY/kNp8lwAMySTgaGNGAPwYnwuoZoLsGqmKAyIBQNvwBAEAIkvKboNt20DAAAAAElFTkSuQmCC"
	},
    {
		label: "关闭左侧标签",
    id:"context_closeTabsToTheFirst",
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEUAAABuAABpAAAAAACOszMyAAAAA3RSTlMAbYYu/vchAAAAH0lEQVQI12NABswHkIkSIMF0AUiw//8PYkHF0NWhAgAbAQzws7ptnwAAAABJRU5ErkJggg==",
		oncommand: function closeTabsToTheFirst() { for (let i = TabContextMenu.contextTab._tPos - 1; i >= 0; i--) if (!gBrowser.tabs[i].pinned){ gBrowser.removeTab(gBrowser.tabs[i], {animate: true});}}
},
{
		label: "关闭其他标签",
    id:"context_removeAllTabsButCurrent",
		oncommand: "gBrowser.removeAllTabsBut(TabContextMenu.contextTab);",
 	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATElEQVQ4jdXSQQrAMAhE0edxs0iOkWvbVQsFs2m7aD64cWQcRH5NkEFuYjDoQQ76yqCaAY1ZCVWC06Qxb40ndS18leCTG6zY7A/25QBZhDm3YCnePQAAAABJRU5ErkJggg==",
	},
{
		label: "关闭所有标签",
    id:"context_closeAllTabs",
		oncommand: "gBrowser.removeAllTabsBut(gBrowser.selectedTab); gBrowser.removeCurrentTab();",
 	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVQ4jWNgGHbgPwMDgz0eeXuoGoIKsBmCT46gQqI1Y9NAsmZ0Q8jSTLEBFHmBokCkOBqpkpAIAbJihHYAAKNEHEuIZ/qnAAAAAElFTkSuQmCC",
	},
{},
{
		label:"移动标签到开头",
		oncommand:"gBrowser.moveTabsToStart(TabContextMenu.contextTab);",
	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPElEQVQ4jWNgoBL4jwcTbQAp4kPUADsGBoZfUJpkA/zxaSZkgB0DEbFEUxfAgAM+Q4ZGNBI0gKK8MHAAANGVMRA9chdTAAAAAElFTkSuQmCC"
},{
		label:"移动标签到结尾",
		oncommand:"gBrowser.moveTabsToEnd(TabContextMenu.contextTab);",
	image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAO0lEQVQ4jWNgoAP4jwcTbQAp4gNsgB0DA8MvKE22C2CG+BNrAL5QtqOLC7BppigMiFU4xAygKC/QFgAAbAUxDnigQ+cAAAAASUVORK5CYII="
},

	];
	var menu = TabMenu({id:"context_CloseTabs", onpopupshowing: syncHidden});
	menu(items);
};




new function () {
	var items = [
    {label:"复制页面标题",oncommand: function() {addMenu.copy(addMenu.convertText("%TITLES%"));},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jWNgGCzgPxZMSA2GJKkWEmXAfwYGBg9yDfBgYGCYCcXEWogCjjIwMChDaZIBssY8KCYJ5DGghjhJrlBmwPTjTKg4ToCsAVvAeaCJ0S8dkGQARUl54AAAWsMsNkwmkt8AAAAASUVORK5CYII="},
	{label:"复制页面地址",oncommand: function() {addMenu.copy(addMenu.convertText("%URL%"));},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA50lEQVQ4jb3SPUpDURAF4A8bbdxC9mEX8WcBIkYQbN2D2UQsxdYNiCiCgRQK9pogYgpdwPMHC41NUry5ECSP3Nd4YODO3Htmzsxc/hFX+ML1dHChBvkWy+iF1cL7H39UR8E+FtEO/xB3uZUvMQ4FN/hGd9bDo3hUoIMDfAT5fF6VDi7QCDsLYoG9HJlFEBMaITULVUNcwinWpmLbuFduYIDddDGrhULZxhhDnOAFm8HZwCt2UpI0xLc4wwqO8RmJEjmhiX5Om/BTER/lfuWnCgXPuQq2lDNYDX89/FZuAsotPOAXj2ILE+UhOi1pfPDEAAAAAElFTkSuQmCC"},
	{label:"复制页面标题和地址",oncommand: function() {addMenu.copy(addMenu.convertText("%TITLES%\n%URL%"));},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII="},
	{label:"复制页面HTML",oncommand: function() {addMenu.copy(addMenu.convertText( '<a href="%URL%" target="_blank">%TITLES%</a>'));},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEUAAAAAAABmZmbc3Ny3t7eRkZE6OjpRDxSxAAAAAXRSTlMAQObYZgAAADJJREFUCNdjwASCECDAIADhY2UwMQoKsgqAGUyMJiAGoyATYzJMhEEYxhDAoh1hBQYAAPxVA4qkxzcpAAAAAElFTkSuQmCC"},
	{label:"复制页面MarkDown",oncommand: function() {(function(){
            var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper); var txt="";var url=gBrowser.currentURI.spec;var title=gBrowser.contentTitle;txt+="["+title+"]"+"("+url+")";gClipboardHelper.copyString(txt);    
    })();},
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAb0lEQVQ4jWNgGAzgPwUYbgC5FlPPACUsBsHEzzAgnHyGkAFpULE0JPG7UJqBgYGhg4GBoRyXAe+QbDgD5aMb4MLAwLAblwF3odgFiU2yAeVQfjkOA2bi88IZNIkzDJiBCLMdwwByAHUNoCgpDywAAOcYVL2aysArAAAAAElFTkSuQmCC"},

{}, 
{label:"复制所有页面标题",oncommand: function() {(function(){
					var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
           var titles = "";
            gBrowser.tabs.forEach(function(tab) {
                titles += tab.label + "\n";
            });
            gClipboardHelper.copyString(titles);   
    })();},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jWNgGCzgPxZMSA2GJKkWEmXAfwYGBg9yDfBgYGCYCcXEWogCjjIwMChDaZIBssY8KCYJ5DGghjhJrlBmwPTjTKg4ToCsAVvAeaCJ0S8dkGQARUl54AAAWsMsNkwmkt8AAAAASUVORK5CYII="},
	{label:"复制所有页面地址",oncommand: function() {(function(){
            var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
						var URLs = "";
            gBrowser.tabs.forEach(function(tab){
                var url = gBrowser.getBrowserForTab(tab).currentURI.spec;
                URLs += url + "\n";
            });
            gClipboardHelper.copyString(URLs);      
    })();},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA50lEQVQ4jb3SPUpDURAF4A8bbdxC9mEX8WcBIkYQbN2D2UQsxdYNiCiCgRQK9pogYgpdwPMHC41NUry5ECSP3Nd4YODO3Htmzsxc/hFX+ML1dHChBvkWy+iF1cL7H39UR8E+FtEO/xB3uZUvMQ4FN/hGd9bDo3hUoIMDfAT5fF6VDi7QCDsLYoG9HJlFEBMaITULVUNcwinWpmLbuFduYIDddDGrhULZxhhDnOAFm8HZwCt2UpI0xLc4wwqO8RmJEjmhiX5Om/BTER/lfuWnCgXPuQq2lDNYDX89/FZuAsotPOAXj2ILE+UhOi1pfPDEAAAAAElFTkSuQmCC"},
	{label:"复制所有页面标题和地址",oncommand: function() {(function() {
            var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
						var txt = "";
           gBrowser.tabs.forEach(function(tab) {
                 var url = gBrowser.getBrowserForTab(tab).currentURI.spec;
                txt += tab.label + "\n" + url + "\n";
            });
            gClipboardHelper.copyString(txt); 
        })();},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPklEQVQ4jWNgoCL4TyQWwGcAIQtgNFZDiDUAp1piDEDGBA3A6VdCBhAKRIIGEAOGqAuINoBiFwysAaRg6gAAE7tI6EZZDKkAAAAASUVORK5CYII="},
{label:"复制所有页面标HTML",oncommand: function() {(function() {
            var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
						var txt = "";
            gBrowser.tabs.forEach(function(tab){
                 var url = gBrowser.getBrowserForTab(tab).currentURI.spec;
                txt += "<a href=" + "\""+ url +"\" "+  "target=\"_blank\">" +  tab.label + "</a>"+ "<br>"+ "\r";
            });
            gClipboardHelper.copyString(txt); 
        })();},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAFVBMVEUAAAAAAABmZmbc3Ny3t7eRkZE6OjpRDxSxAAAAAXRSTlMAQObYZgAAADJJREFUCNdjwASCECDAIADhY2UwMQoKsgqAGUyMJiAGoyATYzJMhEEYxhDAoh1hBQYAAPxVA4qkxzcpAAAAAElFTkSuQmCC"},
{label:"复制所有页面标Markdown",oncommand: function() {(function() {
						var gClipboardHelper = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
						var txt="";gBrowser.tabs.forEach(function(tab){var url=gBrowser.getBrowserForTab(tab).currentURI.spec;txt+="["+tab.label+"]"+"("+url+")\\"+"\r"});gClipboardHelper.copyString(txt);
        })();},image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAb0lEQVQ4jWNgGAzgPwUYbgC5FlPPACUsBsHEzzAgnHyGkAFpULE0JPG7UJqBgYGhg4GBoRyXAe+QbDgD5aMb4MLAwLAblwF3odgFiU2yAeVQfjkOA2bi88IZNIkzDJiBCLMdwwByAHUNoCgpDywAAOcYVL2aysArAAAAAElFTkSuQmCC"},
	{},
 {
		label:"复制 Favicon 编码",
		text:"%FAVICON%",
		image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbElEQVQ4jWNgGAzgPwUYbgC5FmMYcBTJdA8smo4yMDAo4zIgD4oZoIrQXZYHFcNpALLp6EAZKo/XBf+RbEH3AkwjUQbg8xpBA5ABsq3o0aeMzYCZaM7GFr14XQBTgGwLyQaQAlAMoCgpDywAAF13Uxwj2+klAAAAAElFTkSuQmCC"
	}
	];
	var menu = TabMenu({id:"context_TabInfoCopy",onpopupshowing: syncHidden});
	menu(items);
};








//隐藏相同项。必须，不能删除
function syncHidden(event) {
	Array.from(event.target.children).forEach(function(elem){
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


