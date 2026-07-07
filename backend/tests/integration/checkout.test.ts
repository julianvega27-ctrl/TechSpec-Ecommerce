import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';
import { prisma } from '../setup.js';
import jwt from 'jsonwebtoken';

describe('Cart & Checkout Integration', () => {
  let userToken: string;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    // Clear data
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Create user
    const user = await prisma.user.create({
      data: {
        name: 'Cart User',
        email: 'cart@test.com',
        password: 'hashedpassword',
        role: 'CLIENT'
      }
    });
    userId = user.id;

    // Generate token
    userToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' });

    // Create Category and Product
    const category = await prisma.category.create({
      data: { name: 'Books', isActive: true }
    });

    const product = await prisma.product.create({
      data: {
        name: 'Book 1',
        price: 15.00,
        stock: 10,
        categoryId: category.id,
        isActive: true
      }
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Cart API', () => {
    it('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId,
          quantity: 2
        });

      expect(response.status).toBe(201);
      expect(response.body.data.quantity).toBe(2);
      expect(response.body.data.productId).toBe(productId);
    });

    it('should get cart items', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].quantity).toBe(2);
    });
  });

  describe('Checkout API', () => {
    it('should create an order from cart', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.userId).toBe(userId);
      
      // Cart should be empty after checkout
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(cartResponse.body.data.length).toBe(0);
    });

    it('should get user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  });
});
