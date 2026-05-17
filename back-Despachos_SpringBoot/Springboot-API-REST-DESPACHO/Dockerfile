# ============================================================
# Dockerfile - Backend Despachos (Spring Boot / Java 17)
# Multi-stage build: etapa builder + etapa runtime liviana
# Buenas prácticas: usuario no root, capas limpias
# ============================================================

# ----------------------------
# ETAPA 1: BUILD
# ----------------------------
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ----------------------------
# ETAPA 2: RUNTIME
# ----------------------------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/target/*.jar app.jar

RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]