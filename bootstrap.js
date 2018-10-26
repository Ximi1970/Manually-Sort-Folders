// https://flagfox.wordpress.com/2014/01/19/writing-restartless-addons/

Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("resource://tbsortfolders/logging.jsm");
var tblog_bootstrap = tbsortfolders.Logging.getLogger("tbsortfolders.bootstrap");

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
    tblog_bootstrap.debug("Boostrap startup");

//    Components.utils.import("chrome://tbsortfolders/content/ui.js");
//    Components.utils.import("chrome://tbsortfolders/content/folderPane.js");
 
    setDefaultPrefs();
    
//    myModule.startup();  // Do whatever initial startup stuff you need to do

//  document.loadOverlay("chrome://tbsortfolders/content/overlay.xul",null);

    forEachOpenWindow(loadIntoWindow);
    Services.wm.addListener(WindowListener);
    
    tblog_bootstrap.debug("Boostrap startup done");
}

function shutdown(data,reason) {
    tblog_bootstrap.debug("Boostrap shutdown");

    if (reason == APP_SHUTDOWN)
        return;

    forEachOpenWindow(unloadFromWindow);
    Services.wm.removeListener(WindowListener);

//    myModule.shutdown();  // Do whatever shutdown stuff you need to do on addon disable

    // HACK WARNING: The Addon Manager does not properly clear all addon related caches on update;
    //               in order to fully update images and locales, their caches need clearing here
    Services.obs.notifyObservers(null, "chrome-flush-caches", null);

    tblog_bootstrap.debug("Boostrap shutdown done");
}

function install(data,reason) {
    tblog_bootstrap.debug("Boostrap install");
}

function uninstall(data,reason) {
    tblog_bootstrap.debug("Boostrap uninstall");
}

function loadIntoWindow(window) {
/* call/move your UI construction function here */
    tblog_bootstrap.debug("Boostrap loadIntoWindow");
}

function unloadFromWindow(window) {
/* call/move your UI tear down function here */
    tblog_bootstrap.debug("Boostrap unloadIntoWindow");
}

function forEachOpenWindow(todo)  // Apply a function to all open browser windows
{
    var windows = Services.wm.getEnumerator("navigator:browser");
    while (windows.hasMoreElements())
        todo(windows.getNext().QueryInterface(Components.interfaces.nsIDOMWindow));
}

var WindowListener =
{
    onOpenWindow: function(xulWindow)
    {
        Components.utils.import("resource://tbsortfolders/logging.jsm");
        let tblog_listener = tbsortfolders.Logging.getLogger("tbsortfolders.listener");

        var window = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                              .getInterface(Components.interfaces.nsIDOMWindow);
        function onWindowLoad()
        {
            window.removeEventListener("load",onWindowLoad);
            if (window.document.documentElement.getAttribute("windowtype") == "navigator:browser")
                loadIntoWindow(window);
        }
        window.addEventListener("load",onWindowLoad);
        
        tblog_listener.debug("Listener onOpenWindow");
    },
    onCloseWindow: function(xulWindow) {
        Components.utils.import("resource://tbsortfolders/logging.jsm");
        let tblog_listener = tbsortfolders.Logging.getLogger("tbsortfolders.listener");

        tblog_listener.debug("Listener onCloseWindow");
    },
    onWindowTitleChange: function(xulWindow, newTitle) {
        Components.utils.import("resource://tbsortfolders/logging.jsm");
        let tblog_listener = tbsortfolders.Logging.getLogger("tbsortfolders.listener");

        tblog_listener.debug("Listener onWindowTitleChange");
    }
};
