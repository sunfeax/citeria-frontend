# Citeria Frontend

Citeria Frontend is an Angular 21 single-page application for the Citeria booking platform. It integrates with a Spring Boot backend API and uses JWT authentication with short-lived access tokens plus an HttpOnly refresh-token cookie.

## Tech Stack

- Angular 21 (standalone APIs)
- TypeScript
- SCSS
- RxJS
- Tailwind CSS

## Backend Integration

- Local backend base URL: `http://localhost:8082`
- Auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`

## Development

```bash
npm ci
npm start
```

Build and tests:

```bash
npm run build
npm test
```
