const autoAccept = () => {
    // Interval, look for DIV - if exist, start a new interval to look for it being open
    if (userStorage.autoAccept == "truee") {
        let trigger = setInterval(() => {
            let queueElement = document.querySelector(".queue-header-time");
            let acceptButton = document.querySelector(".match-ready-btn");
            if (queueElement && acceptButton) {
                // Press button and remove timeout
                acceptButton.click();
                clearInterval(trigger);
            }
        }, 2000); // 2 seconds
    }
}
