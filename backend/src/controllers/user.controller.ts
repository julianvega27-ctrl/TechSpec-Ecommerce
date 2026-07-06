import type { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import type { AuthRequest } from '../middlewares/auth.js';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // req.user is populated by the auth middleware
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }

      const data = await UserService.getProfile(userId);
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }

      const data = await UserService.updateProfile(userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }
      
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Se requiere la contraseña actual y la nueva' });
      }

      await UserService.updatePassword(userId, currentPassword, newPassword);
      res.status(200).json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}
