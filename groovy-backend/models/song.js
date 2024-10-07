const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    titulo: { type: String, required: true }, 
    artist: { type: String, required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    linkCifra: { type: String },
    ano: { type: String },
    genero: {type: String},
    duracao: {type: String},
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;