import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Dimensions 
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from "../app/context/AuthContext";
import axios from "axios";
import { Userprofile } from "../assets/Userprofile";
import { icons } from "../assets/icons";
import { Colors } from "../assets/Colors";

const screenWidth = Dimensions.get("window").width;

export const CompUser = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [metricaActiva, setMetricaActiva] = useState("peso");
  const [historialPeso, setHistorialPeso] = useState([]);

  // Obtener historial de peso
  useEffect(() => {
    const fetchProgreso = async () => {
      try {
        const response = await axios.get('http://192.168.1.126:3000/progreso', {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        setHistorialPeso(response.data);
      } catch (error) {
        console.error("Error al obtener progreso:", error);
      }
    };
    
    if (userData) fetchProgreso();
  }, [userData]);

  // Calcular IMC
  const calcularIMC = () => {
    if (!userData?.peso || !userData?.altura) return 0;
    const alturaEnMetros = userData.altura / 100;
    return (userData.peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
  };

  const imcActual = parseFloat(calcularIMC());
  const pesoActual = userData?.peso || 0;

  // Configuración del gráfico
  const chartConfig = {
    backgroundGradientFrom: "#1E1E1E",
    backgroundGradientTo: "#1E1E1E",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 208, 120, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" }
  };

  const datosGrafica = {
    labels: historialPeso.map((_, index) => `Mes ${index + 1}`),
    datasets: [{
      data: historialPeso.map(item => item.peso),
    }]
  };

  // Estado del IMC
  const estadoIMC = () => {
    if (imcActual < 18.5) return "Bajo peso";
    if (imcActual < 25) return "Peso normal";
    if (imcActual < 30) return "Sobrepeso";
    return "Obesidad";
  };

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView>
        {/* Header */}
        <View>
          <TouchableOpacity onPress={handleMenuPress}>
            <icons.Menu color="#FFF" />
          </TouchableOpacity>
          
          <Userprofile />
          
          <View>
            <Text>{userData?.nombre || "Usuario"}</Text>
            <Text>{userData?.altura || 0} cm</Text>
            <Text>IMC: {imcActual} ({estadoIMC()})</Text>
          </View>
        </View>

        {/* Tarjetas de métricas */}
        <View>
          <TouchableOpacity onPress={() => setMetricaActiva("peso")}>
            <Text>{pesoActual} kg</Text>
            <Text>Peso actual</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMetricaActiva("imc")}>
            <Text>{imcActual}</Text>
            <Text>IMC</Text>
          </TouchableOpacity>
        </View>

        {/* Gráfico */}
        <LineChart
          data={datosGrafica}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          bezier
        />

        {/* Resumen */}
        <View>
          <Text>Resumen de Progreso</Text>
          <Text>Peso inicial: {historialPeso[0]?.peso || 0} kg</Text>
          <Text>Cambio total: {(pesoActual - (historialPeso[0]?.peso || 0)).toFixed(1)} kg</Text>
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