# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Stage 2: PHP backend
FROM php:8.3-apache

# Install PostgreSQL driver for PHP
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql

# Enable mod_rewrite for Apache
RUN a2enmod rewrite

# Copy PHP files
COPY --chown=www-data:www-data . /var/www/html/

# Copy built React files to Apache document root
COPY --from=frontend-builder --chown=www-data:www-data /app/dist /var/www/html/public

# Configure Apache to serve React app
RUN echo '<Directory /var/www/html>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>' > /etc/apache2/sites-available/000-default.conf

# Configure Apache to handle React routing
RUN echo '<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>' > /var/www/html/.htaccess

# Set environment variables
ENV DATABASE_URL=""

EXPOSE 80

CMD ["apache2-foreground"]
