
// Add event listener to the input in both songsSb and playListSb
for(let sb of [songsSb, playListSb]) {
    let searchSongs = sb.querySelector('ul').children;
    let searchBar = sb.querySelector('.search-bar'); 
    let searchFilter = sb.querySelector('select');

    // Add key listener
    searchBar.addEventListener('input', function() {
        for(let song of searchSongs) {
            // Check if the search value matches the text content of the title or author
            if(searchBar.value.length > 0) {
                let matchesTitle = (searchFilter.value == 'any' || searchFilter.value == 'title') && song.children[1].textContent.toLowerCase().includes(searchBar.value.toLowerCase());
                let matchesAuthor = (searchFilter.value == 'any' || searchFilter.value == 'author') && song.children[2].textContent.toLowerCase().includes(searchBar.value.toLowerCase());
                if(matchesTitle || matchesAuthor) {
                    song.style.display = 'block'
                }
                else {
                    song.style.display = 'none'
                }
            }
            else {
                song.style.display = 'block'
            }
        
        }

    })
}