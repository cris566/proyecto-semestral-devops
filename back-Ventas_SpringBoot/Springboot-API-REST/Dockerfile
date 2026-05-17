# ============================================================
# Dockerfile - Backend Ventas (Spring Boot / Java 17)
# Multi-stage build: etapa builder + etapa runtime liviana
# Buenas prácticas: usuario no root, capas limpias de caché
# ============================================================

# ----------------------------
# ETAPA 1: BUILD (Compilación)
# ----------------------------
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar el pom.xml primero para descargar y cachear las dependencias m2
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar el archivo .jar omitiendo los tests unitarios
COPY src ./src
RUN mvn package -DskipTests -B

# ----------------------------
# ETAPA 2: RUNTIME (Ejecución)
# ----------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear un usuario y grupo de sistema sin privilegios por seguridad (No-Root)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar el artefacto .jar compilado en la etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Cambiar la propiedad del archivo al usuario seguro
RUN chown appuser:appgroup app.jar

# Cambiar al contexto del usuario seguro
USER appuser

# Exponer el puerto por defecto para el servicio de Ventas
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]