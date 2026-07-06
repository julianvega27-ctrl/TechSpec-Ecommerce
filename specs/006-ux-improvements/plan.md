# Implementation Plan: UX Improvements

**Branch**: `[feature/006-ux-improvements]` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-ux-improvements/spec.md`

## Summary

This feature resolves 4 distinct UI/UX issues. We will conditionally hide the role field in `Profile.tsx`, extract the sidebar navigation into a unified layout for `Profile.tsx`, `OrderHistory.tsx`, and a new `Security.tsx` page (with a new backend password change endpoint), add a generated placeholder image to `Home.tsx`, and create three static pages for `Terms`, `Privacy`, and `Support`.

## Technical Context

**Language/Version**: TypeScript (Frontend React 18, Backend Express)
**Primary Dependencies**: React Router, Axios, Bcrypt
**Storage**: Prisma (PostgreSQL) - using existing User model
**Testing**: N/A (UI visual checks)
**Target Platform**: Web Browser
**Project Type**: Web Application
**Performance Goals**: N/A (Standard web performance)
**Constraints**: Must reuse existing layout and aesthetic tokens
**Scale/Scope**: 4 frontend pages/components, 1 backend endpoint

## Constitution Check

*GATE: Passed. We are reusing the existing architecture and standard UI components.*

## Project Structure

### Documentation (this feature)

```text
specs/006-ux-improvements/
├── plan.md              # This file
├── research.md          # Technical decisions
└── quickstart.md        # Commands for developers
```

### Source Code

```text
backend/
└── src/
    ├── controllers/
    │   └── user.controller.ts  # Add updatePassword method
    └── routes/
        └── user.routes.ts      # Add PUT /password route

frontend/
└── src/
    ├── App.tsx                 # Add routes for Security, Terms, Privacy, Support
    ├── components/
    │   └── Footer.tsx          # Update links
    └── pages/
        ├── Profile.tsx         # Update sidebar and hide role for clients
        ├── OrderHistory.tsx    # Update sidebar layout
        ├── Security.tsx        # NEW: Password change form
        ├── Terms.tsx           # NEW: Static page
        ├── Privacy.tsx         # NEW: Static page
        ├── Support.tsx         # NEW: Static page
        └── Home.tsx            # Replace placeholder div with img
```

**Structure Decision**: The frontend pages will follow the existing `pages/` directory layout. The new backend endpoint fits perfectly into `user.controller.ts`.
