const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').default;
const Marca = require('./Marca');
const Categoria = require('./Categoria');

class Producto extends Model {}

Producto.init({
  id_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'marca', key: 'id_marca' },
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'categoria', key: 'id_categoria' },
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tipo_producto: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['camara', 'accesorio']],
    },
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Producto',
  tableName: 'producto',
  timestamps: false,
});

Producto.belongsTo(Marca, { foreignKey: 'id_marca', as: 'marca' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

module.exports = Producto; 