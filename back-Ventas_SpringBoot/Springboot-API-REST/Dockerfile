# ============================================================
# Dockerfile - Backend Ventas (Spring Boot / Java 17)
# Multi-stage build: etapa builder + etapa runtime liviana
# Buenas prácticas: usuario no root, capas limpias
# ============================================================

# ----------------------------
# ETAPA 1: BUILD (compilar JAR)
# ----------------------------
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiamos primero solo el pom.xml para cachear dependencias
# Si el código cambia pero el pom no, Docker reutiliza esta capa
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Ahora copiamos el código fuente y compilamos
COPY src ./src
RUN mvn package -DskipTests -B

# ----------------------------
# ETAPA 2: RUNTIME (imagen final liviana)
# ----------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario no root (buena práctica de seguridad)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar solo el JAR compilado desde la etapa builder
COPY --from=builder /app/target/*.jar app.jar

# Cambiar dueño del archivo al usuario no root
RUN chown appuser:appgroup app.jar

# Usar el usuario no root
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
