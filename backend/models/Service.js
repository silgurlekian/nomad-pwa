const mongoose = require('mongoose');

// Definimos el esquema de Service
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Service', ServiceSchema);
