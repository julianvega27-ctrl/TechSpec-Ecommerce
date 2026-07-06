---
description: "Task list for Shopping Cart & Checkout Flow implementation"
---

# Tasks: Shopping Cart & Checkout Flow

**Input**: Design documents from `/specs/005-shopping-cart-checkout/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify `zod` and `@hookform/resolvers` are installed in the frontend, install if missing.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Create `frontend/src/context/CartContext.tsx` to manage global cart state (items, total, subtotal, tax).
- [ ] T003 Wrap the main application component in `frontend/src/App.tsx` with `<CartProvider>`.

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Dynamic Cart Management (Priority: P1) 🎯 MVP

**Goal**: Implement real-time cart updates without page reloads and validate stock.

**Independent Test**: Add items to the cart, verify the navbar counter updates instantly, and check the cart page summary.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Update `frontend/src/components/Navbar.tsx` to consume `CartContext` and display the live item count.
- [ ] T005 [US1] Create or update `frontend/src/pages/Cart.tsx` to use `CartContext` for rendering cart items.
- [ ] T006 [US1] Create or update `frontend/src/components/CartItem.tsx` to allow modifying quantities and removing items via Context methods.
- [ ] T007 [US1] Create or update `frontend/src/components/CartSummary.tsx` to display derived Total, Subtotal, and Tax from Context.
- [ ] T008 [P] [US1] Update `backend/src/controllers/cart.controller.ts` to strictly validate `quantity <= product.stock` when adding or updating items.

**Checkpoint**: At this point, User Story 1 should be fully functional.

---

## Phase 4: User Story 2 - Simulated Checkout and Order Confirmation (Priority: P2)

**Goal**: Implement the simulated checkout process, process order via a transaction, and clear the cart.

**Independent Test**: Navigate to checkout, fill mock details, submit, and land on confirmation page.

### Implementation for User Story 2

- [ ] T009 [P] [US2] Create `frontend/src/components/PaymentForm.tsx` using `react-hook-form` and `zod` schema to validate Name, Card Number, Expiry, and CVV.
- [ ] T010 [P] [US2] Create `frontend/src/components/AddressForm.tsx` with basic required shipping fields.
- [ ] T011 [US2] Create `frontend/src/pages/Checkout.tsx` that integrates both forms and a read-only cart summary, submitting data to the order API.
- [ ] T012 [P] [US2] Create `frontend/src/pages/OrderConfirmation.tsx` to display a success message and order ID.
- [ ] T013 [P] [US2] Implement `createOrder` in `backend/src/controllers/order.controller.ts` using `prisma.$transaction` to validate stock, create `Order`/`OrderItem`s, deduct stock, and clear the user's `CartItem`s.
- [ ] T014 [US2] Update `frontend/src/App.tsx` or routing configuration to include `/checkout` and `/order-confirmation` routes.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Order History Visibility (Priority: P3)

**Goal**: Ensure the user can view their newly placed orders.

**Independent Test**: Visit `/orders` and see the new order.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Implement `getUserOrders` in `backend/src/controllers/order.controller.ts` (if not already existing) to fetch orders descending by creation date.
- [ ] T016 [US3] Verify and update `frontend/src/pages/OrderHistory.tsx` to fetch and render the user's orders accurately.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T017 Test end-to-end checkout flow according to `quickstart.md` and fix any UI glitches.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories.
- **User Stories (Phase 3+)**: Must be implemented in sequential order (US1 -> US2 -> US3) since checkout depends on cart logic.

### Parallel Opportunities

- Backend controller updates (`cart.controller.ts` and `order.controller.ts`) can be done in parallel with frontend component creations.
- `PaymentForm` and `AddressForm` components can be built in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently to ensure the cart behaves flawlessly.

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Verify Cart Management (MVP!)
3. Add User Story 2 → Verify simulated payment and backend transaction.
4. Add User Story 3 → Verify order history.
