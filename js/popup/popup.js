const setHolder = document.querySelector(".set-holder");
const feaHolder = document.querySelector(".fea-holder");
const hidHolder = document.querySelector(".hid-holder");
let buttons, settings;

async function popupMain() {
    await loadStorage();
    setupButtons();
    bindEventButtons();
}

function bindEventButtons(){
    // Bind all buttons to an eventlistener
    let buttons = document.querySelectorAll("button");
    buttons.forEach(function(b) {
        b.addEventListener("click", toggleSetting);
    });
}

function toggleSetting() {
    // Set new boolean and classname of the button
    state = this.classList[0] == "true";
    action = this.value;
    settings[action] = state;
    chrome.storage.sync.set({settings});
    this.className = state;
}

async function loadStorage() {
    // Load and set storage
    let status = false
    await new Promise(resolve => {
        chrome.storage.sync.get(null, async res => {
            buttons = res.buttons;
            settings = res.settings;
            status = true;
            resolve();
        });
    });
    return status;
}

function setupButtons() {
    // Setup UI and eventlisteners
    buttons.forEach(function(button) {
        element = `<button class="${settings[button.setting]}" value="${button.setting}">${button.text}</button>`;
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
