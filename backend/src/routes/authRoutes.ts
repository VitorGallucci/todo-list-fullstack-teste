import { Router } from "express";
import { register, login } from "../controllers/authController.js";

// Cria um roteador para as rotas de autenticação
const router = Router();

// Rota para registrar um novo usuário
router.post("/register", register);

// Rota para autenticar um usuário
router.post("/login", login);

// Exporta o roteador para ser usado na aplicação principal
export default router;