const hideLivestreams = () => {
    let displayProperty = "block";
    if (userStorage.hideLiveStreams === "true") {
        displayProperty = "none";
    }

    // Wait 500 ms before performing the action, should not be needed
    setTimeout(() => {
        let liveStreams = document.querySelectorAll(".live-streams");
        if (liveStreams) {
            liveStreams.forEach(liveStream => {
                liveStream.style.display = displayProperty;
            });
        }
    }, 500);
}
