# API Contracts

## Success Response Wrapper
All successful API responses MUST be wrapped in a `data` envelope:
```json
{
  "data": { ... payload ... }
}
```

## Error Response Format
Tests expect the error middleware to return standard error properties instead of custom success booleans:
```json
{
  "error": "Message" // Or "message" depending on existing middleware
}
```

## Updated Endpoint Behaviors
- `GET /api/admin/settings/hero`: Must be accessible without Authorization token (Public) by bypassing the `requireAdmin` middleware.
- `POST /api/cart`: Must return `201 Created` on successful cart item addition.
- `POST /api/orders/checkout`: Must be the endpoint used for checkout (tests should use this path instead of `/api/checkout`).
