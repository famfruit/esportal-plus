const playerStats = async (data) => {
    if (!data || data.length < 1) {
        return;
    }

    if (userStorage.profileStats === "true") {
        const summaries = document.getElementsByClassName("user-profile-summary");

        if (summaries && summaries.length > 0) {
            const summary = summaries[0];

            let header = document.createElement("div");
            header.className = "user-profile-heading";
            header.style.cssText = "margin-top: 15px;margin-bottom: 15px;";
            header.id = "esportal-plus-profile-stats-header";
            let headerValue = document.createTextNode("Latest 5 games");
            header.appendChild(headerValue);

            summary.appendChild(header);

            let stats = document.createElement("div");
            stats.id = "esportal-plus-profile-stats";
            let boxes = document.createElement("div");
            boxes.className = "user-profile-stats-boxes";
            boxes.style.cssText = "margin-top: 15px;"

            const icons = ["records-kdr", "records-win-ratio", "records-headshot", "records-drops"];
            const labels = ["K/D-kvot", "Vinstkvot", "Headshot %", "Drop ratio"];

            for (let i = 0; i < 4; i++) {
                let box = document.createElement("div");
                box.className = "user-profile-stats-box";

                let value = document.createElement("div");
                value.className = "user-profile-stats-box-value";

                let tipsy = document.createElement("div");
                let tipsyValue = document.createTextNode(data[i]);
                tipsy.appendChild(tipsyValue);

                let label = document.createElement("div");
                label.className = "label";
                let labelValue = document.createTextNode(labels[i]);
                label.appendChild(labelValue);

                value.appendChild(tipsy);
                value.appendChild(label);

                if (userStorage.smallCardsProfile === "false") {
                    let icon = document.createElement("div");
                    icon.className = "user-profile-stats-box-icon " + icons[i];
                    box.appendChild(icon);
                }
                box.appendChild(value);
                boxes.appendChild(box);
            }
            stats.appendChild(boxes);
            summary.appendChild(stats);
        }
    }
}

const clearStats = () => {
    let statsHeader = document.getElementById("esportal-plus-profile-stats-header");
    let stats = document.getElementById("esportal-plus-profile-stats");
    if (statsHeader) {
        statsHeader.remove();
    }
    if (stats) {
        stats.remove();
    }
}

const getStats = async () => {
    const username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

    const getStats = async (userId) => {
        let kills = 0;
        let deaths = 0;
        let wins = 0;
        let losses = 0;
        let headshots = 0;
        let drops = 0;
        const currentTime = Date.now();

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
                        matchData.players.forEach(player => {
                            if (userId === player.id && numberOfGames < 5) {
                                kills += player.kills;
                                deaths += player.deaths;
                                headshots += player.headshots;
                                drops += player.dropped;
                                numberOfGames += 1
                                if (player.elo_change > 0) {
                                    wins += 1;
                                } else {
                                    losses += 1;
                                }
                            }
                        });
                    }
                }
                let kd = "-";
                let winratio = "-";
                if (numberOfGames === 5) {
                    kd = `${(Math.round((kills / deaths) * 100) / 100).toFixed(2)}`;
                    winratio = `${Math.floor((wins / numberOfGames) * 100)}%`;
                    hsratio = `${Math.floor((headshots / kills) * 100)}%`;
                    dropratio = `${(Math.round((drops / numberOfGames) * 100) / 100).toFixed(1)}%`;
                }
                return [kd, winratio, hsratio, dropratio];
            }
        } catch (error) {
            console.error(error);
        }

        return [];
    }

    getUser(username).then(user => {
        getStats(user.id).then(stats => {
            playerStats(stats);
        });
    });
}
