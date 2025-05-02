import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import axios from 'axios';
import { useFonts, SofiaSans_900Black } from '@expo-google-fonts/sofia-sans';
import { Kanit_900Black } from '@expo-google-fonts/kanit';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../../components/Logo';
import { Colors } from '../../assets/Colors';

const Session = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    SofiaSans_900Black,
    Kanit_900Black
  });

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setCargando(true);

    try {
      const response = await axios.post('http://10.33.25.219:3000/login', {
        correo,
        contrasena
      });

      if (response.data.success) {
        router.replace('/Home');
      }
    } catch (error) {
      const mensaje = error.response?.data?.error || 'Error de conexión';
      Alert.alert('Error', mensaje);
    } finally {
      setCargando(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Logo />
      <Text style={styles.title}>BIENVENIDO</Text>
      <Text style={styles.title}>A</Text>
      <Text style={styles.title}>FORTIA</Text>
      <Text style={styles.subtitle}>Inicia sesión con nosotros</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="silver"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="silver"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        autoCapitalize="none"
      />

      <LinearGradient 
        colors={['#00D078', '#007DF0']}
        style={styles.button}
      >
        <Pressable 
          onPress={handleLogin}
          disabled={cargando}
          style={styles.pressable}
        >
          <Text style={styles.buttonText}>
            {cargando ? 'CARGANDO...' : 'INGRESAR'}
          </Text>
        </Pressable>
      </LinearGradient>

      <Text style={styles.footerText}>
        <Link href="/Cuenta" style={styles.linkText}>¿No tienes cuenta? Crea una</Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.fondos,
  },
  title: {
    color: Colors.text2,
    fontSize: 40,
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.text1,
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 20,
  },
  input: {
    width: '95%',
    height: 50,
    fontFamily: 'SofiaSans_900Black',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    color: Colors.text1,
    backgroundColor: Colors.fondos2,
  },
  button: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
  },
  pressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text2,
    fontSize: 16,
    fontFamily: 'Kanit_900Black',
  },
  footerText: {
    fontSize: 14,
    color: Colors.text2,
    fontFamily: 'SofiaSans_900Black',
  },
  linkText: {
    fontWeight: 'bold',
  },
});

export default Session;