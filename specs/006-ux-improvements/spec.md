# Feature Specification: UX Improvements

**Feature Branch**: `[feature/006-ux-improvements]`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "Múltiples mejoras. Contexto: Esta especificación corresponde a una mejora del proyecto existente "TechSpec Ecommerce Platform". No se trata de una nueva aplicación. La implementación DEBE reutilizar la arquitectura, estructura de carpetas y archivos existentes..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Profile Role Visibility (Priority: P1)

Como usuario cliente, quiero que mi rol no sea visible en mi perfil para evitar confusión con información administrativa.

**Why this priority**: Improves user experience and privacy by hiding system-level information (like "CLIENT" role) from regular users.

**Independent Test**: Can be fully tested by logging in as a client and navigating to the profile page.

**Acceptance Scenarios**:

1. **Given** a logged-in user with role 'CLIENT', **When** they view their profile, **Then** the "Role" field should not be visible.
2. **Given** a logged-in user with role 'ADMIN', **When** they view their profile, **Then** the "Role" field may still be visible or managed appropriately.

---

### User Story 2 - User Order History & Password Change (Priority: P1)

Como usuario cliente, quiero ver únicamente mis propias órdenes en mi historial de pedidos, y quiero poder cambiar mi contraseña desde una sección de "Seguridad".

**Why this priority**: Essential for privacy and security self-service.

**Independent Test**: Can be fully tested by logging in, viewing orders, and updating the password.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they navigate to Order History, **Then** they should only see the orders they have placed.
2. **Given** a logged-in user viewing their profile, **When** they navigate to the Security section, **Then** they should see a form to change their password.

---

### User Story 3 - Homepage Placeholder Image (Priority: P2)

Como visitante, quiero ver una imagen en la página principal (home) donde actualmente falta contenido visual.

**Why this priority**: Improves the visual appeal and completeness of the landing page.

**Independent Test**: Can be fully tested by visiting the home page without logging in.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page, **When** they view the main banner/hero section, **Then** they should see a placeholder image instead of an empty space.

---

### User Story 4 - Footer Links (Priority: P3)

Como visitante, quiero que los enlaces del pie de página (Términos, Privacidad, Soporte) me dirijan a páginas con información real.

**Why this priority**: Provides essential legal and support information to users.

**Independent Test**: Can be fully tested by clicking the footer links.

**Acceptance Scenarios**:

1. **Given** any user on any page, **When** they click "Terms", "Privacy", or "Support" in the footer, **Then** they should be navigated to the respective pages containing that information.

---

### Edge Cases

- What happens if the password change fails due to incorrect current password?
- How does system handle footer pages if they have no backend dynamic content? (They will be static).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST hide the "Role" display on the Profile page for non-admin users.
- **FR-002**: System MUST filter the Order History to only include orders belonging to the currently authenticated user.
- **FR-003**: System MUST provide a UI for users to change their password securely.
- **FR-004**: System MUST display a placeholder image on the home page hero section.
- **FR-005**: System MUST provide distinct static pages for Terms of Service, Privacy Policy, and Support.
- **FR-006**: System MUST link the existing footer buttons to these new static pages.

### Key Entities

- **User**: Profile fields and password update logic.
- **Order**: Filtering by user ID.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of non-admin users can no longer see their role on the profile UI.
- **SC-002**: Order history returns only the active user's orders, never crossing data between users.
- **SC-003**: Password change flow successfully updates the password without errors.
- **SC-004**: Footer links resolve to 200 OK pages with static text content.

## Assumptions

- We assume static placeholder text for the Terms, Privacy, and Support pages is acceptable for now.
- We assume the backend already has an endpoint for changing passwords; if not, we assume we must add a simple update password endpoint following existing patterns.
- We assume the placeholder image can be a static asset or a reliable placeholder URL.
