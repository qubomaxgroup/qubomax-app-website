# Qubomax Sales Command Center

Clean full-stack starter kit for Amazon SP-API order analytics.

## Stack

- Backend: Java 21 + Spring Boot 3.x
- Frontend: Angular 18 (Signals + Angular Material)
- Database: PostgreSQL (Spring Data JPA)
- Auth: Internal JWT login endpoint (can be swapped to Cognito)
- AWS: Secrets Manager for SP-API secret retrieval

## Project Structure

```
.
├── backend
│   ├── pom.xml
│   └── src
│       ├── main
│       │   ├── java/com/qubomax/commandcenter
│       │   │   ├── config
│       │   │   ├── security
│       │   │   └── spapi
│       │   │       ├── controller
│       │   │       ├── dto
│       │   │       ├── entity
│       │   │       ├── model
│       │   │       ├── repository
│       │   │       └── service
│       │   └── resources
│       │       ├── application.properties
│       │       └── mock/sp-api-orders.sample.json
│       └── test
├── frontend
│   ├── package.json
│   └── src
│       ├── app
│       │   ├── core
│       │   │   ├── models
│       │   │   └── services
│       │   └── features/dashboard
│       │       ├── components
│       │       └── pages
│       └── environments
└── docker-compose.yml
```

## Local Run

### 1) Start PostgreSQL

```bash
docker compose up -d db
```

### 2) Run backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run
```

### 3) Run frontend (port 4200)

```bash
cd frontend
npm install
npm start
```

Open: http://localhost:4200

## Environment Variables (Backend)

Set before backend start:

```bash
export SP_API_CLIENT_ID="<your-lwa-client-id>"
export SP_API_SECRET_NAME="qubomax/sp-api"
export AWS_REGION="us-east-1"
export JWT_SECRET="replace-with-strong-secret-at-least-32-characters"
export APP_INTERNAL_USERNAME="admin"
export APP_INTERNAL_PASSWORD="change-me"
```

Secrets Manager JSON should include:

```json
{
  "SP_API_CLIENT_SECRET": "....",
  "SP_API_REFRESH_TOKEN": "...."
}
```

## API Endpoints

- `POST /api/auth/login`
  - body: `{ "username": "...", "password": "..." }`
  - returns JWT
- `GET /api/orders/daily-summary?marketplaceId=ATVPDKIKX0DER`
  - requires `Authorization: Bearer <token>`
  - returns total revenue, order count, average order value, status counts, high-value orders
- `GET /api/health`

## Core Backend classes requested

- `SecretManagerService`
- `SpApiHttpClient` (LWA token exchange + SP-API orders fetch via WebClient)
- `OrdersService` (aggregation + timezone conversion + high-value detection)

## Core Frontend classes requested

- `dashboard.store.ts` (Angular Signals state)
- `dashboard.component.ts`
- `summary-header.component.*`
- `order-table.component.*`

