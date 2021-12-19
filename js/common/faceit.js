function setFaceitLevel(data) {
    const levelCols = {
        1: "#ededed",
        2: "#1ce200",
        3: "#1ce200",
        4: "#fec700",
        5: "#fec700",
        6: "#fec700",
        7: "#fec700",
        8: "#ff6309",
        9: "#ff6309",
        10: "#f91e00"
    }

    if (data) {
        if (data.payload.players.results.length != 0 && data.payload.players.results[0].games.length != 0) {
            games = data.payload.players.results[0].games[0];
        } else {
            games = "";
        }
        if (!games || games == "") {
            return ["", ""];
        } else if (games.name == "csgo") {
            level = games.skill_level
            nick = data.payload.players.results[0].nickname;
            setTimeout(function () {
                wrapper = document.querySelector(".user-profile-rank-rating").querySelectorAll(".section")[0];
                span = document.createElement("a");
                span.innerHTML = level;
                span.href = `https://faceit.com/en/players/${nick}`;
                span.target = "_BLANK";
                span.style.cssText = `color: ${levelCols[level]};margin-left:10px;border-radius:50%;padding:3px 8px;border:2px solid ${levelCols[level]}`;
                wrapper.appendChild(span);
            }, 1000);
        }
    }
}
