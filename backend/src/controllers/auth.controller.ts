import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Sesión iniciada exitosamente',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken } = req.body;
      const data = await AuthService.googleOAuth(idToken);
      res.status(200).json({
        success: true,
        message: 'Autenticación con Google exitosa',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async recoverPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const data = await AuthService.recoverPassword(email);
      res.status(200).json({
        success: true,
        message: data.message
      });
    } catch (error) {
      next(error);
    }
  }
}
