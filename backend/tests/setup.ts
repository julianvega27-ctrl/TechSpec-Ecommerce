import { afterAll } from 'vitest';
import prisma from '../src/utils/prisma.js';

export { prisma };

afterAll(async () => {
  if (prisma && typeof prisma.$disconnect === 'function') {
    await prisma.$disconnect();
  }
});
