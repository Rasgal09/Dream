import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Switch } from 'react-native-gesture-handler'
import { Colors } from '../../assets/Colors'

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Switch</Text>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text>Dark Mode</Text>
        <Switch/>
      </Pressable>
      <Text style={styles.title}>Theme Settings</Text>
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
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.text2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  }
})