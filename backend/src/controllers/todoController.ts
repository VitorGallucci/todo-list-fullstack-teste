import type { Response } from "express";
import type { authRequest } from "../middlewares/authMiddleware.js";
import { Todo } from "../models/Todo.js";
import { createTodoSchema, updateTodoSchema } from "../schemas/todoSchema.js";

// Função para criar uma nova tarefa
export const createTodo = async (req: authRequest, res: Response): Promise<void> => {
	try {
		// Valida o corpo da requisição
		const validacao = createTodoSchema.safeParse(req.body);

		if (!validacao.success) {
			const mensagem = validacao.error.issues?.[0]?.message ?? "Dados inválidos";
			res.status(400).json({ erro: mensagem });
			return;
		}

		// Extrai o título dos dados validados
		const { titulo } = validacao.data;

		// Verifica se o usuário está autenticado
		if (!req.usuarioId) {
			res.status(401).json({ erro: "Usuário não autenticado" });
			return;
		}

		// Cria a tarefa associada ao usuário autenticado
		const todo = await Todo.create({
			titulo,
			usuarioId: req.usuarioId
		});

		// Retorna a tarefa criada com status 201
		res.status(201).json(todo);
	} catch (error) {
		// Retorna um erro genérico em caso de falha
		res.status(500).json({ erro: "Erro ao criar tarefa" });
	}
};

// Função para buscar as tarefas do usuário autenticado
export const getTodos = async (req: authRequest, res: Response): Promise<void> => {
	try {
		// Verifica se o usuário está autenticado
		if (!req.usuarioId) {
			res.status(401).json({ erro: "Usuário não autenticado" });
			return;
		}

		// Busca as tarefas do usuário, ordenadas por data de criação decrescente
		const todos = await Todo.find({ usuarioId: req.usuarioId }).sort({ dataCriacao: -1 });
		
		// Retorna a lista de tarefas encontradas
		res.status(200).json(todos);
	} catch (error) {
		// Retorna um erro genérico em caso de falha
		res.status(500).json({ erro: "Erro ao buscar tarefas" });
	}
};

// Função para atualizar o status de conclusão de uma tarefa
export const updateTodo = async (req: authRequest, res: Response): Promise<void> => {
	try {
		// Extrai o ID da tarefa dos parâmetros da URL
		const { id } = req.params;

		// Valida o status de conclusão com Zod
		const validacao = updateTodoSchema.safeParse(req.body);

		if (!validacao.success) {
			const mensagem = validacao.error.issues?.[0]?.message ?? "Dados inválidos";
			res.status(400).json({ erro: mensagem });
			return;
		}

		// Extrai o novo status de conclusão
		const { concluida } = validacao.data;

		// Verifica se o usuário está autenticado
		if (!req.usuarioId) {
			res.status(401).json({ erro: "Usuário não autenticado" });
			return;
		}

		// Atualiza a tarefa se ela pertencer ao usuário
		const todo = await Todo.findOneAndUpdate(
			{ _id: id, usuarioId: req.usuarioId },
			{ concluida },
			{ returnDocument: 'after' }
		);

		// Verifica se a tarefa foi encontrada e atualizada
		if (!todo) {
			res.status(404).json({ erro: "Tarefa não encontrada ou não pertence a este usuário" });
			return;
		}

		// Retorna a tarefa atualizada
		res.status(200).json(todo);
	} catch (error) {
		// Retorna um erro genérico em caso de falha
		res.status(500).json({ erro: "Erro ao atualizar tarefa" });
	}
};

// Função para excluir uma tarefa
export const deleteTodo = async (req: authRequest, res: Response): Promise<void> => {
	try {
		// Extrai o ID da tarefa dos parâmetros da URL
		const { id } = req.params;

		// Verifica se o usuário está autenticado
		if (!req.usuarioId) {
			res.status(401).json({ erro: "Usuário não autenticado" });
			return;
		}

		// Exclui a tarefa se ela pertencer ao usuário
		const todo = await Todo.findOneAndDelete({ _id: id, usuarioId: req.usuarioId });
		
		// Verifica se a tarefa existia e foi removida
		if (!todo) {
			res.status(404).json({ erro: "Tarefa não encontrada ou não pertence a este usuário" });
			return;
		}

		// Retorna mensagem de confirmação de exclusão
		res.status(200).json({ mensagem: "Tarefa removida com sucesso" });
	} catch (error) {
		// Retorna um erro genérico em caso de falha
		res.status(500).json({ erro: "Erro ao deletar tarefa" });
	}
};