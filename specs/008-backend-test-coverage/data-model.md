# Data Model

No database schema changes are introduced in this feature.
The Prisma schema remains exactly as defined previously.

## Entity Interactions Tested
- **User**: Testing authentication and profile updates.
- **Product & Category**: Testing creation, updates, and uniqueness constraints.
- **CartItem & Order**: Testing checkout flows under edge case conditions (empty cart, low stock).
