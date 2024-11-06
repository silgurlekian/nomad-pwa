const express = require('express');
const cors = require('cors'); // Importamos el middleware CORS
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const SpaceRoutes = require('./routes/spaceRoutes');
const ServiceRoutes = require('./routes/serviceRoutes');

const app = express();

// Configuración de CORS: permite solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes (JSON)
app.use(bodyParser.json());

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/nomad-pwa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((error) => {
  console.error('Error al conectar a MongoDB:', error);
});

// Rutas de la API
app.use('/api', SpaceRoutes);  // Rutas de espacios
app.use('/api', ServiceRoutes);  // Rutas de servicios

// Ruta raíz (opcional, para comprobar que el servidor está corriendo)
app.get('/', (req, res) => {
  res.send('¡Servidor corriendo correctamente!');
});

// Configurar el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
