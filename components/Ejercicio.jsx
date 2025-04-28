import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../assets/Colors'
import { LinearGradient } from 'expo-linear-gradient'

// Importa todas tus imágenes de ejercicios
import { HackSquat } from '../assets/HackSquat'
import { Prensa } from '../assets/Prensa'
import { PressBanca } from '../assets/PressBanca'
import { Dominada } from '../assets/Dominada'
import { CurlBiceps } from '../assets/CurlBiceps'
import { Sentadilla } from '../assets/Sentadilla'
import { AperturaMancuernas } from '../assets/AperturaMancuernas'
import { Flexiones } from '../assets/Flexiones'
import { Plancha } from '../assets/Plancha'
import { CrunchMaquina } from '../assets/CrunchMaquina'
import { RemoMaquina } from '../assets/RemoMaquina'
import { ElevacionesLat } from '../assets/ElevacionesLat'

// Objeto que mapea nombres de ejercicios a componentes de imagen
const exerciseImages = {
    'Hack Squat': HackSquat,
    'Prensa': Prensa,
    'Press de banca': PressBanca,
    'Dominada': Dominada,
    'Curl de bíceps': CurlBiceps,
    'Sentadilla libre': Sentadilla,
    'Apertura con Mancuernas': AperturaMancuernas,
    'Flexiones': Flexiones,
    'Plancha': Plancha,
    'Crunch en máquina': CrunchMaquina,
    'Remo en máquina': RemoMaquina,
    'Elevaciones laterales': ElevacionesLat,

  // Añade más ejercicios según necesites
}

const Ejercicio = (props) => {
  const { title, muscleGroup, difficulty, equipment } = props
  
  // Obtiene el componente de imagen correspondiente al título del ejercicio
  const ExerciseImage = exerciseImages[title] || HackSquat // Usa HackSquat como imagen por defecto

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.imageContainer}>
        <ExerciseImage style={styles.image} />
      </View>
      
    </View>
  )
}

export default Ejercicio

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.fondos2,
    
    borderRadius: 20,
    margin: 10,
    padding: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text2,
    textAlign: 'center',
  },
  imageContainer: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    
    height: 100,
  },
  image: {
    
    resizeMode: 'contain',
  },
  detailsContainer: {
   
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  detailText: {
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
    fontSize: 14,
    marginVertical: 2,
  },
  btn: {
    padding: 11,
    borderRadius: 5,
    alignItems: 'center',
    width: '70%',
    marginBottom: 15,
  },
  text: {
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
  }
})