async function getUser(url) {
    const username = url.substring(url.lastIndexOf('/') + 1);
    try {
        const response = await fetch(`https://api.esportal.com/user_profile/get?username=${username}`);
        const user = await response.json();
        return user;
    } catch (error) {
        console.log(`Failed to get user '${username}': ${error}`);
    }
}

const toSteamID = accountid => "76561" + (accountid + 197960265728 + "");

async function getEsportalId(url) {
    let result = await getUser(url);
    console.log(result);
    return toSteamID(result.id);
}

async function sendFaceitLevel(tabId, url) {
    let steamId = await getEsportalId(url);
    let response = await fetch(`https://api.faceit.com/search/v1?limit=1&query=${steamId}`);
    let result = await response.json();
    chrome.tabs.sendMessage(tabId, {
        message: 'profilePage',
        data: result
    });
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
    chrome.tabs.getSelected(null, function(tab) {
        if (changeInfo.url) {
            if (changeInfo.url.includes("profile")) {
                sendFaceitLevel(tabId, tab.url);
            }
        }
    });
});