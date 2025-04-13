// Adapted from https://ui.shadcn.com/docs/components/toast
// This is a simplified version for the demo

import { useState, useEffect, createContext, useContext } from "react";

const ToastContext = createContext({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, title, description, variant, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    
    return id;
  };

  const dismiss = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Render the toast UI
  useEffect(() => {
    if (toasts.length > 0) {
      const toastContainer = document.getElementById('toast-container');
      if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
      }
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      
      <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md p-4 shadow-md ${
              t.variant === "destructive" 
                ? "bg-destructive text-destructive-foreground" 
                : "bg-card border"
            }`}
            onClick={() => dismiss(t.id)}
          >
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};