const setFaceitLevel = (data) => {
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
                            let levelImage = `https://raw.githubusercontent.com/Simpe93/esportal-plus/master/img/faceit/faceit${level}.svg`;
                            let wrapper = section[0];
                            let span = document.createElement("a");
                            let image = document.createElement("img")
                            image.src = levelImage;
                            image.style.cssText = "height:40px;width:40px;margin-left:10px";
                            span.id = "esportal-plus-faceit-level-profile";
                            span.href = `https://faceit.com/en/players/${nickname}`;
                            span.target = "_BLANK";
                            span.appendChild(image);
                            wrapper.appendChild(span);
                            enableFaceitLevel();
                        }
                    }
                }, 500);
            }
        }
    }
}

const enableFaceitLevel = () => {
    let faceitLevel = document.getElementById("esportal-plus-faceit-level-profile");
    if (faceitLevel) {
        if (userStorage.faceitLevels === "true") {
            faceitLevel.style.display = "block";
        } else {
            faceitLevel.style.display = "none";
        }
    }

    let faceitLevels = document.getElementsByClassName("esportal-plus-faceit-level");
    if (faceitLevels) {
        for (let i = 0; i < faceitLevels.length; i++) {
            if (userStorage.faceitLevels === "true") {
                faceitLevels[i].style.display = "block";
            } else {
                faceitLevels[i].style.display = "none";
            }
        }
    }
}
