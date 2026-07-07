import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import prisma from '../../src/utils/prisma.js';
import { UserService } from '../../src/services/user.service.js';
import { AppError } from '../../src/middlewares/error.js';

vi.mock('bcryptjs');
vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile if found', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@test.com', role: 'CLIENT', createdAt: new Date() };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const result = await UserService.getProfile('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(UserService.getProfile('1')).rejects.toThrow(AppError);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: '1', password: 'old_hashed_password' } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as any);
      vi.mocked(bcrypt.genSalt).mockResolvedValue('salt' as any);
      vi.mocked(bcrypt.hash).mockResolvedValue('new_hashed_password' as any);
      vi.mocked(prisma.user.update).mockResolvedValue({} as any);

      const result = await UserService.updatePassword('1', 'old_password', 'new_password');
      expect(result).toEqual({ success: true });
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should throw if current password does not match', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: '1', password: 'old_hashed_password' } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as any);

      await expect(UserService.updatePassword('1', 'old_password', 'new_password')).rejects.toThrow(AppError);
    });
  });
});
