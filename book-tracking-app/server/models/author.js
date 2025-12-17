const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String }
});

module.exports = mongoose.model('Author', authorSchema);

