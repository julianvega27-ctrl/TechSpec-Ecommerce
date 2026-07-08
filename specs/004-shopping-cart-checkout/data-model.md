# Data Model: Shopping Cart & Checkout Flow

## Overview

The feature leverages the existing Prisma schema for the Ecommerce application. No new entities or migrations are required. The key models involved are `CartItem`, `Order`, `OrderItem`, and `Product`.

## Entities & Relationships

### `Product` (Existing)
Represents a sellable item in the catalog.
- **Fields**:
  - `id`: UUID (Primary Key)
  - `price`: Decimal (The final price, including 18% IGV)
  - `stock`: Int (Must be strictly checked during quantity updates and checkout)
  - `isActive`: Boolean

### `CartItem` (Existing)
Represents a product that the user has added to their shopping cart.
- **Fields**:
  - `id`: UUID (Primary Key)
  - `userId`: UUID (Foreign Key to `User`)
  - `productId`: UUID (Foreign Key to `Product`)
  - `quantity`: Int (Cannot exceed `Product.stock`)
  - `addedAt`: DateTime
- **Logic**: When an item is added, if it already exists for the user, its quantity is incremented.

### `Order` (Existing)
Represents a confirmed purchase.
- **Fields**:
  - `id`: UUID (Primary Key)
  - `userId`: UUID (Foreign Key to `User`)
  - `totalAmount`: Decimal (Total sum of all order items)
  - `status`: Enum (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELED`) - Typically starts at `PROCESSING` or `PENDING` upon successful simulated payment.
  - `createdAt`: DateTime

### `OrderItem` (Existing)
Represents a snapshot of a product purchased within a specific order.
- **Fields**:
  - `id`: UUID (Primary Key)
  - `orderId`: UUID (Foreign Key to `Order`)
  - `productId`: UUID (Foreign Key to `Product`)
  - `quantity`: Int
  - `unitPrice`: Decimal (The price of the product *at the time of purchase*)

## State Transitions

### Checkout Simulation Transaction
When the user submits the checkout form successfully:
1. **Query**: Retrieve all `CartItem`s for the user along with their respective `Product` stocks.
2. **Validate**: Ensure `CartItem.quantity <= Product.stock` for all items.
3. **Transaction**:
   - Create `Order` and associated `OrderItem`s.
   - Update `Product` stock (`stock = stock - CartItem.quantity`).
   - Delete all `CartItem`s for the user (emptying the cart).
4. **Result**: The order is finalized and visible in the user's history.
