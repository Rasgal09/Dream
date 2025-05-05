"use client"

import { useState, useRef, useEffect } from "react"
import { StyleSheet, Text, View, TextInput, Pressable, Dimensions, Animated, Platform, Alert } from "react-native"
import { useFonts, SofiaSans_900Black } from "@expo-google-fonts/sofia-sans"
import { Kanit_900Black } from "@expo-google-fonts/kanit"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"
import axios from "axios"

const { width, height } = Dimensions.get("window")
const ITEM_HEIGHT = 60
const VISIBLE_ITEMS = 5
const WHEEL_WIDTH = width * 0.7

const RegistroCompleto = () => {
  const insets = useSafeAreaInsets()

  // Fonts loading
  const [fontsLoaded] = useFonts({
    SofiaSans_900Black,
    Kanit_900Black,
  })

  // States con valores iniciales
  const [step, setStep] = useState(0)
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [selectedAge, setSelectedAge] = useState(25)
  const [selectedSex, setSelectedSex] = useState(null)
  const [selectedWeight, setSelectedWeight] = useState(70)
  const [selectedHeight, setSelectedHeight] = useState(170)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refs
  const ageScrollRef = useRef(null)
  const weightScrollRef = useRef(null)
  const heightScrollRef = useRef(null)

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current
  const ageScrollY = useRef(new Animated.Value(0)).current
  const weightScrollY = useRef(new Animated.Value(0)).current
  const heightScrollY = useRef(new Animated.Value(0)).current

  // Steps
  const steps = [
    { id: 1, title: "BIENVENIDO A FORTIA", type: "registro", subtitle: "Parte 1: Ingrese los siguientes datos" },
    {
      id: 2,
      title: "Tu edad",
      type: "age",
      subtitle: "La información sobre la edad nos ayuda a evaluar tu nivel metabólico",
    },
    {
      id: 3,
      title: "Tu sexo",
      type: "sex",
      subtitle: "Esta información nos ayuda a personalizar mejor tus recomendaciones",
    },
    { id: 4, title: "Tu peso", type: "weight", subtitle: "Estos datos nos permiten calcular tus índices corporales" },
    {
      id: 5,
      title: "Tu estatura",
      type: "height",
      subtitle: "Estos datos nos permiten calcular tus índices corporales",
    },
    { id: 6, title: "¡Todo listo!", type: "completion", subtitle: "Hemos terminado de configurar tu perfil" },
  ]

  // Options
  const sexOptions = [
    { label: "Masculino", value: "masculino", color: "#007DF0" },
    { label: "Femenino", value: "femenino", color: "#FF5E9C" },
  ]

  const ages = Array.from({ length: 71 }, (_, i) => i + 10)
  const weights = Array.from({ length: 121 }, (_, i) => i + 30)
  const heights = Array.from({ length: 91 }, (_, i) => i + 140)

  // Scroll to selected item on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (step === 1 && ageScrollRef.current) {
        const ageIndex = ages.indexOf(selectedAge)
        ageScrollRef.current.scrollTo({ y: ageIndex * ITEM_HEIGHT, animated: false })
      }
      if (step === 3 && weightScrollRef.current) {
        const weightIndex = weights.indexOf(selectedWeight)
        weightScrollRef.current.scrollTo({ y: weightIndex * ITEM_HEIGHT, animated: false })
      }
      if (step === 4 && heightScrollRef.current) {
        const heightIndex = heights.indexOf(selectedHeight)
        heightScrollRef.current.scrollTo({ y: heightIndex * ITEM_HEIGHT, animated: false })
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [step])

  // Handle wheel scroll end
  const handleScrollEnd = (type, event) => {
    const y = event.nativeEvent.contentOffset.y
    const index = Math.round(y / ITEM_HEIGHT)

    const items = type === "age" ? ages : type === "weight" ? weights : heights

    const newIndex = Math.max(0, Math.min(index, items.length - 1))
    const newValue = items[newIndex]

    const scrollRef = type === "age" ? ageScrollRef : type === "weight" ? weightScrollRef : heightScrollRef

    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: newIndex * ITEM_HEIGHT, animated: true })

      if (type === "age") setSelectedAge(newValue)
      if (type === "weight") setSelectedWeight(newValue)
      if (type === "height") setSelectedHeight(newValue)
    }
  }

  // Render wheel picker
  const renderWheelPicker = (type, items, selectedItem, unit) => {
    const selectedValue = type === "age" ? selectedAge : type === "weight" ? selectedWeight : selectedHeight
    const scrollRef = type === "age" ? ageScrollRef : type === "weight" ? weightScrollRef : heightScrollRef
    const scrollY = type === "age" ? ageScrollY : type === "weight" ? weightScrollY : heightScrollY

    return (
      <View style={styles.wheelContainer}>
        <View style={styles.selectedValueContainer}>
          <Text style={styles.selectedValue}>{selectedValue}</Text>
          <Text style={styles.selectedUnit}>{unit}</Text>
        </View>

        <View style={styles.wheelWrapper}>
          <Animated.ScrollView
            ref={scrollRef}
            style={styles.wheelScroll}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={Platform.OS === "ios" ? 0.99 : 0.95}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            onMomentumScrollEnd={(e) => handleScrollEnd(type, e)}
            scrollEventThrottle={16}
            contentContainerStyle={styles.wheelScrollContent}
          >
            {items.map((item, index) => {
              const inputRange = [
                (index - 2) * ITEM_HEIGHT,
                (index - 1) * ITEM_HEIGHT,
                index * ITEM_HEIGHT,
                (index + 1) * ITEM_HEIGHT,
                (index + 2) * ITEM_HEIGHT,
              ]

              const opacity = scrollY.interpolate({
                inputRange,
                outputRange: [0.3, 0.6, 1, 0.6, 0.3],
                extrapolate: "clamp",
              })

              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [0.7, 0.85, 1.1, 0.85, 0.7],
                extrapolate: "clamp",
              })

              return (
                <Animated.View
                  key={item}
                  style={[
                    styles.wheelItem,
                    {
                      opacity,
                      transform: [{ scale }],
                    },
                  ]}
                >
                  <Animated.Text style={[styles.wheelItemText, item === selectedValue && styles.selectedWheelItemText]}>
                    {item}
                  </Animated.Text>
                </Animated.View>
              )
            })}
          </Animated.ScrollView>

          <View style={styles.wheelHighlight} />
          <View style={styles.wheelOverlayTop} />
          <View style={styles.wheelOverlayBottom} />
        </View>
      </View>
    )
  }

  // Render sex options
  const renderSexOptions = () => {
    return (
      <View style={styles.sexOptionsContainer}>
        {sexOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.sexOption,
              selectedSex === option.value && {
                backgroundColor: `${option.color}20`,
                borderColor: option.color,
              },
            ]}
            onPress={() => setSelectedSex(option.value)}
          >
            <Text
              style={[
                styles.sexOptionText,
                selectedSex === option.value && {
                  color: option.color,
                  fontWeight: "bold",
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    )
  }

  // Render step content
  const renderStepContent = () => {
    const currentStep = steps[step]

    switch (currentStep.type) {
      case "registro":
        return (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre Completo"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
            />
          </View>
        )
      case "age":
        return renderWheelPicker("age", ages, selectedAge, "años")
      case "sex":
        return renderSexOptions()
      case "weight":
        return renderWheelPicker("weight", weights, selectedWeight, "kg")
      case "height":
        return renderWheelPicker("height", heights, selectedHeight, "cm")
      case "completion":
        return (
          <View style={styles.completionContainer}>
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={["#00D078", "#007DF0"]}
                style={styles.successIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.successIcon}>✓</Text>
              </LinearGradient>
            </View>
            <Text style={styles.completionTitle}>¡Registro Exitoso!</Text>
            <Text style={styles.completionText}>
              Tu cuenta ha sido creada correctamente. Ahora puedes comenzar a usar la aplicación.
            </Text>
          </View>
        )
      default:
        return null
    }
  }

  // Next step function
  const nextStep = async () => {
    if (step === 0 && (!nombre || !correo || !contrasena)) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (step === 1 && !selectedAge) {
      Alert.alert("Error", "Por favor selecciona tu edad")
      return
    }

    if (step === 2 && !selectedSex) {
      Alert.alert("Error", "Por favor selecciona tu sexo")
      return
    }

    if (step < steps.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep(step + 1)
        Animated.parallel([
          Animated.timing(progressAnim, {
            toValue: (step + 1) / (steps.length - 1),
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start()
      })
    } else {
      try {
        setIsSubmitting(true)
        
         // 1. Captura la respuesta correctamente
        const response = await axios.post('http://192.168.1.126:3000/api/users/registro', {
          nombre: nombre.trim(),
          genero: selectedSex,
          edad: selectedAge,
          correo: correo.trim().toLowerCase(),
          contrasena: contrasena,
          peso: selectedWeight,
          altura: selectedHeight 
        });

        // 2. Ahora response está definido
        console.log('Registro exitoso:', response.data);
        router.replace("/Home");
      } catch (error) {
        console.error('Error en registro:', error.response?.data || error.message)
        Alert.alert(
          "Error al registrar",
          error.response?.data?.error || "Ocurrió un error al crear tu cuenta"
        )
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  if (!fontsLoaded) return null

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Paso {step + 1} de {steps.length}
        </Text>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
      </View>

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.subtitle}>{steps[step].subtitle}</Text>

        <View style={styles.stepContent}>{renderStepContent()}</View>

        <Pressable
          style={[
            styles.continueButton,
            ((step === 2 && !selectedSex) || (step === 0 && (!nombre || !correo || !contrasena))) && { opacity: 0.5 },
          ]}
          onPress={nextStep}
          disabled={
            (step === 2 && !selectedSex) || 
            (step === 0 && (!nombre || !correo || !contrasena)) ||
            isSubmitting
          }
        >
          <LinearGradient
            colors={["#00D078", "#007DF0"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "PROCESANDO..." : step === steps.length - 1 ? "COMENZAR" : "CONTINUAR"}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1A1A1A",
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    color: "#999",
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "SofiaSans_900Black",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007DF0",
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#FFF",
    marginBottom: 10,
    fontFamily: "SofiaSans_900Black",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 30,
    fontFamily: "SofiaSans_900Black",
  },
  stepContent: {
    flex: 1,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontFamily: "SofiaSans_900Black",
  },
  wheelContainer: {
    alignItems: "center",
    height: 300,
    width: "100%",
  },
  selectedValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  selectedValue: {
    fontSize: 48,
    color: "#FFF",
    fontFamily: "SofiaSans_900Black",
    marginRight: 10,
  },
  selectedUnit: {
    fontSize: 24,
    color: "#999",
    fontFamily: "SofiaSans_900Black",
  },
  wheelWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: WHEEL_WIDTH,
    position: "relative",
    justifyContent: "center",
    marginTop: 20,
  },
  wheelScroll: {
    flex: 1,
  },
  wheelScrollContent: {
    paddingTop: ITEM_HEIGHT * 2,
    paddingBottom: ITEM_HEIGHT * 2,
  },
  wheelHighlight: {
    position: "absolute",
    height: ITEM_HEIGHT,
    width: "100%",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(0, 208, 120, 0.5)",
    top: "50%",
    marginTop: -ITEM_HEIGHT / 2,
    zIndex: -1,
  },
  wheelOverlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    backgroundColor: "rgba(26, 26, 26, 0.7)",
    zIndex: -1,
  },
  wheelOverlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 2,
    backgroundColor: "rgba(26, 26, 26, 0.7)",
    zIndex: -1,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  wheelItemText: {
    fontSize: 24,
    color: "#FFF",
    fontFamily: "SofiaSans_900Black",
  },
  selectedWheelItemText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00D078",
  },
  sexOptionsContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  sexOption: {
    padding: 25,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  sexOptionText: {
    fontSize: 20,
    color: "#999",
    fontFamily: "SofiaSans_900Black",
  },
  continueButton: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientButton: {
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Kanit_900Black",
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  completionTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "SofiaSans_900Black",
  },
  completionText: {
    color: "#AAA",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "SofiaSans_900Black",
    paddingHorizontal: 20,
  },
})

export default RegistroCompleto