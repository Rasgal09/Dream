const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Si usas archivo .env

const app = express();
const PORT = 3001; // PUERTO DIFERENTE SI YA USABAS OTRO

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión con MongoDB Compass
mongoose.connect('mongodb://127.0.0.1:27017/Dieta', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error en MongoDB:', err));

// Rutas
const dietaRoutes = require('./routes/dieta.routes');
app.use('/api/dieta', dietaRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});