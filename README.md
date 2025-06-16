# Medical Management API

A backend API built with [NestJS](https://nestjs.com/) for managing users, patients, appointments and medical device data.

## Features

- JWT authentication with role based access control
- CRUD endpoints for users, patients, appointments and device readings
- Sequelize with MySQL
- Rate limiting and security middleware
- Interactive Swagger documentation

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL database

### Installation
```bash
git clone <repository-url>
cd ncpl-poc-backend
npm install
cp .env.example .env
# edit .env with your database credentials and other settings
```
Ensure that the database defined in `.env` exists before starting the API.

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
node dist/main
```

### Seeding Example Data
```bash
npm run seed
```

## Environment Variables
Key options from `.env`:

- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME – MySQL connection settings
- JWT_SECRET – secret for signing access tokens
- PORT – HTTP port (default 3000)
- NODE_ENV – development or production
- THROTTLE_TTL, THROTTLE_LIMIT – API rate limiting
- BCRYPT_SALT_ROUNDS – bcrypt salt rounds
- CORS_* – CORS configuration
- API_TITLE, API_DESCRIPTION, API_VERSION – Swagger metadata
- API_CONTACT_NAME, API_CONTACT_EMAIL – contact details shown in Swagger
- API_CONTACT_URL – contact website shown in Swagger
- API_BASE_URL – server URL used in Swagger docs

## API Documentation
Once the server is running, open:
```
http://localhost:3000/api
```
This page provides the interactive Swagger UI. The raw OpenAPI specification is available at `/api-json`.

### Customizing Swagger
The documentation metadata can be adjusted via environment variables:
`API_TITLE`, `API_DESCRIPTION`, `API_VERSION`, `API_CONTACT_NAME`,
`API_CONTACT_URL`, `API_CONTACT_EMAIL` and `API_BASE_URL`. These values
are used to populate the info section and server URL in Swagger.

## Authentication
1. Register a user via `POST /auth/register` (requires an admin token).
2. Log in using `POST /auth/login` with JSON body `{ "username": "", "password": "" }`.
3. Use the returned `accessToken` in the `Authorization` header:
   "Authorization: Bearer <token>"
All other endpoints require this token.

## Overview of Endpoints

- auth – login, register and profile endpoints
- users – manage system users
- patients – patient records and assignment
- appointments – scheduling and tracking appointments
- medical-devices – record and query device readings

Refer to Swagger for complete request/response schemas.

## Testing

Run unit tests:
```bash
npm test
```
E2E tests:
```bash
npm run test:e2e
```

---
This documentation should provide everything needed for frontend integration.
