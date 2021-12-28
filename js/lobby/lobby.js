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
    element.className = "esportal-plus-faceit-level";

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
                    element.className = "esportal-plus-lobby-games-body";
                    element.style["text-align"] = "left";
                    favMapElement.innerHTML = mapElement;
                    favMapElement.className = "esportal-plus-lobby-map-body";
                    favMapElement.style["text-align"] = "center";
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
        // Wait for lobby tables to load
        while (!document.querySelectorAll(".match-lobby-team-tables")[1]) {
            await new Promise(r => setTimeout(r, 100));
        }

        const users = [...document.getElementsByClassName("match-lobby-team-username")];

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

        // Setup tables
        let tables = document.getElementsByClassName("match-lobby-team-tables");
        let matchCells = [];
        let mapCells = [];
        let matchHeaderCells = [];
        let mapHeaderCells = [];
        if (tables) {
            for (let i = 0; i < tables.length; i++) {
                let tableHead = tables[i].tHead;
                if (tableHead?.rows && tableHead.rows.length > 0) {
                    let tableHeadRow = tableHead.rows[0];
                    if (tableHeadRow?.cells) {
                        if (tableHeadRow.cells.length === 4) {
                            tableHeadRow.cells[1].style.display = "none";
                            tableHeadRow.cells[1].classList.add("esportal-plus-removed");
                            matchHeaderCells.push(tableHeadRow.insertCell(1));
                            mapHeaderCells.push(tableHeadRow.insertCell());
                        } else if (tableHeadRow.cells.length === 5) {
                            tableHeadRow.cells[1].style.display = "none";
                            tableHeadRow.cells[4].style.display = "none";
                            tableHeadRow.cells[1].classList.add("esportal-plus-removed");
                            tableHeadRow.cells[4].classList.add("esportal-plus-removed");
                            matchHeaderCells.push(tableHeadRow.insertCell(1));
                            mapHeaderCells.push(tableHeadRow.insertCell());
                        }
                    }
                }

                let tableBody = tables[i].tBodies[0];
                if (tableBody?.rows && tableBody.rows.length > 0) {
                    let tableRows = tableBody.rows;
                    if (tableRows[0].cells) {
                        if (tableRows[0].cells.length === 4) {
                            // Hide index 1
                            for (const tableRow of tableRows) {
                                tableRow.cells[1].style.display = "none";
                                tableRow.cells[1].classList.add("esportal-plus-removed");
                                matchCells.push(tableRow.insertCell(1));
                                mapCells.push(tableRow.insertCell());
                            }
                        } else if (tableRows[0].cells.length === 5) {
                            // Hide index 1 and 4
                            for (const tableRow of tableRows) {
                                tableRow.cells[1].style.display = "none";
                                tableRow.cells[4].style.display = "none";
                                tableRow.cells[1].classList.add("esportal-plus-removed");
                                tableRow.cells[4].classList.add("esportal-plus-removed");
                                matchCells.push(tableRow.insertCell(1));
                                mapCells.push(tableRow.insertCell());
                            }
                        }
                    }
                }
            }
        }

        for (let u = 0; u < users.length; u++) {
            let user = users[u];
            const element = user.getElementsByTagName("span");

            if (element && element.length > 0) {
                getUser(element[0].innerText).then(user => {
                    getMatches(matchCells[u], user.id, mapCells[u]);
                });
            }
        }

        for (let y = 0; y < matchHeaderCells.length; y++) {
            let matchHeaderCell = matchHeaderCells[y];
            matchHeaderCell.className = "esportal-plus-lobby-games-header";
            matchHeaderCell.style["text-align"] = "left";
            matchHeaderCell.innerText = "Last 5 games";
        }

        for (let w = 0; w < mapHeaderCells.length; w++) {
            let mapHeaderCell = mapHeaderCells[w];
            mapHeaderCell.className = "esportal-plus-lobby-map-header";
            mapHeaderCell.style["text-align"] = "center";
            mapHeaderCell.innerText = "Map";
        }
    }
}

const toggleLobby = () => {
    let gamesHeaders = document.getElementsByClassName("esportal-plus-lobby-games-header");
    if (gamesHeaders) {
        for (let i = 0; i < gamesHeaders.length; i++) {
            if (userStorage.matchStats === "true") {
                gamesHeaders[i].style.display = "table-cell";
            } else {
                gamesHeaders[i].style.display = "none";
            }
        }
    }

    let gamesBodies = document.getElementsByClassName("esportal-plus-lobby-games-body");
    if (gamesBodies) {
        for (let i = 0; i < gamesBodies.length; i++) {
            if (userStorage.matchStats === "true") {
                gamesBodies[i].style.display = "table-cell";
            } else {
                gamesBodies[i].style.display = "none";
            }
        }
    }

    let mapHeaders = document.getElementsByClassName("esportal-plus-lobby-map-header");
    if (mapHeaders) {
        for (let i = 0; i < mapHeaders.length; i++) {
            if (userStorage.matchStats === "true") {
                mapHeaders[i].style.display = "table-cell";
            } else {
                mapHeaders[i].style.display = "none";
            }
        }
    }

    let mapBodies = document.getElementsByClassName("esportal-plus-lobby-map-body");
    if (mapBodies) {
        for (let i = 0; i < mapBodies.length; i++) {
            if (userStorage.matchStats === "true") {
                mapBodies[i].style.display = "table-cell";
            } else {
                mapBodies[i].style.display = "none";
            }
        }
    }

    let removes = document.getElementsByClassName("esportal-plus-removed");
    if (removes) {
        for (let i = 0; i < removes.length; i++) {
            if (userStorage.matchStats === "true") {
                removes[i].style.display = "none";
            } else {
                removes[i].style.display = "table-cell";
            }
        }
    }
}