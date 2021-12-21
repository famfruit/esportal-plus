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

window.addEventListener('load', () => {
    fetchSettings();

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && changes.settings?.newValue) {
            userStorage = changes.settings?.newValue;
            const href = window.location.href;
            if ((href.includes("match") && !href.includes("matchmaking")) || href.includes("gather")) {
                processLobby();
            } else if (href.includes("profile")) {
                clearStats();
                clearKdButton();
                hideMain();
                getKdButton();
                getStats();
                // processProfile();
                // matchHistoryPageListener();
            }
        }
    });
});