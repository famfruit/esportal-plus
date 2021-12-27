const styleLobbyLevels = (level, nickname) => {
    let levelImage = `https://raw.githubusercontent.com/Simpe93/esportal-plus/master/img/faceit/faceit${level}.svg`;
    let wrap = document.createElement("div");
    wrap.classList.add("Tipsy-inlineblock-wrapper");

    let element = document.createElement("a");
    let image = document.createElement("img");

    image.src = levelImage;
    image.style.cssText = "height:30px;width:30px;margin-left:10px;position:relative;top:11px;";

    element.href = `https://faceit.com/en/players/${nickname}`;
    element.target = "_BLANK";

    element.appendChild(image)
    wrap.appendChild(element);
    return wrap;
}

 const getFavoriteMapData = async (time, playerId) => {
    let mapUrl = `https://esportal.com/api/user_profile/get_favorite_maps?_=${time}&id=${playerId}`;
    let mapFetch = await fetch(mapUrl);
    let mapResult = await mapFetch.json();
    if (mapResult) {
        mapResult.forEach(maps => {
            maps["mapwlr"] = maps.wins / maps.losses;
            maps["total"] = maps.wins + maps.losses;
        });
    } else {
        return "";
    }
    mapResult.sort((a, b) => (a.mapwlr > b.mapwlr) ? 1 : -1);
    return [mapResult, playerId];
}

 const getMatches = async (element, userId, favMapElement) => {
    let kills = 0;
    let deaths = 0;
    const currentTime = Date.now();

    let matchList = [];
    let avgMapsPlayed = [];
    let topMatchList = {};

    let numberOfGames = 0;
    const url = `https://api.esportal.com/user_profile/get_latest_matches?_=${currentTime}&id=${userId}&page=1&v=2`;
    try {
        const result = await fetch(url);
        const games = await result.json();
        if (games) {
            for (const game of games) {
                const matchId = game.id;
                const matchData = await getMatch(matchId);
                if (matchData != null && matchData.players != null) {
                    for (let i = 0; i < matchData.players.length; i++) {
                        const player = matchData.players[i];
                        if (userId === player.id && numberOfGames < 5) {
                            kills += player.kills;
                            deaths += player.deaths;
                            numberOfGames += 1;
                            if (!topMatchList["id"]) {
                                let value = await getFavoriteMapData(currentTime, player.id);
                                if (value && value.length > 0) {
                                    value[0].forEach(map => {
                                        avgMapsPlayed.push(map["total"]);
                                    });
                                    topMatchList["map"] = value[0];
                                    topMatchList["id"] = player.id;
                                }
                            }
                            if (player.elo_change > 0) {
                                matchList.push("<span style='color: green;'>W</span>");
                            } else {
                                matchList.push("<span style='color: red;'>L</span>");
                            }
                        }
                    }
                }
            }

            let value = "-";
            if (numberOfGames === 5) {
                value = `${matchList.join(" ")} (${(Math.round((kills / deaths) * 100) / 100).toFixed(2)})`;
            }
            if (element !== undefined) {
                mapIndex = 0;
                usersTopMaps = {};
                topMatchList["avg"] = eval(avgMapsPlayed.join('+')) / avgMapsPlayed.length;
                if (topMatchList["map"]) {
                    topMatchList["map"].forEach(map => {
                        mapGamesPlayed = map.wins + map.losses;
                        if (mapGamesPlayed >= topMatchList["avg"]) {
                            userAvgMap = map.wins / map.losses;
                            usersTopMaps[mapIndex] = {"mapid": map.id, "wins": map.wins, "losses": map.losses, "avg": userAvgMap};
                            mapIndex++;
                        }
                    });

                    mapElement = `<div style="width:44px;height:27px;border-radius:5px;background-size:cover;margin: 0 auto;" class="match-lobby-info-map map${usersTopMaps[mapIndex - 1]["mapid"]}"></div>`;
                    element.innerHTML = value;
                    favMapElement.innerHTML = mapElement;
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}

 const sendFaceitLevelsRequest = async (userList, users) => {
    chrome.runtime.sendMessage({message: "faceitLevels", users: userList}, (response) => {
        if (response) {
            for (let i = 0; i < users.length; i++) {
                if (response[i].level !== 0) {
                    levelWrap = styleLobbyLevels(response[i].level, response[i].nickname);
                    users[i].parentElement.appendChild(levelWrap);
                }
            }
        }
    });
}

const processLobby = async () => {
    if (userStorage.matchStats === "true") {
        const users = [...document.getElementsByClassName("match-lobby-team-username")];
        let index = 0;

        /* Tablefix Header */
        let tableFixFlag = false;

        while(!document.querySelectorAll(".match-lobby-team-tables")[1]) {
            await new Promise(r => setTimeout(r, 100));
        }

        let teamTables = document.querySelectorAll(".match-lobby-team-tables");
        if (teamTables && teamTables.length > 2) {
            let matchEnemyParent = teamTables[1].children[0].children[0];
            if (matchEnemyParent) {
                let matchEnemyTable = matchEnemyParent.querySelectorAll("th")
                if (matchEnemyTable && matchEnemyTable.length != 5) {  // Potential conflict here in the future with only looking at length
                    let matchEnemyHead = document.createElement("th");
                    matchEnemyHead.innerText = "Map";
                    matchEnemyParent.appendChild(matchEnemyHead);
                    tableFixFlag = true;
                }
            }
        }
        /* End Tablefix Header */

        // List of usernames
        let userList = [];
        users.forEach(userElement => {
            const element = userElement.getElementsByTagName("span");
            if (element && element.length > 0) {
                userList.push(element[0].innerText);
            } else {
                userList.push("");
            }
        });

        sendFaceitLevelsRequest(userList, users);

        users.forEach(user => {
            const element = user.getElementsByTagName("span");

            /* Tablefix - Columns */
            if(index > 4 && tableFixFlag) {
                let matchEnemyRowParent = user.parentElement.parentElement;
                let matchEnemyRow = document.createElement("td");
                if (matchEnemyRowParent) {
                    matchEnemyRowParent.appendChild(matchEnemyRow);
                }
            }
            /* End Tablefix - Columns */

            // TODO: Validate all of these
            let tableItem = user.parentElement.parentElement.children[1];
            let headerItem = user.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("thead")[0].children[0].children[1];
            let tableItemMap = user.parentElement.parentElement.children[4];
            let headerItemMap = user.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("thead")[0].children[0].children[4];

            if (element && element.length > 0) {
                getUser(element[0].innerText).then(user => {
                    getMatches(tableItem, user.id, tableItemMap);
                });
            }

            if (index % 5 === 0 && headerItem !== undefined) {
                headerItem.style["text-align"] = "left";
                headerItem.innerText = "Last 5 games";
                headerItemMap.innerText = "Map";
                headerItemMap.style["text-align"] = "center";
            }
            index += 1;
        });
    }
}
