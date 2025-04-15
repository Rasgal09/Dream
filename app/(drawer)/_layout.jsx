import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../assets/Colors';
import { useRouter } from 'expo-router';
import { icons } from '../../assets/icons';


export default function DrawerLayout() {
  const router = useRouter();

    return (
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
            <icons.Home color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          title: 'Configuración',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} style={{padding:10}}/>
          ),
        }}
      />
      <Drawer.Screen
        name="Exercises"
        options={{
          title: 'Ejercicios',
          drawerIcon: ({ color }) => (
            <Ionicons name="person" size={22} color={color} style={{padding:10}}/>
          ),
        }}
      />
      
    </Drawer>
  );
}