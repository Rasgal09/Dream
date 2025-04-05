import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../../components/Colors';
import { Userprofile } from '../../components/Userprofile';
import { icons } from '../../assets/icons';

const User = () => {
  return (
    <View style={styles.container}>
      <icons.Menu color={Colors.text1}/>
      <Userprofile/>
      
      <View>

        <TouchableOpacity  style={styles.cont}>
          <Text style={styles.text.edit}>
            Edit your profile
          </Text>
          <icons.Edit color={Colors.text1}/>
        </TouchableOpacity>
      </View>
      <View style={styles.datos}>
      <Text style={styles.text}>
          Nombre del Usuario 
        </Text>
      </View>
      <View style={styles.datos}>
        <Text style={styles.text}>
          Datos
        </Text>
        <View>
          <Text style={styles.text.data}>
            Peso... 49kg
          </Text>
        </View>
      </View>
    </View>
  )
}

export default User

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.fondos,
  },
  cont:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  }, 
  datos:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, 
    backgroundColor: Colors.fondos2,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'column',
  }, 
  text:{
    fontSize: 24,
    fontFamily: 'Kanit_800ExtraBold',
    color: Colors.text1,
    paddingHorizontal: 5,
    edit:{
      fontSize: 16,
      fontFamily: 'SofiaSans_Italic',
      color: Colors.text1,
      paddingHorizontal: 5
    },
    data:{
      fontSize: 16,
      fontFamily: 'SofiaSans_Italic',
      color: Colors.text2,

    }
  }
})