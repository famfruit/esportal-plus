const getStorage = async (_key) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(_key, (result) => {
            resolve(result[_key]);
        });
    });
}

const setStorage = async (_key, _value) => {
    await chrome.storage.local.set({ _key: _value}, () => {
        console.log("Storage updated");
    });
}

const clearStorage = async (_key) => {
    await chrome.storage.local.remove([_key]);
}

let matches = new Map();
let users = new Map();

const setupCache = async () => {
    let userData = await getStorage("users");
    if (userData) {
        users = new Map(Object.entries(userData));
    }

    let matchData = await getStorage("matches");
    if (matchData) {
        matches = new Map(Object.entries(matchData));
    }
}

window.addEventListener('load', () => {
    // Setup match and users on page load
    setupCache();

    // Sync data to storage every 60 sec
    setInterval(() => {
        setStorage("users", Object.fromEntries(users));
        setStorage("matches", Object.fromEntries(matches));
    }, 60000);
});

const getUser = async (username) => {
    if (users.has(username)) {
        return users.get(username);
    }

    // Fetch user from api
    const url = `https://api.esportal.com/user_profile/get?username=${username}`;
    try {
        const response = await fetch(url);
        const user = await response.json();
        if (user) {
            // Update users storage and return user
            users.set(username, user);
            return user;
        }
    } catch (error) {
        console.log(`Failed to get user '${username}': ${error}`);
    }

    // Return empty object in case of error
    return {};
}

const getMatch = async (matchId) => {
    if (matches.has(matchId)) {
        return matches.get(matchId);
    }

    // Fetch match from api
    const url = `https://api.esportal.com/match/get?_=1&id=${matchId}`;
    try {
        const response = await fetch(url);
        const match = await response.json();
        if (match) {
            // Update matches storage and return match
            matches.set(matchId, match);
            return match;
        }
    } catch (error) {
        console.log(`Failed to get match '${matchId}': ${error}`);
    }

    // Return empty object in case of error
    return {};
}