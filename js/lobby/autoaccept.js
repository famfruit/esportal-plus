const autoAccept = () => {
    // Interval, look for DIV - if exist, start a new interval to look for it being open
    if (userStorage.autoAccept != "false") {
        let trigger = setInterval(() => {
            let queueElement = document.querySelector(".queue-header-time");
            let acceptButton = document.querySelector(".match-ready-btn");
            if (queueElement && acceptButton) {
                // Press button and continue interval?
                acceptButton.click();
            }
        }, 2000); // 2 seconds
    }
}
