import type { Response } from "express";
import type { authRequest } from "../middlewares/authMiddleware.js";
import { Todo } from "../models/Todo.js";

// Função para criar uma nova tarefa
export const createTodo = async (req: authRequest, res: Response): Promise<void> => {
    try {
        const { titulo } = req.body; // Extrai o título do corpo da requisição
        
        // Verifica se o usuário está autenticado, caso contrário, retorna um erro
        if (!req.usuarioId) {
            res.status(401).json({ erro: "Usuário não autenticado" });
            return;
        }
        
        // Valida o título da tarefa, caso seja inválido, retorna um erro
        if (!titulo || typeof titulo !== "string") {
            res.status(400).json({ erro: "Título é obrigatório e deve ser um texto" });
            return;
        }
        
        // Cria a tarefa associada ao usuário autenticado
        const todo = await Todo.create({
            titulo,
            usuarioId: req.usuarioId
        });

        res.status(201).json(todo); // Retorna a tarefa criada
    } catch (error) {
        // Em caso de erro, retorna uma resposta de erro
        res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
};

// Função para buscar as tarefas do usuário autenticado
export const getTodos = async (req: authRequest, res: Response): Promise<void> => {
  try {
    // Verifica se o usuário está autenticado, caso contrário, retorna um erro
    if (!req.usuarioId) {
      res.status(401).json({ erro: "Usuário não autenticado" });
      return;
    }

    // Busca as tarefas do usuário autenticado, ordenando da mais recente para a mais antiga
    const todos = await Todo.find({ usuarioId: req.usuarioId }).sort({ dataCriacao: -1 }); 
    
    res.status(200).json(todos); // Retorna as tarefas encontradas
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
};

// Função para atualizar o status de conclusão de uma tarefa
export const updateTodo = async (req: authRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extrai o ID da tarefa dos parâmetros da rota
    const { concluida } = req.body; // Extrai o status de conclusão do corpo da requisição

    // Verifica se o usuário está autenticado, caso contrário, retorna um erro
    if (!req.usuarioId) {
      res.status(401).json({ erro: "Usuário não autenticado" });
      return;
    }

    // Valida o status de conclusão, caso seja inválido, retorna um erro
    if (typeof concluida !== 'boolean') {
      res.status(400).json({ erro: "O status 'concluida' é obrigatório e deve ser um booleano" });
      return;
    }

    // Procura a tarefa pelo ID e garante que ela pertence ao usuário logado
    const todo = await Todo.findOneAndUpdate(
      { _id: id, usuarioId: req.usuarioId },
      { concluida },
      { returnDocument: 'after' }
    );

    // Se a tarefa não for encontrada ou não pertencer ao usuário, retorna um erro
    if (!todo) {
      res.status(404).json({ erro: "Tarefa não encontrada ou não pertence a este usuário" });
      return;
    }

    res.status(200).json(todo); // Retorna a tarefa atualizada
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
};

// Função para excluir uma tarefa
export const deleteTodo = async (req: authRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extrai o ID da tarefa dos parâmetros da rota

    // Verifica se o usuário está autenticado, caso contrário, retorna um erro
    if (!req.usuarioId) {
      res.status(401).json({ erro: "Usuário não autenticado" });
      return;
    }

    // Procura a tarefa pelo ID e garante que ela pertence ao usuário logado
    const todo = await Todo.findOneAndDelete({ _id: id, usuarioId: req.usuarioId });
    // Se a tarefa não for encontrada ou não pertencer ao usuário, retorna um erro
    if (!todo) {
      res.status(404).json({ erro: "Tarefa não encontrada ou não pertence a este usuário" });
      return;
    }

    res.status(200).json({ mensagem: "Tarefa removida com sucesso" }); // Retorna uma mensagem de sucesso
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro
    res.status(500).json({ erro: "Erro ao deletar tarefa" });
  }
};