
# 3assasa E-Commerce Project

This project is a full-stack e-commerce application with Laravel for the backend and React for the frontend. It is deployed using Docker, with PostgreSQL as the database, and Nginx as a reverse proxy.

## Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose

## Getting Started

Follow these steps to set up and run the project locally in a Docker container.

### 1. Clone the repository

```bash
git clone https://github.com/oubellaismail/ecom.git
cd ecom
```

### 2. Configure the `.env` file

Make your `.env` file : 

```bash
cp back/.env.example back/.env
```

Make sure to configure the database connection in the `.env` file. Update the database settings as follows:

```env
DB_CONNECTION=pgsql
DB_HOST=database
DB_PORT=5432
DB_DATABASE=ecommerce
DB_USERNAME=postgres
DB_PASSWORD=just
```

### 3. Build and run the Docker container

Build and start the Docker container using the following command:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

This will:

- Build the Docker images for the backend (Laravel) and frontend (React).
- Start the containers, including the database (PostgreSQL) and Nginx.

### 4. Generate the Laravel application key

Once the containers are up, you’ll need to generate the Laravel application key:

```bash
docker exec -it laravel_app php artisan key:generate
```

This will generate the application key and update the `.env` file in the container.

### 5. Migrate the database

Run the Laravel migrations to set up the database:

```bash
docker exec -it laravel_app php artisan migrate
```

This will apply any pending migrations to your PostgreSQL database.

### 6. Access the application

Once everything is set up, you can access the application in your browser:

- Frontend (React): `http://localhost:3000`
- Backend (Laravel API): `http://localhost:8000`

### 7. Stopping the containers

To stop the running containers, use:

```bash
docker-compose down
```

## Environment Variables

You can configure the environment variables in the `.env` file. The default configuration should work, but you can modify the settings for your database, app key, and other services.

## Docker Compose File Breakdown

The `docker-compose.yml` file includes:

- **app**: The Laravel backend container.
- **frontend**: The React frontend container.
- **db**: The PostgreSQL database container.
- **nginx**: The Nginx reverse proxy.

## Conclusion

This setup allows you to run the full-stack e-commerce application locally with Docker. If you encounter any issues, feel free to open an issue in the repository.
