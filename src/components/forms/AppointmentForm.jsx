import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar as CalendarIcon, Clock, Loader2, Scissors } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAppointments } from "@/hooks/useAppointments";
import { useAuth } from "@/hooks/useAuth";

// Zod Schema
const appointmentSchema = z.object({
  barbeiro: z.string({ required_error: "Selecione um barbeiro" }),
  servicos: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  data: z.date({ required_error: "Selecione uma data" }),
  horario: z.string({ required_error: "Selecione um horário" }),
  notasCliente: z.string().optional(),
});

export default function AppointmentForm({ estabelecimentoId }) {
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { getBarbers, getServices, getAvailableTimes, createAppointment, isLoading, error } = useAppointments();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      barbeiro: "",
      servicos: [],
      data: undefined,
      horario: "",
      notasCliente: "",
    },
  });

  const selectedDate = watch("data");
  const selectedBarber = watch("barbeiro");

  // Load barbers
  useEffect(() => {
    async function loadBarbers() {
      try {
        const data = await getBarbers(estabelecimentoId);
        setBarbers(data || []);
      } catch (error) {
        console.error("Error loading barbers:", error);
      }
    }
    loadBarbers();
  }, [estabelecimentoId, getBarbers]);

  // Load services
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices(estabelecimentoId);
        setServices(data || []);
      } catch (error) {
        console.error("Error loading services:", error);
      }
    }
    loadServices();
  }, [estabelecimentoId, getServices]);

  // Load available times when barber or date changes
  useEffect(() => {
    async function loadAvailableTimes() {
      if (selectedBarber && selectedDate) {
        try {
          const data = await getAvailableTimes(selectedBarber, format(selectedDate, "yyyy-MM-dd"));
          setAvailableTimes(data || []);
          // Reset time selection if previously selected time is no longer available
          setValue("horario", "");
        } catch (error) {
          console.error("Error loading available times:", error);
        }
      }
    }
    loadAvailableTimes();
  }, [selectedBarber, selectedDate, getAvailableTimes, setValue]);

  // Calculate total price and duration when services change
  useEffect(() => {
    if (selectedServices.length > 0 && services.length > 0) {
      const price = selectedServices.reduce((total, id) => {
        const service = services.find(s => s._id === id);
        return total + (service?.preco || 0);
      }, 0);
      
      const duration = selectedServices.reduce((total, id) => {
        const service = services.find(s => s._id === id);
        return total + (service?.duracao || 0);
      }, 0);
      
      setTotalPrice(price);
      setTotalDuration(duration);
    } else {
      setTotalPrice(0);
      setTotalDuration(0);
    }
  }, [selectedServices, services]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      const isSelected = prev.includes(serviceId);
      
      if (isSelected) {
        // Remove the service
        const updated = prev.filter((id) => id !== serviceId);
        setValue("servicos", updated);
        return updated;
      } else {
        // Add the service
        const updated = [...prev, serviceId];
        setValue("servicos", updated);
        return updated;
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      const appointmentData = {
        ...data,
        cliente: user.id,
        estabelecimentoId
      };
      
      const result = await createAppointment(appointmentData);
      
      if (result) {
        navigate("/appointments", { 
          state: { 
            success: true, 
            message: "Agendamento realizado com sucesso!" 
          } 
        });
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Barbeiros */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Escolha um Barbeiro</label>
        <Select 
          onValueChange={(value) => setValue("barbeiro", value)} 
          value={selectedBarber}
        >
          <SelectTrigger className={cn(errors.barbeiro && "border-destructive")}>
            <SelectValue placeholder="Selecione um barbeiro" />
          </SelectTrigger>
          <SelectContent>
            {barbers.map((barber) => (
              <SelectItem key={barber._id} value={barber._id}>
                {barber.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.barbeiro && (
          <p className="text-sm text-destructive">{errors.barbeiro.message}</p>
        )}
      </div>

      {/* Serviços */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Escolha os Serviços</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <div
              key={service._id}
              className={cn(
                "flex items-start p-3 rounded-md border cursor-pointer transition-all",
                selectedServices.includes(service._id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => handleServiceToggle(service._id)}
            >
              <div className="flex-1">
                <h4 className="font-medium">{service.nome}</h4>
                <p className="text-sm text-muted-foreground">{service.descricao}</p>
                <div className="flex items-center mt-2 text-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{service.duracao} min</span>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="font-medium">
                    R$ {service.preco.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              <div className="h-5 w-5 rounded-full border flex items-center justify-center">
                {selectedServices.includes(service._id) && (
                  <div className="h-3 w-3 rounded-full bg-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
        {errors.servicos && (
          <p className="text-sm text-destructive">{errors.servicos.message}</p>
        )}
      </div>

      {/* Data */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Escolha a Data</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                errors.data && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setValue("data", date)}
              locale={ptBR}
              disabled={(date) => 
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                date.getDay() === 0 // Domingo
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.data && (
          <p className="text-sm text-destructive">{errors.data.message}</p>
        )}
      </div>

      {/* Horário */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Escolha o Horário</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <Button
                key={time}
                type="button"
                variant={watch("horario") === time ? "default" : "outline"}
                className={cn(
                  "h-10",
                  watch("horario") === time && "bg-primary text-primary-foreground"
                )}
                onClick={() => setValue("horario", time)}
              >
                {time}
              </Button>
            ))
          ) : (
            <p className="col-span-full text-center text-sm text-muted-foreground py-2">
              {selectedBarber && selectedDate
                ? "Nenhum horário disponível. Tente outra data."
                : "Selecione um barbeiro e uma data primeiro."}
            </p>
          )}
        </div>
        {errors.horario && (
          <p className="text-sm text-destructive">{errors.horario.message}</p>
        )}
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Observações (opcional)</label>
        <Textarea
          placeholder="Alguma instrução especial para o barbeiro?"
          {...register("notasCliente")}
        />
      </div>

      {/* Resumo */}
      {selectedServices.length > 0 && (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2 flex items-center">
            <Scissors className="h-4 w-4 mr-2" />
            Resumo do Agendamento
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Serviços selecionados:</span>
              <span>{selectedServices.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Tempo estimado:</span>
              <span>{totalDuration} minutos</span>
            </div>
            <div className="flex justify-between font-medium text-base mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="barbershop"
        className="w-full"
        disabled={isLoading || selectedServices.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Confirmar Agendamento"
        )}
      </Button>
    </form>
  );
}