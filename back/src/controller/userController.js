// src/controller/userController.js
const { getCollection } = require('../db/connection');
const { ObjectId } = require('mongodb');

// Registro de usuario
exports.registro = async (req, res) => {
    try {
        const { nombre, genero, edad, correo, contrasena, peso, altura } = req.body;
        
        // Validaciones
        if (!nombre || !genero || !edad || !correo || !contrasena) {
            return res.status(400).json({ 
                error: 'Todos los campos son requeridos: nombre, género, edad, correo, contraseña' 
            });
        }

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

        const usuariosCollection = await getCollection('usuario');
        const usuarioExistente = await usuariosCollection.findOne({ correo });
        
        if (usuarioExistente) {
            return res.status(400).json({ 
                error: 'El correo electrónico ya está registrado' 
            });
        }

        const nuevoUsuario = {
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
        };

        const result = await usuariosCollection.insertOne(nuevoUsuario);
        
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
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        
        if (!correo || !contrasena) {
            return res.status(400).json({ 
                error: 'Correo electrónico y contraseña son requeridos' 
            });
        }

        // Línea corregida
        const usuariosCollection = await getCollection('usuario');
        const usuario = await usuariosCollection.findOne({ correo });


        if (contrasena !== usuario.contrasena) {
            return res.status(400).json({ 
                error: 'Contraseña incorrecta' 
            });
        }

        // Respuesta con todos los datos importantes
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
            error: 'Error en el servidor',
            detalle: error.message 
        });
    }
};

// Obtener datos de usuario
// En src/controller/userController.js, modifica el método getUsuario:
exports.getUsuario = async (req, res) => {
    try {
        const { correo } = req.query;
        
        if (!correo) {
            return res.status(400).json({ 
                error: 'Se requiere el parámetro "correo"' 
            });
        }

        // Línea corregida (elimina client y usa getCollection)
        const usuariosCollection = await getCollection('usuario');
        const usuario = await usuariosCollection.findOne({ correo });
        
        if (!usuario) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }

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
};