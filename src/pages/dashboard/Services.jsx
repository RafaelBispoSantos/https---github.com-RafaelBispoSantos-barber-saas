import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Star, 
  Tag, 
  Trash, 
  Pencil,
  Percent
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
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
import { formatCurrency } from "@/lib/utils";

export default function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const { user } = useAuth();
  const { 
    getServices, 
    deleteService, 
    createPromotion, 
    endPromotion, 
    isLoading, 
    error 
  } = useServices();

  // Carregar serviços
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices(user.estabelecimento);
        setServices(data);
        setFilteredServices(data);
        
        // Extrair categorias únicas
        const uniqueCategories = [...new Set(data.map(service => service.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        
        // Dados fictícios para desenvolvimento
        const mockServices = [
          {
            _id: "1",
            nome: "Corte Moderno",
            descricao: "Corte personalizado incluindo lavagem e finalização",
            preco: 60.00,
            duracao: 45,
            categoria: "Cortes",
            destaque: true
          },
          {
            _id: "2",
            nome: "Barba Completa",
            descricao: "Modelagem de barba com toalha quente e produtos especiais",
            preco: 45.00,
            duracao: 30,
            categoria: "Barba"
          },
          {
            _id: "3",
            nome: "Combo Corte + Barba",
            descricao: "Pacote completo para quem busca rejuvenescimento total",
            preco: 95.00,
            duracao: 75,
            categoria: "Combos",
            promocao: {
              ativa: true,
              precoPromocional: 85.00,
              dataInicio: new Date(),
              dataFim: new Date(new Date().setDate(new Date().getDate() + 30))
            }
          },
          {
            _id: "4",
            nome: "Hidratação Capilar",
            descricao: "Tratamento intensivo para recuperar cabelos danificados",
            preco: 70.00,
            duracao: 45,
            categoria: "Tratamentos"
          }
        ];
        
        setServices(mockServices);
        setFilteredServices(mockServices);
        
        // Extrair categorias únicas
        const uniqueCategories = [...new Set(mockServices.map(service => service.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    };
    
    loadServices();
  }, [user.estabelecimento, getServices]);

  // Filtrar serviços por pesquisa e categoria
  useEffect(() => {
    let filtered = services;
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.descricao && service.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(service => service.categoria === categoryFilter);
    }
    
    setFilteredServices(filtered);
  }, [searchTerm, categoryFilter, services]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category === categoryFilter ? "" : category);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsEditing(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await deleteService(serviceId);
        setServices(services.filter(service => service._id !== serviceId));
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        // Para desenvolvimento, apenas remove do estado local
        setServices(services.filter(service => service._id !== serviceId));
      }
    }
  };

  const handlePromoteService = (service) => {
    setSelectedService(service);
    setIsPromoting(true);
  };

  const handleEndPromotion = async (serviceId) => {
    if (window.confirm("Tem certeza que deseja encerrar esta promoção?")) {
      try {
        await endPromotion(serviceId);
        // Atualizar o estado local
        setServices(services.map(service => 
          service._id === serviceId 
            ? { ...service, promocao: { ...service.promocao, ativa: false } } 
            : service
        ));
      } catch (error) {
        console.error("Erro ao encerrar promoção:", error);
        // Para desenvolvimento, apenas atualiza o estado local
        setServices(services.map(service => 
          service._id === serviceId 
            ? { ...service, promocao: { ...service.promocao, ativa: false } } 
            : service
        ));
      }
    }
  };

  // Calcular a % de desconto de uma promoção
  const calculateDiscount = (original, promotional) => {
    return Math.round(((original - promotional) / original) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Serviços</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Filtros e pesquisa */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {categoryFilter ? categoryFilter : "Categorias"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem 
              className={!categoryFilter ? "bg-muted" : ""} 
              onClick={() => setCategoryFilter("")}
            >
              <span>Todas as categorias</span>
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category} 
                className={categoryFilter === category ? "bg-muted" : ""}
                onClick={() => handleCategoryFilter(category)}
              >
                <span>{category}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lista de serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service._id}
            className="bg-card rounded-lg border overflow-hidden shadow-sm"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{service.nome}</h3>
                  {service.destaque && (
                    <div className="flex items-center mt-1 text-amber-500 text-xs font-medium">
                      <Star className="h-3 w-3 fill-amber-500 mr-1" />
                      Destaque
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditService(service)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    {(!service.promocao || !service.promocao.ativa) && (
                      <DropdownMenuItem onClick={() => handlePromoteService(service)}>
                        <Percent className="h-4 w-4 mr-2" />
                        Criar promoção
                      </DropdownMenuItem>
                    )}
                    {service.promocao && service.promocao.ativa && (
                      <DropdownMenuItem onClick={() => handleEndPromotion(service._id)}>
                        <Percent className="h-4 w-4 mr-2" />
                        Encerrar promoção
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {service.categoria && (
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>{service.categoria}</span>
                </div>
              )}
              
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{service.duracao} minutos</span>
              </div>
              
              {service.descricao && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{service.descricao}</p>
              )}
              
              <div className="mt-3 pt-3 border-t flex items-end justify-between">
                <div>
                  {service.promocao && service.promocao.ativa ? (
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm line-through text-muted-foreground mr-2">
                          {formatCurrency(service.preco)}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-500 text-sm px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 font-medium">
                          {calculateDiscount(service.preco, service.promocao.precoPromocional)}% OFF
                        </span>
                      </div>
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-500">
                        {formatCurrency(service.promocao.precoPromocional)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-bold">
                      {formatCurrency(service.preco)}
                    </div>
                  )}
                </div>
                
                <Button variant="outline" size="sm">Editar</Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredServices.length === 0 && (
          <div className="col-span-full flex items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-muted-foreground">Nenhum serviço encontrado</p>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Serviço
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Sheet para edição de serviço */}
      {isEditing && selectedService && (
        <Sheet open={isEditing} onOpenChange={setIsEditing}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Editar Serviço</SheetTitle>
              <SheetDescription>
                Atualize as informações do serviço aqui.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {/* Formulário de edição de serviço iria aqui */}
              <p className="text-muted-foreground">Formulário de edição não implementado nesta demonstração.</p>
            </div>
            <SheetFooter>
              <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
              <Button variant="barbershop" onClick={() => setIsEditing(false)}>Salvar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Sheet para criação de promoção */}
      {isPromoting && selectedService && (
        <Sheet open={isPromoting} onOpenChange={setIsPromoting}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Criar Promoção</SheetTitle>
              <SheetDescription>
                Defina um desconto para {selectedService.nome}.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              {/* Formulário de criação de promoção iria aqui */}
              <p className="text-muted-foreground">Formulário de promoção não implementado nesta demonstração.</p>
            </div>
            <SheetFooter>
              <Button onClick={() => setIsPromoting(false)}>Cancelar</Button>
              <Button variant="barbershop" onClick={() => setIsPromoting(false)}>Criar Promoção</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}