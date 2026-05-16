-- ============================================================
-- PASO 1: MOTOR → MySQL 8.0 (definido en docker-compose.yml)
-- PASO 2: DRIVER → com.mysql.cj.jdbc.Driver (en pom.xml)
-- PASO 3: CLIENTE → Spring Boot se conecta via JDBC (application.properties)
-- PASO 4: CREAR BASE DE DATOS
-- PASO 5: CREAR TABLA CON DATOS
-- ============================================================

-- Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS tienda_db;
USE tienda_db;

-- ============================================================
-- TABLA: despacho
-- Corresponde a la entidad Despacho del backend-despachos
-- ============================================================
CREATE TABLE IF NOT EXISTS despacho (
    id_despacho      BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_despacho   DATE,
    patente_camion   VARCHAR(20),
    intento          INT          DEFAULT 0,
    id_compra        BIGINT,
    direccion_compra VARCHAR(255),
    valor_compra     BIGINT,
    despachado       TINYINT(1)   DEFAULT 0
);

-- ============================================================
-- DATOS DE PRUEBA: tabla despacho
-- ============================================================
INSERT INTO despacho (fecha_despacho, patente_camion, intento, id_compra, direccion_compra, valor_compra, despachado) VALUES
    ('2024-04-16', 'ABCD12', 1, 4, 'Calle Falsa 123, Viña del Mar',  18500, 1),
    ('2024-05-03', 'XYZW99', 1, 5, 'Av. Libertador 890, Valparaíso', 67300, 0);