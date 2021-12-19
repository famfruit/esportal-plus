// Globals
let userStorage;

const defaultSettings = {
    settings: {
        autoAccept: false,
        autoCommend: false,
        hideLivestreams: false,
        profileKdButton: true,
        faceitlevels: true,
        matchStats: true,
        hideMedalsProfile: true,
        hideMissionsProfile: true,
        hideActivityProfile: true,
        smallCardsProfile: true
    },
    buttons: [
        {setting: "autoAccept", text: "Autoaccepting Matches", type:"setting"},
        {setting: "autoCommend", text: "Autocommend Premade Teammates", type:"setting"},
        {setting: "hideLivestreams", text: "Hide All Livestreams", type:"setting"},
        {setting: "hideMedalsProfile", text: "Medals", type:"hide"},
        {setting: "hideMissionsProfile", text:"Missions", type:"hide"},
        {setting: "hideActivityProfile", text:"Activity", type:"hide"},
        {setting: "smallCardsProfile", text: "Smaller Profile Cards", type:"setting"},
        {setting: "profileKdButton", text: "KDR Profile Button", type:"feature"},
        {setting: "matchStats", text: "Advanced Match Stats", type:"feature"},
        {setting: "faceitlevels", text: "Faceit Levels", type:"feature"}
    ]
}

const getSettingsStorage = async (key) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

const setSettingsStorage = async (value) => {
    await chrome.storage.local.set({ "settings": value }, () => {
        console.log("Settings saved!");
    });
}

const fetchSettings = async () => {
    let settingsData = await getSettingsStorage("settings");
    if (settingsData !== undefined) {
        userStorage = settingsData;
        console.log("Got settings");
    } else {
        setSettingsStorage(defaultSettings);
        userStorage = defaultSettings;
        console.log("Using deafults");
    }
}

window.addEventListener('load', () => {
    fetchSettings(); // apply default settings if not set
});