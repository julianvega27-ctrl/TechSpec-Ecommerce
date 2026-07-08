import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';
import { prisma } from '../setup.js';
import jwt from 'jsonwebtoken';

vi.mock('../../src/services/upload.service.js', () => ({
  UploadService: {
    uploadImages: vi.fn().mockResolvedValue([{ url: 'http://example.com/mock.jpg', publicId: 'mock_123' }])
  }
}));

describe('Admin Integration', () => {
  let adminToken: string;
  let clientToken: string;

  beforeAll(async () => {
    // Clear data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
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
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
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
  describe('User Management', () => {
    it('should allow admin to get all users', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2); // Admin and Client
    });

    it('should allow admin to update user role', async () => {
      // Find client user to update
      const usersResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      const clientUser = usersResponse.body.find((u: any) => u.email === 'client@test.com');
      
      const response = await request(app)
        .put(`/api/admin/users/${clientUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'ADMIN' });

      expect(response.status).toBe(200);
      expect(response.body.role).toBe('ADMIN');

      // Revert role
      await request(app)
        .put(`/api/admin/users/${clientUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'CLIENT' });
    });
  });

  describe('Category Management', () => {
    let createdCategoryId: string;

    it('should allow admin to create a category', async () => {
      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Electrónicos Avanzados Test',
          description: 'Nueva categoría'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Electrónicos Avanzados Test');
      createdCategoryId = response.body.id;
    });

    it('should allow admin to update a category', async () => {
      const response = await request(app)
        .put(`/api/admin/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Electrónicos Modificados'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Electrónicos Modificados');
    });

    it('should prevent deleting a category with products', async () => {
      // Create product in category
      const productResponse = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        // mock image upload by sending something that bypasses multer if possible, 
        // wait, creating a product requires multer file upload. It might be complex in integration test without attaching a file.
        // Let's create it directly via prisma for the sake of this test
        // wait, we can just use prisma directly
        .send({}); // We won't use this, just use prisma

      const newProduct = await prisma.product.create({
        data: {
          name: 'Test Product for Category',
          description: 'desc',
          price: 10,
          stock: 5,
          imageUrl: 'url',
          brand: 'Test Brand',
          imagePublicId: 'test-public-id',
          categoryId: createdCategoryId
        }
      });

      const response = await request(app)
        .delete(`/api/admin/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Prisma throws P2003 when deleting category with products (foreign key constraint)
      // wait, our controller doesn't handle P2003 explicitly, it returns 400 with error message.
      expect(response.status).toBe(400);

      // Cleanup
      await prisma.product.delete({ where: { id: newProduct.id } });
    });

    it('should allow admin to delete an empty category', async () => {
      const response = await request(app)
        .delete(`/api/admin/categories/${createdCategoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });
  });

  describe('Product Management', () => {
    let testCategoryId: string;
    let createdProductId: string;

    beforeAll(async () => {
      const cat = await prisma.category.create({ data: { name: 'TestCatProduct', isActive: true } });
      testCategoryId = cat.id;
    });

    afterAll(async () => {
      if (createdProductId) {
        await prisma.product.delete({ where: { id: createdProductId } }).catch(() => {});
      }
      await prisma.category.delete({ where: { id: testCategoryId } }).catch(() => {});
    });

    it('should return 400 if product image is not provided during creation', async () => {
      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Product Without Image')
        .field('description', 'desc')
        .field('price', '150')
        .field('stock', '10')
        .field('brand', 'TestBrand')
        .field('categoryId', testCategoryId);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should create product successfully when image is provided', async () => {
      const response = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Valid Product')
        .field('description', 'Valid description')
        .field('price', '99.99')
        .field('stock', '50')
        .field('brand', 'BrandTest')
        .field('categoryId', testCategoryId)
        .attach('images', Buffer.from('test image content'), 'test.png');
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Valid Product');
      createdProductId = response.body.id;
    });
    it('should update an existing product successfully', async () => {
      const response = await request(app)
        .put(`/api/admin/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Producto Modificado')
        .field('price', '199.99')
        .field('isActive', 'false')
        .field('specifications', JSON.stringify({ color: 'red' }));
        
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Producto Modificado');
      expect(response.body.price).toBe('199.99'); // Decimal is serialized as string
      expect(response.body.isActive).toBe(false);
    });

    it('should delete a product successfully', async () => {
      const response = await request(app)
        .delete(`/api/admin/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);
        
      expect(response.status).toBe(204);
      createdProductId = ''; // prevent afterAll from failing
    });
  });

  describe('Order Management', () => {
    let orderId: string;
    let orderUserId: string;

    beforeAll(async () => {
      const user = await prisma.user.create({
        data: { name: 'OrderUser', email: 'order@test.com', password: 'pwd', role: 'CLIENT' }
      });
      orderUserId = user.id;

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount: 100,
          status: 'PENDING'
        }
      });
      orderId = order.id;
    });

    afterAll(async () => {
      await prisma.order.deleteMany({ where: { userId: orderUserId } });
      await prisma.user.delete({ where: { id: orderUserId } });
    });

    it('should update order status', async () => {
      const response = await request(app)
        .put(`/api/admin/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'SHIPPED' });
        
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('SHIPPED');
    });
  });
});
