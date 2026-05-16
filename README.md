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
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO
```

### 2. Levantar todo con Docker Compose
```bash
docker-compose up --build
```

### 3. Verificar que todo funciona
- Frontend: http://localhost
- API Despachos: http://localhost:8081/swagger-ui.html

### 4. Bajar los contenedores
```bash
docker-compose down
# Para borrar también los volúmenes (datos):
docker-compose down -v
```

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

El archivo `db/init.sql` crea la tabla y los datos automáticamente la primera vez.

### Persistencia
Se usa un **named volume** (`tienda-db-data`) para que los datos de MySQL no se pierdan al reiniciar contenedores. Se eligió named volume sobre bind mount porque es portable entre equipos y Docker lo gestiona automáticamente.

---

## ⚙️ Pipeline CI/CD

### ¿Cómo funciona?
Cada vez que se hace `git push origin deploy`, GitHub Actions ejecuta automáticamente el pipeline:

```
git push origin deploy
       ↓
GitHub Actions (.github/workflows/deploy.yml)
       ↓
1. Build imagen Docker (backend-despachos, frontend)
2. Push imágenes a Amazon ECR
3. SSH a EC2 → pull imagen nueva → reiniciar contenedor
```

### Secrets requeridos en GitHub
Ir a: **Settings → Secrets and variables → Actions → New repository secret**

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

```
Internet
    │
    ▼
[EC2-Frontend]  ← Subred PÚBLICA  (puerto 80)
    │
    ▼ (red privada)
[EC2-Backend]   ← Subred PRIVADA  (puerto 8081)
    │
    ▼
[EC2-Datos]     ← Subred PRIVADA  (puerto 3306)
```

Solo el Frontend es accesible desde Internet. El Backend y la BD están en subred privada con acceso solo desde dentro de la VPC.

---

## 📝 Historial de commits
- `feat: add Dockerfile multi-stage backend-despachos`
- `feat: add Dockerfile frontend with nginx`
- `feat: add docker-compose with volumes and networks`
- `feat: add init.sql with table despacho and test data`
- `feat: add GitHub Actions CI/CD pipeline`
- `fix: remove backend-ventas, keep only backend-despachos`
- `docs: update README with full documentation`