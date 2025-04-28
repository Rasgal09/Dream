import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Kanit_800ExtraBold, useFonts } from '@expo-google-fonts/kanit';
import { SofiaSans_800ExtraBold, SofiaSans_500Medium } from '@expo-google-fonts/sofia-sans';
import { Trainer } from '../assets/Trainer';
import { Colors } from '../assets/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export const Etiquetaconoce = () => {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    SofiaSans_800ExtraBold,
    Kanit_800ExtraBold,
    SofiaSans_500Medium
  });
  
  if (!fontsLoaded) { 
    return null; 
  }

  const handlePress = () => {
    try {
      router.push('/(drawer)/Exercises');
      
    } catch (error) {
      console.error("Error en navegación:", error); // Captura de errores
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>CONOCE LOS EJERCICIOS</Text>
      <View style={styles.container}>
        <Trainer style={styles.img}/>
        <View style={styles.texte}>        
          <Text style={styles.texto}>
            Conoce los ejercicios con los que cuenta la aplicación
          </Text>
          <Pressable 
            onPress={handlePress}
            style={({ pressed }) => [
              styles.btnContainer,
              { opacity: pressed ? 0.6 : 1 } // Efecto de opacidad
            ]}
          >
            <LinearGradient colors={Colors.gradient} style={styles.btn}>
              <Text style={styles.txtbtn}>CONOCE LOS EJERCICIOS</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.fondos2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    flex: 1,
    width: '90%',
  },
  titulo: {
    fontSize: 16,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text1,
    marginBottom: 5,
    textAlign: "center",
  },
  texto: {
    color: Colors.text2,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'SofiaSans_800ExtraBold',
    paddingBottom: 25
  },
  btnContainer: { // Nuevo contenedor para el efecto
    width: '100%',
  },
  btn: {
    padding: 11,
    borderRadius: 5,
    alignItems: 'center',
  },
  txtbtn: {
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2
  }, 
  img: {
    // Estilos de imagen
  },
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  texte: {
    flex: 1,
    flexShrink: 1,
  },
});