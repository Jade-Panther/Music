// Initialize sql.js with the location of the wasm file.
    // Adjust the locateFile function if your wasm is hosted elsewhere.
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
    const result = db.exec(query);
                
    console.log("Columns:", result[0].columns);
    console.log("Rows:");
    console.log(result)
                
              
    })
    .catch(error => {
        console.error("Error loading the database:", error);
    });
});