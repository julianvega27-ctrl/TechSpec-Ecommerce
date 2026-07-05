import prisma from '../utils/prisma.js';

export const ProductService = {
  async getProducts(params: { page: number; limit: number; categoryId?: string | undefined; search?: string | undefined }) {
    const { page, limit, categoryId, search } = params;
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
      where: { id, isActive: true },
      include: {
        category: true,
      }
    });
  },
};
