# Implementation Plan: Administrator CRUD Stabilization

## Technical Context

We are extending the existing Admin Dashboard to stabilize CRUD operations and add new Dashboard and Home Content Management features.
We have already implemented the Prisma models (`SiteSettings`), services (`AdminService`), and controllers.
The remaining work is strictly frontend UI integration for Dashboards and the Hero component.

## Constitution Check

- **Reusability**: We are modifying existing components like `Hero.tsx` and `Dashboard.tsx`.
- **Consistency**: We use existing UI tokens and patterns.
- **Reliability**: We add error states and loading indicators for the new API calls.

## Phase 0: Research

- **Dashboards**: We will use simple CSS Grid layouts to display the stats returned by `/admin/dashboard` (which returns `todaysSales, pendingOrders, activeUsers, lowStockProducts, recentOrders`).
- **Hero Update**: We will use `useEffect` in `Hero.tsx` (or pass props from `Home.tsx`) to fetch `/settings/HOME_HERO`. Since it's a public route, no auth is needed. If it fails, we fall back to the default hardcoded text.

## Phase 1: Data Model & Contracts

### Data Model (`SiteSettings`)
```prisma
model SiteSettings {
  id            String   @id @default(uuid()) @db.Uuid
  section       String   @unique
  content       Json
  imageUrl      String?
  imagePublicId String?
  updatedAt     DateTime @updatedAt
}
```

### API Contracts
- `GET /api/settings/:section` (Public) -> Returns `{ content: { title, subtitle }, imageUrl }`
- `GET /api/admin/dashboard` (Private) -> Returns `{ todaysSales, pendingOrders, activeUsers, lowStockProducts, recentOrders }`

## Phase 2: Tasks

The generated tasks will reflect the remaining frontend work for Dashboards and Hero integration.
