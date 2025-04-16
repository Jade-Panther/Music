
const songListEl = document.querySelector('#songlist')
const playListEl = document.querySelector('#playlist')
const playList = []

function addSong(song) {
    const exists = playList.some(s => 
        song.title === s.title && song.author === s.author
    )

    if(!exists) {
        playList.push(song)
        // Add the playlist
        playListEl.innerHTML += `<li id=${song.id}><button class='add-song-btn'>X</button> <span class='title'>${song.title}</span> <span class='author'>${song.author}</span></li>`
        // Update length div 
        document.querySelector('#playlist-length').textContent = 'Length: ' + playList.length;
    }
}

function deleteSong(song) {
    let index = playList.findIndex(s => 
        song.title === s.title && song.author === s.author
    );

    // Remove the song from the playlist array if it exists
    if (index !== -1) {
        playList.splice(index, 1);
    }

    document.querySelector('#playlist-length').textContent = 'Length: ' + playList.length;

}

// Add songs
songListEl.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        // Get the clicked li element
        let clickedLi = event.target.tagName === 'LI' ? event.target : event.target.closest('li');
        
        // Get the song title and author
        let s = {id: clickedLi.id, title: clickedLi.querySelector('.title').textContent, author: clickedLi.querySelector('.author').textContent};
        
        if(songsSb.classList.contains('open')) {
            addSong(s)
        }
    }
    else if(event.target.classList.contains('author')) {
        let searchBar = songsSb.querySelector('.search-bar')
        searchBar.value = event.target.textContent;
        const inputEvent = new Event('input');
        searchBar.dispatchEvent(inputEvent);
    }
});

// Use the "Add All" and "Delete All" buttons
for(let btn of document.querySelectorAll('.all')) {
    btn.addEventListener('click', () => {
        if(songsSb.classList.contains('open')) {
            for(let li of songListEl.querySelectorAll('li')) {
                if(li.style.display != 'none') {
                    addSong({title: li.querySelector('.title').textContent, author: li.querySelector('.author').textContent})
                }
            }
        }
        else {
            for(let li of playListEl.querySelectorAll('li')) {
                deleteSong({title: li.querySelector('.title').textContent, author: li.querySelector('.author').textContent})
                li.remove();
                isPlaylistLoaded = false;
            }
        }
    })
}

// Delete songs
playListEl.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        // Get the clicked li element
        let clickedLi = event.target.tagName === 'LI' ? event.target : event.target.closest('li');
        
        // Get the song title and author
        let s = {title: clickedLi.querySelector('.title').textContent, author: clickedLi.querySelector('.author').textContent};
        
        if(playListSb.classList.contains('open')) {
            // Remove from playlist
            deleteSong(s)

            // Remove the song element from the playlist UI
            clickedLi.remove();
            isPlaylistLoaded = false;
        }
    }
    else if(event.target.classList.contains('author')) {
        let searchBar = playListSb.querySelector('.search-bar')
        searchBar.value = event.target.textContent;
        const inputEvent = new Event('input');
        searchBar.dispatchEvent(inputEvent);
    }
});
