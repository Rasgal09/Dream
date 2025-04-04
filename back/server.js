const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
//const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const uri = 'mongodb+srv://albertorasgado17:123456@cluster0.sxzufhi.mongodb.net/FortIA?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
    }
}

connectDB();

// Ruta de registro mejorada
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

        // Verificar si el usuario ya existe
        const usuarioExistente = await client.db('FortIA').collection('usuarios').findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Encriptar contraseña
        //const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar nuevo usuario con todos los campos
        const result = await client.db('FortIA').collection('usuarios').insertOne({
            nombre,
            genero,
            correo,
            contraseña,
            //contraseña: hashedPassword,
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

        const usuario = await client.db('FortIA').collection('usuarios').findOne({ correo });
        
        if (!usuario) {
            return res.status(400).json({ 
                success: false,
                error: 'Usuario no encontrado' 
            });
        }

        // Comparación directa (sin encriptación)
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