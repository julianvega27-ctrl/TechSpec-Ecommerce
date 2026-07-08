# Implementation Tasks: Backend Test Coverage Remediation

## Phase 1: Setup

- [ ] T001 Verify existing Vitest configuration and test containers in `backend/vitest.config.ts` and `backend/tests/setup.ts`

## Phase 2: Foundational

- [x] T002 Implement `UploadService` in `backend/src/services/upload.service.ts` to decouple Multer and Cloudinary logic
- [x] T003 Refactor `admin.controller.ts` in `backend/src/controllers/admin.controller.ts` to use the new `UploadService`

## Phase 3: User Story 1 - Decouple Image Upload Logic (P1)

- **Goal**: Separate image upload logic for testability of admin features.
- **Independent Test**: Start the server and create a product from the frontend to verify image upload still works.
- [x] T004 [P] [US1] Create unit tests for `UploadService` in `backend/tests/unit/upload.service.test.ts` mocking Cloudinary

## Phase 4: User Story 2 - User Profile Protection Validation (P1)

- **Goal**: Increase `user.controller.ts` coverage to 100% via integration tests.
- **Independent Test**: `npm run test:coverage` showing 100% statements for `user.controller.ts`.
- [x] T005 [P] [US2] Create integration test suite in `backend/tests/integration/user.test.ts`
- [x] T006 [US2] Implement test case for unauthenticated access (401) in `backend/tests/integration/user.test.ts`
- [x] T007 [US2] Implement test case for invalid password update payloads (400) in `backend/tests/integration/user.test.ts`
- [x] T008 [US2] Implement test case for successful profile retrieval and update in `backend/tests/integration/user.test.ts`

## Phase 5: User Story 3 - Shopping Cart Business Rules Validation (P2)

- **Goal**: Cover edge cases and errors in `cart.controller.ts` and `order.controller.ts`.
- **Independent Test**: `npm run test:coverage` showing increased branch coverage for these controllers.
- [x] T009 [P] [US3] Add "empty cart checkout" error test (400) in `backend/tests/integration/checkout.test.ts`
- [x] T010 [US3] Add "cart item not found" quantity update error test (404) in `backend/tests/integration/checkout.test.ts`
- [x] T011 [US3] Add "insufficient stock" checkout error test (400) in `backend/tests/integration/checkout.test.ts`

## Phase 6: User Story 4 - Third-Party Auth & Recovery Validation (P3)

- **Goal**: Cover OAuth and recovery methods in `auth.service.ts` using unit tests.
- **Independent Test**: `npm run test:coverage` showing >80% coverage for `auth.service.ts`.
- [x] T012 [P] [US4] Create unit test suite in `backend/tests/unit/auth.service.test.ts`
- [x] T013 [US4] Implement test for `googleOAuth` mocking the Google Auth Library client in `backend/tests/unit/auth.service.test.ts`
- [x] T014 [US4] Implement test for `recoverPassword` edge cases in `backend/tests/unit/auth.service.test.ts`

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T015 Run full coverage suite via `npm run test:coverage`
- [x] T016 Verify no unintended side effects were introduced in `admin.controller.ts`
- [x] T017 Final review of coverage report to ensure >80% threshold is met

## Execution Strategy

1. MVP consists of completing Phase 1, 2, and 4 to address the critical 0% coverage on User endpoints and decouple the most complex file (`admin.controller.ts`).
2. Tasks marked with `[P]` can be executed in parallel since they don't depend on tasks from other user stories.
