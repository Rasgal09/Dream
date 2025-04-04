import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from './Colors';

export const Rutina = () => {
    
  return (

    <View style={styles.card}>
        <Text style={styles.cardTitle}>Rutina de Pecho-Hombro-Trícep (IA)</Text>
        <Text style={styles.cardText}>
            3 x 12 Flys en Máquina
        </Text>
        <Text style={styles.cardText}>
            3 x 12 Press Militar
        </Text>
        <Text style={styles.cardText}>
            3 x 12 Press Francés
        </Text>
        <TouchableOpacity>
            <LinearGradient style={styles.button} colors={Colors.gradient}>
                <Text style={styles.buttonText}>Ver Más..</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>

  )
}

export default Rutina

const styles = StyleSheet.create({

      card: {
        backgroundColor: Colors.fondos2,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '90%',

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
        borderRadius: 10,
        width: '50%',
        alignItems: 'center',
        alignSelf: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
      },
})