import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

// Inicia as variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();

// Permite o uso de CORS e o parsing de JSON nas requisições
// Libera o cors vindo de qualquer origem para o teste
app.use(cors());

// Tendo um dominio/ip fixo e/ou conhecido deve se limitar a origens conhecidas como no exemplo abaixo
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));


app.use(express.json());

app.use("/api/auth", authRoutes); // Define as rotas de autenticação
app.use("/api/todos", todoRoutes); // Define as rotas de tarefas

// Rota para teste
app.get('/', (req, res) => {
  res.send('API Todo List rodando!');
});

// Exporta o app "limpo", sem ligar banco ou porta para facilitar os testes
export default app;