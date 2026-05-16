# 🐳 Proyecto EP2 - Tienda Perritos - DevOps ISY1101

## 📋 Descripción

Despliegue contenerizado de una aplicación en AWS EC2 usando Docker, Docker Compose y CI/CD con GitHub Actions.

### Servicios
| Servicio | Puerto | Descripción |
|---|---|---|
| `backend-despachos` | 8081 | API REST Spring Boot - gestión de despachos |
| `frontend` | 80 | React + Vite servido con Nginx |
| `db` | 3306 | MySQL 8.0 - base de datos |

---

## 🚀 Cómo usar el proyecto localmente

### Requisitos
- Docker Desktop instalado
- Git

### 1. Clonar el repositorio
git clone https://github.com/cris566/proyecto-semestral-devops.git
cd proyecto-semestral-devops

### 2. Levantar todo con Docker Compose
docker-compose up --build

### 3. Verificar que todo funciona
- Frontend: http://localhost
- API Despachos: http://localhost:8081/swagger-ui.html

### 4. Bajar los contenedores
docker-compose down
docker-compose down -v

---

## 🗄️ Base de Datos

### Estructura (Motor → Driver → Cliente → BD → Tabla)
| Paso | Componente | Valor |
|---|---|---|
| Motor | MySQL | versión 8.0 (imagen Docker) |
| Driver | JDBC Driver | `com.mysql.cj.jdbc.Driver` (pom.xml) |
| Cliente | Spring Boot | conecta via `application.properties` con variables de entorno |
| BD | tienda_db | creada automáticamente por `init.sql` |
| Tabla | despacho | creada con datos de prueba |

### Persistencia
Se usa un **named volume** (`tienda-db-data`) para que los datos de MySQL no se pierdan al reiniciar contenedores.

---

## ⚙️ Pipeline CI/CD

### ¿Cómo funciona?
git push origin deploy → GitHub Actions → Build + Push ECR + Deploy EC2

### Secrets requeridos en GitHub
| Secret | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | De AWS Academy → AWS Details |
| `AWS_SECRET_ACCESS_KEY` | De AWS Academy → AWS Details |
| `AWS_SESSION_TOKEN` | De AWS Academy → AWS Details |
| `AWS_REGION` | `us-east-1` |
| `EC2_HOST_FRONTEND` | IP pública de la EC2 del frontend |
| `EC2_HOST_BACKEND` | IP privada de la EC2 del backend |
| `EC2_SSH_KEY` | Contenido del archivo `.pem` |
| `DB_ENDPOINT` | IP privada de la EC2 de datos |
| `DB_USERNAME` | `tienda_user` |
| `DB_PASSWORD` | `tienda_pass` |

---

## 🏗️ Arquitectura AWS

[EC2-Frontend] ← Subred PÚBLICA  (puerto 80)
[EC2-Backend]  ← Subred PRIVADA  (puerto 8081)
[EC2-Datos]    ← Subred PRIVADA  (puerto 3306)

Solo el Frontend es accesible desde Internet.

---

## 📝 Historial de commits
- feat: add Dockerfile multi-stage backend-despachos
- feat: add Dockerfile frontend with nginx
- feat: add docker-compose with volumes and networks
- feat: add init.sql with table despacho and test data
- feat: add GitHub Actions CI/CD pipeline
- fix: remove backend-ventas, keep only backend-despachos
- docs: update README with full documentation