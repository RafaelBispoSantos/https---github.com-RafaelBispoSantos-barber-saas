import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(1, { message: "Senha é obrigatória" }),
  estabelecimentoUrl: z.string().optional(),
});

export default function LoginForm({ estabelecimentoUrl = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      estabelecimentoUrl: estabelecimentoUrl || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      const result = await login(data);
      
      if (result.success) {
        // Redirect based on user type
        if (result.user.tipo === "proprietario") {
          navigate("/dashboard");
        } else if (result.user.tipo === "barbeiro") {
          navigate("/barber/schedule");
        } else {
          navigate("/");
        }
      } else {
        setSubmitError(result.error || "Falha ao fazer login");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setSubmitError("Ocorreu um erro durante o login. Por favor, tente novamente.");
    }
  };

  const handlePasswordToggle = (e) => {
    // Impede que o clique no botão de mostrar senha propague para o formulário
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
          htmlFor="password"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Senha
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            className={errors.password ? "border-destructive pr-10" : "pr-10"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={handlePasswordToggle}
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

      {/* Hidden field for estabelecimentoUrl */}
      <Input
        type="hidden"
        {...register("estabelecimentoUrl")}
        value={estabelecimentoUrl || ""}
      />

      {(error || submitError) && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error || submitError}
        </div>
      )}

      <Button
        type="submit"
        variant="barbershop"
        className="w-full"
        disabled={isLoading}
        onClick={() => console.log("Button clicked")} // Debug para verificar cliques
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}