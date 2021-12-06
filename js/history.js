async function processHistory(firstTime) {
    const username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

    async function getMatch(matchId) {
        const url = `https://api.esportal.com/match/get?_=1&id=${matchId}`;
        try {
            const result = await this.fetch(url);
            const match = await result.json();

            if (match != null && match.players != null) {
                for (let p = 0; p < match.players.length; p++) {
                    if (match.players[p].username === username) {
                        return [match.players[p].kills, match.players[p].deaths];
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }

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
        getMatch(matchId).then(data => {
            if (data != null) {
                const kd = `${(Math.round((data[0] / data[1]) * 100) / 100).toFixed(2)}`;

                let td = document.createElement("td");
                let span = document.createElement("span");
                let value = document.createTextNode(`${data[0]} - ${data[1]} (${kd})`);
                span.appendChild(value);
                td.appendChild(span);

                matchLinks[i].parentElement.parentElement.appendChild(td);
            }
        });
    }
}