"use client"

import { useState, useCallback } from "react"
import axios from "axios"

const EXERCISEDB_API_KEY = "a6ce31be52msh0865311e56b9f0ep1a9a22jsn79b4d4d83af5"

export const useRoutineAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  // Reemplazar la función getExercises actual con esta versión mejorada
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
        return response.data
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
          return getExercisesFallback()
        }
      } else if (err.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Error fetching exercises: No response received", err.request)
      } else {
        // Error en la configuración de la solicitud
        console.error("Error fetching exercises:", err.message)
      }

      return []
    }
  }

  // Añadir esta nueva función de respaldo para cuando falla la API
  const getExercisesFallback = () => {
    // Datos de ejercicios de respaldo para cuando la API falla
    console.log("Using fallback exercise data")
    return [
      {
        id: "fallback_1",
        name: "Flexiones de pecho",
        bodyPart: "chest",
        equipment: "body weight",
        target: "pectorals",
        gifUrl: "https://api.exercisedb.io/image/6ysIbMaewO8ZJE",
        sets: 3,
        reps: "10-12",
        rest: "60s",
      },
      {
        id: "fallback_2",
        name: "Sentadillas",
        bodyPart: "upper legs",
        equipment: "body weight",
        target: "quads",
        gifUrl: "https://api.exercisedb.io/image/KWBdxaFzJ-U-Uc",
        sets: 3,
        reps: "12-15",
        rest: "60s",
      },
      {
        id: "fallback_3",
        name: "Plancha abdominal",
        bodyPart: "waist",
        equipment: "body weight",
        target: "abs",
        gifUrl: "https://api.exercisedb.io/image/Hy-qXKftPMDDHH",
        sets: 3,
        reps: "30s",
        rest: "45s",
      },
    ]
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
                exercises.forEach((exercise) => {
                  if (exercise && exercise.id && !fetchedExercises.has(exercise.id)) {
                    fetchedExercises.set(exercise.id, exercise)
                  }
                })
                console.log(`Added ${exercises.length} exercises for ${focus}`)
              } else {
                console.warn(`No exercises found for ${focus}, using fallback`)
                // Si no hay ejercicios, usar datos de respaldo específicos para este enfoque
                const fallbackExercises = getExercisesFallback().map((ex) => ({
                  ...ex,
                  id: `${ex.id}_${focus}`, // Asegurar IDs únicos
                  bodyPart: bodyPart || ex.bodyPart,
                }))

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
          allExercises.push(...getExercisesFallback())
        }
      }

      // 3. Filtrar por equipamiento
      let filteredExercises = allExercises
      if (
        userPreferences &&
        userPreferences.equipment &&
        Array.isArray(userPreferences.equipment) &&
        userPreferences.equipment.filter(Boolean).length > 0
      ) {
        const validEquipment = userPreferences.equipment.filter(Boolean)
        if (validEquipment.length > 0) {
          const filtered = []
          for (let i = 0; i < allExercises.length; i++) {
            const ex = allExercises[i]
            let shouldInclude = false
            for (let j = 0; j < validEquipment.length; j++) {
              const e = validEquipment[j]
              if (ex.equipment && ex.equipment.toLowerCase().includes(e.toLowerCase())) {
                shouldInclude = true
                break
              }
            }
            if (shouldInclude) {
              filtered.push(ex)
            }
          }
          if (filtered.length > 0) {
            filteredExercises = filtered
          }
        }
      }

      // 4. Generar estructura
      const routine = {
        weekly_schedule: {},
        recommendations: [`Descansa 48h entre entrenamientos`, `Bebe agua durante los descansos`],
      }

      // Modificar la parte donde se distribuyen los ejercicios por días para manejar el caso de "full_body"
      // 5. Distribuir por días
      if (userPreferences && userPreferences.workoutDays) {
        const workoutDays = Array.isArray(userPreferences.workoutDays)
          ? userPreferences.workoutDays
          : [userPreferences.workoutDays].filter(Boolean)

        for (let index = 0; index < workoutDays.length; index++) {
          const day = workoutDays[index]
          if (!day) continue
          const dayKey = `day_${index + 1}`
          const focusIndex = index % userPreferences.focusAreas.length
          const focus = userPreferences.focusAreas[focusIndex]

          // Filtrar ejercicios para este día
          let exercisesForDay = []

          if (focus === "full_body") {
            // Para full_body, seleccionar ejercicios variados de diferentes grupos musculares
            const muscleGroups = ["back", "chest", "shoulders", "upper arms", "upper legs", "waist"]
            for (const group of muscleGroups) {
              // Obtener 1-2 ejercicios de cada grupo muscular
              const groupExercises = filteredExercises.filter((ex) => ex.bodyPart === group).slice(0, 1)

              exercisesForDay = [...exercisesForDay, ...groupExercises]
            }

            // Limitar a 5 ejercicios en total
            exercisesForDay = exercisesForDay.slice(0, 5)
          } else {
            // Para otras áreas, comportamiento normal
            const bodyPart = bodyPartMap[focus]
            exercisesForDay = filteredExercises.filter((ex) => ex.bodyPart === bodyPart).slice(0, 5)
          }

          // Añadir información de sets, reps, etc.
          exercisesForDay = exercisesForDay.map((ex) => ({
            ...ex,
            sets: userPreferences.fitnessLevel === "beginner" ? 3 : 4,
            reps: getRepsByLevel(userPreferences.fitnessLevel),
            rest: "60s",
          }))

          routine.weekly_schedule[dayKey] = {
            day_name: capitalizeFirstLetter(day),
            focus,
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
  }, [])

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
