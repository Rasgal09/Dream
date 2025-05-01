"use client"

import { useState, useRef, useEffect } from "react"
import { StyleSheet, Text, View, Pressable, Dimensions, Animated, TextInput, StatusBar, FlatList } from "react-native"
import { useFonts, SofiaSans_900Black } from "@expo-google-fonts/sofia-sans"
import { Kanit_900Black } from "@expo-google-fonts/kanit"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"

const { width, height } = Dimensions.get("window")

// Colores de la app
const COLORS = {
  background: "#1A1A1A",
  card: "#252525",
  border: "#333",
  text: "#FFF",
  textSecondary: "#999",
  primary: "#00D078",
  secondary: "#007DF0",
  danger: "#FF3B30",
  disabled: "rgba(255, 255, 255, 0.5)",
}

const RutinaGymPersonalizada = () => {
  const insets = useSafeAreaInsets()

  // Fonts loading
  const [fontsLoaded] = useFonts({
    SofiaSans_900Black,
    Kanit_900Black,
  })

  // States
  const [step, setStep] = useState(0)
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([])
  const [selectedTrainingPlace, setSelectedTrainingPlace] = useState(null)
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null)
  const [selectedWorkoutDays, setSelectedWorkoutDays] = useState([])
  const [selectedWorkoutDuration, setSelectedWorkoutDuration] = useState(null)
  const [selectedEquipment, setSelectedEquipment] = useState([])
  const [selectedWorkoutType, setSelectedWorkoutType] = useState(null)
  const [otherEquipment, setOtherEquipment] = useState("")
  const [showOtherEquipmentInput, setShowOtherEquipmentInput] = useState(false)

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  // Steps
  const steps = [
    {
      id: 1,
      title: "¿EN QUÉ ÁREAS TE GUSTARÍA ENFOCARTE?",
      type: "focusAreas",
      subtitle: "Selecciona las zonas que quieres trabajar",
    },
    {
      id: 2,
      title: "¿DÓNDE PREFIERES ENTRENAR?",
      type: "trainingPlace",
      subtitle: "Elige tu lugar de entrenamiento preferido",
    },
    {
      id: 3,
      title: "¿CUÁL ES TU NIVEL DE CONDICIÓN FÍSICA?",
      type: "fitnessLevel",
      subtitle: "Selecciona tu nivel actual",
    },
    { id: 4, title: "¿QUÉ DÍAS PUEDES ENTRENAR?", type: "workoutDays", subtitle: "Selecciona los días de la semana" },
    {
      id: 5,
      title: "¿CUÁNTO TIEMPO TIENES PARA ENTRENAR?",
      type: "workoutDuration",
      subtitle: "Elige tu duración preferida",
    },
    {
      id: 6,
      title: "¿QUÉ EQUIPAMIENTO TIENES DISPONIBLE?",
      type: "equipment",
      subtitle: "Selecciona el equipamiento que tienes (opcional)",
    },
    {
      id: 7,
      title: "¿QUÉ TIPO DE ENTRENAMIENTO PREFIERES?",
      type: "workoutType",
      subtitle: "Elige tu estilo de entrenamiento",
    },
    { id: 8, title: "¡TODO LISTO!", type: "completion", subtitle: "Estamos generando tu rutina personalizada" },
  ]

  // Options
  const focusAreaOptions = [
    { label: "Cuerpo completo", value: "full_body", icon: "human" },
    { label: "Hombros de roca", value: "shoulders", icon: "human-handsup" },
    { label: "Bíceps masivos", value: "biceps", icon: "arm-flex" },
    { label: "Pecho amplio", value: "chest", icon: "human-male" },
    { label: "Espalda ancha", value: "back", icon: "human-male-board" },
    { label: "Abdominales", value: "abs", icon: "six-pack" },
    { label: "Glúteos firmes", value: "glutes", icon: "human-female" },
    { label: "Piernas fuertes", value: "legs", icon: "human-male-height" },
  ]

  const trainingPlaceOptions = [
    {
      label: "Gimnasio",
      value: "gym",
      description: "Ejercicios con máquinas y pesas libres",
      icon: "dumbbell",
    },
    {
      label: "Casa",
      value: "home",
      description: "Ejercicios de peso corporal con poco o ningún equipo",
      icon: "home",
    },
    {
      label: "Aire libre",
      value: "outdoor",
      description: "Ejercicios de peso corporal y cardio realizados al aire libre",
      icon: "tree",
    },
    {
      label: "Mezcla",
      value: "mixed",
      description: "Combinación de entrenamientos en gimnasio y en casa",
      icon: "shuffle-variant",
    },
  ]

  const fitnessLevelOptions = [
    {
      label: "Principiante",
      value: "beginner",
      description: "Recién comienzo o llevo menos de 3 meses entrenando",
      icon: "human-child",
    },
    {
      label: "Intermedio",
      value: "intermediate",
      description: "Entreno regularmente desde hace 3-12 meses",
      icon: "human-male",
    },
    {
      label: "Avanzado",
      value: "advanced",
      description: "Entreno consistentemente desde hace más de 1 año",
      icon: "human-handsup",
    },
  ]

  const workoutDayOptions = [
    { label: "Lunes", value: "monday", short: "LU" },
    { label: "Martes", value: "tuesday", short: "MA" },
    { label: "Miércoles", value: "wednesday", short: "MI" },
    { label: "Jueves", value: "thursday", short: "JU" },
    { label: "Viernes", value: "friday", short: "VI" },
    { label: "Sábado", value: "saturday", short: "SÁ" },
    { label: "Domingo", value: "sunday", short: "DO" },
  ]

  const workoutDurationOptions = [
    { label: "Fuerte", value: "1hr", duration: "1 hr", icon: "clock-time-three" },
    { label: "Intenso", value: "1hr30", duration: "1 hr 30 min", icon: "clock-time-six" },
    { label: "Maratón", value: "2hrs", duration: "2 hrs", icon: "clock-time-nine" },
  ]

  const equipmentOptions = [
    { label: "Mancuernas", value: "dumbbells", icon: "dumbbell" },
    { label: "Barra", value: "barbell", icon: "weight-lifter" },
    { label: "Bandas de resistencia", value: "resistance_bands", icon: "bandage" },
    { label: "Máquinas de gym", value: "gym_machines", icon: "robot" },
    { label: "Pesas rusas", value: "kettlebell_russian", icon: "weight-kilogram" },
    { label: "Balón medicinal", value: "medicine_ball", icon: "basketball" },
  ]

  const workoutTypeOptions = [
    {
      label: "Fuerza",
      value: "strength",
      description: "Enfoque en ganar músculo y fuerza con pesos pesados",
      icon: "weight-lifter",
    },
    {
      label: "Hipertrofia",
      value: "hypertrophy",
      description: "Enfoque en crecimiento muscular con repeticiones moderadas",
      icon: "arm-flex",
    },
    {
      label: "Resistencia",
      value: "endurance",
      description: "Enfoque en resistencia muscular con muchas repeticiones",
      icon: "run-fast",
    },
    {
      label: "Funcional",
      value: "functional",
      description: "Ejercicios que imitan movimientos de la vida diaria",
      icon: "human-handsup",
    },
    {
      label: "Cardio",
      value: "cardio",
      description: "Enfoque en salud cardiovascular y quema de grasa",
      icon: "heart-pulse",
    },
    {
      label: "Mixto",
      value: "mixed",
      description: "Combinación de diferentes tipos de entrenamiento",
      icon: "shuffle-variant",
    },
  ]

  // Actualizar la animación de progreso cuando cambia el paso
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / (steps.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [step])

  // Toggle selection functions
  const toggleSelection = (type, value) => {
    if (type === "focusAreas") {
      if (selectedFocusAreas.includes(value)) {
        setSelectedFocusAreas(selectedFocusAreas.filter((a) => a !== value))
      } else {
        setSelectedFocusAreas([...selectedFocusAreas, value])
      }
    } else if (type === "workoutDays") {
      if (selectedWorkoutDays.includes(value)) {
        setSelectedWorkoutDays(selectedWorkoutDays.filter((d) => d !== value))
      } else {
        setSelectedWorkoutDays([...selectedWorkoutDays, value])
      }
    } else if (type === "equipment") {
      if (selectedEquipment.includes(value)) {
        setSelectedEquipment(selectedEquipment.filter((e) => e !== value))
      } else {
        setSelectedEquipment([...selectedEquipment, value])
      }
    }
  }

  const addOtherEquipment = () => {
    if (otherEquipment.trim()) {
      setSelectedEquipment([...selectedEquipment, otherEquipment])
      setOtherEquipment("")
      setShowOtherEquipmentInput(false)
    }
  }

  // Optimized next step function
  const nextStep = () => {
    if (step < steps.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep(step + 1)
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start()
      })
    } else {
      // Enviar datos a la IA para generar rutina
      const userPreferences = {
        focusAreas: selectedFocusAreas,
        trainingPlace: selectedTrainingPlace,
        fitnessLevel: selectedFitnessLevel,
        workoutDays: selectedWorkoutDays,
        workoutDuration: selectedWorkoutDuration,
        equipment: selectedEquipment,
        workoutType: selectedWorkoutType,
      }
      console.log("Preferencias para rutina:", userPreferences)
      router.replace("/RutinaGenerada")
    }
  }

  // Nueva función para retroceder un paso
  const prevStep = () => {
    if (step > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep(step - 1)
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start()
      })
    }
  }

  const renderFocusAreaOptions = () => {
    return (
      <View style={styles.gridContainer}>
        {focusAreaOptions.map((item) => (
          <Pressable
            key={item.value}
            style={[styles.focusOption, selectedFocusAreas.includes(item.value) && styles.focusOptionSelected]}
            onPress={() => toggleSelection("focusAreas", item.value)}
            android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={28}
              color={selectedFocusAreas.includes(item.value) ? COLORS.primary : COLORS.textSecondary}
              style={styles.focusIcon}
            />
            <Text
              style={[
                styles.focusOptionText,
                selectedFocusAreas.includes(item.value) && styles.focusOptionTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    )
  }

  // Reemplazar el renderTrainingPlaceOptions() con una versión que use FlatList
  const renderTrainingPlaceOptions = () => {
    return (
      <FlatList
        data={trainingPlaceOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.optionCard, selectedTrainingPlace === item.value && styles.optionCardSelected]}
            onPress={() => setSelectedTrainingPlace(item.value)}
            android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={selectedTrainingPlace === item.value ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[styles.optionCardTitle, selectedTrainingPlace === item.value && styles.optionCardTitleSelected]}
              >
                {item.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{item.description}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  // Reemplazar el renderFitnessLevelOptions() con una versión que use FlatList
  const renderFitnessLevelOptions = () => {
    return (
      <FlatList
        data={fitnessLevelOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.optionCard, selectedFitnessLevel === item.value && styles.optionCardSelected]}
            onPress={() => setSelectedFitnessLevel(item.value)}
            android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={selectedFitnessLevel === item.value ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[styles.optionCardTitle, selectedFitnessLevel === item.value && styles.optionCardTitleSelected]}
              >
                {item.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{item.description}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  const renderWorkoutDaysOptions = () => {
    return (
      <View style={styles.daysContainer}>
        <View style={styles.daysGrid}>
          {workoutDayOptions.map((day) => (
            <Pressable
              key={day.value}
              style={[styles.dayButton, selectedWorkoutDays.includes(day.value) && styles.dayButtonSelected]}
              onPress={() => toggleSelection("workoutDays", day.value)}
              android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
            >
              <Text
                style={[styles.dayButtonText, selectedWorkoutDays.includes(day.value) && styles.dayButtonTextSelected]}
              >
                {day.short}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.selectedDaysContainer}>
          <Text style={styles.selectedDaysTitle}>Días seleccionados:</Text>
          <View style={styles.selectedDaysList}>
            {selectedWorkoutDays.length > 0 ? (
              workoutDayOptions
                .filter((day) => selectedWorkoutDays.includes(day.value))
                .map((day) => (
                  <View key={day.value} style={styles.selectedDayChip}>
                    <Text style={styles.selectedDayChipText}>{day.label}</Text>
                    <Pressable
                      onPress={() => toggleSelection("workoutDays", day.value)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.text} />
                    </Pressable>
                  </View>
                ))
            ) : (
              <Text style={styles.noDaysSelectedText}>No has seleccionado ningún día</Text>
            )}
          </View>
        </View>

        <Text style={styles.daysNote}>Selecciona los días que puedes entrenar para crear una rutina óptima</Text>
      </View>
    )
  }

  // Reemplazar el renderWorkoutDurationOptions() con una versión que use FlatList
  const renderWorkoutDurationOptions = () => {
    return (
      <FlatList
        data={workoutDurationOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.durationOption, selectedWorkoutDuration === item.value && styles.durationOptionSelected]}
            onPress={() => setSelectedWorkoutDuration(item.value)}
            android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
          >
            <View style={styles.durationHeader}>
              <MaterialCommunityIcons
                name={item.icon}
                size={28}
                color={selectedWorkoutDuration === item.value ? COLORS.primary : COLORS.textSecondary}
              />
              <View style={styles.durationTextContainer}>
                <Text
                  style={[
                    styles.durationOptionText,
                    selectedWorkoutDuration === item.value && styles.durationOptionTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.durationOptionTime,
                    selectedWorkoutDuration === item.value && styles.durationOptionTimeSelected,
                  ]}
                >
                  {item.duration}
                </Text>
              </View>
              {selectedWorkoutDuration === item.value && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={COLORS.primary}
                  style={styles.durationCheckIcon}
                />
              )}
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.durationContainer}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  const renderEquipmentOptions = () => {
    // Crear un array con las opciones y añadir la opción "Otros" al final
    const allEquipmentOptions = [...equipmentOptions, { label: "Otros", value: "other", icon: "plus-circle" }]

    return (
      <View style={styles.equipmentMainContainer}>
        <View style={styles.gridContainer}>
          {allEquipmentOptions.map((item) => {
            if (item.value === "other") {
              return (
                <Pressable
                  key={item.value}
                  style={styles.equipmentOption}
                  onPress={() => setShowOtherEquipmentInput(!showOtherEquipmentInput)}
                  android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
                >
                  <View style={styles.equipmentCheckbox}>
                    {selectedEquipment.some((e) => !equipmentOptions.some((o) => o.value === e)) && (
                      <View style={styles.equipmentCheckboxSelected} />
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={COLORS.textSecondary}
                    style={styles.equipmentIcon}
                  />
                  <Text style={styles.equipmentLabel}>{item.label}</Text>
                </Pressable>
              )
            }

            return (
              <Pressable
                key={item.value}
                style={styles.equipmentOption}
                onPress={() => toggleSelection("equipment", item.value)}
                android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
              >
                <View style={styles.equipmentCheckbox}>
                  {selectedEquipment.includes(item.value) && <View style={styles.equipmentCheckboxSelected} />}
                </View>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={selectedEquipment.includes(item.value) ? COLORS.primary : COLORS.textSecondary}
                  style={styles.equipmentIcon}
                />
                <Text
                  style={[
                    styles.equipmentLabel,
                    selectedEquipment.includes(item.value) && styles.equipmentLabelSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {showOtherEquipmentInput && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="Escribe tu equipamiento"
              value={otherEquipment}
              onChangeText={setOtherEquipment}
              placeholderTextColor={COLORS.textSecondary}
            />
            <Pressable
              style={styles.addButton}
              onPress={addOtherEquipment}
              android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
            >
              <Text style={styles.addButtonText}>Añadir</Text>
            </Pressable>
          </View>
        )}

        {selectedEquipment.some((e) => !equipmentOptions.some((o) => o.value === e)) && (
          <View style={styles.addedItemsContainer}>
            <Text style={styles.addedItemsTitle}>Equipamiento personalizado:</Text>
            <FlatList
              data={selectedEquipment.filter((e) => !equipmentOptions.some((o) => o.value === e))}
              keyExtractor={(item, index) => `custom-equipment-${index}`}
              horizontal
              renderItem={({ item }) => (
                <View style={styles.addedItem}>
                  <Text style={styles.addedItemText}>{item}</Text>
                  <Pressable
                    onPress={() => setSelectedEquipment(selectedEquipment.filter((e) => e !== item))}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={COLORS.danger} />
                  </Pressable>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.addedItemsList}
            />
          </View>
        )}
      </View>
    )
  }

  // Reemplazar el renderWorkoutTypeOptions() con una versión que use FlatList
  const renderWorkoutTypeOptions = () => {
    return (
      <FlatList
        data={workoutTypeOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.optionCard, selectedWorkoutType === item.value && styles.optionCardSelected]}
            onPress={() => setSelectedWorkoutType(item.value)}
            android_ripple={{ color: "rgba(0, 208, 120, 0.1)" }}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={selectedWorkoutType === item.value ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[styles.optionCardTitle, selectedWorkoutType === item.value && styles.optionCardTitleSelected]}
              >
                {item.label}
              </Text>
              {selectedWorkoutType === item.value && (
                <MaterialCommunityIcons name="check-circle" size={24} color={COLORS.primary} />
              )}
            </View>
            <Text style={styles.optionCardDescription}>{item.description}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  const renderCompletion = () => {
    return (
      <View style={styles.completionContainer}>
        <MaterialCommunityIcons name="weight-lifter" size={60} color={COLORS.primary} />
        <Text style={styles.completionText}>
          ¡Estamos generando tu rutina personalizada basada en tus preferencias!
        </Text>
        <View style={styles.loadingIndicator}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
    )
  }

  const renderStepContent = () => {
    const currentStep = steps[step]

    switch (currentStep.type) {
      case "focusAreas":
        return renderFocusAreaOptions()
      case "trainingPlace":
        return renderTrainingPlaceOptions()
      case "fitnessLevel":
        return renderFitnessLevelOptions()
      case "workoutDays":
        return renderWorkoutDaysOptions()
      case "workoutDuration":
        return renderWorkoutDurationOptions()
      case "equipment":
        return renderEquipmentOptions()
      case "workoutType":
        return renderWorkoutTypeOptions()
      case "completion":
        return renderCompletion()
      default:
        return null
    }
  }

  const isNextButtonDisabled = () => {
    return (
      (step === 0 && selectedFocusAreas.length === 0) ||
      (step === 1 && !selectedTrainingPlace) ||
      (step === 2 && !selectedFitnessLevel) ||
      (step === 3 && selectedWorkoutDays.length === 0) ||
      (step === 4 && !selectedWorkoutDuration) ||
      (step === 6 && !selectedWorkoutType)
    )
  }

  if (!fontsLoaded) return null

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header con botón de retroceso y progreso */}
      <View style={styles.header}>
        {step > 0 && (
          <Pressable
            style={styles.backButton}
            onPress={prevStep}
            android_ripple={{ color: "rgba(255, 255, 255, 0.1)", radius: 20 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
          </Pressable>
        )}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Paso {step + 1} de {steps.length}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.subtitle}>{steps[step].subtitle}</Text>

        <View style={styles.stepContent}>{renderStepContent()}</View>

        <Pressable
          style={[styles.continueButton, isNextButtonDisabled() && styles.continueButtonDisabled]}
          onPress={nextStep}
          disabled={isNextButtonDisabled()}
          android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>{step === steps.length - 1 ? "GENERAR RUTINA" : "CONTINUAR"}</Text>
            <MaterialCommunityIcons
              name={step === steps.length - 1 ? "check" : "arrow-right"}
              size={20}
              color={COLORS.text}
              style={styles.buttonIcon}
            />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "SofiaSans_900Black",
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 10,
    fontFamily: "SofiaSans_900Black",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
    fontFamily: "SofiaSans_900Black",
  },
  stepContent: {
    flex: 1,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionsContainer: {
    paddingBottom: 20,
  },
  optionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(0, 208, 120, 0.05)",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionCardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: "SofiaSans_900Black",
    marginLeft: 10,
    flex: 1,
  },
  optionCardTitleSelected: {
    color: COLORS.primary,
  },
  optionCardDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: "SofiaSans_900Black",
    marginLeft: 34,
  },
  focusOptionsContainer: {
    paddingBottom: 20,
  },
  focusAreaRow: {
    justifyContent: "space-between",
  },
  focusOption: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  focusOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(0, 208, 120, 0.05)",
  },
  focusIcon: {
    marginBottom: 10,
  },
  focusOptionText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: "SofiaSans_900Black",
    textAlign: "center",
  },
  focusOptionTextSelected: {
    color: COLORS.primary,
  },
  equipmentMainContainer: {
    flex: 1,
  },
  equipmentContainer: {
    paddingBottom: 10,
  },
  equipmentRow: {
    justifyContent: "space-between",
  },
  equipmentOption: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  equipmentCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  equipmentCheckboxSelected: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  equipmentIcon: {
    marginRight: 8,
  },
  equipmentLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: "SofiaSans_900Black",
    flex: 1,
  },
  equipmentLabelSelected: {
    color: COLORS.primary,
  },
  otherInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  otherInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontFamily: "SofiaSans_900Black",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
  },
  addButtonText: {
    color: COLORS.text,
    fontFamily: "SofiaSans_900Black",
  },
  addedItemsContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 15,
  },
  addedItemsTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: "SofiaSans_900Black",
    marginBottom: 10,
  },
  addedItemsList: {
    paddingBottom: 5,
  },
  addedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addedItemText: {
    color: COLORS.text,
    fontFamily: "SofiaSans_900Black",
    marginRight: 8,
  },
  daysContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  daysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  dayButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: "SofiaSans_900Black",
  },
  dayButtonTextSelected: {
    color: COLORS.text,
  },
  selectedDaysContainer: {
    marginBottom: 20,
  },
  selectedDaysTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: "SofiaSans_900Black",
    marginBottom: 10,
  },
  selectedDaysList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  selectedDayChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 125, 240, 0.2)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 125, 240, 0.3)",
  },
  selectedDayChipText: {
    color: COLORS.text,
    fontFamily: "SofiaSans_900Black",
    marginRight: 8,
  },
  noDaysSelectedText: {
    color: COLORS.textSecondary,
    fontFamily: "SofiaSans_900Black",
    fontStyle: "italic",
  },
  daysNote: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "SofiaSans_900Black",
    marginTop: 10,
  },
  durationContainer: {
    paddingBottom: 20,
  },
  durationOption: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  durationOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(0, 208, 120, 0.05)",
  },
  durationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  durationOptionText: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: "SofiaSans_900Black",
    marginBottom: 5,
  },
  durationOptionTextSelected: {
    color: COLORS.primary,
  },
  durationOptionTime: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: "SofiaSans_900Black",
  },
  durationOptionTimeSelected: {
    color: COLORS.primary,
  },
  durationCheckIcon: {
    marginLeft: 10,
  },
  continueButton: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: "Kanit_900Black",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  completionText: {
    color: COLORS.text,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "SofiaSans_900Black",
    marginTop: 20,
    marginBottom: 30,
  },
  loadingIndicator: {
    width: "100%",
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 20,
  },
  loadingBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
})

export default RutinaGymPersonalizada
