const { getCollection } = require('../db/connection');

exports.createDiet = async (req, res) => {
    try {
        const { userId, dietData } = req.body;
        
        if (!userId || !dietData) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const dietsCollection = await getCollection('dietas');
        const result = await dietsCollection.insertOne({
            userId,
            ...dietData,
            created: new Date(),
            lastModified: new Date()
        });

        res.status(201).json({
            success: true,
            dietId: result.insertedId,
            message: 'Dieta guardada exitosamente'
        });

    } catch (error) {
        console.error('Error al guardar dieta:', error);
        res.status(500).json({ 
            error: 'Error al guardar dieta',
            detalle: error.message 
        });
    }
};

exports.getUserDiets = async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'Se requiere el ID de usuario' });
        }

        const dietsCollection = await getCollection('dietas');
        const diets = await dietsCollection.find({ userId }).toArray();

        res.status(200).json(diets);

    } catch (error) {
        console.error('Error al obtener dietas:', error);
        res.status(500).json({ 
            error: 'Error al obtener dietas',
            detalle: error.message 
        });
    }
};