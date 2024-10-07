const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    texto: { type: String, required: true },
    data: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entity_type: { type: String, enum: ['song', 'album'], required: true },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;