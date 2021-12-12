const TIMEOUT = 100; // ms

function pageLoaded(callback){
  let trigger = setInterval(function(){
      let loadIndex = 0;
      if (!document.querySelector(".page-title")){
        loadIndex = 1;
      }
      if (document.querySelector(".page-title") || loadIndex == 1){
        loadIndex = 2;
      }
      if (document.getElementById("app").classList.contains("done") == true) {
        loadIndex = 3;
      }
      if (document.getElementById("content-wrapper").classList.contains("inner-wrapper") && loadIndex === 3) {
        clearInterval(trigger);
        callback(true);
      }
  }, TIMEOUT)
}

function prolongedPageLoad(ele, type, callback){
  pageLoaded(function(status){
    if(status == true){
      let trigger = setInterval(function(){
        if(type == "tbody-populated-tr"){
          // tbody-populated-tr
          // Check if tbody inside element has trs
          // If trs has loaded, run function
          // element = document.querySelector(ele).children[1].querySelectorAll("tr")
          if (document.querySelector(ele)){
            element = document.querySelector(ele).querySelector("tbody").getElementsByTagName("tr")
            if(element.length > 0){
              clearInterval(trigger);
              callback(true);
            }
          }
        } // Continue here
      }, TIMEOUT)
    }
  })
}

function processProfile() {
  pageLoaded(function(status){
    hideMain();
    getKdButton();
    getFaceitRank();
    getStats();
  })
  // Run when match-table has loaded
  prolongedPageLoad(".user-stats-latest-matches", "tbody-populated-tr", function(status){
    getHistory(true);
  })
}

function matchHistoryPageListener() {
    const prevButton = document.querySelector(".previous-next-buttons div:nth-child(1)");
    const nextButton = document.querySelector(".previous-next-buttons div:nth-child(2)");

    prevButton.addEventListener("click", function() {
        if (!prevButton.className.includes("disabled")) {
            pageLoaded(function(status){
              if(status == true){
                getHistory(false)
              }
            })
        }
    });

    nextButton.addEventListener("click", function() {
        if (!nextButton.className.includes("disabled")) {
            pageLoaded(function(status){
              if(status == true){
                getHistory(false)
              }
            })
        }
    });
}

pageLoaded(function(status){
  if(status == true){
    let url = window.location.href
    if (url.includes("gather") || url.includes("match")){
        processLobby();
    } else if (url.includes("profile")){
        processProfile();
        matchHistoryPageListener();
    }
  }
})


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // Listen for messages sent from background.js
        if (request.message === 'matchPage') {
            pageLoaded(function(status){
              if(status == true){
                if (request.url.includes("gather") || request.url.includes("match")) {
                    processLobby();
                } else if (request.url.includes("profile")){
                    processProfile();
                    matchHistoryPageListener();
                }
              }
            })
        }
    }
);
