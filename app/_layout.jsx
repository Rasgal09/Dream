import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const _layout = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.coontainer}>
        <Slot />
      </View>
    </SafeAreaProvider>
  )
}

export default _layout

const styles = StyleSheet.create({
  coontainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  }
})