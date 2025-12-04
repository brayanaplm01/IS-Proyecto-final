const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./dist/config/database').default;

const authRoutes = require('./dist/routes/auth');
const marcaRoutes = require('./dist/routes/marca');
const categoriaRoutes = require('./dist/routes/categoria');
const productoRoutes = require('./dist/routes/producto');
const dashboardRoutes = require('./dist/routes/dashboard');
const ordenRoutes = require('./dist/routes/orden');

const Usuario = require('./dist/models/User').default;
const Marca = require('./dist/models/Marca');
const Categoria = require('./dist/models/Categoria');
const Producto = require('./dist/models/Producto');
const Orden = require('./dist/models/Orden');
const DetalleOrden = require('./dist/models/DetalleOrden');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/facturas', express.static(path.join(__dirname, 'dist/public/facturas')));

app.use('/api/auth', authRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ordenes', ordenRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Tienda de Cámaras funcionando' });
});

// Definir asociaciones después de cargar todos los modelos
Usuario.hasMany(Orden, { foreignKey: 'usuario_id' });
Orden.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Orden.hasMany(DetalleOrden, { foreignKey: 'orden_id' });
DetalleOrden.belongsTo(Orden, { foreignKey: 'orden_id' });

Marca.hasMany(Producto, { foreignKey: 'id_marca' });
Producto.belongsTo(Marca, { foreignKey: 'id_marca' });

Categoria.hasMany(Producto, { foreignKey: 'id_categoria' });
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria' });

DetalleOrden.belongsTo(Producto, { foreignKey: 'producto_id' });
Producto.hasMany(DetalleOrden, { foreignKey: 'producto_id' });

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  }); 