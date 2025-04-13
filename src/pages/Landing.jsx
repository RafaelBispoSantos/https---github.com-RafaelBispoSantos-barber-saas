import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Scissors, 
  Star,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/common/ServiceCard";
import BarberCard from "@/components/common/BarberCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Mock data - seria substituído por dados da API
const featuredServices = [
  {
    _id: "1",
    nome: "Corte Moderno",
    descricao: "Corte personalizado incluindo lavagem e finalização",
    preco: 60.00,
    duracao: 45,
    imagem: "/services/haircut-modern.jpg"
  },
  {
    _id: "2",
    nome: "Barba Completa",
    descricao: "Modelagem de barba com toalha quente e produtos especiais",
    preco: 45.00,
    duracao: 30,
    imagem: "/services/beard-trim.jpg"
  },
  {
    _id: "3",
    nome: "Combo Corte + Barba",
    descricao: "Pacote completo para quem busca rejuvenescimento total",
    preco: 95.00,
    duracao: 75,
    promocao: {
      ativa: true,
      precoPromocional: 85.00
    },
    imagem: "/services/combo.jpg"
  },
  {
    _id: "4",
    nome: "Hidratação Capilar",
    descricao: "Tratamento intensivo para recuperar cabelos danificados",
    preco: 70.00,
    duracao: 45,
    imagem: "/services/hydration.jpg"
  }
];

const featuredBarbers = [
  {
    _id: "1",
    nome: "Ricardo Silva",
    especialidades: ["Cortes Modernos", "Barba"],
    fotoPerfil: "/barbers/barber-1.jpg"
  },
  {
    _id: "2",
    nome: "Carlos Mendes",
    especialidades: ["Degradê", "Barba Tradicional"],
    fotoPerfil: "/barbers/barber-2.jpg"
  },
  {
    _id: "3",
    nome: "André Costa",
    especialidades: ["Cabelos Cacheados", "Tratamentos"],
    fotoPerfil: "/barbers/barber-3.jpg"
  }
];

const testimonials = [
  {
    id: "1",
    name: "Marcos Oliveira",
    image: "/testimonials/client-1.jpg",
    text: "Atendimento excepcional e resultado impecável! O ambiente é super agradável e os profissionais são extremamente habilidosos.",
    rating: 5
  },
  {
    id: "2",
    name: "Lucas Ferreira",
    image: "/testimonials/client-2.jpg",
    text: "Minha barba nunca ficou tão bem feita. Os produtos utilizados são de primeira qualidade e o atendimento é personalizado.",
    rating: 5
  },
  {
    id: "3",
    name: "Pedro Santos",
    image: "/testimonials/client-3.jpg",
    text: "O sistema de agendamento online é prático e rápido. Sempre consigo encontrar horários que se encaixam na minha agenda.",
    rating: 4
  }
];

export default function Landing() {
  const servicesRef = useRef(null);
  
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] bg-hero-pattern bg-cover bg-center flex items-center">
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 py-12 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-white font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Estilo e Precisão em Cada Corte
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8">
                Uma experiência única de barbearia, onde tradição e modernidade se encontram para criar
                seu estilo perfeito. Agende seu horário agora e transforme seu visual.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="barbershop" 
                  size="lg"
                  asChild
                  className="text-base"
                >
                  <Link to="/booking">
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendar Horário
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={scrollToServices}
                  className="text-white border-white hover:bg-white/10 text-base"
                >
                  Nossos Serviços
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Por que escolher a BarberCut?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Oferecemos uma experiência completa de barbearia, com profissionais qualificados,
                ambiente agradável e o melhor atendimento.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="p-3 bg-primary/10 w-fit rounded-full mb-4">
                  <Scissors className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Profissionais Qualificados</h3>
                <p className="text-muted-foreground">
                  Nossa equipe é formada por barbeiros experientes e constantemente atualizados com as últimas tendências.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="p-3 bg-primary/10 w-fit rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Agendamento Fácil</h3>
                <p className="text-muted-foreground">
                  Sistema online prático para marcar horários, evitando longas esperas e respeitando seu tempo.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="p-3 bg-primary/10 w-fit rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">Produtos Premium</h3>
                <p className="text-muted-foreground">
                  Utilizamos apenas produtos de alta qualidade, garantindo o melhor resultado no seu visual.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16" ref={servicesRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Nossos Serviços
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Conheça os serviços que oferecemos e escolha o que melhor se adapta ao seu estilo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  featured={service._id === "3"}
                  onClick={() => {}}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="barbershopOutline">
                <Link to="/services">
                  Ver Todos os Serviços
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Conheça Nossa Equipe
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Barbeiros experientes prontos para transformar seu visual com profissionalismo e criatividade.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBarbers.map((barber) => (
                <BarberCard
                  key={barber._id}
                  barber={barber}
                  onClick={() => {}}
                />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="barbershopOutline">
                <Link to="/barbers">
                  Conhecer Todos os Barbeiros
                  <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A satisfação dos nossos clientes é a nossa maior conquista.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-card p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-muted">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= testimonial.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Pronto para Transformar seu Visual?
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
              Agende seu horário agora mesmo e experimente o melhor serviço de barbearia da cidade.
            </p>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="bg-white text-primary hover:bg-white/90 border-white"
            >
              <Link to="/booking">
                <Calendar className="mr-2 h-5 w-5" />
                Agendar Horário
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Contact/Locations Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Onde nos Encontrar
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Estamos estrategicamente localizados para melhor atendê-lo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="font-heading text-xl font-bold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  Unidade Centro
                </h3>
                <p className="text-muted-foreground mb-4">
                  Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Segunda a Sexta: 9h às 20h</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Sábado: 9h às 18h</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Domingo: Fechado</span>
                  </div>
                </div>
                <div className="mt-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951630787!2d-46.6558099843802!3d-23.56506236785582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1649876543210!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa da Unidade Centro"
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
              
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="font-heading text-xl font-bold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  Unidade Zona Sul
                </h3>
                <p className="text-muted-foreground mb-4">
                  Rua Oscar Freire, 500 - Jardins, São Paulo - SP, 01426-000
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Segunda a Sexta: 10h às 21h</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Sábado: 10h às 20h</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Domingo: 12h às 18h</span>
                  </div>
                </div>
                <div className="mt-6">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.3461962779916!2d-46.671798384380434!3d-23.556894867855793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59d2b063a3a7%3A0xb7b99d736376684c!2sR.%20Oscar%20Freire%2C%20500%20-%20Jardim%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001426-000!5e0!3m2!1spt-BR!2sbr!4v1649876594210!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa da Unidade Zona Sul"
                    className="rounded-md"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}