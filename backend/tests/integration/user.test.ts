import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';
import { prisma } from '../setup.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

describe('User Controller Integration', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Clear data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'userprofile@test.com',
        password: hashedPassword,
        role: 'CLIENT'
      }
    });
    
    userId = user.id;
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret');
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  describe('GET /api/users/profile', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app).get('/api/users/profile');
      expect(response.status).toBe(401);
      // It might return success: false from controller, or error from middleware
    });

    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('userprofile@test.com');
      expect(response.body.data).not.toHaveProperty('password');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
    });
  });

  describe('PUT /api/users/password', () => {
    it('should return 400 if passwords are not provided', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'password123' }); // Missing newPassword
        
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Se requiere la contraseña actual y la nueva');
    });

    it('should update password successfully', async () => {
      const response = await request(app)
        .put('/api/users/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: 'password123', newPassword: 'newpassword456' });
        
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Contraseña actualizada exitosamente');
    });
  });
});
