# Feature Specification: Backend Test Coverage Remediation

**Feature Branch**: `[008-backend-test-coverage]`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Analiza el reporte de cobertura de Vitest... Identificar qué cobertura falta y qué pruebas deben crearse..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Decouple Image Upload Logic (Priority: P1)
As a developer, I want to separate the image processing and upload logic from the Administrative controllers into a dedicated service, so that the core product management logic can be tested efficiently in isolation.
**Why this priority**: High coupling prevents robust testing of administrative functions, leaving product creation vulnerable to regressions.
**Independent Test**: Can be verified by running the application and ensuring product creation with image uploads still functions identically.
**Acceptance Scenarios**:
1. **Given** a request to create a product with images, **When** processed by the system, **Then** images are delegated to the upload service and the product is saved successfully.

### User Story 2 - User Profile Protection Validation (Priority: P1)
As a QA engineer, I want the system's profile endpoints to have robust automated validations for authentication and input errors, ensuring user data remains protected.
**Why this priority**: The user module currently lacks validation coverage, posing a security risk.
**Independent Test**: Can be verified by observing automated test passes for profile endpoints.
**Acceptance Scenarios**:
1. **Given** an unauthenticated request, **When** accessing the user profile, **Then** the system denies access.
2. **Given** a password update request missing required fields, **When** submitted, **Then** the system rejects it with a validation error.

### User Story 3 - Shopping Cart Business Rules Validation (Priority: P2)
As a QA engineer, I want to validate edge cases and business rule violations in shopping cart and checkout flows, so that invalid states do not corrupt orders.
**Why this priority**: Missing coverage for edge cases like insufficient stock can lead to fulfilled orders that cannot be processed.
**Independent Test**: Can be verified by observing automated test passes for cart constraint scenarios.
**Acceptance Scenarios**:
1. **Given** an empty cart, **When** a user attempts checkout, **Then** the system rejects the operation.
2. **Given** an invalid cart item ID, **When** a user updates the quantity, **Then** the system reports the item is not found.

### User Story 4 - Third-Party Auth & Recovery Validation (Priority: P3)
As a QA engineer, I want automated validation of third-party login flows and password recovery, so that external integrations function reliably.
**Why this priority**: Recovery and external authentications are critical for user retention.
**Independent Test**: Can be verified by observing automated test passes simulating external provider responses.
**Acceptance Scenarios**:
1. **Given** a valid external authentication token, **When** processed, **Then** a new user account is created if one does not exist.

### Edge Cases

- What happens when a uniqueness constraint is violated during category creation?
- How does the system handle invalid numeric text inputs during product creation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST decouple image processing and storage logic from administrative controllers.
- **FR-002**: System MUST validate error handling for unauthenticated user profile access.
- **FR-003**: System MUST validate business rules for shopping cart operations, including insufficient stock and item not found.
- **FR-004**: System MUST validate administrative product management operations, including data uniqueness constraints.
- **FR-005**: System MUST validate third-party authentication and recovery flows in isolation.

### Key Entities

- **UploadService**: An abstraction layer handling file buffer processing and remote storage interactions.
- **Test Suite**: Automated validations executing HTTP requests and asserting system behavior.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Backend code coverage metric reaches > 80% for statements and branches globally.
- **SC-002**: User profile and authentication modules achieve 100% code coverage.
- **SC-003**: Administrative modules achieve > 80% code coverage.
- **SC-004**: Zero regressions introduced in existing functionality.

## Assumptions

- Automated test infrastructure (containers, databases) is already established and functioning.
- External dependencies (OAuth providers, Image Storage providers) will be mocked during isolated testing.
