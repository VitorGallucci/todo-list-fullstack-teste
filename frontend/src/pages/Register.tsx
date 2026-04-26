import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "../services/api";

export function Register() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [confirmarSenha, setConfirmarSenha] = useState("");
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState(false);
	const [loading, setLoading] = useState(false);
	
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Prevenção contra múltiplos cliques
		if (loading || sucesso) return; 
		
		setErro("");

		if (senha !== confirmarSenha) {
			setErro("As senhas não coincidem.");
			return;
		}

		if (senha.length < 6) {
			setErro("A senha deve ter pelo menos 6 caracteres.");
			return;
		}

		setLoading(true);

		try {
			// 1. Cria a conta no backend
			await api.post("/auth/register", { email, senha });
			
			// 2. Faz o login automaticamente com os mesmos dados
			const loginResponse = await api.post("/auth/login", { email, senha });
			
			// 3. Salva o Token e os dados no navegador
			localStorage.setItem("@TodoList:token", loginResponse.data.token);
			localStorage.setItem("@TodoList:user", JSON.stringify(loginResponse.data.usuario));

			setSucesso(true);
			
			// 4. Redireciona direto para o Dashboard após um breve momento
			setTimeout(() => {
				navigate("/dashboard");
			}, 1500);

		} catch (error) {
			// Type check seguro para o erro do Axios
			if (error instanceof Error && 'response' in error) {
				const axiosError = error as any;
				setErro(axiosError.response?.data?.erro || "Erro ao criar conta. Tente novamente.");
			} else {
				setErro("Erro de conexão ao servidor. Tente novamente mais tarde.");
			}
		} finally {
			// Só remove o loading se não tiver tido sucesso, para não piscar o botão
			if (!sucesso) {
				setLoading(false);
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
				
				<div className="text-center mb-8">
					<div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
						<UserPlus className="text-white w-6 h-6" />
					</div>
					<h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
					<p className="text-gray-500 mt-2">Comece a organizar suas tarefas hoje mesmo.</p>
				</div>

				{erro && (
					<div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm transition-all border border-red-100">
						<AlertCircle className="w-5 h-5 flex-shrink-0" />
						<p>{erro}</p>
					</div>
				)}

				{/* Mensagem atualizada para refletir o auto-login */}
				{sucesso && (
					<div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm transition-all border border-green-100">
						<CheckCircle2 className="w-5 h-5 flex-shrink-0" />
						<p>Conta criada! Entrando automaticamente...</p>
					</div>
				)}

				<form onSubmit={handleRegister} className="space-y-5">
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
								disabled={loading || sucesso}
								className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
								placeholder="seu@email.com"
							/>
						</div>
					</div>

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
								disabled={loading || sucesso}
								className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="password"
								value={confirmarSenha}
								onChange={(e) => setConfirmarSenha(e.target.value)}
								required
								disabled={loading || sucesso}
								className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
								placeholder="••••••••"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading || sucesso}
						className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								<span>Criando conta...</span>
							</>
						) : (
							"Criar minha conta"
						)}
					</button>
				</form>

				<p className="text-center text-sm text-gray-600 mt-6">
					Já tem uma conta?{" "}
					<Link to="/login" className="text-green-600 font-medium hover:underline">
						Faça login
					</Link>
				</p>
			</div>
		</div>
	);
}