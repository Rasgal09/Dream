"use client"

import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Animated } from "react-native"
import { useRef } from "react"
import { Colors } from "../assets/Colors"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const Ejercicio = (props) => {
  const { title, muscleGroup, equipment, gifUrl, target, onPress } = props

  const scaleAnim = useRef(new Animated.Value(1)).current

  // Animación al presionar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start()
  }

  // Traducciones para términos en inglés
  const translateBodyPart = (part) => {
    const translations = {
      back: "Espalda",
      cardio: "Cardio",
      chest: "Pecho",
      "lower arms": "Antebrazos",
      "lower legs": "Pantorrillas",
      neck: "Cuello",
      shoulders: "Hombros",
      "upper arms": "Brazos",
      "upper legs": "Piernas",
      waist: "Cintura",
      legs: "Piernas",
      arms: "Brazos",
    }
    return translations[part.toLowerCase()] || part
  }

  const translateEquipment = (equip) => {
    const translations = {
      "body weight": "Peso corporal",
      machine: "Máquina",
      dumbbell: "Mancuernas",
      barbell: "Barra",
      cable: "Polea",
      kettlebell: "Kettlebell",
      band: "Banda elástica",
      "medicine ball": "Balón medicinal",
      "exercise ball": "Pelota de ejercicio",
      "ez barbell": "Barra EZ",
    }
    return translations[equip.toLowerCase()] || equip
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Imagen del ejercicio */}
        <View style={styles.imageContainer}>
          {gifUrl ? (
            <Image source={{ uri: gifUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={40} color={Colors.text2} />
            </View>
          )}
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.gradient} />
          <View style={styles.muscleTag}>
            <Text style={styles.muscleTagText}>{translateBodyPart(muscleGroup)}</Text>
          </View>
        </View>

        {/* Información del ejercicio */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Ionicons name="barbell-outline" size={16} color={Colors.text1} />
              <Text style={styles.detailText}>{translateEquipment(equipment)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="fitness-outline" size={16} color={Colors.text1} />
              <Text style={styles.detailText}>{target}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2 // 2 columnas con margen

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: Colors.fondos2,
    borderRadius: 16,
    margin: 8,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  touchable: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: cardWidth,
    backgroundColor: Colors.fondos,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  muscleTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleTagText: {
    color: Colors.text2,
    fontSize: 12,
    fontFamily: "Kanit",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.fondos,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Kanit",
    fontWeight: "600",
    color: Colors.text2,
    marginBottom: 8,
    minHeight: 40,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontFamily: "Kanit",
    color: Colors.text1,
    fontSize: 12,
    marginLeft: 4,
  },
})

export default Ejercicio
