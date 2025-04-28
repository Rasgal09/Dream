import { Drawer } from 'expo-router/drawer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../assets/Colors';
import { useRouter } from 'expo-router';
import { icons } from '../../assets/icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function DrawerLayout() {
  const router = useRouter();

    return (
    <SafeAreaProvider>
      <Drawer
      screenOptions={{
        headerShown: false,
        drawerInactiveTintColor: Colors.text2,
        drawerActiveTintColor: Colors.text2,
        drawerActiveBackgroundColor: Colors.grad2,
        drawerLabelStyle: { marginLeft: -20 },
        drawerStyle: {
          backgroundColor: Colors.fondos,
          width: 250,
        },
        drawerPosition: 'right',
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Inicio',
          drawerIcon: ({ color }) => (
            <MaterialIcons name='home' size={22} color={color} style={{padding:10}}/>
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          title: 'Configuración',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="settings" size={22} color={color} style={{padding:10}}/>
          ),
        }}
      />
      <Drawer.Screen
        name="Exercises"
        options={{
          title: 'Ejercicios',
          drawerIcon: ({ color }) => (
            <MaterialIcons name="person" size={22} color={color} style={{padding:10}}/>
          ),
        }}
      />
      
    </Drawer>
    </SafeAreaProvider>
  );
}