/* import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Aquí puedes verificar si el usuario ya tiene una sesión activa
    async function checkAuth() {
      try {
        // Ejemplo de verificación de autenticación
        // Podría ser una llamada a AsyncStorage, un API, etc.
        const userToken = await checkUserSession();
        
        // Actualizar estado basado en si hay token o no
        setIsAuthenticated(!!userToken);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    }
    
    checkAuth();
  }, []);

  // Mientras verifica la autenticación, muestra un indicador de carga
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  // Redirige basado en el estado de autenticación
  if (isAuthenticated) {
    // Si está autenticado, redirige al drawer
    return <Redirect href="/drawer" />;
  } else {
    // Si no está autenticado, redirige a la pantalla de inicio de sesión
    return <Redirect href="/auth/sesioon" />;
  }
}

  import { Redirect } from 'expo-router';

export default function Index() {
  // Simplemente redirige a la ruta de autenticación
  return <Redirect href="/auth/sesioon" />;
} */