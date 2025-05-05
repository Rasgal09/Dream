"use client"

import { useRef, useEffect } from "react"
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../assets/Colors"
import { LinearGradient } from "expo-linear-gradient"


const { width, height } = Dimensions.get("window")

const ExerciseDetailModal = ({ visible, exercise, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  if (!exercise) return null

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
    <Modal transparent={true} visible={visible} animationType="none" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        

        <TouchableOpacity style={styles.closeArea} activeOpacity={1} onPress={onClose} />

        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: exercise.gifUrl }} style={styles.image} resizeMode="cover" />
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,0.7)"]}
                style={styles.imageGradient}
              />
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.title}>{exercise.name}</Text>

              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Ionicons name="body-outline" size={18} color={Colors.text2} />
                  <Text style={styles.tagText}>{translateBodyPart(exercise.bodyPart)}</Text>
                </View>

                <View style={styles.tag}>
                  <Ionicons name="barbell-outline" size={18} color={Colors.text2} />
                  <Text style={styles.tagText}>{translateEquipment(exercise.equipment)}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Músculo objetivo</Text>
                <View style={styles.targetContainer}>
                  <Ionicons name="fitness-outline" size={24} color={Colors.grad1} />
                  <Text style={styles.targetText}>{exercise.target}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Instrucciones</Text>
                <Text style={styles.instructionsText}>
                  Este ejercicio se enfoca en trabajar el músculo {exercise.target} utilizando{" "}
                  {translateEquipment(exercise.equipment)}. Para obtener mejores resultados, mantén una postura correcta
                  y realiza el movimiento de forma controlada.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Músculos secundarios</Text>
                <View style={styles.secondaryMusclesContainer}>
                  {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? (
                    exercise.secondaryMuscles.map((muscle, index) => (
                      <View key={index} style={styles.secondaryMuscle}>
                        <Text style={styles.secondaryMuscleText}>{muscle}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>No hay información disponible</Text>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.addButton}>
                <LinearGradient
                  colors={Colors.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text style={styles.addButtonText}>Añadir a mi rutina</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  closeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
  },
  modalContainer: {
    height: "80%",
    backgroundColor: Colors.fondos,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  header: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.fondos2,
  },
  headerHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.fondos2,
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Kanit",
    fontWeight: "600",
    color: Colors.text2,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.fondos2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: Colors.text2,
    fontFamily: "Kanit",
    fontSize: 14,
    marginLeft: 6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Kanit",
    fontWeight: "600",
    color: Colors.text2,
    marginBottom: 10,
  },
  targetContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.fondos2,
    padding: 15,
    borderRadius: 12,
  },
  targetText: {
    color: Colors.text2,
    fontFamily: "Kanit",
    fontSize: 16,
    marginLeft: 10,
  },
  instructionsText: {
    color: Colors.text1,
    fontFamily: "Kanit",
    fontSize: 15,
    lineHeight: 22,
  },
  secondaryMusclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  secondaryMuscle: {
    backgroundColor: Colors.fondos2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  secondaryMuscleText: {
    color: Colors.text2,
    fontFamily: "Kanit",
    fontSize: 14,
  },
  noDataText: {
    color: Colors.text1,
    fontFamily: "Kanit",
    fontSize: 15,
  },
  addButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  addButtonText: {
    color: "white",
    fontFamily: "Kanit",
    fontSize: 16,
    marginLeft: 8,
  },
})

export default ExerciseDetailModal
