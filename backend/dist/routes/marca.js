const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

router.get('/', marcaController.getMarcas);
router.post('/', marcaController.createMarca);
router.put('/:id', marcaController.updateMarca);
router.delete('/:id', marcaController.deleteMarca);

module.exports = router; 