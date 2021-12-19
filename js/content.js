// Constants
const TIMEOUT = 100; // ms

// Globals
let userStorage;

function loadStorage() {
    chrome.storage.sync.get(null, function(data) {
        userStorage = data
    });
}

loadStorage();

function pageLoaded(callback) {
    let trigger = setInterval(function() {
        let loadIndex = 0;
        let pageTitle = document.querySelector(".page-title");
        let app = document.getElementById("app");
        let contentWrapper = document.getElementById("content-wrapper");
        if (pageTitle) {
            loadIndex = 1;
        }
        if (pageTitle || loadIndex == 1) {
            loadIndex = 2;
        }
        if (app && app.classList.contains("done")) {
            loadIndex = 3;
        }
        if (contentWrapper && contentWrapper.classList.contains("inner-wrapper") && loadIndex === 3) {
            clearInterval(trigger);
            callback(true);
        }
    }, TIMEOUT);
}

function prolongedPageLoad(elem, type, callback) {
    pageLoaded(function(status) {
        if (status == true) {
            let trigger = setInterval(function() {
                if (type == "tbody-populated-tr") {
                    // tbody-populated-tr
                    // Check if tbody inside element has trs
                    // If trs has loaded, run function
                    // element = document.querySelector(ele).children[1].querySelectorAll("tr")
                    if (document.querySelector(elem)) {
                        element = document.querySelector(elem).querySelector("tbody").getElementsByTagName("tr");
                        if (element.length > 0) {
                            clearInterval(trigger);
                            callback(true);
                        }
                    }
                } // Continue here
            }, TIMEOUT);
        }
    });
}

function processProfile() {
    pageLoaded(function(status) {
        // hideMain();
        getKdButton();
        // getFaceitRank();
        getStats();
    });
    // Run when match-table has loaded
    prolongedPageLoad(".user-stats-latest-matches", "tbody-populated-tr", function(status) {
        getHistory(true);
    });
}

function matchHistoryPageListener() {
    const prevButton = document.querySelector(".previous-next-buttons div:nth-child(1)");
    const nextButton = document.querySelector(".previous-next-buttons div:nth-child(2)");

    prevButton.addEventListener("click", function() {
        if (!prevButton.className.includes("disabled")) {
            pageLoaded(function(status) {
                if (status) {
                    getHistory(false);
                }
            });
        }
    });

    nextButton.addEventListener("click", function() {
        if (!nextButton.className.includes("disabled")) {
            pageLoaded(function(status) {
                if (status){
                    getHistory(false);
                }
            });
        }
    });
}

pageLoaded(function(status) {
    if (status) {
        let url = window.location.href;
        if (url.includes("gather") || (url.includes("match") && !url.includes("matchmaking"))) {
            processLobby();
        } else if (url.includes("profile")) {
            processProfile();
            matchHistoryPageListener();
        }
        // Run Globally
        pageLoaded(function(status){
            //hideLivestreams();
        });
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            pageLoaded(function(status) {
                if (status) {
                    if (request.url.includes("gather") || request.url.includes("match")) {
                        processLobby();
                    } else if (request.url.includes("profile")) {
                        processProfile();
                        matchHistoryPageListener();
                    }
                    // Run Globally
                    //hideLivestreams();
                }
            });
        } else if (request.message === 'profilePage') {
            const levelCols = {
                1: "#ededed",
                2: "#1ce200",
                3: "#1ce200",
                4: "#fec700",
                5: "#fec700",
                6: "#fec700",
                7: "#fec700",
                8: "#ff6309",
                9: "#ff6309",
                10: "#f91e00"
            }

            if (request.data) {
                if (request.data.payload.players.results.length != 0 && request.data.payload.players.results[0].games.length != 0) {
                    games = request.data.payload.players.results[0].games[0];
                } else {
                    games = "";
                }
                if (!games || games == "") {
                    return ["", ""];
                } else if (games.name == "csgo") {
                    level = games.skill_level
                    nick = request.data.payload.players.results[0].nickname;
                    setTimeout(function () {
                        wrapper = document.querySelector(".user-profile-rank-rating").querySelectorAll(".section")[0];
                        span = document.createElement("a");
                        span.innerHTML = level;
                        span.href = `https://faceit.com/en/players/${nick}`;
                        span.target = "_BLANK";
                        span.style.cssText = `color: ${levelCols[level]};margin-left:10px;border-radius:50%;padding:3px 8px;border:2px solid ${levelCols[level]}`;
                        wrapper.appendChild(span);
                    }, 1000);
                }
            }
        }
    }
);
