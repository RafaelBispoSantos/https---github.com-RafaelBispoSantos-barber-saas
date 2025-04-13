import { useState } from "react";
import api from "@/lib/api";

export function useAppointments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar barbeiros de um estabelecimento
  const getBarbers = async (estabelecimentoId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/api/usuarios/por-estabelecimento", {
        params: {
          estabelecimentoId,
          tipo: "barbeiro"
        }
      });
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar barbeiros";
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  };

  // Buscar serviços de um estabelecimento
  const getServices = async (estabelecimentoId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/api/servicos", {
        params: {
          estabelecimentoId
        }
      });
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar serviços";
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  };

  // Buscar horários disponíveis para um barbeiro em uma data específica
  const getAvailableTimes = async (barbeiroId, data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/api/barbeiros/horarios-disponiveis", {
        params: {
          barbeiroId,
          data
        }
      });
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar horários disponíveis";
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  };

  // Criar um novo agendamento
  const createAppointment = async (appointmentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/agendamentos", appointmentData);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao criar agendamento";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Buscar agendamentos (com filtros opcionais)
  const getAppointments = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/api/agendamentos", {
        params: filters
      });
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar agendamentos";
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  };

  // Buscar detalhes de um agendamento específico
  const getAppointment = async (appointmentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/agendamentos/${appointmentId}`);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar agendamento";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  // Atualizar status de um agendamento
  const updateAppointmentStatus = async (appointmentId, status) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/api/agendamentos/${appointmentId}/status`, {
        status
      });
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar status do agendamento";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Adicionar avaliação a um agendamento
  const addReview = async (appointmentId, reviewData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/api/agendamentos/${appointmentId}/avaliacao`, reviewData);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao adicionar avaliação";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    isLoading,
    error,
    getBarbers,
    getServices,
    getAvailableTimes,
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointmentStatus,
    addReview
  };
}