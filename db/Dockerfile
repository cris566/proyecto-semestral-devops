# Stage 1 - Base
FROM mysql:8.0

# Usuario no root para mayor seguridad
ENV MYSQL_ROOT_PASSWORD=root1234
ENV MYSQL_DATABASE=tienda_db
ENV MYSQL_USER=tienda_user
ENV MYSQL_PASSWORD=tienda_pass

# Copiar script de inicialización automática
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Exponer puerto MySQL
EXPOSE 3306