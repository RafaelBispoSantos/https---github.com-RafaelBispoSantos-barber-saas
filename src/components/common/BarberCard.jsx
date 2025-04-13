import { Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BarberCard({
  barber,
  onClick,
  showBookButton = true,
  className = ""
}) {
  const { nome, especialidades, fotoPerfil } = barber;
  
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
        "rounded-lg overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
          <AvatarImage src={fotoPerfil} alt={nome} />
          <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
            {getInitials(nome)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="font-heading font-bold text-xl">{nome}</h3>
        
        <div className="mt-1 mb-3 flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= 4 ? "text-amber-500 fill-amber-500" : "text-muted"}`}
            />
          ))}
        </div>
        
        {especialidades && especialidades.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {especialidades.map((especialidade, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
              >
                {especialidade}
              </span>
            ))}
          </div>
        )}
        
        {showBookButton && (
          <Button
            variant="barbershopOutline"
            className="mt-4 w-full"
            onClick={onClick}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Horário
          </Button>
        )}
      </div>
    </div>
  );
}