import prisma from '../utils/prisma.js';
import { OrderStatus, Role } from '@prisma/client';

export class AdminService {
  // --- Analytics ---
  static async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todaysSales,
      pendingOrders,
      activeUsers,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: today,
          },
          status: {
            not: OrderStatus.CANCELED
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      prisma.order.count({
        where: {
          status: OrderStatus.PENDING
        }
      }),
      prisma.user.count({
        where: {
          role: Role.CLIENT
        }
      }),
      prisma.product.count({
        where: {
          stock: {
            lte: 10 // Threshold for low stock
          }
        }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })
    ]);

    return {
      todaysSales: todaysSales._sum.totalAmount || 0,
      pendingOrders,
      activeUsers,
      lowStockProducts,
      recentOrders
    };
  }

  // --- Users ---
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        googleId: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateUserRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
  }

  // --- Orders ---
  static async getAllOrders() {
    return prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        orderItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (order.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot modify a delivered order');
    }

    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  // --- Products ---
  static async createProduct(data: {
    name: string;
    description: string;
    brand: string;
    categoryId: string;
    price: number;
    stock: number;
    imageUrl: string;
    imagePublicId: string;
    isActive?: boolean;
  }) {
    return prisma.product.create({ data });
  }

  static async updateProduct(id: string, data: Partial<{
    name: string;
    description: string;
    brand: string;
    categoryId: string;
    price: number;
    stock: number;
    imageUrl: string;
    imagePublicId: string;
    isActive: boolean;
  }>) {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  // --- Categories ---
  static async createCategory(data: { name: string; description?: string; isActive?: boolean }) {
    return prisma.category.create({ data });
  }

  static async updateCategory(id: string, data: Partial<{ name: string; description: string; isActive: boolean }>) {
    return prisma.category.update({
      where: { id },
      data
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
