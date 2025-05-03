const express = require('express');
const router = express.Router();
const Dieta = require('../models/dieta');

// GET: obtener todas las dietas
router.get('/', async (req, res) => {
  try {
    const dietas = await Dieta.find();
    res.json(dietas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las dietas' });
  }
});

// POST: agregar una dieta nueva
router.post('/', async (req, res) => {
  try {
    const nuevaDieta = new Dieta(req.body);
    await nuevaDieta.save();
    res.status(201).json(nuevaDieta);
  } catch (error) {
    res.status(400).json({ error: 'Error al guardar la dieta' });
  }
});

module.exports = router;