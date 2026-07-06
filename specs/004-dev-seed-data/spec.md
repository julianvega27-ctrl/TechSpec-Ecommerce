# Feature Specification: Development Seed Data

**Feature Branch**: `[feature/004-dev-seed-data]`

**Created**: 2026-07-05

**Status**: Draft

**Input**: User description: "Implementar un sistema de seed para desarrollo que genere automáticamente usuarios, categorías, productos y pedidos de ejemplo..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Populate initial development database (Priority: P1)

Como desarrollador, quiero poder ejecutar un comando de seed en mi base de datos vacía para que el sistema se pueble con categorías, productos y pedidos de ejemplo de forma automática.

**Why this priority**: Es la funcionalidad core requerida para poder probar el sistema (catálogo, carrito, checkout, panel) inmediatamente después de ejecutar las migraciones.

**Independent Test**: Can be fully tested by running the seed command on an empty database and verifying that the catalog immediately shows products and categories without manual data entry.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** I run the seed process, **Then** at least 5 categories (e.g., Laptops, Smartphones, Monitores, Accesorios, Componentes) and 30 products are created.
2. **Given** an empty database, **When** I run the seed process, **Then** example orders are generated and associated with the client user.
3. **Given** a database that already has seed data, **When** I run the seed process again, **Then** no duplicate records are created (idempotent execution).

---

### User Story 2 - Testing cart and checkout flow easily (Priority: P2)

Como desarrollador, quiero que el seed opcionalmente me genere un carrito pre-llenado con productos para que yo pueda probar directamente el flujo de checkout sin tener que navegar por el catálogo cada vez.

**Why this priority**: Facilita enormemente las pruebas de la funcionalidad de carrito y checkout.

**Independent Test**: Can be fully tested by logging in as the client user after seeding and verifying the cart already contains items.

**Acceptance Scenarios**:

1. **Given** the seed process has run, **When** I log in with the client user account, **Then** I have items in my active cart ready for checkout.

### Edge Cases

- What happens when the seed process is interrupted halfway? (Should ideally be transactional or cleanly repeatable due to idempotency).
- **Production Guard**: The seed script MUST abort execution if `NODE_ENV === 'production'` to prevent accidentally modifying real data.

## Clarifications

### Session 2026-07-05
- Q: How should we prevent the seed script from accidentally modifying real data in production? → A: Abort if `NODE_ENV === 'production'`.
- Q: What credentials should be used for the seeded Admin and Client users so developers can log in? → A: Do not create users, 2 already exist which is sufficient.
- Q: How should the 30 mock products be generated? → A: Use a mock data library (like Faker.js) to generate realistic variations dynamically.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST create at least 5 tech-related categories (e.g., Laptops, Smartphones, Monitors, Accessories, Components).
- **FR-002**: System MUST create at least 30 products distributed across the created categories.
- **FR-003**: System MUST populate each product with: name, description, brand, price, stock, category, image (temporary/example URLs allowed), and active status. (Uses Faker.js for dynamic realistic variations).
- **FR-004**: System MUST generate sample orders associated with the existing client user, containing products, quantities, unit prices, total amount, and order status.
- **FR-005**: System MAY optionally generate a pre-populated cart with some products for testing purposes.
- **FR-006**: System MUST execute the seed process idempotently (running it multiple times must update or ignore existing records, not duplicate them).
- **FR-007**: System MUST use Prisma Seed mechanism (invoked via `npm run prisma:seed`).
- **FR-008**: System MUST NOT create new users; it will rely on the 2 pre-existing users for testing and sample order association.

### Key Entities *(include if feature involves data)*

- **Category**: Tech categories.
- **Product**: Products with mock data and images.
- **Order**: Sample orders associated with the existing user.
- **Cart**: Associated with the existing client user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can set up a fully populated test database from scratch in under 1 minute.
- **SC-002**: Re-running the seed process 5 times consecutively results in 0 duplicate products, categories, or duplicate admin users.
- **SC-003**: All 30 products are immediately visible in the catalog after running the seed command.
- **SC-004**: Admin panel, catalog, and checkout flows can be fully tested without manual data entry.

## Assumptions

- No real or production data is needed, just representative mock data.
- The seed script only needs to run in development or testing environments.
- Prisma schema remains unchanged; the seed script uses existing models.
- Temporary or placeholder images (e.g., unsplash or via placehold.co) are sufficient since Cloudinary uploads aren't required during the seed script.
