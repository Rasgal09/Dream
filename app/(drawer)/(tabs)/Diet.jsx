"use client"

// DietsScreen.js
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  ActivityIndicator
} from "react-native"
import { Feather, AntDesign } from "@expo/vector-icons"
import DietCard from '../../../components/ElComponente'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const { width } = Dimensions.get("window")

// Categorías de dietas
const dietCategories = [
  { id: "all", name: "Todas", icon: "grid" },
  { id: "balanced", name: "Equilibradas", icon: "pie-chart" },
  { id: "keto", name: "Cetogénicas", icon: "trending-up" },
  { id: "sport", name: "Deportivas", icon: "activity" },
  { id: "vegan", name: "Veganas", icon: "leaf" },
  { id: "custom", name: "Personalizadas", icon: "sliders" },
]

// Datos de ejemplo para las dietas
const sampleDiets = [
  {
    id: "1",
    name: "Dieta Mediterránea",
    description: "Rica en grasas saludables, proteínas magras y vegetales frescos",
    category: "Equilibrada",
    color: "#4285F4",
    calories: 2200,
    macros: { protein: 25, carbs: 50, fat: 25 },
    meals: [
      {
        name: "Desayuno",
        foods: ["Yogur griego con miel y nueces", "Pan integral con aceite de oliva", "Fruta fresca"],
        time: "8:00 AM",
      },
      {
        name: "Almuerzo",
        foods: ["Ensalada de quinoa con verduras", "Pescado a la plancha", "Aceitunas"],
        time: "1:00 PM",
      },
      {
        name: "Merienda",
        foods: ["Hummus con palitos de zanahoria", "Puñado de almendras"],
        time: "4:30 PM",
      },
      {
        name: "Cena",
        foods: ["Pollo al limón con hierbas", "Verduras asadas", "Una copa de vino tinto"],
        time: "8:00 PM",
      },
    ],
    duration: 30,
    difficulty: "Media",
    tags: ["antiinflamatoria", "corazón", "longevidad"],
  },
  {
    id: "2",
    name: "Volumen Muscular",
    description: "Alta en proteínas y calorías para ganar masa muscular",
    category: "Deportiva",
    color: "#4CAF50",
    calories: 3200,
    macros: { protein: 35, carbs: 45, fat: 20 },
    meals: [
      {
        name: "Desayuno",
        foods: ["Avena con proteína en polvo y plátano", "Huevos enteros", "Zumo de naranja"],
        time: "7:00 AM",
      },
      {
        name: "Media mañana",
        foods: ["Batido de proteínas", "Sándwich de pavo y queso"],
        time: "10:30 AM",
      },
      {
        name: "Almuerzo",
        foods: ["Pechuga de pollo a la plancha", "Arroz integral", "Verduras salteadas"],
        time: "1:30 PM",
      },
      {
        name: "Merienda",
        foods: ["Yogur griego con granola", "Frutos secos mixtos"],
        time: "4:30 PM",
      },
      {
        name: "Cena",
        foods: ["Salmón al horno", "Patata dulce", "Ensalada verde"],
        time: "8:00 PM",
      },
      {
        name: "Pre-dormir",
        foods: ["Requesón con canela", "Caseína en polvo"],
        time: "10:30 PM",
      },
    ],
    duration: 60,
    difficulty: "Media",
    tags: ["ganancia muscular", "fuerza", "rendimiento"],
  },
  {
    id: "3",
    name: "Dieta Cetogénica",
    description: "Baja en carbohidratos y alta en grasas para promover la cetosis",
    category: "Cetogénica",
    color: "#FF5722",
    calories: 1800,
    macros: { protein: 20, carbs: 5, fat: 75 },
    meals: [
      {
        name: "Desayuno",
        foods: ["Huevos revueltos con aguacate", "Café con aceite MCT", "Bacon"],
        time: "8:00 AM",
      },
      {
        name: "Almuerzo",
        foods: ["Ensalada de atún con mayonesa", "Aceitunas", "Queso"],
        time: "1:00 PM",
      },
      {
        name: "Cena",
        foods: ["Salmón a la plancha", "Espárragos con mantequilla", "Aguacate"],
        time: "8:00 PM",
      },
    ],
    duration: 28,
    difficulty: "Alta",
    tags: ["keto", "baja en carbos", "cetosis"],
  },
  {
    id: "4",
    name: "Plan Vegano",
    description: "Dieta basada en plantas con todos los nutrientes esenciales",
    category: "Vegana",
    color: "#9C27B0",
    calories: 2000,
    macros: { protein: 15, carbs: 60, fat: 25 },
    meals: [
      {
        name: "Desayuno",
        foods: ["Batido verde con espinacas y plátano", "Tostadas con hummus", "Semillas de chía"],
        time: "7:30 AM",
      },
      {
        name: "Almuerzo",
        foods: ["Bowl de quinoa con garbanzos", "Tofu salteado", "Verduras asadas"],
        time: "1:00 PM",
      },
      {
        name: "Merienda",
        foods: ["Batido de proteína vegetal", "Frutos secos"],
        time: "4:30 PM",
      },
      {
        name: "Cena",
        foods: ["Curry de lentejas", "Arroz integral", "Ensalada"],
        time: "7:30 PM",
      },
    ],
    duration: 30,
    difficulty: "Media",
    tags: ["vegano", "plant-based", "sostenible"],
    aiGenerated: true,
  },
];

