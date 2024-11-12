const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, required: true },
  price: { type: Number, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  imageUrl: { type: String, required: false },
});

module.exports = mongoose.model('Space', SpaceSchema);
