import { beforeAll, afterAll } from 'vitest';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

let pgContainer: StartedPostgreSqlContainer;
export let prisma: PrismaClient;

beforeAll(async () => {
  // Start the PostgreSQL container
  pgContainer = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .start();

  // Construct database URL
  const databaseUrl = pgContainer.getConnectionUri();
  
  // Set the environment variable for Prisma
  process.env.DATABASE_URL = databaseUrl;

  // Run Prisma db push to set up the schema
  execSync('npx prisma db push --accept-data-loss', { env: { ...process.env, DATABASE_URL: databaseUrl } });

  prisma = new PrismaClient();
}, 60000);

afterAll(async () => {
  if (prisma) await prisma.$disconnect();
  if (pgContainer) await pgContainer.stop();
});
