function hideLivestreams() {
    /*
    Needs more work,
    If element appears abit late, this logic wont catch it
    */
    setTimeout(function () {
        if (userStorage.settings.hideLivestreams) {
            streamFrame = document.querySelectorAll(".live-streams");
            streamFrame.forEach(function(frame) {
                frame.remove();
            });
        }
    }, 1000);
}
