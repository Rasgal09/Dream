import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Datos nutricionales
const INITIAL_DATA = {
  calories: 1781,
  caloriesMin: 1603,
  caloriesMax: 1960,
  nutrients: [
    { 
      id: 'protein',
      name: 'Proteínas', 
      value: 134, 
      unit: 'g', 
      color: '#5E9CF9', 
      icon: 'food-steak',
      percentage: 30, // porcentaje del total de calorías
      description: 'Esenciales para construir y reparar tejidos musculares'
    },
    { 
      id: 'carbs',
      name: 'Carbs', 
      value: 45, 
      unit: 'g', 
      color: '#FFA726', 
      icon: 'bread-slice',
      percentage: 10, // porcentaje del total de calorías
      description: 'Principal fuente de energía para el cuerpo'
    },
    { 
      id: 'fats',
      name: 'Grasas', 
      value: 118, 
      unit: 'g', 
      color: '#FF5252', 
      icon: 'oil',
      percentage: 60, // porcentaje del total de calorías
      description: 'Importantes para la absorción de vitaminas'
    },
  ]
};

const ScrollableNutritionChart = ({ navigation }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [selectedNutrient, setSelectedNutrient] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  
  // Iniciar animación al cargar
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Función para crear el gráfico circular
  const createPieChart = () => {
    const total = data.nutrients.reduce((sum, item) => sum + item.percentage, 0);
    let startAngle = 0;
    
    return data.nutrients.map((nutrient, index) => {
      // Calcular ángulos para el arco
      const angle = (nutrient.percentage / total) * 360;
      const endAngle = startAngle + angle;
      
      // Convertir a radianes
      const startAngleRad = (startAngle - 90) * Math.PI / 180;
      const endAngleRad = (endAngle - 90) * Math.PI / 180;
      
      // Calcular puntos del arco
      const radius = 70;
      const cx = 100;
      const cy = 100;
      
      const x1 = cx + radius * Math.cos(startAngleRad);
      const y1 = cy + radius * Math.sin(startAngleRad);
      const x2 = cx + radius * Math.cos(endAngleRad);
      const y2 = cy + radius * Math.sin(endAngleRad);
      
      // Determinar si el arco es mayor a 180 grados
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // Crear el path para el arco
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      // Guardar el ángulo inicial para el siguiente segmento
      startAngle = endAngle;
      
      // Determinar si este segmento está seleccionado
      const isSelected = selectedNutrient === nutrient.id;
      
      return (
        <Path
          key={nutrient.id}
          d={path}
          fill={nutrient.color}
          opacity={isSelected ? 1 : 0.8}
          onPress={() => handleNutrientSelect(nutrient.id)}
        />
      );
    });
  };
  
  // Manejar la selección de un nutriente
  const handleNutrientSelect = (id) => {
    // Si ya está seleccionado, deseleccionar
    if (selectedNutrient === id) {
      setSelectedNutrient(null);
    } else {
      setSelectedNutrient(id);
    }
  };
  
  // Obtener el nutriente seleccionado
  const getSelectedNutrient = () => {
    return data.nutrients.find(n => n.id === selectedNutrient) || null;
  };
  
  // Renderizar las barras de progreso para cada nutriente
  const renderNutrientBars = () => {
    return data.nutrients.map((nutrient) => {
      const isSelected = selectedNutrient === nutrient.id;
      
      return (
        <TouchableOpacity 
          key={nutrient.id} 
          style={[
            styles.nutrientRow,
            isSelected && styles.selectedNutrientRow
          ]}
          onPress={() => handleNutrientSelect(nutrient.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.nutrientIconContainer, { backgroundColor: `${nutrient.color}20` }]}>
            <MaterialCommunityIcons name={nutrient.icon} size={22} color={nutrient.color} />
          </View>
          <View style={styles.nutrientInfo}>
            <View style={styles.nutrientLabelContainer}>
              <Text style={styles.nutrientLabel}>{nutrient.name}</Text>
              <Text style={styles.nutrientValue}>
                {nutrient.value} {nutrient.unit}
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${Math.min(100, nutrient.percentage)}%`, 
                    backgroundColor: nutrient.color,
                    height: isSelected ? 10 : 8,
                  },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };
  
  // Renderizar detalles del nutriente seleccionado
  const renderSelectedNutrientDetails = () => {
    const nutrient = getSelectedNutrient();
    
    if (!nutrient) return null;
    
    return (
      <Animated.View 
        style={[
          styles.nutrientDetailsContainer,
          { 
            opacity: animation,
            backgroundColor: `${nutrient.color}15`,
            borderColor: nutrient.color,
          }
        ]}
      >
        <View style={styles.nutrientDetailHeader}>
          <MaterialCommunityIcons name={nutrient.icon} size={24} color={nutrient.color} />
          <Text style={[styles.nutrientDetailTitle, { color: nutrient.color }]}>
            {nutrient.name}
          </Text>
        </View>
        <Text style={styles.nutrientDetailDescription}>
          {nutrient.description}
        </Text>
        <View style={styles.nutrientDetailStats}>
          <View style={styles.nutrientDetailStat}>
            <Text style={styles.nutrientDetailStatValue}>{nutrient.value}{nutrient.unit}</Text>
            <Text style={styles.nutrientDetailStatLabel}>Total</Text>
          </View>
          <View style={styles.nutrientDetailStat}>
            <Text style={styles.nutrientDetailStatValue}>{nutrient.percentage}%</Text>
            <Text style={styles.nutrientDetailStatLabel}>De calorías</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header fijo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack ? navigation.goBack() : null}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumen Nutricional</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Contenido scrollable */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Feather name="check" size={24} color="white" />
          </View>
        </View>

        {/* Title */}
        <Animated.Text style={[styles.title, { opacity: animation }]}>
          ¡Genial! Estas son las calorías
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, { opacity: animation }]}>
          que necesitas al día
        </Animated.Text>

        {/* Card */}
        <View style={styles.card}>
          {/* Calories Circle */}
          <View style={styles.caloriesContainer}>
            <Svg height={200} width={200} viewBox="0 0 200 200">
              {/* Background Circle */}
              <Circle
                cx={100}
                cy={100}
                r={75}
                stroke="#333333"
                strokeWidth={2}
                fill="#1E1E1E"
              />
              
              {/* Nutrient Segments */}
              <G>
                {createPieChart()}
              </G>
              
              {/* Center Circle with Calories */}
              <Circle
                cx={100}
                cy={100}
                r={40}
                fill="#1E1E1E"
                stroke="#333333"
                strokeWidth={1}
              />
              <SvgText
                x={100}
                y={95}
                textAnchor="middle"
                fill="white"
                fontSize={24}
                fontWeight="bold"
              >
                {data.calories}
              </SvgText>
              <SvgText
                x={100}
                y={115}
                textAnchor="middle"
                fill="#AAAAAA"
                fontSize={14}
              >
                kcal
              </SvgText>
            </Svg>
          </View>

          {/* Selected Nutrient Details */}
          {renderSelectedNutrientDetails()}

          {/* Nutrient Bars */}
          <View style={styles.nutrientsContainer}>
            {renderNutrientBars()}
          </View>

          {/* Calorie Range */}
          <Animated.Text style={[styles.rangeText, { opacity: animation }]}>
            {data.calories} kcal es el punto medio de tu rango de calorías recomendado de {data.caloriesMin} a {data.caloriesMax} kcal
          </Animated.Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={styles.paginationDotActive} />
          <View style={styles.paginationDot} />
        </View>
        
        {/* Espacio adicional al final para asegurar que todo sea visible */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Botón fijo en la parte inferior */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate ? navigation.navigate('NextScreen') : null}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  successIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  caloriesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  nutrientDetailsContainer: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  nutrientDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  nutrientDetailDescription: {
    fontSize: 14,
    color: '#DDDDDD',
    marginBottom: 12,
  },
  nutrientDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutrientDetailStat: {
    alignItems: 'center',
  },
  nutrientDetailStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  nutrientDetailStatLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  nutrientsContainer: {
    marginTop: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 12,
  },
  selectedNutrientRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  nutrientIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nutrientInfo: {
    flex: 1,
  },
  nutrientLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  nutrientValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  rangeText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555555',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default ScrollableNutritionChart;