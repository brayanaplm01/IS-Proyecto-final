const express = require('express');
const router = express.Router();
const { generarQRPago, crearOrden, procesarPago, updateOrdenTotal } = require('../controllers/ordenController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Proteger estas rutas si solo los administradores deben acceder
// router.use(authMiddleware); // Asumiendo que tu middleware verifica el rol admin

// GET /api/ordenes - Obtener todas las órdenes
router.get('/', getAllOrdenes);

// PUT /api/ordenes/:id - Actualizar el estado de una orden
router.put('/:id', updateOrdenEstado);

router.post('/', authenticateToken, crearOrden);
router.get('/:orden_id/qr', generarQRPago);
router.post('/:orden_id/procesar-pago', authenticateToken, procesarPago);
router.put('/:orden_id/total', authenticateToken, updateOrdenTotal);

module.exports = router; 