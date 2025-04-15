import React from "react";
import AppRouter from "./router/AppRouter";
import { ToastProvider } from "./components/ui/use-toast";

export default function App() {
  return (
    <React.StrictMode>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </React.StrictMode>
  );
}