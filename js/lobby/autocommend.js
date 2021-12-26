const autoCommend = async () => {
    /*
    Attempt to autocommend teammates
    - If setting is enabled
    - Check if match has ended
    - Collect teammates
    - If commend button != pressed, attempt to .click() it
    */
    const url = window.location.href;
    const date = Date.now();
    if (userStorage.autoCommend == "true") {
        let matchGroupId = {};
        if (url.includes("match")) {
            let matchId = url.substring(url.lastIndexOf('/') + 1);
            let resp = await fetch(`https://esportal.com/api/match/get?_=${date}&id=${matchId}`);
            let result = await resp.json();
            if (result?.players) {
                for([index, value] of Object.entries(result.players)) {
                    let groupId = matchGroupId[value["matchmaking_group_id"]];
                    if (groupId) {
                        groupId.push(value.username);
                    } else {
                        groupId = [];
                    }
                }
                console.log(matchGroupId);
            }
        }
    }
}
