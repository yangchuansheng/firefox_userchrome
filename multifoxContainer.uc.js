// ==UserScript==
// @name            multifoxContainer
// @author          xiaoxiaoflood
// @include         main
// @startup         UC.multifoxContainer.exec(win);
// @shutdown        UC.multifoxContainer.destroy();
// @onlyonce
// ==/UserScript==

const { TabStateFlusher } = ChromeUtils.import('resource:///modules/sessionstore/TabStateFlusher.jsm');
const { TabStateCache } = ChromeUtils.import('resource:///modules/sessionstore/TabStateCache.jsm');

UC.multifoxContainer = {
  exec: function (win) {
    const { document, gBrowser } = win;

    let mfcm = _uc.createElement(document, 'menupopup', {
      id: 'mf-contextmenu',
      position: 'after_start',
      onpopupshowing: 'UC.multifoxContainer.showPopup(window)',
    });
    document.getElementById('mainPopupSet').appendChild(mfcm);
    document.getElementById('userContext-icons').setAttribute('popup', 'mf-contextmenu');

    gBrowser.orig_addTab = gBrowser.addTab;
    gBrowser.addTab = function (aURI, options) {
      if ('toUserContextId' in this) {
        options.userContextId = this.toUserContextId;
        delete this.toUserContextId;
      } else if (!options.relatedToCurrent && !options.userContextId && this.selectedTab.userContextId != UC.privateTab?.container.userContextId && options.focusUrlBar) {
        options.userContextId = this.selectedTab.userContextId;
      }

      return gBrowser.orig_addTab.call(this, aURI, options);
    };

    document.getElementById('context-openlinkinusercontext-menu').menupopup.setAttribute('oncommand', 'gBrowser.toUserContextId = Number(event.target.dataset.usercontextid);gContextMenu.openLinkInTab(event);');
    document.getElementById('context_reopenInContainer').menupopup.setAttribute('oncommand', 'gBrowser.toUserContextId = Number(event.target.dataset.usercontextid);TabContextMenu.reopenInContainer(event);');
    function fixNewTabMenuButton () {
      document.getElementById('tabs-newtab-button').menupopup.addEventListener('mouseup', UC.multifoxContainer.forceDefaultContainer, false);
    }
    if (document.readyState == 'complete')
      fixNewTabMenuButton();
    else
      document.addEventListener('DOMContentLoaded', fixNewTabMenuButton, {once: true});

    let orig_updateUserContextUIIndicator = win.updateUserContextUIIndicator;
    win.updateUserContextUIIndicator = function () {
      orig_updateUserContextUIIndicator();

      if (gBrowser.selectedTab.userContextId == 0) {
        let hbox = document.getElementById('userContext-icons');
        hbox.hidden = false;
        hbox.className = 'identity-color-black';
        document.getElementById('userContext-label').value = 'Default';
        document.getElementById('userContext-indicator').className = 'identity-icon-fingerprint';
      }
    };
    win.updateUserContextUIIndicator.orig = orig_updateUserContextUIIndicator;

    if (document.readyState == 'complete')
      win.updateUserContextUIIndicator();
  },

  showPopup: function (win) {
    const { ContextualIdentityService, document, gBrowser } = win;
    let userContextId = gBrowser.selectedTab.userContextId;
    let menupopup = document.getElementById('mf-contextmenu');

    let firstChild;
    while (firstChild = menupopup.firstChild)
      firstChild.remove();

    let menuitem;
    if (userContextId != 0) {
      menuitem = _uc.createElement(document, 'menuitem', {
        class: 'menuitem-iconic identity-color-black identity-icon-fingerprint',
        'data-usercontextid': '0',
        label: 'Default',
        oncommand: 'UC.multifoxContainer.openContainer(window, event.button, 0);',
      });
      menupopup.appendChild(menuitem);
    }

    ContextualIdentityService.getPublicIdentities().forEach(context => {
      if (userContextId !== context.userContextId) {
        menuitem = _uc.createElement(document, 'menuitem', {
          class: 'menuitem-iconic identity-color-' + context.color + ' identity-icon-' + context.icon,
          'data-usercontextid': userContextId,
          label: ContextualIdentityService.getUserContextLabel(context.userContextId),
          oncommand: 'UC.multifoxContainer.openContainer(window, event.button, ' + context.userContextId + ')',
        });
        menupopup.appendChild(menuitem);
      }
    });
  },

  openContainer: function (win, btn, id) {
    let gBrowser = win.gBrowser;
    gBrowser.toUserContextId = id;
    let tab = gBrowser.selectedTab;
    let newTab = gBrowser.duplicateTab(tab);
    gBrowser.selectedTab = newTab;
    let newBrowser = newTab.linkedBrowser;
    TabStateFlusher.flush(newBrowser).then(() => {
      TabStateCache.update(newBrowser.permanentKey, {
        userContextId: newTab.userContextId
      });
    });
    if (btn == 0)
      gBrowser.removeTab(tab);
  },

  init: function () {
    this.setStyle();
    _uc.sss.loadAndRegisterSheet(this.STYLE.url, this.STYLE.type);
  },

  forceDefaultContainer: function (e) {
    if (e.target == this.firstChild)
      gBrowser.toUserContextId = 0;
  },

  setStyle: function () {
    this.STYLE = {
      url: Services.io.newURI('data:text/css;charset=UTF-8,' + encodeURIComponent(`
        @-moz-document url('${_uc.BROWSERCHROME}') {
          .identity-color-black {
            --identity-tab-color: %23424242;
            --identity-icon-color: %23424242;
          }
        }
      `)),
      type: _uc.sss.USER_SHEET
    }
  },

  destroy: function () {
    _uc.sss.unregisterSheet(this.STYLE.url, this.STYLE.type);

    _uc.windows((doc, win) => {
      const { gBrowser } = win;
      doc.getElementById('mf-contextmenu').remove();
      gBrowser.addTab = gBrowser.orig_addTab;
      delete gBrowser.orig_addTab;
      win.updateUserContextUIIndicator = win.updateUserContextUIIndicator.orig;
      win.updateUserContextUIIndicator();
      doc.getElementById('context-openlinkinusercontext-menu').menupopup.setAttribute('oncommand', 'gContextMenu.openLinkInTab(event);');
      doc.getElementById('context_reopenInContainer').menupopup.setAttribute('oncommand', 'TabContextMenu.reopenInContainer(event);');
      doc.getElementById('tabs-newtab-button').menupopup.removeEventListener('mouseup', this.forceDefaultContainer, false);
    });
    delete UC.multifoxContainer;
  }
}

UC.multifoxContainer.init();
