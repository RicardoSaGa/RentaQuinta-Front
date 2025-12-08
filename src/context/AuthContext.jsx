// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const defaultAvatars = {
  Masculino: "/src/assets/avatars/male-default.png",
  Femenino: "/src/assets/avatars/female-default.png",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Cambia ESTA constante según estés en local o en el servidor
  // LOCAL:   "http://localhost:8080"
  // PRODUC:  "https://rentaquinta.com/api"
  const AUTH_BASE = "https://rentaquinta.com/api";

  // Cargar perfil si ya hay token guardado
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${AUTH_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        console.warn("No se pudo cargar el perfil, manteniendo token.");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // LOGIN (email + password)
  const login = async (email, password) => {
    // 1) pedir token
    const res = await axios.post(`${AUTH_BASE}/auth/login`, {
      email,
      password,
    });

    const newToken = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // 2) cargar perfil
    const profile = await axios.get(`${AUTH_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${newToken}` },
    });

    setUser(profile.data);
  };

  // REGISTER (nombre + email + password)
  const register = async (userData) => {
    // Si el usuario no elige avatar, asignar uno por defecto según género
    const finalData = {
      ...userData,
      avatar: userData.avatar || defaultAvatars[userData.genero],
    };

    const response = await axios.post(
      `${API_URL}/auth/register`,
      finalData,
      { withCredentials: true }
    );

    setUser(response.data.user);
    setIsAuthenticated(true);
  };


  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
