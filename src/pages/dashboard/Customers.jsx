import { useState, useEffect } from "react";
import { 
  Calendar, 
  Mail, 
  MoreHorizontal, 
  Phone, 
  Plus, 
  Search, 
  Scissors, 
  Trash, 
  User,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/lib/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();

  // Carregar clientes
  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        // Chamada real para API
        const response = await api.get('/api/usuarios/por-estabelecimento', {
          params: {
            estabelecimentoId: user.estabelecimento,
            tipo: 'cliente'
          }
        });
        
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        
        // Dados fictícios para desenvolvimento
        const mockCustomers = Array.from({ length: 15 }, (_, i) => {
          const createdAt = new Date();
          createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 100));
          
          return {
            _id: `client-${i}`,
            nome: `Cliente ${i + 1} ${["Silva", "Oliveira", "Santos", "Costa", "Pereira"][Math.floor(Math.random() * 5)]}`,
            email: `cliente${i + 1}@email.com`,
            telefone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
            fotoPerfil: "",
            historicoAgendamentos: Array.from(
              { length: Math.floor(Math.random() * 10) }, 
              () => `agendamento-${Math.floor(Math.random() * 100)}`
            ),
            ativo: true,
            createdAt: createdAt.toISOString(),
            ultimoLogin: i % 5 === 0 ? null : new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            ).toISOString()
          };
        });
        
        setCustomers(mockCustomers);
        setFilteredCustomers(mockCustomers);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomers();
  }, [user.estabelecimento]);

  // Filtrar clientes por termo de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer => 
        customer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.telefone.includes(searchTerm)
      );
      
      setFilteredCustomers(
        sortCustomers(filtered, sortColumn, sortDirection)
      );
    } else {
      setFilteredCustomers(
        sortCustomers(customers, sortColumn, sortDirection)
      );
    }
  }, [searchTerm, customers, sortColumn, sortDirection]);

  // Função para ordenar clientes
  const sortCustomers = (data, column, direction) => {
    return [...data].sort((a, b) => {
      let valueA, valueB;
      
      if (column === 'agendamentos') {
        valueA = a.historicoAgendamentos?.length || 0;
        valueB = b.historicoAgendamentos?.length || 0;
      } else if (column === 'ultimoLogin') {
        valueA = a.ultimoLogin ? new Date(a.ultimoLogin).getTime() : 0;
        valueB = b.ultimoLogin ? new Date(b.ultimoLogin).getTime() : 0;
      } else if (column === 'createdAt') {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      } else {
        valueA = a[column]?.toLowerCase() || '';
        valueB = b[column]?.toLowerCase() || '';
      }
      
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Tem certeza que deseja remover este cliente?")) {
      try {
        // Chamada real para API
        await api.patch(`/api/usuarios/${customerId}/desativar`);
        
        // Atualizar lista local
        setCustomers(customers.filter(customer => customer._id !== customerId));
      } catch (error) {
        console.error("Erro ao remover cliente:", error);
        // Para desenvolvimento, apenas atualiza o estado local
        setCustomers(customers.filter(customer => customer._id !== customerId));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Clientes</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cliente
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente por nome, email ou telefone..."
          className="pl-9"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("nome")}
              >
                <div className="flex items-center">
                  Cliente
                  {sortColumn === "nome" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center">
                  Contato
                  {sortColumn === "email" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted text-center"
                onClick={() => handleSort("agendamentos")}
              >
                <div className="flex items-center justify-center">
                  Agendamentos
                  {sortColumn === "agendamentos" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Cadastro
                  {sortColumn === "createdAt" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("ultimoLogin")}
              >
                <div className="flex items-center">
                  Último Login
                  {sortColumn === "ultimoLogin" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={customer.fotoPerfil} alt={customer.nome} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(customer.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.nome}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <UserRound className="h-3 w-3 mr-1" />
                        Cliente
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm space-y-1">
                    <div className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span>{customer.telefone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                      {customer.historicoAgendamentos?.length || 0}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDistance(new Date(customer.createdAt), new Date(), { 
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.ultimoLogin ? (
                    <div className="text-sm">
                      {formatDistance(new Date(customer.ultimoLogin), new Date(), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Nunca</div>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        <User className="h-4 w-4 mr-2" />
                        Ver perfil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver agendamentos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Scissors className="h-4 w-4 mr-2" />
                        Novo agendamento
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteCustomer(customer._id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan="6" className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <UserRound className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground">
                      {searchTerm ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado."}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}