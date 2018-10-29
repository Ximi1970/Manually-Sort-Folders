/**
 * this is copied from
 * https://github.com/firebug/firebug.sdk/blob/master/lib/core/xul.js
 * https://github.com/oshybystyi/FireX-Pixel-Perfect/blob/master/content/lib/xul.js
 * with some modifications. Those modifications are marked with comment:
 * 'CUSTOM'
 */ 
/* See license.txt for terms of usage */

"use strict";

const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

/** CUSTOM: Added STD_NS for html:input tag **/
const STD_NS = "http://www.w3.org/1999/xhtml";

/** CUSTOM: This is added by FireX-Pixel-Perfect to be suitable for Cu.import **/
var EXPORTED_SYMBOLS = ['Xul', 'defineTags'];

// XUL namespace (see also defineTags method at the bottom of this module).
var Xul = {};

function XulTag(tagName) {
  this.tagName = tagName;
  this.children = [];
}

/**
 * XUL tag (simplified DomplateTag version). This object allows
 * building XUL DOM structure using predefined tags (function) and
 * simplify the code (by minimizing the amount of createElement and
 * setAttribute API calls).
 * 
 * See an example:
 *
 * let box =
 *   HBOX({"id": "myBox", "flex": 1},
 *     BOX({"class": "leftPane"},
 *     SPLITTER({"class": "splitter"},
 *     BOX({"class": "rightPane"}
 *   );
 * box.build(parentNode);
 */
XulTag.prototype =
/** @lends XulTag */
{
  merge: function(args) {
    // The first argument might be an object with attributes.
    let attrs = args.length ? args[0] : null;
    let hasAttrs = typeof(attrs) == "object" && !isTag(attrs);

    // If hasAttrs is true, the first argument passed into the XUL tag
    // is really a set of attributes.
    if (hasAttrs) {
      this.attrs = attrs;
    }

    // The other arguments passed into the XUL tag might be children.
    if (args.length) {
      this.children = Array.prototype.slice.call(args);

      if (hasAttrs) {
        this.children.shift();
      }
    }

    return this;
  },

  build: function(parentNode, options = {}) {
    /**
     * CUSTOM
     * when parentNode is document than just return created node and don't
     * modify parent node
     */
    let doc = parentNode.ownerDocument || parentNode;

    // Create the current XUL element and set all defined attributes 
    if (this.tagName.indexOf('html:') === 0) {
      /** CUSTOM: <html:...> is from standard namespace **/
      var node = doc.createElementNS(STD_NS, this.tagName);
    } else {
      var node = doc.createElementNS(XUL_NS, this.tagName);
    }

    for (let key in this.attrs) {
      node.setAttribute(key, this.attrs[key]);
    }

    // Create all children and append them into the parent element.
    for (let i=0; i<this.children.length; i++) {
      let child = this.children[i];
      child.build(node);
    }

    if (doc === parentNode) {
      /** CUSTOM: when parent node is document we can't append into it **/
      return node;
    }

    // Append created element at the right position within
    // the parent node.
    if (options.insertBefore) {
      parentNode.insertBefore(node, options.insertBefore);
    }
    else {
      parentNode.appendChild(node);
    }

    return node;
  }
}

function isTag(obj) {
  return (obj instanceof XulTag);
}

// Define basic set of XUL tags.
function defineTags() {
  for (let i=0; i<arguments.length; i++) {
    let tagName = arguments[i];
    let fn = createTagHandler(tagName);
    let fnName = tagName.replace(':', '').toUpperCase(); // CUSTOM: replace ':' for html:input tag

    Xul[fnName] = fn;
  }

  function createTagHandler(tagName) {
    return function() {
      let newTag = new XulTag(tagName);
      return newTag.merge(arguments);
    };
  }
}

// Basic XUL tags, append others as needed.
defineTags(
  "box", "vbox", "hbox", "splitter", "toolbar", "radio", "image",
  "menupopup", "textbox", "tabbox", "tabs", "tabpanels", "toolbarbutton",
  "arrowscrollbox", "tabscrollbox", "iframe", "description", "panel",
  "label", "progressmeter", "resizer", "stack", "spacer"
);
