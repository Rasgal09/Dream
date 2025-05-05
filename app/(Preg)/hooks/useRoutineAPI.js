import { useState, useCallback } from "react"
import axios from "axios"

const EXERCISEDB_API_KEY = "a6274e3c00msh8c65ec95c6a1832p1b06adjsn0221ccf3d3c4"

export const useRoutineAPI = (exercises) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  // Función mejorada para obtener ejercicios
  const getExercises = async (bodyPart) => {
    try {
      // Validar que bodyPart sea un valor válido
      if (!bodyPart || typeof bodyPart !== "string") {
        console.warn("bodyPart inválido:", bodyPart)
        return []
      }

      // Limpiar y normalizar el valor de bodyPart
      const normalizedBodyPart = bodyPart.trim().toLowerCase()

      console.log(`Fetching exercises for bodyPart: ${normalizedBodyPart}`)

      const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${normalizedBodyPart}`, {
        headers: {
          "X-RapidAPI-Key": EXERCISEDB_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      })

      // Verificar si la respuesta contiene datos
      if (response.data && Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} exercises`)
        
        // Mezclar los ejercicios para obtener variedad
        const shuffledExercises = shuffleArray([...response.data])
        return shuffledExercises
      } else {
        console.warn("API returned unexpected data format:", response.data)
        return []
      }
    } catch (err) {
      // Manejo de error mejorado
      if (err.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error(`Error fetching exercises: Status ${err.response.status}`, err.response.data)

        // Manejo específico para error 422
        if (err.response.status === 422) {
          console.error("Error 422: Datos de solicitud inválidos. Verificar bodyPart:", bodyPart)
          // Intentar con un valor predeterminado seguro
          return getExercisesFallback(bodyPart)
        }
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Error fetching exercises: No response received", err.request)
      } else {
        // Error en la configuración de la solicitud
        console.error("Error fetching exercises:", err.message)
      }

      return getExercisesFallback(bodyPart)
    }
  }

  // Función para mezclar un array (algoritmo Fisher-Yates)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Función de respaldo para cuando falla la API
  const getExercisesFallback = (bodyPart) => {
    // Datos de ejercicios de respaldo para cuando la API falla
    console.log(`Using fallback exercise data for ${bodyPart}`)
    
    const fallbackExercises = {
      chest: [
        {
          id: "chest_1",
          name: "Flexiones de pecho",
          bodyPart: "chest",
          equipment: "body weight",
          target: "pectorals",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "chest_2",
          name: "Press de banca",
          bodyPart: "chest",
          equipment: "barbell",
          target: "pectorals",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "chest_3",
          name: "Aperturas con mancuernas",
          bodyPart: "chest",
          equipment: "dumbbell",
          target: "pectorals",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "chest_4",
          name: "Press de pecho inclinado",
          bodyPart: "chest",
          equipment: "barbell",
          target: "pectorals",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "chest_5",
          name: "Fondos en paralelas",
          bodyPart: "chest",
          equipment: "body weight",
          target: "pectorals",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "chest_6",
          name: "Press de pecho con mancuernas",
          bodyPart: "chest",
          equipment: "dumbbell",
          target: "pectorals",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      back: [
        {
          id: "back_1",
          name: "Dominadas",
          bodyPart: "back",
          equipment: "body weight",
          target: "lats",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "back_2",
          name: "Remo con barra",
          bodyPart: "back",
          equipment: "barbell",
          target: "upper back",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "back_3",
          name: "Remo con mancuerna",
          bodyPart: "back",
          equipment: "dumbbell",
          target: "middle back",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "back_4",
          name: "Jalón al pecho",
          bodyPart: "back",
          equipment: "cable",
          target: "lats",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "back_5",
          name: "Peso muerto",
          bodyPart: "back",
          equipment: "barbell",
          target: "lower back",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "back_6",
          name: "Hiperextensiones",
          bodyPart: "back",
          equipment: "body weight",
          target: "lower back",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      shoulders: [
        {
          id: "shoulders_1",
          name: "Press militar",
          bodyPart: "shoulders",
          equipment: "barbell",
          target: "delts",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "shoulders_2",
          name: "Elevaciones laterales",
          bodyPart: "shoulders",
          equipment: "dumbbell",
          target: "delts",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "shoulders_3",
          name: "Elevaciones frontales",
          bodyPart: "shoulders",
          equipment: "dumbbell",
          target: "front delts",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "shoulders_4",
          name: "Pájaros",
          bodyPart: "shoulders",
          equipment: "dumbbell",
          target: "rear delts",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "shoulders_5",
          name: "Press Arnold",
          bodyPart: "shoulders",
          equipment: "dumbbell",
          target: "delts",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "shoulders_6",
          name: "Encogimientos de hombros",
          bodyPart: "shoulders",
          equipment: "barbell",
          target: "traps",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      "upper arms": [
        {
          id: "arms_1",
          name: "Curl de bíceps con barra",
          bodyPart: "upper arms",
          equipment: "barbell",
          target: "biceps",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "arms_2",
          name: "Extensiones de tríceps",
          bodyPart: "upper arms",
          equipment: "cable",
          target: "triceps",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "arms_3",
          name: "Curl martillo",
          bodyPart: "upper arms",
          equipment: "dumbbell",
          target: "biceps",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "arms_4",
          name: "Press francés",
          bodyPart: "upper arms",
          equipment: "barbell",
          target: "triceps",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "arms_5",
          name: "Curl concentrado",
          bodyPart: "upper arms",
          equipment: "dumbbell",
          target: "biceps",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "arms_6",
          name: "Fondos en banco",
          bodyPart: "upper arms",
          equipment: "body weight",
          target: "triceps",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      "lower arms": [
        {
          id: "lowerarms_1",
          name: "Curl de muñeca",
          bodyPart: "lower arms",
          equipment: "barbell",
          target: "forearms",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "lowerarms_2",
          name: "Extensión de muñeca",
          bodyPart: "lower arms",
          equipment: "dumbbell",
          target: "forearms",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "lowerarms_3",
          name: "Curl de muñeca inverso",
          bodyPart: "lower arms",
          equipment: "barbell",
          target: "forearms",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "lowerarms_4",
          name: "Agarre con pinza",
          bodyPart: "lower arms",
          equipment: "other",
          target: "forearms",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      "upper legs": [
        {
          id: "upperlegs_1",
          name: "Sentadillas",
          bodyPart: "upper legs",
          equipment: "barbell",
          target: "quads",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "upperlegs_2",
          name: "Peso muerto rumano",
          bodyPart: "upper legs",
          equipment: "barbell",
          target: "hamstrings",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "upperlegs_3",
          name: "Extensiones de cuádriceps",
          bodyPart: "upper legs",
          equipment: "machine",
          target: "quads",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "upperlegs_4",
          name: "Curl femoral",
          bodyPart: "upper legs",
          equipment: "machine",
          target: "hamstrings",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "upperlegs_5",
          name: "Prensa de piernas",
          bodyPart: "upper legs",
          equipment: "machine",
          target: "quads",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "upperlegs_6",
          name: "Zancadas",
          bodyPart: "upper legs",
          equipment: "body weight",
          target: "quads",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      "lower legs": [
        {
          id: "lowerlegs_1",
          name: "Elevaciones de talones de pie",
          bodyPart: "lower legs",
          equipment: "machine",
          target: "calves",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "lowerlegs_2",
          name: "Elevaciones de talones sentado",
          bodyPart: "lower legs",
          equipment: "machine",
          target: "calves",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "lowerlegs_3",
          name: "Elevaciones de talones con mancuerna",
          bodyPart: "lower legs",
          equipment: "dumbbell",
          target: "calves",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "lowerlegs_4",
          name: "Saltos de pantorrilla",
          bodyPart: "lower legs",
          equipment: "body weight",
          target: "calves",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      waist: [
        {
          id: "waist_1",
          name: "Crunches",
          bodyPart: "waist",
          equipment: "body weight",
          target: "abs",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "waist_2",
          name: "Plancha",
          bodyPart: "waist",
          equipment: "body weight",
          target: "abs",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "waist_3",
          name: "Russian twist",
          bodyPart: "waist",
          equipment: "body weight",
          target: "abs",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "waist_4",
          name: "Elevaciones de piernas",
          bodyPart: "waist",
          equipment: "body weight",
          target: "lower abs",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "waist_5",
          name: "Mountain climbers",
          bodyPart: "waist",
          equipment: "body weight",
          target: "abs",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "waist_6",
          name: "Rueda abdominal",
          bodyPart: "waist",
          equipment: "ab wheel",
          target: "abs",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      cardio: [
        {
          id: "cardio_1",
          name: "Correr",
          bodyPart: "cardio",
          equipment: "body weight",
          target: "cardiovascular system",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "cardio_2",
          name: "Saltar la cuerda",
          bodyPart: "cardio",
          equipment: "rope",
          target: "cardiovascular system",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
        {
          id: "cardio_3",
          name: "Burpees",
          bodyPart: "cardio",
          equipment: "body weight",
          target: "cardiovascular system",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
        {
          id: "cardio_4",
          name: "Jumping jacks",
          bodyPart: "cardio",
          equipment: "body weight",
          target: "cardiovascular system",
          gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        },
      ],
      neck: [
        {
          id: "neck_1",
          name: "Flexiones de cuello",
          bodyPart: "neck",
          equipment: "body weight",
          target: "neck",
          gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        },
        {
          id: "neck_2",
          name: "Extensiones de cuello",
          bodyPart: "neck",
          equipment: "body weight",
          target: "neck",
          gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        },
      ],
    };

    // Devolver ejercicios para el grupo muscular específico o un array vacío si no hay datos
    return fallbackExercises[bodyPart] || [];
  }

  const generateRoutine = useCallback(async (userPreferences) => {
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Validar que userPreferences exista y tenga las propiedades necesarias
      if (!userPreferences || !userPreferences.focusAreas || !Array.isArray(userPreferences.focusAreas)) {
        throw new Error("Invalid user preferences")
      }

      // Simular progreso
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 0.1, 0.9))
      }, 200)

      // 1. Mapear focusAreas a bodyParts
      const bodyPartMap = {
        full_body: "full_body", // Caso especial que manejaremos
        back: "back",
        cardio: "cardio",
        chest: "chest",
        "lower arms": "lower arms",
        "lower legs": "lower legs",
        neck: "neck",
        shoulders: "shoulders",
        "upper arms": "upper arms",
        "upper legs": "upper legs",
        waist: "waist",
      }

      // 2. Obtener ejercicios
      const allExercises = []
      const exercisesByMuscle = {}
      
      if (userPreferences && userPreferences.focusAreas) {
        const focusAreas = Array.isArray(userPreferences.focusAreas)
          ? userPreferences.focusAreas
          : [userPreferences.focusAreas].filter(Boolean)

        // Crear un mapa para evitar duplicados
        const fetchedExercises = new Map()

        // Modificar la parte donde se obtienen los ejercicios para manejar el caso de "full_body"
        for (let i = 0; i < focusAreas.length; i++) {
          const focus = focusAreas[i]
          if (!focus) continue

          try {
            // Caso especial para full_body
            if (focus === "full_body") {
              // Para full_body, obtener ejercicios de varias áreas
              const bodyParts = ["back", "chest", "shoulders", "upper arms", "upper legs", "waist"]
              for (const bodyPart of bodyParts) {
                const exercises = await getExercises(bodyPart)
                if (Array.isArray(exercises) && exercises.length > 0) {
                  // Guardar ejercicios por grupo muscular
                  if (!exercisesByMuscle[bodyPart]) {
                    exercisesByMuscle[bodyPart] = []
                  }
                  exercisesByMuscle[bodyPart] = [...exercisesByMuscle[bodyPart], ...exercises]
                  
                  exercises.forEach((exercise) => {
                    if (exercise && exercise.id && !fetchedExercises.has(exercise.id)) {
                      fetchedExercises.set(exercise.id, exercise)
                    }
                  })
                }
              }
              console.log(`Added exercises for full body training`)
            } else {
              // Para otras áreas, comportamiento normal
              const bodyPart = bodyPartMap[focus]
              if (!bodyPart) {
                console.warn(`No mapping found for focus: ${focus}`)
                continue
              }

              console.log(`Fetching exercises for focus: ${focus}, bodyPart: ${bodyPart}`)
              const exercises = await getExercises(bodyPart)

              if (Array.isArray(exercises) && exercises.length > 0) {
                // Guardar ejercicios por grupo muscular
                if (!exercisesByMuscle[bodyPart]) {
                  exercisesByMuscle[bodyPart] = []
                }
                exercisesByMuscle[bodyPart] = [...exercisesByMuscle[bodyPart], ...exercises]
                
                exercises.forEach((exercise) => {
                  if (exercise && exercise.id && !fetchedExercises.has(exercise.id)) {
                    fetchedExercises.set(exercise.id, exercise)
                  }
                })
                console.log(`Added ${exercises.length} exercises for ${focus}`)
              } else {
                console.warn(`No exercises found for ${focus}, using fallback`)
                // Si no hay ejercicios, usar datos de respaldo específicos para este enfoque
                const fallbackExercises = getExercisesFallback(bodyPart)
                
                // Guardar ejercicios por grupo muscular
                if (!exercisesByMuscle[bodyPart]) {
                  exercisesByMuscle[bodyPart] = []
                }
                exercisesByMuscle[bodyPart] = [...exercisesByMuscle[bodyPart], ...fallbackExercises]

                fallbackExercises.forEach((exercise) => {
                  if (!fetchedExercises.has(exercise.id)) {
                    fetchedExercises.set(exercise.id, exercise)
                  }
                })
              }
            }
          } catch (error) {
            console.error(`Error fetching exercises for ${focus}:`, error)
            // Continuar con el siguiente enfoque en caso de error
          }

          setProgress((prev) => prev + 0.1)
        }

        // Convertir el mapa a array
        allExercises.push(...fetchedExercises.values())
        console.log(`Total unique exercises fetched: ${allExercises.length}`)

        // Si no se obtuvieron ejercicios, usar datos de respaldo
        if (allExercises.length === 0) {
          console.warn("No exercises fetched from API, using complete fallback data")
          for (const bodyPart of Object.keys(bodyPartMap)) {
            const fallbackExercises = getExercisesFallback(bodyPart)
            if (fallbackExercises.length > 0) {
              // Guardar ejercicios por grupo muscular
              if (!exercisesByMuscle[bodyPart]) {
                exercisesByMuscle[bodyPart] = []
              }
              exercisesByMuscle[bodyPart] = [...exercisesByMuscle[bodyPart], ...fallbackExercises]
              
              allExercises.push(...fallbackExercises)
            }
          }
        }
      }

      // 3. Filtrar por equipamiento
      const filteredExercisesByMuscle = { ...exercisesByMuscle }
      
      if (
        userPreferences &&
        userPreferences.equipment &&
        Array.isArray(userPreferences.equipment) &&
        userPreferences.equipment.filter(Boolean).length > 0
      ) {
        const validEquipment = userPreferences.equipment.filter(Boolean)
        if (validEquipment.length > 0) {
          // Filtrar ejercicios por equipamiento para cada grupo muscular
          for (const muscle in exercisesByMuscle) {
            const muscleExercises = exercisesByMuscle[muscle]
            const filtered = muscleExercises.filter(ex => {
              if (!ex.equipment) return true;
              return validEquipment.some(e => 
                ex.equipment.toLowerCase().includes(e.toLowerCase())
              );
            });
            
            // Si después de filtrar quedan muy pocos ejercicios, mantener los originales
            filteredExercisesByMuscle[muscle] = filtered.length >= 3 ? filtered : muscleExercises;
          }
        }
      }

      // 4. Generar estructura
      const routine = {
        weekly_schedule: {},
        recommendations: [`Descansa 48h entre entrenamientos del mismo grupo muscular`, `Bebe agua durante los descansos`, `Realiza 5-10 minutos de calentamiento antes de cada sesión`],
      }

      // 5. Distribuir por días
      const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      
      if (userPreferences && userPreferences.workoutDays) {
        const workoutDays = Array.isArray(userPreferences.workoutDays)
          ? userPreferences.workoutDays
          : [userPreferences.workoutDays].filter(Boolean)

        // Determinar cuántos músculos trabajar por día
        const maxMusclesPerDay = userPreferences.maxMusclesPerDay || 3
        const exercisesPerMuscle = userPreferences.exercisesPerMuscle || 4

        // Distribuir los músculos seleccionados entre los días disponibles
        let muscleGroups = [...userPreferences.focusAreas]

        // Si es una rutina predefinida, usar una distribución específica según el tipo
        if (userPreferences.routineType && userPreferences.routineType !== "custom") {
          switch (userPreferences.routineType) {
            case "ppl": // Push Pull Legs
              muscleGroups = ["chest", "shoulders", "upper arms", "back", "upper legs", "lower legs"]
              break
            case "fullbody": // Full Body
              muscleGroups = ["chest", "back", "shoulders", "upper arms", "upper legs", "waist"]
              break
            case "upperlower": // Upper/Lower
              muscleGroups = ["chest", "back", "shoulders", "upper arms", "upper legs", "lower legs"]
              break
            case "brosplit": // Bro Split
              muscleGroups = ["chest", "back", "shoulders", "upper arms", "upper legs", "waist"]
              break
          }
        }

        // Asegurarse de que hay suficientes músculos para distribuir
        while (muscleGroups.length < workoutDays.length * maxMusclesPerDay) {
          muscleGroups = [...muscleGroups, ...muscleGroups]
        }

        // Crear la distribución de músculos por día
        const muscleDistribution = []
        for (let i = 0; i < workoutDays.length; i++) {
          const startIdx = i * maxMusclesPerDay
          const dayMuscles = muscleGroups.slice(startIdx, startIdx + maxMusclesPerDay)
          muscleDistribution.push(dayMuscles)
        }

        // Crear la rutina para cada día
        for (let index = 0; index < workoutDays.length; index++) {
          const day = workoutDays[index]
          if (!day) continue

          const dayKey = `day_${index + 1}`
          const dayMuscles = muscleDistribution[index]

          // Seleccionar ejercicios para este día
          let exercisesForDay = []

          // Distribuir según el tipo de rutina
          if (userPreferences.routineType === "fullbody") {
            // Para full body, seleccionar 2 ejercicios de cada grupo principal
            const mainGroups = ["chest", "back", "upper legs", "shoulders", "upper arms", "waist"]
            for (const group of mainGroups) {
              if (filteredExercisesByMuscle[group] && filteredExercisesByMuscle[group].length > 0) {
                // Mezclar los ejercicios para obtener variedad
                const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[group]])
                const groupExercises = shuffledExercises.slice(0, 2)
                exercisesForDay = [...exercisesForDay, ...groupExercises]
              }
            }
          } else if (userPreferences.routineType === "ppl") {
            // Push Pull Legs
            if (index % 3 === 0) {
              // Push day
              const pushMuscles = ["chest", "shoulders", "upper arms"]
              for (const muscle of pushMuscles) {
                if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                  // Mezclar los ejercicios para obtener variedad
                  const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[muscle]])
                  const muscleExercises = shuffledExercises.slice(0, exercisesPerMuscle)
                  exercisesForDay = [...exercisesForDay, ...muscleExercises]
                }
              }
            } else if (index % 3 === 1) {
              // Pull day
              const pullMuscles = ["back", "lower arms"]
              for (const muscle of pullMuscles) {
                if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                  // Mezclar los ejercicios para obtener variedad
                  const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[muscle]])
                  const muscleExercises = shuffledExercises.slice(0, exercisesPerMuscle)
                  exercisesForDay = [...exercisesForDay, ...muscleExercises]
                }
              }
            } else {
              // Legs day
              const legMuscles = ["upper legs", "lower legs"]
              for (const muscle of legMuscles) {
                if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                  // Mezclar los ejercicios para obtener variedad
                  const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[muscle]])
                  const muscleExercises = shuffledExercises.slice(0, exercisesPerMuscle)
                  exercisesForDay = [...exercisesForDay, ...muscleExercises]
                }
              }
            }
          } else if (userPreferences.routineType === "upperlower") {
            // Upper/Lower
            if (index % 2 === 0) {
              // Upper day
              const upperMuscles = ["chest", "back", "shoulders", "upper arms"]
              for (const muscle of upperMuscles) {
                if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                  // Mezclar los ejercicios para obtener variedad
                  const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[muscle]])
                  const muscleExercises = shuffledExercises.slice(0, 3)
                  exercisesForDay = [...exercisesForDay, ...muscleExercises]
                }
              }
            } else {
              // Lower day
              const lowerMuscles = ["upper legs", "lower legs", "waist"]
              for (const muscle of lowerMuscles) {
                if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                  // Mezclar los ejercicios para obtener variedad
                  const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[muscle]])
                  const muscleExercises = shuffledExercises.slice(0, 4)
                  exercisesForDay = [...exercisesForDay, ...muscleExercises]
                }
              }
            }
          } else if (userPreferences.routineType === "brosplit") {
            // Bro Split - un grupo muscular principal por día
            const broSplitOrder = ["chest", "back", "shoulders", "upper arms", "upper legs", "waist"]
            const muscleIndex = index % broSplitOrder.length
            const mainMuscle = broSplitOrder[muscleIndex]

            if (filteredExercisesByMuscle[mainMuscle] && filteredExercisesByMuscle[mainMuscle].length > 0) {
              // Mezclar los ejercicios para obtener variedad
              const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[mainMuscle]])
              // 6-8 ejercicios para el músculo principal
              const mainExercises = shuffledExercises.slice(0, 6)
              exercisesForDay = [...exercisesForDay, ...mainExercises]
            }

            // 2-3 ejercicios para un músculo secundario complementario
            const secondaryMuscles = {
              chest: "shoulders",
              back: "lower arms",
              shoulders: "upper arms",
              "upper arms": "chest",
              "upper legs": "lower legs",
              waist: "upper legs",
            }

            const secondaryMuscle = secondaryMuscles[mainMuscle]
            if (secondaryMuscle && filteredExercisesByMuscle[secondaryMuscle] && filteredExercisesByMuscle[secondaryMuscle].length > 0) {
              // Mezclar los ejercicios para obtener variedad
              const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[secondaryMuscle]])
              const secondaryExercises = shuffledExercises.slice(0, 2)
              exercisesForDay = [...exercisesForDay, ...secondaryExercises]
            }
          } else {
            // Rutina personalizada - usar los músculos asignados para este día
            for (const muscle of dayMuscles) {
              if (!muscle) continue

              if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                // Mezclar los ejercicios para obtener variedad
                const shuffledExercises = shuffleArray([...filteredExercisesByMuscle[muscle]])
                // Obtener ejercicios para este músculo (3-4 por músculo)
                const muscleExercises = shuffledExercises.slice(0, exercisesPerMuscle)
                exercisesForDay = [...exercisesForDay, ...muscleExercises]
              }
            }
          }

          // Asegurarse de que hay al menos 6 ejercicios en total
          if (exercisesForDay.length < 6) {
            // Añadir más ejercicios de los músculos seleccionados
            for (const muscle of dayMuscles) {
              if (exercisesForDay.length >= 6) break

              if (filteredExercisesByMuscle[muscle] && filteredExercisesByMuscle[muscle].length > 0) {
                const additionalExercises = filteredExercisesByMuscle[muscle]
                  .filter(ex => !exercisesForDay.some(e => e.id === ex.id))
                  .slice(0, 6 - exercisesForDay.length)

                exercisesForDay = [...exercisesForDay, ...additionalExercises]
              }
            }
          }

          // Limitar a un máximo razonable de ejercicios por día (12-15)
          exercisesForDay = exercisesForDay.slice(0, 15)

          // Añadir información de sets, reps, etc.
          exercisesForDay = exercisesForDay.map((ex) => ({
            ...ex,
            sets: userPreferences.fitnessLevel === "beginner" ? 3 : 4,
            reps: getRepsByLevel(userPreferences.fitnessLevel),
            rest: "60s",
          }))

          // Determinar el enfoque principal del día
          let dayFocus = dayMuscles[0] || "full_body"

          // Para rutinas predefinidas, usar nombres específicos
          if (userPreferences.routineType === "ppl") {
            if (index % 3 === 0) dayFocus = "push"
            else if (index % 3 === 1) dayFocus = "pull"
            else dayFocus = "legs"
          } else if (userPreferences.routineType === "upperlower") {
            dayFocus = index % 2 === 0 ? "upper_body" : "lower_body"
          } else if (userPreferences.routineType === "fullbody") {
            dayFocus = "full_body"
          } else if (userPreferences.routineType === "brosplit") {
            const broSplitOrder = ["chest", "back", "shoulders", "arms", "legs", "core"]
            dayFocus = broSplitOrder[index % broSplitOrder.length]
          }

          routine.weekly_schedule[dayKey] = {
            day_name: capitalizeFirstLetter(day),
            focus: dayFocus,
            exercises: exercisesForDay,
          }
        }
      }

      clearInterval(interval)
      setProgress(1)
      return routine
    } catch (err) {
      console.error("Error generating routine:", err)
      setError(err.message || "Error generating routine")
      // Devolver una rutina vacía pero válida en caso de error
      return {
        weekly_schedule: {},
        recommendations: ["No se pudo generar la rutina. Intenta de nuevo."],
      }
    } finally {
      setLoading(false)
    }
  }, [exercises])

  const getRepsByLevel = (level) => {
    const repsMap = {
      beginner: "10-12",
      intermediate: "8-10",
      advanced: "6-8",
    }
    return repsMap[level] || "8-12"
  }

  const capitalizeFirstLetter = (string) => {
    if (typeof string !== "string" || !string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return {
    generateRoutine,
    loading,
    error,
    progress,
    resetError: () => setError(null),
  }
}