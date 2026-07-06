# Validation Guide: Shopping Cart & Checkout Flow

## Prerequisites
1. The backend server must be running (`npm run dev` in `backend`).
2. The frontend application must be running (`npm run dev` in `frontend`).
3. You must have seeded data (`npm run prisma:seed` in `backend`) so you have products and users available.

## Validation Scenarios

### Scenario 1: Cart Counter and UI Updates
1. Login as the `CLIENT` user.
2. Navigate to the Catalog and add a product to the cart.
   - **Expected**: The cart counter in the header instantly increments by 1.
3. Open the Cart page.
   - **Expected**: You see the product. The subtotal, tax, and total values are calculated correctly based on the product price.
4. Increase the quantity of the product.
   - **Expected**: The counter updates, and the total/subtotal recalculates instantly.

### Scenario 2: Stock Validation Limit
1. In the Cart, attempt to increase a product's quantity to a number higher than its available stock (e.g., 999).
   - **Expected**: The UI prevents the change and displays an error message indicating insufficient stock.

### Scenario 3: Simulated Checkout
1. With items in your cart, click the "Checkout" button.
2. You will be redirected to the Checkout page showing your order summary.
3. Fill out the simulated payment form with a valid mock card:
   - **Name**: "John Doe"
   - **Card**: "1234123412341234"
   - **Expiry**: "12/26"
   - **CVV**: "123"
4. Submit the payment.
   - **Expected**: The form passes validation, simulates processing, and redirects you to the Order Confirmation screen (no 404 error).

### Scenario 4: Post-Checkout Cleanup and History
1. After the successful checkout, check the Cart counter.
   - **Expected**: The counter is now 0.
2. Navigate to your Order History (`/orders`).
   - **Expected**: The newly placed order is visible at the top of the list with the correct total amount and `PENDING` status.
