const toSteamID = accountid => "76561" + (accountid + 197960265728 + "");
async function getEsportalId(username) {
  resp = await fetch(`https://api.esportal.com/user_profile/get?username=${username}`)
  result = await resp.json()
  return toSteamID(result.id)
}
async function getFaceitLevel(username) {
  steamId = await getEsportalId(username)
  resp = await fetch(`https://api.faceit.com/search/v1?limit=1&query=${steamId}`)
  result = await resp.json()
  games = result.payload.players.results[0].games[0]
  if (!games) {
    return ""
  } else if (games.name == "csgo") {
    return [games.skill_level, result.payload.players.results[0].nickname]
  }
}
