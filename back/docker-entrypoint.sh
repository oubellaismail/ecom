#!/bin/bash
set -e  # Exit on error

# Check if .env exists, if not, copy .env.example
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Copied .env.example to .env"
fi

# Append database configuration to .env
if ! grep -q "DB_CONNECTION=pgsql" .env; then
cat << EOF >> .env

# Docker PostgreSQL settings
DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=just
EOF
echo "Updated .env database configuration"
fi

# Generate app key
php artisan key:generate

if ! grep -q '"sanctum":' composer.json; then
    echo "Sanctum not found in composer.json. Running install:api..."
    php artisan install:api
else
    echo "Sanctum found in composer.json, skipping install:api."
fi

# Run migrations (uncomment if needed)
# php artisan migrate --force

# Start the application (keep container running)
exec "$@"
