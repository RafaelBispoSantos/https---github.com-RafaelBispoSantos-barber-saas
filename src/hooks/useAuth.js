import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

// Esta função pode ser usada para criar um novo AuthProvider personalizado
export function createAuthProvider() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [establishment, setEstablishment] = useState(null);

  // Inicializa o estado de autenticação a partir do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("barbercut_user");
    const storedToken = localStorage.getItem("barbercut_token");
    const storedEstablishment = localStorage.getItem("barbercut_establishment");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      
      if (storedEstablishment) {
        setEstablishment(JSON.parse(storedEstablishment));
      }
    }

    setLoading(false);
  }, []);

  // Login com email e senha
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/auth/login", credentials);
      
      const { token, user } = response.data;
      
      localStorage.setItem("barbercut_token", token);
      localStorage.setItem("barbercut_user", JSON.stringify(user));
      
      // Se o usuário for proprietário, buscar informações do estabelecimento
      if (user.tipo === 'proprietario' && user.estabelecimento) {
        try {
          const estResponse = await api.get(`/api/estabelecimentos/${user.estabelecimento}`);
          localStorage.setItem("barbercut_establishment", JSON.stringify(estResponse.data.data));
          setEstablishment(estResponse.data.data);
        } catch (estError) {
          console.error("Erro ao buscar estabelecimento:", estError);
        }
      }
      
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

  // Registro de usuário (cliente ou barbeiro)
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

  // Registro de estabelecimento (cria o estabelecimento e seu proprietário)
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
      setEstablishment(estabelecimento);
      setIsLoading(false);
      
      return { success: true, user, establishment: estabelecimento };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao registrar estabelecimento";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Verificar se o token é válido
  const verifyToken = async () => {
    if (!token) return false;
    
    try {
      const response = await api.get("/api/auth/verify-token");
      return response.data.user ? true : false;
    } catch (err) {
      logout();
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("barbercut_token");
    localStorage.removeItem("barbercut_user");
    localStorage.removeItem("barbercut_establishment");
    
    delete api.defaults.headers.common["Authorization"];
    
    setUser(null);
    setToken(null);
    setEstablishment(null);
  };

  // Atualizar perfil do usuário
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

  // Alterar senha
  const changePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await api.patch("/api/usuarios/alterar-senha", passwordData);
      
      setIsLoading(false);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao alterar senha";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Obter estabelecimento por URL
  const getEstablishmentByUrl = async (url) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/estabelecimentos`, {
        params: { url }
      });
      
      setIsLoading(false);
      
      return { success: true, establishment: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar estabelecimento";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Criar barbeiro (apenas para proprietários)
  const createBarber = async (barberData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/usuarios/barbeiros", {
        ...barberData,
        estabelecimentoId: user.estabelecimento
      });
      
      setIsLoading(false);
      
      return { success: true, barber: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao criar barbeiro";
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    token,
    establishment,
    isLoading,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    registerEstablishment,
    logout,
    updateProfile,
    changePassword,
    verifyToken,
    getEstablishmentByUrl,
    createBarber
  };
}