
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



/* ugg */
async function calculateKd(){
  const username = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
  let userId          = "",
      bundleMatches   = [],
      scores          = {"k": 0, "d": 0, "user": ""}

  async function getMatches(userId){
    const date = new Date().getTime()
    const url = `https://api.esportal.com/user_profile/get_latest_matches?_=${date}&id=${userId}&page=1&v=2`
    let matchIndex = 1
    for(let i = 0; i < 7; i++){
      resp = await fetch(`https://api.esportal.com/user_profile/get_latest_matches?_=${date}&id=${userId}&page=${matchIndex}&v=2`)
      result = await resp.json()
      for(x = 0; x < result.length - 1; x++){
        bundleMatches.push(result[x])
      }
      matchIndex++
    }
  }
  async function getUserID(username){
    resp = await fetch(`https://api.esportal.com/user_profile/get?username=${username}`)
    result = await resp.json()
    return result.id
  }
  async function getIndividualMatches(array){
    array.splice(0, 5)
    scores["username"] = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
    for(i = 0; i < array.length; i++){
      matchID = array[i].id
      url = `https://api.esportal.com/match/get?_=0&id=${matchID}`
      resp = await fetch(url)
      res = await resp.json()

      players = res.players
      for(x = 0; x < players.length; x++){
        if(players[x].username === username){
          scores["k"] += players[x].kills
          scores["d"] += players[x].deaths
          console.log(i + " username: ", username, " - kills: ", players[x].kills, " - deaths:", players[x].deaths)
        }
      }
    }
  }
  // Button - DOM
  const button      = "<button id='-prelkd' class='user-profile-view-all-button button button-new-style premium-color big thin prel-button' style='padding: 0 20px'><i class='fas fa-crosshairs xhair' style='margin-right: 10px'></i> Räkna ut K/D</button>"
  const button_cont = `<div class="label"></div><span class="user-profile-rating" style="color: #ff8020;">${button}</span>`
  const button_wrap = document.createElement("div")
        button_wrap.classList.add("section", "is-right", "prel-kd")
        button_wrap.innerHTML = button_cont


  button_holder = document.querySelector(".user-profile-rank-rating")
  button_holder.appendChild(button_wrap)
   
  // Handle Event
  let isPressed = false
  document.getElementById("-prelkd").addEventListener("click", function(){
    if(isPressed != true){
      // Add animations

      let button = document.querySelector(".prel-button")
          button.innerHTML = "<i class='fas fa-circle-notch fa-spin' style='margin-right: 10px'></i> Räknar ut K/D"
      getUserID(username).then(id => {
        getMatches(id).then(matches => {
          getIndividualMatches(bundleMatches).then(res => {
            avg = scores["k"] / scores["d"]
            console.log(`avg K/D: ${avg.toFixed(2)}`, `${username}`)

            let wrap      = document.querySelector(".user-profile-rank-rating"),
                textCol   = getComputedStyle(wrap),
                boxValue  = document.querySelector(".user-profile-stats-box-value"),
                currentKd = parseFloat(boxValue.querySelector(".Tipsy-inlineblock-wrapper").innerHTML),
                avgDiff   = avg - currentKd

            if (avgDiff < 0){
              diffValue = avgDiff.toFixed(2)
            } else {
              diffValue = `+${avgDiff.toFixed(2)}`
            }

            let content   = `
                              <div class="label">PREL KD</div>
                                <span class="user-profile-rating" style="position:relative">${avg.toFixed(2)}
                                  <small style="position: absolute;top:1px;right:-110%;font-size: 0.7em">${diffValue}</small>
                                </span>
                            `

            let prel_wrap = document.createElement("div")
                prel_wrap.classList.add("section", "is-right", "prel-kd")
                prel_wrap.innerHTML = content.trim()
            wrap.appendChild(prel_wrap)

            // Completed - Remove button
            let button_holder = document.querySelector(".prel-kd")
                button_holder.remove()
            console.log(`currentKd: ${currentKd} - avgDiff: ${avgDiff.toFixed(2)} - diffValue: ${diffValue}`)
          })
        })
      })
    }
    isPressed = true
  })

}
/* end ugg */

/* Routing */
window.addEventListener('load', function () {
    let url = window.location.href
    if (url.includes("gather") || url.includes("match")){
      processLobby();
    } else if (url.includes("profile")){
      calculateKd();
    }

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            if (request.url.includes("gather") || request.url.includes("match")) {
                setTimeout(function() {
                    processLobby();
                }, 1000);
            } else if (request.url.includes("profile")){
                setTimeout(function() {
                    calculateKd();
                }, 1000)
            }
        }
    }
);
