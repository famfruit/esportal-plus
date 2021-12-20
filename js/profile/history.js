async function getHistory(firstTime) {
    if (userStorage.historyStats === "true") {
        const username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let matchLinks = document.getElementsByClassName("user-stats-view-latest-match");
    
        if (firstTime) {
            let th = document.createElement("th");
            let label = document.createTextNode("K/D");
            th.appendChild(label);
            matchLinks[0].parentElement.parentElement.parentElement.parentElement.getElementsByTagName("thead")[0].children[0].appendChild(th);
        }
    
        for (let i = 0; i < matchLinks.length; i++) {
            const href = matchLinks[i].getAttribute("href");
            const matchId = href.substring(href.lastIndexOf("/") + 1);
            getMatch(matchId).then(match => {
                let kills = -1;
                let deaths = -1;
                let wins = -1;
                let loses = -1;
                if (match != null && match.players != null) {
                    for (let p = 0; p < match.players.length; p++) {
                        if (match.players[p].username === username) {
                            kills = match.players[p].kills;
                            deaths = match.players[p].deaths;
                            if (match.players[p].team === 1) {
                                wins = match.team1_score;
                                loses = match.team2_score;
                            } else {
                                wins = match.team2_score;
                                loses = match.team1_score;
                            }
                            break;
                        }
                    }
    
                    const kd = `${(Math.round((kills / deaths) * 100) / 100).toFixed(2)}`;
                    let value = "";
                    if (kills >= deaths) {
                        value = `<td><span style="color: green;">${kills} - ${deaths}</span> (${kd})</td>`;
                    } else {
                        value = `<td><span style="color: red;">${kills} - ${deaths}</span> (${kd})</td>`;
                    }
    
                    let td = document.createElement("td");
                    matchLinks[i].parentElement.parentElement.children[4].innerHTML += ` <span style="color: white;">(${wins} - ${loses})</span>`;
                    matchLinks[i].parentElement.parentElement.appendChild(td);
                    matchLinks[i].parentElement.parentElement.children[6].innerHTML = value;
                }
            });
        }
    }
}