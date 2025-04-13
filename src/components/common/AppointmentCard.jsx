import { 
    Calendar,
    Clock,
    MapPin,
    User,
    Scissors,
    CheckCircle2,
    XCircle,
    CalendarClock
  } from "lucide-react";
  import { format, isPast } from "date-fns";
  import { ptBR } from "date-fns/locale";
  import { Button } from "@/components/ui/button";
  import { cn } from "@/lib/utils";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import StatusBadge from "./StatusBadge";
  
  export default function AppointmentCard({
    appointment,
    onCancel,
    onConfirm,
    onComplete,
    userType = "cliente",
    className = ""
  }) {
    const { 
      cliente, 
      barbeiro, 
      servicos, 
      data, 
      horario, 
      duracao, 
      precoTotal, 
      status 
    } = appointment;
  
    const appointmentDate = new Date(data);
    const isInPast = isPast(appointmentDate);
    
    // Gera as iniciais do nome para o fallback do avatar
    const getInitials = (name) => {
      if (!name) return "BB";
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    };
  
    return (
      <div
        className={cn(
          "rounded-lg overflow-hidden border bg-card shadow-sm",
          className
        )}
      >
        <div className="border-b p-4 flex justify-between items-center bg-muted/30">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">
                {format(new Date(data), "EEEE", { locale: ptBR })}{" "}
                <span className="font-bold">
                  {format(new Date(data), "dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center mt-0.5">
                <Clock className="h-3 w-3 mr-1" />
                {horario} • {duracao} min
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
  
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Avatar section */}
            <div className="sm:w-1/4 flex flex-col items-center text-center">
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage 
                  src={userType === "cliente" 
                    ? barbeiro?.fotoPerfil 
                    : cliente?.fotoPerfil} 
                  alt={userType === "cliente" ? barbeiro?.nome : cliente?.nome} 
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(userType === "cliente" 
                    ? barbeiro?.nome 
                    : cliente?.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">
                {userType === "cliente" ? barbeiro?.nome : cliente?.nome}
              </div>
              <div className="text-xs text-muted-foreground">
                {userType === "cliente" ? "Barbeiro" : "Cliente"}
              </div>
            </div>
  
            {/* Appointment details */}
            <div className="sm:w-3/4">
              <div className="space-y-3">
                {/* Services */}
                <div>
                  <h4 className="text-sm font-medium flex items-center">
                    <Scissors className="h-4 w-4 mr-1 text-muted-foreground" />
                    Serviços
                  </h4>
                  <ul className="mt-1 space-y-1">
                    {servicos?.map((servico) => (
                      <li key={servico._id} className="text-sm flex justify-between">
                        <span>{servico.nome}</span>
                        <span className="text-muted-foreground">
                          R$ {servico.preco.toFixed(2).replace('.', ',')}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>R$ {precoTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
  
              {/* Actions */}
              {status !== 'concluido' && status !== 'cancelado' && (
                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 justify-end">
                  {userType === "cliente" && !isInPast && status !== 'cancelado' && (
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                      size="sm"
                      onClick={() => onCancel && onCancel(appointment._id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                  
                  {userType === "barbeiro" && status === 'agendado' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onConfirm && onConfirm(appointment._id)}
                    >
                      <CalendarClock className="h-4 w-4 mr-1" />
                      Confirmar
                    </Button>
                  )}
                  
                  {userType === "barbeiro" && status !== 'cancelado' && !isInPast && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancel && onCancel(appointment._id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                  
                  {userType === "barbeiro" && status === 'confirmado' && (
                    <Button
                      variant="barbershop"
                      size="sm"
                      onClick={() => onComplete && onComplete(appointment._id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Concluir
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }