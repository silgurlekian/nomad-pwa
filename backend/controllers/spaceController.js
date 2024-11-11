const Space = require('../models/space'); 
const Service = require('../models/Service');

// Crear un nuevo espacio
exports.createSpace = async (req, res) => {
  try {
    const { name, address, rating, price, services } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;  // filename generado por Multer

    const space = new Space({
      name,
      address,
      rating,
      price,
      services,
      imageUrl,
    });

    await space.save();
    res.status(201).json(space);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los espacios con los servicios
exports.getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find().populate('services');
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un espacio por su ID
exports.getSpaceById = async (req, res) => {
  try {
    const space = await Space.findById(req.params.id); // Busca el espacio por su id
    if (!space) {
      return res.status(404).json({ message: 'Espacio no encontrado' });
    }
    res.json(space); // Devuelve el espacio encontrado
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar un espacio por su ID
exports.deleteSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id); // Elimina el espacio por su id
    if (!space) {
      return res.status(404).json({ message: 'Espacio no encontrado' });
    }
    res.json({ message: 'Espacio eliminado correctamente' }); // Responde con un mensaje de éxito
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

