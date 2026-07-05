# Tasks: Administrator CRUD Stabilization

**Input**: Design documents from `/specs/003-admin-crud-stabilization/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- No setup tasks required beyond existing architecture.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T001 Define `SiteSettings` model in `backend/prisma/schema.prisma` and generate migration.
- [x] T002 Update `requireAdmin` middleware in `backend/src/middlewares/auth.middleware.ts` to strictly return HTTP 403 instead of 401 when a CLIENT accesses.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Gestión de Productos (Priority: P1)

**Goal**: El administrador accede al panel de productos para realizar operaciones CRUD y activar/desactivar productos, gestionando correctamente las imágenes en Cloudinary.

**Independent Test**: Modificar y eliminar un producto y comprobar que su imagen es borrada del storage de Cloudinary.

### Implementation for User Story 1

- [x] T003 [P] [US1] Update `backend/src/services/product.service.ts` to delete the image from Cloudinary when a product is deleted or its image is updated.
- [x] T004 [US1] Update `backend/src/controllers/cart.controller.ts` (or service) to ignore deactivated products when retrieving a user's active cart.

---

## Phase 4: User Story 2 - Gestión de Categorías (Priority: P1)

**Goal**: Evitar eliminar categorías que tengan productos asociados.

**Independent Test**: Intentar borrar una categoría con productos asignados y recibir un error 400.

### Implementation for User Story 2

- [x] T005 [P] [US2] Update `backend/src/services/category.service.ts` to throw an error if attempting to delete a category that has related products.

---

## Phase 5: User Story 3 - Gestión de Pedidos y Usuarios (Priority: P2)

**Goal**: Impedir la degradación del último administrador activo.

**Independent Test**: Intentar cambiar a CLIENT al último usuario ADMIN y recibir un error 400.

### Implementation for User Story 3

- [x] T006 [P] [US3] Update `backend/src/services/user.service.ts` to reject changing the role to CLIENT or deactivating if the user is the last active ADMIN.

---

## Phase 6: User Story 5 - Gestión de Contenido del Home (Priority: P2)

**Goal**: Permitir la edición del texto e imagen del Home (sección Hero) mediante un panel administrativo y mostrarlo en la ruta principal.

**Independent Test**: Cambiar el título e imagen del Hero desde el panel y verlo reflejado en `/`.

### Implementation for User Story 5

- [x] T007 [US5] Create `backend/src/services/admin.service.ts` (or `siteSettings.service`) to handle reading and writing `SiteSettings` from Prisma.
- [x] T008 [US5] Create `backend/src/controllers/admin.controller.ts` and add routes in `backend/src/routes/admin.routes.ts` for SiteSettings.
- [x] T009 [US5] Create `frontend/src/pages/Admin/Settings.tsx` to provide a form with React Hook Form and Zod to edit the Hero section.
- [x] T010 [US5] Update `frontend/src/components/Hero.tsx` (and `Home.tsx` if necessary) to fetch and display the dynamic SiteSettings data on load.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T011 Run quickstart.md validation to verify end-to-end functionality.

---

## Dependencies & Execution Order

- **Foundational (Phase 2)**: BLOCKS Phase 6 (US5 requires SiteSettings model).
- **Phase 3, 4, 5**: Can be executed independently in parallel.
- **Phase 6**: Depends on Phase 2 completion.
- **Polish (Final Phase)**: Depends on all user stories.

## Implementation Strategy

### Incremental Delivery

1. Complete Foundational (Prisma migration and Middleware).
2. Execute US1, US2, US3 independently.
3. Execute US5 (Backend -> Frontend integration).
4. Polish and test.
