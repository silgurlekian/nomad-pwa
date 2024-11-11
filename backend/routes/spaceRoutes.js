const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');
const ServiceController = require('../controllers/ServiceController');
const upload = require('../middleware/upload');  // Importa el middleware correctamente

// Rutas para manejar espacios
router.post('/spaces', upload.single('image'), SpaceController.createSpace); // Usamos multer para manejar la imagen
router.get('/spaces', SpaceController.getSpaces);

// Rutas para manejar servicios
router.post('/services', ServiceController.createService);
router.get('/services', ServiceController.getServices);

module.exports = router;
