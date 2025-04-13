import { useState } from "react";
import api from "@/lib/api";

export function useServices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar serviços de um estabelecimento
  const getServices = async (estabelecimentoId, options = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = { estabelecimentoId, ...options };
      const response = await api.get("/api/servicos", { params });
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar serviços";
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  };

  // Buscar um serviço específico
  const getService = async (servicoId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/servicos/${servicoId}`);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao buscar serviço";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  // Criar um novo serviço
  const createService = async (serviceData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/servicos", serviceData);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao criar serviço";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Atualizar um serviço existente
  const updateService = async (servicoId, serviceData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.patch(`/api/servicos/${servicoId}`, serviceData);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar serviço";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Excluir um serviço
  const deleteService = async (servicoId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/servicos/${servicoId}`);
      
      setIsLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao excluir serviço";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Criar promoção para um serviço
  const createPromotion = async (servicoId, promotionData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post(`/api/servicos/${servicoId}/promocao`, promotionData);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao criar promoção";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Encerrar promoção de um serviço
  const endPromotion = async (servicoId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/servicos/${servicoId}/promocao`);
      
      setIsLoading(false);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erro ao encerrar promoção";
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  return {
    isLoading,
    error,
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    createPromotion,
    endPromotion
  };
}