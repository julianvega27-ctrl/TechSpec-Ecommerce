import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../src/utils/prisma.js';
import { AdminService } from '../../src/services/admin.service.js';
import { v2 as cloudinary } from 'cloudinary';

vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    siteSettings: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    order: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    user: {
      count: vi.fn(),
    },
    product: {
      count: vi.fn(),
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

describe('AdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSiteSettings', () => {
    it('should return site settings for a section', async () => {
      const mockSettings = { section: 'hero', content: 'test' };
      vi.mocked(prisma.siteSettings.findUnique).mockResolvedValue(mockSettings as any);

      const result = await AdminService.getSiteSettings('hero');

      expect(result).toEqual(mockSettings);
      expect(prisma.siteSettings.findUnique).toHaveBeenCalledWith({
        where: { section: 'hero' },
      });
    });
  });

  describe('updateSiteSettings', () => {
    it('should upsert site settings and not delete image if not provided', async () => {
      const mockSettings = { section: 'hero', content: 'test' };
      vi.mocked(prisma.siteSettings.upsert).mockResolvedValue(mockSettings as any);

      const result = await AdminService.updateSiteSettings('hero', { content: 'test' });

      expect(result).toEqual(mockSettings);
      expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
      expect(prisma.siteSettings.upsert).toHaveBeenCalled();
    });

    it('should delete old image from cloudinary if imagePublicId changed', async () => {
      const mockExisting = { section: 'hero', imagePublicId: 'old_img' };
      const mockSettings = { section: 'hero', imagePublicId: 'new_img' };
      vi.mocked(prisma.siteSettings.findUnique).mockResolvedValue(mockExisting as any);
      vi.mocked(prisma.siteSettings.upsert).mockResolvedValue(mockSettings as any);
      vi.mocked(cloudinary.uploader.destroy).mockResolvedValue({} as any);

      const result = await AdminService.updateSiteSettings('hero', { imagePublicId: 'new_img' });

      expect(result).toEqual(mockSettings);
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('old_img');
    });
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      vi.mocked(prisma.order.findMany)
        .mockResolvedValueOnce([{ totalAmount: 100 }, { totalAmount: 200 }] as any) // today's orders
        .mockResolvedValueOnce([{ id: '1' }] as any); // recent orders
      
      vi.mocked(prisma.order.count).mockResolvedValue(5);
      vi.mocked(prisma.user.count).mockResolvedValue(10);
      vi.mocked(prisma.product.count).mockResolvedValue(2);

      const result = await AdminService.getDashboardStats();

      expect(result).toEqual({
        todaysSales: 300,
        pendingOrders: 5,
        activeUsers: 10,
        lowStockProducts: 2,
        recentOrders: [{ id: '1' }],
      });
      expect(prisma.order.findMany).toHaveBeenCalledTimes(2);
      expect(prisma.order.count).toHaveBeenCalled();
      expect(prisma.user.count).toHaveBeenCalled();
      expect(prisma.product.count).toHaveBeenCalled();
    });
  });
});
