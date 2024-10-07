const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  titulo: {type: String, required: true },
  artist: { type: String, required: true },
  ano: { type: String },
  genero: { type: String },
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;