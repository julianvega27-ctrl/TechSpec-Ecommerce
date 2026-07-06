# Feature Specification: Administrator CRUD Stabilization

**Feature Branch**: `[004-admin-crud-stabilization]`
**Created**: 2026-07-05
**Status**: Draft
**Input**: User description: "Feature: Administrator CRUD Stabilization..."

## Clarifications

### Session 2026-07-05
- Q: Sobre los paneles de "Estadísticas, Dashboard y Reportes", ¿cómo deberían estructurarse visualmente en el panel de administración? → A: Crear tres vistas separadas en el menú lateral: Dashboard, Estadísticas detalladas y Reportes.
- Q: Almacenamiento de configuración del Home → A: Almacenar en la base de datos a través de Prisma (modelo SiteSettings) en lugar de un archivo estático.

## User Scenarios & Testing

### Product Management
**Scenario**: The administrator wants to manage products.
- **Action**: Navigates to the products panel, creates a new product with an image, edits an existing product, deactivates a product, or deletes a product.
- **Expected Outcome**: The product is created with its image uploaded to Cloudinary. Edited details are updated. Deactivated products become unavailable. Deleted products are removed completely from the catalog.

### Category Management
**Scenario**: The administrator wants to manage categories.
- **Action**: Navigates to the categories panel, creates a new category, edits an existing one, deactivates it, or attempts to delete it.
- **Expected Outcome**: The category is created, updated, or deactivated. If the administrator attempts to delete a category that has associated products, the system prevents it and shows an error.

### User Management
**Scenario**: The administrator wants to manage users.
- **Action**: Navigates to the users panel, views user details, changes a user's role to ADMIN or CLIENT, or deactivates a user.
- **Expected Outcome**: The user's role or status is updated. The administrator cannot physically delete a user. The system prevents demoting or deactivating the last active administrator.

### Order Management
**Scenario**: The administrator wants to manage orders.
- **Action**: Navigates to the orders panel, views the details of a specific order, and updates its status (e.g., to SHIPPED or DELIVERED).
- **Expected Outcome**: The order status is successfully updated.

### Dashboard and Analytics
**Scenario**: The administrator wants to overview the system state.
- **Action**: Navigates to the distinct dashboard, statistics, and reports views in the sidebar.
- **Expected Outcome**: The administrator can view the general Dashboard, access detailed Statistics in a separate view, and consult specific Reports in another view.

### Home Content Management
**Scenario**: The administrator wants to update the Hero section on the Home page.
- **Action**: Navigates to the settings/home panel and updates the title, subtitle, and hero image.
- **Expected Outcome**: The information is saved securely and the public Home page immediately reflects the changes. The image is uploaded to Cloudinary.

### Security
**Scenario**: A CLIENT user attempts to access the admin panel.
- **Action**: Navigates to any admin route.
- **Expected Outcome**: The system denies access and returns an HTTP 403 status code.

## Functional Requirements

- **FR-001 (Products)**: The system must allow administrators to create, read, update, delete (CRUD), and toggle the active status of products.
- **FR-002 (Images)**: Product images must be uploaded to and stored in Cloudinary during creation or updates.
- **FR-003 (Categories)**: The system must allow administrators to create, read, update, delete (CRUD), and toggle the active status of categories. Deletion must be prevented if the category has associated products.
- **FR-004 (Users)**: The system must allow administrators to view users, change their roles (CLIENT/ADMIN), and toggle their active status. Physical deletion of users must be prevented.
- **FR-005 (Orders)**: The system must allow administrators to view all orders, view order details, and update the status of orders.
- **FR-006 (Dashboards)**: The system must provide basic dashboards, statistics, and reports for administrators.
- **FR-007 (Site Settings)**: The system must allow administrators to edit the content of the Home page (title, subtitle, hero image).
- **FR-008 (Security)**: All administrative endpoints and interfaces must be strictly accessible only by users with the ADMIN role. Attempts by CLIENT users must result in an HTTP 403 response.
- **FR-009 (Validation)**: All administrative forms must use React Hook Form and Zod for frontend validation. The backend must enforce equivalent validations.
- **FR-010 (API Consistency)**: All administrative endpoints must return standard, consistent responses adhering to the project's Constitution.

## Key Entities

- `Product`: (Extended with image URLs and active status).
- `Category`: (Extended with active status).
- `User`: (Extended with active status and role management).
- `Order`: (Status management).
- `SiteSettings`: (Stores the Home page dynamic content).

## Assumptions

- We assume Cloudinary is already configured in the environment variables, or will be configured without needing architectural changes.
- "Deactivated" entities (Products/Categories/Users) should be hidden or disabled for standard clients, but visible and manageable by administrators.
- Dashboards require aggregating basic counts and sums from Prisma (e.g. total sales, order counts).

## Success Criteria

- **SC-001**: An administrator can successfully create a product with an image, update its details, deactivate it, and delete it without errors.
- **SC-002**: An administrator cannot delete a category if it contains products.
- **SC-003**: The last active administrator cannot be demoted to CLIENT or deactivated.
- **SC-004**: An administrator can change an order's status and the change is reflected immediately.
- **SC-005**: An administrator can view a dashboard with statistics and metrics without errors.
- **SC-006**: An administrator can update the Home page content and see the changes reflected immediately on the public landing page.
- **SC-007**: A user with the CLIENT role receives a 403 Forbidden error when attempting to access any admin URL or API endpoint.
- **SC-008**: Forms reject invalid data immediately on the frontend and backend with clear error messages.
- **SC-009**: Existing client-facing functionalities (catalog, checkout) continue to work flawlessly.

## Edge Cases

- **Concurrent Edits**: What happens if two administrators edit the same product simultaneously? (Last write wins by default).
- **Deactivated Products in Cart**: If a product is deactivated, it should no longer be purchasable, and users with the product in their cart should receive an error at checkout.
- **Role Degradation**: What happens if an administrator demotes themselves? (Prevented if they are the last administrator).
