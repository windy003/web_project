document.getElementById('songFile').addEventListener('change', function(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        let audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = e.target.result;
        audioPlayer.load();
    };

    reader.readAsDataURL(file);
});

function togglePlayPause() {
    let audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.paused || audioPlayer.ended) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

function insertTimestamp() {
    let audioPlayer = document.getElementById('audioPlayer');
    let currentTime = convertTime(audioPlayer.currentTime);
    let lyricsInput = document.getElementById('lyricsInput');

    let cursorPos = lyricsInput.selectionStart;
    let front = (lyricsInput.value).substring(0, cursorPos);
    let back = (lyricsInput.value).substring(cursorPos);

    lyricsInput.value = front + `[${currentTime}]` + back;

    let nextLinePos = lyricsInput.value.indexOf('\n', cursorPos) + 1;
    if (nextLinePos > 0) {
        lyricsInput.selectionStart = nextLinePos;
        lyricsInput.selectionEnd = nextLinePos;
    } else {
        lyricsInput.value += '\n';
        lyricsInput.selectionStart = lyricsInput.value.length;
        lyricsInput.selectionEnd = lyricsInput.selectionStart;
    }

    lyricsInput.focus();
}

function convertTime(time) {
    let minutes = Math.floor(time / 60).toString().padStart(2, '0');
    let seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'F9') {
        togglePlayPause();
    } else if (event.key === 'F10') {
        insertTimestamp();
    }
});

document.getElementById('exportButton').addEventListener('click', function() {
    let lyricsInput = document.getElementById('lyricsInput');
    let lrcContent = lyricsInput.value;

    let blob = new Blob([lrcContent], { type: 'text/plain' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lyrics.lrc';
    a.click();
});
