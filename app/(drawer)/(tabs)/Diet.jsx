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
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { Feather, AntDesign } from "@expo/vector-icons"

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

// Objetivos para la generación de dietas
const dietGoals = [
  { id: "weight_loss", name: "Pérdida de peso", icon: "trending-down" },
  { id: "muscle_gain", name: "Ganancia muscular", icon: "trending-up" },
  { id: "maintenance", name: "Mantenimiento", icon: "activity" },
  { id: "health", name: "Salud general", icon: "heart" },
  { id: "energy", name: "Energía", icon: "zap" },
  { id: "custom", name: "Personalizado", icon: "sliders" },
]

export default function DietsScreen({ navigation }) {
  const [diets, setDiets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showDietDetail, setShowDietDetail] = useState(false)
  const [selectedDiet, setSelectedDiet] = useState(null)
  const [generatingDiet, setGeneratingDiet] = useState(false)
  const [dietPreferences, setDietPreferences] = useState({
    goal: "weight_loss",
    calories: 2000,
    restrictions: [],
    meals: 4,
  })
  const [availableRestrictions] = useState([
    { id: "gluten", name: "Sin Gluten" },
    { id: "lactose", name: "Sin Lactosa" },
    { id: "vegan", name: "Vegano" },
    { id: "vegetarian", name: "Vegetariano" },
    { id: "nuts", name: "Sin Frutos Secos" },
    { id: "sugar", name: "Sin Azúcar" },
  ])

  // Fetch diets from API
  useEffect(() => {
    fetchDiets()
  }, [])

  const fetchDiets = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:3001/api/dieta")
      const data = await response.json()

      // Transform the data to match the expected format
      const transformedData = data.map((item, index) => ({
        id: item._id || (index + 1).toString(),
        name: item.titulo || `Dieta ${index + 1}`,
        description: item.descripcion || "Sin descripción",
        category: determineCategory(item),
        color: getColorForDiet(index),
        calories: item.calorias || 2000,
        macros: {
          protein: item.proteinas || 25,
          carbs: 50, // Default value if not provided
          fat: 25, // Default value if not provided
        },
        meals: generateMealsFromData(item),
        duration: 30, // Default value
        difficulty: "Media", // Default value
        tags: generateTagsFromData(item),
      }))

      setDiets(transformedData)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching diets:", err)
      setError("Error al cargar las dietas")
      setLoading(false)

      // Fallback to initial diets if API fails
      setDiets(getFallbackDiets())
    }
  }

  // Helper function to determine category based on diet data
  const determineCategory = (diet) => {
    if (diet.proteinas > 30) return "Deportiva"
    if (diet.carbohidratos < 20) return "Cetogénica"
    return "Equilibrada"
  }

  // Helper function to get a color based on index
  const getColorForDiet = (index) => {
    const colors = ["#4285F4", "#4CAF50", "#FF5722", "#9C27B0", "#FF9800", "#2196F3"]
    return colors[index % colors.length]
  }

  // Helper function to generate meals from diet data
  const generateMealsFromData = (diet) => {
    // If the diet has a specific comida field, use it
    if (diet.comida) {
      return [
        {
          name: "Comida principal",
          foods: diet.comida.split(",").map((item) => item.trim()),
          time: "1:00 PM",
        },
      ]
    }

    // Default meals
    return [
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
    ]
  }

  // Helper function to generate tags from diet data
  const generateTagsFromData = (diet) => {
    const tags = []

    if (diet.proteinas > 30) tags.push("proteica")
    if (diet.carbohidratos < 20) tags.push("baja en carbos")
    if (diet.calorias < 1800) tags.push("baja en calorías")
    if (diet.calorias > 2500) tags.push("alta en calorías")

    // Add a default tag if none were generated
    if (tags.length === 0) tags.push("equilibrada")

    return tags
  }

  // Fallback diets in case API fails
  const getFallbackDiets = () => {
    return [
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
    ]
  }

  // Filtrar dietas por búsqueda y categoría
  const filteredDiets = diets.filter((diet) => {
    const matchesSearch =
      diet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diet.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || diet.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  // Simular generación de dieta con IA
  const generateDiet = () => {
    setGeneratingDiet(true)

    // Simulamos el tiempo de procesamiento de la IA
    setTimeout(() => {
      const goalColors = {
        weight_loss: "#FF5722",
        muscle_gain: "#4CAF50",
        maintenance: "#2196F3",
        health: "#9C27B0",
        energy: "#FF9800",
        custom: "#795548",
      }

      const newDiet = {
        id: Date.now().toString(),
        name: `Plan ${
          dietPreferences.goal === "weight_loss"
            ? "Adelgazamiento"
            : dietPreferences.goal === "muscle_gain"
              ? "Volumen"
              : dietPreferences.goal === "health"
                ? "Salud"
                : "Personalizado"
        }`,
        description: `Dieta personalizada de ${dietPreferences.calories} calorías con ${dietPreferences.meals} comidas diarias`,
        category:
          dietPreferences.goal === "weight_loss"
            ? "Adelgazamiento"
            : dietPreferences.goal === "muscle_gain"
              ? "Deportiva"
              : dietPreferences.goal === "health"
                ? "Equilibrada"
                : "Personalizada",
        color: goalColors[dietPreferences.goal] || "#4285F4",
        calories: dietPreferences.calories,
        macros:
          dietPreferences.goal === "weight_loss"
            ? { protein: 30, carbs: 40, fat: 30 }
            : dietPreferences.goal === "muscle_gain"
              ? { protein: 35, carbs: 45, fat: 20 }
              : { protein: 25, carbs: 50, fat: 25 },
        meals: generateMeals(dietPreferences.meals),
        duration: 28,
        difficulty: "Media",
        tags: ["personalizada", "ia", dietPreferences.goal],
        aiGenerated: true,
      }

      setDiets([newDiet, ...diets])
      setGeneratingDiet(false)
      setShowGenerateModal(false)

      // Mostrar la dieta recién generada
      setSelectedDiet(newDiet)
      setShowDietDetail(true)
    }, 3000)
  }

  // Generar comidas de ejemplo para la dieta generada por IA
  const generateMeals = (mealCount) => {
    const mealOptions = [
      { name: "Desayuno", time: "8:00 AM", foods: ["Avena con frutas", "Huevos revueltos", "Tostadas integrales"] },
      { name: "Media mañana", time: "11:00 AM", foods: ["Yogur con nueces", "Fruta fresca", "Batido de proteínas"] },
      { name: "Almuerzo", time: "2:00 PM", foods: ["Pechuga de pollo", "Arroz integral", "Ensalada mixta"] },
      { name: "Merienda", time: "5:00 PM", foods: ["Tostadas con aguacate", "Batido verde", "Frutos secos"] },
      { name: "Cena", time: "8:00 PM", foods: ["Pescado al horno", "Verduras al vapor", "Quinoa"] },
      { name: "Pre-dormir", time: "10:30 PM", foods: ["Requesón", "Proteína de caseína", "Infusión"] },
    ]

    return mealOptions.slice(0, mealCount).map((meal) => ({
      ...meal,
      foods: meal.foods.slice(0, Math.floor(Math.random() * 2) + 2), // 2-3 alimentos por comida
    }))
  }

  // Ver detalles de una dieta
  const viewDietDetails = (diet) => {
    setSelectedDiet(diet)
    setShowDietDetail(true)
  }

  // Calcular el total de calorías consumidas en un día
  const calculateDailyCalories = (meals) => {
    // En una app real, esto calcularía las calorías basadas en los alimentos
    // Aquí simplemente devolvemos el valor almacenado
    return selectedDiet?.calories || 0
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

  // Alternar una restricción dietética
  const toggleRestriction = (restrictionId) => {
    setDietPreferences((prev) => {
      if (prev.restrictions.includes(restrictionId)) {
        return {
          ...prev,
          restrictions: prev.restrictions.filter((id) => id !== restrictionId),
        }
      } else {
        return {
          ...prev,
          restrictions: [...prev.restrictions, restrictionId],
        }
      }
    })
  }

  // Renderizar icono para la dieta
  const renderDietIcon = (diet) => {
    const iconName =
      diet.category === "Cetogénica"
        ? "trending-up"
        : diet.category === "Deportiva"
          ? "activity"
          : diet.category === "Adelgazamiento"
            ? "trending-down"
            : "pie-chart"

    return (
      <View style={[styles.dietIconContainer, { backgroundColor: diet.color }]}>
        <Feather name={iconName} size={24} color="white" />
      </View>
    )
  }

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Cargando dietas...</Text>
      </View>
    )
  }

  // Mostrar mensaje de error si falla la carga
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Feather name="alert-circle" size={50} color="#FF5722" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDiets}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dietas</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => setShowGenerateModal(true)}>
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
              <TouchableOpacity key={diet.id} style={styles.dietCard} onPress={() => viewDietDetails(diet)}>
                <View style={[styles.dietHeader, { backgroundColor: diet.color }]}>
                  {renderDietIcon(diet)}
                  {diet.aiGenerated && (
                    <View style={styles.aiGeneratedBadge}>
                      <Feather name="cpu" size={12} color="white" />
                      <Text style={styles.aiGeneratedText}>IA</Text>
                    </View>
                  )}
                </View>
                <View style={styles.dietCardContent}>
                  <Text style={styles.dietName}>{diet.name}</Text>
                  <Text style={styles.dietDescription} numberOfLines={2}>
                    {diet.description}
                  </Text>
                  <View style={styles.dietCardFooter}>
                    <View style={styles.dietCalories}>
                      <Feather name="zap" size={14} color="#FF9800" />
                      <Text style={styles.dietCaloriesText}>{diet.calories} kcal</Text>
                    </View>
                    <View style={styles.dietDuration}>
                      <Feather name="calendar" size={14} color="#4CAF50" />
                      <Text style={styles.dietDurationText}>{diet.duration} días</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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

      {/* Modal para generar dieta con IA */}
      <Modal visible={showGenerateModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Generar Dieta con IA</Text>
              <TouchableOpacity onPress={() => setShowGenerateModal(false)}>
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollContent}>
              {/* Sección de objetivo */}
              <Text style={styles.modalSectionTitle}>¿Cuál es tu objetivo?</Text>
              <View style={styles.goalButtonsContainer}>
                {dietGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[styles.goalButton, dietPreferences.goal === goal.id && styles.goalButtonActive]}
                    onPress={() => setDietPreferences({ ...dietPreferences, goal: goal.id })}
                  >
                    <Feather name={goal.icon} size={24} color={dietPreferences.goal === goal.id ? "white" : "#AAA"} />
                    <Text
                      style={[styles.goalButtonText, dietPreferences.goal === goal.id && styles.goalButtonTextActive]}
                    >
                      {goal.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sección de calorías */}
              <Text style={styles.modalSectionTitle}>Calorías diarias</Text>
              <View style={styles.caloriesContainer}>
                <TouchableOpacity
                  style={styles.caloriesButton}
                  onPress={() =>
                    setDietPreferences({
                      ...dietPreferences,
                      calories: Math.max(1200, dietPreferences.calories - 100),
                    })
                  }
                >
                  <Feather name="minus" size={20} color="white" />
                </TouchableOpacity>
                <View style={styles.caloriesValueContainer}>
                  <Text style={styles.caloriesValue}>{dietPreferences.calories}</Text>
                  <Text style={styles.caloriesUnit}>kcal</Text>
                </View>
                <TouchableOpacity
                  style={styles.caloriesButton}
                  onPress={() =>
                    setDietPreferences({
                      ...dietPreferences,
                      calories: Math.min(4000, dietPreferences.calories + 100),
                    })
                  }
                >
                  <Feather name="plus" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Sección de comidas */}
              <Text style={styles.modalSectionTitle}>Número de comidas</Text>
              <View style={styles.mealsButtonsContainer}>
                {[3, 4, 5, 6].map((mealCount) => (
                  <TouchableOpacity
                    key={mealCount}
                    style={[
                      styles.mealCountButton,
                      dietPreferences.meals === mealCount && styles.mealCountButtonActive,
                    ]}
                    onPress={() => setDietPreferences({ ...dietPreferences, meals: mealCount })}
                  >
                    <Text
                      style={[
                        styles.mealCountButtonText,
                        dietPreferences.meals === mealCount && styles.mealCountButtonTextActive,
                      ]}
                    >
                      {mealCount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sección de restricciones */}
              <Text style={styles.modalSectionTitle}>Restricciones alimentarias</Text>
              <View style={styles.restrictionsContainer}>
                {availableRestrictions.map((restriction) => (
                  <TouchableOpacity
                    key={restriction.id}
                    style={[
                      styles.restrictionButton,
                      dietPreferences.restrictions.includes(restriction.id) && styles.restrictionButtonActive,
                    ]}
                    onPress={() => toggleRestriction(restriction.id)}
                  >
                    {dietPreferences.restrictions.includes(restriction.id) && (
                      <Feather name="check" size={16} color="white" style={styles.restrictionIcon} />
                    )}
                    <Text
                      style={[
                        styles.restrictionButtonText,
                        dietPreferences.restrictions.includes(restriction.id) && styles.restrictionButtonTextActive,
                      ]}
                    >
                      {restriction.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.generateButton} onPress={generateDiet} disabled={generatingDiet}>
              {generatingDiet ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Feather name="cpu" size={20} color="white" style={styles.generateButtonIcon} />
                  <Text style={styles.generateButtonText}>Generar Dieta Personalizada</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

                {/* Sección de compatibilidad con rutinas */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Rutinas compatibles</Text>
                  <Text style={styles.compatibilityText}>
                    Esta dieta es ideal para combinar con las siguientes rutinas:
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.compatibleRoutinesContainer}
                  >
                    <TouchableOpacity style={styles.compatibleRoutineCard}>
                      <View style={styles.compatibleRoutineIcon}>
                        <Feather name="activity" size={24} color="white" />
                      </View>
                      <Text style={styles.compatibleRoutineName}>Cardio Intenso</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.compatibleRoutineCard}>
                      <View style={[styles.compatibleRoutineIcon, { backgroundColor: "#4CAF50" }]}>
                        <Feather name="trending-up" size={24} color="white" />
                      </View>
                      <Text style={styles.compatibleRoutineName}>Hipertrofia</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.compatibleRoutineCard}>
                      <View style={[styles.compatibleRoutineIcon, { backgroundColor: "#9C27B0" }]}>
                        <Feather name="zap" size={24} color="white" />
                      </View>
                      <Text style={styles.compatibleRoutineName}>HIIT</Text>
                    </TouchableOpacity>
                  </ScrollView>
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FFFFFF", // Usando el color de texto de la app
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007DF0", // Usando el color del gradiente de la app
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
  dietCard: {
    width: (width - 40) / 2,
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  dietHeader: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dietIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  aiGeneratedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  aiGeneratedText: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  dietCardContent: {
    padding: 12,
  },
  dietName: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dietDescription: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 12,
    marginBottom: 8,
  },
  dietCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dietCalories: {
    flexDirection: "row",
    alignItems: "center",
  },
  dietCaloriesText: {
    color: "#FF9800",
    fontSize: 12,
    marginLeft: 4,
  },
  dietDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  dietDurationText: {
    color: "#00D078", // Usando el color del gradiente de la app
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#313131", // Usando el color de fondo secundario de la app
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 20,
    fontWeight: "bold",
  },
  modalScrollContent: {
    maxHeight: 500,
  },
  modalSectionTitle: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    marginTop: 10,
  },
  goalButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  goalButton: {
    width: "48%",
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  goalButtonActive: {
    backgroundColor: "#007DF0", // Usando el color del gradiente de la app
  },
  goalButtonText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    marginTop: 8,
    fontSize: 14,
  },
  goalButtonTextActive: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontWeight: "500",
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  caloriesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
    justifyContent: "center",
    alignItems: "center",
  },
  caloriesValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 20,
  },
  caloriesValue: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 32,
    fontWeight: "bold",
  },
  caloriesUnit: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 16,
    marginLeft: 5,
  },
  mealsButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  mealCountButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
    justifyContent: "center",
    alignItems: "center",
  },
  mealCountButtonActive: {
    backgroundColor: "#007DF0", // Usando el color del gradiente de la app
  },
  mealCountButtonText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 18,
    fontWeight: "bold",
  },
  mealCountButtonTextActive: {
    color: "#FFFFFF", // Usando el color de texto de la app
  },
  restrictionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  restrictionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Usando el color de fondo de la app
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  restrictionButtonActive: {
    backgroundColor: "#007DF0", // Usando el color del gradiente de la app
  },
  restrictionIcon: {
    marginRight: 6,
  },
  restrictionButtonText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 14,
  },
  restrictionButtonTextActive: {
    color: "#FFFFFF", // Usando el color de texto de la app
  },
  generateButton: {
    backgroundColor: "#00D078", // Usando el color del gradiente de la app
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  generateButtonIcon: {
    marginRight: 10,
  },
  generateButtonText: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 16,
    fontWeight: "600",
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
  compatibilityText: {
    color: "#B1B1B1", // Usando el color de texto de la app
    fontSize: 14,
    marginBottom: 15,
  },
  compatibleRoutinesContainer: {
    paddingBottom: 10,
  },
  compatibleRoutineCard: {
    alignItems: "center",
    marginRight: 20,
    width: 100,
  },
  compatibleRoutineIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF5722",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  compatibleRoutineName: {
    color: "#FFFFFF", // Usando el color de texto de la app
    fontSize: 14,
    textAlign: "center",
  },
  detailFooterSpace: {
    height: 40,
  },
})
