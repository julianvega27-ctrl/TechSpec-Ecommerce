# Research: TechSpec Ecommerce Platform

## Technology Choices & Best Practices

### Node.js + Express.js + TypeScript
- **Decision**: Use a structured modular controller-service-router pattern.
- **Rationale**: The constitution strictly mandates a clear separation of concerns (Routes, Controllers, Services, Prisma access).
- **Alternatives**: NestJS (Rejected due to "simplicity" mandate and explicit requirement for Express).

### React + Vite + TypeScript
- **Decision**: Use Vite template for React-TS, standard folder structure (components, pages, hooks, services).
- **Rationale**: Mandated by constitution.
- **Alternatives**: Next.js (Rejected because constitution specifically mentions React + Vite for frontend).

### Database: PostgreSQL + Prisma ORM
- **Decision**: Standard Prisma schema with migration workflow.
- **Rationale**: Required by constitution.

### Testing Framework
- **Decision**: Vitest for frontend, Jest/Supertest for backend.
- **Rationale**: Standard tools matching the React/Vite ecosystem and Node ecosystem respectively.
- **Alternatives**: Mocha/Chai (Rejected as Jest/Vitest are more modern and integrated).
