import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let pgContainer: any;

export async function setup({ provide }: any) {
  pgContainer = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .start();

  const databaseUrl = pgContainer.getConnectionUri();
  
  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma db push --accept-data-loss', { 
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit'
  });

  provide('dbUrl', databaseUrl);
}

export async function teardown() {
  if (pgContainer) {
    await pgContainer.stop();
  }
}
