function toggleSetting() {
    this.value = this.value === "true" ? "false" : "true";
    this.className = this.className == "setting true" ? "setting false" : "setting true";

    let settings = {};
    let settingButtons = document.getElementsByClassName('setting');
    if (settingButtons) {
        for (let i = 0; i < settingButtons.length; i++) {
            settings[settingButtons[i].id] = settingButtons[i].value;
        }

        chrome.storage.sync.set({'settings' : settings}, () => {
            console.log('Settings was saved');
        });
    }
}

const bindSettingButtons = () => {
    let settingButtons = document.getElementsByClassName('setting');
    if (settingButtons) {
        for (let i = 0; i < settingButtons.length; i++) {
            settingButtons[i].addEventListener('click', toggleSetting);
            settingButtons[i].value = "true";
            settingButtons[i].className = 'setting true';
        }
    }
}

const restoreSettings = () => {
    bindSettingButtons();

    chrome.storage.sync.get(['settings'], result => {
        const data = result['settings'];
        if (data) {
            for (let key of Object.keys(data)) {
                let button = document.getElementById(key);
                if (button) {
                    button.value = (data[key] === "") ? "true" : data[key];
                    button.className = data[key] === "true" ? "setting true" : "setting false";
                }
            }
        }
    });

    document.getElementById("app-version").innerText = `v${chrome.app.getDetails().version}`;
}

document.addEventListener('DOMContentLoaded', restoreSettings);