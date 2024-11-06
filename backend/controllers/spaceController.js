const Space = require('../models/space');

// Obtener todos los espacios
exports.getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find();
    res.json(spaces);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Agregar un nuevo espacio
exports.addSpace = async (req, res) => {
  const { name, address, rating, price } = req.body;

  const newSpace = new Space({
    name,
    address,
    rating,
    price
  });

  try {
    const savedSpace = await newSpace.save();
    res.status(201).json(savedSpace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
