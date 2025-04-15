import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../../assets/Colors';

const Layout = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={Colors.fondos} />
      <View style={styles.container}>
        <Slot />
      </View>
    </SafeAreaProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondos,
  },
});