function setFaceitLevel(data) {
    const levelColors = { 1: "#ededed", 2: "#1ce200", 3: "#1ce200", 4: "#fec700", 5: "#fec700",
                            6: "#fec700", 7: "#fec700", 8: "#ff6309", 9: "#ff6309", 10: "#f91e00"
    };

    if (data) {
        let games = "";
        if (data.length != 0 && data[0].games.length != 0) {
            games = data[0].games[0];
        }
        if (games.name == "csgo") {
            const level = games.skill_level;
            const nickname = data[0].nickname;
            // For now wait 1 second for content to load
            setTimeout(function () {
                let wrapper = document.querySelector(".user-profile-rank-rating").querySelectorAll(".section")[0];
                let span = document.createElement("a");
                span.id = "esportal-plus-faceit-level";
                span.innerHTML = level;
                span.href = `https://faceit.com/en/players/${nickname}`;
                span.target = "_BLANK";
                span.style.cssText = `color: ${levelColors[level]}; margin-left:10px; border-radius:50%; padding:3px 8px; border:2px solid ${levelColors[level]}`;
                wrapper.appendChild(span);
                enableFaceitLevel(userStorage.faceitLevels === "true");
            }, 1000);
        }
    }
}

function enableFaceitLevel(enable) {
    let faceitLevel = document.getElementById("esportal-plus-faceit-level");
    if (faceitLevel) {
        if (enable) {
            faceitLevel.style.display = "block";
        } else {
            faceitLevel.style.display = "none";
        }
    }
}
