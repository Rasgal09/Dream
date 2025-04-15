import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../../../assets/Colors';
import { StatusBar } from 'expo-status-bar';
import TabBar from '../../../components/TabBar'; // Asegúrate que la importación es correcta

const Layout = () => {
    return (
        <SafeAreaProvider style={styles.container}>
            <StatusBar style="light" backgroundColor={Colors.fondos} />
            
            <Tabs 
                tabBar={props => <TabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen 
                    name="Home" 
                    options={{
                        title: 'Inicio',
                    }}
                />
                <Tabs.Screen 
                    name="Rutines" 
                    options={{
                        title: 'Rutina',                      
                    }}
                />
                <Tabs.Screen 
                    name="Diet" 
                    options={{
                        title: 'Dieta',                        
                    }}
                />
                <Tabs.Screen 
                    name="User" 
                    options={{
                        title: 'Perfil',                    
                    }}
                />
            </Tabs>
        </SafeAreaProvider>
    )
}

export default Layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.fondos,
    }
})