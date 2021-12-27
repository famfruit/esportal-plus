function isMatchActive(data, trigger){
  if (data.active === false){
    clearInterval(trigger)
    autoCommend(true);
    console.log("Match is done, cancel interval")
  } else {
    autoCommend(false);
    console.log("Continue")
  }
}
function fetchMatchIfActive(trigger){
    const url = window.location.href;
    const date = Date.now();
    let matchId = url.substring(url.lastIndexOf('/') + 1);
    fetch(`https://esportal.com/api/match/get?_=${date}&id=${matchId}`)
        .then(response => response.json())
        .then(data => isMatchActive(data, trigger));

}
const autoCommend = async (trigger) => {
    if(trigger === true){
      let intervalTrigger = setInterval(function(){
        fetchMatchIfActive(intervalTrigger);
      }, 20000)
    }
    /*
    Attempt to autocommend teammates
    - If setting is enabled
    - Check if match has ended
    - Collect teammates
    - If commend button != pressed, attempt to .click() it
    */
    // Continue trying
      const url = window.location.href;
      const date = Date.now();
      if (userStorage.autoCommend != "false") {
          let clientUsername = document.querySelector(".top-bar-user").innerText;
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
                  /*
                    Continue with next section
                    - Keep atleast 100ms for each buttonclick else it wont register??
                  */
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
                           }, 1000 + (100 * ind));
                       })(i);
                    }
                  }
              } else {
                console.log("Match is still live")
              }
          }
      }

}
