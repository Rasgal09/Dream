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

// Ruta de registro (versión corregida)
app.post('/registro', async (req, res) => {
    try {
        const { nombre, genero, edad, correo, contrasena, peso, altura } = req.body;
        
        // Validaciones mejoradas
        if (!nombre || !genero || !edad || !correo || !contrasena) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos: nombre, género, edad, correo, contraseña' 
            });
        }

        // Validación específica para edad
        if (isNaN(edad) || edad < 10 || edad > 100) {
            return res.status(400).json({ 
                error: 'La edad debe ser un número entre 10 y 100 años' 
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return res.status(400).json({ 
                error: 'Formato de correo electrónico inválido' 
            });
        }

        if (contrasena.length < 4) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 4 caracteres' 
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await client.db('Dreamer').collection('usuario').findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ 
                error: 'El correo electrónico ya está registrado' 
            });
        }

        // Insertar nuevo usuario con todos los campos
        const result = await client.db('Dreamer').collection('usuario').insertOne({
            nombre,
            genero,
            edad: parseInt(edad), // Aseguramos que sea número
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
            message: 'Usuario registrado exitosamente',
            usuario: {
                nombre,
                correo,
                edad: parseInt(edad),
                genero
            }
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message 
        });
    }
});

// Ruta de login (actualizada para incluir edad)
app.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        if (!correo || !contrasena) {
            return res.status(400).json({ 
                error: 'Correo electrónico y contraseña son requeridos' 
            });
        }

        const usuario = await client.db('Dreamer').collection('usuario').findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        if (contrasena !== usuario.contrasena) {
            return res.status(400).json({ 
                error: 'Contraseña incorrecta' 
            });
        }

        // Respuesta con todos los datos importantes
        res.status(200).json({ 
            success: true,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                edad: usuario.edad,
                genero: usuario.genero,
                peso: usuario.peso,
                altura: usuario.altura
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ 
            error: 'Error en el servidor',
            detalle: error.message 
        });
    }
});

// Ruta para obtener datos de usuario (corregida)
app.get('/usuario', async (req, res) => {
    try {
        const { correo } = req.query;
        
        if (!correo) {
            return res.status(400).json({ 
                error: 'Se requiere el parámetro "correo"' 
            });
        }

        const usuario = await client.db('Dreamer').collection('usuario').findOne({ correo });
        
        if (!usuario) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        // Devuelve todos los datos relevantes del usuario
        res.status(200).json({
            nombre: usuario.nombre,
            genero: usuario.genero,
            edad: usuario.edad,
            correo: usuario.correo,
            peso: usuario.peso,
            altura: usuario.altura,
            fechaRegistro: usuario.fechaRegistro,
            rutinas: usuario.rutinas || [],
            dietas: usuario.dietas || []
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            error: 'Error al obtener datos del usuario',
            detalle: error.message 
        });
    }
});