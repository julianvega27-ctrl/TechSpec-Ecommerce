# Quickstart Validation: Persistencia de sesión de usuario

## Prerequisites
- Backend running locally
- Frontend running locally

## Validation Scenarios

### 1. Persistence on Reload
1. Start frontend app.
2. Login with valid credentials.
3. Refresh the page (F5).
4. Verify the user remains logged in and no flicker occurs (full-screen spinner shows briefly).

### 2. Network Failure during init
1. Login with valid credentials.
2. Stop the backend server.
3. Refresh the page.
4. Verify the system cleans the local session (token removed from `localStorage`) and redirects to login/unauthenticated state.

### 3. Logout clears token
1. Login with valid credentials.
2. Click "Cerrar sesión" in the app.
3. Verify that `localStorage.getItem('token')` returns `null` in the browser dev tools.
