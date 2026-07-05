# Data Model: TechSpec Ecommerce Platform

## Entities

### User
- `id` (UUID, PK)
- `email` (String, Unique)
- `password` (String, Hashed, Optional if using Google OAuth)
- `googleId` (String, Optional, Unique)
- `name` (String)
- `role` (Enum: CLIENT, ADMIN)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Category
- `id` (UUID, PK)
- `name` (String, Unique)
- `description` (String, Optional)
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Product
- `id` (UUID, PK)
- `name` (String)
- `description` (String)
- `brand` (String)
- `categoryId` (UUID, FK -> Category.id)
- `price` (Decimal)
- `stock` (Int)
- `imageUrl` (String) - Points to Cloudinary
- `imagePublicId` (String) - Cloudinary public identifier
- `isActive` (Boolean, Default: true)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### CartItem (Transient or persisted for 7 days)
- `id` (UUID, PK)
- `userId` (UUID, FK -> User.id)
- `productId` (UUID, FK -> Product.id)
- `quantity` (Int)
- `addedAt` (DateTime)

### Order
- `id` (UUID, PK)
- `userId` (UUID, FK -> User.id)
- `totalAmount` (Decimal)
- `status` (Enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELED)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### OrderItem
- `id` (UUID, PK)
- `orderId` (UUID, FK -> Order.id)
- `productId` (UUID, FK -> Product.id)
- `quantity` (Int)
- `unitPrice` (Decimal)

## Relationships
- **User (1) to Order (N)**: A User can have multiple Orders.
- **Category (1) to Product (N)**: A Category can contain multiple Products.
- **Product (N) to Category (1)**: A Product belongs to a single Category.
- **Product (1) to CartItem (N)**: A Product can appear in multiple CartItems.
- **Product (1) to OrderItem (N)**: A Product can appear in multiple OrderItems.
- **Order (1) to OrderItem (N)**: An Order can contain multiple OrderItems.

## Rules & Constraints
- A Category cannot be deleted if it has associated Products (Enforced via application logic before DB operation).
- Order items lock the `unitPrice` at the time of purchase.
- Cart items expire 7 days after `addedAt`.
- Passwords are optional only if `googleId` is provided (OAuth). Email remains universally unique.
- Cloudinary images use `imageUrl` and `imagePublicId` to ensure resources can be safely updated/deleted without orphaning.
