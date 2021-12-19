async function getFaceitLevel(data) {
    //if (!userStorage.settings.faceitlevels) {
        if (data) {
            if (data.payload.players.results.length != 0 && result.payload.players.results[0].games.length != 0) {
                games = data.payload.players.results[0].games[0];
            } else {
                games = "";
            }
            if (!games || games == "") {
                return ["", ""];
            } else if (games.name == "csgo") {
                return [games.skill_level, result.payload.players.results[0].nickname];
            }
        }
    //} else {
    //    return ["", ""];
    //}
}
