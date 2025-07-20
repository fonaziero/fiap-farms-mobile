FROM node:20

ENV LANG C.UTF-8
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV NODE_ENV=development

# Usa um diretório genérico
WORKDIR /code

RUN npm install -g expo-cli @expo/ngrok

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8081 19000 19001

CMD ["npx", "expo", "start", "--tunnel"]
