const Producto = require('../models/Producto');
const Marca = require('../models/Marca');
const Categoria = require('../models/Categoria');
const Usuario = require('../models/User').default; // User.js usa exports.default
const Orden = require('../models/Orden');
const DetalleOrden = require('../models/DetalleOrden');
const sequelize = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const totalProductos = await Producto.count();
    const totalAccesorios = await Producto.count({ where: { tipo_producto: 'accesorio' } });
    const totalMarcas = await Marca.count();
    const totalCategorias = await Categoria.count();
    const totalClientes = await Usuario.count({ where: { rol: 'cliente' } });

    res.json({
      totalProductos,
      totalAccesorios,
      totalMarcas,
      totalCategorias,
      totalClientes,
    });
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
};

const getSalesData = async (req, res) => {
  try {
    const salesData = await Orden.findAll({
      attributes: [
        [sequelize.fn('date_part', 'year', sequelize.col('fecha_pago')), 'año'],
        [sequelize.fn('date_part', 'month', sequelize.col('fecha_pago')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('DetalleOrdens.subtotal')), 'totalVentas'],
      ],
      include: [{
        model: DetalleOrden,
        attributes: [], // No necesitamos atributos del detalle, solo para la suma
      }],
      where: {
        estado: 'pagado',
      },
      group: [
        sequelize.fn('date_part', 'year', sequelize.col('fecha_pago')),
        sequelize.fn('date_part', 'month', sequelize.col('fecha_pago')),
      ],
      order: [
        [sequelize.fn('date_part', 'year', sequelize.col('fecha_pago')), 'ASC'],
        [sequelize.fn('date_part', 'month', sequelize.col('fecha_pago')), 'ASC'],
      ],
      raw: true, // Para obtener resultados planos
    });

    // Formatear los datos para el frontend si es necesario
    // Opcional: Mapear número de mes a nombre si el frontend lo necesita, pero
    // el frontend actual parece mapear por índice.
    // Vamos a devolver año y mes número para mayor flexibilidad
    const formattedSales = salesData.map(item => ({
      año: parseInt(item.año, 10),
      mes: parseInt(item.mes, 10),
      ventas: parseFloat(item.totalVentas),
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error('Error en getSalesData:', error);
    res.status(500).json({ error: 'Error al obtener datos de ventas' });
  }
};

// Obtener ventas recientes
const getRecentSales = async (req, res) => {
  try {
    const recentSales = await Orden.findAll({
      attributes: ['id', 'usuario_nombre', 'total', 'fecha_orden'],
      where: { estado: 'pagado' }, // Solo órdenes pagadas
      order: [['fecha_orden', 'DESC']], // Ordenar por fecha descendente
      limit: 5, // Limitar a las 5 ventas más recientes
      raw: true, // Para obtener resultados planos
    });

    res.json(recentSales);
  } catch (error) {
    console.error('Error en getRecentSales:', error);
    res.status(500).json({ error: 'Error al obtener ventas recientes' });
  }
};

module.exports = { getDashboardStats, getSalesData, getRecentSales }; 