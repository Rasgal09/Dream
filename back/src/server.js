// src/server.js
const express = require('express');
const { connectDB } = require('./db/connection');
const userRoutes = require('./routes/userRoutes');
// Agregar después de las rutas de usuarios
const routineRoutes = require('./routes/routineRoutes');
const dietRoutes = require('./routes/dietRoutes');

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/diets', dietRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));