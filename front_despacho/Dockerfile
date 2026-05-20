# ============================================================
# Dockerfile - Frontend Despacho (React + Vite → Nginx)
# Multi-stage: etapa build Node.js + etapa runtime Nginx alpine
# ============================================================

# ----------------------------
# ETAPA 1: BUILD React
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# ARGs para las URLs de ambos backends (se pasan desde docker-compose o github actions)
ARG VITE_API_VENTAS
ARG VITE_API_DESPACHOS

# Exportar ambas como variables de entorno para que Vite las inyecte en el 'npm run build'
ENV VITE_API_DESPACHOS=$VITE_API_DESPACHOS
ENV VITE_API_VENTAS=$VITE_API_VENTAS

# Copiar package.json primero para cachear dependencias
COPY package*.json .
RUN npm ci --silent

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# ----------------------------
# ETAPA 2: RUNTIME con Nginx
# ----------------------------
FROM nginx:alpine

# Copiar el build de React al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx para que maneje React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]