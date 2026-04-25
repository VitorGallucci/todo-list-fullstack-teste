// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { api } from "../services/api";

// Definimos o "formato" da tarefa para o TypeScript nos ajudar
interface Todo {
  id: string;
  titulo: string;
  concluida: boolean;
}

export function Dashboard() {
  // Estados da nossa aplicação
  const [todos, setTodos] = useState<Todo[]>([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // useEffect: Roda essa função assim que a tela abre
  useEffect(() => {
    buscarTarefas();
  }, []);

  // 1. BUSCAR TAREFAS (GET)
  const buscarTarefas = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
      // Se der erro 401 (Não autorizado), o token expirou. Mandamos pro login.
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // 2. CRIAR TAREFA (POST)
  const handleCriarTarefa = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita recarregar a página
    if (!novoTitulo.trim()) return; // Não deixa criar tarefa vazia

    try {
      const response = await api.post("/todos", { titulo: novoTitulo });
      // Adiciona a nova tarefa no INÍCIO da lista que já temos na tela
      setTodos([response.data, ...todos]);
      setNovoTitulo(""); // Limpa o input
    } catch (error) {
      console.error("Erro ao criar tarefa", error);
    }
  };

  // 3. ATUALIZAR TAREFA (PUT)
  const handleAlternarStatus = async (id: string, concluidaAtual: boolean) => {
    try {
      const response = await api.put(`/todos/${id}`, { concluida: !concluidaAtual });
      
      // Atualiza apenas a tarefa clicada na nossa lista da tela
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (error) {
      console.error("Erro ao atualizar tarefa", error);
    }
  };

  // 4. DELETAR TAREFA (DELETE)
  const handleDeletarTarefa = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      // Filtra a lista removendo a tarefa que acabamos de deletar
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Erro ao deletar tarefa", error);
    }
  };

  // SAIR DA CONTA (LOGOUT)
  const handleLogout = () => {
    localStorage.removeItem("@TodoList:token");
    localStorage.removeItem("@TodoList:user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Cabeçalho */}
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

        {/* Formulário de Nova Tarefa */}
        <form onSubmit={handleCriarTarefa} className="flex gap-3 mb-8">
          <input
            type="text"
            value={novoTitulo}
            onChange={(e) => setNovoTitulo(e.target.value)}
            placeholder="O que você precisa fazer hoje?"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!novoTitulo.trim()} // Desabilita se estiver vazio
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar</span>
          </button>
        </form>

        {/* Lista de Tarefas */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Carregando suas tarefas...</div>
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
                  {/* Botão de Check / Uncheck e Título */}
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleAlternarStatus(todo.id, todo.concluida)}
                  >
                    {todo.concluida ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                    )}
                    
                    <span className={`text-lg transition-all ${todo.concluida ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {todo.titulo}
                    </span>
                  </div>

                  {/* Botão de Deletar */}
                  <button
                    onClick={() => handleDeletarTarefa(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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