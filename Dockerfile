FROM node:22-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/tsconfig.json ./
RUN npm install
COPY backend/src ./src
RUN npx tsc

FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/tsconfig.json frontend/vite.config.ts ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package.json ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY fixtures ./fixtures
RUN mkdir -p /app/data

EXPOSE 43000

CMD ["node", "backend/dist/index.js"]
