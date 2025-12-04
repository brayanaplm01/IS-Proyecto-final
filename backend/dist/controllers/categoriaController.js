const Categoria = require('../models/Categoria');

exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaCategoria = await Categoria.create({ nombre });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: 'Error al crear la categoría', detalle: error.message });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    categoria.nombre = nombre;
    await categoria.save();
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    await categoria.destroy();
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
}; 