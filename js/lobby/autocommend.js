async function autoCommend() {
  /*
      Attempt to autocommend teammates
      - If setting is enabled
      - Check if match has ended
      - Collect teammates
      - If commend button != pressed, attempt to .click() it
  */
  const windowUrl = window.location.href;
  const date = Date.now();
  if (userStorage.autoCommend == "true") {
    let matchGroupId = {};
    if (windowUrl.includes("match")) {
      let matchId = windowUrl.substring(windowUrl.lastIndexOf('/') + 1);
      let url = `https://esportal.com/api/match/get?_=${date}&id=${matchId}`;
      let resp = await fetch(url);
      let result = await resp.json();
      for([index, value] of Object.entries(result.players)) {
        let groupId = matchGroupId[value["matchmaking_group_id"]];
        if (!groupId) {
          groupId = [];
        } else {
          groupId.push(value.username);
        }
      }
      console.log(matchGroupId);
    }
  }
}
