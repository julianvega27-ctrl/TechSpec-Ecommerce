# Quickstart: Testing & QA

## Prerequisites
- **Docker**: Must be installed and running on the host machine to allow Testcontainers to spin up the PostgreSQL database during backend integration tests.
- **Node.js**: v18+ 

## Setup
1. Install testing dependencies in both `frontend` and `backend`:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Running Backend Tests
```bash
cd backend
npm run test
```
*Note: The test suite will automatically pull the PostgreSQL Docker image, run migrations, execute tests, and tear down the container.*

## Running Frontend Tests
```bash
cd frontend
npm run test
```

## Coverage Reports
To generate coverage reports (Target: 90%):
```bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```
