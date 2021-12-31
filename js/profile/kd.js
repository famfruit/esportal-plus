const getKdButton = async () => {
    if (userStorage.profileKDButton === "true") {
        const username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let bundleMatches = [];
        let scores = { "k": 0, "d": 0};

        const getMatches = async (userId) => {
            const date = new Date().getTime();
            let matchIndex = 1;
            for (let i = 0; i < 7; i++) {
                let resp = await fetch(`https://api.esportal.com/user_profile/get_latest_matches?_=${date}&id=${userId}&page=${matchIndex}&v=2`);
                let result = await resp.json();
                if (result) {
                    for (let x = 0; x < result.length - 1; x++) {
                        bundleMatches.push(result[x]);
                    }
                    matchIndex++;
                }
            }
        }

        const getIndividualMatches = async (array) => {
            array.splice(0, 7);
            scores["username"] = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            let scoresIndex = 0;
            for (let i = 0; i < array.length; i++) {
                let matchID = array[i].id;
                getMatch(matchID).then(match => {
                    if (match?.players) {
                        let players = match.players;
                        for (let x = 0; x < players.length; x++) {
                            if (players[x].username === username) {
                                scores["k"] += players[x].kills;
                                scores["d"] += players[x].deaths;
                                scoresIndex++;
                            }
                        }
                    }
                }).then(() => {
                  if (scoresIndex >= array.length) {
                    let avg = scores["k"] / scores["d"];
                    let strAvg = avg.toString().slice(0, 4)

                    let wrap = document.querySelector("#esportal-plus-kd-button");
                    let boxValue = document.querySelector(".user-profile-stats-box-value");
                    let currentKd = parseFloat(boxValue.querySelector(".Tipsy-inlineblock-wrapper").innerHTML);
                    let avgDiff = avg - currentKd;

                    if (avgDiff < 0) {
                        diffValue = avgDiff.toFixed(2);
                    } else {
                        diffValue = `+${avgDiff.toFixed(2)}`;
                    }

                    let content = `
                    <div class="label" style="float:left;margin-right:10px;color:#00a9e9">PREL KD</div>
                    <span class="user-profile-rating" style="position:relative">${strAvg}
                    <small style="position: absolute;top:1px;right:-110%;font-size: 0.7em">${diffValue}</small>
                    </span>
                    `
                    let prel_wrap = document.createElement("div");
                    prel_wrap.classList.add("section", "is-right", "prel-kd");
                    prel_wrap.innerHTML = content.trim();
                    prel_wrap.style.cssText = "padding-top:4px;padding-left:1px;"
                    wrap.appendChild(prel_wrap);

                    // Completed - Remove button
                    let button_holder = document.querySelector(".prel-button");
                    if (button_holder) {
                        button_holder.remove();
                    }



                  }
                });
            }
        }
        // Button - DOM
        const button = "<button id='-prelkd' class='user-profile-view-all-button button button-new-style premium-color big thin prel-button' style='padding: 0 15px'><i class='fas fa-crosshairs xhair' style='margin-right: 10px'></i> Räkna ut K/D</button>";
        const button_cont = `<div class="label"></div><span class="user-profile-rating" style="color: #ff8020;">${button}</span>`;
        let button_wrap = document.createElement("div");
        button_wrap.id = "esportal-plus-kd-button";
        button_wrap.classList.add("section", "is-right", "prel-kd");
        button_wrap.innerHTML = button_cont;
        button_wrap.style.cssText = "width:100%;min-height:27px!important;margin-top:10px;"

        let button_holder = document.querySelector(".user-profile-view-all-buttons");
        if (button_holder) {
            button_holder.appendChild(button_wrap);
        }

        // Handle Event
        let isPressed = false;
        let kdButton = document.getElementById("-prelkd");

        if (kdButton) {
            kdButton.addEventListener("click", () => {
                if (!isPressed) {
                    // Add animations
                    let button = document.querySelector(".prel-button");
                    button.innerHTML = "<i class='fas fa-circle-notch fa-spin' style='margin-right: 10px'></i> Räknar ut K/D";
                    getUser(username).then(user => {
                        if (user) {
                            getMatches(user.id).then(() => {
                                getIndividualMatches(bundleMatches)
                            });
                        }
                    });
                }
                isPressed = true;
            });
        }
    }
}

const clearKdButton = () => {
    let kdButton = document.getElementById("esportal-plus-kd-button");
    if (kdButton) {
        kdButton.remove();
    }
}