export default function DietsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showDietDetail, setShowDietDetail] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState(null)
  const [diets, setDiets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId')
        if (!userId) throw new Error('Usuario no identificado')
        
        //const response = await axios.get('http://192.168.1.126:3000/api/diets/user-diets?userId=${encodeURIcomponent(userId)}');
        const response = await axios.get(`http://192.168.1.126:3000/api/diets/user-diets?userId=${encodeURIComponent(userId)}`);

        const formattedDiets = response.data.map(diet => ({
          id: diet._id.toString(),
          name: diet.name,
          description: diet.content,
          category: mapCategory(diet.content),
          color: getCategoryColor(diet.content),
          calories: extractCalories(diet.content),
          macros: extractMacros(diet.content),
          meals: parseMeals(diet.content),
          duration: 30,
          difficulty: "Media",
          tags: extractTags(diet.content)
        }))
        
        setDiets(formattedDiets)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDiets()
  }, [])

  // Funciones de ayuda para parsear el contenido
  const mapCategory = (content) => {
    if (content.includes("ganancia muscular")) return "Deportiva"
    if (content.includes("keto") || content.includes("cetogénica")) return "Cetogénica"
    if (content.includes("vegan") || content.includes("vegetariana")) return "Vegana"
    return "Equilibrada"
  }

  const getCategoryColor = (content) => {
    const category = mapCategory(content)
    switch (category) {
      case "Deportiva": return "#4CAF50"
      case "Cetogénica": return "#FF5722"
      case "Vegana": return "#9C27B0"
      default: return "#4285F4"
    }
  }

  const extractCalories = (content) => {
    const match = content.match(/(\d+,?\d+)\s*-\s*(\d+,?\d+)\s*kcal/) || content.match(/(\d+,?\d+)\s*kcal/)
    return match ? parseInt(match[1].replace(',', '')) : 2000
  }

  const extractMacros = (content) => {
    const macros = { protein: 30, carbs: 40, fat: 30 } // Valores por defecto
    try {
      const proteinMatch = content.match(/(\d+)\s*-\s*(\d+)g\s*proteína/)
      if (proteinMatch) macros.protein = parseInt(proteinMatch[2])
      
      const splitContent = content.split('|')
      splitContent.forEach(part => {
        const macroMatch = part.match(/(\d+)%\s*(proteínas|carbs|grasas)/)
        if (macroMatch) {
          const value = parseInt(macroMatch[1])
          switch (macroMatch[2]) {
            case 'proteínas': macros.protein = value; break
            case 'carbs': macros.carbs = value; break
            case 'grasas': macros.fat = value; break
          }
        }
      })
    } catch (e) {
      console.warn("Error parsing macros:", e)
    }
    return macros
  }

  const parseMeals = (content) => {
    const meals = []
    const lines = content.split('\n')
    let currentMeal = null
    
    lines.forEach(line => {
      const mealMatch = line.match(/###*\s*(Desayuno|Almuerzo|Merienda|Cena|Comida|Pre-entreno|Post-entreno)/i)
      if (mealMatch) {
        if (currentMeal) meals.push(currentMeal)
        currentMeal = {
          name: mealMatch[1],
          foods: [],
          time: getMealTime(mealMatch[1])
        }
      } else if (currentMeal && line.trim().startsWith('-')) {
        currentMeal.foods.push(line.replace(/^-/, '').trim())
      }
    })
    
    if (currentMeal) meals.push(currentMeal)
    return meals
  }

  const getMealTime = (mealName) => {
    switch (mealName.toLowerCase()) {
      case 'desayuno': return "8:00 AM"
      case 'almuerzo': return "1:00 PM"
      case 'merienda': return "4:30 PM"
      case 'cena': return "8:00 PM"
      default: return ""
    }
  }

  const extractTags = (content) => {
    const tags = []
    if (content.includes("muscular")) tags.push("ganancia muscular")
    if (content.includes("keto")) tags.push("cetosis")
    if (content.includes("vegan")) tags.push("plant-based")
    return tags.length > 0 ? tags : ["general"]
  }

  const filteredDiets = diets.filter((diet) => {
    const matchesSearch =
      diet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diet.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || diet.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  // Ver detalles de una dieta
  const viewDietDetails = (diet) => {
    setSelectedDiet(diet)
    setShowDietDetail(true)
  }

  // Renderizar la barra de macronutrientes
  const renderMacroBar = (macros) => {
    if (!macros) return null

    return (
      <View style={styles.macroBarContainer}>
        <View style={[styles.macroBar, { width: `${macros.protein}%`, backgroundColor: "#FF5722" }]} />
        <View style={[styles.macroBar, { width: `${macros.carbs}%`, backgroundColor: "#4CAF50" }]} />
        <View style={[styles.macroBar, { width: `${macros.fat}%`, backgroundColor: "#2196F3" }]} />
      </View>
    )
  }

  // Renderizar la leyenda de macronutrientes
  const renderMacroLegend = (macros) => {
    if (!macros) return null

    return (
      <View style={styles.macroLegend}>
        <View style={styles.macroLegendItem}>
          <View style={[styles.macroLegendColor, { backgroundColor: "#FF5722" }]} />
          <Text style={styles.macroLegendText}>Proteínas {macros.protein}%</Text>
        </View>
        <View style={styles.macroLegendItem}>
          <View style={[styles.macroLegendColor, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.macroLegendText}>Carbohidratos {macros.carbs}%</Text>
        </View>
        <View style={styles.macroLegendItem}>
          <View style={[styles.macroLegendColor, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.macroLegendText}>Grasas {macros.fat}%</Text>
        </View>
      </View>
    )
  }


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00D078" style={styles.loader} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dietas</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="plus-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar dieta..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.searchClearButton} onPress={() => setSearchQuery("")}>
              <AntDesign name="close" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          {dietCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Feather
                name={category.icon}
                size={16}
                color={selectedCategory === category.id ? "white" : "#AAA"}
                style={styles.categoryIcon}
              />
              <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de dietas */}
      <ScrollView style={styles.content}>
        <View style={styles.dietsGrid}>
          {filteredDiets.length > 0 ? (
            filteredDiets.map((diet) => (
              <DietCard 
                key={diet.id} 
                diet={diet} 
                onPress={viewDietDetails} 
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Feather name="search" size={50} color="#AAA" />
              <Text style={styles.noResultsText}>No se encontraron dietas</Text>
              <Text style={styles.noResultsSubtext}>Intenta con otra búsqueda o categoría</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de detalle de dieta */}
      <Modal visible={showDietDetail} transparent={false} animationType="slide">
        <View style={styles.detailContainer}>
          {/* Header del detalle */}
          <View style={styles.detailHeader}>
            <TouchableOpacity style={styles.detailBackButton} onPress={() => setShowDietDetail(false)}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.detailTitle} numberOfLines={1}>
              {selectedDiet?.name}
            </Text>
            <TouchableOpacity style={styles.detailMenuButton}>
              <Feather name="more-vertical" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {selectedDiet && (
            <ScrollView style={styles.detailContent}>
              {/* Banner de la dieta */}
              <View style={[styles.detailBanner, { backgroundColor: selectedDiet.color }]}>
                <View style={styles.detailIconLarge}>
                  <Feather
                    name={
                      selectedDiet.category === "Cetogénica"
                        ? "trending-up"
                        : selectedDiet.category === "Deportiva"
                          ? "activity"
                          : selectedDiet.category === "Adelgazamiento"
                            ? "trending-down"
                            : "pie-chart"
                    }
                    size={40}
                    color="white"
                  />
                </View>
                {selectedDiet.aiGenerated && (
                  <View style={styles.detailAiBadge}>
                    <Feather name="cpu" size={16} color="white" />
                    <Text style={styles.detailAiBadgeText}>Generada por IA</Text>
                  </View>
                )}
              </View>

              {/* Información básica */}
              <View style={styles.detailInfoContainer}>
                <Text style={styles.detailName}>{selectedDiet.name}</Text>
                <Text style={styles.detailDescription}>{selectedDiet.description}</Text>

                {/* Tags */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.detailTagsContainer}
                >
                  {selectedDiet.tags.map((tag, index) => (
                    <View key={index} style={styles.detailTag}>
                      <Text style={styles.detailTagText}>#{tag}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Estadísticas */}
                <View style={styles.detailStatsContainer}>
                  <View style={styles.detailStat}>
                    <Feather name="zap" size={20} color="#FF9800" />
                    <Text style={styles.detailStatValue}>{selectedDiet.calories}</Text>
                    <Text style={styles.detailStatLabel}>Calorías</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <Feather name="calendar" size={20} color="#4CAF50" />
                    <Text style={styles.detailStatValue}>{selectedDiet.duration}</Text>
                    <Text style={styles.detailStatLabel}>Días</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <Feather name="clock" size={20} color="#2196F3" />
                    <Text style={styles.detailStatValue}>{selectedDiet.meals.length}</Text>
                    <Text style={styles.detailStatLabel}>Comidas</Text>
                  </View>
                  <View style={styles.detailStat}>
                    <Feather name="bar-chart-2" size={20} color="#9C27B0" />
                    <Text style={styles.detailStatValue}>{selectedDiet.difficulty}</Text>
                    <Text style={styles.detailStatLabel}>Dificultad</Text>
                  </View>
                </View>

                {/* Macronutrientes */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Macronutrientes</Text>
                  {renderMacroBar(selectedDiet.macros)}
                  {renderMacroLegend(selectedDiet.macros)}
                </View>

                {/* Plan de comidas */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Plan de comidas</Text>

                  {selectedDiet.meals.map((meal, index) => (
                    <View key={index} style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>{meal.name}</Text>
                          <Text style={styles.mealTime}>{meal.time}</Text>
                        </View>
                        <TouchableOpacity style={styles.mealEditButton}>
                          <Feather name="edit-2" size={16} color="#999" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.mealFoods}>
                        {meal.foods.map((food, foodIndex) => (
                          <View key={foodIndex} style={styles.foodItem}>
                            <View style={styles.foodDot} />
                            <Text style={styles.foodText}>{food}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>

                {/* Botones de acción */}
                <View style={styles.detailActionsContainer}>
                  <TouchableOpacity style={styles.detailActionButton}>
                    <Feather name="calendar" size={20} color="white" style={styles.actionButtonIcon} />
                    <Text style={styles.actionButtonText}>Iniciar Plan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.detailActionButton, styles.secondaryActionButton]}>
                    <Feather name="edit" size={20} color="white" style={styles.actionButtonIcon} />
                    <Text style={styles.actionButtonText}>Personalizar</Text>
                  </TouchableOpacity>
                </View>

                {/* Espacio al final */}
                <View style={styles.detailFooterSpace} />
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  )
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    width: "100%",
  },
  noResultsText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  noResultsSubtext: {
    color: "#B1B1B1",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF", // Usando el color de texto de la app
  },
  headerButton: {
    padding: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF", // Usando el color de texto de la app
    paddingVertical: 12,
    fontSize: 16,
  },
  searchClearButton: {
    padding: 5,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesScrollView: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: "#007DF0", // Usando el color del gradiente de la app
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  dietsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    zIndex: 10,
  },
  detailBackButton: {
    padding: 5,
  },
  detailTitle: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  detailMenuButton: {
    padding: 5,
  },
  detailContent: {
    flex: 1,
  },
  detailBanner: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  detailIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailAiBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  detailAiBadgeText: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 6,
  },
  detailInfoContainer: {
    padding: 20,
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
  },
  detailName: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailDescription: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  detailTagsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  detailTag: {
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  detailTagText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 12,
  },
  detailStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  detailStat: {
    alignItems: "center",
  },
  detailStatValue: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  detailStatLabel: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 12,
    marginTop: 2,
  },
  detailSection: {
    marginBottom: 25,
  },
  detailSectionTitle: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  macroBarContainer: {
    height: 20,
    borderRadius: 10,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 10,
  },
  macroBar: {
    height: "100%",
  },
  macroLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  macroLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  macroLegendText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 12,
  },
  mealCard: {
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 16,
    fontWeight: "600",
  },
  mealTime: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 12,
    marginTop: 2,
  },
  mealEditButton: {
    padding: 5,
  },
  mealFoods: {
    marginLeft: 5,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  foodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00D078", // Usando el color del gradiente de la app
    marginRight: 8,
  },
  foodText: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 14,
  },
  detailActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  detailActionButton: {
    flex: 1,
    backgroundColor: "#00D078", // Usando el color del gradiente de la app
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },
  secondaryActionButton: {
    backgroundColor: "#007DF0", // Usando el color del gradiente de la app
    marginRight: 0,
    marginLeft: 10,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 16,
    fontWeight: "600",
  },
  detailFooterSpace: {
    height: 40,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A'
  },
  errorText: {
    color: '#FF4444',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    padding: 20
  },
  retryButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#00D078',
    borderRadius: 10
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold'
  },
});