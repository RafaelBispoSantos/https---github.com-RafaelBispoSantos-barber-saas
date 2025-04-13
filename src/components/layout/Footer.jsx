import { Link } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Scissors 
} from "lucide-react";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto pt-12 pb-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="BarberCut Pro" className="h-10 w-auto" />
              <span className="font-heading font-bold text-xl">BarberCut</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Oferecemos serviços de barbearia de alta qualidade em um ambiente moderno e confortável. 
              Venha experimentar a experiência BarberCut.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/barbers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Barbeiros
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Agendamento
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Nossos Serviços</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                <span>Corte de Cabelo</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                <span>Barba</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                <span>Tratamento Facial</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                <span>Tingimento</span>
              </li>
              <li className="text-sm text-muted-foreground flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                <span>Massagem Capilar</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">contato@barbercut.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} BarberCut Pro. Todos os direitos reservados.
          </p>
          <div className="flex mt-4 md:mt-0 space-x-4">
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}