const setFaceitLevel = (data) => {
    const levelColors =
    { 1: "#ededed", 2: "#1ce200", 3: "#1ce200", 4: "#fec700", 5: "#fec700",
      6: "#fec700", 7: "#fec700", 8: "#ff6309", 9: "#ff6309", 10: "#f91e00"
    };

    if (data) {
        if (data.length != 0 && data[0].games.length != 0) {
            if (data[0].games[0].name == "csgo") {
                const level = data[0].games[0].skill_level;
                const nickname = data[0].nickname;

                // Wait 500 ms before performing the action, should not be needed
                setTimeout(() => {
                    let rating = document.querySelector(".user-profile-rank-rating");
                    if (rating) {
                        let section = rating.querySelectorAll(".section");
                        if (section && section.length > 0) {
                            let wrapper = section[0];
                            let span = document.createElement("a");
                            span.id = "esportal-plus-faceit-level";
                            span.innerHTML = level;
                            span.href = `https://faceit.com/en/players/${nickname}`;
                            span.target = "_BLANK";
                            span.style.cssText = `color: ${levelColors[level]}; margin-left:10px; border-radius:50%; padding:3px 8px; border:2px solid ${levelColors[level]}`;
                            wrapper.appendChild(span);
                            enableFaceitLevel();
                        }
                    }
                }, 1000);
            }
        }
    }
}

// TODO: Handle faceit level on match page
const enableFaceitLevel = () => {
    let faceitLevel = document.getElementById("esportal-plus-faceit-level");
    if (faceitLevel) {
        if (userStorage.faceitLevels === "true") {
            faceitLevel.style.display = "block";
        } else {
            faceitLevel.style.display = "none";
        }
    }
}
