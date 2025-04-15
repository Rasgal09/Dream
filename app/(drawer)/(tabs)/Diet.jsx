import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const diet = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea}>
              <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.container}>
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Enfoque: Mantenimiento de Peso</Text>
                        <Text style={styles.cardText}>
                        Mantener un equilibrio entre proteínas, carbohidratos y grasas sin déficit ni excedente calórico.
                        </Text>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>Ver Más..</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
      
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Enfoque: Ganancia Muscular </Text>
                        <Text style={styles.cardText}>
                        Consumir más calorías de las que el cuerpo necesita, junto con entrenamiento de fuerza, para construir músculo.
                        </Text>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>Ver Más..</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
        
                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Enfoque: Recomposición Corporal</Text>
                        <Text style={styles.cardText}>
                        se busca perder grasa y ganar músculo al mismo tiempo, sin pasar por fases tradicionales de "volumen" (ganancia de peso) y "definición" (pérdida de grasa).
                        </Text>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>Ver Más..</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.card}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>Enfoque: Pérdida de Peso</Text>
                        <Text style={styles.cardText}>
                        Consumir menos calorías de las que el cuerpo gasta, generando un déficit energético que lleva a la pérdida de grasa.
                        </Text>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.buttonText}>Ver Más..</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  
                  <View style={styles.spacer} />
                </View>
              </ScrollView>
            </SafeAreaView>
  )
}

export default diet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181717',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 90, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#3b37377b',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#aaa',
  },
  button: {
    backgroundColor: '#2dc88a91',
    padding: 11,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  spacer: {
    height: 70,
  },
});