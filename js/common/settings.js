let userStorage;

const defaultSettings = {
    autoAccept: "false",
    autoCommend: "false",
    hideLiveStreams: "false",
    profileKDButton: "true",
    faceitLevels: "true",
    matchStats: "true",
    profileStats: "true",
    historyStats: "true",
    hideMedalsProfile: "true",
    hideMissionsProfile: "true",
    hideActivityProfile: "true",
    smallCardsProfile: "true",
    hideSuggestedFriends: "true"
}

const getSettingsStorage = async (key) => {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

const fetchSettings = async () => {
    let settingsData = await getSettingsStorage("settings");
    if (settingsData) {
        userStorage = settingsData;
    } else {
        userStorage = defaultSettings;
    }
}

const getUpdatedSetting = (settings) => {
    for (const setting of Object.keys(settings)) {
        if (settings[setting] !== userStorage[setting]) {
            return setting;
        }
    }
}

const isMatchPage = (url) => {
    return url.includes("match") && !url.includes("matchmaking") || url.includes("gather");
}

const isProfilePage = (url) => {
    return url.includes("profile");
}

window.addEventListener('load', () => {
    // Fetch settings for storage on page load
    // Use default settings if no settings exist in storage
    fetchSettings();

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.settings?.newValue) {
            // Determine which setting was updated and update user storage
            let setting = getUpdatedSetting(changes.settings?.newValue);
            userStorage = changes.settings?.newValue;

            if (setting === "hideSuggestedFriends") {
                toggleSuggestedFriends();
            }

            // Update page based on updated setting
            if (isMatchPage(window.location.href)) {
                switch(setting) {
                    case "matchStats":
                        toggleLobby();
                        break;
                    case "faceitLevels":
                        enableFaceitLevel();
                        break;
                    default:
                        break;
                }
            } else if (isProfilePage(window.location.href)) {
                switch(setting) {
                    case "profileStats":
                    case "smallCardsProfile":
                        clearStats();
                        getStats();
                        break;
                    case "profileKDButton":
                        clearKdButton();
                        getKdButton();
                        break;
                    case "faceitLevels":
                        enableFaceitLevel();
                        break;
                    case "historyStats":
                        enableHistory();
                        break;
                    case "hideMedalsProfile":
                    case "hideMissionsProfile":
                    case "hideActivityProfile":
                        hideMain();
                        break;
                    case "hideLiveStreams":
                        hideLivestreams();
                        break;
                    default:
                        break;
                }
            }
        }
    });
});
