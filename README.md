# 🐳 Proyecto EP2 — Sistema de Microservicios
### DevOps ISY1101

## 📋 Descripción del Sistema

Este proyecto consiste en el diseño, contenerización y despliegue automatizado de una arquitectura basada en microservicios para la plataforma del sistema semestral. El ecosistema está compuesto por una interfaz de usuario en React que interactúa con dos servicios Backend independientes desarrollados en Spring Boot, acoplados a un motor de base de datos relacional persistente.

La solución se encuentra completamente orquestada localmente mediante **Docker Compose** y automatizada para producción en la nube de **AWS (Amazon EC2)** mediante un flujo de Integración y Despliegue Continuo (CI/CD) implementado en **GitHub Actions** con almacenamiento de imágenes en **Amazon ECR**.re

---

## 🏛️ Arquitectura del Stack de Servicios

| Contenedor / Servicio | Puerto Externo | Descripción Tecnológica |
|---|---|---|
| `tienda-frontend` | `80` | Aplicación SPA en React + Vite, servida mediante **Nginx** de producción. |
| `tienda-backend-ventas` | `8080` | API REST en Java Spring Boot para el procesamiento de ventas. |
| `tienda-backend-despachos` | `8081` | API REST en Java Spring Boot para el procesamiento de despachos. |
| `tienda-db` | `3306` | Motor de Base de Datos Relacional **MySQL 8.0**. |

---

## 🏗️ Justificación Técnica de Arquitectura

### 1. Construcción Multi-Stage y Principio de Mínimo Privilegio

Los `Dockerfile` de Backend (Java/Maven) y Frontend (React/Node.js) utilizan **multi-stage builds**:

- **Build Stage:** Imágenes completas de SDK (`maven:3.9-eclipse-temurin`, `node:20-alpine`) para compilar y generar artefactos (`.jar` y `/dist`).
- **Run Stage:** Solo los artefactos compilados se montan sobre entornos ultraligeros (`eclipse-temurin:21-jre-alpine`, `nginx:alpine`).

> **Beneficio:** Reduce el peso de las imágenes en más de un 70%, acelera despliegues y minimiza la superficie de ataque al excluir compiladores y herramientas de desarrollo del entorno de producción.

### 2. Persistencia Mediante Volúmenes con Nombre

El servicio `tienda-db` monta el volumen administrado `tienda-db-data`, garantizando que los registros persistan ante reinicios, actualizaciones del pipeline o caídas imprevistas del sistema.

### 3. Aislamiento y Service Discovery (Docker Networks)

Todo el stack opera bajo una red `bridge` personalizada, habilitando el **Service Discovery** nativo de Docker. Las APIs resuelven la conexión a base de datos mediante el nombre lógico `tienda-db`, sin depender de IPs estáticas.

---

## 🚀 Operación Local

### Requisitos Previos

- Docker Engine + Docker Compose V2
- Cliente Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/cris566/proyecto-semestral-devops.git
cd proyecto-semestral-devops
```

### 2. Construir e iniciar el stack

```bash
docker compose up -d --build
```

### 3. Verificar accesos

| Entorno | Servicio | URL |
|---|---|---|
| **Local** | Frontend | http://localhost |
| **Local** | API Ventas | http://localhost:8080/api/v1/ventas |
| **Local** | API Despachos | http://localhost:8081/api/v1/despachos |
| **AWS Producción** | Frontend | http://3.92.33.106 |
| **AWS Producción** | API Ventas | http://3.92.33.106:8080/api/v1/ventas |
| **AWS Producción** | API Despachos | http://3.92.33.106:8081/api/v1/despachos |

### 4. Apagar el entorno

```bash
# Mantiene los datos del volumen
docker compose down

# Destruye la base de datos (pruebas limpias)
docker compose down -v
```

---

## 🗄️ Estructura de Base de Datos

| Capa | Componente | Implementación |
|---|---|---|
| Motor | MySQL Server | Versión 8.0 contenerizada |
| Driver | JDBC Driver | `com.mysql.cj.jdbc.Driver` en `pom.xml` |
| Cliente | Spring Boot | Conecta via `application.properties` |
| BD | `tienda_db` | Creada automáticamente por script |
| Tablas | `venta` / `despacho` | Esquemas con datos semilla de prueba |

---

## ⚙️ Pipeline CI/CD

El flujo está definido en `.github/workflows/deploy.yml` y se ejecuta automáticamente ante eventos de `push` a la rama `deploy`.

```
[Código Local] → push → [Rama: deploy] → [GitHub Actions]
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    ▼                                                       ▼
       [Job 1: Build & Push a ECR]                         [Job 2: Deploy en AWS EC2]
       - Autentica credenciales AWS                        - Conecta por SSH a la EC2
       - Compila las 3 imágenes Docker                     - Transfiere docker-compose + init.sql
       - Inyecta IP pública en variables Vite              - Ejecuta 'docker compose pull'
       - Sube imágenes a Amazon ECR                        - Reinicia el stack en caliente
```

### Secrets Requeridos (GitHub → Settings → Secrets → Actions)

| Secret Key | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Identificador de acceso temporal (AWS Lab). |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta de autenticación. |
| `AWS_SESSION_TOKEN` | Token de sesión activo (AWS Academy). |
| `AWS_REGION` | Región de despliegue (`us-east-1`). |
| `EC2_HOST_FRONTEND` | IP pública de la instancia EC2. |
| `EC2_SSH_KEY` | Contenido completo de la llave privada `.pem`. |

---

## 🏗️ Arquitectura de Despliegue AWS

```
             Internet (Peticiones HTTP)
                        │
                        ▼
       ┌─────────────────────────────────────┐
       │         [ AWS EC2 Instance ]        │
       │          (IP Pública : 80)          │
       │                                     │
       │   ┌─────────────────────────────┐   │
       │   │      tienda-frontend        │   │
       │   └──────────────┬──────────────┘   │
       │                  │                  │
       │       [ Docker Bridge Network ]     │
       │                  │                  │
       │   ┌──────────────┴──────────────┐   │
       │   │  tienda-backend-ventas:8080 │   │
       │   │  tienda-backend-despachos:8081  │
       │   └──────────────┬──────────────┘   │
       │                  │                  │
       │   ┌──────────────┴──────────────┐   │
       │   │       tienda-db:3306        │   │
       │   └─────────────────────────────┘   │
       └─────────────────────────────────────┘
```

- **Puerto 80** expuesto al tráfico público vía Security Group de EC2.
- **Puertos 8080, 8081, 3306** comunicados de forma interna a través de la red bridge de Docker.

---

## 📝 Historial de Commits de Infraestructura

```
feat: add Dockerfile multi-stage para microservicio de Ventas
feat: add Dockerfile multi-stage para microservicio de Despachos
feat: add Dockerfile de producción con Nginx para el Frontend
feat: add docker-compose.yml con volumen persistente y redes aisladas
feat: add init.sql con esquemas y datos de prueba semilla
feat: add workflow CI/CD en GitHub Actions para ECR y despliegue SSH
fix:  corrección de variables de entorno y habilitación de claves MySQL
docs: update README con requerimientos y justificaciones para EP2
```
