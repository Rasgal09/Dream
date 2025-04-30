const mongoose = require("mongoose")
require("dotenv").config()

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Dieta", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error en MongoDB:", err))

// Importar el modelo
const Dieta = require("../models/dieta")

// Datos iniciales
const initialDiets = [
  {
    name: "Dieta Mediterránea",
    description: "Rica en grasas saludables, proteínas magras y vegetales frescos",
    category: "Equilibrada",
    color: "#4285F4",
    calories: 2200,
    macros: { protein: 25, carbs: 50, fat: 25 },
    meals: [
      {
        name: "Desayuno",
        foods: ["Yogur griego con miel y nueces", "Pan integral con aceite de oliva", "Fruta fresca"],
        time: "8:00 AM",
      },
      {
        name: "Almuerzo",
        foods: ["Ensalada de quinoa con verduras", "Pescado a la plancha", "Aceitunas"],
        time: "1:00 PM",
      },
      {
        name: "Merienda",
        foods: ["Hummus con palitos de zanahoria", "Puñado de almendras"],
        time: "4:30 PM",
      },
      {
        name: "Cena",
        foods: ["Pollo al limón con hierbas", "Verduras asadas", "Una copa de vino tinto"],
        time: "8:00 PM",
      },
    ],
    duration: 30,
    difficulty: "Media",
    tags: ["antiinflamatoria", "corazón", "longevidad"],
  },
  {
    name: "Volumen Muscular",
    description: "Alta en proteínas y calorías para ganar masa muscular",
    category: "Deportiva",
    color: "#4CAF50",
    calories: 3200,
    macros: { protein: 35, carbs: 45, fat: 20 },
    meals: [
      {
        name: "Desayuno",
        foods: ["Avena con proteína en polvo y plátano", "Huevos enteros", "Zumo de naranja"],
        time: "7:00 AM",
      },
      {
        name: "Media mañana",
        foods: ["Batido de proteínas", "Sándwich de pavo y queso"],
        time: "10:30 AM",
      },
      {
        name: "Almuerzo",
        foods: ["Pechuga de pollo a la plancha", "Arroz integral", "Verduras salteadas"],
        time: "1:30 PM",
      },
      {
        name: "Merienda",
        foods: ["Yogur griego con granola", "Frutos secos mixtos"],
        time: "4:30 PM",
      },
      {
        name: "Cena",
        foods: ["Salmón al horno", "Patata dulce", "Ensalada verde"],
        time: "8:00 PM",
      },
      {
        name: "Pre-dormir",
        foods: ["Requesón con canela", "Caseína en polvo"],
        time: "10:30 PM",
      },
    ],
    duration: 60,
    difficulty: "Media",
    tags: ["ganancia muscular", "fuerza", "rendimiento"],
  },
]

// Función para poblar la base de datos
const populateDatabase = async () => {
  try {
    // Eliminar datos existentes
    await Dieta.deleteMany({})
    console.log("✅ Datos anteriores eliminados")

    // Insertar nuevos datos
    const result = await Dieta.insertMany(initialDiets)
    console.log(`✅ ${result.length} dietas insertadas correctamente`)

    // Cerrar la conexión
    mongoose.connection.close()
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error)
    mongoose.connection.close()
  }
}

// Ejecutar la función
populateDatabase()
