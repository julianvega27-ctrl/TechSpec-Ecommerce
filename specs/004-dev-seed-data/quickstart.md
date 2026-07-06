# Quickstart: Testing the Development Seed Data

This guide explains how to quickly validate the development seed data script end-to-end.

## Prerequisites

- PostgreSQL database running and configured in `.env`.
- Backend dependencies installed (`npm install` in `backend` folder).
- Database migrations up to date (`npx prisma migrate dev`).

## 1. Execute the Seed Script

Run the seed command from the `backend` directory:

```bash
cd backend
npm run prisma:seed
```

**Expected Output:**
You should see console logs indicating successful creation of categories, products, orders, and cart items. E.g.:
```
🌱 Seeding started...
✅ Categories upserted.
✅ Products upserted.
✅ Existing client user found.
✅ Sample order upserted.
✅ Sample cart upserted.
🎉 Seeding completed successfully!
```

## 2. Verify Catalog

Start the backend and frontend servers:

```bash
# In backend
npm run dev

# In frontend
npm run dev
```

Navigate to `http://localhost:5173/`. 
- **Expected Outcome**: The catalog should immediately display 30 generated tech products with placeholder images, names, and prices.

## 3. Verify Cart & Checkout

1. Log in using the existing client credentials (`client@test.com`).
2. Navigate to the Cart page.
- **Expected Outcome**: The cart should be pre-populated with a few items from the seeded data.
3. Proceed to Checkout and complete the flow.
- **Expected Outcome**: The checkout flow works seamlessly with the pre-populated items.

## 4. Verify Idempotency

Run the seed command again:

```bash
cd backend
npm run prisma:seed
```

- **Expected Outcome**: The script completes without errors. Navigating to the catalog shows exactly 30 products (no duplicates were created).
