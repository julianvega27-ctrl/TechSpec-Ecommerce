# Implementation Plan: Corrección de Test y Refactorización Backend

**Branch**: `[008-fix-tests-backend]` | **Date**: 2026-07-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/008-fix-tests-backend/spec.md`

## Summary

The goal is to fix the remaining integration test failures by standardizing the API response format across controllers (wrapping in `{ data: ... }`), ensuring the correct HTTP status codes are returned (e.g., 201 for Cart creation), fixing route protection (exposing public settings), and correcting test endpoints and assertions.

## Technical Context

**Language/Version**: TypeScript / Node.js
**Primary Dependencies**: Express, Vitest, Prisma 7, Testcontainers
**Storage**: PostgreSQL
**Testing**: Vitest + Supertest
**Target Platform**: Node.js backend
**Project Type**: web-service
**Performance Goals**: N/A
**Constraints**: Do not break existing unit tests. Do not refactor unrelated business logic. Keep Prisma 7.
**Scale/Scope**: Integration tests fixes for 4 test suites.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No known violations. The changes only align the implementation with the API design that the tests expect.

## Project Structure

### Documentation (this feature)

```text
specs/008-fix-tests-backend/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   └── middlewares/
└── tests/
    └── integration/
```

**Structure Decision**: The project is a standard Express backend application. Changes will be localized to the controllers and routes inside `backend/src/` and integration tests inside `backend/tests/integration/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations tracked.
