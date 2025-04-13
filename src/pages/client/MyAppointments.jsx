import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Filter, 
  Plus, 
  RefreshCcw, 
  Search, 
  Scissors 
} from "lucide-react";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppointmentCard from "@/components/common/AppointmentCard";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";

export default function MyAppointments({ userType = "cliente" }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const { getAppointments, updateAppointmentStatus, addReview } = useAppointments();

  // Verificar autenticação
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location]);

  // Exibir toast de sucesso se vier da página de agendamento
  useEffect(() => {
    if (location.state?.success) {
      toast({
        title: "Agendamento realizado!",
        description: location.state.message || "Seu agendamento foi criado com sucesso.",
      });
      
      // Limpar state para não mostrar o toast novamente em recargas
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  // Carregar agendamentos
  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const params = {
          estabelecimentoId: user.estabelecimento,
        };
        
        // Se for barbeiro, filtrar por barbeiro, se for cliente, filtrar por cliente
        if (userType === "barbeiro") {
          params.barbeiro = user.id;
        } else {
          params.cliente = user.id;
        }
        
        const data = await getAppointments(params);
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        
        // Dados fictícios para desenvolvimento
        const mockAppointments = Array.from({ length: 8 }, (_, i) => {
          const today = new Date();
          const date = new Date();
          
          // Alguns agendamentos no passado, alguns no futuro
          if (i < 4) {
            date.setDate(today.getDate() - Math.floor(Math.random() * 10) - 1); // Passado (1-10 dias atrás)
          } else {
            date.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1); // Futuro (1-10 dias à frente)
          }
          
          return {
            _id: `mock-${i}`,
            cliente: {
              _id: user.id,
              nome: user.nome,
              telefone: user.telefone,
              fotoPerfil: user.fotoPerfil || ""
            },
            barbeiro: {
              _id: `barber-${i % 3}`,
              nome: [`Ricardo Silva`, `Carlos Mendes`, `André Costa`][i % 3],
              fotoPerfil: ""
            },
            servicos: [
              {
                _id: `service-${i % 5}`,
                nome: ["Corte Moderno", "Barba Completa", "Hidratação", "Tingimento", "Combo"][i % 5],
                preco: [60, 45, 70, 80, 95][i % 5]
              }
            ],
            estabelecimento: user.estabelecimento,
            data: date.toISOString(),
            horario: `${10 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
            precoTotal: [60, 45, 70, 80, 95][i % 5],
            duracao: [45, 30, 45, 60, 75][i % 5],
            status: i < 2 
              ? "concluido" 
              : (i < 4 
                ? "cancelado" 
                : (i < 6 
                  ? "confirmado" 
                  : "agendado"))
          };
        });
        
        setAppointments(mockAppointments);
        setFilteredAppointments(mockAppointments);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAppointments();
  }, [user, userType, getAppointments]);

  // Filtrar agendamentos por termo de pesquisa e status
  useEffect(() => {
    let filtered = appointments;
    
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.barbeiro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.servicos.some(servico => 
          servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status === statusFilter ? "" : status);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      // Adicionar confirmação
      if (!window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
        return;
      }
      
      await updateAppointmentStatus(appointmentId, "cancelado");
      
      // Atualizar lista local
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "cancelado" } : app
      ));
      
      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao cancelar",
        description: error.message || "Não foi possível cancelar o agendamento.",
      });
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "confirmado");
      
      // Atualizar lista local
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "confirmado" } : app
      ));
      
      toast({
        title: "Agendamento confirmado",
        description: "O agendamento foi confirmado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao confirmar",
        description: error.message || "Não foi possível confirmar o agendamento.",
      });
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "concluido");
      
      // Atualizar lista local
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "concluido" } : app
      ));
      
      toast({
        title: "Agendamento concluído",
        description: "O agendamento foi marcado como concluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao concluir",
        description: error.message || "Não foi possível concluir o agendamento.",
      });
    }
  };

  // Filtrar agendamentos por "próximos" e "anteriores"
  const upcomingAppointments = filteredAppointments.filter(appointment => 
    !isPast(new Date(appointment.data)) && 
    appointment.status !== "cancelado"
  );
  
  const pastAppointments = filteredAppointments.filter(appointment => 
    isPast(new Date(appointment.data)) || 
    appointment.status === "cancelado"
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-heading font-bold">
              {userType === "barbeiro" ? "Minha Agenda" : "Meus Agendamentos"}
            </h1>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter("")}
                className="gap-1"
              >
                <RefreshCcw className="h-4 w-4" />
                Limpar Filtros
              </Button>
              
              <Button 
                variant="barbershop"
                size="sm"
                asChild
                className="gap-1"
              >
                <a href="/booking">
                  <Plus className="h-4 w-4" />
                  Novo Agendamento
                </a>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por barbeiro ou serviço..."
                className="pl-9"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter ? 
                    (statusFilter === "agendado" ? "Agendado" : 
                     statusFilter === "confirmado" ? "Confirmado" : 
                     statusFilter === "concluido" ? "Concluído" : 
                     "Cancelado") 
                    : "Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  className={!statusFilter ? "bg-muted" : ""} 
                  onClick={() => setStatusFilter("")}
                >
                  <span>Todos os status</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "agendado" ? "bg-muted" : ""}
                  onClick={() => handleStatusFilter("agendado")}
                >
                  <span>Agendado</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "confirmado" ? "bg-muted" : ""}
                  onClick={() => handleStatusFilter("confirmado")}
                >
                  <span>Confirmado</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "concluido" ? "bg-muted" : ""}
                  onClick={() => handleStatusFilter("concluido")}
                >
                  <span>Concluído</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "cancelado" ? "bg-muted" : ""}
                  onClick={() => handleStatusFilter("cancelado")}
                >
                  <span>Cancelado</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Próximos
                  {upcomingAppointments.length > 0 && (
                    <span className="ml-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
                      {upcomingAppointments.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Anteriores
                  {pastAppointments.length > 0 && (
                    <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-xs">
                      {pastAppointments.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-6">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      userType={userType}
                      onCancel={() => handleCancelAppointment(appointment._id)}
                      onConfirm={userType === "barbeiro" ? () => handleConfirmAppointment(appointment._id) : undefined}
                      onComplete={userType === "barbeiro" ? () => handleCompleteAppointment(appointment._id) : undefined}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum agendamento próximo</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm || statusFilter 
                        ? "Nenhum agendamento encontrado com os filtros atuais." 
                        : "Você não tem agendamentos futuros."}
                    </p>
                    {!searchTerm && !statusFilter && (
                      <Button asChild variant="barbershop">
                        <a href="/booking">
                          <Plus className="h-4 w-4 mr-2" />
                          Agendar horário
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-6">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      userType={userType}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhum agendamento anterior</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter 
                        ? "Nenhum agendamento encontrado com os filtros atuais." 
                        : "Você não tem histórico de agendamentos."}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}