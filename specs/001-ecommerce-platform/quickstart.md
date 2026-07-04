# Quickstart & Validation Guide: TechSpec Ecommerce Platform

## Prerequisites
- Node.js >= 18
- PostgreSQL Database running
- Cloudinary Account (for image uploads)

## Setup
1. Clone the repository and install dependencies for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Configure environment variables (`.env` in backend with `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_URL`).
3. Run Prisma migrations:
   ```bash
   cd backend && npx prisma migrate dev
   ```

## Validation Scenarios

### Scenario 1: Authentication & Catalog
1. Start backend (`npm run dev`) and frontend (`npm run dev`).
2. Register a new Admin user via API or DB seed.
3. Login as Admin, create a Category and a Product.
4. Open a new incognito window (unauthenticated client).
5. Verify the created product is visible on the frontend catalog.

### Scenario 2: Cart & Checkout
1. Login as a Client.
2. Add a product to the cart.
3. Proceed to checkout.
4. Verify the order is created in the database and the product stock is reduced by the purchased quantity.
