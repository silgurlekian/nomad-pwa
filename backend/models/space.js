const mongoose = require('mongoose');

// Definimos el esquema de Space
const SpaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, required: true },
  price: { type: Number, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Referencia a 'Service'
  imageUrl: { type: String },  // URL de la imagen (no obligatorio)
});


module.exports = mongoose.model('Space', SpaceSchema);
