// components/DietaGenerada.jsx
import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  TouchableOpacity,

} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Clipboard } from "react-native"
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native"

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
}

// Función para parsear el texto de la dieta en secciones estructuradas
const parseDietPlan = (dietText) => {
  // Intentamos identificar días en el plan
  const dayRegex = /DÍA \d+|DIA \d+|Día \d+/gi
  const dayMatches = [...dietText.matchAll(dayRegex)]

  // Si no encontramos días específicos, tratamos el plan como un día único
  if (dayMatches.length === 0) {
    return [
      {
        title: "Plan Completo",
        content: dietText,
      },
    ]
  }

  // Dividimos el texto por días
  const days = []
  for (let i = 0; i < dayMatches.length; i++) {
    const currentMatch = dayMatches[i]
    const nextMatch = dayMatches[i + 1]

    const startIndex = currentMatch.index
    const endIndex = nextMatch ? nextMatch.index : dietText.length

    const dayContent = dietText.substring(startIndex, endIndex)

    days.push({
      title: currentMatch[0],
      content: dayContent,
    })
  }

  return days
}

// Componente para cada tipo de comida
const MealSection = ({ title, content, icon }) => {
  const [expanded, setExpanded] = useState(true)

  // Determinar el color basado en el tipo de comida
  const getMealColor = () => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("desayuno")) return COLORS.mealTypes.breakfast
    if (lowerTitle.includes("almuerzo") || lowerTitle.includes("comida")) return COLORS.mealTypes.lunch
    if (lowerTitle.includes("cena")) return COLORS.mealTypes.dinner
    if (lowerTitle.includes("snack") || lowerTitle.includes("merienda")) return COLORS.mealTypes.snack
    return COLORS.primary
  }

  const mealColor = getMealColor()

  // Determinar el icono basado en el tipo de comida
  const getMealIcon = () => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("desayuno")) return "food-croissant"
    if (lowerTitle.includes("almuerzo") || lowerTitle.includes("comida")) return "food"
    if (lowerTitle.includes("cena")) return "food-turkey"
    if (lowerTitle.includes("snack") || lowerTitle.includes("merienda")) return "food-apple"
    return icon || "silverware-fork-knife"
  }

  return (
    <View style={styles.mealSection}>
      <TouchableOpacity
        style={[styles.mealHeader, { borderLeftColor: mealColor }]}
        onPress={() => setExpanded(!expanded)}
      >
        <MaterialCommunityIcons name={getMealIcon()} size={24} color={mealColor} />
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
  )
}

// Componente para cada día del plan
const DaySection = ({ day, index, activeDayIndex, setActiveDayIndex }) => {
  const isActive = index === activeDayIndex

  return (
    <TouchableOpacity style={[styles.dayTab, isActive && styles.activeDayTab]} onPress={() => setActiveDayIndex(index)}>
      <Text style={[styles.dayTabText, isActive && styles.activeDayTabText]}>
        {day.title.length > 10 ? day.title.substring(0, 10) + "..." : day.title}
      </Text>
    </TouchableOpacity>
  )
}

// Componente para mostrar información nutricional
const NutritionInfo = ({ content }) => {
  // Intentamos extraer información nutricional del texto
  const caloriesMatch = content.match(/(\d+)\s*(?:kcal|calorías|calorias)/i)
  const proteinMatch = content.match(/(\d+)(?:\.\d+)?\s*g\s*(?:de)?\s*proteínas/i)
  const carbsMatch = content.match(/(\d+)(?:\.\d+)?\s*g\s*(?:de)?\s*(?:carbohidratos|carbos)/i)
  const fatMatch = content.match(/(\d+)(?:\.\d+)?\s*g\s*(?:de)?\s*grasas/i)

  if (!caloriesMatch && !proteinMatch && !carbsMatch && !fatMatch) {
    return null
  }

  return (
    <View style={styles.nutritionCard}>
      <Text style={styles.nutritionTitle}>Información Nutricional</Text>
      <View style={styles.nutritionGrid}>
        {caloriesMatch && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="fire" size={20} color={COLORS.warning} />
            <Text style={styles.nutritionValue}>{caloriesMatch[1]}</Text>
            <Text style={styles.nutritionLabel}>kcal</Text>
          </View>
        )}
        {proteinMatch && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="food-steak" size={20} color={COLORS.mealTypes.dinner} />
            <Text style={styles.nutritionValue}>{proteinMatch[1]}g</Text>
            <Text style={styles.nutritionLabel}>Proteína</Text>
          </View>
        )}
        {carbsMatch && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="bread-slice" size={20} color={COLORS.mealTypes.breakfast} />
            <Text style={styles.nutritionValue}>{carbsMatch[1]}g</Text>
            <Text style={styles.nutritionLabel}>Carbos</Text>
          </View>
        )}
        {fatMatch && (
          <View style={styles.nutritionItem}>
            <MaterialCommunityIcons name="oil" size={20} color={COLORS.mealTypes.lunch} />
            <Text style={styles.nutritionValue}>{fatMatch[1]}g</Text>
            <Text style={styles.nutritionLabel}>Grasas</Text>
          </View>
        )}
      </View>
    </View>
  )
}

