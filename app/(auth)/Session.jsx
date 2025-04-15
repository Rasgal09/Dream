import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useFonts, SofiaSans_900Black} from '@expo-google-fonts/sofia-sans';
import { Logo } from '../../components/Logo';
import { Kanit_900Black } from '@expo-google-fonts/kanit';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../assets/Colors';

const Session = () =>{

  const insets = useSafeAreaInsets();

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
          <Pressable 
            
          >
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
    textcolor: Colors.text1,
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
    fontFamily: 'SofiaSans_900Black',
  },
});

export default Session;