document.addEventListener("click", (e) => {

  function getCurrentWindow() {
    return browser.windows.getCurrent();
  }

  if (e.target.id === "test-1") {
    getCurrentWindow().then((currentWindow) => {
      console.log("Test 1");

//      win = ....getMostRecentWindow("mail:3pane");
//    win.document.getElementById('tabmail');
      
      
//      browser.windows.update(currentWindow.id, updateInfo);
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
