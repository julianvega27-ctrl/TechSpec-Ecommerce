# Tasks: Corrección de Test y Refactorización Backend

**Input**: Design documents from `specs/008-fix-tests-backend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup & Foundational

**Purpose**: Project initialization and basic structure. Since this is a bug fix feature, no major foundational setup is required. The project already uses Express and Vitest.

- [ ] T000 Confirm the backend environment is ready and tests can be executed via `npm run test:coverage`.

---

## Phase 2: User Story 1 - Estandarización de Respuestas API (Priority: P1) 🎯 MVP

**Goal**: Ensure all API successful responses are wrapped in a `{ data: payload }` envelope and auth tests expect correct error properties.

**Independent Test**: Run `npm run test:coverage` and verify that type errors (`TypeError: Cannot read properties of undefined`) in `admin.test.ts`, `catalog.test.ts`, and `auth.test.ts` disappear.

### Implementation for User Story 1

- [x] T001 [P] [US1] Update `getDashboardStats`, `updateSettings`, and `getSettings` to wrap successful responses in a `data` envelope in `backend/src/controllers/admin.controller.ts`
- [x] T002 [P] [US1] Update `getAllCategories` to wrap successful response in a `data` envelope in `backend/src/controllers/category.controller.ts`
- [x] T003 [P] [US1] Update `getAllProducts` and `getProductById` to wrap successful responses in a `data` envelope in `backend/src/controllers/product.controller.ts`
- [x] T004 [P] [US1] Fix integration test assertions to expect `{ error: message }` format instead of `success: false` in `backend/tests/integration/auth.test.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional. Most "Cannot read properties of undefined" errors should be resolved in the test suite.

---

## Phase 3: User Story 2 - Acceso Público a Configuraciones del Sitio (Priority: P2)

**Goal**: Expose the site settings endpoint to public, unauthenticated users.

**Independent Test**: Issue a `GET` request to `/api/admin/settings/hero` without any authorization headers. It should return a 200 OK status instead of 401 Unauthorized.

### Implementation for User Story 2

- [x] T005 [US2] Move `router.get('/settings/:section')` above `router.use(requireAuth)` and `router.use(requireAdmin)` in `backend/src/routes/admin.routes.ts`

**Checkpoint**: At this point, User Story 2 should work independently. The admin settings integration test for public access should pass.

---

## Phase 4: User Story 3 - Semántica HTTP y Enrutamiento Correcto en Carrito/Checkout (Priority: P2)

**Goal**: Fix the endpoints targeted by checkout tests and fix HTTP status code for cart additions.

**Independent Test**: The `checkout.test.ts` integration suite should pass without 404 Not Found errors or HTTP 200/201 assertion mismatches.

### Implementation for User Story 3

- [x] T006 [P] [US3] Change `res.status(200)` to `res.status(201)` upon successful cart item creation in `backend/src/controllers/cart.controller.ts`
- [x] T007 [P] [US3] Update all checkout test requests to use `/api/orders/checkout` instead of `/api/checkout` in `backend/tests/integration/checkout.test.ts`
- [x] T008 [P] [US3] Update tests that check for orders to hit the right endpoints in `backend/tests/integration/checkout.test.ts` (if applicable)

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation and final checks.

- [x] T009 Validate the entire suite passes successfully by running `npm run test:coverage` in `backend/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **User Stories (Phase 2, 3, 4)**: Can proceed in parallel as they touch different domains (Admin/Catalog vs Admin Routes vs Cart/Checkout).
- **Polish (Phase 5)**: Depends on all desired user stories being complete.

### Within Each User Story

- Endpoints and test fixes within US1, US2, and US3 are largely parallelizable since they involve different controllers or different files.

### Parallel Opportunities

- T001, T002, T003, and T004 in US1 can be executed in parallel.
- T006, T007, and T008 in US3 can be executed in parallel.
- Developers can pick up US1, US2, and US3 simultaneously.
