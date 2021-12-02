async function getUser(element, username) {
    const url = `https://api.esportal.com/user_profile/get?username=${username}`;
    try {
        const result = await this.fetch(url);
        const user = await result.json();
        await getMatches(element, user.id);
    } catch (error) {
        console.error(error);
    }
}

async function getMatches(element, userId) {
    let kills = 0;
    let deaths = 0;
    const currentTime = Date.now();
    let matchList = [];

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
            element.innerHTML = value;
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
        let tableItem = user.parentElement.parentElement.children[1];
        let headerItem = user.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("thead")[0].children[0].children[1];
        if (element.length > 0) {
            getUser(tableItem, element[0].innerHTML);
        }
        if (index % 5 === 0 && headerItem !== undefined) {
            headerItem.style["text-align"] = "left";
            headerItem.innerText = "Last 5 games";
        }
        index += 1;
    });
}

window.addEventListener('load', function () {
    processLobby();
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            if (request.url.includes("gather") || request.url.includes("match")) {
                setTimeout(function() {
                    processLobby();
                }, 1000);
            }
        }
    }
);