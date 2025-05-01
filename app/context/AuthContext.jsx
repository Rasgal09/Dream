import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt from "jsonwebtoken";// Añade esta importación
import axios from "axios"; // Para verificación con el backend

const AuthContext = createContext();
const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro"; // Asegúrate de tener esto

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para verificar token con el backend
  const verificarToken = async (token) => {
    try {
      const response = await axios.get("http://10.33.25.219:3000/verificar-token", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valido;
    } catch (error) {
      return false;
    }
  };

  // Cargar y verificar sesión unificada
  // Función modificada para verificar token
const cargarSesion = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    
    if (token) {
      const response = await axios.get('http://10.33.25.219:3000/auth/verificar-token', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.valido) {
        setUserToken(token);
        setUserData(response.data.usuario);
      } else {
        await signOut();
      }
    }
  } catch (error) {
    await signOut();
  } finally {
    setIsLoading(false);
  }
};
  // Función para obtener usuario del backend
  const obtenerUsuarioDeBD = async (userId) => {
    try {
      const response = await axios.get(`http://10.33.25.219:3000/users/${userId}`);
      return response.data.usuario;
    } catch (error) {
      throw new Error("Error obteniendo usuario");
    }
  };

  useEffect(() => {
    cargarSesion();
  }, []);

  // Función de login mejorada con verificación
  const signIn = async (token, user) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const usuarioCompleto = await obtenerUsuarioDeBD(decoded.userId);
      
      await AsyncStorage.multiSet([
        ["userToken", token],
        ["userData", JSON.stringify(usuarioCompleto)]
      ]);
      
      setUserToken(token);
      setUserData(usuarioCompleto);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Función de logout mejorada
  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData"]);
      setUserToken(null);
      setUserData(null);
      return true;
    } catch (error) {
      console.error("Error en logout:", error);
      return false;
    }
  };

  // Actualización de datos con sincronización
  const updateUserData = async (newData) => {
    try {
      const usuarioActualizado = await obtenerUsuarioDeBD(newData.id);
      await AsyncStorage.setItem("userData", JSON.stringify(usuarioActualizado));
      setUserData(usuarioActualizado);
      return true;
    } catch (error) {
      console.error("Error actualizando datos:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userData,
        isLoading,
        isAuthenticated: !!userToken,
        signIn,
        signOut,
        updateUserData,
        cargarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};