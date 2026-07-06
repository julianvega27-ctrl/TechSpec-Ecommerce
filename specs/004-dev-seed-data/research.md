# Research & Decisions: Development Seed Data

## 1. Idempotency Strategy

**Decision**: Use Prisma's `upsert` method instead of `create` for all records.

**Rationale**: `upsert` allows us to define a unique identifier (like `name` for categories or `id` for products) and update the record if it exists, or create it if it doesn't. This ensures the script can be run multiple times safely without throwing errors or duplicating data.

**Alternatives considered**: 
- Wiping the database (`deleteMany`) and recreating: Dangerous, might accidentally delete user data (e.g., admin and client accounts) which we need to preserve according to the spec.
- Check first then create: Slower and more verbose than using Prisma's built-in `upsert`.

## 2. Pre-existing Users Handling

**Decision**: Query the database for existing users with roles `ADMIN` and `CLIENT` respectively. If they exist, use their IDs to associate with orders and carts. If they DO NOT exist, the script should output a warning or fail safely, as the spec explicitly forbids creating new users.

**Rationale**: The spec strictly mandates not to create new users. The easiest way to find them is querying by role or a known email (e.g. `admin@test.com` and `client@test.com`).

**Alternatives considered**: 
- Hardcoding user IDs: Brittle and likely to fail across different environments.

## 3. Mock Data Generation

**Decision**: Install `@faker-js/faker` as a dev dependency in the `backend` project.

**Rationale**: Generates realistic, varied data for 30 products (names, descriptions, prices) easily without having to hardcode a massive JSON file.

**Alternatives considered**: 
- Hardcoded JSON: Too much manual work to write 30 realistic products.

## 4. Production Guard

**Decision**: Read `process.env.NODE_ENV`. If it equals `'production'`, immediately call `process.exit(0)` with a warning message.

**Rationale**: Standard Node.js way to prevent accidental execution in production. Simple and effective.
