const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017/Dreamer';
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        app.listen(3000, () => {
            console.log('Servidor escuchando en el puerto 3000');
        });
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

connectDB();

// Ruta de registro
app.post('/registro', async (req, res) => {
    try {
        const { nombre, genero, correo, contrasena, peso, altura } = req.body;
        
        if (!nombre || !genero || !correo || !contrasena) {
            return res.status(400).json({ error: 'Campos requeridos: nombre, género, correo, contraseña' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        const usuarioExistente = await client.db('Dreamer').collection('usuario').findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const result = await client.db('Dreamer').collection('usuario').insertOne({
            nombre,
            genero,
            correo,
            contrasena,
            fechaRegistro: new Date(),
            peso: peso ? parseFloat(peso) : null,
            altura: altura ? parseFloat(altura) : null,
            rutinas: [],
            dietas: []
        });
        
        res.status(201).json({ 
            success: true,
            id: result.insertedId,
            message: 'Usuario registrado exitosamente'
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    try {
      const { correo, contrasena } = req.body;
      
      if (!correo || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
      }
  
      // Buscar usuario
      const usuario = await client.db('Dreamer').collection('usuario').findOne({ correo });
      if (!usuario) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
  
      // Validar contraseña
      if (contrasena !== usuario.contrasena) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
  
      // Respuesta exitosa
      res.status(200).json({ 
        success: true,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo
        }
      });
  
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });