import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "../context/AuthContext"; 
import { ThemeProvider } from "../components/ThemeProvider"; 
import { useAuth } from "../hooks/useAuth";

// Layouts
import DashboardLayout from "../components/layout/DashboardLayout";

// Páginas carregadas diretamente
import Landing from "../pages/Landing";
import Login from "../pages/auth/Login";
import NotFound from "../pages/NotFound";

// Carregamento lazy para páginas secundárias
const Register = lazy(() => import("@/pages/auth/Register"));
const RegisterEstablishment = lazy(() => import("@/pages/auth/RegisterEstablishment"));
const Dashboard = lazy(() => import("@/pages/dashboard/Overview"));
const Appointments = lazy(() => import("@/pages/dashboard/Appointments"));
const Barbers = lazy(() => import("@/pages/dashboard/Barbers"));
const Customers = lazy(() => import("@/pages/dashboard/Customers"));
const Services = lazy(() => import("@/pages/dashboard/Services"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const Subscription = lazy(() => import("@/pages/dashboard/Subscription"));
const Reports = lazy(() => import("@/pages/dashboard/Reports"));
const BookAppointment = lazy(() => import("@/pages/client/BookAppointment"));
const MyAppointments = lazy(() => import("@/pages/client/MyAppointments"));
const Profile = lazy(() => import("@/pages/client/Profile"));

// Componente para rotas que requerem autenticação
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para rotas que requerem autenticação com perfil específico
const RoleRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.tipo)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default function AppRoutes() {
  // Tela de carregamento com suspense
  const fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <Router>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <Suspense fallback={fallback}>
            <Routes>
              {/* Páginas Públicas */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-establishment" element={<RegisterEstablishment />} />
              
              {/* Área do Cliente */}
              <Route path="/booking" element={
                <PrivateRoute>
                  <BookAppointment />
                </PrivateRoute>
              } />
              <Route path="/appointments" element={
                <PrivateRoute>
                  <MyAppointments />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Dashboard - Proprietário/Admin */}
              <Route path="/dashboard" element={
                <RoleRoute allowedRoles={["proprietario", "admin"]}>
                  <DashboardLayout />
                </RoleRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="barbers" element={<Barbers />} />
                <Route path="customers" element={<Customers />} />
                <Route path="services" element={<Services />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Área do Barbeiro */}
              <Route path="/barber/schedule" element={
                <RoleRoute allowedRoles={["barbeiro"]}>
                  <MyAppointments userType="barbeiro" />
                </RoleRoute>
              } />
              
              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}