# Implementation Plan: Backend Test Coverage Remediation

**Branch**: `[008-backend-test-coverage]` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-backend-test-coverage/spec.md`

## Summary

This plan outlines the testing and refactoring strategy to bring backend code coverage above the critical 50% threshold. The primary technical approach involves extracting the coupled image upload logic (Multer/Cloudinary) from `admin.controller.ts` into a dedicated `UploadService`, enabling unit and integration testability. Following this, robust integration tests using Vitest and Supertest will be implemented for `user.controller.ts`, `cart.controller.ts`, `order.controller.ts`, and `auth.service.ts` to cover happy paths, edge cases, and error states.

## Technical Context

**Language/Version**: TypeScript 5+ on Node.js

**Primary Dependencies**: Vitest, Supertest, Express.js, Prisma ORM, Multer, Cloudinary SDK, Zod

**Storage**: PostgreSQL (via Prisma)

**Testing**: Vitest + Supertest (using existing Testcontainers setup)

**Target Platform**: Node.js backend environment

**Project Type**: REST API Backend

**Performance Goals**: N/A for this testing feature.

**Constraints**: Adhere strictly to the project Constitution (simplicity, single responsibility, no tech stack changes, images strictly in Cloudinary).

**Scale/Scope**: ~10 files modified, focusing purely on testing and controller-service decoupling.

## Constitution Check

*GATE: Passed*

- **Simplicity & Single Responsibility**: Extracting `UploadService` directly aligns with the single responsibility principle mandated by the constitution.
- **Image Management**: The `UploadService` will continue to strictly use Cloudinary as defined in the constitution.
- **Incremental Development**: Tests will be added controller by controller, ensuring stability at each step.
- **Stability**: No dependencies or tech stack versions will be upgraded. The existing Vitest setup is reused.

## Project Structure

### Documentation (this feature)

```text
specs/008-backend-test-coverage/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (No changes)
├── quickstart.md        # Phase 1 output
└── tasks.md             # To be created
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── admin.controller.ts
│   │   ├── user.controller.ts
│   │   └── ...
│   └── services/
│       ├── upload.service.ts (NEW)
│       ├── auth.service.ts
│       └── ...
└── tests/
    ├── integration/
    │   ├── user.test.ts (NEW)
    │   ├── checkout.test.ts (UPDATE)
    │   └── admin.test.ts (UPDATE)
    └── unit/
        ├── auth.service.test.ts (NEW)
        └── upload.service.test.ts (NEW)
```

**Structure Decision**: Using the existing Backend REST API structure, introducing new test files and one new service `upload.service.ts`.

## Complexity Tracking

*No violations to justify.*
