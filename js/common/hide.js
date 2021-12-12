const settingsActions = {
  hideMedalsProfile:     [".column", "multiple", 7],
  hideMissionsProfile:   [".user-profile-level-container", "single"],
  hideActivityProfile:   [".user-profile-activity-list", "single"]
}
function loadStorage(){
  chrome.storage.sync.get(null, function(data) {
      processSettings(data)
  })
}
function processSettings(settings){
  settings.buttons.forEach(function(set){
    if (set.type == "setting"){
      handle = settings.settings[set.setting]
      if(handle == true){
        action = set.setting
        query = (settingsActions[action][1] == "single") ? document.querySelector(settingsActions[action][0]) : document.querySelectorAll(settingsActions[action][0])[settingsActions[action][2]];
        query.remove()
      }
    }
  })
}
function hideMain(){
  loadStorage();
}
