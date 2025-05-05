// App.tsx
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Slot } from 'expo-router';
import { Colors } from '../../assets/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider backgroundColor={Colors.fondos}>
      
        <StatusBar style="light" backgroundColor={Colors.grad2} />
        <Slot/>
      
    </SafeAreaProvider>
  );
}
