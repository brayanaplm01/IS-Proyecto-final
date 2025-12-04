const Producto = require('../models/Producto');
const Marca = require('../models/Marca');
const Categoria = require('../models/Categoria');

exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [
        { model: Marca, attributes: ['id_marca', 'nombre'] },
        { model: Categoria, attributes: ['id_categoria', 'nombre'] },
      ],
      order: [
        ['id_producto', 'ASC']
      ]
    });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

exports.createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, id_marca, id_categoria, precio, cantidad, imagen, tipo_producto } = req.body;
    const nuevoProducto = await Producto.create({
      nombre, descripcion, id_marca, id_categoria, precio, cantidad, imagen, tipo_producto
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, id_marca, id_categoria, precio, cantidad, imagen, tipo_producto } = req.body;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.id_marca = id_marca;
    producto.id_categoria = id_categoria;
    producto.precio = precio;
    producto.cantidad = cantidad;
    producto.imagen = imagen;
    producto.tipo_producto = tipo_producto;
    await producto.save();
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}; 