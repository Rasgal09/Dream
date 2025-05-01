import { Stack, Redirect } from "expo-router"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ActivityIndicator, View } from "react-native"

// Componente para manejar el layout raíz
function RootNavigator() {
  const { userToken, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(drawer)" />
      )}
      
      {/* Redirecciones por defecto */}
      {userToken && <Redirect href="/(drawer)/(tabs)/Home" />}
      {!userToken && <Redirect href="/(auth)/Session" />}
    </Stack>
  )
}

// Componente principal que envuelve con el AuthProvider
export default function AppLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}