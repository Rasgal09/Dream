// src/server.js
const express = require('express');
const { connectDB } = require('./db/connection');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));