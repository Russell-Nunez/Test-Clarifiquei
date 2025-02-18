# Usa uma imagem do Node.js para construir o frontend
FROM node:18 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência para o container
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do frontend para o container
COPY . ./

# Compila a aplicação Next.js para produção
RUN npm run build

# Usa a imagem oficial do Nginx para servir o frontend
FROM nginx:latest

# Remove a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d

# Copia a configuração personalizada do Nginx para o container
COPY nginx.conf /etc/nginx/nginx.conf

# Copia os arquivos compilados do frontend para a pasta do Nginx
COPY --from=build /app/.next /usr/share/nginx/html

# Expõe a porta 80 para acessar o frontend
EXPOSE 80

# Comando que inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
