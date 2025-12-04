const Marca = require('../models/Marca');

exports.getMarcas = async (req, res) => {
  try {
    const marcas = await Marca.findAll();
    res.json(marcas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las marcas' });
  }
};

exports.createMarca = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaMarca = await Marca.create({ nombre });
    res.status(201).json(nuevaMarca);
  } catch (error) {
    console.error("Error al crear marca:", error);
    res.status(500).json({ error: 'Error al crear la marca', detalle: error.message });
  }
};

exports.updateMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const marca = await Marca.findByPk(id);
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    marca.nombre = nombre;
    await marca.save();
    res.json(marca);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la marca' });
  }
};

exports.deleteMarca = async (req, res) => {
  try {
    const { id } = req.params;
    const marca = await Marca.findByPk(id);
    if (!marca) return res.status(404).json({ error: 'Marca no encontrada' });
    await marca.destroy();
    res.json({ message: 'Marca eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la marca' });
  }
}; 