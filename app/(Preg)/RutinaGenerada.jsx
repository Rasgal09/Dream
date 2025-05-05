"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Share,
} from "react-native"
import { useLocalSearchParams, router } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window")

// Colores de la app
const COLORS = {
  background: "#1A1A1A",
  card: "#252525",
  cardLight: "#2A2A2A",
  border: "#333",
  text: "#FFF",
  textSecondary: "#999",
  primary: "#00D078",
  secondary: "#007DF0",
  danger: "#FF3B30",
  warning: "#FFCC00",
  success: "#34C759",
  overlay: "rgba(0,0,0,0.7)",
  gradient: {
    start: "#00D078",
    end: "#007DF0",
  },
}

const RutinaGenerada = () => {
  const insets = useSafeAreaInsets()
  const { routine } = useLocalSearchParams()
  const [isSaving, setIsSaving] = useState(false)
  const [activeDay, setActiveDay] = useState(0)
  const [completedExercises, setCompletedExercises] = useState({})
  const [showInfo, setShowInfo] = useState(false)
  const [expandedExercise, setExpandedExercise] = useState(null)

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Añadir manejo de errores para el parsing de JSON
  let parsedRoutine
  try {
    parsedRoutine = routine ? JSON.parse(routine) : null
  } catch (error) {
    console.error("Error parsing routine data:", error)
    parsedRoutine = null
  }

  // Obtener los días de la semana de la rutina
  const weekDays = parsedRoutine && parsedRoutine.weekly_schedule ? Object.keys(parsedRoutine.weekly_schedule) : []

  // Marcar ejercicio como completado
  const toggleExerciseCompletion = (dayKey, exerciseIndex) => {
    const key = `${dayKey}-${exerciseIndex}`
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Compartir rutina
  const shareRoutine = async () => {
    try {
      if (!parsedRoutine) return

      let message = "🏋️ Mi rutina personalizada de entrenamiento 💪\n\n"

      Object.entries(parsedRoutine.weekly_schedule).forEach(([dayKey, dayData]) => {
        message += `📅 ${dayData.day_name} - ${dayData.focus.replace("_", " ")}\n`

        if (dayData.exercises && Array.isArray(dayData.exercises)) {
          dayData.exercises.forEach((exercise, index) => {
            if (exercise) {
              message += `  • ${exercise.name}: ${exercise.sets} sets × ${exercise.reps}\n`
            }
          })
        }
        message += "\n"
      })

      if (parsedRoutine.recommendations && parsedRoutine.recommendations.length > 0) {
        message += "💡 Recomendaciones:\n"
        parsedRoutine.recommendations.forEach((rec) => {
          message += `  • ${rec}\n`
        })
      }

      message += "\nGenerado con Fitness App 🔥"

      await Share.share({
        message,
        title: "Mi rutina personalizada",
      })
    } catch (error) {
      console.error("Error al compartir:", error)
      Alert.alert("Error", "No se pudo compartir la rutina")
    }
  }

  // Calcular progreso de la rutina
  const calculateProgress = () => {
    if (!parsedRoutine || !parsedRoutine.weekly_schedule) return 0

    let totalExercises = 0
    let completedCount = 0

    Object.entries(parsedRoutine.weekly_schedule).forEach(([dayKey, dayData]) => {
      if (dayData.exercises && Array.isArray(dayData.exercises)) {
        dayData.exercises.forEach((exercise, index) => {
          if (exercise) {
            totalExercises++
            if (completedExercises[`${dayKey}-${index}`]) {
              completedCount++
            }
          }
        })
      }
    })

    return totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0
  }

  const handleSaveRoutine = async () => {
    try {
      setIsSaving(true);
      
      // Obtener el ID del usuario desde AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error("Usuario no autenticado");
      }
  
      // Validar que tenemos la rutina
      if (!parsedRoutine) {
        throw new Error("No hay datos de rutina para guardar");
      }
  
      // Enviar al backend
      const response = await axios.post('http://192.168.1.126:3000/api/routines/create', {
        userId,
        routineData: {
          ...parsedRoutine,
          name: parsedRoutine.name || "Mi Rutina Personalizada", // Nombre por defecto
          progress: calculateProgress() // Opcional: guardar progreso actual
        }
      });
  
      // Navegar a la pantalla de rutinas guardadas
      Alert.alert("Éxito", "Rutina guardada exitosamente", [
        { text: "OK", onPress: () => router.push('/mis-rutinas') }
      ]);
  
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", error.response?.data?.error || error.message || "Error desconocido");
    } finally {
      setIsSaving(false);
    }
  };

  const progress = calculateProgress()

  // Mostrar pantalla de error si no hay datos
  if (!parsedRoutine) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, justifyContent: "center", alignItems: "center" }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color={COLORS.danger} />
        <Text style={[styles.title, { marginTop: 20, marginBottom: 20, textAlign: "center" }]}>
          No se pudo cargar la rutina
        </Text>
        <Text style={[styles.subtitle, { marginBottom: 30, textAlign: "center" }]}>
          Ha ocurrido un error al procesar los datos de tu rutina
        </Text>
        <Pressable style={styles.actionButton} onPress={() => router.back()}>
          <LinearGradient
            colors={[COLORS.gradient.start, COLORS.gradient.end]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.actionButtonText}>VOLVER</Text>
          </LinearGradient>
        </Pressable>
      </View>
    )
  }

  // Renderizar la información del ejercicio expandido
  const renderExerciseInfo = () => {
    if (!expandedExercise) return null

    const { dayKey, exercise } = expandedExercise
    const dayData = parsedRoutine.weekly_schedule[dayKey]

    return (
      <Pressable style={styles.exerciseInfoOverlay} onPress={() => setExpandedExercise(null)}>
        <Pressable style={styles.exerciseInfoCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.exerciseInfoHeader}>
            <Text style={styles.exerciseInfoTitle}>{exercise.name}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setExpandedExercise(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          {exercise.gifUrl && (
            <View style={styles.exerciseImageContainer}>
              <Image source={{ uri: exercise.gifUrl }} style={styles.exerciseInfoImage} resizeMode="contain" />
            </View>
          )}

          <View style={styles.exerciseInfoDetails}>
            <View style={styles.exerciseInfoRow}>
              <MaterialCommunityIcons name="dumbbell" size={20} color={COLORS.primary} />
              <Text style={styles.exerciseInfoText}>
                <Text style={styles.exerciseInfoLabel}>Series: </Text>
                {exercise.sets || "3"} sets × {exercise.reps || "10"} repeticiones
              </Text>
            </View>

            <View style={styles.exerciseInfoRow}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.primary} />
              <Text style={styles.exerciseInfoText}>
                <Text style={styles.exerciseInfoLabel}>Descanso: </Text>
                {exercise.rest || "60s"} entre series
              </Text>
            </View>

            <View style={styles.exerciseInfoRow}>
              <MaterialCommunityIcons name="weight" size={20} color={COLORS.primary} />
              <Text style={styles.exerciseInfoText}>
                <Text style={styles.exerciseInfoLabel}>Equipo: </Text>
                {exercise.equipment || "Peso corporal"}
              </Text>
            </View>

            <View style={styles.exerciseInfoRow}>
              <MaterialCommunityIcons name="target" size={20} color={COLORS.primary} />
              <Text style={styles.exerciseInfoText}>
                <Text style={styles.exerciseInfoLabel}>Músculo objetivo: </Text>
                {exercise.target || "No especificado"}
              </Text>
            </View>
          </View>

          <View style={styles.exerciseInfoTips}>
            <Text style={styles.exerciseInfoTipsTitle}>Consejos de ejecución:</Text>
            <Text style={styles.exerciseInfoTipsText}>
              • Mantén una postura correcta durante todo el movimiento{"\n"}• Controla el movimiento tanto en la fase
              concéntrica como excéntrica{"\n"}• Respira adecuadamente: exhala en el esfuerzo, inhala en el retorno
            </Text>
          </View>

          <Pressable
            style={styles.exerciseInfoButton}
            onPress={() => {
              setExpandedExercise(null)
              // Aquí podrías añadir lógica para marcar el ejercicio como completado
            }}
          >
            <LinearGradient
              colors={[COLORS.gradient.start, COLORS.gradient.end]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.exerciseInfoButtonText}>ENTENDIDO</Text>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>
    )
  }

  // Renderizar la información de la rutina
  const renderRoutineInfo = () => {
    if (!showInfo) return null

    return (
      <Pressable style={styles.exerciseInfoOverlay} onPress={() => setShowInfo(false)}>
        <Pressable style={styles.exerciseInfoCard} onPress={(e) => e.stopPropagation()}>
          <View style={styles.exerciseInfoHeader}>
            <Text style={styles.exerciseInfoTitle}>Información de la Rutina</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowInfo(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          <View style={styles.routineInfoContent}>
            <Text style={styles.routineInfoText}>
              Esta rutina ha sido generada específicamente para ti basada en tus preferencias y objetivos.
            </Text>

            <View style={styles.routineInfoSection}>
              <Text style={styles.routineInfoSectionTitle}>Estructura de la rutina:</Text>
              <Text style={styles.routineInfoText}>
                • {weekDays.length} días de entrenamiento por semana{"\n"}• Enfoque en diferentes grupos musculares
                {"\n"}• Ejercicios seleccionados según tu nivel y equipamiento
              </Text>
            </View>

            <View style={styles.routineInfoSection}>
              <Text style={styles.routineInfoSectionTitle}>Cómo seguir esta rutina:</Text>
              <Text style={styles.routineInfoText}>
                1. Sigue el orden de los ejercicios tal como aparecen{"\n"}
                2. Completa todas las series y repeticiones indicadas{"\n"}
                3. Respeta los tiempos de descanso entre series{"\n"}
                4. Marca los ejercicios como completados al terminarlos{"\n"}
                5. Sigue las recomendaciones específicas
              </Text>
            </View>

            <View style={styles.routineInfoSection}>
              <Text style={styles.routineInfoSectionTitle}>Progresión:</Text>
              <Text style={styles.routineInfoText}>
                Para seguir progresando, aumenta gradualmente el peso o la dificultad de los ejercicios cuando puedas
                completar todas las series y repeticiones con buena técnica.
              </Text>
            </View>
          </View>

          <Pressable style={styles.exerciseInfoButton} onPress={() => setShowInfo(false)}>
            <LinearGradient
              colors={[COLORS.gradient.start, COLORS.gradient.end]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.exerciseInfoButtonText}>ENTENDIDO</Text>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
          </Pressable>
          <Text style={styles.title}>Tu Rutina Personalizada</Text>
          <Pressable onPress={shareRoutine} style={styles.shareButton}>
            <MaterialCommunityIcons name="share-variant" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>Progreso</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <Pressable onPress={() => setShowInfo(true)} style={styles.infoButton}>
          <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.infoButtonText}>Ver información de la rutina</Text>
        </Pressable>
      </Animated.View>

      {/* Tabs de días */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daysTabsContainer}
        contentContainerStyle={styles.daysTabsContent}
      >
        {weekDays.map((dayKey, index) => {
          const dayData = parsedRoutine.weekly_schedule[dayKey]
          if (!dayData) return null

          // Calcular ejercicios completados para este día
          const dayExercises = dayData.exercises ? dayData.exercises.filter(Boolean).length : 0
          const completedCount = dayData.exercises
            ? dayData.exercises.filter((_, i) => completedExercises[`${dayKey}-${i}`]).length
            : 0

          return (
            <Pressable
              key={dayKey}
              style={[styles.dayTab, activeDay === index && styles.dayTabActive]}
              onPress={() => setActiveDay(index)}
            >
              <Text style={[styles.dayTabText, activeDay === index && styles.dayTabTextActive]}>
                {dayData.day_name.substring(0, 3)}
              </Text>
              {dayExercises > 0 && (
                <View style={styles.dayTabProgress}>
                  <View style={[styles.dayTabProgressFill, { width: `${(completedCount / dayExercises) * 100}%` }]} />
                </View>
              )}
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Contenido principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {weekDays.length > 0 && weekDays[activeDay] && (
          <Animated.View
            style={[
              styles.dayContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {(() => {
              const dayKey = weekDays[activeDay]
              const dayData = parsedRoutine.weekly_schedule[dayKey]

              if (!dayData) return null

              return (
                <>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayHeaderLeft}>
                      <Text style={styles.dayTitle}>{dayData.day_name}</Text>
                      <View style={styles.dayFocusContainer}>
                        <MaterialCommunityIcons
                          name="target"
                          size={16}
                          color={COLORS.primary}
                          style={styles.dayFocusIcon}
                        />
                        <Text style={styles.dayFocus}>{(dayData.focus || "").replace("_", " ")}</Text>
                      </View>
                    </View>

                    <View style={styles.dayHeaderRight}>
                      <View style={styles.exerciseCountContainer}>
                        <Text style={styles.exerciseCount}>
                          {dayData.exercises ? dayData.exercises.filter(Boolean).length : 0} ejercicios
                        </Text>
                      </View>
                    </View>
                  </View>

                  {dayData && dayData.exercises && dayData.exercises.filter(Boolean).length > 0 ? (
                    dayData.exercises.map((exercise, index) => {
                      if (!exercise) return null

                      const isCompleted = completedExercises[`${dayKey}-${index}`]

                      return (
                        <Pressable
                          key={`${dayKey}-${index}`}
                          style={[styles.exerciseCard, isCompleted && styles.exerciseCardCompleted]}
                          onPress={() => setExpandedExercise({ dayKey, exercise })}
                        >
                          <View style={styles.exerciseCardContent}>
                            {exercise.gifUrl && (
                              <Image
                                source={{ uri: exercise.gifUrl }}
                                style={styles.exerciseImage}
                                resizeMode="cover"
                              />
                            )}

                            <View style={styles.exerciseInfo}>
                              <Text
                                style={[styles.exerciseName, isCompleted && styles.exerciseNameCompleted]}
                                numberOfLines={2}
                              >
                                {exercise.name || "Ejercicio sin nombre"}
                              </Text>

                              <View style={styles.exerciseDetailsRow}>
                                <MaterialCommunityIcons
                                  name="repeat"
                                  size={16}
                                  color={isCompleted ? COLORS.textSecondary : COLORS.primary}
                                />
                                <Text style={[styles.exerciseDetails, isCompleted && styles.exerciseDetailsCompleted]}>
                                  {exercise.sets || "3"} × {exercise.reps || "10"}
                                </Text>
                              </View>

                              <View style={styles.exerciseDetailsRow}>
                                <MaterialCommunityIcons
                                  name="clock-outline"
                                  size={16}
                                  color={isCompleted ? COLORS.textSecondary : COLORS.primary}
                                />
                                <Text style={[styles.exerciseDetails, isCompleted && styles.exerciseDetailsCompleted]}>
                                  {exercise.rest || "60s"} descanso
                                </Text>
                              </View>

                              <View style={styles.exerciseDetailsRow}>
                                <MaterialCommunityIcons
                                  name="weight"
                                  size={16}
                                  color={isCompleted ? COLORS.textSecondary : COLORS.primary}
                                />
                                <Text style={[styles.exerciseDetails, isCompleted && styles.exerciseDetailsCompleted]}>
                                  {exercise.equipment || "Peso corporal"}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View style={styles.exerciseCardActions}>
                            <Pressable
                              style={[styles.exerciseActionButton, isCompleted && styles.exerciseActionButtonCompleted]}
                              onPress={(e) => {
                                e.stopPropagation()
                                toggleExerciseCompletion(dayKey, index)
                              }}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <MaterialCommunityIcons
                                name={isCompleted ? "check-circle" : "circle-outline"}
                                size={24}
                                color={isCompleted ? COLORS.success : COLORS.text}
                              />
                            </Pressable>

                            <Pressable
                              style={styles.exerciseActionButton}
                              onPress={(e) => {
                                e.stopPropagation()
                                setExpandedExercise({ dayKey, exercise })
                              }}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <MaterialCommunityIcons name="information-outline" size={24} color={COLORS.text} />
                            </Pressable>
                          </View>
                        </Pressable>
                      )
                    })
                  ) : (
                    <View style={styles.noExercisesContainer}>
                      <MaterialCommunityIcons name="dumbbell" size={48} color={COLORS.textSecondary} />
                      <Text style={styles.noExercisesText}>No hay ejercicios para este día</Text>
                    </View>
                  )}
                </>
              )
            })()}
          </Animated.View>
        )}

        {/* Recomendaciones */}
        {parsedRoutine.recommendations && parsedRoutine.recommendations.filter(Boolean).length > 0 && (
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationsHeader}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color={COLORS.warning} />
              <Text style={styles.recommendationsTitle}>Recomendaciones</Text>
            </View>

            {parsedRoutine.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color={COLORS.primary}
                  style={styles.recommendationIcon}
                />
                <Text style={styles.recommendation}>{rec}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Espacio para el botón flotante */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón flotante para guardar */}
      <View style={styles.floatingButtonContainer}>
        <Pressable
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveRoutine}
          disabled={isSaving}
        >
          <LinearGradient
            colors={[COLORS.gradient.start, COLORS.gradient.end]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save"
                  size={20}
                  color={COLORS.text}
                  style={styles.saveButtonIcon}
                />
                <Text style={styles.saveButtonText}>GUARDAR RUTINA</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>

      {/* Modal de información de ejercicio */}
      {expandedExercise && renderExerciseInfo()}

      {/* Modal de información de rutina */}
      {showInfo && renderRoutineInfo()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  progressPercentage: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  infoButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  daysTabsContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  daysTabsContent: {
    paddingHorizontal: 8,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  dayTabActive: {
    borderBottomColor: COLORS.primary,
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
  },
  dayTabTextActive: {
    color: COLORS.text,
  },
  dayTabProgress: {
    width: "100%",
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 1.5,
    marginTop: 4,
    overflow: "hidden",
  },
  dayTabProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 1.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayContent: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dayHeaderLeft: {
    flex: 1,
  },
  dayHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  dayFocusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayFocusIcon: {
    marginRight: 4,
  },
  dayFocus: {
    fontSize: 14,
    color: COLORS.primary,
    textTransform: "capitalize",
  },
  exerciseCountContainer: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  exerciseCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  exerciseCardCompleted: {
    borderLeftColor: COLORS.success,
    opacity: 0.8,
  },
  exerciseCardContent: {
    flexDirection: "row",
    padding: 12,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.cardLight,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  exerciseNameCompleted: {
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
  },
  exerciseDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
  },
  exerciseDetailsCompleted: {
    color: COLORS.textSecondary,
  },
  exerciseCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  exerciseActionButton: {
    padding: 4,
  },
  exerciseActionButtonCompleted: {
    backgroundColor: "transparent",
  },
  noExercisesContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noExercisesText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  recommendationsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  recommendationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  recommendation: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  saveButton: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
  },
  actionButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  exerciseInfoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  exerciseInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: "80%",
    padding: 16,
  },
  exerciseInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  exerciseImageContainer: {
    height: 200,
    backgroundColor: COLORS.cardLight,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  exerciseInfoImage: {
    width: "100%",
    height: "100%",
  },
  exerciseInfoDetails: {
    marginBottom: 16,
  },
  exerciseInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseInfoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  exerciseInfoLabel: {
    fontWeight: "bold",
  },
  exerciseInfoTips: {
    backgroundColor: COLORS.cardLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  exerciseInfoTipsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  exerciseInfoTipsText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  exerciseInfoButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  exerciseInfoButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  routineInfoContent: {
    marginBottom: 16,
  },
  routineInfoText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  routineInfoSection: {
    marginBottom: 16,
  },
  routineInfoSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
})

export default RutinaGenerada
