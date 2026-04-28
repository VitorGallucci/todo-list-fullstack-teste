# 📝 Todo List Fullstack - Teste Técnico

Esta aplicação é a resolução do teste técnico para a vaga de Desenvolvedor Fullstack Jr. para o Grupo Energia. Trata-se de um sistema de gerenciamento de tarefas (Todo List) que permite registro de usuários, autenticação via JWT e um CRUD completo de tarefas vinculado a cada perfil.

O projeto foi construído atendendo a todos os requisitos obrigatórios e englobando os diferenciais solicitados.

## 🌐 Acesso Online (Deploy)

A aplicação está hospedada e pronta para uso. 

* **Frontend (Vercel):** [https://todo-list-fullstack-teste.vercel.app/](https://todo-list-fullstack-teste.vercel.app/)
* **Backend API (Render):** [https://todo-list-backend-vitor.onrender.com](https://todo-list-backend-vitor.onrender.com)

> **Aviso Importante sobre o Backend:** A API está hospedada na camada gratuita do Render. Por padrão, o serviço entra em "hibernação" após 15 minutos sem receber requisições. Ao realizar o primeiro acesso (como criar uma conta ou tentar fazer login), **a primeira resposta pode levar cerca de 50 segundos** enquanto o servidor é reativado. Após esse carregamento inicial, a aplicação funcionará em velocidade normal.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React com Vite (escolhido pela velocidade de build e HMR otimizado)
* TypeScript (para tipagem estática e prevenção de erros em tempo de compilação)
* Tailwind CSS (para estilização responsiva, rápida e padronizada)
* Axios (cliente HTTP)
* React Router Dom (navegação)
* Lucide React (ícones)

**Backend:**
* Node.js com Express
* TypeScript
* MongoDB com Mongoose (banco de dados NoSQL)
* JSON Web Token (JWT) (para autenticação segura)
* Bcryptjs (para hash de senhas)
* Zod (para validação de schemas)

**DevOps & Ferramentas:**
* Docker e Docker Compose (para padronização de ambiente)
* Jest (para testes unitários e de integração)

---

## 🏗️ Arquitetura e Estrutura do Projeto (backend)

O backend foi estruturado utilizando o padrão **MVC (Model-View-Controller)** adaptado para APIs (onde a View é o frontend consumindo o JSON).

* **`src/models/`**: Definição dos schemas do MongoDB (User e Todo).
* **`src/controllers/`**: Lógica de negócio e comunicação com o banco de dados.
* **`src/routes/`**: Definição dos endpoints da API, separando rotas públicas (auth) e privadas (todos).
* **`src/middlewares/`**: Interceptadores, como a validação do token JWT para proteger as rotas privadas.
* **`src/schemas/`**: Validações de payload utilizando Zod.

## 🎨 Arquitetura e Estrutura do Projeto (Frontend)

O frontend foi construído como uma aplicação React (Single Page Application) e sua organização principal se divide em:

* **`src/pages/`**: Contém as telas visíveis para o usuário: autenticação (`Login.tsx` e `Register.tsx`) e a interface principal onde o CRUD acontece (`Dashboard.tsx`).
* **`src/services/`**: Responsável pela comunicação com o backend. Possui o `api.ts`, que configura o Axios e cuida de enviar o Token JWT automaticamente em cada requisição.
* **`src/App.tsx`**: É o controlador de rotas, que define qual página será exibida de acordo com a URL acessada.
* **`src/main.tsx`**: É o arquivo inicial que "monta" e roda a aplicação React no navegador.

### 🧠 Decisões Arquiteturais e Técnicas

1. **Padronização de IDs no Mongoose:** Uso de transformação virtual (`toJSON`) nos Schemas para converter o `_id` nativo do MongoDB para `id`, atendendo estritamente ao contrato de dados exigido.
2. **Gestão de Datas (UTC e Local):** O backend armazena a `dataCriacao` com fuso horário neutro (UTC). A responsabilidade de formatar a data para o timezone local (pt-BR) foi delegada exclusivamente ao Frontend.
3. **Validação Antecipada com Zod:** Em vez de `if/else` manuais, o Zod valida os payloads diretamente nos controllers, barrando dados malformados antes de qualquer interação com o banco.
4. **Interceptador Global (Axios):** O frontend centraliza a autenticação interceptando todas as requisições para injetar automaticamente o token JWT (salvo no `localStorage`) no cabeçalho.
5. **Prevenção de *Double-Submit*:** Implementação rigorosa de estados de *loading* em formulários e botões de ação para evitar cliques duplos, concorrência e duplicação de dados na API.
6. **Fluxo de Auto-login (UX):** Após criar uma conta com sucesso, o sistema realiza o login silencioso por baixo dos panos e redireciona o usuário ao Dashboard, reduzindo o atrito.
7. **CORS Aberto (Ambiente de Teste):** A política de CORS na API foi mantida aberta intencionalmente para facilitar a avaliação do projeto por recrutadores em diferentes ambientes locais.

---

## ⚙️ Funcionalidades e Regras de Negócio

* **Autenticação:** Sistema completo de registro e login. Senhas são salvas utilizando hash via `bcryptjs`.
* **Isolamento de Dados:** Um usuário só possui acesso, edição e visualização das tarefas que ele mesmo criou (validado via extração do `usuarioId` do token JWT).
* **Regra de Edição de Tarefas:** Como regra de negócio, a API e o Frontend bloqueiam a edição do título de tarefas que já estão com o status `concluida: true`.
* **Exclusão Segura:** Rotas de deleção verificam não apenas a existência da tarefa, mas também se ela pertence ao usuário autenticado que disparou a requisição.

---

## 🐳 Como rodar a aplicação via Docker (Recomendado)

O app foi configurado para rodar via container com Docker seguindo os passos abaixo.

1. Clone o repositório e navegue ao diretório padrão:
   ```bash
   git clone [https://github.com/VitorGallucci/todo-list-fullstack-teste](https://github.com/VitorGallucci/todo-list-fullstack-teste)
   cd todo-list-fullstack-teste

2. Suba os containers com o Docker Compose:
   ```bash
   docker-compose up --build -d
   ```

3. Acesse a aplicação no seu navegador:
   * **Frontend:** `http://localhost` (O Nginx cuidará do roteamento na porta padrão 80)
   * **Backend:** A API estará rodando internamente e exposta na porta mapeada no `docker-compose.yml`.

> **Nota:** Para encerrar a aplicação, execute `docker-compose down` no terminal.

---

## 🧪 Como rodar os Testes Automatizados

Os testes automatizados foram construídos com Jest no backend para validar as rotas de autenticação e de tarefas.

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Renomeie o arquivo `.env.example` para `.env`.
   
   > **Nota:** O arquivo `.env.example` já possui uma connection string de um cluster de testes do MongoDB e um JWT Secret configurados. Não é necessário alterar nenhum dado para realizar a avaliação.

4. Execute os testes:
   ```bash
   npm test
   ```