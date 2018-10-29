/* -*- Mode: Javascript; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab filetype=javascript: */

'use strict';

var EXPORTED_SYMBOLS = ['ui'];

const Cu = Components.utils;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import("resource://gre/modules/Log.jsm");

let tblog = Log.repository.getLogger("tbsortfolders.ui");

tblog.level = Log.Level.Debug;

tblog.addAppender(new Log.ConsoleAppender(new Log.BasicFormatter()));
tblog.addAppender(new Log.DumpAppender(new Log.BasicFormatter()));

/** CustomizableUI used to create toolbar button **/
Cu.import('resource:///modules/CustomizableUI.jsm');

/** Xul.js used to define set of functions similar to tags of overlay.xul **/
Cu.import('chrome://tbsortfolders/content/modules/xul.js');

defineTags(
  'script', 'menu', 'menupopup', 'menuitem'
);

const {
  SCRIPT, MENU, MENUPOPUP, MENUITEM
} = Xul;

/**
 * Add and remove addon user interface - replacement over overlay.xul, which
 * can't be ported into restartless extension
 */
function Ui() {
  this.panelNode = null;
  this.buttonId = 'toolbar-pixel';
}

Ui.prototype = {
  attach: function() {
    this.createOverlay();
  },

  destroy: function() {
    CustomizableUI.destroyWidget(this.buttonId);
  },

  createOverlay: function() {
    var self = this; 

    CustomizableUI.createWidget({
      id: this.buttonId,
      defaultArea: CustomizableUI.AREA_NAVBAR,
      type: 'custom',
      onBuild: function(doc) {
        try {
          var overlay = self.overlayNode(doc);
        }
        catch (e) {
          tblog.error(e);
        }

        return overlay;
      }
    });
  },

  overlayNode: function(doc) {
    let menuItemAttrs = {
      insertafter: 'activityManager',
      id: 'tbsf_menu_item',
      oncommand: "window.openDialog('chrome://tbsortfolders/content/', '',
          'chrome=yes, modal=yes, dialog=no, resizable=yes');",
      label: '&tbsf.menuentry.label;'
    };
    
    var overlay =
      SCRIPT({'type': 'application/javascript', 'src': 'folderPane.js'}),
      MENU({'id': 'tasksMenu'},
        MENUPOPUP({'id': 'taskPopup'},
          MENUITEM(menuItemAttrs)
        )
      );
 
    return overlay.build(doc);
  }
}

/** Singleton to avoid multiple initialization for startup and shutdown **/
var ui = new Ui();
