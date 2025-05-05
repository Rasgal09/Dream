const { getCollection } = require('../db/connection');

exports.createRoutine = async (req, res) => {
    try {
        const { userId, routineData } = req.body;
        
        if (!userId || !routineData) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const routinesCollection = await getCollection('rutinas');
        const result = await routinesCollection.insertOne({
            userId,
            ...routineData,
            created: new Date(),
            lastModified: new Date(),
            completed: false,
            progress: 0
        });

        res.status(201).json({
            success: true,
            routineId: result.insertedId,
            message: 'Rutina guardada exitosamente'
        });

    } catch (error) {
        console.error('Error al guardar rutina:', error);
        res.status(500).json({ 
            error: 'Error al guardar rutina',
            detalle: error.message 
        });
    }
};

exports.getUserRoutines = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'Se requiere el ID de usuario' });
        }

        const routinesCollection = await getCollection('rutinas');
        const routines = await routinesCollection.find({ userId }).toArray();

        res.status(200).json(routines);

    } catch (error) {
        console.error('Error al obtener rutinas:', error);
        res.status(500).json({ 
            error: 'Error al obtener rutinas',
            detalle: error.message 
        });
    }
};