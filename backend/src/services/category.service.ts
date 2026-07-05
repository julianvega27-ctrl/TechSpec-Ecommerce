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
      where: { id },
    });
  },

  async createCategory(data: any) {
    return await prisma.category.create({
      data,
    });
  },

  async updateCategory(id: string, data: any) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  async deleteCategory(id: string) {
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new Error('Cannot delete category with associated products');
    }

    return await prisma.category.delete({
      where: { id },
    });
  },
};
