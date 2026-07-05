import prisma from '../utils/prisma.js';

export const CategoryService = {
  async getAllCategories() {
    return await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  },

  async getCategoryById(id: string) {
    return await prisma.category.findUnique({
      where: { id, isActive: true },
    });
  },
};
