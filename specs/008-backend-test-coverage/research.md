# Phase 0: Research & Design Decisions

## Decision 1: Upload Logic Abstraction
- **Decision**: Create an `UploadService` that accepts an array of Multer files (`Express.Multer.File[]`) and returns the Cloudinary URLs and Public IDs.
- **Rationale**: The `AdminController` currently directly calls `cloudinary.uploader.upload` using a buffer-to-base64 conversion. This makes unit testing the controller impossible without a real Cloudinary connection or complex module mocking. By extracting this to a service, the controller can be tested by mocking `UploadService.uploadImages`, and the service itself can be tested in isolation.
- **Alternatives considered**: Mocking the `cloudinary` module directly in the controller tests. Rejected because it violates the Single Responsibility Principle and keeps the controller bloated.

## Decision 2: Mocking Strategy for Auth and External Services
- **Decision**: Use `vitest.mock` to mock `AuthService` dependencies like the Google OAuth client library (if any) and `UploadService` in controller tests. For integration tests, we will use the existing Testcontainers PostgreSQL database to avoid mocking Prisma.
- **Rationale**: Integration tests should test the actual database interactions to catch schema and query errors (like `P2002` uniqueness errors). External HTTP services (Google, Cloudinary) must be mocked to ensure tests run fast and without network dependencies.
- **Alternatives considered**: Mocking Prisma via `vitest-mock-extended`. Rejected for integration tests because it doesn't test the actual database constraints, which is a key requirement of this feature.

## Decision 3: Error Simulation in Integration Tests
- **Decision**: Induce errors by sending invalid payloads (400 Bad Request), omitting auth tokens (401 Unauthorized), or manipulating the database state before the request (e.g., emptying the cart to trigger 400 Empty Cart).
- **Rationale**: This is the most authentic way to test the error handling middleware and the controller's logic branches without altering the application code for testability.
