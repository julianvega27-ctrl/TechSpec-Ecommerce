import type { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import type { AuthRequest } from '../middlewares/auth.js';
import { catchAsync } from '../utils/catchAsync.js';

export class UserController {
  static getProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    // req.user is populated by the auth middleware
    const userId = req.user!.id;

    const data = await UserService.getProfile(userId);
    res.status(200).json({
      success: true,
      data
    });
  });

  static updateProfile = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const data = await UserService.updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data
    });
  });

  static updatePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Se requiere la contraseña actual y la nueva' });
    }

    await UserService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });
  });
}
