// Constants
const TIMEOUT = 50; // ms

const pageLoaded = (callback) => {
    let trigger = setInterval(() => {
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
            loadIndex = 4;
        }
        if (userStorage !== undefined && loadIndex === 4) {
            clearInterval(trigger);
            callback(true);
        }
    }, TIMEOUT);
}

const prolongedPageLoad = (elem, type, callback) => {
    pageLoaded((status) => {
        if (status) {
            let trigger = setInterval(() => {
                if (type == "tbody-populated-tr") {
                    // tbody-populated-tr
                    // Check if tbody inside element has trs
                    // If trs has loaded, run method
                    // element = document.querySelector(ele).children[1].querySelectorAll("tr")
                    if (document.querySelector(elem)) {
                        let element = document.querySelector(elem).querySelector("tbody").getElementsByTagName("tr");
                        if (element && element.length > 0) {
                            clearInterval(trigger);
                            callback(true);
                        }
                    }
                } // Continue here
            }, TIMEOUT);
        }
    });
}

const processProfile = () => {
    pageLoaded((status) => {
        hideMain();
        getKdButton();
        getStats();
    });

    // Run when match-table has loaded
    prolongedPageLoad(".user-stats-latest-matches", "tbody-populated-tr", (status) => {
        setTimeout(() => {
            getHistory(true);
        }, 200);
    });
}

const matchHistoryPageListener = () => {
    const prevButton = document.querySelector(".previous-next-buttons div:nth-child(1)");
    const nextButton = document.querySelector(".previous-next-buttons div:nth-child(2)");

    prevButton.addEventListener("click", () => {
        if (!prevButton.className.includes("disabled")) {
            pageLoaded((status) => {
                if (status) {
                    setTimeout(() => {
                        getHistory(false);
                    }, 200);
                }
            });
        }
    });

    nextButton.addEventListener("click", () => {
        if (!nextButton.className.includes("disabled")) {
            pageLoaded((status) => {
                if (status) {
                    setTimeout(() => {
                        getHistory(false);
                    }, 200);
                }
            });
        }
    });
}

pageLoaded((status) => {
    if (status) {
        let url = window.location.href;
        if (url.includes("gather") || (url.includes("match") && !url.includes("matchmaking"))) {
            processLobby();
            autoCommend(true);
        } else if (url.includes("profile")) {
            processProfile();
            matchHistoryPageListener();
        }

        // Run Globally
        pageLoaded((status) => {
            toggleSuggestedFriends();
            clearAds();
            hideLivestreams();
            autoAccept();
        });
    }
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            pageLoaded((status) => {
                if (status) {
                    if (request.url.includes("gather") || (request.url.includes("match") && !request.url.includes("matchmaking"))) {
                        processLobby();
                        autoCommend(true);
                    } else if (request.url.includes("profile")) {
                        processProfile();
                        matchHistoryPageListener();
                    }

                    // Run Globally
                    toggleSuggestedFriends();
                    clearAds();
                    hideLivestreams();
                    autoAccept();
                }
            });
        } else if (request.message === 'profilePage') {
            if (request?.data?.payload?.players?.results) {
                setFaceitLevel(request.data.payload.players.results);
            }
        }
    }
);
