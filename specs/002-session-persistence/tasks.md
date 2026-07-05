# Tasks: Persistencia de sesión de usuario

**Input**: Design documents from `/specs/002-session-persistence/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- No setup tasks required. Project infrastructure is already in place.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T001 Define `AuthState` extension in `frontend/src/context/AuthContext.tsx` to include `loading: boolean` flag for initial app load.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Persistencia al Recargar (Priority: P1) 🎯 MVP

**Goal**: Almacenar el token en `localStorage` al iniciar sesión y recuperarlo al recargar la página.

**Independent Test**: Iniciar sesión, recargar la página y verificar que el token persiste en el navegador.

### Implementation for User Story 1

- [x] T002 [US1] Update `login` method in `frontend/src/context/AuthContext.tsx` to store the received token in `localStorage`.
- [x] T003 [US1] Update state initialization in `frontend/src/context/AuthContext.tsx` to read the token from `localStorage` on initial load.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Validación de Token (Priority: P1)

**Goal**: Validar el token almacenado con el backend al iniciar la app y manejar estados de carga y error.

**Independent Test**: Alterar el token en localStorage o apagar el servidor, y recargar para verificar que la sesión se limpia y se redirige a login.

### Implementation for User Story 2

- [x] T004 [US2] Add a `useEffect` hook in `frontend/src/context/AuthContext.tsx` to fetch user data on mount if a token exists in `localStorage`.
- [x] T005 [US2] Update `frontend/src/context/AuthContext.tsx` to handle validation failure (e.g., 401 or network error) by clearing the local session and setting `loading` to false.
- [x] T006 [US2] Update the `AuthProvider` return in `frontend/src/context/AuthContext.tsx` to render a full-screen loading spinner (e.g., `<Indicators />`) while `loading` is true.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Cierre de Sesión Limpio (Priority: P2)

**Goal**: Eliminar el token del navegador al cerrar sesión.

**Independent Test**: Hacer clic en "Cerrar sesión" y verificar que el token se elimina de `localStorage`.

### Implementation for User Story 3

- [x] T007 [US3] Update `logout` method in `frontend/src/context/AuthContext.tsx` to call `localStorage.removeItem('token')`.
- [x] T008 [US3] Update `frontend/src/components/Navbar.tsx` to conditionally render "Mi perfil" when `user` exists, linking to `/profile` where the user can then log out.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T009 Run quickstart.md validation to verify end-to-end functionality.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A
- **Foundational (Phase 2)**: BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational
- **User Story 2 (P1)**: Integrates with US1 logic (validating the token recovered in US1).
- **User Story 3 (P2)**: Integrates with US1 logic (removing the token).

### Parallel Opportunities

- Due to the concentrated nature of this feature (mostly modifying `AuthContext.tsx`), tasks are heavily sequential and should ideally be done by a single developer to avoid merge conflicts on the same file.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
