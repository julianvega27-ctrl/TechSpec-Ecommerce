# Feature Specification: TechSpec Ecommerce Platform

**Feature Branch**: `[001-ecommerce-platform]`

**Created**: 2026-07-04

**Status**: Draft

**Input**: User description: "Especificación funcional – TechSpec Ecommerce..."

## Clarifications

### Session 2026-07-04
- Q: What should happen if two users try to buy the last unit of stock at the same time? → A: Deny the second user at the checkout confirmation step (First to confirm wins).
- Q: What should happen if an admin attempts to delete a category that currently has active products associated with it? → A: Prevent deletion and show an error explaining that products must be re-categorized first.
- Q: How should payment processing be handled for the initial MVP? → A: Abstract/simulate payment entirely (assume checkout is successful immediately).
- Q: For user identity, should we rely strictly on email/password, or include Social SSO (Google/Facebook)? → A: Email/Password + Google OAuth.
- Q: How long should a user's shopping cart persist in the database if abandoned before being cleared? → A: 7 days.
- Q: How should the shopping cart state be managed for unauthenticated (guest) users before they log in? → A: Do not support guest carts; require login before adding items to the cart.
- Q: Will a product support multiple images (an image gallery), or will it be strictly limited to a single image? → A: Support multiple images per product (gallery).
- Q: How should the system handle displaying a large number of products in the catalog or search results? → A: Standard pagination (e.g., Next/Previous buttons and page numbers).
- Q: What are the explicit data model relationships? → A: User:Orders (1:N), Category:Products (1:N), Product:Category (N:1), Product:CartItems (1:N), Product:OrderItems (1:N), Order:OrderItems (1:N).
- Q: What are the specific rules for Google OAuth user accounts? → A: Both Email/Password and Google OAuth are allowed. Google ID is stored, password can be null for OAuth users, but email must remain universally unique.
- Q: How exactly are Cloudinary images managed for products? → A: Store both `imageUrl` and `imagePublicId` in the database to allow future updates/deletions without orphaning resources.

## User Scenarios & Testing *(mandatory)*

### User Story 0 - UI Implementation and Structure (Priority: P0)

As a frontend developer, I want to implement the complete visual structure of the application (Home, Navbar, Footer, Hero, Catalog, Login, Register, Profile, Dashboard Admin, Checkout, etc.) using mock data and no business logic or API calls, so that the visual foundation is established before integrating the backend.

**Why this priority**: Building the visual components first ensures strict adherence to the design guidelines (`docs/DESIGN.md` and `docs/assets/`) and allows subsequent stories to focus on wiring up logic.

**Independent Test**: Can be fully tested by visually inspecting all pages to verify they match the design assets and use mock data correctly, with no network requests to an API.

**Acceptance Scenarios**:

1. **Given** a user navigates to the application, **When** they view any page (Home, Catalog, Dashboard, etc.), **Then** the layout, colors, and typography strictly follow `docs/DESIGN.md` and images in `docs/assets/`.
2. **Given** the application is running, **When** components are rendered, **Then** they display hardcoded mock data and perform no real business logic.

---

### User Story 1 - Customer Catalog Browsing and Search (Priority: P1)

As a customer, I want to explore the catalog, search for products, and filter them by category, so I can easily find technological products like laptops or accessories.

**Why this priority**: Discoverability of products is the foundation of an ecommerce store. Without it, no purchases can happen.

**Independent Test**: Can be fully tested by verifying that products are displayed, search returns relevant items, and category filters restrict the view correctly without requiring login. (Must reuse components created in US0).

**Acceptance Scenarios**:

1. **Given** the customer is on the homepage, **When** they click a category, **Then** the logic is connected to the US0 components and only active products in that category are displayed.
2. **Given** the customer uses the search bar, **When** they type "laptop", **Then** the catalog shows active products matching the keyword using real API data.
3. **Given** the customer selects a product, **When** they view the product details, **Then** name, description, brand, category, price, stock, and image gallery are visible, driven by real logic.

---

### User Story 2 - Shopping Cart Management (Priority: P1)

As an authenticated customer, I want to add products to my cart, modify quantities, and see the subtotal and total, so I can review my order before checkout.

**Why this priority**: Cart functionality is the core mechanism for preparing a purchase.

**Independent Test**: Can be fully tested by adding, modifying, and removing items in the cart and verifying that calculations for subtotal and total update accurately. (Must reuse components created in US0).

**Acceptance Scenarios**:

