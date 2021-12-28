const settingsActions = {
    hideMedalsProfile:     [".column", "multiple", 7, null],
    hideMissionsProfile:   [".user-profile-level-container", "single", null, "previous"],
    hideActivityProfile:   [".user-profile-activity-list", "single", null, "previous"]
}

const processHideSettings = () => {
    for([index, value] of Object.entries(settingsActions)){
        // Iterate over settingsActions and set settings according to user storage
        let hideSettings = settingsActions[index];
        let hideValue = "block";
        if (userStorage[index] === "true"){
            hideValue = "none";
        }

        // Determines what element(s) should be hidden
        let query = (hideSettings[1] === "single") ? document.querySelector(hideSettings[0]) : document.querySelectorAll(hideSettings[0])[hideSettings[2]];
        if (query) {
            let querySibling = (hideSettings[3] === "previous") ? query.previousElementSibling : "";
            query.style.display = hideValue;
            // If parent has generic class name,
            // find the child and then backtrack to
            // the parent and hide/display that one instead
            if (hideSettings[3] === "previous") {
                querySibling.style.display = hideValue;
            }
        }
    }
}

const clearAds = () => {
  // Remove ads and nonsense that disrupts the user experience
  // - "top-bar-matchmaking" is often used for ads in the header-navigation bar
  // - Runs Globally
  const headerClass = "top-bar-matchmaking";
  let headerElements = document.querySelectorAll(`[class*=${headerClass}]`);
  if (headerElements) {
    headerElements.forEach(headerElement => {
        headerElement.style.display = "none";
    });
  }
}

const toggleSuggestedFriends = () => {
    let elements = document.getElementsByClassName("sidebar-suggested-friends");
    if (elements) {
        for (let i = 0; i < elements.length; i++) {
            if (userStorage.hideSuggestedFriends === "true") {
                elements[i].style.display = "none";
            } else {
                elements[i].style.display = "block";
            }
        }
    }
}

const hideMain = () => {
    processHideSettings();
}
