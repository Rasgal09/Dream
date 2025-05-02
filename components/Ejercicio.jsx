import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '../assets/Colors';
import { Ionicons } from '@expo/vector-icons';

const Ejercicio = (props) => {
  const { 
    title, 
    muscleGroup, 
    equipment, 
    gifUrl,
    target,
    onPress
  } = props;
  
  // Traducciones para términos en inglés
  const translateBodyPart = (part) => {
    const translations = {
      'back': 'Espalda',
      'cardio': 'Cardio',
      'chest': 'Pecho',
      'lower arms': 'Antebrazos',
      'lower legs': 'Pantorrillas',
      'neck': 'Cuello',
      'shoulders': 'Hombros',
      'upper arms': 'Brazos',
      'upper legs': 'Piernas',
      'waist': 'Cintura',
      'legs': 'Piernas',
      'arms': 'Brazos'
    };
    return translations[part.toLowerCase()] || part;
  };

  const translateEquipment = (equip) => {
    const translations = {
      'body weight': 'Peso corporal',
      'machine': 'Máquina',
      'dumbbell': 'Mancuernas',
      'barbell': 'Barra',
      'cable': 'Polea',
      'kettlebell': 'Kettlebell',
      'band': 'Banda elástica',
      'medicine ball': 'Balón medicinal',
      'exercise ball': 'Pelota de ejercicio',
      'ez barbell': 'Barra EZ'
    };
    return translations[equip.toLowerCase()] || equip;
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Imagen del ejercicio */}
      <View style={styles.imageContainer}>
        {gifUrl ? (
          <Image 
            source={{ uri: gifUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={40} color={Colors.text2} />
          </View>
        )}
      </View>
      
      {/* Información del ejercicio */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="body-outline" size={16} color={Colors.text2} />
          <Text style={styles.detailText}>{translateBodyPart(muscleGroup)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="barbell-outline" size={16} color={Colors.text2} />
          <Text style={styles.detailText}>{translateEquipment(equipment)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.fondos,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.fondos,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Kanit_600SemiBold',
    color: Colors.text1,
    marginBottom: 8,
    minHeight: 40,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
    fontSize: 14,
    marginLeft: 6,
  },
});

export default Ejercicio;