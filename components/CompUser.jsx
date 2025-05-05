"use client"

import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions, Alert } from "react-native"
import { useState, useEffect } from "react"
import { Colors } from "../assets/Colors"
import { Userprofile } from "../assets/Userprofile"
import { icons } from "../assets/icons"
import { useNavigation, DrawerActions } from "@react-navigation/native"
import { LineChart } from "react-native-chart-kit"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const screenWidth = Dimensions.get("window").width

// Función para calcular IMC
const calcularIMC = (peso, altura) => (peso / (altura * altura)).toFixed(1)

// Función para calcular % de grasa (Fórmula de Deurenberg)
const calcularGrasaCorporal = (imc, edad, genero) => {
  const sexo = genero === "masculino" ? 1 : 0
  return (1.2 * imc + 0.23 * edad - 10.8 * sexo - 5.4).toFixed(1)
}

// Función para calcular peso ideal basado en masa muscular
const calcularPesoIdeal = (pesoActual, grasaActual, genero) => {
  const porcentajeGrasaIdeal = genero === "masculino" ? 15 : 22
  const masaMagra = pesoActual * (1 - grasaActual / 100)
  return (masaMagra / (1 - porcentajeGrasaIdeal / 100)).toFixed(1)
}

export const CompUser = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [metricaActiva, setMetricaActiva] = useState("peso")
  const [datosUsuario, setDatosUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  // Obtener datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem("userEmail")
        if (!userEmail) {
          Alert.alert("Error", "No se encontró sesión activa")
          navigation.navigate("Session")
          return
        }

        const response = await axios.get(`http://192.168.1.126:3000/api/users/usuario?correo=${encodeURIComponent(userEmail)}`);
        
        if (!response.data) {
          throw new Error("No se recibieron datos del usuario")
        }

        const userData = response.data

        // Calcular valores dinámicos
        const altura = Number.parseFloat(userData.altura)
        const imc = calcularIMC(userData.peso, altura)
        const grasaCorporal = calcularGrasaCorporal(imc, userData.edad, userData.genero)
        const pesoIdeal = calcularPesoIdeal(userData.peso, grasaCorporal, userData.genero)

        setDatosUsuario({
          nombre: userData.nombre,
          genero: userData.genero,
          peso: Number(userData.peso),
          altura: altura,
          edad: userData.edad,
          historial: {
            fechas: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
            peso: Array(6).fill(Number(userData.peso)),
            grasaCorporal: Array(6).fill(Number(grasaCorporal)),
            pesoIdeal: Array(6).fill(Number(pesoIdeal)),
          },
        })
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        Alert.alert("Error", "No se pudieron cargar los datos del perfil")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: Colors.text1 }}>Cargando datos del usuario...</Text>
      </View>
    )
  }

  if (!datosUsuario) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: Colors.text1 }}>No se encontraron datos del usuario</Text>
      </View>
    )
  }

  // Calcular valores basados en datos reales
  const pesoActual = datosUsuario.peso
  const alturaActual = datosUsuario.altura
  const imcActual = Number.parseFloat(calcularIMC(pesoActual, alturaActual))
  const grasaActual = datosUsuario.historial.grasaCorporal[datosUsuario.historial.grasaCorporal.length - 1]
  const pesoIdealActual = datosUsuario.historial.pesoIdeal[datosUsuario.historial.pesoIdeal.length - 1]

  const estadoIMC = (imc) => {
    const imcNum = Number.parseFloat(imc)
    if (imcNum < 18.5) return { texto: "Bajo peso", color: "#FFC107" }
    if (imcNum < 25) return { texto: "Peso normal", color: "#4CAF50" }
    if (imcNum < 30) return { texto: "Sobrepeso", color: "#FF9800" }
    return { texto: "Obesidad", color: "#F44336" }
  }

  const handleMenuPress = () => navigation.dispatch(DrawerActions.openDrawer())

  const chartConfig = {
    backgroundGradientFrom: Colors.fondos2,
    backgroundGradientTo: Colors.fondos2,
    decimalPlaces: 1,
    color: (opacity = 1) => {
      switch (metricaActiva) {
        case "peso":
          return `rgba(65, 105, 225, ${opacity})`
        case "grasa":
          return `rgba(255, 99, 71, ${opacity})`
        case "pesoIdeal":
          return `rgba(46, 139, 87, ${opacity})`
        case "imc":
          return `rgba(138, 43, 226, ${opacity})`
        default:
          return `rgba(0, 0, 0, ${opacity})`
      }
    },
    labelColor: (opacity = 1) => Colors.text1,
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: Colors.text1 },
  }

  const getDatosGrafica = () => {
    let datosValidos = []

    if (metricaActiva === "peso") {
      datosValidos = datosUsuario.historial.peso
    } else if (metricaActiva === "grasa") {
      datosValidos = datosUsuario.historial.grasaCorporal
    } else if (metricaActiva === "pesoIdeal") {
      datosValidos = datosUsuario.historial.pesoIdeal
    } else {
      datosValidos = datosUsuario.historial.peso.map(p => calcularIMC(p, alturaActual))
    }

    return {
      labels: datosUsuario.historial.fechas,
      datasets: [
        {
          data: datosValidos,
          color: (opacity = 1) => chartConfig.color(opacity),
          strokeWidth: 2,
        },
      ],
      legend: [
        metricaActiva === "peso"
          ? "Peso (kg)"
          : metricaActiva === "grasa"
            ? "Grasa Corporal (%)"
            : metricaActiva === "pesoIdeal"
              ? "Peso Ideal (kg)"
              : "IMC",
      ],
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <icons.Menu color={Colors.text1} />
          </TouchableOpacity>

          <Userprofile style={styles.avatar} genero={datosUsuario.genero} />

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{datosUsuario.nombre}</Text>
            <Text style={styles.userDetails}>
              {datosUsuario.edad} años • {(alturaActual * 100).toFixed(0)} cm
            </Text>
            <View style={[styles.imcBadge, { backgroundColor: estadoIMC(imcActual).color }]}>
              <Text style={styles.imcText}>{estadoIMC(imcActual).texto}</Text>
            </View>
          </View>
        </View>

        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <TouchableOpacity
            style={[styles.metricCard, metricaActiva === "peso" && styles.activeCard]}
            onPress={() => setMetricaActiva("peso")}
          >
            <Text style={styles.metricValue}>{pesoActual}</Text>
            <Text style={styles.metricUnit}>kg</Text>
            <Text style={styles.metricLabel}>Peso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.metricCard, metricaActiva === "grasa" && styles.activeCard]}
            onPress={() => setMetricaActiva("grasa")}
          >
            <Text style={styles.metricValue}>
              {Number(grasaActual).toFixed(1)}
            </Text>
            <Text style={styles.metricUnit}>%</Text>
            <Text style={styles.metricLabel}>Grasa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.metricCard, metricaActiva === "pesoIdeal" && styles.activeCard]}
            onPress={() => setMetricaActiva("pesoIdeal")}
          >
            <Text style={styles.metricValue}>{pesoIdealActual}</Text>
            <Text style={styles.metricUnit}>kg</Text>
            <Text style={styles.metricLabel}>Peso Ideal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.metricCard, metricaActiva === "imc" && styles.activeCard]}
            onPress={() => setMetricaActiva("imc")}
          >
            <Text style={styles.metricValue}>{imcActual}</Text>
            <Text style={styles.metricUnit}>IMC</Text>
            <Text style={styles.metricLabel}>Índice</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>
            {metricaActiva === "peso"
              ? "Progreso de Peso"
              : metricaActiva === "grasa"
                ? "Progreso de Grasa Corporal"
                : metricaActiva === "pesoIdeal"
                  ? "Progreso de Peso Ideal"
                  : "Progreso de IMC"}
          </Text>
          <Text style={styles.sectionSubtitle}>Últimos 6 meses</Text>

          <LineChart
            data={getDatosGrafica()}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Progress Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumen de Progreso</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Desde el inicio:</Text>
            <Text style={styles.summaryValue}>
              {metricaActiva === "peso"
                ? `0 kg`
                : metricaActiva === "grasa"
                  ? `0%`
                  : metricaActiva === "pesoIdeal"
                    ? `0 kg`
                    : `0 puntos`}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cambio mensual promedio:</Text>
            <Text style={styles.summaryValue}>
              {metricaActiva === "peso"
                ? `0 kg`
                : metricaActiva === "grasa"
                  ? `0%`
                  : metricaActiva === "pesoIdeal"
                    ? `0 kg`
                    : `0 puntos`}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Último mes:</Text>
            <Text style={styles.summaryValue}>
              {metricaActiva === "peso"
                ? `0 kg`
                : metricaActiva === "grasa"
                  ? `0%`
                  : metricaActiva === "pesoIdeal"
                    ? `0 kg`
                    : `0 puntos`}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Consejos Personalizados</Text>
          <Text style={styles.tipsText}>
            {metricaActiva === "peso"
              ? "Mantén un déficit calórico moderado y aumenta tu actividad física para continuar con tu pérdida de peso de forma saludable."
              : metricaActiva === "grasa"
                ? "Combina entrenamiento de fuerza con cardio para maximizar la pérdida de grasa mientras mantienes tu masa muscular."
                : metricaActiva === "pesoIdeal"
                  ? "Enfócate en mantener un balance entre ejercicio y nutrición para alcanzar tu peso ideal de manera sostenible."
                  : "Mantén hábitos alimenticios saludables y una rutina de ejercicio regular para mantener tu IMC en el rango normal."}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondos,
    paddingBottom: 55,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  menuButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  avatar: {
    marginBottom: 15,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontFamily: "Kanit_800ExtraBold",
    color: Colors.text1,
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 16,
    fontFamily: "SofiaSans_500Medium",
    color: Colors.text2,
    marginBottom: 10,
  },
  imcBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  imcText: {
    fontSize: 14,
    fontFamily: "SofiaSans_800ExtraBold",
    color: "#FFFFFF",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  metricCard: {
    width: "48%",
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  activeCard: {
    borderWidth: 2,
    borderColor: Colors.grad2,
  },
  metricValue: {
    fontSize: 28,
    fontFamily: "Kanit_800ExtraBold",
    color: Colors.text1,
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 16,
    fontFamily: "SofiaSans_500Medium",
    color: Colors.text2,
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: "SofiaSans_500Medium",
    color: Colors.text2,
  },
  chartSection: {
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Kanit_800ExtraBold",
    color: Colors.text1,
    marginBottom: 5,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "SofiaSans_500Medium",
    color: Colors.text2,
    marginBottom: 15,
    textAlign: "center",
  },
  chart: {
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 10,
  },
  summarySection: {
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: "SofiaSans_500Medium",
    color: Colors.text2,
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: "Kanit_800ExtraBold",
    color: Colors.text1,
  },
  tipsSection: {
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsText: {
    fontSize: 15,
    fontFamily: "SofiaSans_500Medium",
    color: Colors.text2,
    lineHeight: 22,
    textAlign: "center",
  }
})

export default CompUser