1. **Given** an authenticated customer is viewing a product with stock, **When** they add it to the cart, **Then** the cart item count increases and the product is listed in the cart, replacing the mock behavior from US0.
2. **Given** the customer is in the cart, **When** they modify the quantity of a product, **Then** the subtotal and total calculate correctly with real state management.
3. **Given** the customer is viewing a product with zero stock, **When** they try to add it to the cart, **Then** the system prevents the action and shows an out-of-stock message.
4. **Given** an unauthenticated user is viewing a product, **When** they try to add it to the cart, **Then** they are prompted to log in or register.

---

### User Story 3 - Checkout and Order Confirmation (Priority: P1)

As an authenticated customer, I want to confirm my purchase, so I can place an order and have the stock updated accordingly.

**Why this priority**: Generating orders is the business goal of the platform.

**Independent Test**: Can be fully tested by taking a populated cart through checkout to generate a pending order and reduce product stock. (Must reuse checkout components from US0).

**Acceptance Scenarios**:

1. **Given** an authenticated customer has items in their cart, **When** they confirm the purchase, **Then** a new order is registered, stock is decreased, and the cart is emptied using real backend logic.

---

### User Story 4 - Administrator Product Management (Priority: P2)

As an administrator, I want to manage products (create, edit, delete, activate/deactivate) and categories, so I can keep the catalog updated.

**Why this priority**: Crucial for maintaining the store's inventory, but initial products could technically be seeded without UI. It's high priority for ongoing operations.

**Independent Test**: Can be fully tested by logging in as admin and manipulating products and categories in the dashboard. (Must reuse dashboard components from US0).

**Acceptance Scenarios**:

1. **Given** the admin is in the product management dashboard, **When** they deactivate a product, **Then** the real API is called and the product immediately becomes invisible to customers.
2. **Given** the admin is creating a new product, **When** they fill out all required fields and submit, **Then** the product is saved to the database and appears in the catalog.

---

### Edge Cases

- What happens when two users try to buy the last unit of stock simultaneously? → The second user to confirm checkout is denied with an out-of-stock error (First to confirm wins).
- How does system handle a user abandoning a cart with items? → Stock is not reserved, and the abandoned cart is automatically cleared after 7 days of inactivity.
- What happens if an admin deletes a category that currently has active products associated with it? → The system prevents deletion and shows an error explaining that products must be re-categorized first.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow customers to register, login, and recover passwords using standard Email/Password, and also support Google OAuth for Social SSO. Email MUST be universally unique, and local passwords can be optional for Google OAuth users.
- **FR-002**: System MUST allow customers to browse, search, and filter active products by category with standard pagination.
- **FR-003**: System MUST display product details including name, description, brand, category, price, stock, image gallery, and status.
- **FR-004**: System MUST allow authenticated customers to add products with available stock to a shopping cart, modify quantities, remove items, and empty the cart. Unauthenticated users MUST be prompted to log in.
- **FR-005**: System MUST calculate cart subtotal and total dynamically.
- **FR-006**: System MUST allow authenticated customers to confirm a purchase, register the order, deduct stock, and empty the cart upon success.
- **FR-007**: System MUST track order states (Pending, Processing, Shipped, Delivered, Canceled) and prevent modification of Delivered orders.
- **FR-008**: System MUST allow customers to view order history and edit their profile.
- **FR-009**: System MUST provide an administrative dashboard restricted to admin users.
- **FR-010**: System MUST allow administrators to create, edit, delete, and toggle the status (Active/Inactive) of products and categories.
- **FR-011**: System MUST allow administrators to manage users and orders.
- **FR-012**: System MUST allow administrators to view basic statistics (Total Revenue, Total Orders, Pending Orders count) and generate CSV reports for orders.
- **FR-013**: System MUST restrict catalog visibility to only Active products for customers.

### Key Entities *(include if feature involves data)*

- **User**: Represents clients and administrators (auth credentials, role, profile details).
- **Product**: Represents sellable items (name, description, brand, category reference, price, stock, images/gallery, status).
- **Category**: Represents product classifications (name, description, status).
- **Cart/CartItem**: Represents transient items intended for purchase.
- **Order/OrderItem**: Represents confirmed purchases (user reference, items, total, status).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers can successfully register, log in, browse products, and complete a checkout flow without errors.
- **SC-002**: Administrators can successfully add new products and categories, and see them reflected in the customer-facing catalog immediately.
- **SC-003**: Stock is accurately deducted only upon order confirmation, and out-of-stock items cannot be purchased.
- **SC-004**: The system enforces role-based access control, strictly preventing customers from accessing administrator interfaces.

## Assumptions

- Users have stable internet connectivity.
- Stock is not reserved when items are added to the cart; it is only deducted upon final order confirmation.
- Payment processing is fully abstracted/simulated for this initial functional scope (assumed successful immediately).
- Email delivery for password recovery is handled via a standard third-party service (e.g., SendGrid or simulated in dev).
