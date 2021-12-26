// Globals
let userStorage;

const defaultSettings = {
    autoAccept: false,
    autoCommend: false,
    hideLiveStreams: false,
    profileKDButton: true,
    faceitLevels: true,
    matchStats: true,
    hideMedalsProfile: true,
    hideMissionsProfile: true,
    hideActivityProfile: true,
    smallCardsProfile: true
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
    if (settingsData !== undefined) {
        userStorage = settingsData;
    } else {
        userStorage = defaultSettings;
    }
}

function getUpdatedSetting(updatedSettings) {
    for (let setting of Object.keys(updatedSettings)) {
        if (updatedSettings[setting] != userStorage[setting]) {
            return setting;
        }
    }
}

window.addEventListener('load', () => {
    fetchSettings();

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.settings?.newValue) {
            let updatedSetting = getUpdatedSetting(changes.settings?.newValue);
            userStorage = changes.settings?.newValue;
            const href = window.location.href;
            if ((href.includes("match") && !href.includes("matchmaking")) || href.includes("gather")) {
                if (updatedSetting === "matchStats") {
                    processLobby();
                }
            } else if (href.includes("profile")) {
                if (updatedSetting === "profileStats") {
                    clearStats();
                    getStats();
                } else if (updatedSetting === "profileKDButton") {
                    clearKdButton();
                    getKdButton();
                } else if (updatedSetting === "hideMedalsProfile" || updatedSetting === "hideMissionsProfile" || updatedSetting === "hideActivityProfile") {
                    hideMain();
                } else if (updatedSetting === "faceitLevels") {
                    enableFaceitLevel(userStorage.faceitLevels === "true");
                } else if (updatedSetting === "historyStats") {
                    enableHistory(userStorage.historyStats === "true");
                }
            }
        }
    });
});
