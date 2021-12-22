const settingsActions = {
    hideMedalsProfile:     [".column", "multiple", 7, null],
    hideMissionsProfile:   [".user-profile-level-container", "single", null, "previous"],
    hideActivityProfile:   [".user-profile-activity-list", "single", null, "previous"]
}

function processSettings() {
    for([name, value] of Object.entries(settingsActions)){
        // Loop through settingsActions and set settings according to userStorage
        let settings = settingsActions[name];
        let hideValue = "block";
        if (userStorage[name] === "true"){
            // Toggles visibility
            hideValue = "none";
        }
        // Determines what element(s) should be hidden or shown
        query = (settings[1] === "single") ? document.querySelector(settings[0]) : document.querySelectorAll(settings[0])[settings[2]];
        if (query != null) {
            querySibling = (settings[3] === "previous") ? query.previousElementSibling : "";
            query.style.display = hideValue;
            // If parent has generic class name
            // find the child and then backtrack to the parent and hide/display that one instead
            if (settings[3] === "previous") {
                querySibling.style.display = hideValue;
            }
        }
    }
}
function clearAds(){
  // Remove ads and nonsense that disrupts the user experience
  // - "top-bar-matchmaking" is often used for ads in the header-navigation bar
  // - Runs Globally
  const headerMatchString = "top-bar-matchmaking";
  let headerElements = document.querySelectorAll(`[class*=${headerMatchString}]`);
  headerElements.forEach(function (element){
      element.style.display = "none";
  })
}
function hideMain() {
    processSettings();
}
