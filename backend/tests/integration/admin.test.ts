import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';
import { prisma } from '../setup.js';
import jwt from 'jsonwebtoken';

describe('Admin Integration', () => {
  let adminToken: string;
  let clientToken: string;

  beforeAll(async () => {
    // Clear data
    await prisma.siteSettings.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin_dashboard@test.com',
        password: 'hashedpassword',
        role: 'ADMIN'
      }
    });

    // Create client user
    const client = await prisma.user.create({
      data: {
        name: 'Client User',
        email: 'client@test.com',
        password: 'hashedpassword',
        role: 'CLIENT'
      }
    });

    // Generate tokens
    adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
    clientToken = jwt.sign({ id: client.id, role: client.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.siteSettings.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Admin Dashboard', () => {
    it('should allow admin to get dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('activeUsers');
    });

    it('should block non-admin from getting dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Site Settings', () => {
    it('should allow admin to update site settings', async () => {
      const response = await request(app)
        .put('/api/admin/settings/hero')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: 'Welcome to TechSpec Ecommerce',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.content).toBe('Welcome to TechSpec Ecommerce');
    });

    it('should allow public to get site settings', async () => {
      const response = await request(app)
        .get('/api/admin/settings/hero');

      expect(response.status).toBe(200);
      expect(response.body.data.content).toBe('Welcome to TechSpec Ecommerce');
    });
  });
});
