import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    setErro("");
    setLoading(true);

    try {
      // Chama a nossa rota de login no backend
      const response = await api.post("/auth/login", { email, senha });
      
      // Salva o token JWT e os dados do usuário no LocalStorage (memória do navegador)
      localStorage.setItem("@TodoList:token", response.data.token);
      localStorage.setItem("@TodoList:user", JSON.stringify(response.data.usuario));

      // Redireciona para o Dashboard
      navigate("/dashboard");
    } catch (error: any) {
      // Se o backend retornar erro (ex: senha errada), mostramos na tela
      setErro(error.response?.data?.erro || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Bem-vindo de volta</h1>
          <p className="text-gray-500 mt-2">Acesse suas tarefas e organize seu dia.</p>
        </div>

        {erro && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
            <AlertCircle className="w-4 h-4" />
            <p>{erro}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Campo de Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar na minha conta"}
          </button>
        </form>

        {/* Link para Cadastro */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Ainda não tem uma conta?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  );
}