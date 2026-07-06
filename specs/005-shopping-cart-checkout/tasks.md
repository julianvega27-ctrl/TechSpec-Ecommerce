# Implementation Tasks: Shopping Cart & Checkout Flow

**Feature**: `[feature/005-shopping-cart-checkout]`

**Purpose**: Fix identified bugs in existing functional implementations (Cart counter & Checkout 404)

---

## Phase 1: Targeted Bug Fixes

**Goal**: Resolve the cart counter remaining at 0 and the 404 error when submitting the checkout form, while preserving all existing files and architectures.

- [x] T001 [US1] Update `frontend/src/components/Navbar.tsx` to consume `CartContext` and display the dynamic cart item count instead of hardcoded '0'.
- [x] T002 [US2] Update `frontend/src/pages/Checkout.tsx` (and verify axios configuration) to fix the 404 error upon form submission by correcting the API endpoint path (e.g., verifying if `/orders/checkout` needs the `/api` prefix).

**Checkpoint**: At this point, the cart counter should work and the checkout payment simulation should successfully create an order and redirect properly.

---

## Dependencies
- Both tasks can be completed in parallel (T001 and T002 have no inter-dependencies).

## Execution Strategy
1. Identify and fix the cart icon state via Context.
2. Debug the Axios POST request in `Checkout.tsx` to ensure it hits the Express backend `router.post('/checkout')` successfully.
