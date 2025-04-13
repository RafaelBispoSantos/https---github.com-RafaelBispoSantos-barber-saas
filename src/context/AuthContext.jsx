import { createContext, useState, useEffect } from "react";
import api from "../lib/api";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Inicializa o contexto de autenticação verificando o localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("barbercut_user");
    const storedToken = localStorage.getItem("barbercut_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/auth/login", credentials);
      
      const { token, user } = response.data;
      
      localStorage.setItem("barbercut_token", token);
      localStorage.setItem("barbercut_user", JSON.stringify(user));
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      setIsLoading(false);
      
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao fazer login";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/auth/register", userData);
      
      const { token, user } = response.data;
      
      localStorage.setItem("barbercut_token", token);
      localStorage.setItem("barbercut_user", JSON.stringify(user));
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      setIsLoading(false);
      
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao registrar";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const registerEstablishment = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/auth/register-estabelecimento", data);
      
      const { token, user, estabelecimento } = response.data;
      
      localStorage.setItem("barbercut_token", token);
      localStorage.setItem("barbercut_user", JSON.stringify(user));
      localStorage.setItem("barbercut_establishment", JSON.stringify(estabelecimento));
      
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      setIsLoading(false);
      
      return { success: true, user, establishment: estabelecimento };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao registrar estabelecimento";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem("barbercut_token");
    localStorage.removeItem("barbercut_user");
    localStorage.removeItem("barbercut_establishment");
    
    delete api.defaults.headers.common["Authorization"];
    
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/api/usuarios/${user.id}`, userData);
      
      const updatedUser = { ...user, ...response.data.data };
      
      localStorage.setItem("barbercut_user", JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setIsLoading(false);
      
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar perfil";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.patch(`/api/usuarios/alterar-senha`, passwordData);
      
      setIsLoading(false);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao alterar senha";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loading,
        error,
        login,
        register,
        registerEstablishment,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}