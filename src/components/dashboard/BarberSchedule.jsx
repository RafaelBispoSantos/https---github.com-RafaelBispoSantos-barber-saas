import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Scissors } from "lucide-react";
import { format, addDays, isSameDay, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/common/StatusBadge";
import { cn, getInitials } from "@/lib/utils";

export default function BarberSchedule({ 
  appointments = [], 
  barber, 
  selectedDate = new Date(), 
  onDateChange, 
  onViewDetails,
  onCancel,
  onConfirm,
  onComplete
}) {
  // State para controlar o período de visualização
  const [visibleDays, setVisibleDays] = useState([]);
  
  // Gera os dias visíveis na agenda
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startOfDay(selectedDate), i));
    }
    setVisibleDays(days);
  }, [selectedDate]);
  
  // Navega para semana anterior
  const handlePrevWeek = () => {
    onDateChange(addDays(selectedDate, -7));
  };
  
  // Navega para próxima semana
  const handleNextWeek = () => {
    onDateChange(addDays(selectedDate, 7));
  };
  
  // Busca agendamentos para um dia específico
  const getAppointmentsForDay = (date) => {
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.data);
      return isSameDay(appointmentDate, date);
    }).sort((a, b) => {
      // Ordenar por horário
      if (a.horario < b.horario) return -1;
      if (a.horario > b.horario) return 1;
      return 0;
    });
  };
  
  // Array com horários de trabalho padrão
  const workingHours = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30"
  ];

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          {barber && (
            <div className="flex items-center mr-4">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={barber.fotoPerfil} alt={barber.nome} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(barber.nome)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{barber.nome}</h3>
                <p className="text-sm text-muted-foreground">Agenda de Horários</p>
              </div>
            </div>
          )}
          {!barber && (
            <h3 className="font-heading font-medium text-lg">Agenda de Horários</h3>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center rounded-md bg-muted px-2 py-1 text-sm">
            <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span>{format(selectedDate, "MMMM yyyy", { locale: ptBR })}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Semana anterior</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima semana</span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header com os dias da semana */}
          <div className="grid grid-cols-7 border-b">
            {visibleDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 text-center border-r last:border-r-0",
                  isSameDay(day, new Date()) && "bg-primary/10"
                )}
              >
                <div className="font-medium">{format(day, "EEEE", { locale: ptBR })}</div>
                <div className="text-2xl font-bold">{format(day, "dd")}</div>
                <div className="text-xs text-muted-foreground">{format(day, "MMMM", { locale: ptBR })}</div>
              </div>
            ))}
          </div>
          
          {/* Conteúdo da agenda */}
          <div className="grid grid-cols-7 min-h-[600px] relative">
            {/* Linhas de hora */}
            {workingHours.map((hour, i) => (
              <div 
                key={hour} 
                className="absolute w-full border-t text-xs text-muted-foreground"
                style={{ top: `${(i + 1) * 60}px` }}
              >
                <span className="absolute -top-2.5 -left-16">{hour}</span>
              </div>
            ))}
            
            {/* Colunas para cada dia */}
            {visibleDays.map((day, dayIndex) => (
              <div 
                key={dayIndex} 
                className={cn(
                  "relative h-full border-r last:border-r-0 min-h-[600px]",
                  isSameDay(day, new Date()) && "bg-primary/5"
                )}
              >
                {getAppointmentsForDay(day).map((appointment, appIndex) => {
                  // Calcular posição com base no horário
                  const [hours, minutes] = appointment.horario.split(':').map(Number);
                  const topPosition = (hours - 9) * 120 + (minutes / 30) * 60;
                  const height = appointment.duracao * 2; // 2px por minuto
                  
                  return (
                    <div
                      key={appIndex}
                      className={cn(
                        "absolute left-1 right-1 rounded border p-2 overflow-hidden shadow-sm",
                        appointment.status === 'cancelado' ? "bg-destructive/10 border-destructive/20" :
                        appointment.status === 'concluido' ? "bg-green-500/10 border-green-500/20" :
                        appointment.status === 'confirmado' ? "bg-amber-500/10 border-amber-500/20" :
                        "bg-blue-500/10 border-blue-500/20"
                      )}
                      style={{
                        top: `${topPosition}px`,
                        height: `${Math.max(height, 60)}px` // Altura mínima de 60px
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs font-medium">{appointment.horario}</span>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <div className="text-xs font-medium truncate">{appointment.cliente?.nome}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Scissors className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {appointment.servicos?.map(s => s.nome).join(', ')}
                        </span>
                      </div>
                      
                      {height >= 100 && (
                        <div className="absolute bottom-1 right-1 left-1 flex justify-end gap-1 mt-1">
                          {appointment.status === 'agendado' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => onConfirm && onConfirm(appointment._id)}
                            >
                              Confirmar
                            </Button>
                          )}
                          
                          {appointment.status === 'confirmado' && (
                            <Button
                              variant="default"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => onComplete && onComplete(appointment._id)}
                            >
                              Concluir
                            </Button>
                          )}
                          
                          {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                              onClick={() => onCancel && onCancel(appointment._id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}