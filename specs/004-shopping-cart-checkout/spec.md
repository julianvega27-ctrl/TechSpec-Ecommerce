# Feature Specification: Shopping Cart & Checkout Flow

**Feature Branch**: `[feature/005-shopping-cart-checkout]`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Completar y estabilizar el flujo completo de compra desde el carrito hasta la confirmación del pedido, permitiendo realizar compras simuladas sin utilizar un proveedor de pagos real."

## Clarifications

### Session 2026-07-05
- Q: What should happen if the stock of an item in the cart runs out in the background right before the user submits the checkout? → A: Block checkout, show an error highlighting the out-of-stock items, and require the user to remove or adjust them.

### Session 2026-07-06
- Q: Should existing functional components like the cart and checkout be rewritten or replaced? → A: No. Do not create or replace files that already exist and are functional. The focus is strictly on fixing specific bugs (e.g., the cart counter always indicating 0).
- Q: The checkout form already exists but gives a 404 error upon submission. What should be done? → A: Keep the existing checkout form. Fix the 404 error on submission to allow the simulated payment to complete successfully.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Cart Management (Priority: P1)

Como comprador, quiero poder agregar, modificar y eliminar productos de mi carrito viendo cómo se actualiza instantáneamente la cantidad de items y el resumen de precios, para saber exactamente cuánto pagaré.

**Why this priority**: Es la funcionalidad base del ecommerce antes de poder comprar.

**Independent Test**: Can be fully tested by interacting with the cart page and observing the counter and summary update instantly without page reloads, respecting the maximum stock constraints.

**Acceptance Scenarios**:

1. **Given** an active cart, **When** I add a product, **Then** the cart counter in the header increases immediately.
2. **Given** a product in the cart, **When** I increase the quantity beyond available stock, **Then** the system prevents the action and shows a warning.
3. **Given** a populated cart, **When** I change item quantities or remove items, **Then** the subtotal, taxes, and total update automatically to reflect the exact sum.
4. **Given** a populated cart, **When** I click "empty cart", **Then** all items are removed and the counter becomes zero.

---

### User Story 2 - Simulated Checkout and Order Confirmation (Priority: P2)

Como comprador autenticado, quiero proceder al pago, ingresar los datos de envío y una tarjeta simulada, y confirmar mi compra exitosamente para que el pedido se registre sin usar dinero real.

**Why this priority**: Permite probar y cerrar el ciclo completo de conversión del usuario en la plataforma.

**Independent Test**: Can be fully tested by proceeding to checkout, filling out mock payment details, and verifying the success screen and empty cart afterwards.

**Acceptance Scenarios**:

1. **Given** I am logged in with items in the cart, **When** I proceed to checkout, **Then** I see my order summary, address form, and payment method form.
2. **Given** the payment form, **When** I enter invalid card data (wrong length, missing CVV), **Then** the system shows validation errors and prevents submission.
3. **Given** valid mock payment data, **When** I submit the checkout, **Then** the payment is "successful", the order is created, the stock is deducted, the cart is cleared, and I am redirected to a success confirmation screen (no 404 error).

---

### User Story 3 - Order History Visibility (Priority: P3)

Como comprador, quiero ver mis compras recientes inmediatamente en mi historial para confirmar que la plataforma registró mi pedido correctamente.

**Why this priority**: Brinda confianza al usuario de que su transacción fue procesada y guardada.

**Independent Test**: Can be fully tested by checking the order history page right after a successful checkout.

**Acceptance Scenarios**:

1. **Given** a newly completed checkout, **When** I visit my order history, **Then** I see the new order listed with the correct total amount and "Pending/Success" status.

### Edge Cases

- Checkout submission with out-of-stock items: System must re-verify stock during checkout submission. If any item is out of stock, block the checkout, display an error highlighting the problematic items, and require the user to remove or adjust them.
- How does system handle checkout for unauthenticated users? (Assume they are prompted to log in).
- **Tax Calculation**: Prices shown on products already include the 18% IGV. The checkout summary must display the derived Subtotal and Tax based on the Total.

## Requirements *(mandatory)*

### Constraints
- **CON-001**: Do not overwrite or replace existing functional files (like Cart or Checkout components). Work within the existing architecture and focus on fixing isolated bugs (e.g., the cart counter not updating).
- **CON-002**: Retain the existing checkout form. Address the 404 "page not found" error upon submission to successfully complete the simulated payment flow.

### Functional Requirements

- **FR-001**: System MUST automatically update the cart counter on all pages whenever the cart contents change (add, remove, quantity update, clear) without page reloads.
- **FR-002**: System MUST validate product stock before allowing quantity increases in the cart.
- **FR-003**: System MUST recalculate cart summary instantly: Total (sum of all item prices, as prices already include 18% IGV), Subtotal (Total / 1.18), and Taxes (Total - Subtotal).
- **FR-004**: System MUST allow authenticated users to access the checkout flow.
- **FR-005**: System MUST display a checkout summary including selected products, quantities, economic summary, address (if applicable), and a payment form.
- **FR-006**: System MUST simulate payment locally by validating only card format, length, and required fields (Name, Card Number, Expiration, CVV) without integrating real gateways.
- **FR-007**: System MUST consider the payment successful if local format validation passes.
- **FR-008**: System MUST, upon successful simulated payment, create an order record, deduct the purchased quantities from product stock, and clear the user's cart.
- **FR-009**: System MUST redirect the user to a purchase confirmation page upon success, ensuring no 404 errors occur.
- **FR-010**: System MUST immediately display the newly created order in the user's order history.

### Key Entities *(include if feature involves data)*

- **Cart & CartItem**: State must synchronize in real-time.
- **Product**: Stock must be strictly validated and deducted.
- **Order & OrderItem**: Must be generated upon successful checkout simulation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of cart modifications (add, remove, quantity) reflect in the header counter and price summary without requiring a page refresh.
- **SC-002**: Users can complete the simulated checkout process successfully 100% of the time with valid mock card data.
- **SC-003**: Post-checkout redirects land on a valid confirmation page with 0% 404 error rate.
- **SC-004**: System successfully creates 1 order, clears 1 cart, and deducts stock exactly matching the purchased quantities upon checkout completion.
- **SC-005**: The newly created order appears in the user's history immediately after checkout.

## Assumptions

- Address collection is optional or uses a simplified form if no complex shipping logic exists.
- The existing Prisma schema for Order, OrderItem, Cart, and CartItem is sufficient and will not be modified.
- No external APIs or webhooks will be triggered during checkout.
