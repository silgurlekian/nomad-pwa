const mongoose = require("mongoose");
const Space = require("../models/space");
const Service = require("../models/Service");

exports.createSpace = async (req, res) => {
  try {
    const { name, address, rating, price, services } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Asegúrate de que 'services' sea un array
    let serviceIds = services;

    if (typeof services === "string") {
      serviceIds = [services]; // Si 'services' es una cadena, conviértelo en un array
    }

    // Verificar que cada servicio tenga un formato de ObjectId válido
    const validServiceIds = serviceIds.map((serviceId) => {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error(`El ID del servicio ${serviceId} no es válido`);
      }
      return new mongoose.Types.ObjectId(serviceId); // Crear ObjectId válido
    });

    const space = new Space({
      name,
      address,
      rating,
      price,
      services: validServiceIds, // Usamos los ObjectIds validados
      imageUrl,
    });

    await space.save();
    res.status(201).json(space);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualización de espacio
exports.updateSpace = async (req, res) => {
  try {
    const { name, address, rating, price, services } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Verificar que `services` sea un array de strings válidos de 24 caracteres
    if (!Array.isArray(services)) {
      return res
        .status(400)
        .json({ error: "El campo 'services' debe ser un array" });
    }

    // Validar que cada servicio sea un ObjectId válido
    const validServiceIds = services.map((serviceId) => {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error(`El ID del servicio ${serviceId} no es válido`);
      }
      return new mongoose.Types.ObjectId(serviceId); // Crear ObjectId válido
    });

    // Actualizar el espacio
    const space = await Space.findByIdAndUpdate(
      req.params.id,
      { name, address, rating, price, services: validServiceIds, imageUrl },
      { new: true } // Retorna el espacio actualizado
    );

    if (!space) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }

    res.json(space); // Devuelve el espacio actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los espacios con los servicios
exports.getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find().populate("services");
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
      return res.status(404).json({ message: "Espacio no encontrado" });
    }
    res.json(space); // Devuelve el espacio encontrado
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar un espacio por su ID
exports.deleteSpace = async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id); // Elimina el espacio por su id
    if (!space) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }
    res.json({ message: "Espacio eliminado correctamente" }); // Responde con un mensaje de éxito
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
