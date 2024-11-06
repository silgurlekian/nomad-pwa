const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
  name: String,
  address: String,
  rating: Number,
  price: Number
});

module.exports = mongoose.model('Space', spaceSchema);
