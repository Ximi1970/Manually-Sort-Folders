const gettingItem = browser.storage.local.get("prefs");
gettingItem.then(results => {
  const {prefs} = results || {
    prefs: {
      HelloPref: "default value"
    },
  };

  const el = document.querySelector("#HelloPref");
  el.value = prefs.HelloPref;

  const updatePref = () => {
    browser.storage.local.set({
      prefs: {
        HelloPref: el.value,
      },
    });
  };

  el.addEventListener("input", updatePref);
});
