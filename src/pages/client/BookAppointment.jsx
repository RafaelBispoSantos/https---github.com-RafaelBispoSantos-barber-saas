import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  Check, 
  ChevronRight, 
  Clock, 
  Scissors 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { useServices } from "@/hooks/useServices";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Verificar se está autenticado
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  // Simulação de carregamento de estabelecimento
  useEffect(() => {
    const loadEstabelecimento = async () => {
      setIsLoading(true);
      try {
        // Em um ambiente real, você obteria o estabelecimentoId do contexto ou da URL
        const estabelecimentoId = user?.estabelecimento || "mock-estabelecimento-id";
        
        // Simulação de dados de estabelecimento
        const mockEstabelecimento = {
          _id: estabelecimentoId,
          nome: "Barbearia Moderna",
          urlPersonalizada: "barbearia-moderna",
          endereco: {
            rua: "Av. Paulista",
            numero: "1000",
            bairro: "Bela Vista",
            cidade: "São Paulo",
            estado: "SP"
          },
          contato: {
            telefone: "(11) 3456-7890",
            email: "contato@barbearia-moderna.com"
          },
          horarioFuncionamento: {
            diasDisponiveis: [1, 2, 3, 4, 5, 6]
          }
        };
        
        setTimeout(() => {
          setEstabelecimento(mockEstabelecimento);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao carregar estabelecimento:", error);
        setIsLoading(false);
      }
    };
    
    loadEstabelecimento();
  }, [user]);

  // Renderizar na tela de carregamento
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Passos do agendamento
  const steps = [
    { number: 1, title: "Escolha os serviços" },
    { number: 2, title: "Escolha o barbeiro" },
    { number: 3, title: "Escolha a data e horário" },
    { number: 4, title: "Confirme o agendamento" }
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-6">Agendar Serviço</h1>
          
          {/* Passos */}
          <div className="mb-8">
            <div className="hidden md:flex justify-between">
              {steps.map((s) => (
                <div 
                  key={s.number} 
                  className={`flex items-center ${s.number !== steps.length ? 'flex-1' : ''}`}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full 
                    ${step >= s.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    {step > s.number ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{s.number}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.title}
                  </span>
                  
                  {s.number !== steps.length && (
                    <div className="flex-1 mx-4">
                      <Separator 
                        className={step > s.number ? "bg-primary" : "bg-border"} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Versão móvel dos passos */}
            <div className="md:hidden">
              <div className="flex items-center justify-center mb-2">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  bg-primary text-primary-foreground
                `}>
                  <span>{step}</span>
                </div>
                <span className="ml-2 font-medium">
                  {steps.find(s => s.number === step)?.title}
                </span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full" 
                  style={{ width: `${(step / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="appointment" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="appointment">Agendamento</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointment">
              <Card>
                <CardHeader>
                  <CardTitle>Agende seu horário</CardTitle>
                  <CardDescription>
                    Escolha os serviços, profissional, data e horário para seu agendamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AppointmentForm estabelecimentoId={estabelecimento?._id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>{estabelecimento?.nome}</CardTitle>
                  <CardDescription>
                    Informações sobre nosso estabelecimento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Endereço</h3>
                    <p className="text-sm text-muted-foreground">
                      {estabelecimento?.endereco?.rua}, {estabelecimento?.endereco?.numero} - {estabelecimento?.endereco?.bairro}<br />
                      {estabelecimento?.endereco?.cidade}, {estabelecimento?.endereco?.estado}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Contato</h3>
                    <p className="text-sm text-muted-foreground">
                      Telefone: {estabelecimento?.contato?.telefone}<br />
                      Email: {estabelecimento?.contato?.email}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Horário de Funcionamento</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Segunda a Sexta</p>
                        <p className="text-muted-foreground">9:00 - 19:00</p>
                      </div>
                      <div>
                        <p className="font-medium">Sábado</p>
                        <p className="text-muted-foreground">9:00 - 17:00</p>
                      </div>
                      <div>
                        <p className="font-medium">Domingo</p>
                        <p className="text-muted-foreground">Fechado</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Política de Cancelamento</h3>
                    <p className="text-sm text-muted-foreground">
                      Cancelamentos devem ser feitos com no mínimo 24 horas de antecedência.
                      Cancelamentos fora deste prazo poderão estar sujeitos a cobrança.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}