import { useState, useEffect } from "react";
import { 
  Bell, 
  Building, 
  Clock, 
  ImageIcon, 
  Link, 
  Mail, 
  MapPin, 
  Paintbrush, 
  Phone, 
  Save, 
  Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function Settings() {
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("establishment");
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();

  // Carregar dados do estabelecimento
  useEffect(() => {
    const loadEstabelecimento = async () => {
      setIsLoading(true);
      try {
        // Chamada real para API
        const response = await api.get(`/api/estabelecimentos/${user.estabelecimento}`);
        
        setEstabelecimento(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar dados do estabelecimento:", error);
        
        // Dados fictícios para desenvolvimento
        setEstabelecimento({
          _id: "est-1",
          nome: "Barbearia Moderna",
          urlPersonalizada: "barbearia-moderna",
          endereco: {
            rua: "Av. Paulista",
            numero: "1000",
            complemento: "Sala 502",
            bairro: "Bela Vista",
            cidade: "São Paulo",
            estado: "SP",
            cep: "01310-100"
          },
          contato: {
            telefone: "(11) 3456-7890",
            email: "contato@barbearia-moderna.com",
            whatsapp: "(11) 99876-5432"
          },
          redesSociais: {
            instagram: "barberiamoderna",
            facebook: "barberiamoderna",
            twitter: ""
          },
          horarioFuncionamento: {
            diasDisponiveis: [1, 2, 3, 4, 5, 6],
            horarios: [
              { dia: 1, inicio: "09:00", fim: "19:00" },
              { dia: 2, inicio: "09:00", fim: "19:00" },
              { dia: 3, inicio: "09:00", fim: "19:00" },
              { dia: 4, inicio: "09:00", fim: "19:00" },
              { dia: 5, inicio: "09:00", fim: "19:00" },
              { dia: 6, inicio: "09:00", fim: "17:00" }
            ]
          },
          marca: {
            logo: "/logo.png",
            corPrimaria: "#0c9fe8",
            corSecundaria: "#0266a1",
            fontes: {
              principal: "Montserrat",
              secundaria: "Playfair Display"
            }
          },
          conteudo: {
            titulo: "Barbearia Moderna",
            descricao: "Serviços de barbearia de alta qualidade com profissionais experientes.",
            sobreNos: "Somos uma barbearia moderna com foco em proporcionar a melhor experiência para nossos clientes. Oferecemos uma variedade de serviços de corte, barba e tratamentos capilares.",
            metaTags: {
              titulo: "Barbearia Moderna | Cortes e Barbas",
              descricao: "Barbearia moderna com serviços de corte, barba e tratamentos.",
              palavrasChave: "barbearia, corte, barba, degradê, tratamento capilar"
            }
          },
          configuracoes: {
            intervaloPadrao: 30,
            politicaCancelamento: 24,
            permitirAgendamentoOnline: true,
            lembreteAutomatico: true,
            tempoAntecedenciaLembrete: 24
          }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEstabelecimento();
  }, [user.estabelecimento]);

  const handleSave = async (type) => {
    setIsSaving(true);
    
    try {
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Em um ambiente real, você faria a chamada para a API
      
      console.log(`Dados de ${type} salvos com sucesso!`);
      // Exibir mensagem de sucesso
    } catch (error) {
      console.error(`Erro ao salvar dados de ${type}:`, error);
      // Exibir mensagem de erro
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !estabelecimento) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Configurações</h1>
      </div>
      
      <Tabs
        defaultValue="establishment"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="establishment">
            <Building className="h-4 w-4 mr-2" />
            Estabelecimento
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Paintbrush className="h-4 w-4 mr-2" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="h-4 w-4 mr-2" />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
        </TabsList>
        
        {/* Informações do Estabelecimento */}
        <TabsContent value="establishment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Configure as informações principais do seu estabelecimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="establishment-name">Nome do Estabelecimento</Label>
                  <Input 
                    id="establishment-name"
                    defaultValue={estabelecimento.nome}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url-slug">URL Personalizada</Label>
                  <div className="flex items-center">
                    <div className="bg-muted rounded-l-md px-3 py-2 text-sm text-muted-foreground">
                      barbercut.com/
                    </div>
                    <Input
                      id="url-slug"
                      className="rounded-l-none"
                      defaultValue={estabelecimento.urlPersonalizada}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  defaultValue={estabelecimento.conteudo?.descricao}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">Sobre nós</Label>
                <Textarea
                  id="about"
                  defaultValue={estabelecimento.conteudo?.sobreNos}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('establishment')}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Configure os dados de contato para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="phone"
                      defaultValue={estabelecimento.contato?.telefone}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="whatsapp"
                      defaultValue={estabelecimento.contato?.whatsapp}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input 
                    id="email"
                    defaultValue={estabelecimento.contato?.email}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center">
                    <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="instagram"
                      defaultValue={estabelecimento.redesSociais?.instagram}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex items-center">
                    <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="facebook"
                      defaultValue={estabelecimento.redesSociais?.facebook}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex items-center">
                    <Link className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="twitter"
                      defaultValue={estabelecimento.redesSociais?.twitter}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('contact')}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Configure o endereço físico do seu estabelecimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input 
                    id="street"
                    defaultValue={estabelecimento.endereco?.rua}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="number">Número</Label>
                    <Input 
                      id="number"
                      defaultValue={estabelecimento.endereco?.numero}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input 
                      id="complement"
                      defaultValue={estabelecimento.endereco?.complemento}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input 
                    id="neighborhood"
                    defaultValue={estabelecimento.endereco?.bairro}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input 
                    id="city"
                    defaultValue={estabelecimento.endereco?.cidade}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input 
                    id="state"
                    defaultValue={estabelecimento.endereco?.estado}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode">CEP</Label>
                  <Input 
                    id="zipcode"
                    defaultValue={estabelecimento.endereco?.cep}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('address')}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Salvar Endereço
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marca e Logo</CardTitle>
              <CardDescription>
                Personalize a aparência da sua barbearia online.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Logo</Label>
                <div className="flex items-start space-x-4">
                  <div className="h-24 w-24 border rounded-md flex items-center justify-center bg-muted">
                    {estabelecimento.marca?.logo ? (
                      <img 
                        src={estabelecimento.marca.logo} 
                        alt="Logo" 
                        className="max-h-full max-w-full"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Alterar logo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Recomendado: PNG ou SVG com fundo transparente, 512x512px
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex">
                    <div 
                      className="h-10 w-10 rounded-l-md border-y border-l"
                      style={{ backgroundColor: estabelecimento.marca?.corPrimaria }}
                    ></div>
                    <Input 
                      id="primary-color"
                      defaultValue={estabelecimento.marca?.corPrimaria}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex">
                    <div 
                      className="h-10 w-10 rounded-l-md border-y border-l"
                      style={{ backgroundColor: estabelecimento.marca?.corSecundaria }}
                    ></div>
                    <Input 
                      id="secondary-color"
                      defaultValue={estabelecimento.marca?.corSecundaria}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-font">Fonte Principal</Label>
                  <Input 
                    id="main-font"
                    defaultValue={estabelecimento.marca?.fontes?.principal}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-font">Fonte Secundária</Label>
                  <Input 
                    id="secondary-font"
                    defaultValue={estabelecimento.marca?.fontes?.secundaria}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('appearance')}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Paintbrush className="h-4 w-4 mr-2" />
                    Salvar Aparência
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Agendamentos */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Agendamento</CardTitle>
              <CardDescription>
                Configure como os agendamentos funcionam na sua barbearia.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="online-booking">Permitir agendamento online</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar agendamentos online para clientes
                    </p>
                  </div>
                  <Switch 
                    id="online-booking"
                    defaultChecked={estabelecimento.configuracoes?.permitirAgendamentoOnline}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-interval">Intervalo padrão entre horários (minutos)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="default-interval"
                    defaultValue={[estabelecimento.configuracoes?.intervaloPadrao || 30]}
                    max={60}
                    step={5}
                    className="w-52"
                  />
                  <div className="w-12 text-center font-medium">
                    {estabelecimento.configuracoes?.intervaloPadrao || 30}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cancellation-policy">Política de cancelamento (horas)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Tempo mínimo antes do horário agendado para permitir cancelamentos
                </p>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="cancellation-policy"
                    defaultValue={[estabelecimento.configuracoes?.politicaCancelamento || 24]}
                    max={48}
                    step={1}
                    className="w-52"
                  />
                  <div className="w-12 text-center font-medium">
                    {estabelecimento.configuracoes?.politicaCancelamento || 24}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('schedule')}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como e quando enviar lembretes para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Label htmlFor="automatic-reminders">Lembretes automáticos</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar lembretes automáticos de agendamentos
                    </p>
                  </div>
                  <Switch 
                    id="automatic-reminders"
                    defaultChecked={estabelecimento.configuracoes?.lembreteAutomatico}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Antecedência para lembretes (horas)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="reminder-time"
                    defaultValue={[estabelecimento.configuracoes?.tempoAntecedenciaLembrete || 24]}
                    max={48}
                    step={1}
                    className="w-52"
                  />
                  <div className="w-12 text-center font-medium">
                    {estabelecimento.configuracoes?.tempoAntecedenciaLembrete || 24}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <Label>Canais de notificação</Label>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">
                        Enviar confirmações e lembretes por e-mail
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">SMS</div>
                      <div className="text-sm text-muted-foreground">
                        Enviar confirmações e lembretes por SMS
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Push</div>
                      <div className="text-sm text-muted-foreground">
                        Enviar notificações push no aplicativo
                      </div>
                    </div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('notifications')}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Salvar Notificações
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}