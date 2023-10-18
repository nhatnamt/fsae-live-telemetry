const playPauseButton = document.getElementById('play-pause');
playPauseButton.addEventListener('click', togglePlayPause);
var playStatus = false;

function togglePlayPause() {
    if (playStatus == true) {
        playStatus = false;
        playPauseButton.classList.remove('play');
        playPauseButton.classList.add('pause');
    } else {
        playStatus = true;
        playPauseButton.classList.remove('pause');
        playPauseButton.classList.add('play');
    }
}