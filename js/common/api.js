const getStorage = async (key) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

const setStorage = async (store, value) => {
    await chrome.storage.local.set({ store: value }, () => {
        console.log("Hej");
    });
}

const clearStorage = async (key) => {
    await chrome.storage.local.remove([key]);
}

let matches = new Map();
let users = new Map();

const setupCache = async () => {
    let userData = await getStorage("users");
    if (userData !== undefined) {
        users = new Map(Object.entries(userData));
    }

    let matchData = await getStorage("matches");
    if (matchData !== undefined) {
        matches = new Map(Object.entries(matchData));
    }
}

window.addEventListener('load', () => {
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

        // Update users storage and return user
        users.set(username, user);
        return user;
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

        // Update matches storage and return match
        matches.set(matchId, match);
        return match;
    } catch (error) {
        console.log(`Failed to get match '${matchId}': ${error}`);
    }

    // Return empty object in case of error
    return {};
}