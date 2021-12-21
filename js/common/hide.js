const settingsActions = {
    hideMedalsProfile:     [".column", "multiple", 7, null],
    hideMissionsProfile:   [".user-profile-level-container", "single", null, "previous"],
    hideActivityProfile:   [".user-profile-activity-list", "single", null, "previous"]
}

function processSettings() {
    let hideActivityProfileDisplay = "block";
    if (userStorage.hideActivityProfile === "true") {
        hideActivityProfileDisplay = "none";
    }
    let settings = settingsActions.hideActivityProfile;
    query = (settings[1] === "single") ? document.querySelector(settings[0]) : document.querySelectorAll(settings[0])[settings[2]];
    if (query != null) {
        querySibling = (settings[3] === "previous") ? query.previousElementSibling : "";
        query.style.display = hideActivityProfileDisplay;
        if (settings[3] === "previous") {
            querySibling.style.display = hideActivityProfileDisplay;
        }
    }

    let hideMissionsProfileDisplay = "block";
    if (userStorage.hideMissionsProfile === "true") {
        hideMissionsProfileDisplay = "none";
    }
    settings = settingsActions.hideMissionsProfile;
    query = (settings[1] === "single") ? document.querySelector(settings[0]) : document.querySelectorAll(settings[0])[settings[2]];
    if (query != null) {
        querySibling = (settings[3] === "previous") ? query.previousElementSibling : "";
        query.style.display = hideMissionsProfileDisplay;
        if (settings[3] === "previous") {
            querySibling.style.display = hideMissionsProfileDisplay;
        }
    }

    let hideMedalsProfileDisplay = "block";
    if (userStorage.hideMedalsProfile === "true") {
        hideMedalsProfileDisplay = "none";
    }
    settings = settingsActions.hideMedalsProfile;
    query = (settings[1] === "single") ? document.querySelector(settings[0]) : document.querySelectorAll(settings[0])[settings[2]];
    if (query != null) {
        querySibling = (settings[3] === "previous") ? query.previousElementSibling : "";
        query.style.display = hideMedalsProfileDisplay;
        if (settings[3] === "previous") {
            querySibling.style.display = hideMedalsProfileDisplay;
        }
    }
}

function hideMain() {
    processSettings();
}
