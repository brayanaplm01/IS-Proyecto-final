const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').default;
const Usuario = require('./User').default;
// const DetalleOrden = require('./DetalleOrden');

class Orden extends Model {}

Orden.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  usuario_nombre: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  fecha_orden: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metodo_pago: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numero_factura: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo_envio: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tipo de envío seleccionado (normal, platino, oro)'
  },
  descripcion_envio: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Descripción del tipo de envío'
  },
  costo_envio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Costo del envío'
  }
}, {
  sequelize,
  modelName: 'Orden',
  tableName: 'ordenes',
  timestamps: true
});

// Relación con Usuario
// Orden.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relación con DetalleOrden
// Orden.hasMany(DetalleOrden, { foreignKey: 'orden_id' });

module.exports = Orden; 