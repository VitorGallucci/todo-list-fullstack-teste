// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { api } from "../services/api";

interface Todo {
	id: string;
	titulo: string;
	concluida: boolean;
	dataCriacao?: string;
}

export function Dashboard() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [novoTitulo, setNovoTitulo] = useState("");
	
	// Estados de interface (UX)
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [erroGlobal, setErroGlobal] = useState<string | null>(null);
	
	const navigate = useNavigate();

	useEffect(() => {
		buscarTarefas();
	}, []);

	const buscarTarefas = async () => {
		try {
			setErroGlobal(null);
			const response = await api.get("/todos");
			setTodos(response.data);
		} catch (error) {
			console.error("Erro ao buscar tarefas", error);
			setErroGlobal("Não foi possível carregar as tarefas.");
			handleLogout();
		} finally {
			setLoading(false);
		}
	};

	const handleCriarTarefa = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!novoTitulo.trim() || isSubmitting) return;

		try {
			setIsSubmitting(true);
			setErroGlobal(null);
			const response = await api.post("/todos", { titulo: novoTitulo });
			setTodos([response.data, ...todos]);
			setNovoTitulo("");
		} catch (error) {
			console.error("Erro ao criar tarefa", error);
			setErroGlobal("Erro ao criar a tarefa. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAlternarStatus = async (id: string, concluidaAtual: boolean) => {
		try {
			const response = await api.put(`/todos/${id}`, { concluida: !concluidaAtual });
			setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
		} catch (error) {
			console.error("Erro ao atualizar tarefa", error);
			setErroGlobal("Erro ao atualizar o status da tarefa.");
		}
	};

	const handleDeletarTarefa = async (id: string) => {
		try {
			await api.delete(`/todos/${id}`);
			setTodos(todos.filter(todo => todo.id !== id));
		} catch (error) {
			console.error("Erro ao deletar tarefa", error);
			setErroGlobal("Erro ao deletar a tarefa.");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("@TodoList:token");
		localStorage.removeItem("@TodoList:user");
		navigate("/login");
	};

	// Helper para formatar a data de forma limpa
	const formatarData = (dataIso?: string) => {
		if (!dataIso) return "";
		return new Date(dataIso).toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 py-10 px-4">
			<div className="max-w-3xl mx-auto">
				
				<header className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
						<p className="text-gray-500 mt-1">Organize seu dia com foco.</p>
					</div>
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
					>
						<LogOut className="w-5 h-5" />
						<span className="font-medium">Sair</span>
					</button>
				</header>

				{/* Alerta de Erro Global */}
				{erroGlobal && (
					<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
						{erroGlobal}
					</div>
				)}

				<form onSubmit={handleCriarTarefa} className="flex gap-3 mb-8">
					<input
						type="text"
						value={novoTitulo}
						onChange={(e) => setNovoTitulo(e.target.value)}
						placeholder="O que você precisa fazer hoje?"
						disabled={isSubmitting}
						className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm disabled:bg-gray-100"
					/>
					<button
						type="submit"
						disabled={!novoTitulo.trim() || isSubmitting}
						className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[140px] justify-center"
					>
						{isSubmitting ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<>
								<Plus className="w-5 h-5" />
								<span>Adicionar</span>
							</>
						)}
					</button>
				</form>

				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
					{loading ? (
						<div className="p-12 flex justify-center">
							<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
						</div>
					) : todos.length === 0 ? (
						<div className="p-12 text-center">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<CheckCircle2 className="w-8 h-8 text-gray-400" />
							</div>
							<p className="text-gray-500 font-medium">Você ainda não tem tarefas.</p>
							<p className="text-gray-400 text-sm mt-1">Adicione uma tarefa acima para começar.</p>
						</div>
					) : (
						<ul className="divide-y divide-gray-100">
							{todos.map((todo) => (
								<li
									key={todo.id}
									className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
								>
									<div 
										className="flex items-center gap-4 flex-1 cursor-pointer"
										onClick={() => handleAlternarStatus(todo.id, todo.concluida)}
									>
										{todo.concluida ? (
											<CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
										) : (
											<Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
										)}
										
										{/* Agrupamento do Título e da Data em Coluna */}
										<div className="flex flex-col">
											<span className={`text-lg transition-all ${todo.concluida ? "text-gray-400 line-through" : "text-gray-700"}`}>
												{todo.titulo}
											</span>
											
											{todo.dataCriacao && (
												<span className="text-xs text-gray-400 mt-0.5">
													Criado em: {formatarData(todo.dataCriacao)}
												</span>
											)}
										</div>
									</div>

									<button
										onClick={() => handleDeletarTarefa(todo.id)}
										className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
										title="Excluir tarefa"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}