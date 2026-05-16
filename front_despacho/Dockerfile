# ============================================================
# Dockerfile - Frontend Despacho (React + Vite → Nginx)
# Multi-stage: etapa build Node.js + etapa runtime Nginx alpine
# ============================================================

# ----------------------------
# ETAPA 1: BUILD React
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# ARG para la URL del backend despachos (se pasa desde docker-compose)
ARG VITE_API_DESPACHOS=http://localhost:8081

# Exportar como variable de entorno para que Vite la use en build
ENV VITE_API_DESPACHOS=$VITE_API_DESPACHOS

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