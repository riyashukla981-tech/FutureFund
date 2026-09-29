# Dogfood Platform

This project contains a simple full-stack starter for a dogfood platform.

## Structure

- `frontend/`: React + Vite app
- `backend/`: Spring Boot Java API
- `docker-compose.yml`: local dev environment for frontend, backend, and Postgres

## Run locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Docker

```bash
docker-compose up --build
```
