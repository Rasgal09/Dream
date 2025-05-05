import { useState, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Kanit_400Regular, Kanit_500Medium, Kanit_700Bold, useFonts } from "@expo-google-fonts/kanit";
import { SofiaSans_400Regular, SofiaSans_500Medium } from "@expo-google-fonts/sofia-sans";
import { Colors } from "../../assets/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

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
];

const SettingsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState("system");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("Español");
  const [units, setUnits] = useState("Métrico");
  const [settingsSections] = useState(createSettingsSections());
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar fuentes
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_700Bold,
    SofiaSans_400Regular,
    SofiaSans_500Medium,
  });

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem("userEmail");
        if (!userEmail) throw new Error("No hay usuario logueado");

        const response = await axios.get(`http://192.168.1.126:3000/api/users/usuario?correo=${encodeURIComponent(userEmail)}`);
        if (!response.data) throw new Error("No se recibieron datos del usuario");

        setUserData(response.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Cambiar tema
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? "light" : "dark");
  };

  // Seleccionar tema específico
  const selectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    if (selectedTheme === "dark") {
      setIsDarkMode(true);
    } else if (selectedTheme === "light") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(deviceTheme === "dark");
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async () => {
    if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 4) {
      Alert.alert("Error", "La contraseña debe tener al menos 4 caracteres");
      return;
    }

    try {
      const response = await axios.put('http://192.168.1.115:3000/usuario/contrasena', {
        correo: userData.correo,
        contrasenaActual: currentPassword,
        nuevaContrasena: newPassword
      });

      if (response.data.success) {
        Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente");
        setPasswordModalVisible(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", response.data.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      Alert.alert("Error", error.response?.data?.error || "Error en el servidor al cambiar la contraseña");
    }
  };

  const handleEmailChange = async () => {
    if (newEmail.trim() === "") {
        Alert.alert("Error", "Por favor ingresa un correo válido");
        return;
    }

    if (currentPassword.trim() === "") {
        Alert.alert("Error", "Por favor ingresa tu contraseña actual");
        return;
    }

    // Validación de formato de correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        Alert.alert("Error", "Formato de correo electrónico inválido");
        return;
    }

    try {
        const response = await axios.put('http://192.168.1.115:3000/usuario/correo', {
            correoActual: userData.correo,
            nuevoCorreo: newEmail.trim().toLowerCase(),
            contrasena: currentPassword
        });

        if (response.data.success) {
            await AsyncStorage.setItem("userEmail", newEmail.trim().toLowerCase());
            setUserData({ ...userData, correo: newEmail.trim().toLowerCase() });
            Alert.alert("Éxito", "Tu correo ha sido actualizado correctamente");
            setEmailModalVisible(false);
            setNewEmail("");
            setCurrentPassword("");
        } else {
            Alert.alert("Error", response.data.error || "Error al actualizar el correo");
        }
    } catch (error) {
        console.error("Error al cambiar correo:", error);
        Alert.alert("Error", error.response?.data?.error || "Error en el servidor al cambiar el correo");
    }
};
  // Cerrar sesión
  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar sesión",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userEmail");
            // Reemplaza toda la pila de navegación
            router.replace('/(auth)/Session');
          } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Alert.alert("Error", "Ocurrió un problema al cerrar sesión");
          }
        },
      },
    ]);
  };

  // Renderizar cada elemento de configuración
  const renderItem = ({ item }) => {
    switch (item.type) {
      case "section":
        return <Text style={styles.sectionTitle}>{item.title}</Text>;

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
                <Text style={styles.settingLabel}>Correo electrónico</Text>
                <Text style={styles.settingValue}>{userData?.correo || "Cargando..."}</Text>
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
        );

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
        );

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
        );

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
        );

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
        );

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
        );

      case "version":
        return <Text style={styles.versionText}>Versión 1.0.0</Text>;

      default:
        return null;
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.grad1} />
      </View>
    );
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

            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              placeholderTextColor="#888"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
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
  );
};

// Estilos
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
});

export default SettingsScreen;