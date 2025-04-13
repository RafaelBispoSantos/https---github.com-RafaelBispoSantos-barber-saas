import { Clock, Scissors, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ServiceCard({ 
  service, 
  featured = false, 
  onClick,
  showBookButton = true,
  className = "" 
}) {
  const { nome, descricao, preco, duracao, promocao, imagem } = service;

  const hasPromotion = promocao?.ativa && promocao.precoPromocional < preco;
  const displayPrice = hasPromotion ? promocao.precoPromocional : preco;
  const promotionPercentage = hasPromotion 
    ? Math.round(((preco - promocao.precoPromocional) / preco) * 100) 
    : 0;

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        featured && "border-primary/50 shadow-md",
        className
      )}
    >
      {imagem && (
        <div className="h-40 w-full overflow-hidden bg-muted">
          <img 
            src={imagem} 
            alt={nome} 
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      {featured && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-current" />
            <span>Destaque</span>
          </div>
        </div>
      )}
      
      {hasPromotion && (
        <div className="absolute top-3 left-3">
          <div className="flex items-center space-x-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
            <span>{promotionPercentage}% OFF</span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg">{nome}</h3>
        
        {descricao && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{descricao}</p>
        )}
        
        <div className="flex items-center mt-3 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duracao} minutos</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-end">
            {hasPromotion && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                R$ {preco.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className={cn(
              "text-lg font-bold",
              hasPromotion && "text-emerald-600 dark:text-emerald-500"
            )}>
              R$ {displayPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          {showBookButton && (
            <Button 
              variant="barbershop" 
              size="sm" 
              onClick={onClick}
              className="gap-1"
            >
              <Scissors className="h-4 w-4" />
              Agendar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}