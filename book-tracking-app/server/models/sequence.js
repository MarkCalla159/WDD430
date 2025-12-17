const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
  maxBookId: { type: Number, required: true },
  maxAuthorId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
