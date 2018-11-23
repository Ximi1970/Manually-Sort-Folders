document.addEventListener("click", (e) => {

  function getCurrentWindow() {
    return browser.windows.getCurrent();
  }

  if (e.target.id === "test-1") {
    getCurrentWindow().then((currentWindow) => {
      console.log("Test 1");

      function logTabsForWindows(windowInfoArray) {
        for (windowInfo of windowInfoArray) {
          console.log(`Window: ${windowInfo.id}`);
          console.log(windowInfo.tabs.map((tab) => {return tab.url}));
          console.log(windowInfo.tabs.map((tab) => {return tab.title}));
        }
      }

      function onError(error) {
        console.log(`Error: ${error}`);
      }

      var getting = browser.windows.getAll({
        populate: true
      });
      getting.then(logTabsForWindows, onError);
     
      
      function winlog(win) {
        console.log(`Window2: ${win.id}`);
        console.log(`Window2: ${win.tabs[0].url}`);
        
        var newwin = window.open(win.tabs[0].url);
        console.log(`New Window2: ${newwin}`);
        console.log(`New Window2: ${newwin.document.URL}`);
       
      }
      
      var win = browser.windows.get(3, {
        populate: true
      });      
      win.then(winlog, onError);
      
      var win = document.defaultView;
      console.log(`Win: ${win}`);
      console.log(`Win: ${win.name}`);

      var wintop = win.top;
      console.log(`Wintop: ${wintop}`);
      console.log(`Wintop: ${wintop.name}`);

      var wintopdoc = wintop.document;
      console.log(`Wintopdoc: ${wintopdoc.URL}`);
      console.log(`Wintopdoc: ${wintopdoc.title}`);

      var winpar1 = win.parent;
      console.log(`Winpar1: ${winpar1}`);
      console.log(`Winpar1: ${winpar1.name}`);

      var winpar2 = winpar1.parent;
      console.log(`Winpar2: ${winpar2}`);
      console.log(`Winpar2: ${winpar2.name}`);
      
//      var ele = document.getElementById("tabmail");
//      console.log(`Doc: ${ele}`);
      
      
//      console.log("Window: "+browser.windows.get('mail:3pane'));
//      console.log("Tabmail: "+document.getElementById("tabmail-tabs"));
//      console.log("Tabmail: "+document.getElementById("tabmail"));
      
      
//      win = ....getMostRecentWindow("mail:3pane");
//    win.document.getElementById('tabmail');
      
//      https://wiki.mozilla.org/Thunderbird/Add-ons_Guide_57
//      Add-ons need to replace document.getElementById("tabcontainer") with document.getElementById("tabmail-tabs").
      
      
//      browser.windows.update(currentWindow.id, updateInfo);
      console.log("Test 1 End");
    });
  }

  else if (e.target.id === "test-2") {
    getCurrentWindow().then((currentWindow) => {
      console.log("Test 2");
      
//    let createData = {};
//    let creating = browser.windows.create(createData);
//    creating.then(() => {
//      console.log("The normal window has been created");
    });
  }

  e.preventDefault();
});
