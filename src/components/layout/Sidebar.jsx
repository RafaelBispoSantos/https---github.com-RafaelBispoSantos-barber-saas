import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  Grid, 
  LogOut, 
  Scissors, 
  Settings, 
  ShoppingBag, 
  Users, 
  BarChart,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/assets/images/logo.svg";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Sidebar({ open = true, onToggle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } hidden md:flex flex-col border-r transition-all duration-300 bg-card h-screen fixed top-0 left-0`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <Link to="/" className={`flex items-center space-x-2 ${!open && "justify-center"}`}>
          <img src={Logo} alt="BarberCut Pro" className="h-8 w-auto" />
          {open && <span className="font-heading font-bold text-lg">BarberCut</span>}
        </Link>
        <button onClick={onToggle} className="p-1 rounded-full hover:bg-muted">
          {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
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
              } ${!open && "justify-center"}`
            }
            end={item.path === "/dashboard"}
          >
            {item.icon}
            {open && <span className="ml-3 text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-4">
        {open && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        )}
        
        <Button
          variant="outline"
          size={open ? "default" : "icon"}
          className={`${open ? "w-full justify-start" : "mx-auto"} text-destructive hover:text-destructive hover:bg-destructive/10`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {open && <span className="ml-2 text-sm">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}