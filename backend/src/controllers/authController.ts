import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

// Função para registrar um novo usuário
export const register = async (req: Request, res: Response): Promise <void> => {
    try {
        // Valida email e senha
        const validacao = registerSchema.safeParse(req.body);
        
        if (!validacao.success) {
            const mensagem = validacao.error.issues?.[0]?.message ?? "Dados inválidos";
            res.status(400).json({ erro: mensagem });
            return;
        }

        const { email, senha } = validacao.data;

        // Verifica se o usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ erro: "Usuário já existe ou o e-mail já está em uso" });
            return;
        }

        // Cria o hash da senha
        const salt = await bcrypt.genSalt (10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria o novo usuário no banco de dados
        const newUser = await User.create({
            email,
            senha: hashedPassword
        })

        // Retorna os dados do usuário criado e uma mensagem de sucesso
        res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        // Retorna um erro genérico em caso de falha
        res.status(500).json({ erro: "Erro ao registrar usuário" });
    }
};

// Função para autenticar um usuário e gerar um token JWT
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // Valida os dados de entrada
        const validacao = loginSchema.safeParse(req.body);
        
        if (!validacao.success) {
            const mensagem = validacao.error.issues?.[0]?.message ?? "Dados inválidos";
            res.status(400).json({ erro: mensagem });
            return;
        }

        const { email, senha } = validacao.data;

        // Busca o usuário pelo e-mail
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ erro: "E-mail ou senha incorretos" });
            return;
        }

        // Verifica se a senha está correta
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            res.status(400).json({ erro: "E-mail ou senha incorretos" });
            return;
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // Retorna o token e os dados do usuário
        res.json({ token, usuario: { id: user.id, email: user.email } });
    } catch (error) {
        // Retorna um erro genérico em caso de falha
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
};