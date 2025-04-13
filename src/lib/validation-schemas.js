import { z } from "zod";

// Esquema para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(1, { message: "Senha é obrigatória" }),
  estabelecimentoUrl: z.string().optional(),
});

// Esquema para registro de usuário
export const registerSchema = z.object({
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
  tipo: z
    .string()
    .default("cliente"),
  estabelecimentoUrl: z
    .string()
    .optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "As senhas não coincidem",
  path: ["passwordConfirm"],
});

// Esquema para registro de estabelecimento
export const establishmentSchema = z.object({
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

// Esquema para agendamentos
export const appointmentSchema = z.object({
  barbeiro: z.string({ required_error: "Selecione um barbeiro" }),
  servicos: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  data: z.date({ required_error: "Selecione uma data" }),
  horario: z.string({ required_error: "Selecione um horário" }),
  notasCliente: z.string().optional(),
});

// Esquema para serviços
export const serviceSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome não deve exceder 100 caracteres" }),
  descricao: z
    .string()
    .max(500, { message: "Descrição não deve exceder 500 caracteres" })
    .optional(),
  preco: z
    .number({ message: "Preço deve ser um número" })
    .min(0, { message: "Preço não pode ser negativo" }),
  duracao: z
    .number({ message: "Duração deve ser um número" })
    .min(1, { message: "Duração mínima é 1 minuto" }),
  categoria: z
    .string()
    .optional(),
  destaque: z
    .boolean()
    .default(false),
  ordem: z
    .number()
    .int()
    .default(0),
  estabelecimentoId: z
    .string({ required_error: "ID do estabelecimento é obrigatório" })
});

// Esquema para promoções
export const promotionSchema = z.object({
  precoPromocional: z
    .number({ message: "Preço promocional deve ser um número" })
    .min(0, { message: "Preço não pode ser negativo" }),
  dataInicio: z
    .date({ message: "Data de início inválida" }),
  dataFim: z
    .date({ message: "Data de fim inválida" }),
  descricaoPromocao: z
    .string()
    .max(200, { message: "Descrição não deve exceder 200 caracteres" })
    .optional()
}).refine((data) => data.dataFim > data.dataInicio, {
  message: "A data de término deve ser posterior à data de início",
  path: ["dataFim"]
});

// Esquema para perfil de usuário
export const profileSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome não deve exceder 100 caracteres" }),
  telefone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 dígitos" })
    .max(15, { message: "Telefone não deve exceder 15 caracteres" }),
  fotoPerfil: z
    .string()
    .optional(),
  especialidades: z.array(z.string()).optional(),
  horarioTrabalho: z.object({
    inicio: z.string().optional(),
    fim: z.string().optional(),
    diasDisponiveis: z.array(z.number()).optional()
  }).optional(),
  preferencias: z.object({
    receberEmailMarketing: z.boolean().optional(),
    receberSMS: z.boolean().optional(),
    receberPushNotification: z.boolean().optional()
  }).optional()
});

// Esquema para alteração de senha
export const passwordChangeSchema = z.object({
  senhaAtual: z
    .string()
    .min(1, { message: "Senha atual é obrigatória" }),
  novaSenha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmarNovaSenha: z
    .string()
    .min(1, { message: "Confirmação de senha é obrigatória" })
}).refine((data) => data.novaSenha === data.confirmarNovaSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarNovaSenha"]
});

// Esquema para avaliação
export const reviewSchema = z.object({
  nota: z
    .number()
    .min(1, { message: "Nota mínima é 1" })
    .max(5, { message: "Nota máxima é 5" }),
  comentario: z
    .string()
    .max(500, { message: "Comentário não deve exceder 500 caracteres" })
    .optional()
});