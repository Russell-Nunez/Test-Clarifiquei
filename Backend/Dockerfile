# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o código do backend para dentro do container
COPY . .

# Expõe a porta usada pelo backend
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]
