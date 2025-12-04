const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database').default;

class Marca extends Model {}

Marca.init({
  id_marca: {
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
  modelName: 'Marca',
  tableName: 'marca',
  timestamps: false,
});

module.exports = Marca; 