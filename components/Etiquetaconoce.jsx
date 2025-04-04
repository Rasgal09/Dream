import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Kanit_800ExtraBold, useFonts } from '@expo-google-fonts/kanit';
import { SofiaSans_800ExtraBold, SofiaSans_500Medium } from '@expo-google-fonts/sofia-sans';
import { Trainer } from '../assets/Trainer';
import { Colors } from './Colors';
import { LinearGradient } from 'expo-linear-gradient';


export const Etiquetaconoce = () => {

  const [fontsLoaded] = useFonts({
    SofiaSans_800ExtraBold,
    Kanit_800ExtraBold,
    SofiaSans_500Medium
  });
  
  if (!fontsLoaded) { 
    return null; 
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>CONOCE LOS EJERCICIOS</Text>
      <View  style={styles.container}>
        <Trainer style={styles.img}/>
        <View style={styles.texte}>        
          <Text style={styles.texto}>
          Conoce los ejercicios con los que cuenta la aplicación
          </Text>
          <TouchableOpacity>
            <LinearGradient colors={Colors.gradient} style={styles.btn}>
              <Text style={styles.txtbtn}>CONOCE LOS EJERCICIOS</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  card : {
    backgroundColor: Colors.fondos2,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    flex: 1,
    width: '90%',
    
  },
  titulo : {
    fontSize: 16,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text1,
    marginBottom: 5,
    textAlign: "center",

  },
  texto : {
    color: Colors.text2,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'SofiaSans_800ExtraBold',
    paddingBottom: 25
    
  },
  btn : {
    padding: 11,
    borderRadius: 5,
   
    alignItems: 'center',
    
  },
  txtbtn : {
    fontFamily: 'SofiaSans_500Medium',
    color: Colors.text2
  }, 
  img :{
    
  },
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    flexDirection: 'row'
  },
  texte : {
    alignItems: 'center',
    flexShrink: 1,
    
  },
});