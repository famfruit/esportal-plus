const getUser = async (username) => {
    try {
        const response = await fetch(`https://api.esportal.com/user_profile/get?username=${username}`);
        const user = await response.json();
        if (user) {
            return user;
        }
    } catch (error) {
        console.log(`Failed to get user '${username}': ${error}`);
    }

    return null;
}

const toSteamID = (accountid) => "76561" + (accountid + 197960265728 + "");

const getEsportalId = async (url) => {
    const username = url.substring(url.lastIndexOf('/') + 1);
    let result = await getUser(username);
    if (result) {
        return toSteamID(result.id);
    }

    return null;
}

const sendFaceitLevel = async (tabId, url) => {
    let steamId = await getEsportalId(url);
    if (steamId) {
        let response = await fetch(`https://api.faceit.com/search/v1?limit=1&query=${steamId}`);
        let result = await response.json();
        if (result) {
            chrome.tabs.sendMessage(tabId, {
                message: 'profilePage',
                data: result
            });
        }
    }
}

const getFaceitLevels = async (request) => {
    const usernames = request.users;
    if (request.message == "faceitLevels") {
        let faceitLevels = [];
        for (let username in usernames) {
            if (username === "") {
                faceitLevels.push({"level": 0, "nickname": ""});
                continue;
            }

            let user = await getUser(usernames[username]);
            if (user) {
                let steamId = toSteamID(user.id);
                if (steamId) {
                    let response = await fetch(`https://api.faceit.com/search/v1?limit=1&query=${steamId}`);
                    let result = await response.json();
                    if (result?.payload?.players?.results) {
                        let data = result.payload.players.results;
                        if (data.length != 0 && data[0].games.length != 0) {
                            let games = data[0].games[0];
                            if (games.name == "csgo") {
                                faceitLevels.push({"level": games.skill_level, "nickname": data[0].nickname});
                            } else {
                                faceitLevels.push({"level": 0, "nickname": ""});
                            }
                        } else {
                            faceitLevels.push({"level": 0, "nickname": ""});
                        }
                    } else {
                        faceitLevels.push({"level": 0, "nickname": ""});
                    }
                } else {
                    faceitLevels.push({"level": 0, "nickname": ""});
                }
            } else {
                faceitLevels.push({"level": 0, "nickname": ""});
            }
        }
        return faceitLevels;
    }
    return [];
}

chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab) => {
        // Read changeInfo data and send urls to content.js
        if (changeInfo.url) {
            chrome.tabs.sendMessage(tabId, {
                message: 'matchPage',
                url: changeInfo.url
            });
        }
    }
);

/*chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { 
    chrome.tabs.getSelected(null, (tab) => {
        if (changeInfo.url) {
            if (changeInfo.url.includes("profile")) {
                sendFaceitLevel(tabId, tab.url);
            }
        }
    });
});*/

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete') {
        chrome.tabs.getSelected(null, (tab) => {
            if (tab.url) {
                if (tab.url.includes("profile")) {
                    sendFaceitLevel(tabId, tab.url);
                }
            }
        });
    }
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        getFaceitLevels(request).then(sendResponse);
        return true;
    }
);