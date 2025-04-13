jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  RefreshCcw,
  Search,
  Scissors,
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

// Constantes para os status de agendamento
const APPOINTMENT_STATUS = {
  COMPLETED: "concluido",
  CANCELED: "cancelado",
  CONFIRMED: "confirmado",
  SCHEDULED: "agendado",
};

// Componente para exibir o estado de Loading
const Loading = () => {
  return <p>Carregando agendamentos...</p>;
};

// Componente para exibir mensagem de erro
const ErrorMessage = ({ message }) => {
  return <p className="text-red-500">Erro: {message}</p>;
};
const EmptyMessage = () => {
  return <p>Nenhum agendamento foi encontrado</p>;
};

export default function Overview({ userType = "cliente" }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAppointments, updateAppointmentStatus, addReview } =
    useAppointments();

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
        description:
          location.state.message || "Seu agendamento foi criado com sucesso.",
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
      setError(null);
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
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
        setError("Erro ao carregar agendamentos. Tente novamente.");
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
      filtered = filtered.filter(
        (appointment) =>
          appointment.barbeiro.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.servicos.some((servico) =>
            servico.nome.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (appointment) => appointment.status === statusFilter
      );
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  return (
    <>
      <Navbar />
      <main className="p-4">
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Pesquisar por barbeiro ou serviço"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => handleStatusFilterChange("")}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusFilterChange(APPOINTMENT_STATUS.SCHEDULED)
                }
              >
                Agendado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusFilterChange(APPOINTMENT_STATUS.CONFIRMED)
                }
              >
                Confirmado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusFilterChange(APPOINTMENT_STATUS.COMPLETED)
                }
              >
                Concluído
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleStatusFilterChange(APPOINTMENT_STATUS.CANCELED)
                }
              >
                Cancelado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && filteredAppointments.length === 0 && <EmptyMessage />}
        {!isLoading &&
          filteredAppointments.length > 0 &&
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onUpdateStatus={updateAppointmentStatus}
              onAddReview={addReview}
            />
          ))}
      </main>
      <Footer />
    </>
  );
}
