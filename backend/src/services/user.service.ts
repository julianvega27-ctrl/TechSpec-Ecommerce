import prisma from '../utils/prisma.js';
import { AppError } from '../middlewares/error.js';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return user;
  }

  static async updateProfile(userId: string, data: any) {
    const { name, phone } = data; // Phone is mocked/omitted in schema for now, but name can be updated

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return updatedUser;
  }
}
