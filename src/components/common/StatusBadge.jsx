import { CalendarClock, CalendarCheck2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status }) {
  const statusConfig = {
    agendado: {
      label: "Agendado",
      icon: CalendarClock,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    },
    confirmado: {
      label: "Confirmado",
      icon: CalendarCheck2,
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    },
    concluido: {
      label: "Concluído",
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    },
    cancelado: {
      label: "Cancelado",
      icon: XCircle,
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    }
  };

  const config = statusConfig[status] || statusConfig.agendado;
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
      config.className
    )}>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {config.label}
    </div>
  );
}