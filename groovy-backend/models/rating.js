const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    pontuacao: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true }, //Referencia música ou álbum
    entity_type: { type: String, enum: ['song', 'album'], required: true },
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;