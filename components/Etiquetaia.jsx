import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Kanit_800ExtraBold, useFonts } from '@expo-google-fonts/kanit';
import { SofiaSans_800ExtraBold, SofiaSans_500Medium } from '@expo-google-fonts/sofia-sans';
import { Brain } from '../assets/Brain';
import { Colors } from '../assets/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router'; // Import del router

export const Etiquetaia = () => {
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
      router.push('/(Preg)/PreExcer');
    } catch (error) {
      console.error("Error en navegación:", error);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>INICIA UNA NUEVA RUTINA</Text>
      <View style={styles.container}>
        <Brain style={styles.img} />
        <View style={styles.texte}>
          <Text style={styles.texto}>
            Utiliza una herramienta con IA para diseñar una rutina adecuada a tus metas
          </Text>
          <TouchableOpacity onPress={handlePress}>
            <LinearGradient colors={Colors.gradient} style={styles.btn}>
              <Text style={styles.txtbtn}>FORTIA CREA TU RUTINA</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    textAlign: 'center',
  },
  texto: {
    color: Colors.text2,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'SofiaSans_800ExtraBold',
    paddingBottom: 25,
  },
  btn: {
    padding: 11,
    borderRadius: 5,
    alignItems: 'center',
  },
  txtbtn: {
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2,
  },
  img: {
    // Puedes ajustar estilos para la imagen aquí si quieres
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  texte: {
    alignItems: 'center',
    flexShrink: 1,
  },
});
