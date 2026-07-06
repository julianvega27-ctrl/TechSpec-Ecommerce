---
description: "Task list for Development Seed Data implementation"
---

# Tasks: Development Seed Data

**Input**: Design documents from `/specs/004-dev-seed-data/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `@faker-js/faker` as a development dependency in `backend/package.json`
- [x] T002 Update `backend/package.json` to include `"prisma": { "seed": "ts-node prisma/seed.ts" }` script

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `backend/prisma/seed.ts` file and set up PrismaClient instance
- [x] T004 Implement production guard (`NODE_ENV === 'production'`) in `backend/prisma/seed.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Populate initial development database (Priority: P1) 🎯 MVP

**Goal**: Automatically populate the database with categories, products, and sample orders so it can be tested instantly.

**Independent Test**: Can be fully tested by running `npm run prisma:seed` and querying the database to see the records.

### Implementation for User Story 1

- [x] T005 [US1] Upsert 5 static tech categories (Laptops, Smartphones, etc.) in `backend/prisma/seed.ts`
- [x] T006 [US1] Query existing `ADMIN` and `CLIENT` users to retrieve their IDs in `backend/prisma/seed.ts`
- [x] T007 [US1] Generate and upsert 30 products using `@faker-js/faker` assigned to the created categories in `backend/prisma/seed.ts`
- [x] T008 [US1] Create sample orders associated with the found `CLIENT` user in `backend/prisma/seed.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional.

---

## Phase 4: User Story 2 - Testing cart and checkout flow easily (Priority: P2)

**Goal**: Generate a pre-populated cart to easily test checkout flows without navigating the catalog.

**Independent Test**: After seeding, logging in as the client should show items already in the active cart.

### Implementation for User Story 2

- [x] T009 [US2] Generate and upsert an active cart containing products for the `CLIENT` user in `backend/prisma/seed.ts`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 Verify idempotency by running `npm run prisma:seed` consecutively multiple times without errors or duplicate data

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P2)**: Can start after User Story 1 (P1) because it relies on the users and products generated.

### Parallel Opportunities

- Due to the nature of a single seed script file, tasks within US1 and US2 are sequential.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently by running the seed command.

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 → Run seed and verify catalog and orders (MVP!)
3. Add User Story 2 → Run seed and verify cart flow
