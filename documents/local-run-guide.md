# Local Run Guide

## Prerequisites

- Node.js 20+
- npm 10+

## Install

From workspace root:

```bash
npm install
```

## Run Services

### API

```bash
npm run dev:api
```

Runs on: `http://localhost:4000`
Health check: `GET /health`

### Web

```bash
npm run dev:web
```

Runs on: `http://localhost:5173`

### Socket Placeholder

```bash
npm run dev:socket
```

Runs on: `http://localhost:4001`
Health check: `GET /health`

## Implemented Auth Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/users/me` (Bearer token)

## Quick Manual Test

1. Signup with email/password.
2. Login and capture `accessToken` and `refreshToken`.
3. Call `/api/users/me` with `Authorization: Bearer <accessToken>`.
4. Call `/api/auth/refresh` with `refreshToken`.
