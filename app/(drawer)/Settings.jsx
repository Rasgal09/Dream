import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Switch } from 'react-native-gesture-handler'
import { Colors } from '../../assets/Colors'
import SettingsButton from '../../components/SettingsButton'
import { icons } from '../../assets/icons'
import { Stack } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Settings = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation()
  return (
    <View style={{flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <icons.Arrow color={Colors.text1} />
          </Pressable>
          <Text style={styles.title.titleConfig}>Configuración</Text>
          
        </View>
    <View style={styles.container}>
      <Text style={styles.title}>Theme Switch</Text>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text>Dark Mode</Text>
        <Switch/>
      </Pressable>
      <Text style={styles.title}>Theme Settings</Text>
      <SettingsButton 
        title='Light'  
        icon='lightbulb-on' 
        onPress={() => {}} 
        isActive={true}
      />
      <SettingsButton 
        title='Dark'  
        icon='weather-night' // Replace this with a valid icon name, e.g., 'weather-night'
        onPress={() => {}} 
        isActive={false}
      />
      <SettingsButton 
        title='Sistem'  
        icon='theme-light-dark' // Replace this with a valid icon name, e.g., 'theme-light-dark-outline'
        onPress={() => {}} 
        isActive={false}
      />
    </View>
    </View>
  
  )
  
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.text1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    titleConfig:{
      fontSize: 22,
      fontFamily: 'Kanit',
      color: Colors.text2,
      
    }
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.text2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.fondos2,
    padding: 20,
  },
})