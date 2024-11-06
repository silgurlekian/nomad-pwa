const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Asegurando CORS
const spaceRoutes = require('./routes/spaceRoutes');

const app = express();
const PORT = 5001;  // Cambiar a puerto 5001

// Configurar CORS para permitir solicitudes desde localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',  // Asegúrate de que sea la URL de tu frontend
  methods: 'GET',             // Permitir solo solicitudes GET desde el frontend
  allowedHeaders: 'Content-Type'   // Permitir encabezados Content-Type
}));

app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/nomad', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Rutas
app.use('/api/spaces', spaceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
