# # === 1. Сборка проекта ===
# FROM node:20 AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # === 2. Запуск готового билда ===
# FROM node:20

# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# RUN npm install vite -g

# EXPOSE 3000
# CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]

# === 1. Билдим проект ===
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# === 2. Сервер на Node + Vite preview ===
FROM node:20
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install vite -g

EXPOSE 3000
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000", "--allowed-hosts", "admin.sarezmobile.com,www.admin.sarezmobile.com"]

