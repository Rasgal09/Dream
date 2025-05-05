// src/db/connection.js
const { MongoClient } = require('mongodb');
let dbInstance = null;

const connectDB = async () => {
    if (dbInstance) return dbInstance;
    
    const client = new MongoClient('mongodb://localhost:27017', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        dbInstance = client.db('Dreamer');
        console.log('Conexión a MongoDB establecida');
        return dbInstance;
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exit(1);
    }
};

const getCollection = (collectionName) => {
    if (!dbInstance) throw new Error('Base de datos no conectada');
    return dbInstance.collection(collectionName);
};

module.exports = { connectDB, getCollection };