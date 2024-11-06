const express = require('express');
const router = express.Router();
const { getSpaces, addSpace } = require('../controllers/spaceController');

// Obtener todos los espacios
router.get('/', getSpaces);

// Agregar un nuevo espacio
router.post('/', addSpace);

module.exports = router;
