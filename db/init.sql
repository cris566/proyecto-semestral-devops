-- ============================================================
-- ARQUITECTURA BASE DE DATOS UNIFICADA - DUOC UC
--   - Mapea Entidad 'Despacho' (Puerto 8081)
--   - Mapea Entidad 'Venta' (Puerto 8080)
-- ============================================================

-- Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS tienda_db;
USE tienda_db;

-- ------------------------------------------------------------
-- TABLA: despacho
-- Mapea exactamente los campos de com.citt.persistence.entity.Despacho
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS despacho (
    id_despacho      BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_despacho   DATE,
    patente_camion   VARCHAR(20),
    intento          INT          DEFAULT 0,
    id_compra        BIGINT,
    direccion_compra VARCHAR(255),
    valor_compra     BIGINT,
    entregado        TINYINT(1)   DEFAULT 0 -- <-- CORREGIDO: En Java la propiedad es 'entregado', no 'despachado'
);

-- ------------------------------------------------------------
-- TABLA: venta
-- Mapea exactamente los campos de com.citt.persistence.entity.Venta
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venta (
    id_venta          BIGINT AUTO_INCREMENT PRIMARY KEY,
    direccion_compra  VARCHAR(255) NOT NULL,
    valor_compra      INT NOT NULL,
    fecha_compra      DATE NOT NULL,
    despacho_generado TINYINT(1) DEFAULT 0 -- <-- CORREGIDO: Traduce fielmente 'despachoGenerado' de Java
);

-- ============================================================
-- DATOS DE PRUEBA (POBLADO INICIAL COHERENTE)
-- ============================================================

-- Inserciones en la tabla venta
INSERT INTO venta (direccion_compra, valor_compra, fecha_compra, despacho_generado) VALUES
    ('Calle Falsa 123, Viña del Mar', 18500, '2026-04-14', 1),
    ('Av. Alemania 456, Valparaíso', 25000, '2026-05-15', 0),
    ('Paseo Ross 789, Quilpué', 12300, '2026-05-16', 0);  

-- Inserciones en la tabla despacho (El id_compra apunta a la venta con id_venta = 1 que ya fue generada)
INSERT INTO despacho (fecha_despacho, patente_camion, intento, id_compra, direccion_compra, valor_compra, entregado) VALUES
    ('2026-04-16', 'ABCD12', 1, 1, 'Calle Falsa 123, Viña del Mar', 18500, 1),
    ('2026-05-03', 'XYZW99', 1, 2, 'Av. Libertador 890, Valparaíso', 67300, 0);