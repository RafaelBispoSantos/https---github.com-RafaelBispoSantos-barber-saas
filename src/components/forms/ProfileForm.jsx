import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validation-schemas";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";

export default function ProfileForm({ user, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const { updateProfile, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: user?.nome || "",
      telefone: user?.telefone || "",
      fotoPerfil: user?.fotoPerfil || "",
      especialidades: user?.especialidades?.join(", ") || "",
      horarioTrabalho: {
        inicio: user?.horarioTrabalho?.inicio || "09:00",
        fim: user?.horarioTrabalho?.fim || "19:00",
        diasDisponiveis: user?.horarioTrabalho?.diasDisponiveis || [1, 2, 3, 4, 5, 6]
      },
      preferencias: {
        receberEmailMarketing: user?.preferencias?.receberEmailMarketing !== false,
        receberSMS: user?.preferencias?.receberSMS !== false,
        receberPushNotification: user?.preferencias?.receberPushNotification !== false
      }
    }
  });

  const fotoPerfil = watch("fotoPerfil");

  const onSubmit = async (data) => {
    try {
      // Formatar especialidades de string para array
      if (data.especialidades) {
        data.especialidades = data.especialidades
          .split(",")
          .map(item => item.trim())
          .filter(item => item);
      }

      const result = await updateProfile(data);
      
      if (result.success && onSuccess) {
        onSuccess(result.user);
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

      const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Simulação de upload - em um ambiente real, você faria upload para um servidor
    const reader = new FileReader();
    reader.onload = (event) => {
      setValue("fotoPerfil", event.target.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Gerencia a seleção de dias da semana
  const handleDayToggle = (day) => {
    const currentDays = watch("horarioTrabalho.diasDisponiveis") || [];
    
    if (currentDays.includes(day)) {
      // Remove o dia se já estiver selecionado
      setValue(
        "horarioTrabalho.diasDisponiveis",
        currentDays.filter((d) => d !== day)
      );
    } else {
      // Adiciona o dia se não estiver selecionado
      setValue("horarioTrabalho.diasDisponiveis", [...currentDays, day]);
    }
  };

  const diasDaSemana = [
    { value: 0, label: "Dom" },
    { value: 1, label: "Seg" },
    { value: 2, label: "Ter" },
    { value: 3, label: "Qua" },
    { value: 4, label: "Qui" },
    { value: 5, label: "Sex" },
    { value: 6, label: "Sáb" }
  ];

  const selectedDays = watch("horarioTrabalho.diasDisponiveis") || [];

  const isBarbeiro = user?.tipo === "barbeiro";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Foto de perfil */}
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={fotoPerfil} />
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {getInitials(user?.nome)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex items-center">
          <label
            htmlFor="fotoPerfil"
            className="flex items-center justify-center cursor-pointer px-3 py-1.5 rounded-md border text-sm font-medium"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Alterar foto
              </>
            )}
            <input
              id="fotoPerfil"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Informações básicas */}
        <div className="space-y-2">
          <label
            htmlFor="nome"
            className="text-sm font-medium"
          >
            Nome completo
          </label>
          <Input
            id="nome"
            type="text"
            {...register("nome")}
            className={errors.nome ? "border-destructive" : ""}
          />
          {errors.nome && (
            <p className="text-sm text-destructive">{errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="telefone"
            className="text-sm font-medium"
          >
            Telefone
          </label>
          <Input
            id="telefone"
            type="tel"
            {...register("telefone")}
            className={errors.telefone ? "border-destructive" : ""}
          />
          {errors.telefone && (
            <p className="text-sm text-destructive">{errors.telefone.message}</p>
          )}
        </div>
      </div>

      {/* Campos específicos para barbeiro */}
      {isBarbeiro && (
        <>
          <div className="space-y-2">
            <label
              htmlFor="especialidades"
              className="text-sm font-medium"
            >
              Especialidades (separadas por vírgula)
            </label>
            <Textarea
              id="especialidades"
              {...register("especialidades")}
              placeholder="Corte moderno, Barba, Degradê..."
              className={errors.especialidades ? "border-destructive" : ""}
            />
            {errors.especialidades && (
              <p className="text-sm text-destructive">{errors.especialidades.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dias de trabalho</label>
            <div className="flex flex-wrap gap-2">
              {diasDaSemana.map((dia) => (
                <button
                  key={dia.value}
                  type="button"
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    selectedDays.includes(dia.value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => handleDayToggle(dia.value)}
                >
                  {dia.label}
                </button>
              ))}
            </div>
            {errors.horarioTrabalho?.diasDisponiveis && (
              <p className="text-sm text-destructive">
                {errors.horarioTrabalho.diasDisponiveis.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="inicio"
                className="text-sm font-medium"
              >
                Horário de início
              </label>
              <Input
                id="inicio"
                type="time"
                {...register("horarioTrabalho.inicio")}
                className={errors.horarioTrabalho?.inicio ? "border-destructive" : ""}
              />
              {errors.horarioTrabalho?.inicio && (
                <p className="text-sm text-destructive">{errors.horarioTrabalho.inicio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="fim"
                className="text-sm font-medium"
              >
                Horário de término
              </label>
              <Input
                id="fim"
                type="time"
                {...register("horarioTrabalho.fim")}
                className={errors.horarioTrabalho?.fim ? "border-destructive" : ""}
              />
              {errors.horarioTrabalho?.fim && (
                <p className="text-sm text-destructive">{errors.horarioTrabalho.fim.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Preferências de notificação */}
      <div className="space-y-4 pt-2">
        <h3 className="font-medium">Preferências de notificação</h3>

        <div className="flex items-center justify-between">
          <div>
            <label
              htmlFor="receberEmailMarketing"
              className="text-sm font-medium"
            >
              Receber emails de marketing
            </label>
            <p className="text-xs text-muted-foreground">
              Novidades, promoções e atualizações por email
            </p>
          </div>
          <Switch
            id="receberEmailMarketing"
            {...register("preferencias.receberEmailMarketing")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label
              htmlFor="receberSMS"
              className="text-sm font-medium"
            >
              Receber SMS
            </label>
            <p className="text-xs text-muted-foreground">
              Lembretes de agendamentos e promoções por SMS
            </p>
          </div>
          <Switch
            id="receberSMS"
            {...register("preferencias.receberSMS")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label
              htmlFor="receberPushNotification"
              className="text-sm font-medium"
            >
              Notificações push
            </label>
            <p className="text-xs text-muted-foreground">
              Lembretes e avisos no seu dispositivo
            </p>
          </div>
          <Switch
            id="receberPushNotification"
            {...register("preferencias.receberPushNotification")}
          />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="barbershop"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar alterações"
        )}
      </Button>
    </form>
  );
}