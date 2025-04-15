import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Scissors } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/forms/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";


export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obter URL personalizada do estabelecimento (se houver)
  const queryParams = new URLSearchParams(location.search);
  const estabelecimentoUrl = queryParams.get("estabelecimento");
  
  // Redirecionamento se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <div className="container max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para o site
          </Link>
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg border p-6 md:p-8">
            <div className="flex flex-col items-center mb-6">
              <img src={"https://res.cloudinary.com/dmhyzqdp9/image/upload/v1744490361/Gemini_Generated_Image_ezsmgrezsmgrezsm_vxtpif.jpg"} alt="BarberCut Pro" className="h-12 mb-2" />
              <h1 className="font-heading text-2xl font-bold">
                Bem-vindo ao BarberCut
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {estabelecimentoUrl 
                  ? `Acesse sua conta em ${estabelecimentoUrl}`
                  : "Acesse sua conta para continuar"
                }
              </p>
            </div>
            
            <LoginForm estabelecimentoUrl={estabelecimentoUrl} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link 
                  to={`/register${estabelecimentoUrl ? `?estabelecimento=${estabelecimentoUrl}` : ''}`}
                  className="text-primary hover:underline font-medium"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              É um barbeiro ou proprietário?{" "}
              <Link 
                to="/register-establishment"
                className="text-primary hover:underline font-medium flex items-center justify-center"
              >
                <Scissors className="h-3.5 w-3.5 mr-1" />
                Registre sua barbearia
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}