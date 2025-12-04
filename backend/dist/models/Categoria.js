const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').default;

class Categoria extends Model {}

Categoria.init({
  id_categoria: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Categoria',
  tableName: 'categoria',
  timestamps: false,
});

module.exports = Categoria; 