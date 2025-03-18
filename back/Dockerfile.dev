FROM php:8.2-fpm

ARG user
ARG uid

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd

# Create system user
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user && chown -R $user:$user /home/$user

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory to match volume mount point
WORKDIR /var/www/html

# Copy Laravel project files
COPY --chown=$user:$user . .

# Set permissions - ensuring bootstrap/cache exists and has correct permissions
RUN mkdir -p storage bootstrap/cache vendor && \
    chmod -R 775 storage bootstrap/cache vendor && \
    chown -R $user:$user /var/www/html

# Switch to user
USER $user

# Run composer install
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress

# Expose port 8000
EXPOSE 8000

# Start Laravel server
ENTRYPOINT ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]