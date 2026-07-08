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
  class MockOAuth2Client {}
  MockOAuth2Client.prototype.verifyIdToken = vi.fn();
  return {
    OAuth2Client: MockOAuth2Client,
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

  describe('googleOAuth', () => {
    it('should throw AppError if verifyIdToken fails', async () => {
      // Mock verifyIdToken for the google client
      // The module level instance requires us to mock the prototype or we can just mock it via google-auth-library
      const { OAuth2Client } = await import('google-auth-library');
      vi.mocked(OAuth2Client.prototype.verifyIdToken).mockRejectedValueOnce(new Error('Invalid token'));

      await expect(AuthService.googleOAuth('bad_token')).rejects.toThrow(AppError);
      await expect(AuthService.googleOAuth('bad_token')).rejects.toThrow('Fallo en la autenticación con Google');
    });

    it('should create new user if user does not exist', async () => {
      const { OAuth2Client } = await import('google-auth-library');
      const mockTicket = {
        getPayload: () => ({ sub: 'google123', email: 'new@test.com', name: 'New User' })
      };
      
      vi.mocked(OAuth2Client.prototype.verifyIdToken).mockResolvedValueOnce(mockTicket as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.user.create).mockResolvedValueOnce({ id: 'uuid-1', role: 'CLIENT', name: 'New User', email: 'new@test.com' } as any);
      vi.mocked(jwt.sign).mockReturnValue('token' as any);

      const result = await AuthService.googleOAuth('valid_token');

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'new@test.com', name: 'New User', googleId: 'google123' }
      });
      expect(result.token).toBe('token');
      expect(result.user.email).toBe('new@test.com');
    });

    it('should link google account if email exists but no googleId', async () => {
      const { OAuth2Client } = await import('google-auth-library');
      const mockTicket = {
        getPayload: () => ({ sub: 'google123', email: 'exist@test.com', name: 'Exist User' })
      };
      
      vi.mocked(OAuth2Client.prototype.verifyIdToken).mockResolvedValueOnce(mockTicket as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 'uuid-2', role: 'CLIENT', email: 'exist@test.com', googleId: null } as any);
      vi.mocked(prisma.user.update).mockResolvedValueOnce({ id: 'uuid-2', role: 'CLIENT', email: 'exist@test.com', googleId: 'google123' } as any);
      vi.mocked(jwt.sign).mockReturnValue('token' as any);

      const result = await AuthService.googleOAuth('valid_token');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'exist@test.com' },
        data: { googleId: 'google123' }
      });
      expect(result.token).toBe('token');
    });
  });

  describe('recoverPassword', () => {
    it('should return generic message if user does not exist', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
      const result = await AuthService.recoverPassword('notfound@test.com');
      expect(result.message).toBe('Si el correo existe, se enviarán instrucciones.');
    });

    it('should return generic message if user exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 'uuid' } as any);
      const result = await AuthService.recoverPassword('found@test.com');
      expect(result.message).toBe('Si el correo existe, se enviarán instrucciones.');
    });
  });
});
