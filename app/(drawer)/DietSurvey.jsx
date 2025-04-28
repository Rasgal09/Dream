import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Dimensions, 
  Animated, 
  FlatList,
  Platform,
  TextInput,
  StatusBar
} from 'react-native';
import { useFonts, SofiaSans_900Black } from '@expo-google-fonts/sofia-sans';
import { Kanit_900Black } from '@expo-google-fonts/kanit';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Colores de la app
const COLORS = {
  background: '#1A1A1A',
  card: '#252525',
  border: '#333',
  text: '#FFF',
  textSecondary: '#999',
  primary: '#00D078',
  secondary: '#007DF0',
  danger: '#FF3B30',
  disabled: 'rgba(255, 255, 255, 0.5)'
};

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

  // Nueva función para retroceder un paso
  const prevStep = () => {
    if (step > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 150,
          useNativeDriver: true
        })
      ]).start(() => {
        setStep(step - 1);
        Animated.parallel([
          Animated.timing(progressAnim, {
            toValue: (step - 1) / (steps.length - 1),
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
    }
  };

  const renderDietTypeOptions = () => {
    return (
      <FlatList
        data={dietTypeOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.dietOption,
              selectedDietType === item.value && styles.dietOptionSelected
            ]}
            onPress={() => setSelectedDietType(item.value)}
            android_ripple={{ color: 'rgba(0, 208, 120, 0.1)' }}
          >
            <View style={styles.dietOptionHeader}>
              <View style={styles.radioButton}>
                {selectedDietType === item.value && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color={selectedDietType === item.value ? COLORS.primary : COLORS.textSecondary} 
                style={styles.optionIcon}
              />
              <Text style={[
                styles.dietOptionTitle,
                selectedDietType === item.value && styles.dietOptionTitleSelected
              ]}>
                {item.label}
              </Text>
            </View>
            <Text style={styles.dietOptionDescription}>{item.description}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.dietOptionsContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderGoalOptions = () => {
    return (
      <FlatList
        data={goalOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.optionCard,
              selectedGoal === item.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedGoal(item.value)}
            android_ripple={{ color: 'rgba(0, 208, 120, 0.1)' }}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color={selectedGoal === item.value ? COLORS.primary : COLORS.textSecondary} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedGoal === item.value && styles.optionCardTitleSelected
              ]}>
                {item.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{item.description}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderActivityOptions = () => {
    return (
      <FlatList
        data={activityOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.optionCard,
              selectedActivity === item.value && styles.optionCardSelected
            ]}
            onPress={() => setSelectedActivity(item.value)}
            android_ripple={{ color: 'rgba(0, 208, 120, 0.1)' }}
          >
            <View style={styles.optionHeader}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color={selectedActivity === item.value ? COLORS.primary : COLORS.textSecondary} 
              />
              <Text style={[
                styles.optionCardTitle,
                selectedActivity === item.value && styles.optionCardTitleSelected
              ]}>
                {item.label}
              </Text>
            </View>
            <Text style={styles.optionCardDescription}>{item.description}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderCheckboxOptions = (options, selectedValues, type) => {
    const isAllergies = type === 'allergies';
    
    // Crear un array con las opciones y añadir la opción "Otros" al final
    const allOptions = [...options, { label: "Otros", value: "other" }];
    
    return (
      <View style={styles.checkboxMainContainer}>
        <FlatList
          data={allOptions}
          keyExtractor={(item, index) => `${item.value}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.checkboxRow}
          renderItem={({ item }) => {
            if (item.value === "other") {
              return (
                <Pressable
                  style={styles.checkboxOption}
                  onPress={() => {
                    if (isAllergies) {
                      setShowOtherAllergyInput(!showOtherAllergyInput);
                    } else {
                      setShowOtherDislikeInput(!showOtherDislikeInput);
                    }
                  }}
                  android_ripple={{ color: 'rgba(0, 208, 120, 0.1)' }}
                >
                  <View style={styles.checkbox}>
                    {isAllergies ? 
                      (selectedAllergies.some(a => !allergyOptions.some(o => o.value === a)) && (
                        <View style={styles.checkboxSelected} />
                      )) : 
                      (selectedDislikes.some(d => !dislikeOptions.some(o => o.value === d)) && (
                        <View style={styles.checkboxSelected} />
                      ))
                    }
                  </View>
                  <Text style={styles.checkboxLabel}>Otros</Text>
                </Pressable>
              );
            }
            
            return (
              <Pressable
                style={styles.checkboxOption}
                onPress={() => toggleSelection(type, item.value)}
                android_ripple={{ color: 'rgba(0, 208, 120, 0.1)' }}
              >
                <View style={styles.checkbox}>
                  {selectedValues.includes(item.value) && (
                    <View style={styles.checkboxSelected} />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>{item.label}</Text>
              </Pressable>
            );
          }}
          contentContainerStyle={styles.checkboxContainer}
          showsVerticalScrollIndicator={false}
        />
        
        {(showOtherAllergyInput && isAllergies) && (
          <View style={styles.otherInputContainer}>
            <TextInput
              style={styles.otherInput}
              placeholder="Escribe tu alergia o intolerancia"
              value={otherAllergy}
              onChangeText={setOtherAllergy}
              placeholderTextColor={COLORS.textSecondary}
            />
            <Pressable
              style={styles.addButton}
              onPress={addOtherAllergy}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
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
              placeholderTextColor={COLORS.textSecondary}
            />
            <Pressable
              style={styles.addButton}
              onPress={addOtherDislike}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Text style={styles.addButtonText}>Añadir</Text>
            </Pressable>
          </View>
        )}
        
        {selectedAllergies.some(a => !allergyOptions.some(o => o.value === a)) && isAllergies && (
          <View style={styles.addedItemsContainer}>
            <FlatList
              data={selectedAllergies.filter(a => !allergyOptions.some(o => o.value === a))}
              keyExtractor={(item, index) => `added-allergy-${index}`}
              horizontal
              renderItem={({ item }) => (
                <View style={styles.addedItem}>
                  <Text style={styles.addedItemText}>{item}</Text>
                  <Pressable
                    onPress={() => setSelectedAllergies(selectedAllergies.filter(a => a !== item))}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={COLORS.danger} />
                  </Pressable>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        
        {selectedDislikes.some(d => !dislikeOptions.some(o => o.value === d)) && !isAllergies && (
          <View style={styles.addedItemsContainer}>
            <FlatList
              data={selectedDislikes.filter(d => !dislikeOptions.some(o => o.value === d))}
              keyExtractor={(item, index) => `added-dislike-${index}`}
              horizontal
              renderItem={({ item }) => (
                <View style={styles.addedItem}>
                  <Text style={styles.addedItemText}>{item}</Text>
                  <Pressable
                    onPress={() => setSelectedDislikes(selectedDislikes.filter(d => d !== item))}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialCommunityIcons name="close" size={20} color={COLORS.danger} />
                  </Pressable>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
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
                android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
              >
                <MaterialCommunityIcons 
                  name="food" 
                  size={24} 
                  color={mealsPerDay === num ? COLORS.text : COLORS.textSecondary} 
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
                android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
              >
                <MaterialCommunityIcons 
                  name="clock" 
                  size={20} 
                  color={cookingTime === time ? COLORS.text : COLORS.textSecondary} 
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
            <MaterialCommunityIcons name="chef-hat" size={60} color={COLORS.primary} />
            <Text style={styles.completionText}>¡Estamos generando tu dieta personalizada basada en tus preferencias!</Text>
            <View style={styles.loadingIndicator}>
              <Animated.View 
                style={[
                  styles.loadingBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    return (
      (step === 0 && !selectedGoal) || 
      (step === 1 && !selectedActivity) || 
      (step === 2 && !selectedDietType)
    );
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header con botón de retroceso */}
      <View style={styles.header}>
        {step > 0 && (
          <Pressable 
            style={styles.backButton} 
            onPress={prevStep}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', radius: 20 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
          </Pressable>
        )}
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
            isNextButtonDisabled() && styles.continueButtonDisabled
          ]}
          onPress={nextStep}
          disabled={isNextButtonDisabled()}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {step === steps.length - 1 ? 'GENERAR DIETA' : 'CONTINUAR'}
            </Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 10
  },
  progressContainer: {
    flex: 1
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'SofiaSans_900Black'
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 4
  },
  contentContainer: {
    flex: 1
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 10,
    fontFamily: 'SofiaSans_900Black'
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
    backgroundColor: 'rgba(0, 208, 120, 0.05)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionCardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    marginLeft: 10,
    flex: 1,
  },
  optionCardTitleSelected: {
    color: COLORS.primary,
  },
  optionCardDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
    marginLeft: 34,
  },
  dietOptionsContainer: {
    paddingBottom: 20,
  },
  dietOption: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  dietOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(0, 208, 120, 0.05)',
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
    borderColor: COLORS.textSecondary,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionIcon: {
    marginRight: 10,
  },
  dietOptionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    flex: 1,
  },
  dietOptionTitleSelected: {
    color: COLORS.primary,
  },
  dietOptionDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
    marginLeft: 45,
  },
  checkboxMainContainer: {
    flex: 1,
  },
  checkboxContainer: {
    paddingBottom: 10,
  },
  checkboxRow: {
    justifyContent: 'space-between',
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
    borderColor: COLORS.textSecondary,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'SofiaSans_900Black',
    flex: 1,
  },
  otherInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  otherInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontFamily: 'SofiaSans_900Black',
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
    fontFamily: 'SofiaSans_900Black',
  },
  addedItemsContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 15,
  },
  addedItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: COLORS.text,
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
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  mealButtonSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  mealButtonText: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'SofiaSans_900Black',
    marginTop: 5,
  },
  mealButtonTextSelected: {
    color: COLORS.text,
  },
  timeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '23%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  timeButtonSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  timeButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: 'SofiaSans_900Black',
    marginTop: 5,
  },
  timeButtonTextSelected: {
    color: COLORS.text,
  },
  continueButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: 'Kanit_900Black',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionText: {
    color: COLORS.text,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'SofiaSans_900Black',
    marginTop: 20,
    marginBottom: 30,
  },
  loadingIndicator: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 20,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  }
});

export default DietaPersonalizada;