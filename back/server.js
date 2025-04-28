const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
//const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// URI modificada con la base de datos Dreamer
const uri = 'mongodb://localhost:27017/Dreamer';

const client = new MongoClient(uri); 
async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB Compass local');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

connectDB();

// Ruta de registro modificada
app.post('/registro', async (req, res) => {
    try {
        const { nombre, genero, correo, contraseña, peso, altura } = req.body; 
        
        // Validación avanzada
        if (!nombre || !genero || !correo || !contraseña) {
            return res.status(400).json({ error: 'Los campos nombre, género, correo y contraseña son requeridos' });
        }

        // Validar formato de correo
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return res.status(400).json({ error: 'Formato de correo inválido' });
        }

        // Verificar si el usuario ya existe (colección usuario)
        const usuarioExistente = await client.db('Dreamer').collection('usuario').findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Insertar nuevo usuario en la colección usuario
        const result = await client.db('Dreamer').collection('usuario').insertOne({
            nombre,
            genero,
            correo,
            contraseña,
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

app.post('/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        
        if (!correo || !contraseña) {
            return res.status(400).json({ 
                success: false,
                error: 'Todos los campos son requeridos' 
            });
        }

        // Buscar en la colección usuario
        const usuario = await client.db('Dreamer').collection('usuario').findOne({ correo });
        
        if (!usuario) {
            return res.status(400).json({ 
                success: false,
                error: 'Usuario no encontrado' 
            });
        }

        if (contraseña !== usuario.contraseña) {
            return res.status(400).json({ 
                success: false,
                error: 'Contraseña incorrecta' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error en el servidor' 
        });
    }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});