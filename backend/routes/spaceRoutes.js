const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');
const ServiceController = require('../controllers/ServiceController');

// Rutas para manejar espacios
router.post('/spaces', SpaceController.createSpace);
router.get('/spaces', SpaceController.getSpaces);

// Rutas para manejar servicios
router.post('/services', ServiceController.createService);
router.get('/services', ServiceController.getServices);

module.exports = router;
