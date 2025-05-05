// components/DietCard.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DietCard = ({ diet, onPress }) => {
  // Renderizar icono para la dieta
  const renderDietIcon = () => {
    const iconName =
      diet.category === "Cetogénica"
        ? "trending-up"
        : diet.category === "Deportiva"
          ? "activity"
          : diet.category === "Adelgazamiento"
            ? "trending-down"
            : "pie-chart";

    return (
      <View style={[styles.dietIconContainer, { backgroundColor: diet.color }]}>
        <Feather name={iconName} size={24} color="white" />
      </View>
    );
  };

  return (
    <TouchableOpacity style={styles.dietCard} onPress={() => onPress(diet)}>
      <View style={[styles.dietHeader, { backgroundColor: diet.color }]}>
        {renderDietIcon()}
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
  );
};

const styles = StyleSheet.create({
  dietCard: {
    width: (width - 40) / 2,
    backgroundColor: '#313131',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dietHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dietIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiGeneratedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiGeneratedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  dietCardContent: {
    padding: 12,
  },
  dietName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dietDescription: {
    color: '#B1B1B1',
    fontSize: 12,
    marginBottom: 8,
  },
  dietCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dietCalories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietCaloriesText: {
    color: '#FF9800',
    fontSize: 12,
    marginLeft: 4,
  },
  dietDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietDurationText: {
    color: '#00D078',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default DietCard;