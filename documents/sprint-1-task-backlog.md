# Sprint 1 Task Backlog (Implementation Ready)

## Epic A - Auth and User Management

- A1: Create auth route module and controller stubs
- A2: Implement signup validation schema
- A3: Implement login validation schema
- A4: Add JWT generation utility
- A5: Add refresh token persistence model
- A6: Add `/users/me` protected endpoint stub
- A7: Unit tests for auth services

## Epic B - Meeting Lifecycle (Initial)

- B1: Create meeting route module and controller stubs
- B2: Implement `POST /meetings` validation and stub
- B3: Implement `GET /meetings` pagination and filtering contract
- B4: Implement `GET /meetings/:id` stub

## Epic C - Real-Time Base

- C1: Create Socket.io server bootstrap
- C2: Add handshake auth middleware stub
- C3: Add `meeting:join` and `meeting:leave` handlers
- C4: Add `chat:message` and `chat:typing` handlers
- C5: Add `participant:update` broadcast helper

## Epic H - DevOps and Quality Baseline

- H1: Configure root lint and format scripts
- H2: Configure test command placeholders
- H3: Add API health endpoint `/health`
- H4: Add socket service health signal
- H5: Add environment example file template

## Prioritization

1. A1-A4
2. H3 + H5
3. C1-C3
4. B1-B3
5. Remaining items
