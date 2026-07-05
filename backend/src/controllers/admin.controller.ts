import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { OrderStatus, Role } from '@prisma/client';

export const AdminController = {
  // --- Analytics ---
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  },

  // --- Users ---
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!Object.values(Role).includes(role)) {
         return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await AdminService.updateUserRole(id, role as Role);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // --- Orders ---
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await AdminService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!Object.values(OrderStatus).includes(status)) {
         return res.status(400).json({ message: 'Invalid status' });
      }

      const order = await AdminService.updateOrderStatus(id, status as OrderStatus);
      res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Cannot modify a delivered order') {
         return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  },

  // --- Products ---
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await AdminService.updateProduct(id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // --- Categories ---
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await AdminService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await AdminService.updateCategory(id, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
