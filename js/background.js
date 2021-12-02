chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        // Read changeInfo data and send urls to content.js
        if (changeInfo.url) {
            chrome.tabs.sendMessage( tabId, {
                message: 'matchPage',
                url: changeInfo.url
            });
        }
    }
);