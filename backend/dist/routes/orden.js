const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear nueva orden
router.post('/', ordenController.crearOrden);

// Generar QR para pago
router.get('/:orden_id/qr', ordenController.generarQRPago);

// Procesar pago
router.post('/:orden_id/pago', ordenController.procesarPago);

// GET /api/ordenes/mis-compras - Obtener órdenes del usuario autenticado (debe ir antes de /:id)
router.get('/mis-compras', authMiddleware, ordenController.getUserOrdenes);

// GET /api/ordenes - Obtener todas las órdenes
router.get('/', ordenController.getAllOrdenes);

// PUT /api/ordenes/:id - Actualizar el estado de una orden
router.put('/:id', ordenController.updateOrdenEstado);

module.exports = router; 