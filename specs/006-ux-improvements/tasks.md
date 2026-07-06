# Tasks: UX Improvements

**Feature Branch**: `[feature/006-ux-improvements]`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup
- [ ] T001 Initialize asset directory for the generated home page image if needed

## Phase 2: User Story 1 - Profile Role Visibility
**Goal**: Hide the role field for non-admin users.
**Independent Test**: Login as a client, go to profile, ensure "Role" is missing.

- [x] T002 [US1] Update `frontend/src/pages/Profile.tsx` to conditionally render the "ROL" input only if `user.role === 'ADMIN'`.

## Phase 3: User Story 2 - User Order History & Password Change
**Goal**: Unify sidebar layouts and add password change functionality.
**Independent Test**: Check sidebar navigation across Profile, Orders, and Security; verify password update.

- [x] T003 [P] [US2] Update `backend/src/controllers/user.controller.ts` to add `updatePassword` method using bcrypt.
- [x] T004 [US2] Update `backend/src/routes/user.routes.ts` to expose `PUT /password` endpoint.
- [x] T005 [P] [US2] Update sidebar in `frontend/src/pages/Profile.tsx` to use `<Link>` components to `/profile`, `/orders`, and `/security`.
- [x] T006 [P] [US2] Update sidebar in `frontend/src/pages/OrderHistory.tsx` to mirror the new unified layout with `<Link>` components.
- [x] T007 [US2] Create `frontend/src/pages/Security.tsx` sharing the unified sidebar layout and containing the password change form.
- [x] T008 [US2] Update `frontend/src/App.tsx` to include the route for `/security`.

## Phase 4: User Story 3 - Homepage Placeholder Image
**Goal**: Display an image on the home page hero section instead of an empty space.
**Independent Test**: Load the home page and verify the image displays correctly.

- [x] T009 [US3] Generate a tech-themed placeholder image using the `generate_image` tool and save it to `frontend/public/images/hero-placeholder.png` (or similar).
- [x] T010 [US3] Update `frontend/src/pages/Home.tsx` to replace the "ESPACIO PARA IMAGEN" div with an `<img />` tag pointing to the new image.

## Phase 5: User Story 4 - Footer Links
**Goal**: Ensure footer links direct to real static pages.
**Independent Test**: Click Terms, Privacy, and Support in the footer and verify the static pages load.

- [x] T011 [P] [US4] Create `frontend/src/pages/Terms.tsx` with static terms content.
- [x] T012 [P] [US4] Create `frontend/src/pages/Privacy.tsx` with static privacy policy content.
- [x] T013 [P] [US4] Create `frontend/src/pages/Support.tsx` with static support info content.
- [x] T014 [US4] Update `frontend/src/App.tsx` to add routes for `/terms`, `/privacy`, and `/support`.
- [x] T015 [US4] Update `frontend/src/components/Footer.tsx` to point the existing links to these new routes.

## Phase 6: Polish
- [x] T016 Verify application builds successfully and all UI components align visually across the unified sidebar layout.
