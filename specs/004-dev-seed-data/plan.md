# Implementation Plan: Development Seed Data

**Branch**: `[feature/004-dev-seed-data]` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-dev-seed-data/spec.md`

## Summary

Implement a development database seed script using Prisma (`prisma/seed.ts`) and `Faker.js` to automatically populate 5 categories, 30 mock products, and sample orders associated with existing users. The script must be idempotent and strictly guarded against running in a production environment.

## Technical Context

**Language/Version**: TypeScript / Node.js

**Primary Dependencies**: Prisma Client (`@prisma/client`), Faker.js (`@faker-js/faker` as dev dependency)

**Storage**: PostgreSQL (via Prisma ORM)

**Testing**: N/A (Manual CLI verification)

**Target Platform**: Backend Node.js / Development environment

**Project Type**: Database Seed Script

**Performance Goals**: Finish execution in under 1 minute.

**Constraints**: MUST abort execution if `NODE_ENV === 'production'`. MUST be idempotent (run multiple times safely). MUST NOT create new users.

**Scale/Scope**: 5 categories, 30 products, sample orders and cart for 1 existing client user.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Simplicity**: Using standard Prisma `upsert` functions and `faker.js` for data generation.
- **Architecture**: The script will reside in the standard `prisma/seed.ts` location as recommended by Prisma.
- **Project Stability**: `faker.js` will be added as a dev dependency only. Existing models will be used.

## Project Structure

### Documentation (this feature)

```text
specs/004-dev-seed-data/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
backend/
├── prisma/
│   └── seed.ts           # The Prisma seed script
└── package.json          # Will be updated to include "prisma": { "seed": "ts-node prisma/seed.ts" }
```

**Structure Decision**: The logic will reside entirely within `backend/prisma/seed.ts` as it's the idiomatic location for Prisma seed scripts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
