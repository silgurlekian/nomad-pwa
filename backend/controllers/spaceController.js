const Space = require('../models/space');  // Nota el uso de '../' ya que el archivo está en 'controllers' y los modelos en 'models'
const Service = require('../models/Service');

// Crear un nuevo espacio
exports.createSpace = async (req, res) => {
  try {
    const { name, address, rating, price, services } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;  // Usamos el filename generado por Multer

    const space = new Space({
      name,
      address,
      rating,
      price,
      services,
      imageUrl,  // Guardamos la URL completa de la imagen en la base de datos
    });

    await space.save();
    res.status(201).json(space);  // Respondemos con el espacio creado
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
