const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');
const ServiceController = require('../controllers/ServiceController');
const upload = require('../middleware/upload');

// Rutas para manejar espacios
router.post('/spaces', upload.single('image'), SpaceController.createSpace);
router.get('/spaces', SpaceController.getSpaces);
router.get('/spaces/:id', SpaceController.getSpaceById);  // Ruta para obtener un espacio por id
router.delete('/spaces/:id', SpaceController.deleteSpace);  // Ruta para eliminar un espacio por id

// Rutas para manejar servicios
router.post('/services', ServiceController.createService);
router.get('/services', ServiceController.getServices);

module.exports = router;
