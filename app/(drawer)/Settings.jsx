import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  TextInput,
  Modal,
  Alert,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons"
import { useColorScheme } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Kanit_400Regular, Kanit_500Medium, Kanit_700Bold, useFonts } from "@expo-google-fonts/kanit"
import { SofiaSans_400Regular, SofiaSans_500Medium } from "@expo-google-fonts/sofia-sans"
import { Colors } from "../../assets/Colors"


// Definición de secciones para FlatList
const createSettingsSections = () => [
  {
    id: "account",
    title: "Cuenta",
    type: "section",
  },
  {
    id: "accountCard",
    type: "accountCard",
  },
  {
    id: "appearance",
    title: "Apariencia",
    type: "section",
  },
  {
    id: "darkModeCard",
    type: "darkModeCard",
  },
  {
    id: "themeCard",
    type: "themeCard",
  },
  {
    id: "preferences",
    title: "Preferencias",
    type: "section",
  },
  {
    id: "preferencesCard",
    type: "preferencesCard",
  },
  {
    id: "help",
    title: "Ayuda y Soporte",
    type: "section",
  },
  {
    id: "helpCard",
    type: "helpCard",
  },
  {
    id: "logout",
    type: "logout",
  },
  {
    id: "version",
    type: "version",
  },
]

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const deviceTheme = useColorScheme()
  const [theme, setTheme] = useState("system") // 'light', 'dark', 'system'
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [emailModalVisible, setEmailModalVisible] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("Español")
  const [units, setUnits] = useState("Métrico") // Métrico o Imperial
  const [settingsSections] = useState(createSettingsSections())

  // Cargar fuentes usando el hook de Expo Google Fonts
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_700Bold,
    SofiaSans_400Regular,
    SofiaSans_500Medium,
  })

  // Función para cambiar el tema
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    setTheme(isDarkMode ? "light" : "dark")
  }

  // Función para seleccionar un tema específico
  const selectTheme = (selectedTheme) => {
    setTheme(selectedTheme)
    if (selectedTheme === "dark") {
      setIsDarkMode(true)
    } else if (selectedTheme === "light") {
      setIsDarkMode(false)
    } else {
      // Si es 'system', usar el tema del dispositivo
      setIsDarkMode(deviceTheme === "dark")
    }
  }

  // Función para cambiar el correo
  const handleEmailChange = () => {
    if (newEmail.trim() === "") {
      Alert.alert("Error", "Por favor ingresa un correo válido")
      return
    }

    // Aquí iría la lógica para cambiar el correo en la base de datos
    Alert.alert("Éxito", "Tu correo ha sido actualizado correctamente")
    setEmailModalVisible(false)
    setNewEmail("")
  }

  // Función para cambiar la contraseña
  const handlePasswordChange = () => {
    if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    // Aquí iría la lógica para cambiar la contraseña en la base de datos
    Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente")
    setPasswordModalVisible(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar sesión",
        onPress: () => {
          // Aquí iría la lógica para cerrar sesión
          console.log("Usuario cerró sesión")
        },
      },
    ])
  }

  // Renderizar cada tipo de elemento
  const renderItem = ({ item }) => {
    switch (item.type) {
      case "section":
        return <Text style={styles.sectionTitle}>{item.title}</Text>

      case "accountCard":
        return (
          <View style={styles.card}>
            <Pressable
              style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}
              onPress={() => setEmailModalVisible(true)}
            >
              <View style={styles.settingIconContainer}>
                <MaterialIcons name="email" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Cambiar correo electrónico</Text>
                <Text style={styles.settingValue}>usuario@ejemplo.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}
              onPress={() => setPasswordModalVisible(true)}
            >
              <View style={styles.settingIconContainer}>
                <Feather name="lock" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Cambiar contraseña</Text>
                <Text style={styles.settingValue}>••••••••</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>
          </View>
        )

      case "darkModeCard":
        return (
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="moon" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Modo oscuro</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: Colors.grad1 }}
                thumbColor={isDarkMode ? Colors.text2 : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            </View>
          </View>
        )

      case "themeCard":
        return (
          <View style={styles.card}>
            <Pressable
              style={({ pressed }) => [
                styles.themeOption,
                theme === "light" && styles.selectedTheme,
                pressed && styles.pressedItem,
              ]}
              onPress={() => selectTheme("light")}
            >
              <View style={styles.themeIconContainer}>
                <Ionicons name="sunny" size={22} color={theme === "light" ? Colors.grad1 : Colors.text1} />
              </View>
              <Text style={[styles.themeText, theme === "light" && styles.selectedThemeText]}>Claro</Text>
              {theme === "light" && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.grad1} />
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.themeOption,
                theme === "dark" && styles.selectedTheme,
                pressed && styles.pressedItem,
              ]}
              onPress={() => selectTheme("dark")}
            >
              <View style={styles.themeIconContainer}>
                <Ionicons name="moon" size={22} color={theme === "dark" ? Colors.grad1 : Colors.text1} />
              </View>
              <Text style={[styles.themeText, theme === "dark" && styles.selectedThemeText]}>Oscuro</Text>
              {theme === "dark" && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.grad1} />
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.themeOption,
                theme === "system" && styles.selectedTheme,
                pressed && styles.pressedItem,
              ]}
              onPress={() => selectTheme("system")}
            >
              <View style={styles.themeIconContainer}>
                <Ionicons name="settings-outline" size={22} color={theme === "system" ? Colors.grad1 : Colors.text1} />
              </View>
              <Text style={[styles.themeText, theme === "system" && styles.selectedThemeText]}>Sistema</Text>
              {theme === "system" && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.grad1} />
                </View>
              )}
            </Pressable>
          </View>
        )

      case "preferencesCard":
        return (
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="notifications" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Notificaciones</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: Colors.grad1 }}
                thumbColor={notifications ? Colors.text2 : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setNotifications(!notifications)}
                value={notifications}
              />
            </View>

            <Pressable style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="language" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Idioma</Text>
                <Text style={styles.settingValue}>{language}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>

            <Pressable style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}>
              <View style={styles.settingIconContainer}>
                <FontAwesome name="balance-scale" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Unidades de medida</Text>
                <Text style={styles.settingValue}>{units}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>
          </View>
        )

      case "helpCard":
        return (
          <View style={styles.card}>
            <Pressable style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="help-circle" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Centro de ayuda</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>

            <Pressable style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="document-text" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Términos y condiciones</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>

            <Pressable style={({ pressed }) => [styles.settingItem, pressed && styles.pressedItem]}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="shield-checkmark" size={22} color={Colors.text1} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Política de privacidad</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={Colors.text1} />
            </Pressable>
          </View>
        )

      case "logout":
        return (
          <Pressable style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]} onPress={handleLogout}>
            <LinearGradient
              colors={Colors.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </LinearGradient>
          </Pressable>
        )

      case "version":
        return <Text style={styles.versionText}>Versión 1.0.0</Text>

      default:
        return null
    }
  }

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.grad1} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light" backgroundColor={Colors.fondos2} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={Colors.text2} />
        </Pressable>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <FlatList
        data={settingsSections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal para cambiar correo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar correo electrónico</Text>

            <TextInput
              style={styles.input}
              placeholder="Nuevo correo electrónico"
              placeholderTextColor="#888"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.cancelButton, pressed && { opacity: 0.8 }]}
                onPress={() => setEmailModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.confirmButton, pressed && { opacity: 0.8 }]}
                onPress={handleEmailChange}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>

            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              placeholderTextColor="#888"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="#888"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.cancelButton, pressed && { opacity: 0.8 }]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalButton, styles.confirmButton, pressed && { opacity: 0.8 }]}
                onPress={handlePasswordChange}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fondos,
  },
  header: {
    backgroundColor: Colors.fondos2,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    color: Colors.text2,
    fontSize: 24,
    fontFamily: "Kanit_700Bold",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: Colors.text1,
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "Kanit_500Medium",
  },
  card: {
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  pressedItem: {
    opacity: 0.7,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  settingIconContainer: {
    width: 40,
    alignItems: "center",
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  settingLabel: {
    color: Colors.text2,
    fontSize: 16,
    fontFamily: "Kanit_400Regular",
  },
  settingValue: {
    color: Colors.text1,
    fontSize: 14,
    marginTop: 2,
    fontFamily: "SofiaSans_400Regular",
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  themeIconContainer: {
    width: 40,
    alignItems: "center",
  },
  themeText: {
    color: Colors.text2,
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    fontFamily: "Kanit_400Regular",
  },
  selectedTheme: {
    backgroundColor: "rgba(0,208,120,0.1)",
  },
  selectedThemeText: {
    color: Colors.text2,
    fontFamily: "Kanit_500Medium",
  },
  checkmark: {
    marginLeft: "auto",
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 10,
  },
  gradientButton: {
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    color: Colors.text2,
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
  },
  versionText: {
    color: Colors.text1,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    fontFamily: "SofiaSans_400Regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: Colors.fondos2,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: Colors.text2,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Kanit_700Bold",
  },
  input: {
    backgroundColor: Colors.fondos,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: Colors.text2,
    fontFamily: "SofiaSans_400Regular",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#444",
  },
  confirmButton: {
    backgroundColor: Colors.grad1,
  },
  modalButtonText: {
    color: Colors.text2,
    fontFamily: "Kanit_500Medium",
  },
})

export default SettingsScreen
