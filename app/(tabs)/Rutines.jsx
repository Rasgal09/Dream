import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import React from 'react'
import { Rutina } from '../../components/Rutina'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../components/Colors';

const rutines = () => {

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[ styles.safeArea, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>

              <Rutina/>
              <Rutina/>
              <Rutina/>
              <Rutina/>

              
            </View>
            
          </ScrollView>
        </SafeAreaView>
  )
}

export default rutines

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.fondos,
  },
  scrollContainer: {
    paddingBottom: 90, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  spacer: {
    height: '1%', 
  },
});