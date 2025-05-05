import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Verificar autenticación al cargar
  /* useEffect(() => {
    // Aquí verificarías si el usuario tiene una sesión válida
    checkAuthStatus().then(status => {
      setIsAuthenticated(status);
      if (!status) {
        // Redirigir a autenticación si no hay sesión
        router.replace('/auth/sesioon');
      } else {
        // Redirigir a la aplicación principal si hay sesión
        router.replace('/drawer');
      }
    });
  }, []); */

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      
    </Stack>
  );
}