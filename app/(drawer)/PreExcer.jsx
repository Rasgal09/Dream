import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Dimensions, 
  Animated, 
  ScrollView,
  Platform,
  TextInput
} from 'react-native';
import { useFonts, SofiaSans_900Black } from '@expo-google-fonts/sofia-sans';
import { Kanit_900Black } from '@expo-google-fonts/kanit';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const RutinaGymPersonalizada = () => {
  const insets = useSafeAreaInsets();
  
  // Fonts loading
  const [fontsLoaded] = useFonts({
    SofiaSans_900Black,
    Kanit_900Black
  });

  // States
  const [step, setStep] = useState(0);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
  const [selectedTrainingPlace, setSelectedTrainingPlace] = useState(null);
  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState(null);
  const [selectedWorkoutDays, setSelectedWorkoutDays] = useState([]);
  const [selectedWorkoutDuration, setSelectedWorkoutDuration] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState(null);
  const [otherEquipment, setOtherEquipment] = useState('');
  const [showOtherEquipmentInput, setShowOtherEquipmentInput] = useState(false);

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Steps
  const steps = [
    { id: 1, title: "¿EN QUÉ ÁREAS TE GUSTARÍA ENFOCARTE?", type: "focusAreas", subtitle: "Selecciona las zonas que quieres trabajar" },
    { id: 2, title: "¿DÓNDE PREFIERES ENTRENAR?", type: "trainingPlace", subtitle: "Elige tu lugar de entrenamiento preferido" },
    { id: 3, title: "¿CUÁL ES TU NIVEL DE CONDICIÓN FÍSICA?", type: "fitnessLevel", subtitle: "Selecciona tu nivel actual" },
    { id: 4, title: "¿QUÉ DÍAS PUEDES ENTRENAR?", type: "workoutDays", subtitle: "Selecciona los días de la semana" },
    { id: 5, title: "¿CUÁNTO TIEMPO TIENES PARA ENTRENAR?", type: "workoutDuration", subtitle: "Elige tu duración preferida" },
    { id: 6, title: "¿QUÉ EQUIPAMIENTO TIENES DISPONIBLE?", type: "equipment", subtitle: "Selecciona el equipamiento que tienes (opcional)" },
    { id: 7, title: "¿QUÉ TIPO DE ENTRENAMIENTO PREFIERES?", type: "workoutType", subtitle: "Elige tu estilo de entrenamiento" },
    { id: 8, title: "¡TODO LISTO!", type: "completion", subtitle: "Estamos generando tu rutina personalizada" }
  ];

  // Options
  const focusAreaOptions = [
    { label: "Cuerpo completo", value: "full_body" },
    { label: "Hombros de roca", value: "shoulders" },
    { label: "Bíceps masivos", value: "biceps" },
    { label: "Pecho amplio", value: "chest" },
    { label: "Espalda ancha", value: "back" },
    { label: "Abdominales", value: "abs" },
    { label: "Glúteos firmes", value: "glutes" },
    { label: "Piernas fuertes", value: "legs" },
  ];

  const trainingPlaceOptions = [
    { 
      label: "Gimnasio", 
      value: "gym", 
      description: "Ejercicios con máquinas y pesas libres",
      icon: "dumbbell"
    },
    { 
      label: "Casa", 
      value: "home", 
      description: "Ejercicios de peso corporal con poco o ningún equipo",
      icon: "home"
    },
    { 
      label: "Aire libre", 
      value: "outdoor", 
      description: "Ejercicios de peso corporal y cardio realizados al aire libre",
      icon: "tree"
    },
    { 
      label: "Mezcla", 
      value: "mixed", 
      description: "Combinación de entrenamientos en gimnasio y en casa",
      icon: "mix"
    },
  ];

  const fitnessLevelOptions = [
    { 
      label: "Principiante", 
      value: "beginner", 
      description: "Recién comienzo o llevo menos de 3 meses entrenando",
      icon: "human-child"
    },
    { 
      label: "Intermedio", 
      value: "intermediate", 
      description: "Entreno regularmente desde hace 3-12 meses",
      icon: "human-male"
    },
    { 
      label: "Avanzado", 
      value: "advanced", 
      description: "Entreno consistentemente desde hace más de 1 año",
      icon: "human-handsup"
    },
  ];

  const workoutDayOptions = [
    { label: "Lunes", value: "monday", short: "LU" },
    { label: "Martes", value: "tuesday", short: "MA" },
    { label: "Miércoles", value: "wednesday", short: "MI" },
    { label: "Jueves", value: "thursday", short: "JU" },
    { label: "Viernes", value: "friday", short: "VI" },
    { label: "Sábado", value: "saturday", short: "SÁ" },
    { label: "Domingo", value: "sunday", short: "DO" },
  ];

  const workoutDurationOptions = [
    { label: "Fuerte", value: "1hr", duration: "1 hr" },
    { label: "Intenso", value: "1hr30", duration: "1 hr 30 min" },
    { label: "Maratón", value: "2hrs", duration: "2 hrs" },
  ];
  
  const equipmentOptions = [
    { label: "Mancuernas", value: "dumbbells" },
    { label: "Barra", value: "barbell" },
    { label: "Kettlebells", value: "kettlebells" },
    { label: "Bandas de resistencia", value: "resistance_bands" },
    { label: "Máquinas de gym", value: "gym_machines" },
    { label: "Pesas rusas", value: "kettlebell_russian" }, // Cambiado para evitar duplicado
    { label: "Cuerda para saltar", value: "jump_rope" },
    { label: "Balón medicinal", value: "medicine_ball" },
  ];

  const workoutTypeOptions = [
    { 
      label: "Fuerza", 
      value: "strength", 
      description: "Enfoque en ganar músculo y fuerza con pesos pesados",
      icon: "weight-lifter"
    },
    { 
      label: "Hipertrofia", 
      value: "hypertrophy", 
      description: "Enfoque en crecimiento muscular con repeticiones moderadas",
      icon: "arm-flex"
    },
    { 
      label: "Resistencia", 
      value: "endurance", 
      description: "Enfoque en resistencia muscular con muchas repeticiones",
      icon: "run-fast"
    },
    { 
      label: "Funcional", 
      value: "functional", 
      description: "Ejercicios que imitan movimientos de la vida diaria",
      icon: "human-handsup"
    },
    { 
      label: "Cardio", 
      value: "cardio", 
      description: "Enfoque en salud cardiovascular y quema de grasa",
      icon: "heart-pulse"
    },
    { 
      label: "Mixto", 
      value: "mixed", 
      description: "Combinación de diferentes tipos de entrenamiento",
      icon: "mix"
    },
  ];

  // Toggle selection functions
  const toggleSelection = (type, value) => {
    if (type === 'focusAreas') {
      if (selectedFocusAreas.includes(value)) {
        setSelectedFocusAreas(selectedFocusAreas.filter(a => a !== value));
      } else {
        setSelectedFocusAreas([...selectedFocusAreas, value]);
      }
    } else if (type === 'workoutDays') {
      if (selectedWorkoutDays.includes(value)) {
        setSelectedWorkoutDays(selectedWorkoutDays.filter(d => d !== value));
      } else {
        setSelectedWorkoutDays([...selectedWorkoutDays, value]);
      }
    } else if (type === 'equipment') {
      if (selectedEquipment.includes(value)) {
        setSelectedEquipment(selectedEquipment.filter(e => e !== value));
      } else {
        setSelectedEquipment([...selectedEquipment, value]);
      }
    }
  };

  const addOtherEquipment = () => {
    if (otherEquipment.trim()) {
      setSelectedEquipment([...selectedEquipment, otherEquipment]);
      setOtherEquipment('');
      setShowOtherEquipmentInput(false);
    }
  };

  // Optimized next step function
  const nextStep = () => {
    if (step < steps.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 150,
          useNativeDriver: true
        })
      ]).start(() => {
        setStep(step + 1);
        Animated.parallel([
          Animated.timing(progressAnim, {
            toValue: (step + 1) / (steps.length - 1),
            duration: 300,
            useNativeDriver: false
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          })
        ]).start();
      });
    } else {
      // Enviar datos a la IA para generar rutina
      const userPreferences = {
        focusAreas: selectedFocusAreas,
        trainingPlace: selectedTrainingPlace,
        fitnessLevel: selectedFitnessLevel,
        workoutDays: selectedWorkoutDays,
        workoutDuration: selectedWorkoutDuration,
        equipment: selectedEquipment,
        workoutType: selectedWorkoutType
      };
      console.log("Preferencias para rutina:", userPreferences);
      router.replace('/RutinaGenerada');
    }
  };

  const renderFocusAreaOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.checkboxContainer}>
        {focusAreaOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.focusOption,
              selectedFocusAreas.includes(option.value) && styles.focusOptionSelected
            ]}
            onPress={() => toggleSelection('focusAreas', option.value)}
          >
            <Text style={[
              styles.focusOptionText,
              selectedFocusAreas.includes(option.value) && styles.focusOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderTrainingPlaceOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {trainingPlaceOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionCard,
              selectedTrainingPlace === option.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedTrainingPlace(option.value)}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedTrainingPlace === option.value ? '#00D078' : '#666'} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedTrainingPlace === option.value && styles.optionCardTitleSelected
              ]}>
                {option.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderFitnessLevelOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {fitnessLevelOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionCard,
              selectedFitnessLevel === option.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedFitnessLevel(option.value)}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedFitnessLevel === option.value ? '#00D078' : '#666'} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedFitnessLevel === option.value && styles.optionCardTitleSelected
              ]}>
                {option.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderWorkoutDaysOptions = () => {
    return (
      <View style={styles.daysContainer}>
        <View style={styles.daysGrid}>
          {workoutDayOptions.map((day) => (
            <Pressable
              key={day.value}
              style={[
                styles.dayButton,
                selectedWorkoutDays.includes(day.value) && styles.dayButtonSelected
              ]}
              onPress={() => toggleSelection('workoutDays', day.value)}
            >
              <Text style={[
                styles.dayButtonText,
                selectedWorkoutDays.includes(day.value) && styles.dayButtonTextSelected
              ]}>
                {day.short}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.daysNote}>Selecciona los días que quieres entrenar</Text>
      </View>
    );
  };

  const renderWorkoutDurationOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.durationContainer}>
        {workoutDurationOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.durationOption,
              selectedWorkoutDuration === option.value && styles.durationOptionSelected
            ]}
            onPress={() => setSelectedWorkoutDuration(option.value)}
          >
            <Text style={[
              styles.durationOptionText,
              selectedWorkoutDuration === option.value && styles.durationOptionTextSelected
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.durationOptionTime,
              selectedWorkoutDuration === option.value && styles.durationOptionTimeSelected
            ]}>
              {option.duration}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderEquipmentOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.checkboxContainer}>
        {equipmentOptions.map((option) => (
          <Pressable
            key={option.value}
            style={styles.checkboxOption}
            onPress={() => toggleSelection('equipment', option.value)}
          >
            <View style={styles.checkbox}>
              {selectedEquipment.includes(option.value) && (
                <View style={styles.checkboxSelected} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{option.label}</Text>
          </Pressable>
        ))}
        
        {!showOtherEquipmentInput && (
          <Pressable
            style={styles.checkboxOption}
            onPress={() => setShowOtherEquipmentInput(true)}
          >
            <View style={styles.checkbox}>
              {selectedEquipment.some(e => !equipmentOptions.some(o => o.value === e)) && (
                <View style={styles.checkboxSelected} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Otros</Text>
          </Pressable>
        )}
        
        {showOtherEquipmentInput && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="Escribe tu equipamiento"
              value={otherEquipment}
              onChangeText={setOtherEquipment}
              placeholderTextColor="#666"
            />
            <Pressable
              style={styles.addButton}
              onPress={addOtherEquipment}
            >
              <Text style={styles.addButtonText}>Añadir</Text>
            </Pressable>
          </View>
        )}
        
        {selectedEquipment.some(e => !equipmentOptions.some(o => o.value === e)) && (
          <View style={styles.addedItemsContainer}>
            {selectedEquipment
              .filter(e => !equipmentOptions.some(o => o.value === e))
              .map((item, index) => (
                <View key={`other-${index}`} style={styles.addedItem}>
                  <Text style={styles.addedItemText}>{item}</Text>
                  <Pressable
                    onPress={() => setSelectedEquipment(selectedEquipment.filter(e => e !== item))}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
                  </Pressable>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderWorkoutTypeOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {workoutTypeOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionCard,
              selectedWorkoutType === option.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedWorkoutType(option.value)}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedWorkoutType === option.value ? '#00D078' : '#666'} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedWorkoutType === option.value && styles.optionCardTitleSelected
              ]}>
                {option.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderCompletion = () => {
    return (
      <View style={styles.completionContainer}>
        <MaterialCommunityIcons name="weight-lifter" size={60} color="#00D078" />
        <Text style={styles.completionText}>¡Estamos generando tu rutina personalizada basada en tus preferencias!</Text>
      </View>
    );
  };

  const renderStepContent = () => {
    const currentStep = steps[step];
    
    switch(currentStep.type) {
      case "focusAreas":
        return renderFocusAreaOptions();
      case "trainingPlace":
        return renderTrainingPlaceOptions();
      case "fitnessLevel":
        return renderFitnessLevelOptions();
      case "workoutDays":
        return renderWorkoutDaysOptions();
      case "workoutDuration":
        return renderWorkoutDurationOptions();
      case "equipment":
        return renderEquipmentOptions();
      case "workoutType":
        return renderWorkoutTypeOptions();
      case "completion":
        return renderCompletion();
      default:
        return null;
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Paso {step + 1} de {steps.length}</Text>
        <View style={styles.progressBar}>
          <Animated.View style={[
            styles.progressFill,
            { width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) 
            }
          ]} />
        </View>
      </View>

      {/* Main Content */}
      <Animated.View style={[
        styles.contentContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.subtitle}>{steps[step].subtitle}</Text>
        
        <View style={styles.stepContent}>
          {renderStepContent()}
        </View>

        <Pressable
          style={[
            styles.continueButton,
            ((step === 0 && selectedFocusAreas.length === 0) || 
             (step === 1 && !selectedTrainingPlace) || 
             (step === 2 && !selectedFitnessLevel) ||
             (step === 3 && selectedWorkoutDays.length === 0) ||
             (step === 4 && !selectedWorkoutDuration) ||
             (step === 6 && !selectedWorkoutType)) && { opacity: 0.5 }
          ]}
          onPress={nextStep}
          disabled={
            (step === 0 && selectedFocusAreas.length === 0) || 
            (step === 1 && !selectedTrainingPlace) || 
            (step === 2 && !selectedFitnessLevel) ||
            (step === 3 && selectedWorkoutDays.length === 0) ||
            (step === 4 && !selectedWorkoutDuration) ||
            (step === 6 && !selectedWorkoutType)
          }
        >
          <LinearGradient
            colors={['#00D078', '#007DF0']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {step === steps.length - 1 ? 'GENERAR RUTINA' : 'CONTINUAR'}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A1A'
  },
  progressContainer: {
    marginBottom: 30
  },
  progressText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'SofiaSans_900Black'
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007DF0',
    borderRadius: 4
  },
  contentContainer: {
    flex: 1
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 10,
    fontFamily: 'SofiaSans_900Black'
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
    fontFamily: 'SofiaSans_900Black'
  },
  stepContent: {
    flex: 1,
    marginBottom: 20,
  },
  optionsContainer: {
    paddingBottom: 20,
  },
  optionCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  optionCardSelected: {
    borderColor: '#00D078',
    backgroundColor: '#252525',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionCardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    marginLeft: 10,
    flex: 1,
  },
  optionCardTitleSelected: {
    color: '#00D078',
  },
  optionCardDescription: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
    marginLeft: 34,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  focusOption: {
    width: '48%',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  focusOptionSelected: {
    borderColor: '#00D078',
  },
  focusOptionText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'SofiaSans_900Black',
  },
  focusOptionTextSelected: {
    color: '#00D078',
  },
  checkboxOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#00D078',
  },
  checkboxLabel: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'SofiaSans_900Black',
    flex: 1,
  },
  otherInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  otherInput: {
    flex: 1,
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontFamily: 'SofiaSans_900Black',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#00D078',
    borderRadius: 8,
    padding: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontFamily: 'SofiaSans_900Black',
  },
  addedItemsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  addedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  addedItemText: {
    color: '#FFF',
    fontFamily: 'SofiaSans_900Black',
    marginRight: 8,
  },
  daysContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  dayButtonSelected: {
    backgroundColor: '#007DF0',
    borderColor: '#007DF0',
  },
  dayButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
  },
  dayButtonTextSelected: {
    color: '#FFF',
  },
  daysNote: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'SofiaSans_900Black',
  },
  durationContainer: {
    paddingBottom: 20,
  },
  durationOption: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  durationOptionSelected: {
    borderColor: '#00D078',
  },
  durationOptionText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 5,
  },
  durationOptionTextSelected: {
    color: '#00D078',
  },
  durationOptionTime: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
  },
  durationOptionTimeSelected: {
    color: '#00D078',
  },
  continueButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden'
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Kanit_900Black'
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  completionText: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'SofiaSans_900Black',
    marginTop: 20,
    paddingHorizontal: 20
  }
});

export default RutinaGymPersonalizada;