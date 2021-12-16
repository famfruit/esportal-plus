const userStorage = {
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
    ],
    isset: false
}

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // Read changeInfo data and send urls to content.js
        if (changeInfo.url) {
            chrome.tabs.sendMessage(tabId, {
                message: 'matchPage',
                url: changeInfo.url
            });
        }
    }
);

chrome.storage.sync.get(['isset'], function(result) {
    // chrome.storage.sync.clear();
    if (!result) {
        chrome.storage.sync.set(userStorage);
    }
});

//chrome.storage.sync.clear()