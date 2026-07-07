import { inject } from 'vitest';

// @ts-ignore
const dbUrl = inject('dbUrl');
if (dbUrl) {
  process.env.DATABASE_URL = dbUrl as string;
}
