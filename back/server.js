const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = 'mongodb://localhost:27017/Dreamer';
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

// Middleware de autenticación
const autenticar = async (req, res, next) => {
  try {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
          return res.status(401).json({ error: "Token no proporcionado" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const usuario = await client.db('Dreamer').collection('usuario')
          .findOne({ _id: new ObjectId(decoded.userId) });

      if (!usuario) {
          return res.status(404).json({ error: "Usuario no encontrado" });
      }

      req.usuario = {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo
      };
      
      next();
  } catch (error) {
      res.status(401).json({ 
          error: "Token inválido",
          detalles: error.message 
      });
  }
};

// Endpoint de verificación

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

      const usuario = await client.db('Dreamer').collection('usuario').findOne({ correo });
      
      if (!usuario) {
          return res.status(400).json({ error: 'Credenciales inválidas' });
      }

      if (contrasena !== usuario.contrasena) {
          return res.status(400).json({ error: 'Credenciales inválidas' });
      }

      // Generar token JWT
      const token = jwt.sign(
          { 
              userId: usuario._id,
              email: usuario.correo
          },
          JWT_SECRET,
          { expiresIn: '1h' } // El token expira en 1 hora
      );

      res.status(200).json({ 
        success: true,
        token: token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          peso: usuario.peso,
          altura: usuario.altura
        }
      });

  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta para actualizar nombre y peso
app.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, peso } = req.body;
  
      if (!ObjectId.isValid(id)) { // ✅ Ahora ObjectId está definido
        return res.status(400).json({ error: "ID inválido" });
      }
  
      //2. Validar datos de entrada
      if (typeof nombre !== 'string' || typeof peso !== 'number') {
        return res.status(400).json({ error: "Datos de entrada inválidos" });
      }
  
      // 3. Ejecutar actualización
      const result = await client
        .db('Dreamer')
        .collection('usuario')
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { nombre, peso } }
        );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
      }
  
      res.json({ success: true });
  
    } catch (error) {
      //console.error("Error al actualizar usuario:", error);
      
      // 4. Mejorar mensajes de error
      if (error instanceof MongoError) {
        return res.status(400).json({ 
          error: "Error de base de datos",
          details: error.message 
        });
      }
      
      res.status(500).json({ 
        error: "Error interno del servidor",
        details: error.message // Opcional: solo para entorno de desarrollo
      });
    }
  });

  app.get('/progreso', autenticar, async (req, res) => {
      try {
          const progreso = await client.db('Dreamer').collection('progreso_pesos')
              .find({ usuarioId: new ObjectId(req.userId) })
              .sort({ fecha: 1 })
              .limit(6)
              .toArray();

          res.json(progreso);
      } catch (error) {
          console.error("Error en GET /progreso:", error);
          res.status(500).json({ 
              error: "Error al obtener historial de peso",
              detalles: error.message 
          });
      }
  });

// Registrar nuevo peso
  app.post('/progreso', autenticar, async (req, res) => {
      try {
          const nuevoRegistro = {
              usuarioId: new ObjectId(req.userId),
              peso: req.body.peso,
              fecha: new Date()
          };

          const result = await client.db('Dreamer').collection('progreso_pesos')
              .insertOne(nuevoRegistro);

          res.status(201).json(result.ops[0]);
          
      } catch (error) {
          console.error("Error en POST /progreso:", error);
          res.status(500).json({ 
              error: "Error al guardar registro de peso",
              detalles: error.message 
          });
      }
  });
  // Endpoint para verificar tokens
  app.get('/auth/verificar-token', autenticar, (req, res) => {
    res.json({
        valido: true,
        usuario: req.usuario
    });
  });