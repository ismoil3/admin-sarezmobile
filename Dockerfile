# # Используем Node.js
# FROM node:20

# # Устанавливаем рабочую директорию
# WORKDIR /app

# # Копируем package.json и устанавливаем зависимости
# COPY package*.json ./
# RUN npm install

# # Копируем всё остальное
# COPY . .

# # Открываем порт, который использует Vite
# EXPOSE 3000

# # Запускаем dev-сервер
# CMD ["npm", "run", "dev", "--", "--host"]

# === 1. Сборка проекта ===
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# === 2. Запуск готового билда ===
FROM node:20

WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install vite -g

EXPOSE 3000
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
