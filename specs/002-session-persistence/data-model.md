# Data Model: Persistencia de sesión de usuario

*No new backend database entities are created for this feature.*

## Frontend State Model

### AuthState
- `user`: User | null
- `loading`: boolean (indicates initial validation)

### LocalStorage Keys
- `token`: string (stores the JWT)
