# AGENTS.md

## Project Context

This repository is the Angular frontend for the Citeria booking platform.
The backend is a Spring Boot API located in a separate repository.

Primary goals:
- Build a clean, fast, production-ready SPA.
- Integrate safely with backend JWT auth.
- Keep architecture maintainable (feature-oriented, typed, testable).

## Tech Stack

- Angular 21 (standalone APIs)
- TypeScript 5
- SCSS
- RxJS
- Angular Router
- Unit tests: `ng test` (Vitest via Angular builder)

## Local Commands

- Install: `npm ci`
- Dev server: `npm start` (or `ng serve`)
- Build: `npm run build`
- Test: `npm test`

## Backend Integration (Current Contract)

Default local backend base URL:
- `http://localhost:8082`

Auth endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Auth Behavior Rules

1. `login` returns access token in JSON (`LoginResponseDto.token`).
2. Refresh token is sent by backend as `HttpOnly` cookie.
3. Frontend must never store refresh token manually.
4. Frontend must call auth requests with credentials included:
   - `withCredentials: true` (HttpClient) / `credentials: 'include'` (fetch).
5. Refresh flow:
   - on `401` from protected API, call `POST /api/auth/refresh`, then retry original request once.
6. If refresh fails (`401`), clear local auth state and redirect to login.

### Error Shape

Backend uses `ProblemDetail` style errors, commonly with:
- `status`
- `title`
- `detail`
- `timestamp`
- optional `errors` map for validation

UI should parse and map these consistently.

## Frontend Architecture Guidelines

Use feature-first structure under `src/app`:
- `core/`: singleton services, interceptors, guards, config
- `shared/`: reusable UI components, pipes, directives, models
- `features/`: domain features (auth, bookings, profile, etc.)

Preferred conventions:
- Use standalone components.
- Keep components presentational when possible.
- Move API and state logic into services/facades.
- Use strict typing; avoid `any`.
- Keep side effects centralized.

## HTTP and Security Guidelines

- Centralize API base URL in one config point.
- Use one HTTP interceptor for auth header (`Authorization: Bearer <accessToken>`).
- Do not append auth header for auth endpoints (`/api/auth/*`).
- Never log tokens in console.
- Do not persist access token in `localStorage` unless explicitly required by product decisions.
  - Prefer in-memory token storage for better XSS posture.

## Routing and UX Guidelines

- Protect private routes with auth guard.
- Keep public routes minimal (`/login`, `/register`).
- On app startup, if no in-memory access token, optionally attempt refresh once.
- Preserve intended URL when redirecting to login.

## Styling and UI Guidelines

- Use SCSS with clear variables and spacing scale.
- Keep components responsive (mobile first).
- Follow accessibility basics:
  - semantic HTML
  - keyboard navigation
  - visible focus states
  - proper labels and error messages

## Testing Expectations

Before considering work done:
1. `npm run build` passes.
2. Relevant unit tests pass (`npm test`).
3. New logic (auth/interceptors/guards/services) has tests.

## Definition of Done for AI Tasks

For each implemented task, the agent should:
1. Explain what changed and why.
2. List affected files.
3. Confirm build/test status.
4. Mention any assumptions or follow-up items.

## Non-Goals

- Do not modify backend logic from this repo.
- Do not introduce state management libraries unless justified (start with Angular primitives).
- Do not add heavy dependencies without clear need.

## Notes for Future Agents

If backend auth contract changes, update this file first, then update:
- auth service
- auth interceptor
- auth guard
- refresh/retry strategy
- UI error mapping
