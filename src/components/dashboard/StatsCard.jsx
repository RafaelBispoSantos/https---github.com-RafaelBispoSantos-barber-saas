import { cn } from "@/lib/utils";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
  colorClass = "text-primary",
  bgClass = "bg-primary/10",
  className
}) {
  // Define a cor da tendência
  const trendColorClass = trend === 'up' 
    ? 'text-emerald-600 dark:text-emerald-500' 
    : 'text-red-600 dark:text-red-500';
  
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && (
          <div className={cn("p-2 rounded-full", bgClass)}>
            <Icon className={cn("h-5 w-5", colorClass)} />
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        
        {trendValue && trendLabel && (
          <div className="flex items-center mt-2 text-sm">
            <span className={trendColorClass}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-muted-foreground ml-1">
              {trendLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}