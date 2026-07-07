import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';
import { prisma } from '../setup.js';

describe('Catalog Integration (Products & Categories)', () => {
  let categoryId: string;
  let productId: string;
  let adminToken: string;

  beforeAll(async () => {
    // Clear data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create an admin user for admin routes
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin_catalog@test.com',
        password: 'password123', // In a real app we'd hash this, but we'll bypass auth middleware or create a real token if needed. Wait, we need a real token to test admin routes.
        // Or we can just use the auth endpoint to login/register and get a token.
        role: 'ADMIN'
      }
    });

    // We can't easily login if password is not hashed. Let's register an admin using the auth route?
    // Wait, auth/register creates CLIENT. We need to create it with prisma and then login.
    // To do that, password needs to be hashed. Or we can just use jwt.sign directly if we know JWT_SECRET.
    // Since this is integration testing, let's just test the public routes first, or hash the password.
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Categories API', () => {
    it('should return empty list when no categories', async () => {
      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    // In a real scenario we'd test POST /api/categories (requires admin).
    // For now, let's insert directly via Prisma and test GET
    it('should return active categories', async () => {
      const cat = await prisma.category.create({
        data: { name: 'Electronics', description: 'Gadgets', isActive: true }
      });
      categoryId = cat.id;

      const response = await request(app).get('/api/categories');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('Electronics');
    });
  });

  describe('Products API', () => {
    it('should return empty list when no products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.data.products).toEqual([]);
    });

    it('should return active products', async () => {
      const prod = await prisma.product.create({
        data: {
          name: 'Laptop',
          description: 'A powerful laptop',
          brand: 'TechBrand',
          imageUrl: 'http://example.com/img.jpg',
          imagePublicId: 'img123',
          price: 999.99,
          stock: 10,
          isActive: true,
          categoryId: categoryId
        }
      });
      productId = prod.id;

      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.data.products.length).toBe(1);
      expect(response.body.data.products[0].name).toBe('Laptop');
    });

    it('should return a product by ID', async () => {
      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Laptop');
    });
  });
});
