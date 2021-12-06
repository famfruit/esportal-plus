const TIMEOUT = 1000; // ms

function processProfile() {
    getKdButton();
    getFaceitRank();
    getStats();
    getHistory(true);
}

function matchHistoryPageListener() {
    const prevButton = document.querySelector(".previous-next-buttons div:nth-child(1)");
    const nextButton = document.querySelector(".previous-next-buttons div:nth-child(2)");

    prevButton.addEventListener("click", function() {
        if (!prevButton.className.includes("disabled")) {
            setTimeout(processHistory(false), TIMEOUT);
        }
    });

    nextButton.addEventListener("click", function() {
        if (!nextButton.className.includes("disabled")) {
            setTimeout(processHistory(false), TIMEOUT);
        }
    });
}

window.addEventListener('load', function () {
    let url = window.location.href
    if (url.includes("gather") || url.includes("match")){
        setTimeout(processLobby(), TIMEOUT);
    } else if (url.includes("profile")){
        setTimeout(function() {
            processProfile();
            matchHistoryPageListener();
        }, TIMEOUT);
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            if (request.url.includes("gather") || request.url.includes("match")) {
                setTimeout(processLobby(), TIMEOUT);
            } else if (request.url.includes("profile")){
                setTimeout(function() {
                    processProfile();
                    matchHistoryPageListener();
                }, TIMEOUT);
            }
        }
    }
);
