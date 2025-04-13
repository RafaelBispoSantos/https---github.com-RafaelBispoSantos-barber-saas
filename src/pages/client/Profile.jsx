import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ClipboardCheck, 
  KeyRound, 
  UserRound 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";

export default function Profile() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [appointmentsStats, setAppointmentsStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0
  });
  const { getAppointments } = useAppointments();
  
  // Verificar autenticação
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: "/profile" } });
    }
  }, [user, loading, navigate]);

  // Carregar estatísticas de agendamentos
  useEffect(() => {
    const loadAppointmentsStats = async () => {
      if (!user) return;
      
      try {
        const appointments = await getAppointments({
          cliente: user.id,
          estabelecimentoId: user.estabelecimento
        });
        
        if (appointments) {
          const now = new Date();
          const total = appointments.length;
          const completed = appointments.filter(a => a.status === "concluido").length;
          const upcoming = appointments.filter(a => 
            new Date(a.data) > now && 
            a.status !== "cancelado"
          ).length;
          
          setAppointmentsStats({ total, completed, upcoming });
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas de agendamentos:", error);
        
        // Dados fictícios para desenvolvimento
        setAppointmentsStats({
          total: 12,
          completed: 8,
          upcoming: 2
        });
      }
    };
    
    loadAppointmentsStats();
  }, [user, getAppointments]);

  const handleProfileUpdate = (updatedData) => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  // Renderiza carregando
  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground mb-8">
            Gerencie suas informações pessoais e preferências
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar com estatísticas */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <ClipboardCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Total de agendamentos</span>
                      </div>
                      <span className="font-medium">{appointmentsStats.total}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Agendamentos futuros</span>
                      </div>
                      <span className="font-medium">{appointmentsStats.upcoming}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Agendamentos concluídos</span>
                      </div>
                      <span className="font-medium">{appointmentsStats.completed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Membro Desde</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {user.createdAt 
                      ? format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </CardContent>
              </Card>
              
              <Button 
                asChild 
                variant="outline"
                className="w-full mt-2"
              >
                <a href="/appointments">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver meus agendamentos
                </a>
              </Button>
            </div>
            
            {/* Conteúdo principal */}
            <div className="md:col-span-2">
              <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">
                    <UserRound className="h-4 w-4 mr-2" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="password">
                    <KeyRound className="h-4 w-4 mr-2" />
                    Senha
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>
                        Atualize suas informações pessoais e preferências
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileForm 
                        user={user} 
                        onSuccess={handleProfileUpdate} 
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="password" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alterar Senha</CardTitle>
                      <CardDescription>
                        Atualize sua senha de acesso
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="current-password"
                            className="text-sm font-medium"
                          >
                            Senha Atual
                          </label>
                          <input
                            id="current-password"
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label
                            htmlFor="new-password"
                            className="text-sm font-medium"
                          >
                            Nova Senha
                          </label>
                          <input
                            id="new-password"
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label
                            htmlFor="confirm-password"
                            className="text-sm font-medium"
                          >
                            Confirmar Nova Senha
                          </label>
                          <input
                            id="confirm-password"
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                        
                        <Button variant="barbershop" className="mt-4">
                          <KeyRound className="h-4 w-4 mr-2" />
                          Atualizar Senha
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}