import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Edit, 
  MoreHorizontal, 
  Phone, 
  Plus, 
  Search, 
  Star, 
  Trash, 
  UserRound
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import api from "@/lib/api";

export default function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [isAddingBarber, setIsAddingBarber] = useState(false);
  const [isEditingBarber, setIsEditingBarber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  // Carregar barbeiros
  useEffect(() => {
    const loadBarbers = async () => {
      setIsLoading(true);
      try {
        // Chamada real para API
        const response = await api.get('/api/usuarios/por-estabelecimento', {
          params: {
            estabelecimentoId: user.estabelecimento,
            tipo: 'barbeiro'
          }
        });
        
        setBarbers(response.data.data);
        setFilteredBarbers(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar barbeiros:", error);
        
        // Dados fictícios para desenvolvimento
        const mockBarbers = [
          {
            _id: "1",
            nome: "Ricardo Silva",
            email: "ricardo@barbercut.com",
            telefone: "(11) 98765-4321",
            fotoPerfil: "",
            especialidades: ["Cortes Modernos", "Barba"],
            horarioTrabalho: {
              inicio: "09:00",
              fim: "18:00",
              diasDisponiveis: [1, 2, 3, 4, 5, 6]
            },
            ativo: true
          },
          {
            _id: "2",
            nome: "Carlos Mendes",
            email: "carlos@barbercut.com",
            telefone: "(11) 91234-5678",
            fotoPerfil: "",
            especialidades: ["Degradê", "Barba Tradicional"],
            horarioTrabalho: {
              inicio: "10:00",
              fim: "19:00",
              diasDisponiveis: [0, 1, 2, 3, 4, 5]
            },
            ativo: true
          },
          {
            _id: "3",
            nome: "André Costa",
            email: "andre@barbercut.com",
            telefone: "(11) 99876-5432",
            fotoPerfil: "",
            especialidades: ["Cabelos Cacheados", "Tratamentos"],
            horarioTrabalho: {
              inicio: "08:00",
              fim: "17:00",
              diasDisponiveis: [1, 2, 3, 4, 5]
            },
            ativo: true
          },
          {
            _id: "4",
            nome: "Felipe Santos",
            email: "felipe@barbercut.com",
            telefone: "(11) 95555-6666",
            fotoPerfil: "",
            especialidades: ["Cortes Clássicos", "Pompadour"],
            horarioTrabalho: {
              inicio: "11:00",
              fim: "20:00",
              diasDisponiveis: [2, 3, 4, 5, 6]
            },
            ativo: true
          }
        ];
        
        setBarbers(mockBarbers);
        setFilteredBarbers(mockBarbers);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBarbers();
  }, [user.estabelecimento]);

  // Filtrar barbeiros por termo de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const filtered = barbers.filter(barber => 
        barber.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barber.especialidades?.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBarbers(filtered);
    } else {
      setFilteredBarbers(barbers);
    }
  }, [searchTerm, barbers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddBarber = () => {
    setSelectedBarber(null);
    setIsAddingBarber(true);
  };

  const handleEditBarber = (barber) => {
    setSelectedBarber(barber);
    setIsEditingBarber(true);
  };

  const handleDeleteBarber = async (barberId) => {
    if (window.confirm("Tem certeza que deseja remover este barbeiro?")) {
      try {
        // Chamada real para API
        await api.patch(`/api/usuarios/${barberId}/desativar`);
        
        // Atualizar lista local
        setBarbers(barbers.filter(barber => barber._id !== barberId));
      } catch (error) {
        console.error("Erro ao remover barbeiro:", error);
        // Para desenvolvimento, apenas atualiza o estado local
        setBarbers(barbers.filter(barber => barber._id !== barberId));
      }
    }
  };
  
  // Traduz os dias da semana
  const getDayName = (day) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[day];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Barbeiros</h1>
        <Button onClick={handleAddBarber}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Barbeiro
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar barbeiro por nome, email ou especialidade..."
          className="pl-9"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarbers.map((barber) => (
          <div
            key={barber._id}
            className="bg-card rounded-lg border overflow-hidden shadow-sm"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={barber.fotoPerfil} alt={barber.nome} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(barber.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{barber.nome}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <UserRound className="h-3.5 w-3.5 mr-1" />
                      Barbeiro
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditBarber(barber)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver agenda
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteBarber(barber._id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{barber.telefone}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{barber.horarioTrabalho?.inicio} - {barber.horarioTrabalho?.fim}</span>
                </div>

                {barber.especialidades && barber.especialidades.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1.5">Especialidades:</div>
                    <div className="flex flex-wrap gap-1">
                      {barber.especialidades.map((especialidade, index) => (
                        <div 
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {especialidade}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {barber.horarioTrabalho?.diasDisponiveis && (
                  <div>
                    <div className="text-sm font-medium mb-1.5">Dias de trabalho:</div>
                    <div className="flex flex-wrap gap-1">
                      {barber.horarioTrabalho.diasDisponiveis.map((dia) => (
                        <div 
                          key={dia}
                          className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {getDayName(dia)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-muted"}`}
                    />
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEditBarber(barber)}>
                  Gerenciar
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredBarbers.length === 0 && (
          <div className="col-span-full flex items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <div className="text-center">
              <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum barbeiro encontrado</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Tente buscar com outros termos." : "Adicione barbeiros à sua equipe."}
              </p>
              <Button onClick={handleAddBarber}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Barbeiro
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Sheet para adicionar barbeiro */}
      {isAddingBarber && (
        <Sheet open={isAddingBarber} onOpenChange={setIsAddingBarber}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Adicionar Barbeiro</SheetTitle>
              <SheetDescription>
                Adicione um novo profissional à sua equipe.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {/* Formulário para adicionar barbeiro iria aqui */}
              <p className="text-muted-foreground">Formulário não implementado nesta demonstração.</p>
            </div>
            <SheetFooter>
              <Button onClick={() => setIsAddingBarber(false)}>Cancelar</Button>
              <Button variant="barbershop" onClick={() => setIsAddingBarber(false)}>Adicionar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Sheet para editar barbeiro */}
      {isEditingBarber && selectedBarber && (
        <Sheet open={isEditingBarber} onOpenChange={setIsEditingBarber}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Editar Barbeiro</SheetTitle>
              <SheetDescription>
                Atualize as informações de {selectedBarber.nome}.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {/* Formulário para editar barbeiro iria aqui */}
              <p className="text-muted-foreground">Formulário não implementado nesta demonstração.</p>
            </div>
            <SheetFooter>
              <Button onClick={() => setIsEditingBarber(false)}>Cancelar</Button>
              <Button variant="barbershop" onClick={() => setIsEditingBarber(false)}>Salvar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}