# IntelliMeet API Contract v1 (Execution Draft)

Base URL: `/api`
Auth: JWT Bearer token unless specified.

## 1. Auth

### POST `/auth/signup`
- Auth: No
- Body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- Success: `201 Created`

### POST `/auth/login`
- Auth: No
- Body:
```json
{
  "email": "string",
  "password": "string"
}
```
- Success: `200 OK`
- Returns access token + refresh token

### POST `/auth/refresh`
- Auth: Refresh token
- Success: `200 OK`

## 2. Users

### GET `/users/me`
- Auth: Yes
- Success: `200 OK`

### PUT `/users/me`
- Auth: Yes
- Body: profile update payload
- Success: `200 OK`

## 3. Meetings

### POST `/meetings`
- Auth: Yes
- Body:
```json
{
  "title": "string",
  "description": "string",
  "scheduledAt": "ISO-8601",
  "duration": 30,
  "settings": {
    "isRecorded": false,
    "allowChat": true,
    "muteOnJoin": true
  }
}
```
- Success: `201 Created`

### GET `/meetings`
- Auth: Yes
- Query:
  - `page`
  - `limit`
  - `status`
  - `from`
  - `to`
- Success: `200 OK`

### GET `/meetings/:id`
- Auth: Yes
- Success: `200 OK`

### PUT `/meetings/:id`
- Auth: Host/Admin
- Success: `200 OK`

### DELETE `/meetings/:id`
- Auth: Host/Admin
- Success: `204 No Content`

### POST `/meetings/:id/join`
- Auth: Yes (invitee)
- Success: `200 OK`
- Returns room join credentials

### GET `/meetings/:id/recordings`
- Auth: Yes
- Success: `200 OK`

## 4. AI

### POST `/meetings/:id/ai/generate-summary`
- Auth: Host
- Success: `202 Accepted`

### GET `/meetings/:id/ai/summary`
- Auth: Yes
- Success: `200 OK`

## 5. Teams and Tasks

### GET `/teams/:id`
- Auth: Yes
- Success: `200 OK`

### POST `/teams/:id/tasks`
- Auth: Yes
- Success: `201 Created`

## 6. Analytics

### GET `/analytics/me`
- Auth: Yes
- Success: `200 OK`

## Common Error Schema

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": []
  }
}
```
