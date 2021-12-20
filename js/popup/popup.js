function toggleSetting() {
    this.value = this.value === "true" ? "false" : "true";
    this.className = this.className == "setting true" ? "setting false" : "setting true";

    let settings = {};
    let settingButtons = document.getElementsByClassName('setting');
    for (let i = 0; i < settingButtons.length; i++) {
        settings[settingButtons[i].id] = settingButtons[i].value;
    }
    console.log(settings);
    chrome.storage.sync.set({'settings' : settings}, function() {
        console.log('Settings was saved');
    });
}

function bindSettingButtons() {
    let settingButtons = document.getElementsByClassName('setting');
    for (let i = 0; i < settingButtons.length; i++) {
        settingButtons[i].addEventListener('click', toggleSetting);
        settingButtons[i].value = "true";
        settingButtons[i].className = 'setting true';
    }
}

function restoreSettings() {
    bindSettingButtons();

    chrome.storage.sync.get(['settings'], function(result) {
        const data = result['settings'];
        if (data) {
            for (let key of Object.keys(data)) {
                let button = document.getElementById(key);
                button.value = (data[key] === '') ? "true" : data[key];
                button.className = data[key] === "true" ? 'setting true' : 'setting false';
            }
        }
    });

    document.getElementById("app-version").innerText = `v${chrome.app.getDetails().version}`;
}

document.addEventListener('DOMContentLoaded', restoreSettings);