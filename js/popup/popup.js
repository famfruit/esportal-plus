const setHolder = document.querySelector(".set-holder");
const feaHolder = document.querySelector(".fea-holder");
const hidHolder = document.querySelector(".hid-holder");
let settings;

async function popupMain() {
    settings = await loadStorage("settings");
    setupButtons();
    bindEventButtons();
}

function bindEventButtons() {
    // Bind all buttons to an eventlistener
    let buttons = document.querySelectorAll("button");
    buttons.forEach(function(b) {
        b.addEventListener("click", toggleSetting);
    });
}

function toggleSetting() {
    // Set new boolean and classname of the button
    state = this.classList[0] == "true" ? "false" : "true";
    action = this.value;
    settings.settings[action] = state;
    chrome.storage.sync.set({"settings": settings});
    this.className = state;
}

const loadStorage = async (key) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

function setupButtons() {
    // Setup UI and eventlisteners
    settings.buttons.forEach(function(button) {
        element = `<button class="${settings.settings[button.setting]}" value="${button.setting}">${button.text}</button>`;
        if (button.type == "setting") {
            setHolder.innerHTML += element;
        } else if (button.type == "feature") {
            feaHolder.innerHTML += element;
        } else {
            hidHolder.innerHTML += element;
        }
    });
}

// Run Main
popupMain();

// Set manifest version to popup
document.getElementById("appv").innerText = `v${chrome.app.getDetails().version}`;
