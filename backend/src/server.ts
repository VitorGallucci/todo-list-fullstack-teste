import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

// Inicia as variáveis de ambiente
dotenv.config();

// Conecta ao banco de dados
connectDB();

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 5000;

// Permite o uso de CORS e o parsing de JSON nas requisições
app.use(cors());
app.use(express.json());

// Define as rotas de autenticação
app.use("/api/auth", authRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Todo List rodando!');
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});