const express = require('express');
const router = express.Router();
const {
  createRoutine,
  getUserRoutines
} = require('../controller/routineController');

// Crear nueva rutina
router.post('/', createRoutine);

// Obtener rutinas del usuario
router.get('/', getUserRoutines);

module.exports = router;