import prisma from '../utils/prisma.js';
import { v2 as cloudinary } from 'cloudinary';

export const AdminService = {
  async getSiteSettings(section: string) {
    return await prisma.siteSettings.findUnique({
      where: { section }
    });
  },

  async updateSiteSettings(section: string, data: any) {
    if (data.imagePublicId) {
      const existing = await prisma.siteSettings.findUnique({ where: { section } });
      if (existing?.imagePublicId && existing.imagePublicId !== data.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existing.imagePublicId);
        } catch (e) {
          console.error("Failed to delete old image from Cloudinary", e);
        }
      }
    }

    return await prisma.siteSettings.upsert({
      where: { section },
      update: {
        content: data.content,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
      },
      create: {
        section,
        content: data.content,
        imageUrl: data.imageUrl,
        imagePublicId: data.imagePublicId,
      }
    });
  },

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaysOrders, pendingOrders, activeUsers, lowStockProducts, recentOrders] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: today } }
      }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'CLIENT', isActive: true } }),
      prisma.product.count({ where: { stock: { lt: 10 }, isActive: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      })
    ]);

    const todaysSales = todaysOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

    return {
      todaysSales,
      pendingOrders,
      activeUsers,
      lowStockProducts,
      recentOrders
    };
  }
};
