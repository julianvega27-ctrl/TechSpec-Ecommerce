import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../utils/prisma.js';
import { AppError } from '../middlewares/error.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  static async register(data: any) {
    const { name, email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('El correo electrónico ya está registrado', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user.id, user.role);

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
  }

  static async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = this.generateToken(user.id, user.role);

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
  }

  static async googleOAuth(idToken: string) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new AppError('Token de Google inválido', 401);
      }

      const { sub: googleId, email, name } = payload;

      if (!email || !name) {
        throw new AppError('Faltan datos en la cuenta de Google', 400);
      }

      let user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        if (!user.googleId) {
          // Link Google ID if email exists
          user = await prisma.user.update({
            where: { email },
            data: { googleId },
          });
        }
      } else {
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
          },
        });
      }

      const token = this.generateToken(user.id, user.role);
      return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
    } catch (error) {
      throw new AppError('Fallo en la autenticación con Google', 401);
    }
  }

  static async recoverPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if not found to prevent email enumeration
      return { message: 'Si el correo existe, se enviarán instrucciones.' };
    }

    // In a real app, generate a recovery token and send email
    // For this MVP we just acknowledge the request.
    return { message: 'Si el correo existe, se enviarán instrucciones.' };
  }

  private static generateToken(id: string, role: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined');
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}
