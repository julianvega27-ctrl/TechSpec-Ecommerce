# Research: Testing & Quality Assurance

## Backend Testing Framework
- **Decision**: Vitest
- **Rationale**: Spec explicitly requires Vitest reports. Vitest is fast, native to Vite (used in frontend), and supports TypeScript out-of-the-box.
- **Alternatives considered**: Jest (slower, requires ts-jest configuration).

## Backend Integration Testing Environment
- **Decision**: Testcontainers with PostgreSQL image (`@testcontainers/postgresql`)
- **Rationale**: Required by spec. Provides an isolated, disposable database for each test run, ensuring a clean state without polluting the development DB.
- **Alternatives considered**: In-memory SQLite (does not match production DB capabilities like specific Prisma Postgres functions).

## Frontend API Mocking
- **Decision**: MSW (Mock Service Worker)
- **Rationale**: Required by spec to simulate HTTP calls without hitting real APIs. Integrates perfectly with Vitest and RTL.
- **Alternatives considered**: `vitest.mock(axios)` (less robust, doesn't mock at the network layer).

## Frontend Testing Library
- **Decision**: React Testing Library (RTL) + `@testing-library/jest-dom`
- **Rationale**: Industry standard for testing React components in a DOM-like environment.
- **Alternatives considered**: Enzyme (deprecated for React 18+).
