function fetchMatchIfActive(url, date, username, trigger){
    if(url.includes("match")){
        let matchId = url.substring(url.lastIndexOf('/') + 1);
        let playerCheck = false;
        fetch(`https://esportal.com/api/match/get?_=${date}&id=${matchId}`)
          .then(response => response.json())
          .then(data => {
            for (matchPlayers of Object.entries(data.players)){
              if (matchPlayers[1].username === username) {
                playerCheck = true;
              }
            }
            if (data.active === false && playerCheck === true){
              clearInterval(trigger);
              autoCommend(false);
            }
          })
    } else {
      clearInterval(trigger);
    }
}

const autoCommend = async (trigger) => {
    if (userStorage.autoCommend === "true") {
      const url = window.location.href;
      const date = Date.now();
      let clientUsername = document.querySelector(".top-bar-user").innerText;
      if(trigger === true){
        let intervalTrigger = setInterval(function(){
          fetchMatchIfActive(url, date, clientUsername, intervalTrigger);
        }, 1000);

      } else {
        let matchGroupId = {};
        let clientGroupId;
        if (url.includes("match")) {
          let matchId = url.substring(url.lastIndexOf('/') + 1);
          let resp = await fetch(`https://esportal.com/api/match/get?_=${date}&id=${matchId}`);
          let result = await resp.json();

            if (result?.players && result.active != true) {
              for([index, value] of Object.entries(result.players)) {
                groupId = value["matchmaking_group_id"]
                if (matchGroupId[groupId]) {
                  matchGroupId[groupId].push(value.username);
                } else {
                  matchGroupId[groupId] = [value.username];
                }
                if (clientUsername === value.username) {
                  clientGroupId = value.matchmaking_group_id;
                }
              }

              if(clientGroupId){
                for (let i = 0; i < matchGroupId[clientGroupId].length; i++) {
                  (function(ind) {
                    setTimeout(function(){
                      let childNode = getElementsByText(matchGroupId[clientGroupId][i], 'span');
                      for(x = 0; x < childNode.length; x++){
                        if (childNode[x].className == "" && childNode[x].innerText != clientUsername){
                          let commendButton = childNode[x].parentElement.parentElement.parentElement.querySelector(".match-summary-ratings").children[0].children[0];
                          if (commendButton.tagName != "I"){
                            commendButton.click();
                          }
                        }
                      }
                    }, 300 + (100 * ind)); // Keep atleast 100ms for each buttonclick else it wont register??
                  })(i);
                }
              }
            }
          }
        }
    }
}
