import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, SofiaSans_900Black} from '@expo-google-fonts/sofia-sans';
import { Logo } from '../components/Logo';
import { Kanit_900Black } from '@expo-google-fonts/kanit';
import { LinearGradient } from 'expo-linear-gradient';

const sesioon = () =>{

  const [fontsLoaded] = useFonts({
    SofiaSans_900Black,
    Kanit_900Black
  });

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
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="silver"
        secureTextEntry
        autoCapitalize="none"
      />

      <LinearGradient 
        colors={['#00D078', '#007DF0']}
        style={styles.button}
        >
        <Link href="/Home" asChild>
          <Pressable >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </Pressable>
        </Link>
      </LinearGradient>

      <Text style={styles.footerText}>
        <Link href={"/Cuenta"} style={styles.linkText}>¿No tienes cuenta? Crea una</Link>
      </Text>
    </View>
  );
}

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
    fontSize: 40,
    fontFamily: 'SofiaSans_900Black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: 'silver',
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

export default sesioon;