// components/RoutineCard.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const RoutineCard = ({ routine, onOptionsPress }) => {
  // Función para generar un color más oscuro para el gradiente
  const getDarkerColor = (color) => {
    // Convertir hex a RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Oscurecer los valores
    const darkerR = Math.floor(r * 0.7).toString(16).padStart(2, '0');
    const darkerG = Math.floor(g * 0.7).toString(16).padStart(2, '0');
    const darkerB = Math.floor(b * 0.7).toString(16).padStart(2, '0');
    
    return `#${darkerR}${darkerG}${darkerB}`;
  };

  // Función para navegar a la pantalla de rutina generada
  const handleStartRoutine = () => {
    // Crear un objeto con la estructura esperada por RutinaGenerada
    const routineData = {
      weekly_schedule: {
        day1: {
          day_name: routine.name,
          focus: routine.folder || "Entrenamiento general",
          exercises: routine.exercises.map(exercise => ({
            name: exercise,
            sets: "3",
            reps: "12",
            rest: "60s",
            equipment: "Peso corporal",
            target: "Músculos principales",
            // Puedes añadir una URL de GIF de ejemplo si lo deseas
            gifUrl: "https://example.com/exercise.gif"
          }))
        }
      },
      recommendations: [
        "Mantén una buena hidratación durante el entrenamiento",
        "Realiza un calentamiento adecuado antes de comenzar",
        "Enfócate en la técnica correcta en cada ejercicio"
      ]
    };

    // Convertir a JSON string para pasar como parámetro
    const routineParam = JSON.stringify(routineData);
    
    // Navegar a la pantalla de rutina generada con los datos
    router.push({
      pathname: "/RutinaGenerada",
      params: { routine: routineParam }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Cabecera con gradiente */}
        <LinearGradient
          colors={[routine.color, getDarkerColor(routine.color)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardHeader}
        >
          <Text style={styles.routineName}>{routine.name}</Text>
          <TouchableOpacity 
            style={styles.optionsButton}
            onPress={onOptionsPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather name="more-vertical" size={20} color="white" />
          </TouchableOpacity>
        </LinearGradient>
        
        {/* Contenido */}
        <View style={styles.cardContent}>
          {/* Contador de ejercicios */}
          <View style={styles.exerciseCount}>
            <Feather name="activity" size={14} color="#999" />
            <Text style={styles.exerciseCountText}>
              {routine.exercises.length} ejercicios
            </Text>
          </View>
          
          {/* Lista de ejercicios */}
          <View style={styles.exercisesList}>
            {routine.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseItem}>
                <View style={[styles.exerciseDot, { backgroundColor: routine.color }]} />
                <Text style={styles.exerciseText} numberOfLines={1}>
                  {exercise}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Botón de inicio */}
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: routine.color }]}
            activeOpacity={0.8}
            onPress={handleStartRoutine}
          >
            <Feather name="play" size={16} color="white" style={styles.startButtonIcon} />
            <Text style={styles.startButtonText}>Empezar Rutina</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  routineName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsButton: {
    padding: 5,
  },
  cardContent: {
    padding: 15,
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseCountText: {
    color: '#999',
    fontSize: 14,
    marginLeft: 5,
  },
  exercisesList: {
    marginBottom: 15,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  exerciseText: {
    color: '#CCC',
    fontSize: 14,
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  startButtonIcon: {
    marginRight: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RoutineCard;