import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../src/utils/prisma.js';
import { AuthService } from '../../src/services/auth.service.js';
import { AppError } from '../../src/middlewares/error.js';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));
vi.mock('google-auth-library', () => {
  return {
    OAuth2Client: class {
      verifyIdToken = vi.fn();
    },
  };
});

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as any);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: '1', name: 'Test', email: 'test@test.com', role: 'CLIENT',
        password: 'hashed_password', googleId: null, isActive: true, createdAt: new Date(), updatedAt: new Date()
      });
      vi.mocked(jwt.sign).mockReturnValue('token' as any);

      const result = await AuthService.register({ name: 'Test', email: 'test@test.com', password: 'password' });

      expect(result).toHaveProperty('token', 'token');
      expect(result.user).toHaveProperty('id', '1');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw an error if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({} as any);

      await expect(AuthService.register({ name: 'Test', email: 'test@test.com', password: 'password' }))
        .rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: '1', name: 'Test', email: 'test@test.com', role: 'CLIENT', password: 'hashed_password'
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(jwt.sign).mockReturnValue('token' as any);

      const result = await AuthService.login({ email: 'test@test.com', password: 'password' });

      expect(result).toHaveProperty('token', 'token');
      expect(result.user).toHaveProperty('email', 'test@test.com');
    });

    it('should throw an error for invalid credentials', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(AuthService.login({ email: 'test@test.com', password: 'password' }))
        .rejects.toThrow(AppError);
    });
  });
});
