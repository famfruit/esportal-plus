/* Routing */
window.addEventListener('load', function () {
    let url = window.location.href
    if (url.includes("gather") || url.includes("match")){
        processLobby();
    } else if (url.includes("profile")){
        calculateKd();
        profileFaceitLevel();
        processStats();
        processHistory(true);

        const prevButton = document.getElementsByClassName("previous-next-buttons")[0].children[0];
        const nextButton = document.getElementsByClassName("previous-next-buttons")[0].children[1];
    
        prevButton.addEventListener("click", function() {
            if (!prevButton.className.includes("disabled")) {
                setTimeout(function() { processHistory(false); }, 1000);
            }
        });

        nextButton.addEventListener("click", function() {
            if (!nextButton.className.includes("disabled")) {
                setTimeout(function() { processHistory(false); }, 1000);
            }
        });
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            if (request.url.includes("gather") || request.url.includes("match")) {
                setTimeout(function() {
                    processLobby();
                }, 1000);
            } else if (request.url.includes("profile")){
                setTimeout(function() {
                    calculateKd();
                    profileFaceitLevel();
                    processStats();
                    processHistory(true);

                    const prevButton = document.getElementsByClassName("previous-next-buttons")[0].children[0];
                    const nextButton = document.getElementsByClassName("previous-next-buttons")[0].children[1];
    
                    prevButton.addEventListener("click", function() {
                        if (!prevButton.className.includes("disabled")) {
                            setTimeout(function() { processHistory(false); }, 1000);
                        }
                    });
    
                    nextButton.addEventListener("click", function() {
                        if (!nextButton.className.includes("disabled")) {
                            setTimeout(function() { processHistory(false); }, 1000);
                        }
                    });
                }, 1000);
            }
        }
    }
);
