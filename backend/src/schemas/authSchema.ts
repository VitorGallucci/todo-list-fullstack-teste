import { z } from "zod";

// Schema para REGISTRO (exige regras de criação, como tamanho mínimo de senha)
export const registerSchema = z.object({
  email: z.string({ error: "E-mail é obrigatório" }).email({ message: "E-mail inválido" }),
  senha: z.string({ error: "Senha é obrigatória" }).min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

// Schema para LOGIN (apenas verifica se os campos foram preenchidos de forma válida)
export const loginSchema = z.object({
  email: z.string({ error: "E-mail é obrigatório" }).email({ message: "E-mail inválido" }),
  senha: z.string({ error: "Senha é obrigatória" }).min(1, { message: "A senha é obrigatória" }), 
});