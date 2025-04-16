const playBtn = document.querySelector('#play-btn')
const restartBtn = document.querySelector('#restart-btn')
const timeBar = document.querySelector('#time-bar')
const volumeBar = document.querySelector('#vol-bar')
const isPlaying = document.querySelector('#is-playing')
const muteBtn = document.querySelector('#mute-btn')
const updateBtn = document.querySelector('#update-btn')
const shuffleBtn = document.querySelector('#shuffle-btn')

let playState = 'paused'
let prevSongInd = -1;

var player,
    time_update_interval = 0;



function onYouTubeIframeAPIReady() {
    console.log('loading')
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: '',
        playerVars: {
            color: 'white',
        },
        events: {
            'onReady': initialize,
            'onStateChange': onPlayerStateChange
        }
    });
}

function initialize(){
    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);

}

// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    $('#curr-time').text(formatTime( player.getCurrentTime() ));
    $('#total-time').text(formatTime( player.getDuration() ));
}

// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    timeBar.value = (player.getCurrentTime() / player.getDuration()) * timeBar.max;
    timeBar.style.backgroundSize = timeBar.value + '% 100%'
}

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}

function onPlayerStateChange() {
    if (player.getPlayerState() == YT.PlayerState.PLAYING && player.getPlaylistIndex() != prevSongInd && player.getCurrentTime() < 10) {
        let currSong = playList.find(song => song.id == player.getVideoData().video_id)
        console.log(currSong)
        fetch('/get-lyrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: currSong.title, author: currSong.author })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.querySelector('#lyrics-title').textContent = currSong.title;
            document.querySelector('#lyrics-author').textContent = currSong.author;
            document.querySelector('#title').textContent = currSong.title;
            document.querySelector('#author').textContent = currSong.author;
            document.querySelector('#lyrics').innerHTML = data.lyrics;
            // Update the lyrics div with the returned lyrics
            //document.getElementById('lyrics').innerText = data.lyrics;
            // Update the title and author
            //document.querySelector('h1').innerText = `${title} by ${author}`;
        })
        .catch(error => {
            console.error('Error fetching lyrics:', error);
        });
    }
}

function updateSoundImg() {
    if (volumeBar.value > 50) {
        muteBtn.src = 'static/images/sound-loud.svg'
    }
    else if (volumeBar.value > 0) {
        muteBtn.src = 'static/images/sound-quiet.svg'
    }
    else {
        muteBtn.src = 'static/images/sound-mute.svg'
    }
}

// Play / Pause
playBtn.addEventListener('click', () => {
    // Toggle play/pause logic
    if (playState == 'paused' && player.getPlayerState != undefined) {
        playState = 'playing';
        playBtn.textContent = '▎ ▎';
        playBtn.classList.replace('paused', 'playing');
        isPlaying.textContent = 'Now Playing';

        // Play the song
        player.playVideo();
    } else {
        playState = 'paused';
        playBtn.textContent = ' ▶';
        isPlaying.textContent = 'Paused';

        // Pause the song
        player.pauseVideo();
    }
});

// Control the time
timeBar.addEventListener('input', () => {
    var newTime = player.getDuration() * (timeBar.value / timeBar.max);
    player.seekTo(newTime)
    updateProgressBar()
})
restartBtn.addEventListener('click', () => {
    player.seekTo(0)
})

// Control the sound
muteBtn.addEventListener('click', () => {
    if(player.isMuted()) {
        player.unMute();
    }
    else {
        player.mute();
    }
    
    updateSoundImg()
})
volumeBar.addEventListener('input', () => {
    player.setVolume(volumeBar.value);
    volumeBar.style.backgroundSize = volumeBar.value + '% 100%'

    updateSoundImg()
})

// Update the playlist
updateBtn.addEventListener('click', () => {
    let ids = playList.map(song => song.id)
    player.cuePlaylist(ids, 0);
})

// Previous and next song
document.querySelector('#previous-btn').addEventListener('click', () => {
    if(player.getPlaylistIndex() > 0) {
        player.previousVideo()
    }
})
document.querySelector('#next-btn').addEventListener('click', () => {
    if(player.getPlaylistIndex() < player.getPlaylist().length-1) {
        player.nextVideo();
    }
})