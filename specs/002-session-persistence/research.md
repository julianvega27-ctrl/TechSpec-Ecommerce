# Research: Persistencia de sesión de usuario

## Decisions

- **Token Storage**: `localStorage`
  - **Rationale**: The backend endpoints currently expect JWT tokens in headers (e.g., `Authorization: Bearer <token>`). Refactoring the system to use HttpOnly cookies would require significant changes to the backend (login, validation, logout). Storing the token in `localStorage` fulfills the requirement to "not modify existing endpoints".
  - **Alternatives**: HttpOnly Cookies (rejected due to constraint on backend modifications).
  
- **Loading State**: Full-screen indicator.
  - **Rationale**: Prevents UI flicker where a user sees the unauthenticated layout (e.g. login page) for a split second before the token validation completes.
  - **Alternatives**: Silent login (rejected as it causes flicker).

- **Network Failure Handling**: Clear local session.
  - **Rationale**: If the API is unreachable, it's safer to clear the `localStorage` and force a fresh login when the network returns, rather than maintaining a stale authenticated state.
