import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export class AuthController {
  static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data
    });
  });

  static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Sesión iniciada exitosamente',
      data
    });
  });

  static googleLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { idToken } = req.body;
    const data = await AuthService.googleOAuth(idToken);
    res.status(200).json({
      success: true,
      message: 'Autenticación con Google exitosa',
      data
    });
  });

  static recoverPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const data = await AuthService.recoverPassword(email);
    res.status(200).json({
      success: true,
      message: data.message
    });
  });
}
