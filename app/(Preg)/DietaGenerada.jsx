import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clipboard } from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  background: "#1A1A1A",
  card: "#252525",
  cardAlt: "#2A2A2A",
  border: "#333",
  text: "#FFF",
  textSecondary: "#AAA",
  primary: "#00D078",
  secondary: "#007DF0",
  danger: "#FF3B30",
  warning: "#FFCC00",
  disabled: "rgba(255, 255, 255, 0.5)",
  mealTypes: {
    breakfast: "#FF9500",
    lunch: "#5AC8FA",
    dinner: "#AF52DE",
    snack: "#34C759",
  },
};

const parseDietPlan = (dietText) => {
  const dayRegex = /DÍA \d+|DIA \d+|Día \d+/gi;
  const dayMatches = [...dietText.matchAll(dayRegex)];

  if (dayMatches.length === 0) {
    return [{ title: "Plan Completo", content: dietText }];
  }

  return dayMatches.map((match, index) => ({
    title: match[0],
    content: dietText.substring(
      match.index,
      dayMatches[index + 1] ? dayMatches[index + 1].index : dietText.length
    )
  }));
};

const MealSection = ({ title, content, icon }) => {
  const [expanded, setExpanded] = useState(true);

  const getMealColor = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("desayuno")) return COLORS.mealTypes.breakfast;
    if (lowerTitle.includes("almuerzo") || lowerTitle.includes("comida")) return COLORS.mealTypes.lunch;
    if (lowerTitle.includes("cena")) return COLORS.mealTypes.dinner;
    if (lowerTitle.includes("snack") || lowerTitle.includes("merienda")) return COLORS.mealTypes.snack;
    return COLORS.primary;
  };

  return (
    <View style={styles.mealSection}>
      <TouchableOpacity
        style={[styles.mealHeader, { borderLeftColor: getMealColor() }]}
        onPress={() => setExpanded(!expanded)}
      >
        <MaterialCommunityIcons 
          name={icon || "silverware-fork-knife"} 
          size={24} 
          color={getMealColor()} 
        />
        <Text style={styles.mealTitle}>{title}</Text>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.mealContent}>
          <Text style={styles.mealText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const NutritionInfo = ({ content }) => {
  const extractNutrition = (regex) => {
    const match = content.match(regex);
    return match ? match[1] : null;
  };

  const nutritionData = {
    calories: extractNutrition(/(\d+)\s*(?:kcal|calorías|calorias)/i),
    protein: extractNutrition(/(\d+)(?:\.\d+)?\s*g\s*(?:de)?\s*proteínas/i),
    carbs: extractNutrition(/(\d+)(?:\.\d+)?\s*g\s*(?:de)?\s*(?:carbohidratos|carbos)/i),
    fat: extractNutrition(/(\d+)(?:\.\d+)?\s*g\s*(?:de)?\s*grasas/i)
  };

  if (!Object.values(nutritionData).some(Boolean)) return null;

  return (
    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionTitle}>Información Nutricional</Text>
      <View style={styles.nutritionGrid}>
        {nutritionData.calories && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="fire" size={20} color={COLORS.warning} />
            <Text style={styles.nutritionValue}>{nutritionData.calories}</Text>
            <Text style={styles.nutritionLabel}>kcal</Text>
          </View>
        )}
        {nutritionData.protein && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="food-steak" size={20} color={COLORS.mealTypes.dinner} />
            <Text style={styles.nutritionValue}>{nutritionData.protein}g</Text>
            <Text style={styles.nutritionLabel}>Proteína</Text>
          </View>
        )}
        {nutritionData.carbs && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="bread-slice" size={20} color={COLORS.mealTypes.breakfast} />
            <Text style={styles.nutritionValue}>{nutritionData.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Carbos</Text>
          </View>
        )}
        {nutritionData.fat && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="oil" size={20} color={COLORS.mealTypes.lunch} />
            <Text style={styles.nutritionValue}>{nutritionData.fat}g</Text>
            <Text style={styles.nutritionLabel}>Grasas</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const DietaGenerada = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedDays, setParsedDays] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener userId de AsyncStorage
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);

        // Cargar dieta desde params
        if (params.dietPlan) {
          const parsed = typeof params.dietPlan === 'string' ? 
            JSON.parse(params.dietPlan) : params.dietPlan;
          setDietPlan(parsed.dietPlan || parsed);
          setParsedDays(parseDietPlan(parsed.dietPlan || parsed));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "No se pudo cargar la dieta");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.dietPlan]);

  const copyToClipboard = () => {
    if (dietPlan) {
      Clipboard.setString(dietPlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveDiet = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró ID de usuario. Vuelve a iniciar sesión.');
      return;
    }
  
    try {
      console.log('🚀 Enviando dieta al servidor...', {
        userId,
        dietText: dietPlan.substring(0, 50) + '...', // Muestra solo el inicio
        preferences: params.preferences || {}
      });
  
      // 1. Verificar conexión primero
      const API_URL = await verifyConnection();
      
      // 2. Enviar datos
      const response = await axios.post(`${API_URL}/guardar-dieta`, {
        userId: userId.trim(), // Limpiar espacios
        dietText: dietPlan,
        preferences: params.preferences || {}
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 80000// 8 segundos
      });
  
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        Alert.alert('Éxito', 'Dieta guardada en tu perfil');
        // Opcional: Actualizar estado local si es necesario
      } else {
        throw new Error(response.data.error || 'Error en la respuesta del servidor');
      }
  
    } catch (error) {
      handleSaveError(error);
    }
  };
  
  // Función auxiliar para verificar conexión
  const verifyConnection = async () => {
    try {
      const isEmulator = await checkIfEmulator();
      const baseURL = isEmulator ? 'http://10.0.2.2:3000' : 'http://192.168.1.115:3000';
      
      // Verificar si el servidor está vivo
      await axios.get(`${baseURL}/health-check`, { timeout: 30000 });
      return baseURL;
      
    } catch (error) {
      console.error('🔴 Error de conexión:', error.message);
      throw new Error('No se pudo conectar al servidor. Verifica tu red.');
    }
  };
  
  // Manejador de errores mejorado
  const handleSaveError = (error) => {
    console.error('💥 Error completo:', {
      code: error.code,
      message: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      requestUrl: error.config?.url
    });
  
    let userMessage = 'Error al guardar';
    let technicalMessage = '';
  
    if (error.response) {
      // Errores 4xx/5xx del servidor
      technicalMessage = error.response.data?.error || `Error ${error.response.status}`;
      
      if (error.response.status === 404) {
        userMessage = 'Servicio no disponible (revisa la URL)';
      } else if (error.response.status === 400) {
        userMessage = 'Datos inválidos enviados';
      }
    } else if (error.request) {
      // No hubo respuesta del servidor
      userMessage = 'El servidor no respondió';
      technicalMessage = 'Timeout o red no disponible';
    } else {
      // Error en la configuración
      technicalMessage = error.message;
    }
  
    Alert.alert(
      userMessage,
      technicalMessage,
      [{ text: 'Entendido', style: 'cancel' }]
    );
  };
  
  // Helper para detectar emulador (Android/iOS)
  const checkIfEmulator = async () => {
    try {
      if (Platform.OS === 'android') {
        const isEmulator = await DeviceInfo.isEmulator();
        return isEmulator;
      }
      return false;
    } catch {
      return false;
    }
  };

  const extractMealSections = (content) => {
    const mealPatterns = [
      { regex: /🍳?\s*desayuno:?.*?(?=🍽️|🥗|🍲|🥪|snack|merienda|almuerzo|comida|cena|$)/is, title: "🍳 Desayuno" },
      { regex: /🍽️?\s*almuerzo:?.*?(?=🍳|🥗|🍲|🥪|snack|merienda|desayuno|comida|cena|$)/is, title: "🍽️ Almuerzo" },
      { regex: /🍲?\s*comida:?.*?(?=🍳|🍽️|🥗|🥪|snack|merienda|desayuno|almuerzo|cena|$)/is, title: "🍲 Comida" },
      { regex: /🍽️?\s*cena:?.*?(?=🍳|🥗|🍲|🥪|snack|merienda|desayuno|almuerzo|comida|$)/is, title: "🍽️ Cena" },
      { regex: /🥪?\s*snack:?.*?(?=🍳|🍽️|🥗|🍲|desayuno|merienda|almuerzo|comida|cena|$)/is, title: "🥪 Snack" },
      { regex: /🥗?\s*merienda:?.*?(?=🍳|🍽️|🍲|🥪|snack|desayuno|almuerzo|comida|cena|$)/is, title: "🥗 Merienda" },
    ];

    const meals = mealPatterns
      .map(pattern => {
        const match = content.match(pattern.regex);
        return match ? {
          title: pattern.title,
          content: match[0].replace(new RegExp(`^.*?${pattern.title.split(" ")[1]}:?`, "i"), "").trim()
        } : null;
      })
      .filter(Boolean);

    return meals.length > 0 ? meals : [{ title: "Plan del día", content }];
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando tu dieta...</Text>
      </View>
    );
  }

  if (!dietPlan) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>No se pudo cargar la dieta</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const activeDay = parsedDays[activeDayIndex];
  const mealSections = activeDay ? extractMealSections(activeDay.content) : extractMealSections(dietPlan);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.title}>Tu Plan de Alimentación</Text>
        <Pressable style={styles.copyButton} onPress={copyToClipboard}>
          <MaterialCommunityIcons
            name={copied ? "check" : "content-copy"}
            size={22}
            color={copied ? COLORS.primary : COLORS.text}
          />
        </Pressable>
      </View>

      {parsedDays.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysTabsContainer}>
          {parsedDays.map((day, index) => (
            <Pressable 
              key={index}
              style={[styles.dayTab, index === activeDayIndex && styles.activeDayTab]}
              onPress={() => setActiveDayIndex(index)}
            >
              <Text style={[styles.dayTabText, index === activeDayIndex && styles.activeDayTabText]}>
                {day.title.length > 10 ? `${day.title.substring(0, 10)}...` : day.title}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dietContainer}>
          <NutritionInfo content={activeDay?.content || dietPlan} />
          {mealSections.map((meal, index) => (
            <MealSection key={index} title={meal.title} content={meal.content} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={saveDiet}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="content-save" size={24} color={COLORS.text} />
            <Text style={styles.saveButtonText}>GUARDAR DIETA</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  copyButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    color: COLORS.text,
    fontFamily: "SofiaSans_900Black",
    flex: 1,
    marginLeft: 8,
  },
  daysTabsContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: COLORS.cardAlt,
  },
  activeDayTab: {
    backgroundColor: COLORS.primary,
  },
  dayTabText: {
    color: COLORS.textSecondary,
    fontFamily: "Kanit_700Bold",
    fontSize: 14,
  },
  activeDayTabText: {
    color: COLORS.text,
  },
  dietContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  nutritionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nutritionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: "Kanit_700Bold",
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  nutritionItem: {
    width: "48%",
    backgroundColor: COLORS.cardAlt,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionValue: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
    marginLeft: 8,
  },
  nutritionLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
  mealSection: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.cardAlt,
  },
  mealTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
    flex: 1,
    marginLeft: 12,
  },
  mealContent: {
    padding: 16,
  },
  mealText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
  },
  gradientButton: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: "Kanit_900Black",
    marginLeft: 10,
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.text,
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: "Kanit_900Black",
  },
})

export default DietaGenerada
