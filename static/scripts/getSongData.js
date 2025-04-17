function capitalize(str) {
    return str.split(' ') // Split the string into words
              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
              .join(' '); // Join words back into a string
}


let result;
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
           
    const query = `SELECT * FROM songs;`;
    result = db.exec(query);

    let songList = document.querySelector('#songlist')
    for (let song of result[0].values) {
        songList.innerHTML += `<li id=${song[0]}><button class="add-song-btn">+</button> <span class="title">${capitalize(song[1])}</span> <span class="author">${capitalize(song[2])}</span></li>`
    }
                     
    })
    .catch(error => {
        console.error("Error loading the database:", error);
    });
});
