import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  Grid, 
  LogOut, 
  Menu, 
  Scissors, 
  Settings, 
  ShoppingBag, 
  Users, 
  BarChart,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Grid className="h-5 w-5" /> },
    { name: "Agendamentos", path: "/dashboard/appointments", icon: <Calendar className="h-5 w-5" /> },
    { name: "Barbeiros", path: "/dashboard/barbers", icon: <Scissors className="h-5 w-5" /> },
    { name: "Clientes", path: "/dashboard/customers", icon: <Users className="h-5 w-5" /> },
    { name: "Serviços", path: "/dashboard/services", icon: <ShoppingBag className="h-5 w-5" /> },
    { name: "Assinatura", path: "/dashboard/subscription", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Relatórios", path: "/dashboard/reports", icon: <BarChart className="h-5 w-5" /> },
    { name: "Configurações", path: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col border-r transition-all duration-300 bg-card`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <Link to="/" className={`flex items-center space-x-2 ${!sidebarOpen && "justify-center"}`}>
            <img src={Logo} alt="BarberCut Pro" className="h-8 w-auto" />
            {sidebarOpen && <span className="font-heading font-bold text-lg">BarberCut</span>}
          </Link>
          <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-muted">
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${!sidebarOpen && "justify-center"}`
              }
              end={item.path === "/dashboard"}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          {sidebarOpen && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tema</span>
              <ThemeToggle />
            </div>
          )}
          
          <Button
            variant="outline"
            size={sidebarOpen ? "default" : "icon"}
            className={`${sidebarOpen ? "w-full justify-start" : "mx-auto"} text-destructive hover:text-destructive hover:bg-destructive/10`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2 text-sm">Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-card transform transition-transform ease-in-out duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex justify-between items-center border-b">
            <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="BarberCut Pro" className="h-8 w-auto" />
              <span className="font-heading font-bold text-lg">BarberCut</span>
            </Link>
            <button onClick={toggleMobileMenu} className="p-1 rounded-full hover:bg-muted">
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
                end={item.path === "/dashboard"}
                onClick={toggleMobileMenu}
              >
                {item.icon}
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tema</span>
              <ThemeToggle />
            </div>
            
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2 text-sm">Sair</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <header className="p-4 border-b bg-background md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={toggleMobileMenu} className="p-1 rounded-md hover:bg-muted">
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="font-heading font-bold text-lg">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Help button */}
      <button className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
        <HelpCircle className="h-6 w-6" />
      </button>
    </div>
  );
}