// Componente principal
const DietaGenerada = (route ) => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams()
  const [dietPlan, setDietPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [parsedDays, setParsedDays] = useState([])
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [copied, setCopied] = useState(false)

    // Función auxiliar para extraer información nutricional (COLOCAR ANTES DE handleSaveDiet)
    const extractNutritionalInfo = (content) => {
        return {
            calories: content.match(/(\d+)\s*(?:kcal|calorías)/i)?.[1] || "N/A",
            protein: content.match(/(\d+)g\s*proteínas/i)?.[1] || "N/A",
            carbs: content.match(/(\d+)g\s*carbohidratos/i)?.[1] || "N/A",
            fats: content.match(/(\d+)g\s*grasas/i)?.[1] || "N/A"
        };
    };

    const handleSaveDiet = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        
  
        const dietData = {
          name: parsedDays[0]?.title || "Mi Dieta Personalizada",
          content: dietPlan,
          days: parsedDays,
          nutritionalInfo: extractNutritionalInfo(parsedDays[activeDayIndex].content)
        };
  
        await axios.post('http://192.168.1.115:3000/api/diets/create', {
          userId,
          dietData
        });
  
        Alert.alert("Éxito", "Dieta guardada exitosamente");
        router.push('/mis-dietas');
  
      } catch (error) {
        console.error("Error al guardar:", error);
        Alert.alert("Error", error.response?.data?.error || "Error desconocido");
      }
    };
  
    useEffect(() => {
      if (params.dietPlan) {
        try {
          const parsedPlan = JSON.parse(params.dietPlan);
          setDietPlan(parsedPlan);
          const days = parseDietPlan(parsedPlan);
          setParsedDays(days);
        } catch (e) {
          console.error("Error parsing diet plan:", e);
        } finally {
          setLoading(false);
        }
      }
    }, [params.dietPlan]);
  

  const copyToClipboard = () => {
    if (dietPlan) {
      Clipboard.setString(dietPlan)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Función para extraer secciones de comidas del texto del día
  const extractMealSections = (dayContent) => {
    // Patrones comunes para tipos de comidas
    const mealPatterns = [
      { regex: /🍳?\s*desayuno:?.*?(?=🍽️|🥗|🍲|🥪|snack|merienda|almuerzo|comida|cena|$)/is, title: "🍳 Desayuno" },
      { regex: /🍽️?\s*almuerzo:?.*?(?=🍳|🥗|🍲|🥪|snack|merienda|desayuno|comida|cena|$)/is, title: "🍽️ Almuerzo" },
      { regex: /🍲?\s*comida:?.*?(?=🍳|🍽️|🥗|🥪|snack|merienda|desayuno|almuerzo|cena|$)/is, title: "🍲 Comida" },
      { regex: /🍽️?\s*cena:?.*?(?=🍳|🥗|🍲|🥪|snack|merienda|desayuno|almuerzo|comida|$)/is, title: "🍽️ Cena" },
      { regex: /🥪?\s*snack:?.*?(?=🍳|🍽️|🥗|🍲|desayuno|merienda|almuerzo|comida|cena|$)/is, title: "🥪 Snack" },
      { regex: /🥗?\s*merienda:?.*?(?=🍳|🍽️|🍲|🥪|snack|desayuno|almuerzo|comida|cena|$)/is, title: "🥗 Merienda" },
    ]

    const meals = []

    // Extraer cada tipo de comida
    for (const pattern of mealPatterns) {
      const match = dayContent.match(pattern.regex)
      if (match && match[0].trim()) {
        meals.push({
          title: pattern.title,
          content: match[0].replace(new RegExp(`^.*?${pattern.title.split(" ")[1]}:?`, "i"), "").trim(),
        })
      }
    }

    // Si no se encontraron comidas específicas, devolver el contenido completo
    if (meals.length === 0) {
      return [
        {
          title: "Plan del día",
          content: dayContent,
        },
      ]
    }

    return meals
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando tu dieta personalizada...</Text>
      </View>
    )
  }

  if (!dietPlan) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>No se pudo cargar la dieta. Por favor intenta nuevamente.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </View>
    )
  }

  const activeDay = parsedDays[activeDayIndex]
  const mealSections = activeDay ? extractMealSections(activeDay.content) : []

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
            <DaySection
              key={index}
              day={day}
              index={index}
              activeDayIndex={activeDayIndex}
              setActiveDayIndex={setActiveDayIndex}
            />
          ))}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.dietContainer}>
          {/* Información nutricional si está disponible */}
          <NutritionInfo content={activeDay.content} />

          {/* Secciones de comidas */}
          {mealSections.map((meal, index) => (
            <MealSection key={index} title={meal.title} content={meal.content} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSaveDiet}>
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
  )
}

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
