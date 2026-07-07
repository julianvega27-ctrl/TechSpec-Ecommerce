import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../src/utils/prisma.js';
import { ProductService } from '../../src/services/product.service.js';
import { v2 as cloudinary } from 'cloudinary';

vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('cloudinary', () => {
  return {
    v2: {
      uploader: {
        destroy: vi.fn(),
      },
    },
  };
});

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return paginated active products', async () => {
      const mockProducts = [{ id: '1', name: 'Product 1' }];
      vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
      vi.mocked(prisma.product.count).mockResolvedValue(1);

      const result = await ProductService.getProducts({ page: 1, limit: 10 });

      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { isActive: true },
        skip: 0,
        take: 10,
      }));
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { id: '1', name: 'Product 1' };
      vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct as any);

      const result = await ProductService.getProductById('1');

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' }
      }));
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mockProduct = { id: '1', name: 'New Product' };
      vi.mocked(prisma.product.create).mockResolvedValue(mockProduct as any);

      const result = await ProductService.createProduct({ name: 'New Product' });

      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({ data: { name: 'New Product' } });
    });
  });

  describe('updateProduct', () => {
    it('should update a product and not delete image if imagePublicId is unchanged or not provided', async () => {
      const mockProduct = { id: '1', name: 'Updated Product' };
      vi.mocked(prisma.product.update).mockResolvedValue(mockProduct as any);

      const result = await ProductService.updateProduct('1', { name: 'Updated Product' });

      expect(result).toEqual(mockProduct);
      expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
      expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { name: 'Updated Product' } });
    });

    it('should delete old image from cloudinary if imagePublicId is changed', async () => {
      const mockExisting = { id: '1', imagePublicId: 'old_id' };
      const mockUpdated = { id: '1', imagePublicId: 'new_id' };
      vi.mocked(prisma.product.findUnique).mockResolvedValue(mockExisting as any);
      vi.mocked(prisma.product.update).mockResolvedValue(mockUpdated as any);
      vi.mocked(cloudinary.uploader.destroy).mockResolvedValue({} as any);

      const result = await ProductService.updateProduct('1', { imagePublicId: 'new_id' });

      expect(result).toEqual(mockUpdated);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('old_id');
      expect(prisma.product.update).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and its image from cloudinary', async () => {
      const mockExisting = { id: '1', imagePublicId: 'img_id' };
      vi.mocked(prisma.product.findUnique).mockResolvedValue(mockExisting as any);
      vi.mocked(cloudinary.uploader.destroy).mockResolvedValue({} as any);
      vi.mocked(prisma.product.delete).mockResolvedValue(mockExisting as any);

      const result = await ProductService.deleteProduct('1');

      expect(result).toEqual(mockExisting);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('img_id');
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
