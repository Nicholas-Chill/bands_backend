const dbDriver = require('better-sqlite3');
const { json } = require('body-parser');
const db = dbDriver('bands_albums_members.sqlite3');

const express = require('express');
const app = express();

app.use(express.json());

// Get all bands
app.get('/bands', (req, res) => {
    const bands = db.prepare('SELECT * FROM bands').all();
    res.json(bands);
});

// Get band by id
app.get('/bands/:id', (req, res) => {
    const band = db.prepare('SELECT * FROM bands WHERE id = :id');
    const id = req.params.id;
    let result = band.all({id});
    res.json(result[0] || {'error': 'No band matching id'})
});

// Add a new band
app.post('/bands/add', (req, res) => {
    const add = req.body;
    const addBand = db.prepare('INSERT INTO bands (band_name) VALUES (?)');
    const result = addBand.run(add.band_name);
    res.json({id: result.lastInsertRowid, success: true}); 
});

// Update a band
app.put('/bands/:id', (req, res) => {
    const update = req.body;
    const updateStatement = db.prepare('UPDATE bands SET band_name = ? WHERE id = ?');
    const result = updateStatement.run(update.band_name, req.params.id);
    res.json({changes: result.changes, success: true});
});

// Delete a band
app.delete('/bands/:id', (req,res) => {
    const deleteStatement = db.prepare('DELETE FROM bands WHERE id = ?');
    const result = deleteStatement.run(req.params.id);
    res.json({success: true} || {'error': 'No band matching id'});
});

// Get all albums
app.get('/albums', (req, res) => {
    const albums = db.prepare('SELECT * FROM albums').all();
    res.json(albums);
});

// Get album by id
app.get('/albums/:id', (res, req) => {
    const id = req.params.id;
    const album = db.prepare('SELECT * FROM albums WHERE id = :id');
    let result = album.all({id});
    res.json(result[0] || {'error': 'No album matching id'});
});

// Add an album
app.post('/albums/add', (req, res) => {
    const add = req.body;
    const addAlbum = db.prepare('INSERT INTO albums (album, band_id) VALUES (?, ?)');
    const result = addAlbum.run(add.album, add.band_id);
    res.json({id: result.lastInsertRowid, success: true});
});

// Delete an album
app.delete('/albums/:id', (req, res) => {
    const deleteAlbum = db.prepare('DELETE FROM albums WHERE id = ?');
    const result = deleteAlbum.run(req.params.id);
    res.json({success: true});
})

app.listen(3000, console.log('Server started on port 3000'));