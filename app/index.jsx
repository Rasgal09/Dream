import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Logo } from '../components/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const SesionScreen = () => {
  const [fontsLoaded] = useFonts({
    'SofiaSans_900Black': require('@expo-google-fonts/sofia-sans').SofiaSans_900Black,
    'Kanit_900Black': require('@expo-google-fonts/kanit').Kanit_900Black
  });

  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.correo || !formData.contraseña) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.1.115:3000/login', formData);
      
      if (response.data.success) {
        router.replace('/home');
      } else {
        Alert.alert('Error', response.data.error || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Ocurrió un error al intentar iniciar sesión';
      
      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>BIENVENIDO</Text>
      <Text style={styles.title}>A</Text>
      <Text style={styles.title}>FORTIA</Text>
      <Text style={styles.subtitle}>Inicia sesión con nosotros</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="silver"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.correo}
        onChangeText={(text) => handleChange('correo', text)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="silver"
        secureTextEntry
        autoCapitalize="none"
        value={formData.contraseña}
        onChangeText={(text) => handleChange('contraseña', text)}
      />

      <LinearGradient 
        colors={['#00D078', '#007DF0']}
        style={styles.button}
      >
                <Link href="/home" asChild>
          <Pressable >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </Pressable>
        </Link>

        {/* <Pressable 
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1
          })}
        >
          <Text style={styles.buttonText}>
            {loading ? 'INICIANDO...' : 'INGRESAR'}
          </Text>
        </Pressable> */}
      </LinearGradient>

      <Text style={styles.footerText}>
        ¿No tienes cuenta? <Link href="/cuenta" style={styles.linkText}>Crea una</Link>
      </Text>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  title: {
    color: "#fff",
    fontSize: 35,
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: 'silver',
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 20,
    marginTop:5
  },
  input: {
    width: '95%',
    height: 50,
    fontFamily: 'SofiaSans_900Black',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    textcolor: '#B1B1B1',
    backgroundColor: '#313131',
  },
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#2dc88a91',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Kanit_900Black',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'SofiaSans_900Black',
  },
  linkText: {
    
    fontWeight: 'bold',
    fontFamily: 'SofiaSans_900Black',
    LinearGradient: '',
  },
});

export default SesionScreen;