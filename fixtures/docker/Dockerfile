# Intentionally misconfigured: root user, latest tag, no cache cleanup
FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
