# Usa uma imagem oficial do Node versão 20
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Primeiro, copia apenas os arquivos de configuração de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Agora copia o restante do código da aplicação para dentro do container
COPY . .

# Executa o script de build
RUN npm run build

# Expõe a porta 5000
EXPOSE 5000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]