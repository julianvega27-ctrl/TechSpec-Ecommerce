import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../src/utils/prisma.js';
import { CategoryService } from '../../src/services/category.service.js';

vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    product: {
      count: vi.fn(),
    },
  },
}));

describe('CategoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCategories', () => {
    it('should return active categories ordered by name', async () => {
      const mockCategories = [{ id: '1', name: 'Cat 1' }];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

      const result = await CategoryService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('getAllCategoriesAdmin', () => {
    it('should return all categories ordered by name', async () => {
      const mockCategories = [{ id: '1', name: 'Cat 1' }];
      vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

      const result = await CategoryService.getAllCategoriesAdmin();

      expect(result).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const mockCategory = { id: '1', name: 'Cat 1' };
      vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory as any);

      const result = await CategoryService.getCategoryById('1');

      expect(result).toEqual(mockCategory);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockCategory = { id: '1', name: 'New Cat' };
      vi.mocked(prisma.category.create).mockResolvedValue(mockCategory as any);

      const result = await CategoryService.createCategory({ name: 'New Cat' });

      expect(result).toEqual(mockCategory);
      expect(prisma.category.create).toHaveBeenCalledWith({ data: { name: 'New Cat' } });
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const mockCategory = { id: '1', name: 'Updated Cat' };
      vi.mocked(prisma.category.update).mockResolvedValue(mockCategory as any);

      const result = await CategoryService.updateCategory('1', { name: 'Updated Cat' });

      expect(result).toEqual(mockCategory);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Cat' },
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category if it has no associated products', async () => {
      const mockCategory = { id: '1', name: 'Cat 1' };
      vi.mocked(prisma.product.count).mockResolvedValue(0);
      vi.mocked(prisma.category.delete).mockResolvedValue(mockCategory as any);

      const result = await CategoryService.deleteCategory('1');

      expect(result).toEqual(mockCategory);
      expect(prisma.product.count).toHaveBeenCalledWith({ where: { categoryId: '1' } });
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an error if category has associated products', async () => {
      vi.mocked(prisma.product.count).mockResolvedValue(1);

      await expect(CategoryService.deleteCategory('1')).rejects.toThrow('Cannot delete category with associated products');
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });
  });
});
