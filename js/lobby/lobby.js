function styleLobbyLevels(level){
  const levelCols = {1:"#ededed", 2:"#1ce200", 3:"#1ce200", 4:"#fec700", 5:"#fec700", 6:"#fec700", 7:"#fec700", 8:"#ff6309", 9:"#ff6309", 10:"#f91e00"}
  padd = (level[0] === 10) ? "2px 4px" : "2px 7px"
  wrap = document.createElement("div")
  wrap.classList.add("Tipsy-inlineblock-wrapper")

  element = document.createElement("a")
  element.href = `https://faceit.com/en/players/${level[1]}`
  element.target = "_BLANK"
  element.style.cssText = `color: ${levelCols[level[0]]};margin-left:10px;border-radius:50%;padding:${padd};border:1px solid ${levelCols[level[0]]}`
  element.innerText = level[0]
  wrap.appendChild(element)
  return wrap
}
async function getUser(element, username, favMapElement) {
    const url = `https://api.esportal.com/user_profile/get?username=${username}`;
    try {
        const result = await this.fetch(url);
        const user = await result.json();
        await getMatches(element, user.id, favMapElement);
    } catch (error) {
        console.error(error);
    }
}

async function getMatches(element, userId, favMapElement) {
    let kills = 0;
    let deaths = 0;
    const currentTime = Date.now();
    let matchList = [];
    let favMatchList = {};
    let numberOfGames = 0;
    const url = `https://api.esportal.com/user_profile/get_latest_matches?_=${currentTime}&id=${userId}&page=1&v=2`;
    try {
        const result = await this.fetch(url);
        const games = await result.json();
        for (const game of games) {
            const matchId = game.id;
            const matchData = await getMatch(matchId);
            if (matchData != null && matchData.players != null) {
                matchData.players.forEach(player => {
                    if (userId === player.id && numberOfGames < 5) {
                        kills += player.kills;
                        deaths += player.deaths;
                        numberOfGames += 1
                        favMatchList[player.id] = player.favorite_map_id
                        if (player.elo_change > 0) {
                            matchList.push("<span style='color: green;'>W</span>");
                        } else {
                            matchList.push("<span style='color: red;'>L</span>");
                        }
                    }
                });
            }
        }
        let value = "-";
        if (numberOfGames === 5) {
            value = `${matchList.join(" ")} (${Math.round((kills / deaths) * 100) / 100})`;
        }
        if (element !== undefined) {
          // Appending data to table
          mapElement = `<div style="width:51px;height:32px;border-radius:5px;background-size:cover" class="match-lobby-info-map map${favMatchList[userId]}"></div>`
          element.innerHTML = value
          favMapElement.innerHTML = mapElement
        }
    } catch (error) {
        console.error(error);
    }
}

async function getMatch(matchId) {
    const url = `https://api.esportal.com/match/get?_=1&id=${matchId}`;
    try {
        const result = await this.fetch(url);
        const match = await result.json();
        return match;
    } catch (error) {
        return null;
    }
}

async function processLobby() {
    const users = [...document.getElementsByClassName("match-lobby-team-username")];
    let index = 0;
    users.forEach(user => {
        const element = user.getElementsByTagName("span");
        let level = getFaceitLevel(element[0].innerText).then(level => {
          if(level === undefined) {return}
          if(level[0] > 0){
            levelWrap = styleLobbyLevels(level)
            user.parentElement.appendChild(levelWrap)
          }
        })
        let tableItem = user.parentElement.parentElement.children[1];
        let headerItem = user.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("thead")[0].children[0].children[1];
        let tableItemMap = user.parentElement.parentElement.children[4];
        let headerItemMap = user.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("thead")[0].children[0].children[4];

        if (element.length > 0) {
            getUser(tableItem, element[0].innerHTML, tableItemMap);
        }
        if (index % 5 === 0 && headerItem !== undefined) {
            headerItem.style["text-align"] = "left";
            headerItem.innerText = "Last 5 games";
            headerItemMap.innerText = "Favorite Map";
        }
        index += 1;
    });
}
