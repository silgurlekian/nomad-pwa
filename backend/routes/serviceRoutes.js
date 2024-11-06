const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

router.post('/services', ServiceController.createService);
router.get('/services', ServiceController.getServices);

module.exports = router;
