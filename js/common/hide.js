const settingsActions = {
  hideMedalsProfile:     [".column", "multiple", 7, null],
  hideMissionsProfile:   [".user-profile-level-container", "single", null, "previous"],
  hideActivityProfile:   [".user-profile-activity-list", "single", null, "previous"]
}
/*
function loadStorage(){
  chrome.storage.sync.get(null, function(data) {
      processSettings(data)
  })
}*/
function processSettings(settings){
  settings.buttons.forEach(function(set){
    if (set.type == "hide"){
      handle = settings.settings[set.setting]
      if(handle == true){
        action = set.setting
        query = (settingsActions[action][1] == "single") ? document.querySelector(settingsActions[action][0]) : document.querySelectorAll(settingsActions[action][0])[settingsActions[action][2]];
        querySibling = (settingsActions[action][3] == "previous") ? query.previousElementSibling : ""
        query.remove()
        if(settingsActions[action][3] == "previous"){
          querySibling.remove()
        }
      }
    }
  })
}
function hideMain(){
  processSettings(userStorage)
}
