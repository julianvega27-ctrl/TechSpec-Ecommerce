# Research & Technical Decisions: Shopping Cart & Checkout Flow

## Context

This document outlines the technical decisions made for implementing the shopping cart and checkout flow, ensuring it aligns with the project's existing architecture and avoids external payment gateway dependencies.

## Decisions

### 1. Cart State Management
- **Decision**: Use React Context (or existing global state solution like Zustand if present, else React Context) for the `CartProvider` in the frontend.
- **Rationale**: The cart counter must update globally (e.g. in the navigation header) without page reloads. A central React Context allows components like `CartCounter`, `CartItem`, and `CartSummary` to subscribe to the same state and update synchronously.
- **Alternatives considered**: Passing props up to a common ancestor (too much prop drilling) or relying strictly on React Query / SWR without global state (can lead to slight delays or UI tearing).

### 2. Simulated Payment Validation
- **Decision**: Use `zod` and `react-hook-form` to build a mock checkout schema that enforces standard credit card formatting without interacting with Stripe/PayPal.
- **Rationale**: Ensures the form behaves realistically for a user (validating 16-digit card numbers, MM/YY expiry dates, and 3-4 digit CVV) while satisfying the non-functional requirement of maintaining a local-only simulation.
- **Alternatives considered**: Integrating a Stripe test-mode form. Rejected because the spec explicitly forbid external provider integrations.

### 3. Stock Validation and Transaction Atomicity
- **Decision**: Perform a final stock validation inside a Prisma Transaction (`prisma.$transaction`) during the `/api/orders` creation endpoint.
- **Rationale**: This prevents race conditions where an item runs out of stock exactly when the user submits their payment. If validation fails in the transaction, it rolls back and the frontend is notified with a 400 error indicating which items failed.
- **Alternatives considered**: Checking stock sequentially before creating the order. Rejected due to the risk of race conditions in high-concurrency scenarios.

### 4. Tax Calculation Strategy
- **Decision**: Derived calculation on the frontend and backend. The product `price` is considered the Final Price (including the 18% IGV). Subtotal and Tax are derived as: `Subtotal = Total / 1.18` and `Tax = Total - Subtotal`.
- **Rationale**: Aligns with the clarification provided by the stakeholder: "el precio en el producto debe ser el final, incluido el impuesto del 18%".
- **Alternatives considered**: Calculating Tax as an addition to the listed price, which was explicitly rejected by the business logic clarification.
