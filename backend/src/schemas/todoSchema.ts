import { z } from "zod";

export const createTodoSchema = z.object({
  titulo: z.string({ error: "Título deve ser um texto" })
    .min(1, { message: "O título não pode estar vazio" }),
});

export const updateTodoSchema = z.object({
  concluida: z.boolean({ error: "O status deve ser um booleano" }),
});