import prisma from '../utils/prisma.js';
import { AppError } from '../middlewares/error.js';
import bcrypt from 'bcryptjs';

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

  static async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    
    if (!user.password) {
      throw new AppError('El usuario no tiene una contraseña configurada', 400);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('La contraseña actual es incorrecta', 400);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    return { success: true };
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });
  }

  static async updateUser(id: string, data: any) {
    // If role is being changed to CLIENT or isActive to false, check if this is the last active ADMIN
    if (data.role === 'CLIENT' || data.isActive === false) {
      const userToUpdate = await prisma.user.findUnique({ where: { id } });
      
      if (userToUpdate && userToUpdate.role === 'ADMIN' && userToUpdate.isActive === true) {
        // Count active admins
        const activeAdminsCount = await prisma.user.count({
          where: {
            role: 'ADMIN',
            isActive: true,
          }
        });
        
        // If this is the only one, throw an error
        if (activeAdminsCount <= 1) {
          throw new AppError('Cannot demote or deactivate the last active administrator.', 400);
        }
      }
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      }
    });
  }
}
