import request from "supertest";
import app from "../src/app.js";
import { connectMemoryDB, closeMemoryDB, clearMemoryDB } from "./setup.js";
import { beforeAll, afterAll, afterEach, it, describe, expect } from '@jest/globals';

beforeAll(async () => await connectMemoryDB());
afterEach(async () => await clearMemoryDB());
afterAll(async () => await closeMemoryDB());

describe("Testes de autenticação", () => {
    it("Deve registrar um novo usuário", async () => {
        // Envia uma requisição POST para registrar um novo usuário
        const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "teste@teste.com", senha: "senha123" });

        // Verifica se o status da resposta é 201 (Criado) e se a mensagem e email retornados estão corretos
        expect(res.status).toBe(201);
        expect(res.body.mensagem).toBe("Usuário criado com sucesso!");
        expect(res.body.usuario.email).toBe("teste@teste.com");
    });

    it("Não deve permitir registrar um usuário com email já existente", async () => {
        // Arrange: Primeiro cria um usuário
        await request(app)
        .post("/api/auth/register")
        .send({email: "duplicado@teste.com", senha: "senha123"});

        // Act: Tenta criar outro usuário com o mesmo email
        const response = await request(app)
        .post("/api/auth/register")
        .send({email: "duplicado@teste.com", senha: "senha123"});

        // Assert: Verifica se o status é 400 e a mensagem de erro é a esperada
        expect(response.status).toBe(400);
        expect(response.body.erro).toBe("Usuário já existe ou o e-mail já está em uso");
    });
});