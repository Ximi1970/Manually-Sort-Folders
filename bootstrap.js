// https://flagfox.wordpress.com/2014/01/19/writing-restartless-addons/

Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("resource://gre/modules/Log.jsm");
var log_bootstrap = Log.repository.getLogger("tbsortfolders.bootstrap");

log_bootstrap.level = Log.Level.Debug;

log_bootstrap.addAppender(new Log.ConsoleAppender(new Log.BasicFormatter()));
log_bootstrap.addAppender(new Log.DumpAppender(new Log.BasicFormatter()));

const PREF_BRANCH = "extensions.tbsortfolders@xulforum.org.";
const PREFS = {
  tbsf_data: '{}',
  startup_folder: "",
};

function setDefaultPrefs() {
  let branch = Services.prefs.getDefaultBranch(PREF_BRANCH);
  for (let key in PREFS) {
    switch (typeof PREFS[key]) {
      case "boolean":
        branch.setBoolPref(key, PREFS[key]);
        break;
      case "number":
        branch.setIntPref(key, PREFS[key]);
        break;
      case "string":
        branch.setCharPref(key, PREFS[key]);
        break;
      case "object":
        branch.setObjPref(key, PREFS[key]);
        break;
    }
  }
}

function getPref(key) {
  // Cache the prefbranch after first use
  if (getPref.branch == null)
    getPref.branch = Services.prefs.getBranch(PREF_BRANCH);
  // Figure out what type of pref to fetch
  switch (typeof PREFS[key]) {
    case "boolean":
      return getPref.branch.getBoolPref(key);
    case "number":
      return getPref.branch.getIntPref(key);
    case "string":
      return getPref.branch.getCharPref(key);
    case "object":
      return getPref.branch.getObjectPref(key);
  }
}

function startup(data,reason) {
  log_bootstrap.debug("Bootstrap startup");

  log_bootstrap.debug("Appinfo ABI: "+Services.appinfo.XPCOMABI);
  log_bootstrap.debug("Appinfo TB version: "+Services.appinfo.version);
    
//  Components.utils.import("chrome://tbsortfolders/content/ui.js");
//  Components.utils.import("chrome://tbsortfolders/content/folderPane.js");
 
  setDefaultPrefs();
    
//  myModule.startup();  // Do whatever initial startup stuff you need to do

//  var xulDoc = Components.classes["@mozilla.org/xul/xul-document;1"].createInstance(Components.interfaces.nsIDOMXULDocument);
//    xulDoc.loadOverlay("chrome://browser/content/",null);
    
//  document.loadOverlay("chrome://tbsortfolders/content/overlay.xul",null);

  forEachOpenWindow(loadIntoWindow);
  Services.wm.addListener(WindowListener);
    
  log_bootstrap.debug("Bootstrap startup done");
}

function shutdown(data,reason) {
  log_bootstrap.debug("Bootstrap shutdown");

  if (reason == APP_SHUTDOWN)
    return;

  forEachOpenWindow(unloadFromWindow);
  Services.wm.removeListener(WindowListener);

//    myModule.shutdown();  // Do whatever shutdown stuff you need to do on addon disable

  // HACK WARNING: The Addon Manager does not properly clear all addon related caches on update;
  //               in order to fully update images and locales, their caches need clearing here
  Services.obs.notifyObservers(null, "chrome-flush-caches", null);

  log_bootstrap.debug("Bootstrap shutdown done");
}

function install(data,reason) {
}

function uninstall(data,reason) {
}

function loadIntoWindow(window) {
  log_bootstrap.debug("Bootstrap loadIntoWindow");

  /* call/move your UI construction function here */
    
  if (!window) {
    return;
  }

    
  log_bootstrap.debug("Window: "+window);

  var doc = window.document.getElementById("messengerWindow");
  log_bootstrap.debug("Doc: "+doc);
        
  var s = window.document.createElement("script");
  s.type = "application/javascript";
  s.src = "folderPane.js";
    
  doc.appendChild(s);

    
  log_bootstrap.debug("Bootstrap loadIntoWindow done");
}

function unloadFromWindow(window) {
  log_bootstrap.debug("Bootstrap unloadIntoWindow");

  /* call/move your UI tear down function here */
    
  if (!window) {
    return;
  }
    
  log_bootstrap.debug("Bootstrap unloadIntoWindow done");
}

function forEachOpenWindow(todo)  // Apply a function to all open browser windows
{
  var windows = Services.wm.getEnumerator("mail:3pane");
  while (windows.hasMoreElements())
    todo(windows.getNext().QueryInterface(Components.interfaces.nsIDOMWindow));
}

var WindowListener =
{
  onOpenWindow: function(xulWindow)
  {
    log_bootstrap.debug("Listener onOpenWindow");

    var window = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                          .getInterface(Components.interfaces.nsIDOMWindow);
    function onWindowLoad()
    {
        window.removeEventListener("load",onWindowLoad);
        if (window.document.documentElement.getAttribute("windowtype") == "mail:3pane")
            loadIntoWindow(window);
    }
    window.addEventListener("load",onWindowLoad);
    
    log_bootstrap.debug("Listener onOpenWindow done");
  },
  onCloseWindow: function(xulWindow) {
    log_bootstrap.debug("Listener onCloseWindow");
  },
  onWindowTitleChange: function(xulWindow, newTitle) {
    log_bootstrap.debug("Listener onWindowTitleChange");
  }
};
