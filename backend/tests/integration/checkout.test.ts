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
    await prisma.orderItem.deleteMany();
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
        description: 'A great book',
        brand: 'TechBrand',
        imageUrl: 'http://example.com/img.jpg',
        imagePublicId: 'img123',
        price: 15.00,
        stock: 10,
        categoryId: category.id,
        isActive: true
      }
    });
    productId = product.id;
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Cart API', () => {
    let cartItemId: string;

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({ productId: productId, quantity: 1 });
      expect(response.status).toBe(401);
    });

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
      cartItemId = response.body.data.id;
    });

    it('should get cart items', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].quantity).toBe(2);
    });

    it('should return 404 when updating non-existent cart item', async () => {
      const response = await request(app)
        .put('/api/cart/99999999-9999-9999-9999-999999999999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });

    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
    });

    it('should clear cart', async () => {
      // First add something to clear
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: productId, quantity: 1 });

      const response = await request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Cart cleared');
    });
  });

  describe('Checkout API', () => {
    beforeAll(async () => {
      // Add item to cart to ensure it is not empty for checkout tests
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: productId, quantity: 2 });
    });

    it('should create an order from cart', async () => {
      const response = await request(app)
        .post('/api/orders/checkout')
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
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should return 404 when getting non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/my-orders/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when checking out an empty cart', async () => {
      // Cart is empty from the previous checkout
      const response = await request(app)
        .post('/api/orders/checkout')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 when checking out with insufficient stock', async () => {
      // Add item to cart with quantity > stock
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          productId: productId,
          quantity: 20 // Stock is 10
        });

      const response = await request(app)
        .post('/api/orders/checkout')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});
