const playListSb = document.querySelector('#playlist-sb')
const songsSb = document.querySelector('#songs-sb');
const lyricsSb = document.querySelector('#lyrics-sb')
let currSb = null;

document.querySelector('#toggle-btn-container').addEventListener('click', function(event) {
    let sbEl = document.querySelector('#' + event.target.textContent.toLowerCase() + '-sb');
    let allSidebars = document.querySelectorAll('.sb'); 

    if(sbEl.classList.contains('close')) {
        sbEl.classList.remove('close')
        sbEl.classList.add('open')
        allSidebars.forEach(function(sidebar) {
            if(sidebar != sbEl) {
                sidebar.classList.remove('open')
                sidebar.classList.add('close')
            }
        });
        
    }
    else {
        sbEl.classList.remove('open');
        sbEl.classList.add('close');
        
    }

    currSb = playListSb.classList.contains('open') ? playListSb : songsSb.classList.contains('open') ? lyricsSb.classList.contains('open') : null;
})

