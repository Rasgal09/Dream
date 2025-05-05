// hooks/useRoutines.js
import { useState, useEffect } from 'react'
import { fetchUserRoutines, saveRoutineToDB } from '../services/routineService'

export const useRoutines = (userId) => {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRoutines = async () => {
      try {
        const data = await fetchUserRoutines(userId)
        setRoutines(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadRoutines()
  }, [userId])

  const saveRoutine = async (routineData) => {
    try {
      setLoading(true)
      const savedRoutine = await saveRoutineToDB(userId, routineData)
      setRoutines(prev => [...prev, savedRoutine])
      return savedRoutine
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { routines, loading, error, saveRoutine }
}