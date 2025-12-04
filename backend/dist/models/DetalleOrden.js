const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').default;
const Orden = require('./Orden');
const Producto = require('./Producto');

class DetalleOrden extends Model {}

DetalleOrden.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orden_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Orden,
      key: 'id'
    }
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'DetalleOrden',
  tableName: 'detalles_orden',
  timestamps: true
});

// Relaciones
// DetalleOrden.belongsTo(Orden, { foreignKey: 'orden_id' });
// DetalleOrden.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = DetalleOrden; 