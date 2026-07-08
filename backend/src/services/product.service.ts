import prisma from '../utils/prisma.js';
import { v2 as cloudinary } from 'cloudinary';

export const ProductService = {
  async getProducts(params: { page: number; limit: number; categoryId?: string | undefined; search?: string | undefined; sort?: string | undefined }) {
    const { page, limit, categoryId, search, sort } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      isActive: true,
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getProductsAdmin(params: { page: number; limit: number; categoryId?: string | undefined; search?: string | undefined }) {
    const { page, limit, categoryId, search } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      }
    });
  },

  async createProduct(data: any) {
    return await prisma.product.create({
      data
    });
  },

  async updateProduct(id: string, data: any) {
    if (data.imagePublicId) {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (existing?.imagePublicId && existing.imagePublicId !== data.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existing.imagePublicId);
        } catch (e) {
          console.error("Failed to delete old image from Cloudinary", e);
        }
      }
    }
    return await prisma.product.update({
      where: { id },
      data
    });
  },

  async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (existing?.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      } catch (e) {
        console.error("Failed to delete image from Cloudinary", e);
      }
    }
    return await prisma.product.delete({
      where: { id }
    });
  }
};
