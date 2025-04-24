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
const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;
const WHEEL_WIDTH = width * 0.7;

const DietaPersonalizada = () => {
  const insets = useSafeAreaInsets();
  
  // Fonts loading
  const [fontsLoaded] = useFonts({
    SofiaSans_900Black,
    Kanit_900Black
  });

  // States
  const [step, setStep] = useState(0);
  const [selectedDietType, setSelectedDietType] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedDislikes, setSelectedDislikes] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [cookingTime, setCookingTime] = useState(30);
  const [otherAllergy, setOtherAllergy] = useState('');
  const [otherDislike, setOtherDislike] = useState('');
  const [showOtherAllergyInput, setShowOtherAllergyInput] = useState(false);
  const [showOtherDislikeInput, setShowOtherDislikeInput] = useState(false);

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Steps
  const steps = [
    { id: 1, title: "TU OBJETIVO PRINCIPAL", type: "goal", subtitle: "Selecciona lo que deseas lograr con tu dieta" },
    { id: 2, title: "NIVEL DE ACTIVIDAD", type: "activity", subtitle: "¿Qué tan activo eres en tu día a día?" },
    { id: 3, title: "¿QUÉ TIPO DE DIETA PREFIERES?", type: "diet", subtitle: "Selecciona tu preferencia alimenticia" },
    { id: 4, title: "ALERGIAS E INTOLERANCIAS", type: "allergies", subtitle: "Selecciona las que tengas (opcional)" },
    { id: 5, title: "ALIMENTOS QUE EVITAS", type: "dislikes", subtitle: "Selecciona los que no te gustan (opcional)" },
    { id: 6, title: "PREFERENCIAS DE COMIDA", type: "preferences", subtitle: "Cómo prefieres tus comidas" },
    { id: 7, title: "¡TODO LISTO!", type: "completion", subtitle: "Estamos generando tu dieta personalizada" }
  ];

  // Options
  const goalOptions = [
    { 
      label: "Pérdida de peso", 
      value: "weight_loss", 
      description: "Reducir grasa corporal manteniendo músculo",
      icon: "scale"
    },
    { 
      label: "Ganancia muscular", 
      value: "muscle_gain", 
      description: "Aumentar masa muscular con nutrición óptima",
      icon: "dumbbell"
    },
    { 
      label: "Mantenimiento", 
      value: "maintenance", 
      description: "Mantener tu peso actual de forma saludable",
      icon: "chart-line"
    },
    { 
      label: "Mejorar salud", 
      value: "health", 
      description: "Enfoque en bienestar general y energía",
      icon: "heart-pulse"
    },
  ];

  const activityOptions = [
    { 
      label: "Sedentario", 
      value: "sedentary", 
      description: "Poco o ningún ejercicio",
      icon: "sofa"
    },
    { 
      label: "Ligero", 
      value: "light", 
      description: "Ejercicio ligero 1-3 días/semana",
      icon: "walk"
    },
    { 
      label: "Moderado", 
      value: "moderate", 
      description: "Ejercicio moderado 3-5 días/semana",
      icon: "run-fast"
    },
    { 
      label: "Activo", 
      value: "active", 
      description: "Ejercicio intenso 6-7 días/semana",
      icon: "run"
    },
    { 
      label: "Muy activo", 
      value: "very_active", 
      description: "Ejercicio muy intenso y trabajo físico",
      icon: "arm-flex"
    },
  ];

  const dietTypeOptions = [
    { 
      label: "Recomendada", 
      value: "recommended", 
      description: "Mezcla óptima de proteínas, carbohidratos y grasas",
      selected: false,
      icon: "star"
    },
    { 
      label: "Alta en proteínas", 
      value: "high_protein", 
      description: "Más proteínas, menos carbohidratos y grasas",
      selected: false,
      icon: "food-drumstick"
    },
    { 
      label: "Baja en carbohidratos", 
      value: "low_carb", 
      description: "Menos carbohidratos, más grasas y proteínas moderadas",
      selected: false,
      icon: "bread-slice"
    },
    { 
      label: "Keto", 
      value: "keto", 
      description: "Muy baja en carbohidratos, alta en grasas y proteínas moderadas",
      selected: false,
      icon: "egg"
    },
    { 
      label: "Mediterránea", 
      value: "mediterranean", 
      description: "Rica en vegetales, grasas saludables y pescado",
      selected: false,
      icon: "fish"
    },
    { 
      label: "Vegetariana", 
      value: "vegetarian", 
      description: "Sin carne, con huevos y lácteos",
      selected: false,
      icon: "carrot"
    },
  ];

  const allergyOptions = [
    { label: "Lácteos", value: "dairy" },
    { label: "Gluten", value: "gluten" },
    { label: "Huevos", value: "eggs" },
    { label: "Frutos secos", value: "nuts" },
    { label: "Mariscos", value: "shellfish" },
    { label: "Soja", value: "soy" },
    { label: "Pescado", value: "fish" },
    { label: "Maní", value: "peanuts" },
  ];

  const dislikeOptions = [
    { label: "Pescado", value: "fish" },
    { label: "Mariscos", value: "shellfish" },
    { label: "Carnes rojas", value: "red_meat" },
    { label: "Aves", value: "poultry" },
    { label: "Vegetales crucíferos", value: "cruciferous" },
    { label: "Legumbres", value: "legumes" },
    { label: "Lácteos", value: "dairy" },
    { label: "Huevos", value: "eggs" },
    { label: "Comida picante", value: "spicy" },
    { label: "Comida muy grasosa", value: "greasy" },
  ];

  const cookingTimeOptions = [15, 30, 45, 60];

  // Toggle selection functions
  const toggleSelection = (type, value) => {
    if (type === 'diet') {
      setSelectedDietType(value);
    } else if (type === 'allergies') {
      if (selectedAllergies.includes(value)) {
        setSelectedAllergies(selectedAllergies.filter(a => a !== value));
      } else {
        setSelectedAllergies([...selectedAllergies, value]);
      }
    } else if (type === 'dislikes') {
      if (selectedDislikes.includes(value)) {
        setSelectedDislikes(selectedDislikes.filter(d => d !== value));
      } else {
        setSelectedDislikes([...selectedDislikes, value]);
      }
    }
  };

  const addOtherAllergy = () => {
    if (otherAllergy.trim()) {
      setSelectedAllergies([...selectedAllergies, otherAllergy]);
      setOtherAllergy('');
      setShowOtherAllergyInput(false);
    }
  };

  const addOtherDislike = () => {
    if (otherDislike.trim()) {
      setSelectedDislikes([...selectedDislikes, otherDislike]);
      setOtherDislike('');
      setShowOtherDislikeInput(false);
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
      // Enviar datos a la IA para generar dieta
      const userPreferences = {
        goal: selectedGoal,
        activity: selectedActivity,
        dietType: selectedDietType,
        allergies: selectedAllergies,
        dislikes: selectedDislikes,
        mealsPerDay,
        cookingTime
      };
      console.log("Preferencias para dieta:", userPreferences);
      router.replace('/DietaGenerada');
    }
  };

  const renderDietTypeOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.dietOptionsContainer}>
        {dietTypeOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.dietOption,
              selectedDietType === option.value && styles.dietOptionSelected
            ]}
            onPress={() => setSelectedDietType(option.value)}
          >
            <View style={styles.dietOptionHeader}>
              <View style={styles.radioButton}>
                {selectedDietType === option.value && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedDietType === option.value ? '#00D078' : '#666'} 
                style={styles.optionIcon}
              />
              <Text style={[
                styles.dietOptionTitle,
                selectedDietType === option.value && styles.dietOptionTitleSelected
              ]}>
                {option.label}
              </Text>
            </View>
            <Text style={styles.dietOptionDescription}>{option.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const renderGoalOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {goalOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionCard,
              selectedGoal === option.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedGoal(option.value)}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedGoal === option.value ? '#00D078' : '#666'} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedGoal === option.value && styles.optionCardTitleSelected
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

  const renderActivityOptions = () => {
    return (
      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {activityOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.optionCard,
              selectedActivity === option.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedActivity(option.value)}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={selectedActivity === option.value ? '#00D078' : '#666'} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedActivity === option.value && styles.optionCardTitleSelected
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

  const renderCheckboxOptions = (options, selectedValues, type) => {
    const isAllergies = type === 'allergies';
    
    return (
      <ScrollView contentContainerStyle={styles.checkboxContainer}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={styles.checkboxOption}
            onPress={() => toggleSelection(type, option.value)}
          >
            <View style={styles.checkbox}>
              {selectedValues.includes(option.value) && (
                <View style={styles.checkboxSelected} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{option.label}</Text>
          </Pressable>
        ))}
        
        {!showOtherAllergyInput && isAllergies && (
          <Pressable
            style={styles.checkboxOption}
            onPress={() => setShowOtherAllergyInput(true)}
          >
            <View style={styles.checkbox}>
              {selectedAllergies.some(a => !allergyOptions.some(o => o.value === a)) && (
                <View style={styles.checkboxSelected} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Otros</Text>
          </Pressable>
        )}
        
        {!showOtherDislikeInput && !isAllergies && (
          <Pressable
            style={styles.checkboxOption}
            onPress={() => setShowOtherDislikeInput(true)}
          >
            <View style={styles.checkbox}>
              {selectedDislikes.some(d => !dislikeOptions.some(o => o.value === d)) && (
                <View style={styles.checkboxSelected} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Otros</Text>
          </Pressable>
        )}
        
        {(showOtherAllergyInput && isAllergies) && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="Escribe tu alergia o intolerancia"
              value={otherAllergy}
              onChangeText={setOtherAllergy}
              placeholderTextColor="#666"
            />
            <Pressable
              style={styles.addButton}
              onPress={addOtherAllergy}
            >
              <Text style={styles.addButtonText}>Añadir</Text>
            </Pressable>
          </View>
        )}
        
        {(showOtherDislikeInput && !isAllergies) && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="Escribe el alimento que evitas"
              value={otherDislike}
              onChangeText={setOtherDislike}
              placeholderTextColor="#666"
            />
            <Pressable
              style={styles.addButton}
              onPress={addOtherDislike}
            >
              <Text style={styles.addButtonText}>Añadir</Text>
            </Pressable>
          </View>
        )}
        
        {selectedAllergies.some(a => !allergyOptions.some(o => o.value === a)) && isAllergies && (
          <View style={styles.addedItemsContainer}>
            {selectedAllergies
              .filter(a => !allergyOptions.some(o => o.value === a))
              .map((item, index) => (
                <View key={index} style={styles.addedItem}>
                  <Text style={styles.addedItemText}>{item}</Text>
                  <Pressable
                    onPress={() => setSelectedAllergies(selectedAllergies.filter(a => a !== item))}
                  >
                    <MaterialCommunityIcons name="close" size={20} color="#FF3B30" />
                  </Pressable>
                </View>
              ))}
          </View>
        )}
        
        {selectedDislikes.some(d => !dislikeOptions.some(o => o.value === d)) && !isAllergies && (
          <View style={styles.addedItemsContainer}>
            {selectedDislikes
              .filter(d => !dislikeOptions.some(o => o.value === d))
              .map((item, index) => (
                <View key={index} style={styles.addedItem}>
                  <Text style={styles.addedItemText}>{item}</Text>
                  <Pressable
                    onPress={() => setSelectedDislikes(selectedDislikes.filter(d => d !== item))}
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

  const renderPreferences = () => {
    return (
      <View style={styles.preferencesContainer}>
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Comidas al día</Text>
          <View style={styles.mealsButtons}>
            {[3, 4, 5, 6].map((num) => (
              <Pressable
                key={num}
                style={[
                  styles.mealButton,
                  mealsPerDay === num && styles.mealButtonSelected
                ]}
                onPress={() => setMealsPerDay(num)}
              >
                <MaterialCommunityIcons 
                  name="food" 
                  size={24} 
                  color={mealsPerDay === num ? '#FFF' : '#666'} 
                />
                <Text style={[
                  styles.mealButtonText,
                  mealsPerDay === num && styles.mealButtonTextSelected
                ]}>
                  {num}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Tiempo de preparación</Text>
          <View style={styles.timeButtons}>
            {cookingTimeOptions.map((time) => (
              <Pressable
                key={time}
                style={[
                  styles.timeButton,
                  cookingTime === time && styles.timeButtonSelected
                ]}
                onPress={() => setCookingTime(time)}
              >
                <MaterialCommunityIcons 
                  name="clock" 
                  size={20} 
                  color={cookingTime === time ? '#FFF' : '#666'} 
                />
                <Text style={[
                  styles.timeButtonText,
                  cookingTime === time && styles.timeButtonTextSelected
                ]}>
                  {time} min
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderStepContent = () => {
    const currentStep = steps[step];
    
    switch(currentStep.type) {
      case "goal":
        return renderGoalOptions();
      case "activity":
        return renderActivityOptions();
      case "diet":
        return renderDietTypeOptions();
      case "allergies":
        return renderCheckboxOptions(allergyOptions, selectedAllergies, 'allergies');
      case "dislikes":
        return renderCheckboxOptions(dislikeOptions, selectedDislikes, 'dislikes');
      case "preferences":
        return renderPreferences();
      case "completion":
        return (
          <View style={styles.completionContainer}>
            <MaterialCommunityIcons name="chef-hat" size={60} color="#00D078" />
            <Text style={styles.completionText}>¡Estamos generando tu dieta personalizada basada en tus preferencias!</Text>
          </View>
        );
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
            ((step === 0 && !selectedGoal) || 
             (step === 1 && !selectedActivity) || 
             (step === 2 && !selectedDietType)) && { opacity: 0.5 }
          ]}
          onPress={nextStep}
          disabled={
            (step === 0 && !selectedGoal) || 
            (step === 1 && !selectedActivity) || 
            (step === 2 && !selectedDietType)
          }
        >
          <LinearGradient
            colors={['#00D078', '#007DF0']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {step === steps.length - 1 ? 'GENERAR DIETA' : 'CONTINUAR'}
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
  dietOptionsContainer: {
    paddingBottom: 20,
  },
  dietOption: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  dietOptionSelected: {
    borderColor: '#00D078',
  },
  dietOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D078',
  },
  optionIcon: {
    marginRight: 10,
  },
  dietOptionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    flex: 1,
  },
  dietOptionTitleSelected: {
    color: '#00D078',
  },
  dietOptionDescription: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
    marginLeft: 45,
  },
  recommendedBadge: {
    backgroundColor: '#007DF0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  recommendedBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Kanit_900Black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
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
  preferencesContainer: {
    paddingBottom: 20,
  },
  preferenceSection: {
    marginBottom: 30,
  },
  preferenceTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 15,
  },
  mealsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  mealButtonSelected: {
    backgroundColor: '#007DF0',
    borderColor: '#007DF0',
  },
  mealButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    marginTop: 5,
  },
  mealButtonTextSelected: {
    color: '#FFF',
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '23%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  timeButtonSelected: {
    backgroundColor: '#007DF0',
    borderColor: '#007DF0',
  },
  timeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
    marginTop: 5,
  },
  timeButtonTextSelected: {
    color: '#FFF',
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
    marginTop: 20
  }
});

export default DietaPersonalizada;