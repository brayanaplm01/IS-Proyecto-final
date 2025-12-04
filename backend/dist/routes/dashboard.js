const { Router } = require('express');
const { getDashboardStats, getSalesData, getRecentSales } = require('../controllers/dashboardController');

const router = Router();
router.get('/stats', getDashboardStats);
router.get('/sales', getSalesData);
router.get('/recent-sales', getRecentSales);

module.exports = router; 