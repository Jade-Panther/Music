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

window.onYouTubeIframeAPIReady = function () {
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
        initSqlJs({
            locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.7.0/${filename}`
        }).then(function (SQL) {
             // Fetch your songs.db file as an ArrayBuffer.
         fetch("songs.db")
             .then(response => {
                 if (!response.ok) {
                     throw new Error("Network response was not ok");
                 }
                 return response.arrayBuffer();
             })
             .then(buffer => {
             // Convert the buffer to a Uint8Array
             const uInt8Array = new Uint8Array(buffer);
             // Create a database instance from the Uint8Array
             const db = new SQL.Database(uInt8Array);
                    
            const query = `SELECT * FROM songs WHERE video_id = '${currSong.id}';`;
            let lyrics = db.exec(query)[0].values;
            console.log(lyrics[0][3].replace('\n', '<br>'))
            document.querySelector('#lyrics').innerHTML = lyrics[0][3].replace('\n', '<br>');
            document.querySelector('#title').textContent = currSong.title;
            document.querySelector('#author').textContent = currSong.author;
            document.querySelector('#lyrics-author').textContent = currSong.author;
            document.querySelector('#lyrics-title').textContent = currSong.title;
                              
            })
        .catch(error => {
            console.error("Error loading the database:", error);
        });
    });
    }
}

function updateSoundImg() {
    console.log(player.isMuted())
    if (player.getVolume() <= 0) {
        muteBtn.src = 'static/images/sound-mute.svg'
    }
    else if (player.getVolume() < 50) {
        muteBtn.src = 'static/images/sound-quiet.svg'   
    }
    else {
        muteBtn.src = 'static/images/sound-loud.svg'
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