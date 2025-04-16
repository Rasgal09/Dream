import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from "react-native";
import { useState } from "react";
import { Colors } from "../assets/Colors";
import { Userprofile } from "../assets/Userprofile";
import { icons } from "../assets/icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get("window").width;

// Función para calcular IMC (peso en kg, altura en cm)
const calcularIMC = (peso, altura) => {
  const alturaEnMetros = altura / 100;
  return (peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
};

// Datos de ejemplo del usuario
const datosUsuario = {
  nombre: "Usuario de Ejemplo",
  edad: 28,
  altura: 175, // en cm
  historial: {
    fechas: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    peso: [75, 78, 90, 90, 90, 90],
    grasaCorporal: [22, 21, 20.5, 19.8, 19, 18.5],
    masaMuscular: [33, 33.5, 34, 34.5, 35, 35.5],
  },
};

// Calcular IMC histórico basado en peso y altura
const imcHistorico = datosUsuario.historial.peso.map(peso => 
  parseFloat(calcularIMC(peso, datosUsuario.altura))
);

// Añadir IMC calculado al historial
datosUsuario.historial.imc = imcHistorico;

// Calcular valores actuales
const pesoActual = datosUsuario.historial.peso[datosUsuario.historial.peso.length - 1];
const grasaActual = datosUsuario.historial.grasaCorporal[datosUsuario.historial.grasaCorporal.length - 1];
const musculoActual = datosUsuario.historial.masaMuscular[datosUsuario.historial.masaMuscular.length - 1];
const imcActual = parseFloat(calcularIMC(pesoActual, datosUsuario.altura));

const estadoIMC = (imc) => {
  const imcNum = parseFloat(imc);
  if (imcNum < 18.5) return { texto: "Bajo peso", color: "#FFC107" };
  if (imcNum < 25) return { texto: "Peso normal", color: "#4CAF50" };
  if (imcNum < 30) return { texto: "Sobrepeso", color: "#FF9800" };
  return { texto: "Obesidad", color: "#F44336" };
};

export const CompUser = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [metricaActiva, setMetricaActiva] = useState("peso");

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const chartConfig = {
    backgroundGradientFrom: Colors.fondos2,
    backgroundGradientTo: Colors.fondos2,
    decimalPlaces: 1,
    color: (opacity = 1) => {
      switch (metricaActiva) {
        case "peso": return `rgba(65, 105, 225, ${opacity})`;
        case "grasa": return `rgba(255, 99, 71, ${opacity})`;
        case "musculo": return `rgba(46, 139, 87, ${opacity})`;
        case "imc": return `rgba(138, 43, 226, ${opacity})`;
        default: return `rgba(0, 0, 0, ${opacity})`;
      }
    },
    labelColor: (opacity = 1) => Colors.text1,
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: Colors.text1 },
  };

  const getDatosGrafica = () => ({
    labels: datosUsuario.historial.fechas,
    datasets: [{
      data: metricaActiva === "peso" ? datosUsuario.historial.peso :
            metricaActiva === "grasa" ? datosUsuario.historial.grasaCorporal :
            metricaActiva === "musculo" ? datosUsuario.historial.masaMuscular :
            datosUsuario.historial.imc,
      color: (opacity = 1) => chartConfig.color(opacity),
      strokeWidth: 2,
    }],
    legend: [metricaActiva === "peso" ? "Peso (kg)" :
             metricaActiva === "grasa" ? "Grasa Corporal (%)" :
             metricaActiva === "musculo" ? "Masa Muscular (kg)" : "IMC"],
  });

  const getTituloGrafica = () => {
    switch (metricaActiva) {
      case "peso": return "Progreso de Peso";
      case "grasa": return "Progreso de Grasa Corporal";
      case "musculo": return "Progreso de Masa Muscular";
      case "imc": return "Progreso de IMC";
      default: return "Progreso";
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handleMenuPress}
          >
            <icons.Menu color={Colors.text1} />
          </TouchableOpacity>
          
          <Userprofile style={styles.avatar} />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{datosUsuario.nombre}</Text>
            <Text style={styles.userDetails}>
              {datosUsuario.edad} años • {datosUsuario.altura} cm
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
            <Text style={styles.metricValue}>{grasaActual}</Text>
            <Text style={styles.metricUnit}>%</Text>
            <Text style={styles.metricLabel}>Grasa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.metricCard, metricaActiva === "musculo" && styles.activeCard]}
            onPress={() => setMetricaActiva("musculo")}
          >
            <Text style={styles.metricValue}>{musculoActual}</Text>
            <Text style={styles.metricUnit}>kg</Text>
            <Text style={styles.metricLabel}>Músculo</Text>
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
          <Text style={styles.sectionTitle}>{getTituloGrafica()}</Text>
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
              {metricaActiva === "peso" ? `${(datosUsuario.historial.peso[0] - pesoActual).toFixed(1)} kg` :
               metricaActiva === "grasa" ? `${(datosUsuario.historial.grasaCorporal[0] - grasaActual).toFixed(1)}%` :
               metricaActiva === "musculo" ? `+${(musculoActual - datosUsuario.historial.masaMuscular[0]).toFixed(1)} kg` :
               `${(datosUsuario.historial.imc[0] - imcActual).toFixed(1)} puntos`}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cambio mensual promedio:</Text>
            <Text style={styles.summaryValue}>
              {metricaActiva === "peso" ? `${((datosUsuario.historial.peso[0] - pesoActual) / 5).toFixed(2)} kg` :
               metricaActiva === "grasa" ? `${((datosUsuario.historial.grasaCorporal[0] - grasaActual) / 5).toFixed(2)}%` :
               metricaActiva === "musculo" ? `+${((musculoActual - datosUsuario.historial.masaMuscular[0]) / 5).toFixed(2)} kg` :
               `${((datosUsuario.historial.imc[0] - imcActual) / 5).toFixed(2)} puntos`}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Último mes:</Text>
            <Text style={styles.summaryValue}>
              {metricaActiva === "peso" ? `${(datosUsuario.historial.peso[4] - pesoActual).toFixed(1)} kg` :
               metricaActiva === "grasa" ? `${(datosUsuario.historial.grasaCorporal[4] - grasaActual).toFixed(1)}%` :
               metricaActiva === "musculo" ? `+${(musculoActual - datosUsuario.historial.masaMuscular[4]).toFixed(1)} kg` :
               `${(datosUsuario.historial.imc[4] - imcActual).toFixed(1)} puntos`}
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
              : metricaActiva === "musculo"
              ? "Aumenta tu ingesta de proteínas y asegúrate de seguir un programa de entrenamiento progresivo para continuar ganando masa muscular."
              : "Mantén hábitos alimenticios saludables y una rutina de ejercicio regular para mantener tu IMC en el rango normal."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  menuButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  avatar: {
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text1,
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 16,
    fontFamily: 'SofiaSans_500Medium',
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
    fontFamily: 'SofiaSans_800ExtraBold',
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  activeCard: {
    borderWidth: 2,
    borderColor: Colors.grad2,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text1,
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 16,
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
  },
  chartSection: {
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text1,
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
    marginBottom: 15,
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: 'Kanit_800ExtraBold',
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
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
    lineHeight: 22,
    textAlign: 'center',
  },
});