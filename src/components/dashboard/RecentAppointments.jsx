import { useState } from "react";
import { Calendar, Clock, MoreHorizontal, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "../common/StatusBadge";

export default function RecentAppointments({ 
  appointments = [],
  onViewDetails,
  onCancel,
  onConfirm,
  onComplete 
}) {
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
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-6 pb-2">
        <h3 className="font-heading font-medium text-lg">Agendamentos Recentes</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Barbeiro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Horário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Serviços
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={appointment.cliente?.fotoPerfil} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(appointment.cliente?.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{appointment.cliente?.nome}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={appointment.barbeiro?.fotoPerfil} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(appointment.barbeiro?.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{appointment.barbeiro?.nome}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {format(new Date(appointment.data), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {appointment.horario}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {appointment.servicos.map((servico) => servico.nome).join(", ")}
                    </div>
                    <div className="text-sm font-medium mt-1">
                      R$ {appointment.precoTotal.toFixed(2).replace('.', ',')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(appointment._id)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        
                        {appointment.status === 'agendado' && (
                          <DropdownMenuItem onClick={() => onConfirm(appointment._id)}>
                            Confirmar
                          </DropdownMenuItem>
                        )}
                        
                        {appointment.status === 'confirmado' && (
                          <DropdownMenuItem onClick={() => onComplete(appointment._id)}>
                            Concluir
                          </DropdownMenuItem>
                        )}
                        
                        {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => onCancel(appointment._id)}
                          >
                            Cancelar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum agendamento encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}