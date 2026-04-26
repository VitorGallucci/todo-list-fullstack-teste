import request from "supertest";
import app from "../src/app.js"; // Importa a instância do servidor Express
import { connectMemoryDB, closeMemoryDB, clearMemoryDB } from "./setup.js"; // Helpers de banco em memória
import { beforeAll, afterAll, afterEach, it, describe, expect } from '@jest/globals';
import { Todo } from "../src/models/Todo.js"; // Modelo de Tarefa
import { User } from "../src/models/User.js"; // Modelo de Usuário

describe("Testes de Integração - Módulo de Tarefas (Todo)", () => {
	let token: string;    // Armazenará o token JWT para autenticar as requisições
	let usuarioId: string; // Armazenará o ID do usuário dono das tarefas

	// Configurações para conectar ao banco em memória antes dos testes, limpar os dados após cada teste e fechar a conexão ao final
	beforeAll(async () => {
		await connectMemoryDB(); // Conecta ao MongoDB temporário

		const credenciais = { email: "dev_vitor@teste.com", senha: "password123" };
		
		// 1. Registra um usuário real para testar o vínculo com as tarefas
		const registro = await request(app).post("/api/auth/register").send(credenciais);
		usuarioId = registro.body.usuario.id;

		// 2. Realiza o login para obter o token que será usado no Header Authorization
		const login = await request(app).post("/api/auth/login").send(credenciais);
		token = login.body.token;
	});

	afterEach(async () => {
		await clearMemoryDB(); // Limpa as collections sem fechar a conexão
	});

	afterAll(async () => {
		await closeMemoryDB(); // Encerra o servidor de banco em memória
	});

	// Testes de criação (POST)
	describe("POST /api/todos - Criar Tarefa", () => {
		it("Deve criar uma tarefa válida quando o usuário está autenticado", async () => {
			const res = await request(app)
				.post("/api/todos")
				.set("Authorization", `Bearer ${token}`) // Envia o token no formato Bearer
				.send({ titulo: "Estudar Design Patterns" });

			expect(res.status).toBe(201); // Verifica se o status é 'Created'
			expect(res.body.titulo).toBe("Estudar Design Patterns");
			expect(res.body.concluida).toBe(false); // Tarefas devem nascer não concluídas
			expect(res.body.usuarioId).toBe(usuarioId); // Verifica o vínculo com o autor
		});

		it("Deve impedir a criação se o título estiver vazio (Validação Zod)", async () => {
			const res = await request(app)
				.post("/api/todos")
				.set("Authorization", `Bearer ${token}`)
				.send({ titulo: "" }); // Título inválido conforme o schema

			expect(res.status).toBe(400); // Bad Request
			expect(res.body).toHaveProperty("erro");
		});
	});

	// Testes de leitura (GET)
	describe("GET /api/todos - Listar Tarefas", () => {
		it("Deve listar apenas as tarefas pertencentes ao usuário logado", async () => {
			// Insere uma tarefa diretamente no banco para o teste
			await Todo.create({ titulo: "Tarefa do Vitor", usuarioId });

			const res = await request(app)
				.get("/api/todos")
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body).toHaveLength(1); // Espera-se apenas a tarefa criada acima
			expect(res.body[0].titulo).toBe("Tarefa do Vitor");
		});
	});

	// Testes de atualização (PUT)
	describe("PUT /api/todos/:id - Atualizar Tarefa", () => {
		it("Deve marcar uma tarefa como concluída", async () => {
			// Cria a tarefa inicial
			const tarefa = await Todo.create({ titulo: "Ler documentação", usuarioId });

			const res = await request(app)
				.put(`/api/todos/${tarefa._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ concluida: true });

			expect(res.status).toBe(200);
			expect(res.body.concluida).toBe(true);
		});

		it("Deve atualizar o título de uma tarefa não concluída", async () => {
			// Cria a tarefa inicial não concluída
			const tarefa = await Todo.create({ titulo: "Título original", usuarioId, concluida: false });

			const res = await request(app)
				.put(`/api/todos/${tarefa._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ titulo: "Título atualizado" });

			expect(res.status).toBe(200);
			expect(res.body.titulo).toBe("Título atualizado");
		});

		it("Não deve permitir a edição do título de uma tarefa concluída", async () => {
			// Cria uma tarefa que já nasce concluída
			const tarefa = await Todo.create({ titulo: "Tarefa finalizada", usuarioId, concluida: true });

			const res = await request(app)
				.put(`/api/todos/${tarefa._id}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ titulo: "Tentativa de burlar a regra" });

			expect(res.status).toBe(400); // Retorna erro de requisição inválida
			expect(res.body.erro).toBe("Não é permitido editar o título de uma tarefa concluída");
		});

		it("Deve retornar 404 ao tentar atualizar uma tarefa que não existe ou é de outro usuário", async () => {
			// Gera um ID aleatório que não corresponde a nenhuma tarefa existente
			const idFalso = "65f1a5b6e4b0a1a2b3c4d5e6";

			const res = await request(app)
				.put(`/api/todos/${idFalso}`)
				.set("Authorization", `Bearer ${token}`)
				.send({ concluida: true });

			expect(res.status).toBe(404);
			expect(res.body.erro).toContain("não encontrada");
		});
	});

	// Teste de exclusão (DELETE)
	describe("DELETE /api/todos/:id - Remover Tarefa", () => {
		it("Deve deletar uma tarefa existente com sucesso", async () => {
			const tarefa = await Todo.create({ titulo: "Remover esta tarefa", usuarioId });

			const res = await request(app)
				.delete(`/api/todos/${tarefa._id}`)
				.set("Authorization", `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body.mensagem).toBe("Tarefa removida com sucesso");

			// Verifica se a tarefa realmente foi removida do banco
			const tarefaNoBanco = await Todo.findById(tarefa._id);
			expect(tarefaNoBanco).toBeNull();
		});
	});
});