const toSteamID = accountid => "76561" + (accountid + 197960265728 + "");

async function getEsportalId(username) {
    let resp = await fetch(`https://api.esportal.com/user_profile/get?username=${username}`);
    let result = await resp.json();
    return toSteamID(result.id);
}

async function getFaceitLevel(username) {
    if (!userStorage.settings.faceitlevels) {
        let steamId = await getEsportalId(username);
        let resp = await fetch(`https://api.faceit.com/search/v1?limit=1&query=${steamId}`);
        let result = await resp.json();
        if (result.payload.players.results.length != 0 && result.payload.players.results[0].games.length != 0) {
            games = result.payload.players.results[0].games[0];
        } else {
            games = "";
        }
        if (!games || games == "") {
            return ["", ""];
        } else if (games.name == "csgo") {
            return [games.skill_level, result.payload.players.results[0].nickname];
        }
    } else {
        return ["", ""];
    }
}
