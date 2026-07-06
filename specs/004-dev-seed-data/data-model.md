# Data Model: Development Seed Data

This feature does **not** introduce any new tables or schema changes. It purely utilizes the existing Prisma models.

## Entities Interacted With:

### `Category`
- Seeded with 5 fixed tech categories: "Laptops", "Smartphones", "Monitores", "Accesorios", "Componentes".
- Attributes updated/created: `name`, `description`, `isActive`.

### `Product`
- Seeded with 30 items dynamically generated using `faker.js`.
- Attributes populated: `name`, `description`, `brand`, `price`, `stock`, `categoryId`, `imageUrl`, `isActive`.

### `User`
- **Queried** to find the existing client and admin.
- Required to associate orders and carts.

### `Order` & `OrderItem`
- A sample order with 2-3 items created and associated with the existing `CLIENT` user.
- Status set to a realistic value (e.g., `PENDING` or `DELIVERED`).

### `Cart` & `CartItem`
- A sample cart populated with a few items and associated with the existing `CLIENT` user, to facilitate quick checkout testing.
