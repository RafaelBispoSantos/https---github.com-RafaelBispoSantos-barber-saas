import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-9xl font-bold text-primary">404</h1>
        <h2 className="font-heading text-2xl font-bold mt-4 mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}