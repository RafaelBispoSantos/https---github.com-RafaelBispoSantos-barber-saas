import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, Loader2, Scissors, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";


// Validation schema
const establishmentSchema = z.object({
  nomeEstabelecimento: z
    .string()
    .min(3, { message: "Nome do estabelecimento deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome não deve exceder 100 caracteres" }),
  urlPersonalizada: z
    .string()
    .min(3, { message: "URL deve ter pelo menos 3 caracteres" })
    .max(30, { message: "URL não deve exceder 30 caracteres" })
    .regex(/^[a-z0-9-]+$/, { message: "A URL deve conter apenas letras minúsculas, números e hífens" }),
  nome: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome não deve exceder 100 caracteres" }),
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  telefone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 dígitos" })
    .max(15, { message: "Telefone não deve exceder 15 caracteres" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  passwordConfirm: z
    .string()
    .min(1, { message: "Confirmação de senha é obrigatória" }),
  termos: z
    .boolean()
    .refine((val) => val === true, { message: "Você deve aceitar os termos e condições" }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
});

export default function RegisterEstablishment() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [urlStatus, setUrlStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const { registerEstablishment, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      nomeEstabelecimento: "",
      urlPersonalizada: "",
      nome: "",
      email: "",
      telefone: "",
      password: "",
      passwordConfirm: "",
      termos: false,
    },
  });

  const urlPersonalizada = watch("urlPersonalizada");

  // Simula verificação de disponibilidade da URL
  const checkUrlAvailability = (url) => {
    if (!url || url.length < 3) return;
    
    setIsCheckingUrl(true);
    setUrlStatus("checking");
    
    // Simular uma chamada de API com timeout
    setTimeout(() => {
      // Aqui seria feita a verificação real na API
      const isAvailable = Math.random() > 0.3; // 70% de chance de estar disponível (para demo)
      
      setUrlStatus(isAvailable ? "available" : "taken");
      setIsCheckingUrl(false);
    }, 1000);
  };

  const onSubmit = async (data) => {
    try {
      const result = await registerEstablishment(data);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao registrar estabelecimento:", error);
    }
  };

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
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-xl shadow-lg border p-6 md:p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center space-x-2">
                <img src={"https://res.cloudinary.com/dmhyzqdp9/image/upload/v1744490361/Gemini_Generated_Image_ezsmgrezsmgrezsm_vxtpif.jpg"} alt="BarberCut Pro" className="h-10" />
                <Scissors className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-bold mt-2">
                Registre Sua Barbearia
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Comece a gerenciar sua barbearia com nossa plataforma completa
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="nomeEstabelecimento"
                    className="text-sm font-medium leading-none"
                  >
                    Nome do Estabelecimento
                  </label>
                  <Input
                    id="nomeEstabelecimento"
                    type="text"
                    placeholder="Ex: Barbearia Moderna"
                    {...register("nomeEstabelecimento")}
                    className={errors.nomeEstabelecimento ? "border-destructive" : ""}
                  />
                  {errors.nomeEstabelecimento && (
                    <p className="text-sm text-destructive">{errors.nomeEstabelecimento.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="urlPersonalizada"
                    className="text-sm font-medium leading-none"
                  >
                    URL Personalizada
                  </label>
                  <div className="flex items-center">
                    <div className="bg-muted rounded-l-md px-3 py-2 text-sm text-muted-foreground">
                      https://
                    </div>
                    <div className="relative flex-1">
                      <Input
                        id="urlPersonalizada"
                        type="text"
                        placeholder="sua-barbearia"
                        {...register("urlPersonalizada")}
                        className={`rounded-l-none ${errors.urlPersonalizada ? "border-destructive" : ""}`}
                        onChange={(e) => {
                          // Converter para minúsculas e remover caracteres inválidos
                          e.target.value = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "");
                        }}
                        onBlur={(e) => {
                          if (e.target.value) {
                            checkUrlAvailability(e.target.value);
                          }
                        }}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {urlStatus === "checking" && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {urlStatus === "available" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {urlStatus === "taken" && (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                    <div className="bg-muted rounded-r-md px-3 py-2 text-sm text-muted-foreground">
                      .barbercut.com
                    </div>
                  </div>
                  {errors.urlPersonalizada && (
                    <p className="text-sm text-destructive">{errors.urlPersonalizada.message}</p>
                  )}
                  {urlStatus === "taken" && !errors.urlPersonalizada && (
                    <p className="text-sm text-destructive">Esta URL já está em uso. Escolha outra.</p>
                  )}
                  {urlStatus === "available" && !errors.urlPersonalizada && (
                    <p className="text-sm text-green-500">URL disponível!</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="nome"
                    className="text-sm font-medium leading-none"
                  >
                    Seu Nome
                  </label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Nome completo"
                    autoComplete="name"
                    {...register("nome")}
                    className={errors.nome ? "border-destructive" : ""}
                  />
                  {errors.nome && (
                    <p className="text-sm text-destructive">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    autoComplete="email"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="telefone"
                    className="text-sm font-medium leading-none"
                  >
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="(XX) XXXXX-XXXX"
                    autoComplete="tel"
                    {...register("telefone")}
                    className={errors.telefone ? "border-destructive" : ""}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-destructive">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...register("password")}
                      className={errors.password ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="passwordConfirm"
                    className="text-sm font-medium leading-none"
                  >
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="passwordConfirm"
                      type={showPasswordConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...register("passwordConfirm")}
                      className={errors.passwordConfirm ? "border-destructive pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    >
                      {showPasswordConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.passwordConfirm && (
                    <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input
                  id="termos"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  {...register("termos")}
                />
                <label htmlFor="termos" className="text-sm text-muted-foreground">
                  Concordo com os{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              {errors.termos && (
                <p className="text-sm text-destructive mt-1">{errors.termos.message}</p>
              )}

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="barbershop"
                className="w-full mt-4"
                disabled={isLoading || urlStatus === "taken" || isCheckingUrl}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrar Barbearia"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já possui uma barbearia registrada?{" "}
                <Link 
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-card rounded-lg border">
            <h3 className="font-medium text-lg mb-2">Benefícios do Plano Trial</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">15 dias gratuitos para testar a plataforma completa</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">Sistema de agendamento online para seus clientes</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">Gerenciamento de barbeiros e serviços</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">Dashboard com estatísticas e relatórios</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">Sem compromisso - cancele quando quiser</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}