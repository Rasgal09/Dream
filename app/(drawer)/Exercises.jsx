import { StyleSheet, Text, View, Pressable } from 'react-native'
import { icons } from '../../assets/icons'
import { useNavigation } from 'expo-router';
import { Colors } from '../../assets/Colors'
import React from 'react'

const Exercises = () => {

  const navigation = useNavigation();
  return (
    <View>
      <Text>Exercises</Text>
      <Pressable onPress={() => navigation.goBack()}>
          <icons.Arrow color={Colors.text1} />
        </Pressable>
    </View>
  )
}

export default Exercises

const styles = StyleSheet.create({})