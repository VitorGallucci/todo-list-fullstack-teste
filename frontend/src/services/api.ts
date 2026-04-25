import axios from "axios";

// Cria uma instância do Axios com a URL base da API
export const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Intercepta as requisições para adicionar o token de autenticação, se disponível
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("@TodoList:token"); // Obtém o token do localStorage

    // Se o token existir, adiciona ao cabeçalho de autorização
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Retorna a configuração da requisição
});