const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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
        const { nombre, genero, edad, correo, contrasena, peso, altura } = req.body;
        
        if (!nombre || !genero || !edad || !correo || !contrasena) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos' 
            });
        }

        if (isNaN(edad) || edad < 10 || edad > 100) {
            return res.status(400).json({ 
                error: 'Edad inválida (10-100 años)' 
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return res.status(400).json({ 
                error: 'Formato de correo inválido' 
            });
        }

        if (contrasena.length < 4) {
            return res.status(400).json({ 
                error: 'Contraseña muy corta (mínimo 4 caracteres)' 
            });
        }

        const usuarioExistente = await client.db('Dreamer').collection('usuario').findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ 
                error: 'El correo ya está registrado' 
            });
        }

        const result = await client.db('Dreamer').collection('usuario').insertOne({
            nombre,
            genero,
            edad: parseInt(edad),
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
        res.status(500).json({ 
            error: 'Error interno del servidor'
        });
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        if (!correo || !contrasena) {
            return res.status(400).json({ 
                error: 'Correo y contraseña son requeridos' 
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

        res.status(200).json({ 
            success: true,
            usuario: {
                id: usuario._id.toString(),
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
            error: 'Error en el servidor'
        });
    }
});

// Ruta para guardar dietas
app.post('/guardar-dieta', async (req, res) => {
    console.log('📥 Petición recibida en /guardar-dieta');
    console.log('📦 Body recibido:', req.body);
    
    try {
        const { userId, dietText, preferences } = req.body;
        
        if (!userId || !dietText) {
            console.log('❌ Faltan datos');
            return res.status(400).json({ error: 'Se requieren userId y dietText' });
        }

        if (!ObjectId.isValid(userId)) {
            console.log('❌ ID inválido:', userId);
            return res.status(400).json({ error: 'Formato de ID incorrecto' });
        }

        const db = client.db('Dreamer');
        const collection = db.collection('usuario');
        
        // Debug: Verificar existencia de usuario
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            console.log('❌ Usuario no existe con ID:', userId);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Operación de actualización
        const result = await collection.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $push: { 
                    dietas: {
                        dietText,
                        preferences: preferences || {},
                        fechaCreacion: new Date()
                    } 
                } 
            }
        );

        console.log('📊 Resultado MongoDB:', result);
        
        if (result.modifiedCount === 0) {
            console.log('⚠️ No se modificó ningún documento');
            return res.status(500).json({ error: 'No se pudo actualizar' });
        }

        console.log('✅ Dieta guardada para usuario:', userId);
        res.status(200).json({ success: true, message: 'Dieta guardada' });

    } catch (error) {
        console.error('💥 Error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
// Ruta para obtener dietas de un usuario
app.get('/dietas/:userId', async (req, res) => {
    try {
        const user = await client.db('Dreamer').collection('usuario').findOne(
            { _id: new ObjectId(req.params.userId) },
            { projection: { dietas: 1 } }
        );
        
        if (!user) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

        res.status(200).json(user.dietas || []);

    } catch (error) {
        console.error('Error al obtener dietas:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor'
        });
    }
});

// Ruta para obtener datos de usuario
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

        res.status(200).json({
            _id: usuario._id,
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
            error: 'Error al obtener datos del usuario'
        });
    }
});