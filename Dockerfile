# Etapa base com Node.js
FROM node:20

# Define variáveis de ambiente para encoding
ENV LANG C.UTF-8

# Cria diretório de trabalho
WORKDIR /app

# Instala o expo-cli globalmente
RUN npm install -g expo-cli

# Copia apenas os arquivos de dependência
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do projeto
COPY . .

# Expo usa essas portas:
# 8081 -> Metro bundler
# 19000 -> App mobile via LAN/tunnel
# 19001 -> Expo DevTools
# 19002 -> Web
EXPOSE 8081 19000 19001 19002

# Inicia o Expo no modo tunnel (funciona em redes diferentes)
CMD ["npx", "expo", "start", "--tunnel", "--clear"]
