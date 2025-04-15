import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// Criação explícita do contexto com um valor padrão
const ToastContext = createContext({
  addToast: () => {},
  removeToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

// Tipos de toast
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Configurações de aparência baseadas no tipo
const toastConfig = {
  [TOAST_TYPES.SUCCESS]: {
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
  },
  [TOAST_TYPES.ERROR]: {
    icon: AlertCircle,
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
  },
  [TOAST_TYPES.WARNING]: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500',
  },
  [TOAST_TYPES.INFO]: {
    icon: Info,
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
};

// Componente de Toast individual
const Toast = ({ id, type = TOAST_TYPES.INFO, title, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Configurações baseadas no tipo
  const config = toastConfig[type] || toastConfig[TOAST_TYPES.INFO];
  const Icon = config.icon;

  // Efeito de entrada suave
  React.useEffect(() => {
    // Pequeno delay para permitir a animação
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Lidar com fechamento
  const handleClose = () => {
    setIsVisible(false);
    
    // Dar tempo para a animação de saída acontecer
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`
        flex items-start p-4 mb-2 rounded-lg border-l-4 shadow-md 
        transition-all duration-300 transform 
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${config.bgColor} ${config.borderColor} ${config.textColor}
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 mr-3 ${config.iconColor}`}>
        <Icon size={20} />
      </div>

      <div className="flex-1">
        {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>

      <button
        onClick={handleClose}
        className={`ml-3 hover:bg-opacity-20 p-1 rounded-full hover:bg-gray-500 ${config.textColor}`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Provider que envolve a aplicação
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Adicionar um novo toast
  const addToast = useCallback(({ type, title, message, duration = 5000 }) => {
    const id = Date.now().toString();
    
    // Criar o novo toast
    const newToast = {
      id,
      type,
      title,
      message,
      duration
    };
    
    // Adicionar ao array de toasts
    setToasts(prevToasts => [...prevToasts, newToast]);
    
    // Configurar a remoção automática após a duração
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  // Remover um toast pelo ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Métodos de conveniência para diferentes tipos de toast
  const success = useCallback((message, title = 'Sucesso', duration) => {
    return addToast({ type: TOAST_TYPES.SUCCESS, title, message, duration });
  }, [addToast]);

  const error = useCallback((message, title = 'Erro', duration) => {
    return addToast({ type: TOAST_TYPES.ERROR, title, message, duration });
  }, [addToast]);

  const warning = useCallback((message, title = 'Aviso', duration) => {
    return addToast({ type: TOAST_TYPES.WARNING, title, message, duration });
  }, [addToast]);

  const info = useCallback((message, title = 'Informação', duration) => {
    return addToast({ type: TOAST_TYPES.INFO, title, message, duration });
  }, [addToast]);

  // Valor do contexto
  const contextValue = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Container de toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
        <div className="pointer-events-auto">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

// Hook personalizado para usar o toast
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    console.error('useToast deve ser usado dentro de um ToastProvider');
    // Retornar implementação vazia para evitar quebrar a aplicação
    return {
      addToast: () => {},
      removeToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {}
    };
  }
  
  return context;
};