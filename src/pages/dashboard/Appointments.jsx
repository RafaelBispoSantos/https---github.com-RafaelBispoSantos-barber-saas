import { useState, useEffect } from "react";
import { 
  Calendar,
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Search,
  CalendarDays
} from "lucide-react";
import { format, addDays, subDays, parseISO, isEqual } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import AppointmentCard from "@/components/common/AppointmentCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState("day"); // "day", "week", "month"
  const [selectedBarber, setSelectedBarber] = useState("");
  const [barbers, setBarbers] = useState([]);

  const { user } = useAuth();
  const { 
    getAppointments, 
    updateAppointmentStatus, 
    getBarbers,
    isLoading 
  } = useAppointments();

  // Carregar barbeiros
  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const data = await getBarbers(user.estabelecimento);
        setBarbers(data);
      } catch (error) {
        console.error("Erro ao carregar barbeiros:", error);
        
        // Dados fictícios para desenvolvimento
        setBarbers([
          { _id: "1", nome: "Ricardo Silva" },
          { _id: "2", nome: "Carlos Mendes" },
          { _id: "3", nome: "André Costa" }
        ]);
      }
    };
    
    loadBarbers();
  }, [user.estabelecimento, getBarbers]);

  // Carregar agendamentos
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const params = {
          estabelecimentoId: user.estabelecimento,
        };
        
        // Se estiver em visualização por dia, adicionar filtro de data
        if (viewType === "day") {
          params.data = format(selectedDate, "yyyy-MM-dd");
        }
        
        // Filtrar por barbeiro se selecionado
        if (selectedBarber) {
          params.barbeiro = selectedBarber;
        }
        
        const data = await getAppointments(params);
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        
        // Dados fictícios para desenvolvimento
        const mockAppointments = Array.from({ length: 10 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + (Math.floor(Math.random() * 7) - 3)); // Entre -3 e +3 dias
          
          return {
            _id: `mock-${i}`,
            cliente: {
              _id: `client-${i}`,
              nome: `Cliente ${i + 1}`,
              telefone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
              fotoPerfil: ""
            },
            barbeiro: {
              _id: `barber-${i % 3 + 1}`,
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
            data: date.toISOString(),
            horario: `${10 + Math.floor(Math.random() * 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
            precoTotal: [60, 45, 70, 80, 95][i % 5],
            duracao: [45, 30, 45, 60, 75][i % 5],
            status: ["agendado", "confirmado", "concluido", "cancelado"][i % 4]
          };
        });
        
        setAppointments(mockAppointments);
        setFilteredAppointments(mockAppointments);
      }
    };
    
    loadAppointments();
  }, [user.estabelecimento, selectedDate, viewType, selectedBarber, getAppointments]);

  // Filtrar agendamentos por pesquisa e status
  useEffect(() => {
    let filtered = appointments;
    
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.barbeiro.nome.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handlePrevDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handlePrevWeek = () => {
    setSelectedDate(prevDate => subDays(prevDate, 7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prevDate => addDays(prevDate, 7));
  };

  const handleViewDetails = (appointmentId) => {
    // Implementar visualização de detalhes
    console.log("Ver detalhes do agendamento:", appointmentId);
  };

  const handleCancel = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "cancelado");
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "cancelado" } : app
      ));
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      // Para desenvolvimento, apenas atualiza o estado
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "cancelado" } : app
      ));
    }
  };

  const handleConfirm = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "confirmado");
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "confirmado" } : app
      ));
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      // Para desenvolvimento, apenas atualiza o estado
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "confirmado" } : app
      ));
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "concluido");
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "concluido" } : app
      ));
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      // Para desenvolvimento, apenas atualiza o estado
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, status: "concluido" } : app
      ));
    }
  };

  // Filtra agendamentos do dia selecionado
  const filteredByDate = filteredAppointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.data);
    return isEqual(
      new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate()),
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold">Agendamentos</h1>
        
        <div className="flex items-center space-x-2">
          <Button asChild>
            <a href="/dashboard/appointments/new">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </a>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarDays className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewType("day")}>
                Ver por dia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType("week")}>
                Ver por semana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewType("month")}>
                Ver por mês
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs de visualização */}
      <Tabs defaultValue="day" value={viewType} onValueChange={setViewType}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="day">Dia</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {viewType === "day" && (
              <>
                <Button variant="outline" size="icon" onClick={handlePrevDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 font-medium">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</div>
                <Button variant="outline" size="icon" onClick={handleNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {viewType === "week" && (
              <>
                <Button variant="outline" size="icon" onClick={handlePrevWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 font-medium">Semana de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</div>
                <Button variant="outline" size="icon" onClick={handleNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {viewType === "month" && (
              <div className="px-2 font-medium">{format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}</div>
            )}
          </div>
        </div>

        {/* Filtros e pesquisa */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou barbeiro..."
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
                <ChevronDown className="h-4 w-4" />
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {selectedBarber ? 
                  barbers.find(b => b._id === selectedBarber)?.nome || "Todos os barbeiros" 
                  : "Todos os barbeiros"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                className={!selectedBarber ? "bg-muted" : ""} 
                onClick={() => setSelectedBarber("")}
              >
                <span>Todos os barbeiros</span>
              </DropdownMenuItem>
              {barbers.map((barber) => (
                <DropdownMenuItem 
                  key={barber._id}
                  className={selectedBarber === barber._id ? "bg-muted" : ""}
                  onClick={() => setSelectedBarber(barber._id)}
                >
                  <span>{barber.nome}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="day" className="mt-0">
          <div className="space-y-4">
            {filteredByDate.length > 0 ? (
              filteredByDate.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  userType="proprietario"
                  onViewDetails={() => handleViewDetails(appointment._id)}
                  onCancel={() => handleCancel(appointment._id)}
                  onConfirm={() => handleConfirm(appointment._id)}
                  onComplete={() => handleComplete(appointment._id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum agendamento</h3>
                <p className="text-muted-foreground mb-4">
                  Não há agendamentos para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Agendamento
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <div className="space-y-4">
            <RecentAppointments
              appointments={filteredAppointments}
              onViewDetails={handleViewDetails}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
              onComplete={handleComplete}
            />
          </div>
        </TabsContent>

        <TabsContent value="month" className="mt-0">
          <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Vista mensal</h3>
            <p className="text-muted-foreground">
              A visualização de calendário por mês está disponível na versão premium.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}