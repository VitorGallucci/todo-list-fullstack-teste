import { Router } from "express";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controllers/todoController.js";
import { protect } from "../middlewares/authMiddleware.js";

// Cria um roteador para as rotas de tarefas
const router = Router();

router.use(protect); // Aplica o middleware de proteção a todas as rotas

// Rotas para as operações de tarefas
router.post("/", createTodo);
router.get("/", getTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

// Exporta o roteador para ser usado na aplicação principal
export default router;