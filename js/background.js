async function getUser(username) {
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
    const username = url.substring(url.lastIndexOf('/') + 1);
    let result = await getUser(username);
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

/*async function getFaceitLevels(usernames) {
    let faceitLevels = [];
    for (let username in usernames) {
        getUser(usernames[username]).then(user => {
            let steamId = toSteamID(user.id);
            fetch(`https://api.faceit.com/search/v1?limit=1&query=${steamId}`).then(response => {
                response.json().then(result => {
                    let data = result.payload.players.results;
                    let games = "";
                    if (data.length != 0 && data[0].games.length != 0) {
                        games = data[0].games[0];
                    }
                    if (games.name == "csgo") {
                        faceitLevels.push({"level": games.skill_level, "nickname": data[0].nickname});
                    }
                });
            });
        });
    }
    console.log(faceitLevels);
    return faceitLevels;
}*/

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

/*chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
        console.log(request.users);
        if (request.message == "faceitLevels") {
            getFaceitLevels(request.users).then(faceitData => {
                sendResponse({data: faceitData});
            });
        }
    }
);*/