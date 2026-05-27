-- ============================================================
-- ARQUITECTURA BASE DE DATOS UNIFICADA - DUOC UC
--   - Mapea Entidad 'Despacho' (Puerto 8081)
--   - Mapea Entidad 'Venta' (Puerto 8080)
-- ============================================================

CREATE DATABASE IF NOT EXISTS tienda_db;
USE tienda_db;

-- ------------------------------------------------------------
-- TABLA: despacho
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS despacho (
    id_despacho     BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_despacho  DATE,
    patente_camion  VARCHAR(20),
    intento          INT          DEFAULT 0,
    id_compra        BIGINT,
    direccion_compra VARCHAR(255),
    valor_compra     BIGINT,
    entregado        TINYINT(1)   DEFAULT 0 
);

-- ------------------------------------------------------------
-- TABLA: venta
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venta (
    id_venta          BIGINT AUTO_INCREMENT PRIMARY KEY,
    direccion_compra  VARCHAR(255) NOT NULL,
    valor_compra      INT NOT NULL,
    fecha_compra      DATE NOT NULL,
    despacho_generado TINYINT(1) DEFAULT 0 
);

-- ============================================================
-- DATOS DE PRUEBA COHERENTES PARA TU FRONTEND
-- ============================================================

-- Inserciones en la tabla venta
-- Nota: MySQL asignará automáticamente los IDs 1, 2 y 3.
INSERT INTO venta (direccion_compra, valor_compra, fecha_compra, despacho_generado) VALUES
    ('Calle Falsa 123, Viña del Mar', 18500, '2026-04-14', 1), -- Caso 1: Ya tiene despacho creado (1)
    ('Av. Alemania 456, Valparaíso', 25000, '2026-05-15', 1),  -- Caso 2: Ya tiene despacho creado (1)
    ('Paseo Ross 789, Quilpué', 12300, '2026-05-16', 0);       -- Caso 3: Pendiente de despacho (0) <-- Aparecerá en TableCompras

-- Inserciones en la tabla despacho
-- Los campos id_compra, direccion_compra y valor_compra calzan exactamente con las ventas de arriba
INSERT INTO despacho (fecha_despacho, patente_camion, intento, id_compra, direccion_compra, valor_compra, entregado) VALUES
    ('2026-04-16', 'ABCD12', 1, 1, 'Calle Falsa 123, Viña del Mar', 18500, 1), -- Caso 1: Despacho Entregado (1)
    ('2026-05-17', 'XYZW99', 0, 2, 'Av. Alemania 456, Valparaíso', 25000, 0);  -- Caso 2: Despacho Pendiente (0) <-- Aparecerá en TableDespachos para cerrarlo