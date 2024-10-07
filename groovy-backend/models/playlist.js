const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  titulo: {type: String, required: true }, //Título da Playlist
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Usuário dono da Playlist
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], //Músicas que a Playlist contém
  descricao: { type: String },                                    //Descrição da Playlist
  privada: { type: Boolean, required: true },                     //Privada ou pública
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;