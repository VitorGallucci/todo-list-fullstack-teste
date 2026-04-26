# Usa uma imagem oficial do Node versão 20
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Executa o script de build 
RUN npm run build

# Nginx para servir os arquivos estáticos do React
FROM nginx:alpine
# Copia os arquivos gerados para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia a configuração de rotas
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Liga o Nginx
CMD ["nginx", "-g", "daemon off;"]