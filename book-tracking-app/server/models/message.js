const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  id: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});

module.exports = mongoose.model('Message', messageSchema);
