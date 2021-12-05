/* Routing */
window.addEventListener('load', function () {
    let url = window.location.href
    if (url.includes("gather") || url.includes("match")){
      processLobby();
    } else if (url.includes("profile")){
      calculateKd();
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
                }, 1000)
            }
        }
    }
);
