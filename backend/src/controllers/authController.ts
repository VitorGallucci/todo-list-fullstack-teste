import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Função para registrar um novo usuário
export const register = async (req: Request, res: Response): Promise <void> => {
    try {
        // Extrai email e senha do corpo da requisição
        const { email, senha } = req.body;

        // Verifica se o usuário já existe, caso exista, retorna um erro
        const userExists = await User.findOne({ email});
        if (userExists) {
            res.status(400).json({ erro: "Usuário já existe ou o e-mail já está em uso" });
            return;
        }

        // Gera um salt e hash para a senha
        const salt = await bcrypt.genSalt (10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria um novo usuário com o email e o hash da senha
        const newUser = await User.create({
            email,
            senha: hashedPassword
        })

        // Retorna uma resposta de sucesso
        res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        // Em caso de erro, retorna uma resposta de erro
        res.status(500).json({ erro: "Erro ao registrar usuário" });
    }
};

// Função para autenticar um usuário e gerar um token JWT
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extrai email e senha do corpo da requisição
        const { email, senha } = req.body;

        // Verifica se o usuário existe pelo email, caso contrário, retorna um erro
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ erro: "E-mail incorreto" });
            return;
        }

        // Compara a senha fornecida com o hash armazenado, caso não corresponda, retorna um erro
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            res.status(400).json({ erro: "Senha incorreta" });
            return;
        }

        // Gera um token JWT com o ID do usuário, expira em 1 dia
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // Retorna o token e as informações do usuário
        res.json({ token, usuario: { id: user.id, email: user.email } });
    } catch (error) {
        // Em caso de erro, retorna uma resposta de erro
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
};