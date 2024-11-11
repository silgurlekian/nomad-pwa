const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const SpaceRoutes = require('./routes/spaceRoutes');
const ServiceRoutes = require('./routes/serviceRoutes');

const app = express();

// Configuración de CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/nomad-pwa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

// Asegúrate de que las rutas están siendo importadas correctamente
app.use('/api', SpaceRoutes);
app.use('/api', ServiceRoutes);
// Sirve los archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));

// Ruta raíz para verificar el servidor
app.get('/', (req, res) => {
  res.send('¡Servidor corriendo correctamente!');
});

// Configurar el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
