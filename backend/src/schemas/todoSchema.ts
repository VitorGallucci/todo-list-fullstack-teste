import { z } from "zod";

export const createTodoSchema = z.object({
	titulo: z.string().min(1, "O título é obrigatório")
});

export const updateTodoSchema = z.object({
	titulo: z.string().min(1, "O título não pode ser vazio").optional(),
	concluida: z.boolean().optional()
});