import AppRouter from "./router/AppRouter";
import { ToastProvider } from "./components/ui/use-toast"; 
export default function App() {
  return (
    <>
      <AppRouter />
      <ToastProvider />
    </>
  );
}