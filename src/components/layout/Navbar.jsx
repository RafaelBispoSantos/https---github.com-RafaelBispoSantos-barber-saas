import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  AlignRight, 
  Calendar, 
  ChevronDown,
  LogOut, 
  Menu, 
  User, 
  X,
  Scissors,
  Clock
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Serviços", path: "/services" },
    { name: "Equipe", path: "/barbers" },
    { name: "Agendamento", path: "/booking" },
    { name: "Contato", path: "/contact" },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="BarberCut Pro" className="h-8 w-auto" />
          <span className="font-heading font-bold text-xl">BarberCut</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1 group">
                <span className="text-sm font-medium">{user.nome}</span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg overflow-hidden z-20 opacity-0 scale-95 transition-all duration-100 origin-top-right invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible">
                <div className="py-1">
                  {user.tipo === 'proprietario' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                    >
                      <Scissors className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  {user.tipo === 'barbeiro' && (
                    <Link
                      to="/barber/schedule"
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Minha Agenda
                    </Link>
                  )}
                  {user.tipo === 'cliente' && (
                    <Link
                      to="/appointments"
                      className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Meus Agendamentos
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm hover:bg-muted text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild variant="barbershop">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 bottom-0 bg-background z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <nav className="flex flex-col space-y-4 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-lg font-medium py-2 border-b border-border"
                onClick={toggleMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Alternar tema</span>
              <ThemeToggle />
            </div>
            
            {user ? (
              <div className="space-y-2">
                {user.tipo === 'proprietario' && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/dashboard" onClick={toggleMenu}>
                      <Scissors className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}
                {user.tipo === 'barbeiro' && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/barber/schedule" onClick={toggleMenu}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Minha Agenda
                    </Link>
                  </Button>
                )}
                {user.tipo === 'cliente' && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link to="/appointments" onClick={toggleMenu}>
                      <Clock className="mr-2 h-4 w-4" />
                      Meus Agendamentos
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link to="/profile" onClick={toggleMenu}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" onClick={toggleMenu}>
                    Entrar
                  </Link>
                </Button>
                <Button asChild variant="barbershop" className="w-full">
                  <Link to="/register" onClick={toggleMenu}>
                    Cadastrar
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}